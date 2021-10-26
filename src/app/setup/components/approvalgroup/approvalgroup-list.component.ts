import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import {ApprovalGroupService} from '../../../core/services/approvalgroup.service';
// import { ApprovalGroupService } from "src/app/core/services/approvalGroup.service";
// import { ApprovalGroupService } from "src/app/core/services/approvalGroup.service";

@Component({
    selector: "app-approvalgroup-list",
    templateUrl: "./approvalgroup-list.component.html"
})
export class ApprovalGroupListComponent implements OnInit {
    approvalGroupInformation: any[] = [];
    selectedapprovalGroupInformation: any[];
    constructor(
        private loadingService: LoadingService,
        private approvalGroupService: ApprovalGroupService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getAllApprovalGroup();
    }

    showAddNew() {
        this.router.navigate(["/approval/approvalgroup"]);
    }

    getAllApprovalGroup() {
        this.loadingService.show();
        this.approvalGroupService.getAllApprovalGroup().subscribe(data => {
            this.loadingService.hide();
            this.approvalGroupInformation = data["result"];

        });
    }
    editApprovalGroup(row) {
        this.router.navigate(["/approval/approvalgroup"], {
            queryParams: { editapprovalGroup: row.approvalGroupId }
        });
    }
    deleteApprovalGroup(row) {
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

                __this.approvalGroupService
                    .deleteApprovalGroup(row.approvalGroupId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllApprovalGroup();
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
