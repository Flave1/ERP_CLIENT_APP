import { Component, OnInit } from '@angular/core';
import {
  Approval,
  ClassificationSetup,
  CostCentre,
  ExpenseDetails,
  Requisition,
} from '../../../../models/models';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { DataService } from '../../../../core/services/data.service';
import swal from 'sweetalert2';
import { CreditAppraisalService } from '../../../../core/services/credit-appraisal.service';
@Component({
  selector: 'app-ern-approval-list',
  templateUrl: './ern-approval-list.component.html',
  styleUrls: ['./ern-approval-list.component.css'],
})
export class ErnApprovalListComponent implements OnInit {
  activeIndex: number;
  ernApprovals: Requisition[] = [];
  cols: Requisition[] = [];
  viewHeight = '600px';
  tabSelected: boolean;
  ernDetails: any = {};
  approvalDetails: any[] = [];
  classificationSelected: any;
  ernDetail: Requisition[];
  fromApproval: boolean;
  requisitionId: number;
  expenseDetails: ExpenseDetails[] = [];
  classifications: ClassificationSetup[] = [];
  costCentreList: CostCentre[] = [];
  canEditPrivilege: boolean;
  editingMode: Array<[]> = [];
  showDialog: boolean;
  staffId = 0;
  staffs: any[] = [];
  selectedItem: Requisition[] = [];
  constructor(
    private loadingService: LoadingService,
    private expenseManagementService: ExpenseManagementService,
    private dataService: DataService,
    private creditAppraisalService: CreditAppraisalService
  ) {}

  ngOnInit(): void {
    this.getApprovalList();
    this.getClassifications();
    this.getCostCentreList();
    this.getUserPrivilege(31);
  }

  getApprovalList() {
    this.loadingService.show();
    return this.expenseManagementService.getRequisitionApprovalList().subscribe(
      (data) => {
        this.loadingService.hide();
        this.ernApprovals = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  tabChange(event: any) {
    this.activeIndex = event.index;
  }

  viewApprovalDetails(item) {
    this.fromApproval = true;
    this.requisitionId = item.requisitionId;
    this.tabSelected = true;
    this.activeIndex = 1;
    this.expenseDetails = item.requisitiondetails;
    this.approvalDetails = item.approvalDetailsQuery;
    this.staffs = item.processStaffs;
    this.dataService.emitErnApproval.emit(item);
  }
  getClassifications() {
    return this.expenseManagementService
      .getClassifications()
      .subscribe((data) => {
        this.classifications = data;
      });
  }

  returnThisClassificationName(id: number) {
    if (id) {
      return this.classifications.find((d) => d.classificationsetupId == id)
        .name;
    }
    return '';
  }
  getCostCentreList() {
    return this.expenseManagementService
      .getCostCentreList()
      .subscribe((data) => {
        this.costCentreList = data;
      });
  }
  returnCostCentreName(id: number) {
    if (id) {
      return this.costCentreList.find((d) => d.costCenterId == id).name;
    }
    return '';
  }
  submitApproval(ernDetails: Approval) {
    console.log(ernDetails);
    ernDetails.approvalStatus = +ernDetails.approvalStatus;
    ernDetails.targetId = +this.requisitionId;
    ernDetails.referredStaffId = +this.staffId;
    ernDetails.workflowToken = '';

    const payload = [];

    const body: Approval = {
      targetId: +this.requisitionId,
      approvalComment: ernDetails.approvalComment,
      referredStaffId: this.staffId,
      workflowToken: '',
      approvalStatus: ernDetails.approvalStatus,
    };
    payload.push(body);

    swal
      .fire({
        title: `Are you sure you want to approve this record?`,
        text: `You won't be able to reverse this`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      })
      .then((response) => {
        if (response.isConfirmed) {
          return this.approveErn(payload);
        }
      });
  }
  approveErn(payload) {
    this.loadingService.show();
    return this.expenseManagementService.submitErnApproval(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res['status'].message.friendlyMessage;
        if (res['status'].isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.getApprovalList();
            this.activeIndex = 0;
          });
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (error) => {
        this.loadingService.hide();
        const message = error['status'].message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error').then(() => {
          this.getApprovalList();
          this.activeIndex = 0;
        });
      }
    );
  }
  getValue(value: any) {
    if (+value === 5) {
      this.showDialog = true;
    }
  }
  onRowEditInit(x, index) {
    // this.editingMode = true;
    this.editingMode.push(x.requisitionDetailId);
  }

