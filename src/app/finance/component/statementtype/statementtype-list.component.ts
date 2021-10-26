import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { StatementTypeService } from "src/app/core/services/statementtype.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-statementtype-list",
  templateUrl: "./statementtype-list.component.html"
})
export class StatementTypeListComponent implements OnInit {
  statementTypeInformation: any[] = [];
  @ViewChild("fileInput") fileInput: any;
  selectedstatementTypeInformation: any[];
  viewHeight: any = "600px";
  private fileToUpload: File;
  cols: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private statementTypeService: StatementTypeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'statementTypeName',
        field: 'statementTypeName'
      },
      {
        header: 'statementTypeAlias',
        field: 'statementTypeAlias'
      },
    ]
    this.getAllStatementType();
  }

  showAddNew() {
    this.router.navigate(["/finance/statementtype-info"]);
  }

  getAllStatementType() {
    this.loadingService.show();
    this.statementTypeService.getAllStatementType().subscribe(
      data => {
        this.loadingService.hide();
        this.statementTypeInformation = data.statementTypes;

      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editStatementType(row) {
    this.router.navigate(["/finance/statementtype-info"], {
      queryParams: { editstatementType: row.statementTypeId }
    });
  }

  rowClicked(row: any): void {

  }

  deleteStatementType(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete user?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.statementTypeService
            .deleteStatementType(row.statementTypeId)
            .subscribe(
              data => {
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                  swal.fire("GOS FINANCIAL", message, "success");
                  __this.getAllStatementType();
                } else {
                  swal.fire("GOS FINANCIAL", message, "error");
                }
                __this.loadingService.hide();
              },
              err => {
                __this.loadingService.hide();
                const message = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", message, "error");
              }
            );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportStatementType() {
    this.loadingService.show();
    this.statementTypeService.exportStatementType().subscribe(
      response => {
        this.loadingService.hide();
        // const message = response.status.message.friendlyMessage;
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
            const file = new File([bb], "Statement Type.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Statement Type.xlsx");
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
  uploadStatementType() {
    if (this.fileToUpload == null) {
      swal.fire("GOS FINANCIAL", "Please select upload document to continue", "error");
      return;
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show();
    this.statementTypeService
      .uploadStatementType(this.fileToUpload)
      .then(data => {
        const message = data.status.message.friendlyMessage;
        this.loadingService.hide();
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllStatementType();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.getAllStatementType();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        this.fileInput.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  multipleDelete() {
    if (this.selectedstatementTypeInformation.length === 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    const tempData = this.selectedstatementTypeInformation;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        // const data = {
        //     targetId: el.statementTypeId
        // };
        targetIds.push(el.statementTypeId);
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

          __this.statementTypeService
            .multipleDeleteStatementType(body)
            .subscribe(data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire(
                  "GOS FINANCIAL",
                  message,
                  "success"
                ). then(() => {
                  __this.getAllStatementType();
                });

              } else {
                swal.fire("GOS FINANCIAL", message, "error");
              }
            }, err => {
              const message = err.status.message.friendlyMessage;
              this.loadingService.hide();
              swal.fire("GOS FINANCIAL", message, "error");
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}
