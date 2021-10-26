import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { LoadingService } from '../../../core/services/loading.service';
import { PurchaseService } from '../../../core/services/purchase.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { CreditAppraisalService } from '../../../core/services/credit-appraisal.service';

@Component({
  selector: 'app-bid-approvals',
  templateUrl: './bid-approvals.component.html',
  styleUrls: ['./bid-approvals.component.css'],
})
export class BidApprovalsComponent implements OnInit {
  canEditPrivilege: boolean;
  editingMode: Array<[]> = [];
  displayApproval: boolean;
  bidApprovals: any[] = [];
  viewHeight: string = '600px';
  bidDetails: any = {};
  staffs: any[] = [];
  showDialog: boolean;
  staffId: number;
  approvalDetails: any[] = [];
  activeIndex: number = 0;
  tabSelected: boolean;
  paymentTerms: any[] = [];
  prnDetail: any[] = [];
  supplierDetails: any = {};
  proposedPaymentTerms: any[] = [];
  cols: any[] = [];
  proposedAmt: number;
  totalAmount: number;
  constructor(
    private loadingService: LoadingService,
    private purchaseService: PurchaseService,
    private supplierService: SupplierService,
    private creditAppraisalService: CreditAppraisalService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'supplierName',
        field: 'supplierName',
      },
      {
        header: 'lpOnumber',
        field: 'lpOnumber',
      },
      {
        header: 'proposedAmount',
        field: 'proposedAmount',
      },
      {
        header: 'amountApproved',
        field: 'amountApproved',
      },
      {
        header: 'requestDate',
        field: 'requestDate',
      },
    ];
    this.getPrnApprovals();
    this.getUserPrivilege(31);
  }

  getPrnApprovals() {
    this.loadingService.show();
    return this.purchaseService.getBidsAwaitingApprovals().subscribe(
      (data) => {
        if (data.bidAndTenders != null) {
          this.bidApprovals = data.bidAndTenders;
        } else {
          this.bidApprovals = [];
        }
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  viewApprovalDetails(data) {
    let id = data.bidAndTenderId;
    let token = encodeURIComponent(data.workflowToken);
    this.bidDetails = data;
    this.tabSelected = true;
    this.activeIndex = 1;
    // this.paymentTerms = data.paymentTerms;
    this.proposedAmt = this.bidDetails.proposedAmount;
    this.totalAmount = this.bidDetails.total;
    const paymentTerms = this.bidDetails.paymentTerms;
    this.proposedPaymentTerms = paymentTerms.filter((item) => {
      return item.proposedBy === 1;
    });
    this.paymentTerms = paymentTerms.filter((item) => {
      return item.proposedBy === 2;
    });
    this.getApprovalDetails(id, token);
    this.getSupplierDetails(data.supplierId);
    this.prnDetail = data.requisitionNotes;
  }
  getApprovalDetails(id: number, token: string) {
    this.loadingService.show();
    return this.supplierService.getApprovalDetails(id, token).subscribe(
      (data) => {
        this.loadingService.hide();
        this.approvalDetails = data.aprovalDetails;
        this.staffs = data.previousStaff;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getValue(value: string) {
    if (value == '5') {
      this.showDialog = true;
    } else {
      this.staffId = 0;
    }
  }
  dismissDialog() {
    this.showDialog = false;
  }
  submitApproval(bidDetails: any) {
    let body = {
      targetId: bidDetails.bidAndTenderId,
      approvalStatus: parseInt(bidDetails.approvalStatusId),
      approvalComment: bidDetails.approvalComment,
      referredStaffId: +this.staffId,
    };
    swal
      .fire({
        title: 'Are you sure you want to approve this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          this.loadingService.show();
          return this.purchaseService.sendBidApproval(body).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire(`GOS FINANCIAL`, message, 'success').then(() => {
                  setTimeout(() => {
                    this.getPrnApprovals();
                    this.activeIndex = 0;
                  }, 1000);
                });
              } else {
                // this.loadingService.hide()
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
              this.loadingService.hide();
            },
            (err) => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            }
          );
        }
      });
  }
  tabChange(event: any) {
    this.activeIndex = event.index;
  }
  getSupplierDetails(id: number) {
    this.supplierService.getSupplier(id).subscribe(
      (data) => {
        this.supplierDetails = data.suppliers[0];
      },
      (err) => {}
    );
  }
  getUserPrivilege(operationId) {
    this.creditAppraisalService
      .getUserPriviledge(operationId)
      .subscribe((data) => {
        this.canEditPrivilege = data;
      });
  }
  onRowEditInit(item, index) {
    // this.editingMode = true;
    this.editingMode.push(item.paymentTermId);
  }

  onRowEditSave(row) {
    // const subTotal = this.calculateSubTotal(row.quantity, row.unitPrice);
    // this.prnDetail.map((item) => {
    //   if (item.prnDetailsId === row.prnDetailsId) {
    //     return (item.subTotal = subTotal);
    //   }
    // });
    console.log(row);
    this.onRowEditCancel(row.prnDetailsId);
  }

  onRowEditCancel(paymentTermId) {
    const index = this.editingMode.indexOf(paymentTermId);
    if (index > -1) {
      this.editingMode.splice(index, 1);
    }
  }

  calculateAmount(percent, item) {
    const amount = (+percent / 100) * this.totalAmount;
    this.proposedPaymentTerms.map((payment) => {
      if (payment.paymentTermId === item.paymentTermId) {
        return (item.amount = amount);
      }
    });
  }

  saveItems() {
    const body = [];
    this.proposedPaymentTerms.map((item) => {
      const totalPercent = this.calculateTotalPercent(
        this.proposedPaymentTerms
      );
      const request = {
        paymentTermId: item.paymentTermId,
        phase: item.phase,
        payment: item.payment,
        amount: item.amount,
        projectStatusDescription: item.projectStatusDescription,
        completion: item.completion,
        comment: item.comment,
      };
      body.push(request);
      if (totalPercent !== 100) {
        return swal.fire(
          'GOS FINANCIAL',
          'Payment breakdown should be 100%',
          'error'
        );
      }
    });
    const payload = {
      request: body,
    };
    // return console.log(payload);
    this.loadingService.show();
    return this.purchaseService.modifyBid(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            // return this.onRowEditCancel(item.paymentTermId);
          });
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }
  calculateTotalPercent(arr) {
    return arr.reduce((total, item) => {
      return item.payment + total;
    }, 0);
  }
}
