import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../core/services/purchase.service';
import { LoadingService } from '../../core/services/loading.service';
import swal from 'sweetalert2';
import { SupplierService } from '../../core/services/supplier.service';
import { CreditAppraisalService } from '../../core/services/credit-appraisal.service';

@Component({
  selector: 'app-prn-approvals',
  templateUrl: './prn-approvals.component.html',
  styleUrls: ['./prn-approvals.component.css'],
})
export class PrnApprovalsComponent implements OnInit {
  displayApproval: boolean;
  prnApprovals: any[] = [];
  viewHeight: string = '600px';
  prnDetails: any = {};
  staffs: any[] = [];
  staffId: any;
  showDialog: boolean;
  activeIndex: number = 0;
  tabSelected: boolean;
  approvalDetails: any[] = [];
  approvalComment: string;
  approvalStatus: any;
  prnDetail: any[] = [];
  cols: any[] = [];
  suppliers: any[];
  privilege: boolean;
  operationId: number = 31;
  canEditPrivilege: boolean;
  editingMode: Array<[]> = [];
  purchaseReqNoteId: number;
  constructor(
    private purchaseService: PurchaseService,
    private loadingService: LoadingService,
    private supplierService: SupplierService,
    private creditAppraisalService: CreditAppraisalService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'requestBy',
        field: 'requestBy',
      },
      {
        header: 'departmentName',
        field: 'departmentName',
      },
      {
        header: 'description',
        field: 'description',
      },
      {
        header: 'total',
        field: 'total',
      },
      {
        header: 'requestDate',
        field: 'requestDate',
      },
      {
        header: 'expectedDeliveryDate',
        field: 'expectedDeliveryDate',
      },
    ];
    this.getPrnApprovals();
    this.getUserPrivilege(this.operationId);
  }
  getPrnApprovals() {
    this.loadingService.show();
    return this.purchaseService.getPrnApprovals().subscribe(
      (data) => {
        if (data.requisitionNotes != null) {
          this.prnApprovals = data.requisitionNotes;
        } else {
          this.prnApprovals = [];
        }
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  viewApprovalDetails(data) {
    this.purchaseReqNoteId = data.purchaseReqNoteId;
    let token = encodeURIComponent(data.workflowToken);
    this.getApprovalDetails(this.purchaseReqNoteId, token);
    this.getPrnDetail(this.purchaseReqNoteId);
    this.tabSelected = true;
    this.activeIndex = 1;
    this.prnDetails = data;
  }

  // get approval details

  getApprovalDetails(id: number, token: string) {
    this.loadingService.show();
    return this.supplierService.getApprovalDetails(id, token).subscribe(
      (data) => {
        this.loadingService.hide();
        this.approvalDetails = data.aprovalDetails;
        if (data.previousStaff !== null) {
          this.staffs = data.previousStaff;
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  submitApproval(prnDetails: any) {
    let body = {
      targetId: prnDetails.purchaseReqNoteId,
      approvalStatus: parseInt(prnDetails.approvalStatus),
      approvalComment: prnDetails.approvalComment,
      referredStaffId: parseInt(this.staffId),
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
          return this.purchaseService.approvePRN(body).subscribe(
            (res) => {
              this.loadingService.hide();
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
              // swal.fire(`GOS FINANCIAL`, message, "error");
            }
          );
        }
      });
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

  tabChange(event: any) {
    this.activeIndex = event.index;
  }
  getPrnDetail(id: number) {
    this.loadingService.show();
    return this.purchaseService.getPrnDetails(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.prnDetail = data.requisitionNotes[0].prnDetails;
        this.suppliers = data.requisitionNotes[0].prnDetails[0].suppliers;
      },
      (err) => {
        this.loadingService.hide();
      }
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
    this.editingMode.push(item.prnDetailsId);
  }

  onRowEditSave(row) {
    // const subTotal = this.calculateSubTotal(row.quantity, row.unitPrice);
    // this.prnDetail.map((item) => {
    //   if (item.prnDetailsId === row.prnDetailsId) {
    //     return (item.subTotal = subTotal);
    //   }
    // });
    const payload = {
      prnDetailsId: row.prnDetailsId,
      description: row.description,
      quantity: row.quantity,
      comment: row.comment,
      unitPrice: row.unitPrice,
      suggestedSupplierId: row.suggestedSupplierId,
      subTotal: row.subTotal,
      isBudgeted: row.isBudgeted || false,
    };
    console.log(payload);
    this.loadingService.show();
    return this.purchaseService.modifyPrn(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.onRowEditCancel(row.prnDetailsId);
            this.getPrnDetail(this.purchaseReqNoteId);
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

  onRowEditCancel(prnDetailsId) {
    const index = this.editingMode.indexOf(prnDetailsId);
    if (index > -1) {
      this.editingMode.splice(index, 1);
    }
  }

  calculateSubTotal(qty, unitPrice, row) {
    const subTotal = qty * unitPrice;
    this.prnDetail.map((item) => {
      if (item.prnDetailsId === row.prnDetailsId) {
        return (item.subTotal = subTotal);
      }
    });
  }
}
