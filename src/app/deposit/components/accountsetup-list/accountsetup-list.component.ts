import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-accountsetup-list",
  templateUrl: "./accountsetup-list.component.html"
})
export class AccountsetupListComponent implements OnInit {
  fileToUpload: File;
  @ViewChild('fileInput') fileInput: any;
  AccountSetup: any[] = [];
  selectedAccountSetup: any[];
  cols: any[];
  viewHeight: any = '600px';
  constructor(
    private loadingService: LoadingService,
    private depositAccountService: DepositAccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cols = [
      { field: "accountName", header: "accountName" },
      { field: "interestType", header: "interestType" },
      { field: "interestRate", header: "interestRate" },
      { field: "initialDeposit", header: "initialDeposit" },
      // { field: "valueDate", header: "valueDate"},
      // { field: "amount", header: "amount"},
      // { field: "transType", header: "transType"},
      // { field: "beneficiary", header: "beneficiary"},
      // { field: "firstName", header: "firstName"},
      // { field: "secondName", header: "secondName"},
    ];
    this.getAllAccountSetup();
  }

  showAddNew() {
    this.router.navigate(["/deposit/accountsetup"]);
  }

  getAllAccountSetup() {
    this.loadingService.show();
    this.depositAccountService.getAllAccountSetup().subscribe(data => {
      this.AccountSetup = data.depositAccounts;

      this.loadingService.hide();

    }, err => {
      this.loadingService.hide()
    });
  }
  editAccountSetup(row) {
    this.router.navigate(["/deposit/accountsetup"], {
      queryParams: { editAccountSetup: row.depositAccountId }
    });
  }

  deleteAccountSetups(formObj) {
    this.loadingService.show();
    let body = { itemIds: formObj };

    this.depositAccountService.deleteMultipleAccountSetup(body).subscribe(
      data => {
        const message = data.status.message.friendlyMessage;
        if (data.deleted == true) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.getAllAccountSetup();
          this.loadingService.hide();
        } else {
          swal.fire("GOSFINANCIAL", message, "error");
        }
      },
      err => {
        const message = err.status.message.friendlyMessage;
        this.loadingService.hide();
        swal.fire("GOSFINANCIAL", message, "error");
      }
    );
  }

  multipleDelete() {
    if (this.selectedAccountSetup.length == 0) {
      return swal.fire(`GOS FINANCIALS`, `Select item(s) to delete`, `error`)
    }
    let tempData = this.selectedAccountSetup;
    const selectedItems = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.depositAccountId;
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
            this.deleteAccountSetups(selectedItems);
          } else {
            swal.fire("GOS FINANCIAL", "Cancelled", "error");
          }
        });

    }
  }
  exportSetup() {
    this.loadingService.show();
    this.depositAccountService.exportAccountTypeSetup().subscribe(
      response => {
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
            const file = new File([bb], "Deposit Account Type.xlsx", {
              type: "application/vnd.ms-excel"
            });

            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "Deposit Account Type.xlsx"
            );
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
  uploadSetup() {
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
    this.depositAccountService
      .uploadAccountTypeSetup(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllAccountSetup();
          this.fileInput.nativeElement.value = "";
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
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
}
