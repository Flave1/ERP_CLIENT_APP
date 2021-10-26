import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { DepositAccountService } from '../../../core/services/depositaccount.service';
import { Router } from '@angular/router';
import swal from "sweetalert2";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-transaction-correction-setup-list',
  templateUrl: './transaction-correction-setup-list.component.html',
  styleUrls: []
})
export class TransactionCorrectionSetupListComponent implements OnInit {
  setUpList: any;
  selectedSetUp: any;
  viewHeight: string = '600px';
  fileToUpload: File;
  cols: any[] = [];

  @ViewChild('fileInput') fileInput: any;
  constructor(
    private loadingService: LoadingService,
    private depositService: DepositAccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTransactionCorrectionSetup()
    this.cols = [
      { field: "companyName", header: "companyName" },
      { field: "jobTitle", header: "jobTitle" },
      { field: "presetChart", header: "presetChart" },
    ];
  }

  getTransactionCorrectionSetup() {
    this.loadingService.show();
    return this.depositService.getTransactionCorrectionSetups().subscribe(data => {
      this.setUpList = data.transactionCorrectionSetups;
      this.loadingService.hide();
    }, err => {
      this.loadingService.hide();
    })
  }
  submitMultipleDelete(payload) {
    this.loadingService.show();
    let body = { itemIds: payload };
    this.depositService.deleteTransactionCorrectionSetups(
      body
    ).subscribe(
      data => {
        var message = data.status.message.friendlyMessage;
        this.loadingService.hide();
        if (data.status.isSuccessful) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.getTransactionCorrectionSetup();
        } else {
          swal.fire("GOSFINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        var message = err.status.message.friendlyMessage;
        swal.fire("GOSFINANCIAL", message, "error");
      }
    );
  }
  multipleDelete() {
    if (this.selectedSetUp.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedSetUp;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.transactionCorrectionSetupId
        targetIds.push(data);
      });
    }
    const __this = this;
    swal.fire({
      title: "Are you sure you want to delete record?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!"
    }).then(result => {
      if (result.value) {
        this.submitMultipleDelete(targetIds)
      } else {
        swal.fire("GOS FINANCIAL", "Cancelled", "error");
      }
    });
  }
  showAddNew() {
    this.router.navigateByUrl('/deposit/transaction-correction-setup')
  }

  editSetup(x) {
    this.router.navigate(['/deposit/transaction-correction-setup'], {
      queryParams: {
        id: x.transactionCorrectionSetupId
      }
    })
  }

  exportSetup() {
    this.loadingService.show();
    this.depositService.downloadTransactionCorrectionSetup().subscribe(response => {
      const data = response.excelFile;
      if (data != undefined) {
        const byteString = atob(data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const bb = new Blob([ab]);
        try {
          const file = new File([bb], 'Transaction Correction.xlsx', {
            type: 'application/vnd.ms-excel'
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Transaction Correction.xlsx');
        }
        this.loadingService.hide();
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
    this.depositService.uploadTransactionCorrectionSetup(this.fileToUpload).then(
      data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getTransactionCorrectionSetup();
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
          this.loadingService.hide();
        }
      }
    ).catch(err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error');
    });
  }
}
