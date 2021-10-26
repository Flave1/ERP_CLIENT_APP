import { Component, OnInit } from '@angular/core';
import {
  Approval,
  ClassificationSetup,
  CostCentre,
  ExpenseDetails,
  PaymentProposal,
  Requisition,
} from '../../../../models/models';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { data } from '../../../datafile';
import { CompanyService } from '../../../../core/services/company.service';
import swal from 'sweetalert2';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-ern-payment-approval',
  templateUrl: './ern-payment-approval.component.html',
  styleUrls: ['./ern-payment-approval.component.css'],
})
export class ErnPaymentApprovalComponent implements OnInit {
  cols: any;
  filteredResults: PaymentProposal[] = [];
  selectedItem: PaymentProposal[] = [];
  viewHeight: string = '600px';
  departments: any[] = [];
  approvedPayments: PaymentProposal[] = [];
  activeIndex: number = 0;
  tabSelected: boolean;
  paymentDetails: any = {};
  approvalDetails: any[] = [];
  showDialog: boolean;
  staffId: number = 0;
  staffs: any;
  requisitionPaymentId: number;

  requisitionId: number;
  expenseDetails: ExpenseDetails[] = [];
  fromApproval: boolean;
  canEditPrivilege = true;
  editingMode: Array<[]> = [];
  classifications: ClassificationSetup[] = [];
  costCentreList: CostCentre[] = [];

  constructor(
    private expenseManagementService: ExpenseManagementService,
    private loadingService: LoadingService,
    private companyService: CompanyService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getCompanyStructures();
    this.getApprovedPaments();
    this.cols = [
      { header: 'erNnumber', field: 'erNnumber' },
      { header: 'description', field: 'description' },
      { header: 'requestBy', field: 'requestBy' },
      { header: 'deparmentment', field: 'deparmentment' },
      { header: 'requestDate', field: 'requestDate' },
      { header: 'totalAmount', field: 'totalAmount' },
      { header: 'expectedDeliveryDate', field: 'expectedDeliveryDate' },
    ];
  }

  getCostCentreList() {
    return this.expenseManagementService
      .getCostCentreList()
      .subscribe((data) => {
        this.costCentreList = data;
      });
  }
  getCompanyStructures() {
    this.loadingService.show();
    return this.companyService.getAllCompanyStructure().subscribe(
      (data) => {
        this.loadingService.hide();
        this.departments = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getApprovedPaments() {
    this.loadingService.show();
    return this.expenseManagementService
      .getPaymentApprovals()
      .subscribe((data) => {
        this.loadingService.hide();
        this.approvedPayments = data;
        this.filteredResults = data;
      });
  }

  filterByStructure(id: number) {
    this.filteredResults = this.approvedPayments.filter(
      (item) => item.structureId === +id
    );
    if (+id === 0) {
      this.filteredResults = this.approvedPayments;
    }
  }

  filterByStatus(id: number) {
    this.filteredResults = this.approvedPayments.filter(
      (item) => item.structureId === +id
    );
    if (+id === 0) {
      this.filteredResults = this.approvedPayments;
    }
  }

  exportItems() {}

  uploadItems() {}

  handleFileInput(files: any) {}

  tabChange(event: any) {
    this.activeIndex = event.index;
  }

  submitApproval(paymentDetails: Approval) {
    const payload = [];
    const body = {
      approvalStatus: +paymentDetails.approvalStatus,
      approvalComment: paymentDetails.approvalComment,
      targetId: +this.requisitionPaymentId,
      referredStaffId: +this.staffId,
      type: paymentDetails['type'],
    };
    payload.push(body);
    swal
      .fire({
        title: `Do you want to approve this payment?`,
        confirmButtonText: `Yes`,
        showCancelButton: true,
        icon: 'warning',
        cancelButtonText: 'No',
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.loadingService.show();
          return this.expenseManagementService
            .submitPaymentApproval(payload)
            .subscribe(
              (res) => {
                this.loadingService.hide();
                const message = res['status'].message.friendlyMessage;
                if (res['status'].isSuccessful) {
                  swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                    this.getApprovedPaments();
                    this.activeIndex = 0;
                  });
                } else {
                  swal.fire('GOS FINANCIAL', message, 'error');
                }
              },
              (err) => {
                this.loadingService.hide();
                const message = err.error['status'].message.friendlyMessage;
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            );
        }
      });
  }

  viewDetails(x) {
    this.fromApproval = true;
    this.requisitionId = x.requisitionnote.requisitionId;
    this.expenseDetails = x.requisitionnote.requisitiondetails;
    this.approvalDetails = x.approvalDetailsQuery;
    this.staffs = x.processStaffs;

    this.tabSelected = true;
    this.activeIndex = 1;
    this.paymentDetails = x;
    this.requisitionPaymentId = x.requisitionPaymentId;
    this.dataService.emitErnApproval.emit(x);
  }

  getValue(value: any) {
    if (+value === 5) {
      this.showDialog = true;
    }
  }

  dismissDialog() {
    this.showDialog = false;
  }

  multiApprove() {
    const payload = [];
    this.selectedItem.map((item) => {
      const body = {
        targetId: +item.requisitionPaymentId,
        approvalComment: 'ok',
        referredStaffId: this.staffId,
        workflowToken: '',
        approvalStatus: 2,
        type: item['type'],
      };
      payload.push(body);
    });
    if (payload.length === 0) {
      return swal.fire('GOS FINANCIAL', 'Select item(s) to approve', 'error');
    }
    swal
      .fire({
        title: 'Do you want to approve these items?',
        text: `You won't be able to reverse`,
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonText: 'No',
        icon: 'warning',
      })
      .then((response) => {
        if (response.isConfirmed) {
          return this.approvePayment(payload);
        }
      });
  }
  approvePayment(payload) {
    this.loadingService.show();
    return this.expenseManagementService
      .submitPaymentApproval(payload)
      .subscribe(
        (response) => {
          this.loadingService.hide();
          const message = response['status'].message.friendlyMessage;
          if (response['status'].isSuccessful) {
            swal.fire('GOS FINANCIAL', message, 'success').then(() => {
              this.selectedItem = [];
              this.getApprovedPaments();
            });
          } else {
            swal.fire('GOS FINANCIAL', message, 'error');
          }
        },
        (error) => {
          this.loadingService.hide();
          const message = error.error.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      );
  }
  approve(item) {
    const payload = [];
    const body = {
      targetId: +item.requisitionPaymentId,
      approvalComment: 'ok',
      referredStaffId: this.staffId,
      workflowToken: '',
      approvalStatus: 2,
      type: item.type,
    };
    payload.push(body);
    swal
      .fire({
        title: `Do you want to approve this item`,
        text: `You won't be able to revert this`,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        icon: 'question',
      })
      .then((res) => {
        if (res.isConfirmed) {
          return this.approvePayment(payload);
        }
      });
  }
  getClassifications() {
    return this.expenseManagementService
      .getClassifications()
      .subscribe((data) => {
        this.classifications = data;
      });
  }
}
