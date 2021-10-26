import { Component, OnInit } from "@angular/core";
import { PpeService } from "../../services/ppe.service";
import { LoadingService } from "../../../core/services/loading.service";
import swal from "sweetalert2";

@Component({
  selector: "app-reevaluation-approvals",
  templateUrl: "./reevaluation-approvals.component.html",
  styleUrls: ["./reevaluation-approvals.component.css"]
})
export class ReevaluationApprovalsComponent implements OnInit {
  activeIndex: any;
  awaitingApprovals: any[] = [];
  viewHeight: string;
  selectedItem: any;
  tabSelected: boolean;
  details: any = {};
  showDialog: boolean;
  staffId: any;
  staffs: any[] = [];
  approvalDetails: any[] = [];

  constructor(
    private ppeService: PpeService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.getAwaitingApprovals();
  }

  getAwaitingApprovals() {
    this.loadingService.show();
    return this.ppeService.getReevaluationApprovals().subscribe(
      data => {
        this.loadingService.hide();
        this.awaitingApprovals = data.registers;
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
    this.details = x;
    const id: number = x.registerId;
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
        this.approvalDetails = data.details;
        this.staffs = data.previousStaff;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  submitApproval(details: any) {
    let body = {
      targetId: details.registerId,
      approvalStatus: +details.approvalStatus,
      approvalComment: details.approvalComment
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
          return this.ppeService.submitReevaluationApproval(body).subscribe(
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
              const message = err.message.friendlyMessage;
              swal.fire(`GOS FINANCIAL`, message, "error");
            }
          );
        }
      });
  }

  multiApprove() {
    if (this.selectedItem.length == 0) {
      return swal.fire("GOS FINANCIAL", "Select item(s) to approve", "error");
    }
    const payload = [];
    this.selectedItem.forEach(item => {
      const data = {
        targetId: item.registerId
      };
      payload.push(data);
    });
    this.loadingService.show();
    return this.ppeService.multiApproveRevaluation(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success").then(() => {
            this.getAwaitingApprovals();
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
  getValue(value: string) {
    if (value == "5") {
      this.showDialog = true;
    } else {
      this.staffId = 0;
    }
  }
  dismissDialog() {
    this.showDialog = false;
  }
}
