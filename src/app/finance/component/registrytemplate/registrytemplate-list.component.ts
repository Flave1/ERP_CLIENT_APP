import swal from "sweetalert2";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { RegistryService } from "src/app/core/services/registry";
import { StatementTypeService } from "src/app/core/services/statementtype.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-registrytemplate-list",
  templateUrl: "./registrytemplate-list.component.html",
  styleUrls: ["./registrytemplate-list.component.scss"]
})
export class RegistryTemplateListComponent implements OnInit {
  fileToUpload: File;
  @ViewChild("myInput")
  myInputVariable: ElementRef;
  viewHeight: any = "600px";
  registryTemplateInformation: any[] = [];
  statementTypeInformation: any[] = [];
  selectedregistryTemplateInformation: any[];
  registryTempInfo: any[] = [];
  industry: any = "0";
  industyData: any[] = [];
  statementTypeId: any = "0";
  constructor(
    private loadingService: LoadingService,
    private registryTemplateService: RegistryService,
    private statementTypeService: StatementTypeService,
    private registryService: RegistryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.GetAllRegistryTemplate();
    this.getAllStatementType();
    this.getIndustry();
  }

  showAddNew() {
    this.router.navigate(["/finance/registrytemplate-info"]);
  }

  editRegistryTemplate(row) {
    this.router.navigate(["/finance/registrytemplate-info"], {
      queryParams: { editregistrytemplate: row.registryTemplateId }
    });

  }

  GetAllRegistryTemplate() {
    this.loadingService.show();
    this.registryTemplateService.GetAllRegistryTemplate().subscribe(
      data => {
        this.loadingService.hide();
        this.registryTemplateInformation = data.registryTemplates;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  GetAllregistryTemplateByStatement(statementId) {
    this.loadingService.show();
    this.registryTemplateService
      .GetAllregistryTemplateByStatement(statementId)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.registryTemplateInformation = data.registryTemplates;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }

  onStatementChange(statementId) {
    this.GetAllregistryTemplateByStatement(statementId);
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

  rowClicked(row: any): void {
  }

  exportRegistryTemplate() {
    this.loadingService.show();
    this.registryTemplateService
      .exportRegistryTemplate()
      .subscribe(response => {
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
            var file = new File([bb], "Registry Template.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "Registry Template.xlsx"
            );
          }
        }
      });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  uploadRegistryTemplate() {
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
    this.registryService
      .uploadRegistryTemplate(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
          if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.myInputVariable.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
          this.GetAllRegistryTemplate();
        } else {
          this.myInputVariable.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        this.myInputVariable.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", message, "success");
      });
  }

  deleteRegistryTemplate(row) {
    const __this = this;
    // swal.fire({
    //     title: "Are you sure you want to delete user?",
    //     text: "You won't be able to revert this!",
    //     type: "question",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Yes, delete it!",
    //     cancelButtonText: "No, cancel!",
    //     confirmButtonClass: "btn btn-success btn-move",
    //     cancelButtonClass: "btn btn-danger",
    //     buttonsStyling: true
    // }).then(result => {
    //     if (result.value) {
    //         __this.loadingService.show();

    //         __this.registryTemplateService
    //             .deleteRegistryTemplate(row.registryTemplateId)
    //             .subscribe(data => {
    //                 __this.loadingService.hide();
    //                 if (data["result"] == true) {
    //                     swal.fire(
    //                         "GOS FINANCIAL",
    //                         "User deleted successful.",
    //                         "success"
    //                     );
    //                     __this.GetAllRegistryTemplate();
    //                 } else {
    //                     swal.fire(
    //                         "GOS FINANCIAL",
    //                         "Record not deleted",
    //                         "error"
    //                     );
    //                 }
    //             });
    //     } else {
    //         swal.fire("GOS FINANCIAL", "Cancelled", "error");
    //     }
    // });
  }
  multipleDelete() {
    if (this.selectedregistryTemplateInformation.length == 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    let tempData = this.selectedregistryTemplateInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.registryTemplateId
        };
        targetIds.push(el.registryTemplateId);
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
          __this.registryService.deleteMultipleTemplate(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.GetAllRegistryTemplate();
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
          this.loadingService.hide();
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  getIndustry() {
    return this.registryService.GetDistinctIndustry().subscribe(
      data => {
        this.industyData = data.registry;
      },
      err => {

      },
      () => {}
    );
  }

  handleFilter(value: any) {
    this.loadingService.show();
    return this.registryService.allregistryTemplateByIndustry(value).subscribe(
      data => {
        this.loadingService.hide();
        this.registryTemplateInformation = data.registryTemplates;
      },
      err => {
        return this.loadingService.hide();
      }
    );
    // return this.registryTemplateInformation;
  }

  goBack() {
    this.router.navigateByUrl("/finance/registry-list");
  }
}
