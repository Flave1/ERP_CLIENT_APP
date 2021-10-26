import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { Router } from '@angular/router';
import swal from "sweetalert2";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-change-of-rate-list',
  templateUrl: './change-of-rate-list.component.html',
  styleUrls: ['./change-of-rate-list.component.css']
})
export class ChangeOfRateListComponent implements OnInit {
  fileToUpload: File;
  @ViewChild("fileInput") fileInput: any;
  changeOfRate: any[] = [];
  selectedchangeOfRate: any[];
  viewHeight: any = '600px';
  cols: any[];
  constructor(
    private loadingService: LoadingService,
    private DepositAccountService: DepositAccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cols = [
      { field: "companyName", header: "companyName" },
      { field: "canApply", header: "canApply" },
      { field: "productName", header: "productName" }, 
    ];
    this.getChangeOfRateSetupList();
  }

  showAddNew() {
    this.router.navigate(["/deposit/changeofrate"]);
  }

  getChangeOfRateSetupList() {
    this.loadingService.show();
    this.DepositAccountService.getChangeOfRateSetupList().subscribe(data => {
      this.loadingService.hide();
      this.changeOfRate = data.changeOfRateSetups;
    }, err => {
      this.loadingService.hide();
    });
  }
  editchangeOfRate(row) {
    this.router.navigate(["/deposit/changeofrate"], {
      queryParams: { changeOfRateSetupId: row.changeOfRateSetupId }
    });
  }

  deleteItems(formObj) {
    let body = { itemIds: formObj };

    this.DepositAccountService.deleteChangeOfRateSetup(
      body
    ).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.deleted) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getChangeOfRateSetupList();
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }

  multipleDelete() {
    if (this.selectedchangeOfRate.length == 0) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
    }
    let tempData = this.selectedchangeOfRate;
    const selectedItems = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        selectedItems.push(el.changeOfRateSetupId);
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
          this.loadingService.show();
          this.deleteItems(selectedItems);
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
    }
  }
  exportSetup() {
    this.loadingService.show();
    this.DepositAccountService.exportChangeOfRateSetup().subscribe(response => {
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
          const file = new File([bb], 'Change of rate.xlsx', {
            type: 'application/vnd.ms-excel'
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Change of rate.xlsx');
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
    this.DepositAccountService.uploadChangeOfRateSetup(this.fileToUpload).then(
      data => {
        var message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getChangeOfRateSetupList();
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
      var message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error');
    });
  }
}
