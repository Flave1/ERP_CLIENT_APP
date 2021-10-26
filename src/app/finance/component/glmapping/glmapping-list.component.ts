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
  selector: "app-glMapping-list",
  templateUrl: "./glmapping-list.component.html"
})
export class GLMappingListComponent implements OnInit {
  registryInformation: any[] = [];
  mappedCurrencies: any[];
  subCaptionOption: any[] = [];
  cols: any[];
  selectedCurrencies: any;
  captionInformation: any[] = [];
  subCaptionInformation: any[] = [];
  companyInformation: any[] = [];
  glMappingForm: FormGroup;
  glMappingInformation: any[] = [];
  selectedglMappingInformation: any[];
  displayMapping = false;
  displayUnMappingGL = false;
  glMappingFormGroup: FormGroup;
  viewHeight: any = "600px";
  staffId: number;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private glMappingService: GLMappingService,
    private registryService: RegistryService,
    private companyService: CompanyService,
    private router: Router,
    private jwtService: JwtService
  ) {
    this.glMappingForm = this.fb.group({
      glMappingId: [0],
      glId: ["", Validators.required],
      glCode: [""],
      glName: [""],
      subGlCode: ["", Validators.required],
      subGlName: ["", Validators.required],
      caption: ["", Validators.required],
      subCaption: ["", Validators.required],
      companyId: ["", Validators.required],
      subPosition: [""]
    });
  }

  ngOnInit() {
    this.staffId = this.jwtService.getUserDetails().staffId;
    this.cols = [
      { field: "subGlCode", header: "subGlCode" },
      { field: "glName", header: "glName" },
      {
        field: 'companyName',
        header: 'companyName'
      },
      {
        header: 'subGlName',
        field: 'subGlName'
      }
    ];
    this.getUnMappingGL();
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
      // if( this.captionInformation != null ||  this.captionInformation != undefined){
      //     this.captionOption = [];
      //     this.captionInformation.forEach(el => {
      //         let info ={
      //             label: el.caption,
      //             value: el.caption
      //         }
      //     this.captionOption.push(info)
      //
      //     });}
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
            { label: "-----Select NoteLine------- ", value: null }
          ];
          this.subCaptionInformation.forEach(el => {
            let info = {
              label: el.noteLine,
              value: el.noteLine
            };
            this.subCaptionOption.push(info);

          });
        }
      });
  }

  showAddNew() {
    this.router.navigate(["/finance/glMapping-info"]);
  }
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
    let tempData = this.selectedglMappingInformation;
    this.mappedCurrencies = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          glId: el.glId,
          glCode: el.glCode,
          glName: el.glName,
          caption: el.caption,
          subCaption: el.subCaption,
          subGlCode: el.subGlCode,
          subGlName: el.subGlName
        };
        this.mappedCurrencies.push(data);
      });

      this.displayUnMappingGL = true;
    }
  }

  getAllGLMapping() {
    this.loadingService.show();
    this.glMappingService.getAllGLMapping().subscribe(data => {
      this.loadingService.hide();
      this.glMappingInformation = data["result"];

    });
  }

  getUnMappingGL() {
    this.loadingService.show();
    this.glMappingService.getUnMappingGL().subscribe(data => {
      this.loadingService.hide();
      this.glMappingInformation = data.glMapping;
    });
  }

  // editGLMapping(row) {
  //     this.router.navigate(["/finance/glMapping-info"], {
  //         queryParams: { editglMapping: row.glMappingId }
  //     });
  //
  // }

  editGLMapping(row) {
    this.displayMapping = true;
    this.glMappingForm = this.fb.group({
      glMappingId: [0],
      glId: row.glId,
      glCode: [row.glCode],
      glName: [row.glName],
      subGlCode: [row.subGlCode],
      subGlName: [row.subGlName],
      caption: [row.caption],
      subCaption: [row.subCaption],
      companyId: [row.companyId]
    });
    //this.displayMapping = true;
  }

  // showMapping() {
  //     this.displayMapping = true;
  // }

  rowClicked(row: any): void {

  }

  submitGLMappingInfo(formObj) {
    this.loadingService.show();
    formObj.value.companyId = parseInt(formObj.value.companyId);
    this.glMappingService.updateGLMapping(formObj.value).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.displayMapping = false;
          this.getUnMappingGL();
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
  }

  submitGLMapping(tableObj, formObj) {
    this.loadingService.show();
    let data = [];

    tableObj.forEach(el => {
      let obj = {
        caption: formObj.value.caption,
        subCaption: el.noteLine,
        glId: el.glId,
        subGlCode: el.subGlCode,
        //glCode: el.glCode,
        companyId: parseInt(formObj.value.companyId),
        subPosition: 0
      };
      data.push(obj);
    });

    this.glMappingService.updateMultipleGLMapping(data).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.displayUnMappingGL = false;
          this.getUnMappingGL();
          this.selectedglMappingInformation = [];
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
  }

  deleteGLMapping(row) {
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

          __this.glMappingService
            .deleteGLMapping(row.glMappingId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "Record deleted successful.",
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

  filterGlMapping(value: any) {
    if (value == 0) {
      return this.getUnMappingGL();
    } else {
      this.loadingService.show();
      return this.glMappingService.getMappingByCompany(value).subscribe(
        data => {
          this.loadingService.hide();
          this.glMappingInformation = data.glMapping;
        },
        err => {
          this.loadingService.hide();
        }
      );
    }
  }
}
