import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { LoadingService } from "../../services/loading.service";
import { CustomerService } from "./../../services/customer.service";
import {SupplierService} from "../../services/supplier.service";

@Component({
    selector: "app-customer-approval",
    templateUrl: "./customer-approval.component.html",
    styleUrls: ["./customer-approval.component.css"]
})
export class CustomerApprovalComponent implements OnInit {
    approvalStatus: any[];
    selectedApprovalData: any = {};
    customerAwaitingApproval: any[];
    displayApproval: boolean = false;
    viewHeight: any = '600px';
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private customerService: CustomerService,
        private supplierService: SupplierService
    ) {}

    ngOnInit() {
        this.getCustomerAwaitingApproval();
    }
    viewApprovalDetails(row) {
        this.selectedApprovalData = row;
        this.displayApproval = true;
    }
    getCustomerAwaitingApproval() {
        this.loadingService.show();
        this.supplierService.getCustomerAwaitingApproval().subscribe(data => {
            this.loadingService.hide();
            this.customerAwaitingApproval = data["result"];
        }, err => {
          this.loadingService.hide()
        });
    }
    submitApproval(formObj) {
        let body = {
            targetId: formObj.customerId,
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

                __this.customerService.goForApproval(body).subscribe(data => {
                    __this.loadingService.hide();
                    if (data["success"] == true) {
                        swal.fire("GOS FINANCIAL", data["message"], "success");
                        __this.displayApproval = false;
                        __this.getCustomerAwaitingApproval();
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
