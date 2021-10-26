import { saveAs } from "file-saver";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { CompanyService } from "src/app/core/services/company.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-company-structure-definition-list",
  templateUrl: "./company-structure-definition-list.component.html"
})
export class CompanyStructureDefinitionListComponent implements OnInit {
  @ViewChild("myInput") myInput: any;
  form: FormGroup;
  myInputVariable: ElementRef;
  fileToUpload: File;
  companyStructureDefinitionList: any[] = [];
  selectedCompanyStructureDefinition: any[] = [];
  cols: any[];
  viewHeight: any = "600px";
  isMultiCompany: string = "";
  operatingLevel: string = "";
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.form = this.fb.group({
      isMultiCompany: ["", Validators.required],
      operatingLevel: [""]
    });
  }

  ngOnInit() {
    this.cols = [
      { field: "definition", header: "definition" },
      { field: "description", header: "description" },
      { field: "structureLevel", header: "structureLevel" }
    ];
    this.getAllCompanyStructureDefinition();
    this.getCompStructureDefinition();
  }

  showAddNew() {
    this.router.navigate(["/organization/company-structure-definition"]);
  }

  getAllCompanyStructureDefinition() {
    this.loadingService.show();
    this.companyService.getAllCompanyStructureDefinition().subscribe(
      data => {
        this.companyStructureDefinitionList =
          data["companyStructureDefinitions"];
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editCompanyStructureDefinition(row) {
    this.router.navigate(["/organization/company-structure-definition"], {
      queryParams: {
        editcompanyStructuredefinition: row.structureDefinitionId
      }
    });
  }
  onRowSelect(event) {
    this.router.navigate(["/organization/company-structure-definition"], {
      queryParams: {
        editcompanyStructuredefinition: event.structureDefinitionId
      }
    });
  }


  exportCompanyStructureDefinition() {
    this.loadingService.show();
    this.companyService.exportCompanyStructureDefinition().subscribe(
      response => {
        this.loadingService.hide();
        let data = response;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], "CompanyStructureDefinition.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "CompanyStructureDefinition.xlsx");
          }
        } else {
          this.loadingService.hide();
        }
      }, err => {
        this.loadingService.hide()
      });
  }



  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

 async uploadCompanyStructureDefinition() {
    if (this.fileToUpload == null) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show();
   await this.companyService
      .uploadCompanyStructureDefinition(this.fileToUpload)
      .then(data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          // this.fileToUpload = null;
          swal.fire("GOS FINANCIAL", message, "success").then(() => {
            this.myInput.nativeElement.value = "";
            this.getAllCompanyStructureDefinition();
          });
        } else {
          // this.fileToUpload = null;
          // this.getAllCompanyStructureDefinition();
          swal.fire("GOS FINANCIAL", message, "error").then(() => {
            this.myInputVariable.nativeElement.value = "";
          });
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        // this.myInputVariable.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", message, "error").then(() => {
          this.myInput.nativeElement.value = ""
        });
      });
  }

  deleteCompanyStructureDefinition(row) {
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

          __this.companyService
            .deleteCompanyStructureDefinition(row.structureDefinitionId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllCompanyStructureDefinition();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  multipleDelete() {
    if (this.selectedCompanyStructureDefinition.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedCompanyStructureDefinition;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.structureDefinitionId
        };
        targetIds.push(el.structureDefinitionId);
      });
    }
    let body = {
      structureDefinitionIds: targetIds
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

          __this.companyService
            .deleteMultipleCompanyStructureDefinition(body)
            .subscribe(
              data => {
                __this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.selectedCompanyStructureDefinition = [];
                  __this.getAllCompanyStructureDefinition();
                } else {
                  swal.fire("GOS FINANCIAL", message, "error");
                  this.selectedCompanyStructureDefinition = [];
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
  getMultiCompany(value: any) {
    //this.valueSelected = true;
    this.isMultiCompany = value;
  }

  submitCompanyStructureDefinition() {
    const payload = {
      isMultiCompany: Boolean(JSON.parse(this.isMultiCompany)),
      operatingLevel: parseInt(this.operatingLevel)
    };
    this.loadingService.show();
    this.companyService.updateStructureDefinition(payload).subscribe(
      data => {
        this.loadingService.hide();
        if (data.status.isSuccessful == true) {
          swal
            .fire(
              "GOS FINANCIAL",
              data.status.message.friendlyMessage,
              "success"
            )
            .then(() => {
              this.isMultiCompany = "";
              this.operatingLevel = "";
            });
        } else {
          swal.fire(
            "GOS FINANCIAL",
            data.status.message.friendlyMessage,
            "error"
          );
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
      }
    );
  }
  getCompStructureDefinition() {
    this.loadingService.show();
    return this.companyService.getCompStructureDefinition().subscribe(data => {
      this.isMultiCompany = data.isMultiCompany;
      this.operatingLevel = data.operatingLevel
      this.loadingService.hide();
    }, err => {
      this.loadingService.hide();

    })
  }
}
