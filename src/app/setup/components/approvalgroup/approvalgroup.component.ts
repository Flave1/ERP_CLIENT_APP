import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
// import { ApprovalGroupService } from "src/app/core/services/approvalGroup.service";
import { CompanyService } from "src/app/core/services/company.service";
import {ApprovalGroupService} from '../../../core/services/approvalgroup.service';

@Component({
    selector: "app-approvalgroup",
    templateUrl: "./approvalgroup.component.html"
})
export class ApprovalGroupComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add ApprovalGroup Information";
    companyList: any[];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private approvalGroupService: ApprovalGroupService,
        private companyService: CompanyService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            approvalGroupId: [0],
            approvalGroupName: ["", Validators.required],
            companyId: ["",Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let approvalGroupId = params["editapprovalGroup"];
            if (approvalGroupId != null || approvalGroupId != undefined) {
                this.editApprovalGroup(approvalGroupId);
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

    editApprovalGroup(approvalGroupId) {
        this.formTitle = "Edit ApprovalGroup Information";
        this.loadingService.show();
        this.approvalGroupService.getApprovalGroup(approvalGroupId).subscribe(data => {
            this.loadingService.hide();
            let row = data["result"];
            this.form = this.fb.group({
                approvalGroupId: row.approvalGroupId,
                approvalGroupName: row.approvalGroupName,
                companyId: row.companyId
            });
        });
    }

    goBack() {
        this.router.navigate(["/approval/approvalgroup-list"]);
    }
    submitApprovalGroupInfo(formObj) {
        this.loadingService.show();
        this.approvalGroupService.updateApprovalGroup(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] == true) {
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigate(["/approval/approvalgroup-list"]);
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
