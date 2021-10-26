import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { LoadingService } from "../../../../core/services/loading.service";
import { PpeService } from "../../../services/ppe.service";
import { saveAs } from "file-saver";
@Component({
  selector: "app-asset-classification-list",
  templateUrl: "./asset-classification-list.component.html",
  styleUrls: ["./asset-classification-list.component.css"]
})
export class AssetClassificationListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  setUpLists: any[] = [];
  cols: any;
  selectedItem: any;
  viewHeight: string = "600px";
  private fileToUpload: File;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private ppeService: PpeService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "classificationName", header: "classificationName" },
      // { field: "description", header: "description" },
      // { field: "structureLevel", header: "structureLevel" }
    ];
    this.getAssetClassifications();
  }

  getAssetClassifications() {
    this.loadingService.show();
    return this.ppeService.getAssetClassifications().subscribe(
      data => {
        this.loadingService.hide();
        this.setUpLists = data.assetClassifications;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  showAddNew() {
    this.router.navigate(["/ppe/asset-classification"]);
  }

  multipleDelete() {
    if (this.selectedItem.length == 0) {
      return swal.fire(`GOS FINANCIALS`, `Select item(s) to delete`, `error`);
    }
    let tempData = this.selectedItem;
    let ids = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        ids.push(el.asetClassificationId)
        // let data = el.depositAccountId;
        // this.AccountSetup.push(data);
      });
      const payload = {itemIds: ids};
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
            return this.ppeService.deleteAssetClassification(payload).subscribe(res => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                this.getAssetClassifications();
              } else {
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            }, err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire(`GOS FINANCIAL`, message, 'error')
            })
          } else {
            swal.fire("GOS FINANCIAL", "Cancelled", "error");
          }
        });
    }
  }
  exportItems() {
    this.loadingService.show();
    this.ppeService.exportAssetClassification().subscribe(
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
            const file = new File([bb], "Asset Classification.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "Asset Classification.xlsx"
            );
          }
        } else {
          swal.fire(`GOS FINANCIAL`, "Unable to download data", "error");
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
  uploadItems() {
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
    this.ppeService
      .uploadAssetClassification(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAssetClassifications();
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
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  editItem(x) {
    this.router.navigate(["/ppe/asset-classification"], {
      queryParams: {
        id: x.asetClassificationId
      }
    });
  }
}
