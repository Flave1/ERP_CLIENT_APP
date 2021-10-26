import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { GLMappingService } from "src/app/core/services/glmapping.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegistryService } from "src/app/core/services/registry";
import { CompanyService } from "src/app/core/services/company.service";
import { JwtService } from "../../../core/services/jwt.service";

@Component({
  selector: "app-glRemap-list",
  templateUrl: "./glremap-list.component.html"
})
export class GLRemapListComponent implements OnInit {
  registryInformation: any[] = [];
  mappedCurrencies: any[];
  subCaptionOption: any[] = [];
  cols: any[];
  selectedCurrencies: any;
  captionInformation: any[] = [];
  subCaptionInformation: any[] = [];
  companyInformation: any[] = [];
  glRemapForm: FormGroup;
  glRemapInformation: any[] = [];
  selectedglRemapInformation: any[];
  displayMapping = false;
  displayUnMappingGL = false;
  glRemapFormGroup: FormGroup;
  viewHeight: any = "600px";
  staffId: number;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private glRemapService: GLMappingService,
    private registryService: RegistryService,
    private companyService: CompanyService,
    private router: Router,
    private jwtService: JwtService
  ) {
    this.glRemapForm = this.fb.group({
      glMappingId: [0],
      glId: ["", Validators.required],
      glCode: [""],
      glName: [""],
      subGlCode: ["", Validators.required],
      subGlName: ["", Validators.required],
      caption: ["", Validators.required],
      subCaption: ["", Validators.required],
      companyId: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.staffId = this.jwtService.getUserDetails().staffId;
    this.cols = [
      { field: "companyName", header: "companyName" },
      { field: "glName", header: "glName" },
      { field: "subGlCode", header: "subGlCode" },
      { field: "subGlName", header: "subGlName" },
      { field: "glName", header: "glName" },
      { field: "caption", header: "caption" },
      { field: "subCaption", header: "subCaption" }
    ];
    this.getAllGLMapping();
    this.getAllRegistry();
    this.getAllCompany();
    this.GetDistinctCaptionByIndustry();
    this.GetDistinctSubCaptionByIndustry();
  }

  getAllCompany() {
    this.loadingService.show();
    this.companyService.getCompanyStructureByStatffId(this.staffId).subscribe(
      data => {
        this.loadingService.hide();
        this.companyInformation = data.companyStructures;
      },
      err => {
        this.loadingService.hide();
      }
    );
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

  GetDistinctCaptionByIndustry() {
    this.loadingService.show();
    this.registryService.GetDistinctCaptionByIndustry().subscribe(data => {
      this.loadingService.hide();
      this.captionInformation = data.registry;
    });
  }

  GetDistinctSubCaptionByIndustry() {
    this.loadingService.show();
    this.registryService.GetDistinctSubCaptionByIndustry().subscribe(data => {
      this.loadingService.hide();
      this.subCaptionInformation = data.registry;
      if (
        this.subCaptionInformation != null ||
        this.subCaptionInformation != undefined
      ) {
        this.subCaptionOption = [];
        this.subCaptionInformation.forEach(el => {
          let info = {
            label: el.subCaption,
            value: el.subCaption
          };
          this.subCaptionOption.push(info);
        });
      }
    });
  }

  onCaptionChange(caption) {
    this.GetDistinctSubCaptionByIndustryByCaption(caption);
    // this.addNew();
  }

  GetDistinctSubCaptionByIndustryByCaption(caption) {
    this.loadingService.show();
    this.registryService
      .GetDistinctSubCaptionByIndustryByCaption(caption)
      .subscribe(data => {
        this.loadingService.hide();
        this.subCaptionInformation = data.registry;
        if (
          this.subCaptionInformation != null ||
          this.subCaptionInformation != undefined
        ) {
          this.subCaptionOption = [
            { label: "-----Select SubCaption------- ", value: null }
          ];
          this.subCaptionInformation.forEach(el => {
            let info = {
              label: el.subCaption,
              value: el.subCaption
            };
            this.subCaptionOption.push(info);
          });
        }
      });
  }

  // showAddNew() {
  //     this.router.navigate(["/finance/glRemap-info"]);
  // }
  // multipleDelete(){
  //     let tempData = this.selectedcountryInformation;
  //     this.countryInformation = [];
  //     if (tempData !== undefined) {
  //         tempData.forEach(el => {
  //             let data ={
  //                 countryId: el.countryId,
  //                 countryCode: "",
  //                 countryName: "",
  //             }
  //             this.countryInformation.push(data); });
  //         // this.countryInformation = tempData;
  //         this.submitCountryInfo(this.countryInformation);
  //
  //

  //    }
  // }

  addNew() {
    //this.getAllRegistry();
    this.GetDistinctCaptionByIndustry();
    this.GetDistinctSubCaptionByIndustry();
    let tempData = this.selectedglRemapInformation;
    this.mappedCurrencies = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          glId: el.glId,
          glCode: el.glCode,
          glName: el.glName,
          caption: el.caption,
          subCaption: el.subCaption
        };
        this.mappedCurrencies.push(data);
      });
      this.displayUnMappingGL = true;
    }
  }

  getAllGLMapping() {
    this.loadingService.show();
    this.glRemapService.getAllGLMapping().subscribe(
      data => {
        this.loadingService.hide();
        this.glRemapInformation = data.glMapping;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  // getUnMappingGL() {
  //     this.loadingService.show();
  //     this.glRemapService.getUnMappingGL().subscribe(data => {
  //         this.loadingService.hide();
  //         this.glRemapInformation = data["result"];
  //     });
  // }

  // editGLRemap(row) {
  //     this.router.navigate(["/finance/glRemap-info"], {
  //         queryParams: { editglRemap: row.glRemapId }
  //     });
  //
  // }

  editGLMapping(row) {
    this.displayMapping = true;
    this.glRemapForm = this.fb.group({
      glMappingId: row.glMappingId,
      glId: row.glId,
      glCode: [row.glCode],
      glName: [row.glName],
      subGlCode: [row.subGlCode],
      subGlName: [row.subGlName],
      caption: [row.caption],
      subCaption: [row.subCaption],
      companyId: [row.companyId]
    });
    this.displayMapping = true;
  }

  // showMapping() {
  //     this.displayMapping = true;
  // }

  rowClicked(row: any): void {
  }

  submitGLRemapInfo(formObj) {
    this.loadingService.show();
    formObj.value.companyId = parseInt(formObj.value.companyId);
    this.glRemapService.updateGLMapping(formObj.value).subscribe(
      data => {
        this.loadingService.hide();
        if (data.status.isSuccessful == true) {
          swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "success");
          this.displayMapping = false;
          this.getAllGLMapping();
        } else {
          swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
      }
    );
  }

  // submitGLRemap(tableObj, formObj) {
  //     this.loadingService.show();
  //     let data = []

  //     tableObj.forEach(el => {
  //         let obj ={
  //             caption: formObj.value.caption,
  //             subCaption: el.subCaption,
  //             glId: el.glId,
  //             companyId: formObj.value.companyId,
  //             subPosition: 0,
  //         }
  //         data.push(obj)
  //     });
  //     let body = {
  //         glremap: data
  //     }
  //     // let body = {glremap:formObj}
  //
  //     this.glRemapService.updateMultipleGLRemap(body).subscribe(
  //         data => {
  //             this.loadingService.hide();
  //             if (data["result"] == true) {
  //                 swal.fire("GOS FINANCIAL", data["message"], "success");
  //                 this.displayUnMappingGL = false;
  //                 this.getUnMappingGL();
  //             } else {
  //                 swal.fire("GOS FINANCIAL", data["message"], "error");
  //             }
  //         },
  //         err => {
  //             this.loadingService.hide();
  //             swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
  //         }
  //     );
  // }

  deleteGLMapping(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete GLMap?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.glRemapService
            .deleteGLMapping(row.glMappingId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "GLMapped deleted successful.",
                  "success"
                );
                __this.getAllGLMapping();
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
    if (this.selectedglRemapInformation.length === 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    const tempData = this.selectedglRemapInformation;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        const data = {
          targetId: el.glId
        };
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

          __this.glRemapService.multipleDeleteGlMapping(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getAllGLMapping();
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

  //filter gl mapping by company
  filterGlMapping(value: any) {
    if (value == 0) {
      return this.getAllGLMapping();
    } else {
      this.loadingService.show();
      return this.glRemapService.glRemapByCompany(value).subscribe(
        data => {
          this.loadingService.hide();
          this.glRemapInformation = data.glMapping;
        },
        err => {
          this.loadingService.hide();
        }
      );
    }
  }
}
