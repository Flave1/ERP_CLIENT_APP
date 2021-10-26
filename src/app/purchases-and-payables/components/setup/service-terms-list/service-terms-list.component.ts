import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { SupplierService } from "../../../../core/services/supplier.service";
import { LoadingService } from "../../../../core/services/loading.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";

@Component({
  selector: "app-service-terms-list",
  templateUrl: "./service-terms-list.component.html",
  styleUrls: ["./service-terms-list.component.css"]
})
export class ServiceTermsListComponent implements OnInit, OnDestroy {
  @ViewChild("fileInput") fileInput: any;
  fileToUpload: File;
  cols: any[];
  setUpLists: any[];
  selectedItem: any;
  viewHeight: string = "600px";

  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        field: 'header',
        header: 'header'
      },
      {
        field: 'description',
        header: 'description'
      },
    ]
    this.getServiceTerms();
  }

  multipleDelete() {
    if (this.selectedItem.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedItem;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.serviceTermsId
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

          __this.supplierService.deleteServiceTerms(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.selectedItem = [];
                __this.getServiceTerms();
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
    this.router.navigateByUrl("/purchases-and-supplier/service-terms");
  }

  exportItems() {
    this.loadingService.show();
    this.supplierService.exportServiceTerms().subscribe(
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
            var file = new File([bb], "Service Terms List.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {

            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "Service Terms List.xlsx"
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
      .uploadServiceTerms(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          this.getServiceTerms();
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err =>{
        this.fileInput.nativeElement.value = "";
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  handleFileInput(file: any) {
    this.fileToUpload = file.item(0);
  }

  editItem(x) {
    this.router.navigate(["/purchases-and-supplier/service-terms"], {
      queryParams: {
        id: x.serviceTermsId
      }
    });
  }

  getServiceTerms() {
    this.loadingService.show();
    return this.supplierService.getServiceTerms().subscribe(
      data => {
        this.loadingService.hide();
        this.setUpLists = data.serviceTerms;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  ngOnDestroy(): void {
    // this.getServiceTerms().unsubscribe()
  }
}
