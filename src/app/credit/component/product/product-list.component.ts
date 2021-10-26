import { ProductService } from "src/app/core/services/product.service";
import swal from "sweetalert2";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html"
})
export class ProductListComponent implements OnInit {
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
    this.router.navigate(["/credit/product-info"]);
  }
  onRowSelect(event) {
    this.router.navigate(["/credit/product-info"], {
      queryParams: { editproductinfo: event.data.productId }
    });
  }
  getAllProduct() {
    this.loadingService.show();
    this.productService.getAllProduct().subscribe(
      data => {
        this.loadingService.hide().then(() => {
          this.productInformation = data.products;
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editProduct(row) {
    this.router.navigate(["/credit/product-info"], {
      queryParams: { editproductinfo: row.productId }
    });
  }
  deleteProduct(row) {
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
    this.productService.exportProducts().subscribe(
      response => {
        this.loadingService.hide();
        let data = response.export;
        if (data != undefined) {
          let byteString = atob(data);
          let ab = new ArrayBuffer(byteString.length);
          let ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          let bb = new Blob([ab]);
          try {
            let file = new File([bb], "Products.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            let textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Products.xlsx");
          }
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
    this.productService
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
        const message = err.status.message.friendlyMessage;
        this.fileInput.nativeElement.value = "";
        swal.fire("GOS FINANCIALS", message, "error");
      });
  }
  submitMultipleDelete(formObj) {
    this.loadingService.show();
    let body = { productIds: formObj };
    this.productService.deleteMultipleProduct(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.deleted) {
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
        let data = el.productId;
        targetIds.push(data);
      });
    }
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
          this.submitMultipleDelete(targetIds);
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}
