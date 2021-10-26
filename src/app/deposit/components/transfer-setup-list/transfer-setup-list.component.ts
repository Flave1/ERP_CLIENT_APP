import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { DepositAccountService } from '../../../core/services/depositaccount.service';
import { Router } from '@angular/router';
import swal from "sweetalert2";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-transfer-setup-list',
  templateUrl: './transfer-setup-list.component.html',
  styleUrls: ['./transfer-setup-list.component.css']
})
export class TransferSetupListComponent implements OnInit {
  setUpList: any;
  selectedSetUp: any;
  viewHeight: string = '600px';
  accountSetUpProduct: any[] = [];
  fileToUpload: File;
  cols: any[] = [];
  @ViewChild('fileInput') fileInput: any;

  constructor(
    private loadingService: LoadingService,
    private depositService: DepositAccountService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.getSetupList()
    this.cols = [
      { field: "companyName", header: "companyName" },
      { field: "productName", header: "productName" },
      { field: "dailyWithdrawalLimit", header: "dailyWithdrawalLimit" },
      { field: "accountTypeName", header: "accountTypeName" },
    ];
  }


  getSetupList() {
    this.loadingService.show();
    return this.depositService.getTransferSetups().subscribe(
      data => {
        this.setUpList = data.transferSetups;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  submitMultipleDelete(payload) {
    this.loadingService.show();
    let body = { ItemIds: payload };
    this.depositService.deleteTransferSetup(body).subscribe(
      data => {
        const message = data.status.message.friendlyMessage;
        this.loadingService.hide();
        if (data.deleted) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.getSetupList();
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
        let data = el.transferSetupId;
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

  showAddNew() {
    this.router.navigateByUrl('/deposit/transfer-setup')
  }

  editSetup(x) {
    this.router.navigate(['/deposit/transfer-setup'], {
      queryParams: {
        transferSetupId: x.transferSetupId
      }
    })
  }

  exportSetup() {
    this.loadingService.show();
    this.depositService.exportTransferSetup().subscribe(response => {
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
          const file = new File([bb], 'Transfer Setup.xlsx', {
            type: 'application/vnd.ms-excel'
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Transfer Setup.xlsx');
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
    this.depositService.uploadTransferSetup(this.fileToUpload).then(
      data => {
        console.log(data);
        console.log("qwerty");
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getSetupList();
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
