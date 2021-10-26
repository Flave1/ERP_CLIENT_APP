import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { PurchaseService } from "src/app/core/services/purchase.service";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-purchase-requisition-list",
  templateUrl: "./purchase-requisition-list.component.html"
})
export class PurchaseRequisitionListComponent implements OnInit {
  purchasePRNInformation: any[];
  selectedPurchasePRNInformation: any[] = [];
  viewHeight: string = "600px";
  cols: any[] = [];
  constructor(
    private purchaseService: PurchaseService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: "prnNumber",
        field: "prnNumber"
      },
      {
        header: "requestBy",
        field: "requestBy"
      },
      {
        header: "description",
        field: "description"
      },
      {
        header: "total",
        field: "total"
      },
      {
        header: 'expectedDeliveryDate',
        field: 'expectedDeliveryDate'
      },
      {
        header: 'statusName',
        field: 'statusName'
      },
      {
        header: 'requestDate',
        field: 'requestDate'
      },
    ];
    this.getAllPurchasePRN();
  }
  getAllPurchasePRN() {
    this.loadingService.show();
    this.purchaseService.getAllPurchasePRN().subscribe(
      data => {
        this.loadingService.hide();
        this.purchasePRNInformation = data.requisitionNotes;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  showAddNew() {
    this.router.navigate(["/purchases-and-supplier/requisition-info"]);
  }

  editPurchase(row) {
    this.router.navigate(["/purchases-and-supplier/requisition-info"], {
      queryParams: { editrequisitioninfo: row.purchaseReqNoteId }
    });
  }
  deletePRN(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.purchaseService
            .deletePurchasePRN(row.purchaseReqNoteId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllPurchasePRN();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  sendPrnToApprovals(id) {
    this.loadingService.show();
    return this.purchaseService.sendPrntoApprovals(id).subscribe(
      res => {
        this.loadingService.show();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, "success").then(() => {
            this.getAllPurchasePRN();
          });
        } else {
          swal.fire(`GOS FINANCIAL`, message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, "error");
      }
    );
  }

  multipleDelete() {
    if (this.selectedPurchasePRNInformation.length === 0) {
      return swal.fire(`GOS FINANCIAL`, 'Select Item(s) to delete', 'error')
    }
    const ids = []
    this.selectedPurchasePRNInformation.forEach(item => {
      ids.push(item.purchaseReqNoteId)
    })
    const payload = {targetId: ids}
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });

  }

  exportItems() {
    if (this.purchasePRNInformation.length === 0) {
      return swal.fire('GOS FINANCIAL', 'No data to download', 'error')
    }

  }
}
