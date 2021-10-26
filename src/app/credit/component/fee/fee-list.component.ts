import { saveAs } from "file-saver";
import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { FeeService } from "src/app/core/services/fee.service";

@Component({
  selector: "app-fee-list",
  templateUrl: "./fee-list.component.html"
})
export class FeeListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  viewHeight: any = "600px";
  fileToUpload: File;
  feeInformation: any[] = [];
  selectedfeeInformation: any[];
  cols: any[];
  constructor(
    private loadingService: LoadingService,
    private feeService: FeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [{ field: "feeName", header: "feeName" }];
    this.getAllFee();
  }

  showAddNew() {
    this.router.navigate(["/credit/fee-info"]);
  }

  getAllFee() {
    this.loadingService.show();
    this.feeService.getAllFee().subscribe(
      data => {
        this.loadingService.hide();
        this.feeInformation = data["fees"];
      },
      err => {
        this.loadingService.hide();
        let message = err.message.friendlyMessage;
        swal.fire("GOS FINANCIALS", message, "error");
      }
    );
  }
  editFee(row) {
    this.router.navigate(["/credit/fee-info"], {
      queryParams: { editfee: row.feeId }
    });
  }
  // onRowSelect(event) {
  //     this.router.navigate(["/credit/fee-info"], {
  //         queryParams: { editfee: event.data.feeId }
  //     });
  // }

  rowClicked(row: any): void {
  }

  deleteFee(row) {
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

          __this.feeService.deleteFee(row.feeId).subscribe(data => {
            __this.loadingService.hide();
            if (data["result"] == true) {
              swal.fire(
                "GOS FINANCIAL",
                "Record deleted successful.",
                "success"
              );
              __this.getAllFee();
            } else {
              swal.fire("GOS FINANCIAL", "Record not deleted", "error");
            }
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportFee() {
    this.loadingService.show();
    this.feeService.exportFee().subscribe(
      response => {
        this.loadingService.hide();
        let data = response.export;
        if (data != undefined) {
          let byteString = atob(data);
          let ab = new ArrayBuffer(byteString.length);
          let ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          let bb = new Blob([ab]);
          try {
            let file = new File([bb], "fees.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            let textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "fees.xlsx");
          }
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

  uploadFee() {
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
    this.feeService
      .uploadFee(this.fileToUpload)
      .then(data => {
        let message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getAllFee();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        let message = err.status.message.friendlyMessage;
        this.fileInput.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  multipleDelete() {
    if (this.selectedfeeInformation.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedfeeInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.feeId;
        targetIds.push(data);
      });
    }
    let body = {
      feeIds: targetIds
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

          __this.feeService.deleteMultipleFee(body).subscribe(data => {
            __this.loadingService.hide();
            const message = data.status.message.friendlyMessage;
            if (data.deleted) {
              swal.fire(
                "GOS FINANCIAL",
                message,
                "success"
              );
              __this.getAllFee();
            } else {
              swal.fire("GOS FINANCIAL", message, "error");
            }
          }, err => {
            this.loadingService.hide()
            const message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}
