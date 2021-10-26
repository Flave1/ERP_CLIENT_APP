import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { ApprovalLevelStaffService } from "src/app/core/services/approvallevelstaff.service";

// import { ApprovalLevelStaffService } from "src/app/core/services/approvalLevelStaff.service";

@Component({
    selector: "app-approvallevelstaff-list",
    templateUrl: "./approvallevelstaff-list.component.html"
})
export class ApprovalLevelStaffListComponent implements OnInit {
    approvalLevelStaffInformation: any[] = [];
    selectedapprovalLevelStaffInformation: any[];
    constructor(
        private loadingService: LoadingService,
        private approvalLevelStaffService: ApprovalLevelStaffService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getAllApprovalLevelStaff();
    }

    showAddNew() {
        this.router.navigate(["/approval/approvallevelstaff"]);
    }

    getAllApprovalLevelStaff() {
        this.loadingService.show();
        this.approvalLevelStaffService
            .getAllApprovalLevelStaff()
            .subscribe(data => {
                this.loadingService.hide();
                this.approvalLevelStaffInformation = data["result"];
            });
    }
    editApprovalLevelStaff(row) {
        this.router.navigate(["/approval/approvallevelstaff"], {
            queryParams: { editapprovalLevelStaff: row.approvalLevelStaffId }
        });
    }
    deleteApprovalLevelStaff(row) {
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

                __this.approvalLevelStaffService
                    .deleteApprovalLevelStaff(row.approvalLevelStaffId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllApprovalLevelStaff();
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
