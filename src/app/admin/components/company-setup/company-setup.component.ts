import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators
} from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { CompanyService } from "src/app/core/services/company.service";
import { CountryService } from "src/app/core/services/country.service";
import { CurrencyService } from "src/app/core/services/currency.service";
import { RegistryService } from "src/app/core/services/registry";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-company-setup",
  templateUrl: "./company-setup.component.html"
})
export class CompanySetupComponent implements OnInit {
  @ViewChild("myInput")
  form: FormGroup;
  myInputVariable: ElementRef;
  IndustryInformation: any[] = [];
  formTitle: string = "Add Company Information";
  countryList: any[];
  currencyList: any[];
  isMultiCompany: boolean = false;
  subCompanyForm: FormGroup;
  companyStructureList: any[] = [];
  selectedCompanyStructure: any[] = [];
  fileToUpload: File;
  formData: any;
  cols: any[];
  viewHeight: any = "600px";
  companyStructureId: any;
  states: any[] = [];
  cities: any[] = [];
  file2: File;
  fileName: string;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private companyService: CompanyService,
    private countryService: CountryService,
    private currencyService: CurrencyService,
    private registryService: RegistryService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      companyId: 0,
      code: [""],
      name: ["", Validators.required],
      address1: ["", Validators.required],
      address2: [""],
      telephone: [""],
      fax: [""],
      email: [""],
      registrationNumber: [""],
      taxId: [""],
      noOfEmployees: [0],
      webSite: [""],
      logo: [""],
      // logoType: [""],
      city: [0],
      state: [0],
      countryId: [0],
      currencyId: [0],
      reportCurrencyId: [0],
      applyRegistryTemplate: [""],
      postalCode: [""],
      isMultiCompany: [false],
      description: [""],
      subsidairy_Level: [0],
      registryTemplate: [""],
      fsTemplateName: [""],
      headStaffId: [''],
      structureTypeId: [''],
      parentCompanyID: ['']
    });
    this.route.queryParams.subscribe(params => {
      let companyStructureId = params.id;
      if (companyStructureId != null || companyStructureId != undefined) {
        // this.editAccountType(accountTypeId);
        this.companyStructureId = companyStructureId;
        this.getCompanyStructure(companyStructureId);
      }
    });
    this.isMultiCompany = false;
    // this.editCompany();
    this.getAllCountry();
    this.getAllCurrency();
    this.GetDistinctIndustry();
    // this.getAllCompanyStructure()
  }

  getAllCountry() {
    this.loadingService.show();
    this.commonService.getAllCountry().subscribe(
      data => {
        this.loadingService.hide();
        this.countryList = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getStateByCountry(id) {
    this.loadingService.show();
    return this.commonService.getStateByCountry(id).subscribe(
      data => {
        this.loadingService.hide();
        this.states = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getCityByStateId(id) {
    this.loadingService.show();
    return this.commonService.getCityByStateId(id).subscribe(
      data => {
        this.loadingService.hide();
        this.cities = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getAllCurrency() {
    this.loadingService.show();
    this.commonService.getAllCurrency().subscribe(
      data => {
        this.loadingService.hide();
        this.currencyList = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  GetDistinctIndustry() {
    this.loadingService.show();
    this.registryService.GetDistinctIndustry().subscribe(
      data => {
        this.loadingService.hide();
        this.IndustryInformation = data.registry;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  editCompany() {
    this.formTitle = "Edit Company Information";
    this.loadingService.show();
    this.companyService.getAllCompany().subscribe(data => {
      this.loadingService.hide();
      let row = data["result"];
      this.form = this.fb.group({
        companyStructureId: row.companyStructureId,
        companyCode: [row.companyCode],
        companyName: [row.companyName, Validators.required],
        address1: [row.address1, Validators.required],
        address2: [row.address2],
        telephone: [row.telephone],
        fax: [row.fax],
        email: [row.email],
        registrationNumber: [row.registrationNumber],
        taxId: [row.taxId],
        noOfEmployees: [row.noOfEmployees],
        webSite: [row.webSite],
        logo: [""],
        logoType: [""],
        city: [row.city],
        state: [row.state],
        countryId: [row.countryId],
        currencyId: [row.currencyId],
        applyRegistryTemplate: [row.applyRegistryTemplate],
        postalCode: [row.postalCode],
        isMultiCompany: [row.isMultiCompany],
        description: [row.description],
        subsidairy_Level: [row.subsidairy_Level],
        registryTemplate: [row.registryTemplate],
        fSTemplateName: [row.fSTemplateName]
      });
      this.getStateByCountry(row.countryId);
      if (row.isMultiCompany == true) {
        this.isMultiCompany = true;
      }
    });
  }

  submitCompanyInfo(formObj) {
    this.loadingService.show();
    this.companyService.updateCompany(formObj.value).subscribe(
      data => {
        this.loadingService.hide();
        if (data["success"] == true) {
          swal.fire("GOS FINANCIAL", data["message"], "success");
        } else {
          swal.fire("GOS FINANCIAL", data["message"], "error");
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
      }
    );
  }
  onIsMultiCompanySelected(value) {
    this.isMultiCompany = !this.isMultiCompany;
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  fsTemplateUpload(file: FileList) {
    this.file2 = file.item(0);
    this.fileName = file.item(0).name
  }
  getAllCompanyStructure() {
    this.loadingService.show();
    this.companyService.getAllCompanyStructure().subscribe(
      data => {
        this.loadingService.hide();
        this.companyStructureList = data.companyStructures;
        if (this.companyStructureList == undefined) {
          this.companyStructureList = [];
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  addCompanyInfo(formObj) {
    const payload = formObj.value;
    payload.companyStructureId = parseInt(this.companyStructureId);
    payload.countryId = parseInt(payload.countryId);
    payload.currencyId = parseInt(payload.currencyId);
    payload.state = parseInt(payload.state);
    payload.city = parseInt(payload.city);
    payload.reportingCurrencyId = parseInt(payload.reportingCurrencyId);
    // payload.subsidairy_Level = parseInt(payload.subsidairy_Level);
    payload.noOfEmployees = parseInt(payload.noOfEmployees);
    payload.fsTemplateName = this.fileName;

    if (payload.headStaffId == null) {
      payload.headStaffId = 0
    }

    // return;
    this.loadingService.show();
    return this.companyService
      .addUpdateCompanyStructure(this.fileToUpload, payload, this.file2)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigateByUrl("/organization/company-setup-list");
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();

        let error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  uploadCompanyFSTemplate() {
    if (this.file2 == null) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
    }
    if (
      this.file2.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show();
    let body = {
      companyStructureId: this.companyStructureId
    };
    this.companyService
      .uploadCompanyFSTemplate(this.file2, body)
      .then(data => {
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.myInputVariable.nativeElement.value = "";
          this.getCompanyStructure(this.companyStructureId);
          swal.fire("GOS FINANCIAL", "SuccessFul", "success");
        } else {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.myInputVariable.nativeElement.value = "";
          this.getCompanyStructure(this.companyStructureId);
          swal.fire("GOS FINANCIAL", "Not Successful", "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.myInputVariable.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", err.message, "error");
      });
  }
  getCompanyStructure(companyStructureId) {
    this.loadingService.show();
    return this.companyService.getCompanyInfo(companyStructureId).subscribe(
      data => {
        let row = data.companyStructures[0];

        this.form = this.fb.group({
          companyId: 0,
          code: [row.code],
          name: [row.name],
          address1: [row.address1],
          address2: [row.address2],
          telephone: [row.telephone],
          fax: [row.fax],
          email: [row.email],
          registrationNumber: [row.registrationNumber],
          taxId: [row.taxId],
          noOfEmployees: [row.noOfEmployees],
          webSite: [row.webSite],
          logo: [row.logo],
          logoType: [row.logoType],
          city: [row.city],
          state: [row.state],
          countryId: [row.countryId],
          currencyId: [row.currencyId],
          reportCurrencyId: [row.reportCurrencyId],
          applyRegistryTemplate: [row.applyRegistryTemplate],
          postalCode: [row.postalCode],
          description: [row.description],
          registryTemplate: [row.registryTemplate],
          fsTemplateName: [row.fsTemplateName],
          headStaffId: [row.headStaffId],
          structureTypeId: [row.structureTypeId],
          parentCompanyID: [row.parentCompanyID]
        });
        this.getStateByCountry(row.countryId);
        this.getCityByStateId(row.state);
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigateByUrl("/organization/company-setup-list");
  }
}
