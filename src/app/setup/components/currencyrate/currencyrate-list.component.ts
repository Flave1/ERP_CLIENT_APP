import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { CurrencyRateService } from "src/app/core/services/currencyrate.service";
import { saveAs } from "file-saver";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-currencyRate-list",
  templateUrl: "./currencyrate-list.component.html"
})
export class CurrencyRateListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  fileToUpload: File;
  currencyRateInformation: any[] = [];
  selectedcurrencyRateInformation: any[];
  viewHeight: any = "600px";
  cols: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private currencyRateService: CurrencyRateService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'buyingRate',
        field: 'buyingRate'
      },
      {
        header: 'sellingRate',
        field: 'sellingRate'
      },
      {
        header: 'parentName',
        field: 'parentName'
      },
      {
        header: 'date',
        field: 'date'
      }
    ]
    this.getAllCurrencyRate();
  }

  showAddNew() {
    this.router.navigate(["/setup/currencyrate"]);
  }

  getAllCurrencyRate() {
    this.loadingService.show();
    this.commonService.getAllCurrencyRate().subscribe(
      data => {
        this.loadingService.hide();
        this.currencyRateInformation = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editCurrencyRate(row) {
    this.router.navigate(["/setup/currencyrate"], {
      queryParams: { editcurrencyRate: row.lookupId }
    });
  }
  deleteCurrencyRate(row) {
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

          __this.currencyRateService
            .deleteCurrencyRate(row.currencyRateId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllCurrencyRate();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportCurrencyRate() {
    this.loadingService.show();
    this.currencyRateService.exportCurrencyRate().subscribe(response => {
      this.loadingService.hide();
      const data = response;
      if (data != undefined) {
        const byteString = atob(data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const bb = new Blob([ab]);
        try {
          const file = new File([bb], "Currencies rate.xlsx", {
            type: "application/vnd.ms-excel"
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: "application/vnd.ms-excel"
          });
          window.navigator.msSaveBlob(textFileAsBlob, "Currencies rate.xlsx");
        }
      }
    });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  async uploadCurrencyRate() {
    if (this.fileToUpload == null) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show();
   await this.currencyRateService
      .uploadCurrencyRate(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllCurrencyRate();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
       const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  multipleDelete() {
    if (this.selectedcurrencyRateInformation.length == 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    const tempData = this.selectedcurrencyRateInformation;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        const data = {
          targetId: el.lookupId
        };
        targetIds.push(el.lookupId);
      });
    }
    const body = {
      itemsId: targetIds
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

          __this.currencyRateService.multipleDeleteCurrencyRate(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.selectedcurrencyRateInformation = [];
                __this.getAllCurrencyRate();
              } else {
                swal.fire("GOS FINANCIAL", message, "error");
              }
            },
            err => {
              const message = err.status.message.friendlyMessage;
              this.loadingService.hide();
              swal.fire("GOS FINANCIAL", message, "error");
            }
          );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}
