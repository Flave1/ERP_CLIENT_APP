import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { IdentificationService } from "src/app/core/services/identification.service";
import { saveAs } from "file-saver";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-identification-list",
  templateUrl: "./identification-list.component.html"
})
export class IdentificationListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  fileToUpload: File;
  identificationInformation: any[] = [];
  selectedidentificationInformation: any[];
  viewHeight: any = "600px";
  cols: any[]
  constructor(
    private loadingService: LoadingService,
    private identificationService: IdentificationService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'lookupName',
        field: 'lookupName'
      }
    ]
    this.getAllIdentification();
  }

  submitIdentificationInfo(ids) {
    this.loadingService.show();
    this.commonService.deleteMultipleIdentification(ids).subscribe(
      data => {
        this.loadingService.hide();
        if (data["result"] == true) {
          swal.fire("GOS FINANCIAL", data["message"], "success");
          this.getAllIdentification();
        } else {
          swal.fire("GOS FINANCIAL", data["message"], "error");
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
      }
    );
  }

  multipleDelete() {
    if (this.selectedidentificationInformation.length == 0) {
      return swal.fire(`GOS FINANCIAL`, "Select an item to delete", "error");
    }
    let tempData = this.selectedidentificationInformation;
    // this.identificationInformation = [];
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        targetIds.push(el.lookupId);
      });
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
            const body = { itemsId: targetIds };
            this.commonService.deleteMultipleIdentification(body).subscribe(
              data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.selectedidentificationInformation = []
                  this.getAllIdentification();
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
      // this.submitIdentificationInfo(this.identificationInformation);
    }
  }

  showAddNew() {
    this.router.navigate(["/setup/identification"]);
  }

  getAllIdentification() {
    this.loadingService.show();
    this.commonService.getIdentificationTypes().subscribe(
      data => {
        this.loadingService.hide();
        this.identificationInformation = data["commonLookups"];
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editIdentification(row) {
    this.router.navigate(["/setup/identification"], {
      queryParams: { id: row.lookupId }
    });
  }

  rowClicked(row: any): void {

  }

  deleteIdentification(row) {
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

          __this.identificationService
            .deleteIdentification(row.identificationId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllIdentification();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportIdentification() {
    this.loadingService.show();
    this.commonService.exportIdentification().subscribe(response => {
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
          const file = new File([bb], "Identification.xlsx", {
            type: "application/vnd.ms-excel"
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: "application/vnd.ms-excel"
          });
          window.navigator.msSaveBlob(textFileAsBlob, "Identification.xlsx");
        }
      }
    }, err => {
      this.loadingService.hide();
    });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

 async uploadIdentification() {
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
   await this.commonService
      .uploadIdentification(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllIdentification();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "success");
      });
  }
}
