import swal from "sweetalert2";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { CountryService } from "src/app/core/services/country.service";
import { saveAs } from "file-saver";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-country-list",
  templateUrl: "./country-list.component.html"
})
export class CountryListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  countryInformation: any[] = [];
  selectedcountryInformation: any[];
  viewHeight: any = "600px";
  fileToUpload: File;
  cols: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private countryService: CountryService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'code',
        field: 'code'
      },
      {
        header: 'lookupName',
        field: 'lookupName'
      }
    ]
    this.getAllCountry();
  }

  submitCountryInfo(ids) {}

  multipleDelete() {
    if (this.selectedcountryInformation.length == 0) {
      return swal.fire("GOS FINANCIAL", "Select item to delete", "error");
    }
    const tempData = this.selectedcountryInformation;
    let targetIds = [];
    // this.countryInformation = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.lookupId;
       targetIds.push(el.lookupId);
      });
      swal
        .fire({
          title: "Are you sure you want to delete record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!",
          buttonsStyling: true
        })
        .then(result => {
          if (result.value) {
            const body = { itemsId: targetIds };
            this.loadingService.show();
            this.commonService.deleteMultipleCountry(body).subscribe(
              data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.selectedcountryInformation = [];
                  this.getAllCountry();
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

  showAddNew() {
    this.router.navigate(["/setup/country"]);
  }

  getAllCountry() {
    this.loadingService.show();
    this.commonService.getAllCountry().subscribe(
      data => {
        this.loadingService.hide();
        this.countryInformation = data.commonLookups;


      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editCountry(row) {
    this.router.navigate(["/setup/country"], {
      queryParams: { id: row.lookupId }
    });
  }

  rowClicked(row: any): void {

  }

  deleteCountry(row) {
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

          __this.countryService.deleteCountry(row.countryId).subscribe(data => {
            __this.loadingService.hide();
            if (data["result"] == true) {
              swal.fire("GOS FINANCIAL", "User deleted successful.", "success");
              __this.getAllCountry();
            } else {
              swal.fire("GOS FINANCIAL", "Record not deleted", "error");
            }
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportCountryList() {
    this.loadingService.show();
    this.commonService.exportCountryList().subscribe(
      response => {
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
            const file = new File([bb], "Countries.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Countries.xlsx");
          }
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error')
      }
    );
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

 async uploadCountryList() {
    if (this.fileToUpload == null) {
      swal.fire("GOS FINANCIAL", "Please select upload document to continue", "error");
      return;
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show();
    await this.commonService
      .uploadCountryList(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllCountry();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.getAllCountry();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        let error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
}
