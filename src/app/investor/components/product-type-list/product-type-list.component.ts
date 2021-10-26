import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "../../../core/services/loading.service";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { saveAs } from "file-saver";

@Component({
  selector: "app-product-type-list",
  templateUrl: "./product-type-list.component.html",
  styleUrls: ["./product-type-list.component.css"]
})
export class ProductTypeListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  cols: any[];
  activeIndex: number = 0;
  productInformation: any[] = [];
  selectedProductInformation: any[];
  viewHeight: any = "600px";
  fileToUpload: File;
  constructor(
    private loadingService: LoadingService,
    private investorFundService: InvestorFundService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "productTypeName", header: "productTypeName" },

    ];
    this.getAllProduct();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }
  showAddNew() {
    this.router.navigate(["/investor/product-type-setup"]);
  }
  // onRowSelect(event) {
  //     this.router.navigate(["/investor/product-type-setup"], {
  //         queryParams: { editProductTypeId: event.data.productId }
  //     });
  // }
  getAllProduct() {
    this.loadingService.show();
    this.investorFundService.getAllProductType().subscribe(
      data => {
        this.loadingService.hide();
        this.productInformation = data.infProductTypes;
      },
      err => {
        return this.loadingService.hide();
      }
    );
  }
  editProduct(row) {
    this.router.navigate(["/investor/product-type-setup"], {
      queryParams: { editProductTypeId: row.productTypeId }
    });
  }

  openNext() {
    this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 2 : this.activeIndex - 1;
  }

  exportProductInformation() {
    this.loadingService.show();
    this.investorFundService.exportProductType().subscribe(
      response => {
        this.loadingService.hide();
        let data = response.result;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], "Investor Product Type.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "Investor Product Type.xlsx"
            );
          }
        } else {
          return swal.fire("GOS FINANCIALS", "An error occurred", "error");
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

  uploadProductInformation() {
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
    this.investorFundService
      .uploadProductType(this.fileToUpload)
      .then(data => {
        if (data.success) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          this.getAllProduct();
          swal.fire("GOS FINANCIALS", data.message, "success");
        } else {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIALS", data.message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = "";
        swal.fire("GOS FINANCIALS", err.message, "error");
      });
  }
  multipleDelete() {
    if (this.selectedProductInformation.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedProductInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.productTypeId
        };
        targetIds.push(data);
      });
    }
    let body = { targetIds: targetIds };
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
          this.loadingService.show();
          return this.investorFundService
            .multipleDeleteProductType(body)
            .subscribe(
              res => {
                this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.getAllProduct();
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
      })
      .catch(err => {
      });
  }
}
