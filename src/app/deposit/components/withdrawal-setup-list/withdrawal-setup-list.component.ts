import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "../../../core/services/loading.service";
import { Router } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";

@Component({
  selector: "app-withdrawal-setup-list",
  templateUrl: "./withdrawal-setup-list.component.html",
  styleUrls: ["./withdrawal-setup-list.component.css"]
})
export class WithdrawalSetupListComponent implements OnInit {
  viewHeight: string = "600px";
  withdrawalSetup: any;
  selectedWithdrawal: any;
  cols: any;
  fileToUpload: File;
  @ViewChild("fileInput") fileInput: any;
  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private depositService: DepositAccountService
  ) { }

  ngOnInit() {
    this.cols = [
      {
        field: "companyName",
        header: "companyName"
      },
      {
        field: "productName",
        header: "productName"
      },
      {
        field: 'accountTypeName',
        header: 'accountTypeName'
      },
      {
        field: 'dailyWithdrawalLimit',
        header: 'dailyWithdrawalLimit'
      }
    ];
    this.getWithdrawalSetup();
  }

  editWithdrawalSetup(x) {
    this.router.navigate(["/deposit/withdrawal-setup"], {
      queryParams: {
        withdrawalSetupId: x.withdrawalSetupId
      }
    });
  }
  getWithdrawalSetup() {
    this.loadingService.show();
    return this.depositService.getWithdrawalSetups().subscribe(
      data => {
        this.withdrawalSetup = data.withdrawalSetups;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  showAddNew() {
    this.router.navigateByUrl("/deposit/withdrawal-setup");
  }
  submitMultipleDelete(payload) {
    this.loadingService.show();
    let body = { ItemIds: payload };
    this.depositService.deleteWithdrawalSetup(body).subscribe(
      data => {
        var message = data.status.message.friendlyMessage;
        this.loadingService.hide();
        if (data.deleted) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.getWithdrawalSetup();
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
    if (this.selectedWithdrawal.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedWithdrawal;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.withdrawalSetupId;
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

  exportSetup() {
    this.loadingService.show();
    this.depositService.exportWithdrawalSetup().subscribe(
      response => {
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
            const file = new File([bb], "Withdrawal Setup.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "Withdrawal Setup.xlsx"
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
    this.depositService
      .uploadWithdrawalSetup(this.fileToUpload)
      .then(data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getWithdrawalSetup();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.loadingService.hide();
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
