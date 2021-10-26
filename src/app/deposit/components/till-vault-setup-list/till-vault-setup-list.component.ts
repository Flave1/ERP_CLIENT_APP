import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from "../../../core/services/loading.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { saveAs } from 'file-saver';

@Component({
  selector: "app-till-vault-setup-list",
  templateUrl: "./till-vault-setup-list.component.html",
  styleUrls: ["./till-vault-setup-list.component.css"]
})
export class TillVaultSetupListComponent implements OnInit {
  viewHeight: string;
  setupList: any[] = [];
  selectedSetup: any;
  fileToUpload: File;
  @ViewChild('fileInput') fileInput: any;
  constructor(
    private loadingService: LoadingService,
    private depositService: DepositAccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTillVaultSetups();
  }

  getTillVaultSetups() {
    this.loadingService.show();
    return this.depositService.getTillVaultSetups().subscribe(
      data => {
        this.setupList = data.tillVaultSetups;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  submitMultipleDelete(payload) {
    this.loadingService.show();
    let body = { targetIds: payload };
    this.depositService.deleteTillVaultSetup(body).subscribe(
      data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.getTillVaultSetups();
          swal.fire("GOSFINANCIAL", message, "success");

          this.loadingService.hide();
        } else {
          swal.fire("GOSFINANCIAL", message, "error");
          this.loadingService.hide();
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
    if (this.selectedSetup.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedSetup;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.tillVaultSetupId;
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
    this.router.navigateByUrl("/deposit/till-vault-setup");
  }

  editSetup(x) {
    this.router.navigate(["/deposit/till-vault-setup"], {
      queryParams: {
        id: x.tillVaultSetupId
      }
    });
  }

  exportSetup() {
    this.loadingService.show();
    this.depositService.downloadTillVaultSetup().subscribe(response => {
      this.loadingService.hide();
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
          const file = new File([bb], 'Till/Vault Setup.xlsx', {
            type: 'application/vnd.ms-excel'
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Till/Vault Setup.xlsx');
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
    this.depositService.uploadTillVaultSetup(this.fileToUpload).then(

      data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getTillVaultSetups();
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
