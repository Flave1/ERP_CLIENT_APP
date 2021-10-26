import { saveAs } from "file-saver";
import {Component, OnInit, ViewChild} from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { IfrsService } from "src/app/core/services/ifrs.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-loan-lgd-history",
  templateUrl: "./loan-lgd-history.component.html"
})
export class LoanLgdHistoryComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  cols: any[];
  lgdHistoryList: any[] = [];
  selectedLGDHistory: any[];
  fileToUpload: File;
  viewHeight: any = "600px";
  constructor(
    private loadingService: LoadingService,
    private ifrsService: IfrsService,
    private router: Router
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
    this.getAllLGDHistory();
  }

  getAllLGDHistory() {
    this.loadingService.show();
    this.ifrsService.getAllLGDHistory().subscribe(
      data => {
        this.loadingService.hide();
        this.lgdHistoryList = data.lgdHistory;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  rowClicked(row: any): void {}

  exportLGDHistory() {
    this.loadingService.show();
    this.ifrsService.exportLGDHistory().subscribe(response => {
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
          var file = new File([bb], "HistoricalLGD.xlsx", {
            type: "application/vnd.ms-excel"
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: "application/vnd.ms-excel"
          });
          window.navigator.msSaveBlob(textFileAsBlob, "HistoricalLGD.xlsx");
        }
      }
    });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  uploadLGDHistory() {
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
    this.ifrsService.uploadLGDHistory(this.fileToUpload).then(
      data => {
        this.loadingService.hide();
        if (data.status.isSuccessful) {
          this.fileInput.nativeElement = '';
          swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "success");
          this.getAllLGDHistory()
        } else {
          this.fileInput.nativeElement = '';
          swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
          this.getAllLGDHistory()
        }
      }
    ).catch(err => {
      this.loadingService.hide();
      this.fileInput.nativeElement = '';
      const message = err.status.message.friendlyMessage;
      swal.fire("GOS FINANCIAL", message, "error");
    });
  }

  deleteLGDHistory(row) {
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
            .deleteLGDHistory(row.historicalLGDId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire("GOS FINANCIAL", data["message"], "success");
                __this.getAllLGDHistory();
              } else {
                swal.fire("GOS FINANCIAL", data["message"], "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  multipleDeleteHistory() {
    if (this.selectedLGDHistory.length === 0) {
      return swal.fire(`GOS FINANCIAL`, "Select a record to delete", "error");
    }
    let tempData = this.selectedLGDHistory;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.historicalLGDId
        };
        targetIds.push(el.historicalLGDId);
      });
    }
    let payload = { ids: targetIds };
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
          return this.ifrsService.multiDeleteLgdHistory(payload).subscribe(
            res => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.getAllLGDHistory();
              } else {
                return swal.fire("GOS FINANCIAL", message, "error");
              }
            },
            err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOS FINANCIAL", message, "error");
            }
          );
        }
      })
      .catch(err => {

      });
  }
}
