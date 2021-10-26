import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { AccountTypeService } from "src/app/core/services/accounttype.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-accounttype-list",
  templateUrl: "./accounttype-list.component.html"
})
export class AccountTypeListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  accountTypeInformation: any[] = [];
  selectedaccountTypeInformation: any[];
  private fileToUpload: File;
  viewHeight: any = "600px";
  cols: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private accountTypeService: AccountTypeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'accountTypeName',
        field: 'accountTypeName'
      },
      {
        header: 'multiples',
        field: 'multiples'
      },
    ]
    this.getAllAccountType();
  }

  showAddNew() {
    this.router.navigate(["/finance/accounttype-info"]);
  }

  getAllAccountType() {
    this.loadingService.show();
    this.accountTypeService.getAllAccountType().subscribe(
      data => {
        this.loadingService.hide();
        this.accountTypeInformation = data.accountTypes;

      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editAccountType(row) {
    this.router.navigate(["/finance/accounttype-info"], {
      queryParams: { editaccountType: row.accountTypeId }
    });
  }

  rowClicked(row: any): void {

  }

  deleteAccountType(row) {
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
          __this.loadingService.show();

          __this.accountTypeService
            .deleteAccountType(row.accountTypeId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllAccountType();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportAccountType() {
    this.loadingService.show();
    this.accountTypeService.exportAccountType().subscribe(
      response => {
        this.loadingService.hide();
        // const message  = response.status.message.friendlyMessage;
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
            const file = new File([bb], "Account Type.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Account Type.xlsx");
          }
        } else {
          swal.fire(`GOS FINANCIAL`, 'Unable to download', 'error')
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire(`GOS FINANCIAL`, 'Unable to download', 'error')
      }
    );
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadAccountType() {
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
    this.accountTypeService
      .uploadAccountType(this.fileToUpload)
      .then(data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllAccountType();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {

          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
        this.loadingService.hide();
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  multipleDelete() {
    if (this.selectedaccountTypeInformation.length === 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    const tempData = this.selectedaccountTypeInformation;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        // const data = {
        //     targetId: el.accountTypeId
        // };
        targetIds.push(el.accountTypeId);
      });
    }
    const body = {
      ids: targetIds
    };
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
          __this.loadingService.show();

          __this.accountTypeService.multipleDeleteAccountType(body).subscribe(
            data => {
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success").then(() => {
                  __this.getAllAccountType();
                });
              } else {
                swal.fire("GOS FINANCIAL", message, "error");
              }
              __this.loadingService.hide();
            },
            err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOS FINANCIAL", message, "error");
            }
          );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}
