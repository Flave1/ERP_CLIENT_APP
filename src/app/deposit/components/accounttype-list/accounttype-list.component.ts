import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { saveAs } from 'file-saver';

@Component({
  selector: "app-accounttype-list",
  templateUrl: "./accounttype-list.component.html"
})
export class AccounttypeListComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  accountType: any[] = [];
  selectedaccountType: any[];
  fileToUpload: File;
  viewHeight: any = '600px';
  cols: any[];
  constructor(
    private loadingService: LoadingService,
    private depositAccountService: DepositAccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cols = [
      { field: "name", header: "name" },
      { field: "description", header: "description" },
      { field: "accountNunmberPrefix", header: "accountNunmberPrefix"},
    ];
    this.getAllAccountType();
  }

  showAddNew() {
    this.router.navigate(["/deposit/accounttype"]);
  }

  getAllAccountType() {
    this.loadingService.show();
    this.depositAccountService.getAllAccountType().subscribe(data => {
      this.loadingService.hide();
      this.accountType = data.accountTypes;
    }, err => {
      this.loadingService.hide()
    });
  }
  editAccountType(row) {
    this.router.navigate(["/deposit/accounttype"], {
      queryParams: { editaccountype: row.accountTypeId }
    });
  }

  deleteAccountTypes(formObj) {
    this.loadingService.show();
    let body = { itemIds: formObj };

    this.depositAccountService.deleteMultipleAccountType(body).subscribe(
      data => {
        this.loadingService.hide();
        if (data.deleted) {
          const message = data.status.message.friendlyMessage;
          swal.fire("GOSRMS", message, "success");
          this.getAllAccountType();
        } else {
          swal.fire("GOSFINANCIAL", data["message"], "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSRMS", message, "success");
      }
    );
  }

  multipleDelete() {
    if (this.selectedaccountType.length == 0) {
      return swal.fire(`GOS FINANCIALS`, `Select item(s) to delete`, `error`)
    }
    let tempData = this.selectedaccountType;
    const selectedItems = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.accountTypeId;
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
            this.deleteAccountTypes(selectedItems);
          } else {
            swal.fire("GOS FINANCIAL", "Cancelled", "error");
          }
        });

    }
  }

  exportSetup() {
    this.loadingService.show();
    this.depositAccountService.exportAccountType().subscribe(response => {
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
          const file = new File([bb], 'Account Type Setup.xlsx', {
            type: 'application/vnd.ms-excel'
          });

          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Account Type Setup.xlsx');
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
      return swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );

    }
    if (this.fileToUpload.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      return swal.fire(
        "GOS FINANCIAL",
        "Only excel files allowed",
        "error"
      )
    }
    this.loadingService.show();
    this.depositAccountService.uploadAccountType(this.fileToUpload).then(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllAccountType();
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
