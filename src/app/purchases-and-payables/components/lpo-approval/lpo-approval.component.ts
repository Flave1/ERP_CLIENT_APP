import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../../../core/services/loading.service";
import { PurchaseService } from "../../../core/services/purchase.service";
import {SupplierService} from "../../../core/services/supplier.service";
import swal from "sweetalert2";

@Component({
  selector: "app-lpo-approval",
  templateUrl: "./lpo-approval.component.html",
  styleUrls: ["./lpo-approval.component.css"]
})
export class LpoApprovalComponent implements OnInit {
  lpoApprovals: any[] = [];
  viewHeight: string = '600px';
  displayApproval: any;
  bidDetails: any = {};
  showDialog: any;
  staffId: any;
  staffs: any;
  approvalDetails: any[] = [];
  activeIndex: number = 0;
  tabSelected: boolean;
  supplierDetails: any = {};
  paymentTerms: any[] = [];
  prnDetail: any[] = [];
  bidDetail: any[] = [];
  proposedPaymentTerms: any[] = [];
  cols: any[] = [];
  supplierAmt: number;
  approvedAmt: number;
  constructor(
    private loadingService: LoadingService,
    private purchasesService: PurchaseService,
    private supplierService: SupplierService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'lpoNumber',
        field: 'lpoNumber'
      },
      {
        header: 'requestDate',
        field: 'requestDate'
      },
      {
        header: 'amountPayable',
        field: 'amountPayable'
      },
      {
        header: 'grossAmount',
        field: 'grossAmount'
      },
      {
        header: 'description',
        field: 'description'
      }
    ]
    this.getApprovalList();
  }

  // get approval list
  getApprovalList() {
    this.loadingService.show();
    return this.purchasesService.getLpoApprovals().subscribe(
      data => {
       this.lpoApprovals = data.lpOs;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  dismissDialog() {
    this.showDialog = false
  }
  viewApprovalDetails(x) {
  // this.displayApproval = true;
    let id = x.plpoId;
    let token = encodeURIComponent(x.workflowToken);
    this.bidDetails = x;
    this.tabSelected = true;
    this.activeIndex = 1;
    this.getApprovalDetails(id, token);
    this.getSupplierDetails(x.winnerSupplierId)
    const paymentTerms = x.paymentTerms;
    this.proposedPaymentTerms = paymentTerms.filter(item => {
      return item.proposedBy === 1;
    });
    this.paymentTerms = paymentTerms.filter(item => {
      return item.proposedBy === 2;
    });
    this.prnDetail = x.requisitionNotes;
    this.bidDetail = x.bidAndTender
    this.approvedAmt = this.proposedPaymentTerms.reduce(
      (total, item) => item.amount + total,
      0
    );
    this.supplierAmt = this.paymentTerms.reduce(
      (total, item) => item.amount + total,
      0
    );
  }

  submitApproval(bidDetails: any) {
    let body = {
      targetId: bidDetails.plpoId,
      approvalStatus: parseInt(bidDetails.approvalStatusId),
      approvalComment: bidDetails.comment,
      referredStaffId: this.staffId
    };
    swal.fire({
      title: "Are you sure you want to approve this record?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!"
    }).then(result => {
      if (result.value) {
        this.loadingService.show();
        return this.purchasesService.submitLPOApproval(body).subscribe(res => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire(`GOS FINANCIAL`, message, 'success').then(() => {
              this.displayApproval = false;
              setTimeout(() => {
                this.getApprovalList()
                this.activeIndex = 0
              }, 1000)
            })
          } else {
            // this.loadingService.hide()
            swal.fire(`GOS FINANCIAL`, message, 'error')
          }
          this.loadingService.hide()
        }, err => {
          this.loadingService.hide()
          if (err.status) {
            const message = err.status.message.friendlyMessage;
            swal.fire(`GOS FINANCIAL`, message, "error");
          } else {
            const message = err.message.friendlyMessage;
            swal.fire(`GOS FINANCIAL`, message, "error");
          }
        })
      }
    })
  }

  getApprovalDetails(id: number, token: string) {
    this.loadingService.show();
    return this.supplierService.getApprovalDetails(id, token).subscribe(data => {
      this.loadingService.hide();
      this.approvalDetails = data.aprovalDetails;
      this.staffs = data.previousStaff

    }, err => {
      this.loadingService.hide()
    })
  }

  getValue(value: string) {
    if (value == '5') {
      this.showDialog = true
    } else {
      this.staffId = 0
    }
  }

  tabChange(event: any) {
    this.activeIndex = event.index;
  }
  getSupplierDetails(id: number) {
    this.supplierService.getSupplier(id).subscribe(
      data => {
        this.supplierDetails = data.suppliers[0];
      },
      err => {
      }
    );
  }
}
