import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { saveAs } from 'file-saver';

@Component({
  selector: "app-transactioncharge-list",
  templateUrl: "./transactioncharge-list.component.html"
})
export class TransactionchargeListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  TransactionCharge: any[] = [];
  selectedTransactionCharge: any[] = [];
  viewHeight: any = '600px';
  cols: any[];
  fileToUpload: File;
  constructor(
    private loadingService: LoadingService,
    private DepositAccountService: DepositAccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cols = [
      { field: "name", header: "name" },
      { field: "fixedOrPercentage", header: "fixedOrPercentage" },
      { field: "amount_Percentage", header: "amount_Percentage" },
      { field: "description", header: "description" },
    ];
    this.getAllTransactionCharge();
  }

  showAddNew() {
    this.router.navigate(["/deposit/transactioncharge"]);
  }

  getAllTransactionCharge() {
    this.loadingService.show();
    this.DepositAccountService.getAllTransactionCharge().subscribe(data => {
      this.loadingService.hide();
      this.TransactionCharge = data.transactionCharges;


    }, err => {
      this.loadingService.hide()
    });
  }
  editTransactionCharge(row) {
    this.router.navigate(["/deposit/transactioncharge"], {
      queryParams: { editTransactionCharge: row.transactionChargeId }
    });
  }

  deleteTransactionCharge(formObj) {
    let body = { itemIds: formObj };

    this.DepositAccountService.deleteMultipleTransactionCharge(
      body
    ).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.deleted == true) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.getAllTransactionCharge();
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
    if (this.selectedTransactionCharge.length == 0) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
    }
    let tempData = this.selectedTransactionCharge;
    const selectedItems = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.transactionChargeId;
        selectedItems.push(data);
      });
      const __this = this;
      swal.fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      }).then(result => {
        if (result.value) {
          this.deleteTransactionCharge(selectedItems);
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
    }
  }

  exportSetup() {
    this.loadingService.show();
    this.DepositAccountService.exportTransactionCharge().subscribe(response => {
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
          const file = new File([bb], 'Transaction Charge.xlsx', {
            type: 'application/vnd.ms-excel'
          });

          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Transaction Charge.xlsx');
        }
      } else {
        return swal.fire(`GOS FINANCIALS`, `Unable to download data`, 'error')
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
    this.DepositAccountService.uploadTransactionCharge(this.fileToUpload).then(
      data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getAllTransactionCharge();
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
