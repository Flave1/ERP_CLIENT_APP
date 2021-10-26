import { ProductService } from "./../../../../core/services/product.service";
import { saveAs } from "file-saver";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { IfrsService } from "src/app/core/services/ifrs.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-loan-application-score-card-history",
  templateUrl: "./loan-application-score-card-history.component.html"
})
export class LoanApplicationScoreCardHistoryComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  fileToUpload: File;
  viewHeight: any = "600px";
  cols: any[];
  scoreCardHistoryList: any[] = [];
  selectedScoreCardHistory: any[];
  products: any[] = [];
  productId: number = 0;
  customerTypeId: number = 0;
  constructor(
    private loadingService: LoadingService,
    private ifrsService: IfrsService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "loanReferenceNumber", header: "Loan Ref No" },
      { field: "customerName", header: "Customer Name" },
      { field: "productName", header: "Product Name" },
      { field: "productCode", header: "Product Code" },
      { field: "effectiveDate", header: "Effective Date" },
      { field: "maturityDate", header: "Maturity Date" }
    ];
    this.getAllScoreCardHistory();
    this.getProductLite();
  }

  getAllScoreCardHistory() {
    this.loadingService.show();
    this.ifrsService.getAllScoreCardHistory().subscribe(
      data => {
        this.loadingService.hide();
        this.scoreCardHistoryList = data.scoreCardHistory;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getProductLite() {
    this.productService.getProductLite().subscribe(
      data => {
        this.products = data["result"];
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  rowClicked(row: any): void {}

  exportScoreCardHistory() {
    // if(this.productId == 0 || this.customerTypeId == 0){
    //     swal.fire("GOS FINANCIAL", "Please select product to continue", "error");
    //     return;
    // }
    this.loadingService.show();
    this.ifrsService
      .exportHistoricalPD(this.productId, this.customerTypeId)
      .subscribe(response => {
        this.loadingService.hide();
        let data = response.export;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], "HistoricalPD.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "MacroEconomicVariable.xlsx"
            );
          }
        }
      });
  }
  // exportScoreCardHistory() {
  //     this.loadingService.show();
  //     this.ifrsService.exportScoreCardHistory().subscribe(response => {
  //         this.loadingService.hide();
  //         let data = response.result;
  //         if (data != undefined) {
  //             var byteString = atob(data);
  //             var ab = new ArrayBuffer(byteString.length);
  //             var ia = new Uint8Array(ab);
  //             for (var i = 0; i < byteString.length; i++) {
  //                 ia[i] = byteString.charCodeAt(i);
  //             }
  //             var bb = new Blob([ab]);
  //             try {
  //                 var file = new File([bb], "HistoricalPD.xlsx", {
  //                     type: "application/vnd.ms-excel"
  //                 });
  //                 saveAs(file);
  //             } catch (err) {
  //                 var textFileAsBlob = new Blob([bb], {
  //                     type: "application/vnd.ms-excel"
  //                 });
  //                 window.navigator.msSaveBlob(
  //                     textFileAsBlob,
  //                     "MacroEconomicVariable.xlsx"
  //                 );
  //             }
  //         }
  //     });
  // }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  uploadScoreCardHistory() {
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
    this.ifrsService
      .uploadScoreCardHistory(this.fileToUpload)
      .then(res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getAllScoreCardHistory();
          this.fileInput = null;
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        const message = err.status.message.friendlyMessage;
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  uploadScoreCardHistoryIR() {
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
    this.ifrsService
      .uploadScoreCardHistoryIR(this.fileToUpload)
      .then(res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getAllScoreCardHistory();
          this.fileInput = null;
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        const message = err.status.message.friendlyMessage;
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  deleteScoreCardHistory(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.ifrsService
            .deleteScoreCardHistory(row.applicationScoreCardId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire("GOS FINANCIAL", data["message"], "success");
                __this.getAllScoreCardHistory();
              } else {
                swal.fire("GOS FINANCIAL", data["message"], "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  multipleDelete() {
    if (this.selectedScoreCardHistory.length === 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    const tempData = this.selectedScoreCardHistory;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        const data = {
          targetId: el.applicationScoreCardId
        };
        targetIds.push(el.applicationScoreCardId);
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

          __this.ifrsService.multipleDeletePdHistory(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getAllScoreCardHistory();
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
