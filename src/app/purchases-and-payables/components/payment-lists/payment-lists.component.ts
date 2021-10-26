import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../../../core/services/loading.service";
import { PurchaseService } from "../../../core/services/purchase.service";
import { SupplierService } from "../../../core/services/supplier.service";
import swal from "sweetalert2";

@Component({
  selector: "app-payment-lists",
  templateUrl: "./payment-lists.component.html",
  styleUrls: ["./payment-lists.component.css"]
})
export class PaymentListsComponent implements OnInit {
  paymentApprovals: any[] = [];
  activeIndex: any = 0;
  viewHeight: string = "600px";
  tabSelected: boolean;
  paymentDetails: any = {};
  displayApproval: boolean;
  showDialog: any;
  staffId: any;
  staffs: any;
  approvalDetails: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private purchaseService: PurchaseService,
    private supplierService: SupplierService
  ) {}

  ngOnInit() {
    this.getPaymentApprovals();
  }
  dismissDialog() {
    this.showDialog = false;
  }
  getPaymentApprovals() {
    this.loadingService.show();
    return this.purchaseService.getPaymentApprovals().subscribe(
      data => {
        this.loadingService.hide();
        this.paymentApprovals = data.paymentApprovals;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  viewApprovalDetails(x) {
    let id = x.invoiceId;
    let token = encodeURIComponent(x.workflowtoken);
    this.paymentDetails = x;
    this.tabSelected = true;
    this.activeIndex = 1;
    this.getApprovalDetails(id, token);
  }

  submitApproval(paymentDetails: any) {
    let body = {
      targetId: paymentDetails.invoiceId,
      approvalStatus: parseInt(paymentDetails.approvalStatusId),
      approvalComment: paymentDetails.comment,
      referredStaffId: this.staffId
    };
    swal
      .fire({
        title: "Are you sure you want to approve this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          this.loadingService.show();
          return this.purchaseService.sendPaymentApproval(body).subscribe(
            res => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire(`GOS FINANCIAL`, message, "success").then(() => {
                  setTimeout(() => {
                    this.getPaymentApprovals();
                    this.activeIndex = 0;
                  }, 1000);
                });
              } else {
                // this.loadingService.hide()
                swal.fire(`GOS FINANCIAL`, message, "error");
              }
              this.loadingService.hide();
            },
            err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire(`GOS FINANCIAL`, message, "error");
            }
          );
        }
      });
  }
  getApprovalDetails(id: number, token: string) {
    this.loadingService.show();
    return this.supplierService.getApprovalDetails(id, token).subscribe(
      data => {
        this.loadingService.hide();
        this.approvalDetails = data.aprovalDetails;
        this.staffs = data.previousStaff;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getValue(value: string) {
    if (value == "5") {
      this.showDialog = true;
    } else {
      this.staffId = 0;
    }
  }

  tabChange(event: any) {
    this.activeIndex = event.index;
  }
}
