import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { GLService } from "src/app/core/services/gl.service";
import { saveAs } from "file-saver";
import { CompanyService } from "../../../core/services/company.service";
import { JwtService } from "../../../core/services/jwt.service";

@Component({
  selector: "app-gl-list",
  templateUrl: "./gl-list.component.html"
})
export class GLListComponent implements OnInit {
  glInformation: any[] = [];
  @ViewChild("fileInput") fileInput: any;
  selectedglInformation: any[];
  private fileToUpload: File;
  viewHeight: any = "600px";
  companies: any[] = [];
  staffId: number;
  cols: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private glService: GLService,
    private router: Router,
    private companyService: CompanyService,
    public jwtService: JwtService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'glCode',
        field: 'glCode'
      },
      {
        header: 'glName',
        field: 'glName'
      },
    ]
    this.staffId = this.jwtService.getUserDetails().staffId;
    this.getAllGL();
    this.getCompanies();
  }

  showAddNew() {
    this.router.navigate(["/finance/gl-info"]);
  }

  getAllGL() {
    this.loadingService.show();
    this.glService.getAllGL().subscribe(
      data => {
        this.loadingService.hide();
        this.glInformation = data.gls;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editGL(row) {
    this.router.navigate(["/finance/gl-info"], {
      queryParams: { editgl: row.glId }
    });
  }

  rowClicked(row: any): void {
  }

  deleteGL(row) {
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

          __this.glService.deleteGL(row.glId).subscribe(data => {
            __this.loadingService.hide();
            if (data["result"] == true) {
              swal.fire("GOS FINANCIAL", "User deleted successful.", "success");
              __this.getAllGL();
            } else {
              swal.fire("GOS FINANCIAL", "Record not deleted", "error");
            }
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportGL() {
    this.loadingService.show();
    this.glService.exportGL().subscribe(
      response => {
        this.loadingService.hide();
          const data = response.export;
          // const message = response.status.message.friendlyMessage;
          if (data != undefined) {
            const byteString = atob(data);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const bb = new Blob([ab]);
            try {
              const file = new File([bb], "General Ledger.xlsx", {
                type: "application/vnd.ms-excel"
              });
              saveAs(file);
            } catch (err) {
              const textFileAsBlob = new Blob([bb], {
                type: "application/vnd.ms-excel"
              });
              window.navigator.msSaveBlob(
                textFileAsBlob,
                "General Ledger.xlsx"
              );
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
  uploadGL() {
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
    this.glService
      .uploadGL(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllGL();
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
        this.fileInput.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  multipleDelete() {
    if (this.selectedglInformation.length === 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    const tempData = this.selectedglInformation;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        // const data = {
        //     targetId: el.glId
        // };
        targetIds.push(el.glId);
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

          __this.glService.multipleDeleteGL(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success").then(() => {
                  __this.getAllGL();
                });
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
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  getCompanies() {
    this.loadingService.show();
    return this.companyService
      .getCompanyStructureByStatffId(this.staffId)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.companies = data.companyStructures;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }

  filterGL(value: any) {
    if (value == 0) {
      return this.getAllGL();
    } else {
      this.loadingService.show();
      return this.glService.getGLByCompany(value).subscribe(
        data => {
          this.loadingService.hide();
          this.glInformation = data.result;
        },
        err => {
          this.loadingService.hide();
        }
      );
    }
  }
}
