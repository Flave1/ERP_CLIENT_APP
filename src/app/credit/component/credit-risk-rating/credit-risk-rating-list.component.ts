import { saveAs } from "file-saver";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import swal from "sweetalert2";
import { LoadingService } from "src/app/core/services/loading.service";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { Router } from "@angular/router";

@Component({
  selector: "app-credit-risk-rating-list",
  templateUrl: "./credit-risk-rating-list.component.html"
})
export class CreditRiskRatingListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  viewHeight: any = "600px";
  fileToUpload: File;
  creditRatingList: any[] = [];
  selectedCreditRating: any[];
  cols: any[];
  constructor(
    private loadingService: LoadingService,
    private creditService: CreditRiskScoreCardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "rate", header: "rate" },
      { field: "minRange", header: "minRange" },
      { field: "maxRange", header: "maxRange" },
      { field: "rateDescription", header: "rateDescription" }
    ];
    this.getAllCreditRating();
  }

  showAddNew() {
    this.router.navigate(["/credit/credit-risk-rating"]);
  }

  getAllCreditRating() {
    this.loadingService.show();
    this.creditService.getAllCreditRating().subscribe(
      data => {
        this.loadingService.hide();
        this.creditRatingList = data.creditRiskRating;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editCreditRiskRating(row) {
    this.router.navigate(["/credit/credit-risk-rating"], {
      queryParams: { editcreditrating: row.creditRiskRatingId }
    });
  }
  onRowSelect(event) {
    this.router.navigate(["/credit/credit-risk-rating"], {
      queryParams: { editcreditrating: event.data.creditRiskRatingId }
    });
  }
  rowClicked(row: any): void {
  }

  deleteCreditRiskRating(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete user?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.creditService
            .deleteCreditRating(row.creditRiskRatingId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllCreditRating();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportCreditCreditRating() {
    this.loadingService.show();
    this.creditService.exportCreditCreditRating().subscribe(
      response => {
        this.loadingService.hide();
        const data = response.export;
        if (data != undefined) {
          const byteString = atob(data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const bb = new Blob([ab]);
          try {
            const file = new File([bb], "CreditRating.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "CreditRating.xlsx");
          }
        } else {
          swal.fire('GOS FINANCIAL', 'Unable to download data', 'error')
        }
      },
      err => {
        return this.loadingService.hide();
      }
    );
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  uploadCreditCreditRating() {
    if (this.fileToUpload == null) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
      return;
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show();
    this.creditService
      .uploadCreditCreditRating(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllCreditRating();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          // this.loadingService.hide();
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        this.fileInput.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  multipleDelete() {
    if (this.selectedCreditRating.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    const tempData = this.selectedCreditRating;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        // const data = {
        //     targetId: el.creditRiskRatingId
        // };
        targetIds.push(el.creditRiskRatingId);
      });
    }
    const body = {
      ids: targetIds
    };
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

          __this.creditService.deleteMultipleCreditRating(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getAllCreditRating();
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
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}
