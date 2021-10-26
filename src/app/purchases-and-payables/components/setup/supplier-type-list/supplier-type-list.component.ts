import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { SupplierService } from "../../../../core/services/supplier.service";
import { LoadingService } from "../../../../core/services/loading.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";

@Component({
  selector: "app-supplier-type-list",
  templateUrl: "./supplier-type-list.component.html",
  styleUrls: ["./supplier-type-list.component.css"]
})
export class SupplierTypeListComponent implements OnInit, OnDestroy {
  @ViewChild("fileInput") fileInput: any;
  fileToUpload: File;
  cols: any[];
  setUpLists: any[];
  selectedItem: any;
  viewHeight: string = "600px";
  subGls: any[] = [];
  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        field: "supplierTypeName",
        header: "supplierTypeName"
      },
      {
        field: "taxApplicableName",
        header: "taxApplicableName"
      },
      {
        field: "gl",
        header: "gl"
      }
    ];
    this.getSupplierTypes();
  }

  // get supplier types
  getSupplierTypes() {
    this.loadingService.show();
    return this.supplierService.getSupplierTypes().subscribe(
      data => {
        this.loadingService.hide();
        this.setUpLists = data.suppliertypes;
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
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.supplierTypeId
        };
        targetIds.push(data);
      });
    }
    let body = {
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

          __this.supplierService.deleteSupplierTypes(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success").then(() => {
                  this.selectedItem = [];
                  __this.getSupplierTypes();
                });
              } else {
                swal.fire("GOS FINANCIAL", message, "error").then(() => {
                  this.selectedItem = [];
                });
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
    this.router.navigateByUrl("/purchases-and-supplier/supplier-type");
  }

  exportItems() {
    this.loadingService.show();
    this.supplierService.exportSupplierType().subscribe(
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
            var file = new File([bb], "Supplier Type List.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "Supplier Type List.xlsx"
            );
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
      .uploadSupplierType(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          this.getSupplierTypes();
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.fileInput.nativeElement.value = "";
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  handleFileInput(file: any) {
    this.fileToUpload = file.item(0);
  }

  editItem(x) {
    this.router.navigate(["/purchases-and-supplier/supplier-type"], {
      queryParams: {
        id: x.supplierTypeId
      }
    });
  }
  ngOnDestroy(): void {
    // this.getSupplierTypes().unsubscribe()
  }
}
