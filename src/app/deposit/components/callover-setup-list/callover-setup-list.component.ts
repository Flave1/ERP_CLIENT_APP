import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingService } from "../../../core/services/loading.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";

@Component({
  selector: "app-callover-setup-list",
  templateUrl: "./callover-setup-list.component.html",
  styleUrls: ["./callover-setup-list.component.css"]
})
export class CalloverSetupListComponent implements OnInit {
  fileToUpload: File;
  @ViewChild("fileInput") fileInput: any;
  setUpList: any[] = [];
  selectedSetup: any;
  viewHeight: string = "600px";
  cols: any[];

  constructor(
    private router: Router,
    private loadingService: LoadingService,
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
      }
    ];
    this.getCalloverSetups();
  }

  getCalloverSetups() {
    this.loadingService.show();
    return this.depositService.getCalloverSetups().subscribe(
      data => {
        this.loadingService.hide();
        this.setUpList = data.depositCashierTellerSetups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  submitMultipleDelete(payload) {
    this.loadingService.show();
    let body = { ItemIds: payload };
    this.depositService.deleteCalloverSetup(body).subscribe(
      data => {
        var message = data.status.message.friendlyMessage;
        this.loadingService.hide();
        if (data.deleted) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.getCalloverSetups();
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
        let data = el.depositCashierTellerSetupId;
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
    this.router.navigate(["/deposit/callover-setup"]);
  }

  editSetUp(x) {
    this.router.navigate(["/deposit/callover-setup"], {
      queryParams: {
        depositCashierTellerSetupId: x.depositCashierTellerSetupId
      }
    });
  }

  exportSetup() {
    this.loadingService.show();
    this.depositService.exportCallOverSetup().subscribe(
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
            const file = new File([bb], "Callover Setup.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Callover Setup.xlsx");
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
      .uploadCallOverSetup(this.fileToUpload)
      .then(data => {
        var message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getCalloverSetups();
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
        var message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
}
