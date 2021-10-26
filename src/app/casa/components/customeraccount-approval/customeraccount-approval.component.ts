import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { CustomerAccountService } from "src/app/core/services/customeraccount.service";

@Component({
    selector: "app-customeraccount-approval",
    templateUrl: "./customeraccount-approval.component.html"
})
export class CustomerAccountApprovalComponent implements OnInit {
    approvalStatus: any[];
    selectedApprovalData: any = {};
    customeraccountAwaitingApproval: any[];
    displayApproval: boolean = false;
    viewHeight: any = '600px';
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private customeraccountService: CustomerAccountService
    ) {}

    ngOnInit() {
        this.getCustomerAccountAwaitingApproval();
    }
    viewApprovalDetails(row) {
        this.selectedApprovalData = row;
        this.displayApproval = true;
    }
    getCustomerAccountAwaitingApproval() {
        this.loadingService.show();
        this.customeraccountService.getCustomerAccountAwaitingApproval().subscribe(data => {
            this.loadingService.hide();
            this.customeraccountAwaitingApproval = data["result"];
        });
    }
    submitApproval(formObj) {
        let body = {
            targetId: formObj.casaAccountId,
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

                __this.customeraccountService.goForApproval(body).subscribe(data => {
                    __this.loadingService.hide();
                    if (data["success"] == true) {
                        swal.fire("GOS FINANCIAL", data["message"], "success");
                        __this.displayApproval = false;
                        __this.getCustomerAccountAwaitingApproval();
                    } else {
                        swal.fire("GOS FINANCIAL", data["message"], "error");
                    }
                });
            } else {
                swal.fire("GOS FINANCIAL", "Cancelled", "error");
            }
        });
    }
}
