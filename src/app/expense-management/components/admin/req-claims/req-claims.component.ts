import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import {
  Claim,
  ExpenseDetails,
  RequisitionClaim,
  SearchColumn,
} from '../../../../models/models';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-req-claims',
  templateUrl: './req-claims.component.html',
  styleUrls: ['./req-claims.component.css'],
})
export class ReqClaimsComponent implements OnInit {
  activeIndex: number;
  cols: SearchColumn;
  claims: RequisitionClaim[] = [];
  selectedItem: any;
  viewHeight: string = '600px';
  tabSelected: boolean;
  approvalDetails: any;
  staffs: any[] = [];
  staffId: number = 0;
  showDialog: boolean;
  expenseDetail: ExpenseDetails[] = [];
  selectedClaim: any;

  requisitionId: number;
  expenseDetails: ExpenseDetails[] = [];
  fromApproval: boolean;
  canEditPrivilege = true;
  editingMode: Array<[]> = [];
  requisitionPaymentId: number;
  claimDetails: any = {};
  claimDetailsRequisition: any = {};
  claimId: number;
  claimType: number;
  constructor(
    private loadingService: LoadingService,
    private expenseManagementService: ExpenseManagementService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getApprovals();
  }

  getApprovals() {
    this.loadingService.show();
    return this.expenseManagementService.getReqClaimsApproval2().subscribe(
      (data) => {
        this.loadingService.hide();
        this.claims = data;
        // console.log(this.claims);
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  tabChange(event: any) {
    this.activeIndex = event.index;
  }

  viewDetails(x) {
    // this.fromApproval = true;
    // this.requisitionId = x.requisitionnote.requisitionId;
    // this.expenseDetails = x.requisitionnote.requisitiondetails;
    // this.approvalDetails = x.approvalDetailsQuery;
    // this.staffs = x.processStaffs;
    // this.tabSelected = true;
    // this.activeIndex = 1;
    // this.claimDetails = x;
    // this.claimDetailsRequisition = x.requisitionnote;
    // this.requisitionPaymentId = x.requisitionPaymentId;
    // this.dataService.emitErnApproval.emit(x);
    this.fromApproval = true;
    this.claimId = x.claimsId;
    this.claimDetails = x;
    this.activeIndex = 1;
    this.tabSelected = true;
    this.expenseDetail = x.detail;
    this.claimType = x.claimType;
  }

  submitApproval(claimDetails: any) {
    const payload = {
      targetId: this.claimType == 1 ? claimDetails.retirementId : claimDetails.claimsId,
      approvalComment: claimDetails.approvalComment,
      approvalStatus: +claimDetails.approvalStatus,
      referredStaffId: +this.staffId,
      workflowToken: claimDetails.workflowToken,
      type : this.claimType
    };
    swal
      .fire({
        title: `Do you want to approve this item?`,
        text: `You won't be able to revert this`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        icon: 'warning',
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.loadingService.show();
          return this.expenseManagementService
            .submitReqClaimApproval(payload)
            .subscribe(
              (res) => {
                this.loadingService.hide();
                const message = res['status'].message.friendlyMessage;
                if (res['status'].isSuccessful) {
                  swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                    this.getApprovals();
                    this.activeIndex = 0;
                  });
                } else {
                  swal.fire('GOS FINANCIAL', message, 'error');
                }
              },
              (err) => {
                debugger;
                this.loadingService.hide();
                const message = err.error['status'].message.friendlyMessage;
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            );
        }
      });
  }

  dismissDialog() {}

  getValue(value: any) {}
}
