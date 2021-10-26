import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { BranchService } from "src/app/core/services/branch.service";
import { CompanyService } from "src/app/core/services/company.service";

@Component({
    selector: "app-branch",
    templateUrl: "./branch.component.html"
})
export class BranchComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add Branch Information";
    companyList: any[];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private branchService: BranchService,
        private companyService: CompanyService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            branchId: [0],
            branchCode: ["", Validators.required],
            branchName: ["", Validators.required],
            address: [""],
            companyId: ["",Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let branchId = params["editbranch"];
            if (branchId != null || branchId != undefined) {
                this.editBranch(branchId);
            }
        });
        this. getAllCompany();
    }


    getAllCompany() {
        this.loadingService.show();
        this.companyService.getAllCompany().subscribe(data => {
            this.loadingService.hide();
            this.companyList = data["result"];

        });
    }

    editBranch(branchId) {
        this.formTitle = "Edit Branch Information";
        this.loadingService.show();
        this.branchService.getBranch(branchId).subscribe(data => {
            this.loadingService.hide();
            let row = data["result"];
            this.form = this.fb.group({
                branchId: row.branchId,
                branchCode: row.branchCode,
                branchName: row.branchName,
                address: row.address,
                companyId: row.companyId
            });
        });
    }

    goBack() {
        this.router.navigate(["/setup/branch-list"]);
    }
    submitBranchInfo(formObj) {
        this.loadingService.show();
        this.branchService.updateBranch(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] == true) {
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigate(["/setup/branch-list"]);
                } else {
                    swal.fire("GOS FINANCIAL", data["message"], "error");
                }
            },
            err => {
                this.loadingService.hide();
                swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
            }
        );
    }
}
