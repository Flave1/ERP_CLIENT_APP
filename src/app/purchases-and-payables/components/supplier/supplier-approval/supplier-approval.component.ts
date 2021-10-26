import swal from "sweetalert2";
import {Component, OnDestroy, OnInit} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { LoadingService } from "../../../../core/services/loading.service";
import { SupplierService } from "../../../../core/services/supplier.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-supplier-approval",
  templateUrl: "./supplier-approval.component.html"
})
export class SupplierApprovalComponent implements OnInit, OnDestroy {
  approvalStatus: any[];
  selectedApprovalData: any = {};
  supplierAwaitingApproval: any[];
  displayApproval: boolean = false;
  viewHeight: any = "600px";
  activeIndex: number = 0;
  tabSelected: boolean = false;
  supplierId: number;
  approvalDetails: any[] = [];
  workflowToken: string;
  showStaffs: boolean;
  staffId: any;
  staffs: any[] = [];
  selectedItem: any[] = [];
  cols: any[] = [];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private supplierService: SupplierService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'supplierTypeName',
        field: 'supplierTypeName'
      },
      {
        header: 'name',
        field: 'name'
      },
      {
        header: 'supplierNumber',
        field: 'supplierNumber'
      },
      {
        header: 'email',
        field: 'email'
      },
      {
        header: 'phoneNo',
        field: 'phoneNo'
      },
      {
        header: 'statusName',
        field: 'statusName'
      }
    ]
    this.getSuplierAwaitingApproval();
  }
  viewApprovalDetails(row) {
    this.supplierId = row.supplierId;
    this.workflowToken = row.workflowToken;
    this.activeIndex = 1;
    this.tabSelected = true;
    this.selectedApprovalData = row;
    this.getApprovalDetail(this.supplierId, this.workflowToken);
    // this.displayApproval = true;
  }
  getSuplierAwaitingApproval(): Subscription {
    this.loadingService.show();
    return this.supplierService.getSupplierAwaitingApproval().subscribe(
      data => {
        //this.loadingService.hide();
        this.supplierAwaitingApproval = data.suppliers;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getApprovalStatus(value: string) {
    if (value == "5") {
      this.showStaffs = true;
    } else {
      this.staffId = 0;
    }
  }
  closeStaffsmodal() {
    this.showStaffs = false;
  }
  submitApproval(formObj) {
    let body = {
      targetId: formObj.supplierId,
      approvalStatus: parseInt(formObj.approvalStatusId),
      approvalComment: formObj.comment,
      referredStaffId: parseInt(this.staffId)
    };
    // const this = this;
    swal
      .fire({
        title: "Are you sure you want to approve this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(
        result => {
          if (result.value) {
            this.loadingService.show();

            this.supplierService.goForApproval(body).subscribe(
              data => {
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                  swal.fire("GOS FINANCIAL", message, "success");
                  setTimeout(() => {
                    this.loadingService.hide();
                    this.activeIndex = 0;
                    this.getSuplierAwaitingApproval();
                  }, 1000);
                } else {
                  swal.fire("GOS FINANCIAL", message, "error");
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
              }
            );
          } else {
            swal.fire("GOS FINANCIAL", "Cancelled", "error");
          }
        },
        err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "error");
        }
      );
  }
  getApprovalDetail(id: number, workflowToken: string) {
    this.loadingService.show();
    return this.supplierService.getApprovalDetails(id, workflowToken).subscribe(
      data => {
        this.approvalDetails = data.aprovalDetails;
        if (data.previousStaff != null) {
          this.staffs = data.previousStaff;
        }
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  tabChange(event: any) {
    this.activeIndex = event.index;
  }

  multiApprove() {
    if (this.selectedItem.length == 0) {
      return swal.fire(`GOS FINANCIAL`, "Select items to approve", "error");
    }
    let ids = [];
    this.selectedItem.forEach(item => {
      ids.push(item.supplierId);
    });
    const payload = {
      targetIds: ids
    }
    swal.fire({
      title: "Are you sure you want to approve these records?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!"
    }).then(result => {
      if (result.value) {
        this.loadingService.show();
        return this.supplierService.multiApproveSupplier(payload).subscribe(res => {
          this.loadingService.hide();
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire('GOS FINANCIAL', message, 'success').then(() => {
              this.selectedItem = []
              this.getSuplierAwaitingApproval()
            })
          } else {
            swal.fire('GOS FINANCIAL', message, 'error')
          }
        }, err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error')
        })
      } else {

      }
    })
  }
  ngOnDestroy(): void {
    // this.getSuplierAwaitingApproval().unsubscribe()
  }
}
