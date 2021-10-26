import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { FinancalYearService } from "../../../core/services/financal-year.service";
import { CurrencyRateService } from "../../../core/services/currencyrate.service";
import { LoadingService } from "../../../core/services/loading.service";
import { Subscription } from "rxjs";
import { saveAs } from "file-saver";
import swal from "sweetalert2";

@Component({
  selector: "app-translation-list",
  templateUrl: "./translation-list.component.html",
  styleUrls: ["./translation-list.component.css"]
})
export class TranslationListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  translationInformation: any[] = [];
  selectedTranslation: any;
  viewHeight: string = "600px";
  fileToUpload: File;
  cols: any[] = [];
  constructor(
    private router: Router,
    private currencyRateService: CurrencyRateService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'year',
        field: 'year'
      },
      {
        header: 'averageRate',
        field: 'averageRate'
      },
      {
        header: 'closingRate',
        field: 'closingRate'
      },
      {
        header: 'currencyCode',
        field: 'currencyCode'
      },
    ]
    this.getTranslationList();
  }

  // get translation list
  getTranslationList(): Subscription {
    this.loadingService.show();
    return this.currencyRateService.getTranslationList().subscribe(
      data => {
        this.loadingService.hide();
        this.translationInformation = data.translation;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  multipleDelete() {
    if (this.selectedTranslation.length === 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    const tempData = this.selectedTranslation;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        const data = {
          targetId: el.translationId
        };
        targetIds.push(el.translationId);
      });
    }
    const body = {
      ids: targetIds
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.currencyRateService.multipleDeleteTranslation(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getTranslationList();
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

  showAddNew() {
    this.router.navigateByUrl(`/finance/translation`);
  }

  exportTranslation() {
    this.loadingService.show();
    return this.currencyRateService.exportTranslation().subscribe(
      response => {
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
            var file = new File([bb], "Translation List.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "Translation List.xlsx"
            );
          }
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadTranslation() {
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
    this.currencyRateService
      .uploadTranslation(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getTranslationList();
          this.fileInput.nativeElement.value = "";
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
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  editTranslation(row) {
    this.router.navigate(["/finance/translation"], {
      queryParams: { id: row.translationId }
    });
  }
}
