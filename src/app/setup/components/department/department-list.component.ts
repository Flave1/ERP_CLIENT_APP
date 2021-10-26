import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { DepartmentService } from "src/app/core/services/department.service";

@Component({
    selector: "app-department-list",
    templateUrl: "./department-list.component.html"
})
export class DepartmentListComponent implements OnInit {
    departmentInformation: any[] = [];
    selecteddepartmentInformation: any[];
    constructor(
        private loadingService: LoadingService,
        private departmentService: DepartmentService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getAllDepartment();
    }

    showAddNew() {
        this.router.navigate(["/setup/department"]);
    }

    getAllDepartment() {
        this.loadingService.show();
        this.departmentService.getAllDepartment().subscribe(data => {
            this.loadingService.hide();
            this.departmentInformation = data["result"];


        });
    }
    editDepartment(row) {
        this.router.navigate(["/setup/department"], {
            queryParams: { editdepartment: row.departmentId }
        });
    }
    deleteDepartment(row) {
        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.departmentService
                    .deleteDepartment(row.departmentId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllDepartment();
                        } else {
                            swal.fire(
                                "GOS FINANCIAL",
                                "Record not deleted",
                                "error"
                            );
                        }
                    });
            } else {
                swal.fire("GOS FINANCIAL", "Cancelled", "error");
            }
        });
    }
}
