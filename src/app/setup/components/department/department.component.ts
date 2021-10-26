import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DepartmentService } from "src/app/core/services/department.service";
import { BranchService } from "src/app/core/services/branch.service";

@Component({
    selector: "app-department",
    templateUrl: "./department.component.html"
})
export class DepartmentComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add Department Information";
    branchList: any[];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private departmentService: DepartmentService,
        private branchService: BranchService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            departmentId: [0],
            departmentCode: ["", Validators.required],
            departmentName: ["", Validators.required],
            branchId: ["",Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let departmentId = params["editdepartment"];
            if (departmentId != null || departmentId != undefined) {
                this.editDepartment(departmentId);
            }
        });
        this. getAllBranch();
    }


    getAllBranch() {
        this.loadingService.show();
        this.branchService.getAllBranch().subscribe(data => {
            this.loadingService.hide();
            this.branchList = data["result"];


        });
    }

    editDepartment(departmentId) {
        this.formTitle = "Edit Department Information";
        this.loadingService.show();
        this.departmentService.getDepartment(departmentId).subscribe(data => {
            this.loadingService.hide();
            let row = data["result"];

            this.form = this.fb.group({
                departmentId: row.departmentId,
                departmentCode: row.departmentCode,
                departmentName: row.departmentName,
                branchId: row.branchId
            });
        });
    }

    goBack() {
        this.router.navigate(["/setup/department-list"]);
    }
    submitDepartmentInfo(formObj) {
        this.loadingService.show();
        this.departmentService.updateDepartment(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] == true) {
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigate(["/setup/department-list"]);
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
