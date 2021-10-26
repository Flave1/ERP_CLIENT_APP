import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { ApprovalLevelService } from "src/app/core/services/approvallevel.service";
// import { ApprovalLevelService } from "src/app/core/services/approvalLevel.service";

@Component({
    selector: "app-approvallevel-list",
    templateUrl: "./approvallevel-list.component.html"
})
export class ApprovalLevelListComponent implements OnInit {
    approvalLevelInformation: any[] = [];
    selectedapprovalLevelInformation: any[];
    constructor(
        private loadingService: LoadingService,
        private approvalLevelService: ApprovalLevelService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getAllApprovalLevel();
    }

    showAddNew() {
        this.router.navigate(["/approval/approvallevel"]);
    }

    getAllApprovalLevel() {
        this.loadingService.show();
        this.approvalLevelService.getAllApprovalLevel().subscribe(data => {
            this.loadingService.hide();
            this.approvalLevelInformation = data["result"];


        });
    }
    editApprovalLevel(row) {
        this.router.navigate(["/approval/approvallevel"], {
            queryParams: { editapprovalLevel: row.approvalLevelId }
        });
    }
    deleteApprovalLevel(row) {
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

                __this.approvalLevelService
                    .deleteApprovalLevel(row.approvalLevelId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllApprovalLevel();
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
