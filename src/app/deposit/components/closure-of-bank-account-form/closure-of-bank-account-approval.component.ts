import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import swal from "sweetalert2";

@Component({
  selector: 'app-closure-of-bank-account-approval',
  templateUrl: './closure-of-bank-account-approval.component.html',
  styleUrls: []
})
export class ClosureOfBankAccountApprovalComponent implements OnInit {

  AccountClosureApprovals: any[];
  paymentApprovals: any[] = [];
  activeIndex: any = 0;
  viewHeight: string = "600px";
  tabSelected: boolean;
  ItemDetails: any = {};
  displayApproval: boolean;
  showDialog: any;
  staffId: any;
  staffs: any;
  approvalDetails: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private DepositAccountService: DepositAccountService) { }

  ngOnInit() {
    this.getAccountClosureApprovals();
  }



  submitApproval(ItemDetails: any) {
    let body = {
      targetId: parseInt(ItemDetails.bankClosureId),
      approvalStatusId: parseInt(ItemDetails.approvalStatusId),
      approvalComment: ItemDetails.comment,
      referredStaffId: parseInt("0")
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
          return this.DepositAccountService.submitStaffDepsoitBankClosureApproval(body).subscribe(
            res => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                this.getAccountClosureApprovals();
                this.loadingService.hide();
                this.tabSelected = false;
                this.activeIndex = 0;
                swal.fire(`GOS FINANCIAL`, message, "success");
              } else {
                this.loadingService.hide()
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

  viewApprovalDetails(x) {
    let id = x.bankClosureId;
    let token = encodeURIComponent(x.workflowtoken);
    this.ItemDetails = x;
    this.tabSelected = true;
    this.activeIndex = 1;
    this.getApprovalDetails(id, token);
  }


  getApprovalDetails(id: number, token: string) {
    this.loadingService.show();
    return this.DepositAccountService.getApprovalDetails(id, token).subscribe(
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

  getAccountClosureApprovals() {
    this.loadingService.show();
    return this.DepositAccountService.getAllAccountClosuresAwaitingApprovals().subscribe(
      data => {
        this.AccountClosureApprovals = data.bankClosures;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }


  dismissDialog() {
    this.showDialog = false;
  }
}


