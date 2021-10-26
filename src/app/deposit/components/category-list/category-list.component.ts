import swal from "sweetalert2";
import {Component, OnInit, ViewChild} from '@angular/core';
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { saveAs } from 'file-saver';
@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html"
})
export class CategoryListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  category: any[] = [];
  selectedcategory: any[];
  cols: any[];
  viewHeight: any = '600px';
  fileToUpload: File;
  constructor(
    private loadingService: LoadingService,
    private DepositAccountService: DepositAccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "name", header: "name" },
      { field: "description", header: "description" },
    ];
    this.getAllcategory();
  }

  showAddNew() {
    this.router.navigate(["/deposit/category"]);
  }

  getAllcategory() {
    this.loadingService.show();
    this.DepositAccountService.getAllcategory().subscribe(data => {
      if (data) {
        this.loadingService.hide();
        this.category = data.categories;
      }
    }, err => {
      this.loadingService.hide()
    });
  }
  editcategory(row) {
    this.router.navigate(["/deposit/category"], {
      queryParams: { editcategory: row.categoryId }
    });
  }

  deleteCategory(ids:any[]) {
    this.loadingService.show();
    let body = { itemIds: ids };
    this.DepositAccountService.deleteMultiplecategory(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.deleted) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.getAllcategory();
        } else {
          swal.fire("GOSFINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSFINANCIAL", message, "error");
      }
    );
  }

  multipleDelete() {
    if (this.selectedcategory.length == 0 ) {
      return swal.fire('GOS FINANCIALS', 'Select an item(s) to delete', 'error')
    }
    let tempData = this.selectedcategory;
    const selectedItems = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data =  el.categoryId;
        selectedItems.push(data);
      });
      swal.fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      }).then(result => {
        if (result.value) {
          this.deleteCategory(selectedItems);
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });

    }
  }

  exportSetup() {
    this.loadingService.show();
    this.DepositAccountService.exportCategory().subscribe(response => {
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
          const file = new File([bb], 'Deposit Category.xlsx', {
            type: 'application/vnd.ms-excel'
          });

          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Deposit Category.xlsx');
        }
      } else {
        return swal.fire(`GOS FINANCIALS`, 'Unable to download data', 'error')
      }
    }, err => {
      return this.loadingService.hide()
    });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadSetup() {
    if (this.fileToUpload == null) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
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
    this.loadingService.show();
    this.DepositAccountService.uploadCategory(this.fileToUpload).then(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllcategory();
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      }
    ).catch(err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error');
    });
  }
}
