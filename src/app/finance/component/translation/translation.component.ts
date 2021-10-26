import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { CurrencyRateService } from "../../../core/services/currencyrate.service";
import swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { CompanyService } from "../../../core/services/company.service";
import { SubGLService } from "../../../core/services/subgl.service";
import { JwtService } from "../../../core/services/jwt.service";
import { saveAs } from "file-saver";
import { CurrencyService } from "src/app/core/services/currency.service";
import {CommonService} from "../../../core/services/common.service";
@Component({
  selector: "app-translation",
  templateUrl: "./translation.component.html",
  styleUrls: ["./translation.component.css"]
})
export class TranslationComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  formTitle: string = "Translation Set Up";
  form: FormGroup;
  translationId: any;
  translationGLId: number;
  TranslationGl: any[] = [];
  selectedTranslationGl: any[];
  viewHeight: string = "600px";
  showTranslationGl: boolean;
  translationGlForm: FormGroup;
  companies: any[] = [];
  staffId: number;
  subGlArr: any[] = [];
  fileToUpload: File;
  selected: boolean;
  currencyInformation: any[] = [];
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private currencyRateService: CurrencyRateService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private companyService: CompanyService,
    private subGlService: SubGLService,
    private jwtService: JwtService,
    private currencyService: CurrencyService,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      translationId: [0],
      year: [""],
      averageRate: [""],
      closingRate: [""],
      currencyCode: [""]
    });
    this.translationGlForm = this.fb.group({
      translationId: [""],
      companyId: [""],
      subGLId: [""]
    });
  }

  ngOnInit() {
    this.staffId = this.jwtService.getUserDetails().staffId;
    this.route.queryParams.subscribe(param => {
      this.translationId = param.id;
      if (this.translationId !== null || true) {
        this.getTranslation(this.translationId);
        this.getCompany(this.staffId);
        // this.getSubGls();
        this.getTranslationGl(this.translationId);
        this.getCurrencies();
      }
    });
  }

  submit(form: FormGroup) {
    const payload = this.form.value;
    payload.year = parseInt(payload.year);
    payload.averageRate = parseInt(payload.averageRate);
    payload.closingRate = parseInt(payload.closingRate);
    payload.currencyId = parseInt(payload.currencyId);
    this.loadingService.show();
    return this.currencyRateService.updateTranslation(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          form.reset();
          this.router.navigateByUrl("/finance/translation-setup");
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
  back() {
    this.location.back();
  }

  getTranslation(translationId: number) {
    this.loadingService.show();
    return this.currencyRateService.getTranslation(translationId).subscribe(
      data => {
        this.loadingService.hide();
        const row = data.translation[0];
        this.formTitle = "Edit Translation Setup";
        this.form = this.fb.group({
          translationId: [row.translationId],
          year: [row.year],
          averageRate: [row.averageRate],
          closingRate: [row.closingRate],
          currencyCode: [row.currencyCode]
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getCurrencies() {
    this.commonService.getAllCurrency().subscribe(
      data => {
        this.currencyInformation = data.commonLookups;
      },
      err => {
        return err;
      }
    );
  }

  rowClicked(row: any): void {

  }
  getCompany(id: number) {
    this.loadingService.show();
    return this.companyService.getCompanyStructureByStatffId(id).subscribe(
      data => {
        this.loadingService.hide();
        this.companies = data.companyStructures;
      },
      err => {
        this.loadingService.hide();

      }
    );
  }
  getSubGls(id: number) {
    this.loadingService.show();
    return this.subGlService.getSubGlByCompany(id).subscribe(
      data => {
        this.loadingService.hide();
        this.subGlArr = data.subGls;
        this.selected = true;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  showAddNew() {
    this.showTranslationGl = true;
  }
  multipleDelete() {
    if (this.selectedTranslationGl.length === 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    const tempData = this.selectedTranslationGl;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        const data = {
          targetId: el.translationGLId
        };
        targetIds.push(el.translationGLId);
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

          __this.currencyRateService.multipleDelete(body).subscribe(data => {
            __this.loadingService.hide();
            const message = data.status.message.friendlyMessage;
            if (data.deleted) {
              swal.fire(
                "GOS FINANCIAL",
                message,
                "success"
              );
              __this.getTranslationGl(this.translationId);
            } else {
              swal.fire("GOS FINANCIAL", message, "error");
            }
          }, err => {
            this.loadingService.hide();
            const message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  uploadDifference() {
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
    this.currencyRateService
      .uploadTranslationGl(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {

          this.fileToUpload = null;
          this.getTranslationGl(this.translationId);
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = "";
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "success");
      });
  }
  exportDifference() {
    this.loadingService.show();
    return this.currencyRateService.exportTranslationGl().subscribe(
      response => {
        this.loadingService.hide();
        let data = response.export;
        if (data != undefined) {
          let byteString = atob(data);
          let ab = new ArrayBuffer(byteString.length);
          let ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          let bb = new Blob([ab]);
          try {
            let file = new File([bb], "Translation GL List.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            let textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "Translation GL List.xlsx"
            );
          }
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  editDifference(row) {
    this.showTranslationGl = true;
    this.translationGlForm = this.fb.group({
      translationId: [row.translationId],
      companyId: [row.companyId],
      subGLId: [row.subGLId]
    });
  }

  addTranslationGl(translationGlForm: FormGroup) {
    const payload = translationGlForm.value;
    payload.translationId = parseInt(this.translationId);
    payload.subGLId = parseInt(payload.subGLId);
    this.loadingService.show();
    return this.currencyRateService
      .updateTranslationGl(payload)
      .subscribe(res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          this.getTranslationGl(this.translationId);
          swal.fire("GOS FINANCIAL", message, "success");
          translationGlForm.reset();
          this.showTranslationGl = false;
        } else {
          swal.fire('GOS FINANCIAL', message, 'error')
        }
      }, err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error')
      });
  }

  getTranslationGl(translationId: number) {
    this.loadingService.show();
    return this.currencyRateService.getTranslationGl(translationId).subscribe(
      data => {
        this.loadingService.hide();
        this.TranslationGl = data.translationGl;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
}
