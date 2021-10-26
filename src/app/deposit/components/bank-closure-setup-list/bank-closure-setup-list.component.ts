import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "../../../core/services/loading.service";
import { Router } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";

@Component({
  selector: "app-bank-closure-setup-list",
  templateUrl: "./bank-closure-setup-list.component.html",
  styleUrls: ["./bank-closure-setup-list.component.css"]
})
export class BankClosureSetupListComponent implements OnInit {
  setUpList: any[] = [];
  selectedSetUp: any;
  cols: any[] = [];
  viewHeight: string = "600px";
  fileToUpload: File;
  @ViewChild('fileInput') fileInput: any;
  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private depositService: DepositAccountService
  ) { }

  ngOnInit() {
    this.getSetupList();

    this.cols = [
      { field: "companyName", header: "companyName" },
      { field: "productName", header: "productName" },
      { field: "charge", header: "charge" },
      { field: "percentage", header: "percentage" }
    ];
  }

  getSetupList() {
    this.loadingService.show();
    return this.depositService.getBankClosureSetups().subscribe(
      data => {
        this.loadingService.hide();
        this.setUpList = data.bankClosureSetups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  submitMultipleDelete(payload) {
    this.loadingService.show();
    let body = { BankClosureIds: payload };
    this.depositService.deleteBankClosureSetup(body).subscribe(
      data => {
        this.loadingService.hide();
        var message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.getSetupList();
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
        let data = el.bankClosureSetupId;
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
    this.router.navigateByUrl("/deposit/bankclosure-setup");
  }

  editSetup(x) {
    this.router.navigate(["/deposit/bankclosure-setup"], {
      queryParams: {
        bankClosureSetupId: x.bankClosureSetupId
      }
    });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  exportSetup() {
    this.loadingService.show();

    this.depositService.downloadBankClosureSetup().subscribe(
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
      .uploadBankClosureSetup(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getSetupList();
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
