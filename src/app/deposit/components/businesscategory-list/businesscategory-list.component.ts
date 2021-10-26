import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { saveAs } from 'file-saver';

@Component({
  selector: "app-businesscategory-list",
  templateUrl: "./businesscategory-list.component.html"
})
export class BusinesscategoryListComponent implements OnInit {
  fileToUpload: File;
  @ViewChild('fileInput') fileInput: any;
  businessCategory: any[] = [];
  selectedbusinessCategory: any[];
  viewHeight: any = '600px';
  cols: any[];
  constructor(
    private loadingService: LoadingService,
    private DepositAccountService: DepositAccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cols = [
      { field: "name", header: "name" },
      { field: "description", header: "description" },
    ];
    this.getAllbusinessCategory();
  }

  showAddNew() {
    this.router.navigate(["/deposit/businesscategory"]);
  }

  getAllbusinessCategory() {
    this.loadingService.show();
    this.DepositAccountService.getAllbusinessCategory().subscribe(data => {
      this.loadingService.hide();
      this.businessCategory = data["businessCategories"];
    }, err => {
      this.loadingService.hide()
    });
  }
  editbusinessCategory(row) {
    this.router.navigate(["/deposit/businesscategory"], {
      queryParams: { editbusinessCategory: row.businessCategoryId }
    });
  }

  deleteBusinessCategories(formObj) {
    this.loadingService.show();
    let body = { itemIds: formObj };
    this.DepositAccountService.deleteMultiplebusinessCategory(
      body
    ).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.getAllbusinessCategory();
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
    if (this.selectedbusinessCategory.length == 0) {
      return swal.fire(`GOS FINANCIALS`, `Select an item to delete`, 'error')
    }
    let tempData = this.selectedbusinessCategory;
   const selectedItems = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.businessCategoryId;
        selectedItems.push(data);
      });
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
            this.deleteBusinessCategories(selectedItems);
          } else {
            swal.fire("GOS FINANCIAL", "Cancelled", "error");
          }
        });

    }
  }

  exportSetup() {
    this.loadingService.show();
    this.DepositAccountService.downloadBusinessCategory().subscribe(response => {
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
          const file = new File([bb], 'Business Category.xlsx', {
            type: 'application/vnd.ms-excel'
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Business Category.xlsx');
        }
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
    this.DepositAccountService.uploadBusinessCategory(this.fileToUpload).then(
      data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getAllbusinessCategory();
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.loadingService.hide();
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
