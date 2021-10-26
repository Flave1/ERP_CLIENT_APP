import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "../../../core/services/loading.service";
import { ProductService } from "../../../core/services/product.service";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { saveAs } from "file-saver";
import { TreasuryService } from "../../../core/services/treasury.service";

@Component({
  selector: "app-treasury-product-list",
  templateUrl: "./treasury-product-list.component.html",
  styleUrls: ["./treasury-product-list.component.css"]
})
export class TreasuryProductListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  cols: any[];
  activeIndex: number = 0;
  productInformation: any[] = [];
  selectedProductInformation: any[];
  viewHeight: any = "600px";
  fileToUpload: File;
  constructor(
    private loadingService: LoadingService,
    private productService: ProductService,
    private treasuryService: TreasuryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "productCode", header: "productCode" },
      { field: "productName", header: "productName" },
      { field: "paymentTypeName", header: "paymentTypeName" },
      { field: "rate", header: "rate" }
    ];
    this.getAllProduct();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }
  showAddNew() {
    this.router.navigate(["/treasury/product"]);
  }
  onRowSelect(event) {
    this.router.navigate(["/treasury/product"], {
      queryParams: { editproductinfo: event.data.productId }
    });
  }
  getAllProduct() {
    this.loadingService.show();
    this.treasuryService.getAllProducts().subscribe(
      data => {
        this.loadingService.hide();
        this.productInformation = data.products;
      },
      err => {
        return this.loadingService.hide();
      }
    );
  }
  editProduct(row) {
    this.router.navigate(["/treasury/product"], {
      queryParams: { editproductId: row.productId }
    });
  }
  deleteProduct(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete user?",
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.productService.deleteProduct(row.productId).subscribe(data => {
            __this.loadingService.hide();
            if (data["result"] == true) {
              swal.fire("GOS FINANCIAL", "User deleted successful.", "success");
              __this.getAllProduct();
            } else {
              swal.fire("GOS FINANCIAL", "Record not deleted", "error");
            }
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
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
    this.treasuryService.exportProduct().subscribe(
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
            var file = new File([bb], "Treasury Products.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {

            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "Treasury Products.xlsx"
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
    this.treasuryService
      .uploadProducts(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          this.getAllProduct();
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
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  multipleDelete() {
    if (this.selectedProductInformation.length == 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    let tempData = this.selectedProductInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        // let data = {
        //     targetId: el.productId
        // };
        targetIds.push(el.productId);
      });
    }
    let body = { itemIds: targetIds };
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
          return this.treasuryService.multipleDeleteProduct(body).subscribe(
            res => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage
              if (res.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.selectedProductInformation = [];
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
