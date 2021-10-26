import { Component, OnInit } from '@angular/core';
import { Claim, ExpenseDetails, SearchColumn } from '../../../../models/models';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import swal from 'sweetalert2';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-claim-approvals',
  templateUrl: './claim-approvals.component.html',
  styleUrls: ['./claim-approvals.component.css'],
})
export class ClaimApprovalsComponent implements OnInit {
  activeIndex: number;
  cols: SearchColumn;
  claims: Claim[] = [];
  selectedItem: any;
  viewHeight: string = '600px';
  tabSelected: boolean;
  claimDetails: any = {};
  approvalDetails: any;
  staffs: any[] = [];
  staffId: number = 0;
  showDialog: boolean;
  expenseDetail: ExpenseDetails[] = [];
  fromApproval: boolean;
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
    return this.expenseManagementService.getNoReqClaimsApproval().subscribe(
      (data) => {
        this.loadingService.hide();
        this.claims = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  tabChange(event: any) {}

  viewDetails(x) {
    this.fromApproval = true;
    this.claimId = x.newClaimID;
    this.claimDetails = x;
    this.activeIndex = 1;
    this.tabSelected = true;
    this.expenseDetail = x.detail;
    this.claimType = x.claimType;
    this.dataService.reloadClaimsData.emit({ claimType: this.claimType });
  }

  submitApproval(claimDetails: any) {
    const payload = {
      targetId: claimDetails.newClaimID,
      approvalComment: claimDetails.approvalComment,
      approvalStatus: +claimDetails.approvalStatus,
      referredStaffId: +this.staffId,
      workflowToken: claimDetails.workflowToken,
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
            .submitNoReqApproval(payload)
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
                this.loadingService.hide();
                const message = err['status'].message.friendlyMessage;
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            );
        }
      });
  }

  dismissDialog() {}

  getValue(value: any) {}
}
