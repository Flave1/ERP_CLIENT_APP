import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { LoanReviewOperationsService } from "src/app/core/services/loan-review-operations.service";

@Component({
    selector: "app-loanoperations-approval",
    templateUrl: "./loanoperations-approval.component.html"
})
export class LoanOperationsApprovalComponent implements OnInit {
    approvalStatus: any[];
    selectedApprovalData: any = {};
    loanoperationsAwaitingApproval: any[];
    loanId: number;
    activeIndex: number = 0;
    loanNotSelected: boolean = true;
    viewHeight: any = '600px';
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private loanoperationsService: LoanReviewOperationsService
    ) {}

    ngOnInit() {
        this.getLoanOperationAwaitingApproval();
    }
    viewApprovalDetails(event) {
        this.loanNotSelected = false;
        this.selectedApprovalData = event.data;
        this.loanId = this.selectedApprovalData.loanId;
        this.activeIndex = 1;
    }


    getLoanOperationAwaitingApproval() {
        this.loadingService.show();
        this.loanoperationsService.getLoanOperationAwaitingApproval().subscribe(data => {
            this.loadingService.hide();
            this.loanoperationsAwaitingApproval = data["result"];

        });
    }
    submitApproval(formObj) {
        let body = {
            targetId: formObj.loanReviewOperationsId,
            operationId:formObj.operationTypeId,
            approvalStatusId: formObj.approvalStatusId,
            comment: formObj.comment
        };
        const __this = this;
        swal.fire({
            title: "Are you sure you want to approve this record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.loanoperationsService.goForApproval(body).subscribe(data => {
                    __this.loadingService.hide();
                    if (data["success"] == true) {
                        swal.fire("GOS FINANCIAL", data["message"], "success");
                        this.activeIndex = 0;
                        __this.getLoanOperationAwaitingApproval();
                    } else {
                        swal.fire("GOS FINANCIAL", data["message"], "error");
                    }
                });
            } else {
                swal.fire("GOS FINANCIAL", "Cancelled", "error");
            }
        });
    }

    onTabChange(e) {
        this.activeIndex = e.index;
    }

    openNext() {
        this.activeIndex = this.activeIndex === 1 ? 0 : this.activeIndex + 1;
    }

    openPrev() {
        this.activeIndex = this.activeIndex === 0 ? 1 : this.activeIndex - 1;
    }
}
