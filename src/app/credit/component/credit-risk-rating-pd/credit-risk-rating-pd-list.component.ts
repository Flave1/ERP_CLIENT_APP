import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import swal from "sweetalert2";
import { LoadingService } from "src/app/core/services/loading.service";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";

@Component({
  selector: "app-credit-risk-rating-pd-list",
  templateUrl: "./credit-risk-rating-pd-list.component.html"
})
export class CreditRiskRatingPDListComponent implements OnInit {
  creditRatingList: any[] = [];
  selectedCreditRating: any[] = [];
  cols: any[];
  private fileToUpload: File;
  viewHeight: any = "600px";
  checkAll: boolean;
  creditRiskRatingPDId: any;
  private targetIds: any[] = [];
  @ViewChild("fileInput") fileInput: ElementRef;
  constructor(
    private loadingService: LoadingService,
    private creditService: CreditRiskScoreCardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "pd", header: "pd" },
      { field: "minRange", header: "minRange" },
      { field: "maxRange", header: "maxRange" },
      { field: "description", header: "description" }
    ];
    this.getAllCreditRatingPD();
  }

  showAddNew() {
    this.router.navigate(["/credit/credit-risk-rating-pd"]);
  }

  getAllCreditRatingPD() {
    this.loadingService.show();
    this.creditService.getGroupedPdRating().subscribe(
      data => {
        this.loadingService.hide();
        this.creditRatingList = data.groupedCreditRiskRatingPD;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editCreditRiskRating(row) {
    this.router.navigate(["/credit/credit-risk-rating-pd"], {
      queryParams: { editcreditrating: row.creditRiskRatingPDId }
    });
  }
  onRowSelect(event) {
    this.router.navigate(["/credit/credit-risk-rating-pd"], {
      queryParams: { editcreditrating: event.data.creditRiskRatingPDId }
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
            .deleteCreditRatingPD(row.creditRiskRatingId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllCreditRatingPD();
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
    this.creditService.exportPdRiskRating().subscribe(response => {
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
          const file = new File([bb], "Credit Rating.xlsx", {
            type: "application/vnd.ms-excel"
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: "application/vnd.ms-excel"
          });
          window.navigator.msSaveBlob(textFileAsBlob, "Credit Rating.xlsx");
        }
      } else {
        swal.fire('GOS FINANCIAL', 'Unable to download data', 'error')
      }
    });
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
      .uploadPdRiskRating(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        this.loadingService.hide();
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          this.getAllCreditRatingPD();
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        this.fileInput.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", err.message, "error");
      });
  }
  multipleDelete() {
    if (this.targetIds.length === 0) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
    }
    let payload = { targetIds: this.targetIds };
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
          __this.creditService.multiDeleteRating(payload).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getAllCreditRatingPD();
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
      })
      .catch(err => {
      });
  }

  getValue(value: any) {
    // let data = {
    //   targetId: value
    // };
    this.targetIds.push(value);
  }
}
