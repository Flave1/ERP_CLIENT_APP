import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {DepositAccountService} from '../../../core/services/depositaccount.service';
import swal from "sweetalert2";

@Component({
  selector: 'app-account-reactivation-appraisals',
  templateUrl: './account-reactivation-appraisals.component.html',
  styleUrls: ['./account-reactivation-appraisals.component.css']
})
export class AccountReactivationAppraisalsComponent implements OnInit {
  formTitle: string = "Account Reactivation Appraisals";
  activeIndex: any;
  cols: any[] = [];
  reactivationApprovals: any[] = [];
  viewHeight: string = '600px';
  tabSelected: boolean;
  approvalDetails: any = {};
  showDialog: boolean;
  staffId: any;
  staffs: any[] = [];

  constructor(private loadingService: LoadingService, private depositService: DepositAccountService) { }

  ngOnInit(): void {
    this.getApprovals()
  }
  getApprovals() {
    this.loadingService.show();
    return this.depositService.getReactivationApprovals().subscribe(data => {
      this.loadingService.hide();
      this.reactivationApprovals = data.reactivated_customers
    }, err => {
      this.loadingService.hide()
    })
  }
  showAddNew() {

  }

  tabChange(event: any) {
    this.activeIndex = event.index;
  }

  viewApprovalDetails(x) {
    let id = x.purchaseReqNoteId;
    let token = encodeURIComponent(x.workflowToken);
    // this.getApprovalDetails(id, token);
    this.tabSelected = true;
    this.activeIndex = 1;
    this.approvalDetails = x;
  }
  // get approval details
  // getApprovalDetails(id: number, token: string) {
  //   this.loadingService.show();
  //   return this.supplierService.getApprovalDetails(id, token).subscribe(
  //     data => {
  //       this.loadingService.hide();
  //       this.approvalDetails = data.aprovalDetails;
  //       if (data.previousStaff !== null) {
  //         this.staffs = data.previousStaff;
  //       }
  //     },
  //     err => {
  //       this.loadingService.hide();
  //     }
  //   );
  // }
  submitApproval(approvalDetails: any) {
    let body = {
      targetId: approvalDetails.id,
      approvalStatusId: parseInt(approvalDetails.approvalStatus),
      approvalComment: approvalDetails.approvalComment,
      referredStaffId: parseInt(this.staffId)
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
          return this.depositService.approveReactivation(body).subscribe(
            res => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire(`GOS FINANCIAL`, message, "success").then(() => {
                  setTimeout(() => {
                    this.getApprovals();
                    this.activeIndex = 0;
                    this.tabSelected = false
                  }, 1000);
                });
              } else {
                // this.loadingService.hide()
                swal.fire(`GOS FINANCIAL`, message, "error");
              }
            },
            err => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, "error");
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, "error");
              }
              // swal.fire(`Error`, message, "error");

            }
          );
        }
      });
  }

  dismissDialog() {
    this.showDialog = false;
  }

  getValue(value: any) {
    if (value == "5") {
      this.showDialog = true;
    } else {
      this.staffId = 0;
    }
  }
}
