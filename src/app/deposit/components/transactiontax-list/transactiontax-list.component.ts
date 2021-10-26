import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { saveAs } from 'file-saver';


@Component({
  selector: "app-transactiontax-list",
  templateUrl: "./transactiontax-list.component.html"
})
export class TransactiontaxListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  TransactionTax: any[] = [];
  selectedTransactionTax: any[];
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
    ];
    this.getAllTransactionTax();
  }

  showAddNew() {
    this.router.navigate(["/deposit/transactiontax"]);
  }

  getAllTransactionTax() {
    this.loadingService.show();
    this.DepositAccountService.getAllTransactionTax().subscribe(data => {
      this.loadingService.hide();
      this.TransactionTax = data.transactionTaxes;
    }, err => {
      this.loadingService.hide()
    });
  }
  editTransactionTax(row) {
    this.router.navigate(["/deposit/transactiontax"], {
      queryParams: { editTransactionTax: row.transactionTaxId }
    });
  }

  deleteTransactionTax(formObj) {
    let body = { itemIds: formObj };
    this.DepositAccountService.deleteMultipleTransactionTax(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.deleted == true) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.getAllTransactionTax();
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
    if (this.selectedTransactionTax.length == 0) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
    }
    let tempData = this.selectedTransactionTax;
    const selectedItems = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.transactionTaxId;
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
          this.deleteTransactionTax(selectedItems);
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
    }
  }

  exportSetup() {
    this.loadingService.show();
    this.DepositAccountService.exportTransactionTaxCharge().subscribe(response => {
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
          const file = new File([bb], 'Transaction Tax.xlsx', {
            type: 'application/vnd.ms-excel'
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Transaction Tax.xlsx');
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
    this.DepositAccountService.uploadTransactionTaxCharge(this.fileToUpload).then(
      data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getAllTransactionTax();
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
