import { saveAs } from 'file-saver';
import { Validators } from '@angular/forms';
import { ProductService } from './../../../core/services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import swal from "sweetalert2";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
})
export class ProductTypeComponent implements OnInit {
  productTypeList: any[] = [];
  selectedProductType: any[];
  form: FormGroup;
  formTitle: string = "Add Product Type";
  displayProductType: boolean = false;
  cols: any[];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private productService: ProductService,
    ) {
        this.form = this.fb.group({
            productTypeId: [0],
            productTypeName: ["", Validators.required],
        });
    }

    ngOnInit() {
        this.getAllProductType();
        this.cols = [{ field: "productTypeName", header: "Product Type" }];
    }


    submitProductType(formObj) {
        this.loadingService.show();
        this.productService.addUpdateProductType(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] == true) {
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.getAllProductType();
                    this.form.reset();
                    this.displayProductType = false;
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

    showAddNew() {
        this.displayProductType = true;
    }

    getAllProductType() {
        this.loadingService.show();
        this.productService.getAllProductType().subscribe(data => {
            this.loadingService.hide();
            this.productTypeList = data["result"];

        });
    }
    editProductType(row) {
        this.formTitle = "Edit Product Type"
        this.form = this.fb.group({
            productTypeId: [row.productTypeId],
            productTypeName: [row.productTypeName, Validators.required],
        });
        this.displayProductType = true;
    }

    rowClicked(row: any): void {

      }

    deleteProductType(row) {
        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete this record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.productService
                    .deleteProductType(row.productTypeId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllProductType();
                        } else {
                            swal.fire(
                                "GOS FINANCIAL",
                                "Record not deleted",
                                "error"
                            );
                        }
                    });
            } else {
                swal.fire("GOS FINANCIAL", "Cancelled", "error");
            }
        });
    }
  exportProductType() {
        this.loadingService.show();
        this.productService.exportProductType().subscribe(response => {
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
                    var file = new File([bb], "productType.xlsx", {
                        type: "application/vnd.ms-excel"
                    });
                    saveAs(file);
                } catch (err) {
                    var textFileAsBlob = new Blob([bb], {
                        type: "application/vnd.ms-excel"
                    });
                    window.navigator.msSaveBlob(textFileAsBlob, "productType.xlsx");
                }
            }
        });
    }

    fileToUpload: File;
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }
    @ViewChild("fileInput") fileInput: any;

  uploadProductType() {
        if (this.fileToUpload == null) {
            swal.fire(
                "GOS FINANCIAL",
                "Please select upload document to continue",
                "error"
            );
            return;
        }
    if (this.fileToUpload.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      return swal.fire(
        "GOS FINANCIAL",
        "Only excel files allowed",
        "error"
      )
    }
        this.productService.uploadProductType(this.fileToUpload).then(
            data => {},
            error => {
                this.fileToUpload == null;
                this.getAllProductType();
                this.fileInput.nativeElement.value = "";
                swal.fire("GOS FINANCIAL", "Upload Successful", "success");
            }
        );
    }
    multipleDelete() {
        if (this.selectedProductType.length == 0) {
            swal.fire(
                "GOS FINANCIAL",
                "Please select records you want to delete",
                "error"
            );
            return;
        }
        let tempData = this.selectedProductType;
        let targetIds = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                let data = {
                    targetId: el.productTypeId
                };
                targetIds.push(data);
            });
        }
        let body = {
            targetIds: targetIds
        };
        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.productService
                    .deleteMultipleProductType(body)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "Record deleted successful.",
                                "success"
                            );
                            __this.getAllProductType();
                        } else {
                            swal.fire(
                                "GOS FINANCIAL",
                                "Record not deleted",
                                "error"
                            );
                        }
                    });
            } else {
                swal.fire("GOS FINANCIAL", "Cancelled", "error");
            }
        });
    }
}
