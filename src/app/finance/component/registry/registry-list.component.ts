import swal from "sweetalert2";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { RegistryService } from "src/app/core/services/registry";
import { StatementTypeService } from "src/app/core/services/statementtype.service";
import { saveAs } from "file-saver";
import { CompanyService } from "../../../core/services/company.service";
import { Subscription } from "rxjs";
import { JwtService } from "../../../core/services/jwt.service";
import { state } from "@angular/animations";

@Component({
  selector: "app-registry-list",
  templateUrl: "./registry-list.component.html",
  styleUrls: ["./registry-list.component.scss"]
})
export class RegistryListComponent implements OnInit {
  fileToUpload: File;
  @ViewChild("myInput")
  myInputVariable: ElementRef;
  viewHeight: any = "600px";
  industryId: any;
  registryInformation: any[] = [];
  statementTypeInformation: any[] = [];
  selectedregistryInformation: any[];
  showIndustry: boolean;
  showRegistryTemplate: boolean;
  registryTemplate: any[] = [];
  companies: any[] = [];
  staffId: number;
  cols: any[] = [];
  companyId: any;
  staffCompanyId: number;
  constructor(
    private loadingService: LoadingService,
    private registryService: RegistryService,
    private statementTypeService: StatementTypeService,
    private router: Router,
    private companyService: CompanyService,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "statementTypeAlias", header: "statementTypeAlias" },
      { field: "caption", header: "caption" },
      { field: "reportCaption", header: "reportCaption" },
      { field: "parentCaption", header: "parentCaption" },
      { field: "accountTypeName", header: "accountTypeName" },
      { field: "noteLine", header: "noteLine" },
      {
        header: "fsLine",
        field: "fsLine"
      }
    ];
    this.staffId = this.jwtService.getUserDetails().staffId;
    // this.staffCompanyId = this.jwtService.getUserDetails().companyId;
    this.getAllRegistry();
    this.getAllStatementType();
    this.getCompany();
  }

  showAddNew() {
    this.router.navigate(["/finance/registry-info"]);
  }

  getAllRegistry() {
    this.loadingService.show();
    this.registryService.getAllRegistry().subscribe(
      data => {
        this.loadingService.hide();
        this.registryInformation = data.registry;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getCompany() {
    this.loadingService.show();
    return this.companyService
      .getCompanyStructureByStatffId(this.staffId)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.companies = data.companyStructures;
        },
        () => {
          this.loadingService.hide();
        }
      );
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

  getAllRegistryByStatement(statementId) {
    this.loadingService.show();
    this.registryService
      .getAllRegistryByStatement(statementId)
      .subscribe(data => {
        this.loadingService.hide();
        this.registryInformation = data["result"];


      });
  }

  onStatementChange(statementId) {
    this.getAllRegistryByStatement(statementId);
  }

  editRegistry(row) {
    this.router.navigate(["/finance/registry-info"], {
      queryParams: { editregistry: row.registryId }
    });
  }

  rowClicked(row: any): void {
  }

  exportRegistry() {
    this.loadingService.show();
    this.registryService.exportRegistry().subscribe(
      response => {
        this.loadingService.hide();
        let data = response.export;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], "Registry.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "sales.xlsx");
          }
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  handleFileInput(file: FileList){
    this.fileToUpload = file.item(0);
  }

  uploadRegistry() {
    if (this.fileToUpload == null) {
      swal.fire("GOS FINANCIAL", "Please select upload document to continue", "error");
      return;
    }
    if (this.staffCompanyId == null) {
      swal.fire("GOS FINANCIAL", "Please select a company to continue", "error");
      return;
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show();
    let body = this.staffCompanyId;

    this.registryService
      .uploadRegistry(this.fileToUpload, body)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.myInputVariable.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
          this.getAllRegistry();
        } else {
          this.myInputVariable.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        this.myInputVariable.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  deleteRegistry(row) {
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

          __this.registryService
            .deleteRegistry(row.registryId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllRegistry();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  // uploadRegistry(){

  // }
  multipleDelete() {
    if (this.selectedregistryInformation.length == 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    let tempData = this.selectedregistryInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.registryId
        };
        targetIds.push(el.registryId);
      });
    }
    let body = {
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

          __this.registryService.deleteMultipleRegistry(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getAllRegistry();
              } else {
                this.loadingService.hide();
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
          this.loadingService.hide();
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  handleFilter(id: any) {
    if (id == 0) {
      this.showRegistryTemplate = false;
    } else {
      this.showRegistryTemplate = true;
      this.registryTemplate = [...this.registryInformation].filter(item => {
        return item.industryId == id;
      });
    }
  }

  // get companies
  filterByStatement(value: any) {
    if (value == 0) {
      return this.getAllRegistry();
    } else {
      this.loadingService.show();
      return this.registryService.getRegistryByStatement(value).subscribe(
        data => {
          this.loadingService.hide();
          this.registryInformation = data.registry;
        },
        err => {
          this.loadingService.hide();
        }
      );
    }
  }

  filterByCompany(value: any) {
    if (value == 0) {
      return this.getAllRegistry();
    } else {
      this.companyId = value;
      this.staffCompanyId = value;
      this.loadingService.show();
      return this.registryService.getRegistryByCompany(value).subscribe(
        data => {
          this.loadingService.hide();
          this.registryInformation = data.registry;
        },
        err => {
          this.loadingService.hide();
        }
      );
    }
  }

  goToVariables() {
    this.router.navigateByUrl("/finance/variables");
  }
}
