import { Component, OnInit } from "@angular/core";
import { CreditClassificationService } from "../../../../core/services/creditclassification.service";
import { Router } from "@angular/router";
import { LoadingService } from "src/app/core/services/loading.service";
import swal from "sweetalert2";

@Component({
  selector: "app-credit-classification-list",
  templateUrl: "./credit-classification-list.component.html"
})
export class CreditClassificationListComponent implements OnInit {
  creditClassifications: any[] = [];
  selectedcreditClassification: any[];
  cols: any[];
  viewHeight: any = "600px";

  constructor(
    private loadingService: LoadingService,
    private creditClassificationService: CreditClassificationService,
    private router: Router
  ) {}
  ngOnInit() {
    this.cols = [
      { field: "daysAtRisk", header: "daysAtRisk" },
      { field: "description", header: "description" },
      { field: "provisioningRequirement", header: "provisioningRequirement" }
      // { field: "provisioningRequirement", header: "provisioningRequirement" }
    ];
    this.getAllCreditClassifications();
  }
  getAllCreditClassifications() {
    this.loadingService.show();
    return this.creditClassificationService
      .getAllCreditClassification()
      .subscribe(
        data => {
          this.loadingService.hide();
          this.creditClassifications = data.creditClassification;
        },
        err => {
          this.loadingService.hide();
          swal.fire(
            "CREDIT CLASSTFICATION",
            "Please connect to internet service",
            "error"
          );
        }
      );
  }

  rowClicked(e: any) {}

  deleteListCreditClassification() {
    if (
      this.selectedcreditClassification == null ||
      this.selectedcreditClassification.length == 0
    ) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }

    let ids: any[] = [];
    this.selectedcreditClassification.forEach(x =>
      ids.push(x.creditClassificationId)
    );

    swal
      .fire({
        title: "Are you sure you want to delete these record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          this.loadingService.show();
          this.creditClassificationService
            .deleteListOfCreditClassification(ids)
            .subscribe(
              data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.deleted) {
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.getAllCreditClassifications();
                } else {
                  swal.fire("GOS FINANCIAL", message, "error");
                }
                this.selectedcreditClassification = [];
              },
              err => {
                this.loadingService.hide();
                const message = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", message, "error");
              }
            );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
          this.selectedcreditClassification = [];
        }
      });
  }

  deleteCreditClassification(row: any) {
    let creditClassificationDescription: string = "";
    creditClassificationDescription = row.description;
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
          this.loadingService.show();
          this.creditClassificationService
            .deleteCreditClassification(row.creditClassificationId)
            .subscribe(data => {
              this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  `${creditClassificationDescription} deleted successfully.`,
                  "success"
                );
                this.getAllCreditClassifications();
              } else {
                swal.fire(
                  "GOS FINANCIAL",
                  `Record ${creditClassificationDescription} not deleted`,
                  "error"
                );
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  editItem(row?: any) {
    let id: number = 0;
    if (row) {
      id = row.creditClassificationId;
    }
    this.router.navigate(["/credit/credit-classification-update"], {
      queryParams: { id: id }
    });
  }

  multipleDelete() {}

  addOrUpdateCreditClassification() {
    this.router.navigateByUrl("/credit/credit-classification-update");
  }
}
