import { Component, OnInit } from "@angular/core";
import { PpeService } from "../../services/ppe.service";
import { LoadingService } from "../../../core/services/loading.service";
import swal from "sweetalert2";

@Component({
  selector: "app-addition-approvals",
  templateUrl: "./addition-approvals.component.html",
  styleUrls: ["./addition-approvals.component.css"]
})
export class AdditionApprovalsComponent implements OnInit {
  awaitingApprovals: any[] = [];
  activeIndex: number = 0;
  tabSelected: boolean;
  additionApprovals: any[] = [];
  viewHeight: string = "600px";
  additionDetails: any = {};
  approvalDetails: any[] = [];
  selectedItem: any[] = [];
  showDialog: boolean;
  staffId: any;
  staffs: any[] = [];
  constructor(
    private ppeService: PpeService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.getAwaitingApprovals();
  }

  // get list
  getAwaitingApprovals() {
    this.loadingService.show();
    return this.ppeService.getAwaitingApprovals().subscribe(
      data => {
        this.loadingService.hide();
        this.awaitingApprovals = data.additionForms;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  tabChange(event: any) {
    this.activeIndex = event.index;
  }

  viewApprovalDetails(x) {
    this.additionDetails = x;
    const id: number = x.additionFormId;
    const token: string = encodeURIComponent(x.workflowToken);
    this.getApprovalDetails(id, token);
    this.tabSelected = true;
    this.activeIndex = 1;
  }
  getApprovalDetails(id, token) {
    this.loadingService.show();
    return this.ppeService.getApprovalComments(id, token).subscribe(
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
  submitApproval(row: any) {
    let body = {
      targetId: row.additionFormId,
      approvalStatus: parseInt(row.approvalStatusId),
      approvalComment: row.comment
      // referredStaffId: this.staffId
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
          return this.ppeService.submitApproval(body).subscribe(
            res => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire(`GOS FINANCIAL`, message, "success").then(() => {
                  setTimeout(() => {
                    this.getAwaitingApprovals();
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
  getValue(value: string) {
    if (value == '5') {
      this.showDialog = true
    } else {
      this.staffId = 0
    }
  }
  dismissDialog() {
    this.showDialog = false;
  }

  multiApprove() {
    if (this.selectedItem.length == 0) {
      return swal.fire("GOS FINANCIAL", "Select item(s) to approve", "error");
    }
    let payload = [];
    this.selectedItem.forEach(item => {
      const data = {
        targetId: item.additionFormId
      };
      payload.push(data);
    });
    this.loadingService.show();
    return this.ppeService.multiApproveAddition(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success").then(() => {
            this.getAwaitingApprovals();
            payload = [];
          });
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
}