  onRowEditSave(row: ExpenseDetails) {
    const payload = {
      requisitionDetailId: row.requisitionDetailId,
      amount: row.unitPrice,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      classificationsetupId: row.classificationsetupId,
      costCentreId: row.costCenterId,
      isBudgeted: row.isBudgeted,
    };

    payload.costCentreId = +payload.costCentreId;
    const subTotal = this.calculateSubTotal(row.quantity, row.unitPrice, row);
    this.expenseDetails.map((item) => {
      if (item.requisitionDetailId === row.requisitionDetailId) {
        return (item.subTotal = subTotal);
      }
    });
    const totalSum = this.calculateTotalSum(this.expenseDetails);
    this.dataService.getTotalSum.emit(totalSum);
    this.onRowEditCancel(row);
    this.loadingService.show();
    return this.expenseManagementService
      .updateRequisitionAmount(payload)
      .subscribe(
        (res) => {
          this.loadingService.hide();
          const message = res['status'].message.friendlyMessage;
          if (res['status'].isSuccessful) {
            swal.fire(
              'GOS FINANCIAL',
              'Requisition successfully updated',
              'success'
            );
          } else {
            swal.fire(
              'GOS FINANCIAL',
              'Requisition not updated, please try again',
              'error'
            );
          }
        },
        (err) => {
          this.loadingService.hide();
          const message = err['status'].message.friendlyMessage;
          swal.fire(
            'GOS FINANCIAL',
            'Requisition not updated, please try again',
            'error'
          );
        }
      );
  }
  calculateSubTotal(qty, unitPrice, row): number {
    const subTotal = qty * unitPrice;
    this.expenseDetails.map((item) => {
      if (item.requisitionDetailId === row.requisitionDetailId) {
        return (item.subTotal = subTotal);
      }
    });
    return;
  }
  calculateTotalSum(expenseDetails) {
    return expenseDetails.reduce((total, item) => item.subTotal + total, 0);
  }
  onRowEditCancel(x) {
    const index = this.editingMode.indexOf(x.requisitionDetailId);
    if (index > -1) {
      this.editingMode.splice(index, 1);
    }
  }

  dismissDialog() {
    this.showDialog = false;
  }

  multiApprove() {
    const payload = [];
    this.selectedItem.map((item) => {
      const body: Approval = {
        targetId: +item.requisitionId,
        approvalComment: 'ok',
        referredStaffId: this.staffId,
        workflowToken: '',
        approvalStatus: 2,
      };
      payload.push(body);
    });
    if (payload.length === 0) {
      return swal.fire('GOS FINANCIAL', 'Select item(s) to approve', 'error');
    }
    swal
      .fire({
        title: 'Are you sure you want to approve items?',
        text: `You won't be able to revert this`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((response) => {
        if (response.isConfirmed) {
          return this.approveErn(payload);
        }
      });
  }

  approveItem(requisitionId: any) {
    const payload: Approval[] = [];
    const body: Approval = {
      targetId: +requisitionId,
      approvalComment: 'ok',
      referredStaffId: this.staffId,
      workflowToken: '',
      approvalStatus: 2,
    };
    payload.push(body);
    swal
      .fire({
        title: `Are you sure you want to approve this record?`,
        text: `You won't be able to reverse this`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      })
      .then((response) => {
        if (response.isConfirmed) {
          return this.approveErn(payload);
        }
      });
  }
  getUserPrivilege(operationId) {
    this.creditAppraisalService
      .getUserPriviledge(operationId)
      .subscribe((data) => {
        this.canEditPrivilege = data;
      });
  }
}
