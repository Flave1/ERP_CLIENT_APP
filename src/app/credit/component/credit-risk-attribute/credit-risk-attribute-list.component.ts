import { saveAs } from "file-saver";
import swal from "sweetalert2";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-credit-risk-attribute-list",
  templateUrl: "./credit-risk-attribute-list.component.html"
})
export class CreditRiskAttributeListComponent implements OnInit {
  fileToUpload: File;
  @ViewChild("fileInput") fileInput: ElementRef;
  viewHeight: any = "600px";
  attibutes: any[] = [];
  selectedAttribute: any[];
  cols: any[];
  constructor(
    private loadingService: LoadingService,
    private creditService: CreditRiskScoreCardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "creditRiskAttribute", header: "creditRiskAttribute" },
      {
        field: "creditRiskCategoryName",
        header: "creditRiskCategoryName"
      }
    ];
    this.getAllAttribute();
  }

  showAddNew() {
    this.router.navigate(["/credit/attribute"]);
  }

  getAllAttribute() {
    this.loadingService.show();
    this.creditService.getAllCreditRiskAttribute().subscribe(
      data => {
        this.loadingService.hide();
        this.attibutes = data.creditRiskAttibutes;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editAttribute(row) {
    this.router.navigate(["/credit/attribute"], {
      queryParams: { id: row.creditRiskAttributeId }
    });
  }
  onRowSelect(event) {
    this.router.navigate(["/credit/attribute"], {
      queryParams: { id: event.data.creditRiskAttributeId }
    });
  }
  rowClicked(row: any): void {
  }

  deleteAttribute(row) {
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
            .deleteCreditRiskAttribute(row.creditRiskAttributeId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllAttribute();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  exportCreditRiskAttribute() {
    this.loadingService.show();
    this.creditService.exportCreditRiskAttribute().subscribe(
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
            var file = new File([bb], "CreditRiskAttribute.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "CreditRiskAttribute.xlsx"
            );
          }
        } else {
          swal.fire('GOS FINANCIAL', 'Unable to download data', 'info')
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

  uploadCreditRiskAttribute() {
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
      .uploadCreditRiskAttribute(this.fileToUpload)
      .then(data => {
        const msg = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getAllAttribute();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", msg, "success");
        } else {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", msg, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = "";
        const msg = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", msg, "success");
      });
  }
  multipleDelete() {
    if (this.selectedAttribute.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedAttribute;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        // let data = {
        //     targetId: el.creditRiskAttributeId
        // };
        targetIds.push(el.creditRiskAttributeId);
      });
    }
    let body = {
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

          __this.creditService
            .deleteMultipleCreditRiskAttribute(body)
            .subscribe(
              data => {
                __this.loadingService.hide();
                const msg = data.status.message.friendlyMessage;
                if (data.deleted) {
                  swal.fire("GOS FINANCIAL", msg, "success");
                  __this.getAllAttribute();
                } else {
                  swal.fire("GOS FINANCIAL", msg, "error");
                }
              },
              err => {
                this.loadingService.hide();
                const msg = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", msg, "error");
              }
            );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}
