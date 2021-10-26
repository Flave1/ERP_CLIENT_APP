import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingService } from "../../../../core/services/loading.service";
import { SupplierService } from "../../../../core/services/supplier.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";
import {Subscription} from "rxjs";

@Component({
  selector: "app-tax-setup-list",
  templateUrl: "./tax-setup-list.component.html",
  styleUrls: ["./tax-setup-list.component.css"]
})
export class TaxSetupListComponent implements OnInit, OnDestroy {
  @ViewChild("fileInput") fileInput: any;
  fileToUpload: File;
  cols: any[];
  setUpLists: any;
  selectedItem: any;
  viewHeight: string = "600px";

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private supplierService: SupplierService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        field: "taxName",
        header: "taxName"
      },
      {
        field: "percentage",
        header: "percentage"
      },
      {
        field: "type",
        header: "type"
      },
      {
        field: "subGL",
        header: "subGL"
      }
    ];
    this.getTaxSetups();
  }

  // get tax set ups
  getTaxSetups(): Subscription {
    this.loadingService.show();
    return this.supplierService.getTaxSetups().subscribe(
      data => {
        if (data) {
          this.loadingService.hide();
          this.setUpLists = data.tasxSetups;
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  multipleDelete() {
    if (this.selectedItem.length == 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    let tempData = this.selectedItem;
    let targetIds = [];
    let body = {};
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.taxSetupId
        };
        targetIds.push(data);
      });
    }
    body = {
      req: targetIds
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

          __this.supplierService.deleteTaxSetups(body).subscribe(
            res => {
              __this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.deleted) {
                swal.fire("GOS FINANCIAL", message, "success").then(() => {
                  this.selectedItem = [];
                  __this.getTaxSetups();
                });
              } else {
                this.selectedItem = [];
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
    this.router.navigateByUrl("/purchases-and-supplier/tax-setup");
  }

  exportItems() {
    this.loadingService.show();
    this.supplierService.exportTaxSetup().subscribe(
      response => {
        this.loadingService.hide();
        let data = response;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], "Tax Setup List.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Tax Setup List.xlsx");
          }
        } else {
          return swal.fire("GOS FINANCIAL", "An error occurred", "error");
        }
      },
      err => {
        return this.loadingService.hide();
      }
    );
  }
  uploadItems() {
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
    this.supplierService
      .uploadTaxSetup(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          this.getTaxSetups();
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = "";
        const error = JSON.parse(err);
        const message = error.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  handleFileInput(file: any) {
    this.fileToUpload = file.item(0);
  }

  editItem(x) {
    this.router.navigate(["/purchases-and-supplier/tax-setup"], {
      queryParams: {
        id: x.taxSetupId
      }
    });
  }
  ngOnDestroy(): void {
    // this.getTaxSetups().unsubscribe()
  }
}
