import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CompanyService } from "src/app/core/services/company.service";
import { CountryService } from "src/app/core/services/country.service";
import { CurrencyService } from "src/app/core/services/currency.service";
import { RegistryService } from "src/app/core/services/registry";
import {CommonService} from "../../../core/services/common.service";

@Component({
    selector: "app-company",
    templateUrl: "./company.component.html"
})
export class CompanyComponent implements OnInit {
    IndustryInformation: any[] = [];
    form: FormGroup;
    formTitle: string = "Add Company Information";
    countryList: any[];
    currencyList: any[];
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
    ) {
        this.form = this.fb.group({
            companyId: [0],
            companyCode: ["", Validators.required],
            address: ["", Validators.required],
            companyName: ["", Validators.required],
            countryId: ["",Validators.required],
            currencyId: ["",Validators.required],
            telephone: ["",Validators.required],
            email: [""],
            website: [""],
            logo: [""],
            applyRegistryTemplate: [""],
            registryTemplate: [""],

        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let companyId = params.id;
            if (companyId != null || companyId != undefined) {
                this.editCompany(companyId);
            }
        });
        this. getAllCountry();
        this.getAllCurrency();
        this.GetDistinctIndustry();
    }


    getAllCountry() {
        this.loadingService.show();
        this.commonService.getAllCountry().subscribe(data => {
            this.loadingService.hide();
            this.countryList = data.commonLookups;

        }, err => {
          this.loadingService.hide()
        });
    }

    getAllCurrency() {
        this.loadingService.show();
        this.commonService.getAllCurrency().subscribe(data => {
            this.loadingService.hide();
            this.currencyList = data.commonLookups;
        }, err => {
          this.loadingService.hide()
        });
    }


    GetDistinctIndustry() {
        this.loadingService.show();
        this.registryService.GetDistinctIndustry().subscribe(data => {
            this.loadingService.hide();
            this.IndustryInformation = data["result"];

        });
    }

    editCompany(companyId) {
        this.formTitle = "Edit Company Information";
        this.loadingService.show();
        this.companyService.getCompany(companyId).subscribe(data => {
            this.loadingService.hide();
            let row = data["result"];

            this.form = this.fb.group({
                companyId: row.companyId,
                address: row.address,
                companyCode: row.companyCode,
                companyName: row.companyName,
                telephone: row.telephone,
                email: row.email,
                website: row.website,
                logo: row.logo,
                countryId: row.countryId,
                currencyId: row.currencyId ,
                applyRegistryTemplate:row.applyRegistryTemplate,
                registryTemplate:row.registryTemplate,

            });
        },err => {

        });
    }

    goBack() {
        this.router.navigate(["/setup/company-list"]);
    }
    submitCompanyInfo(formObj) {
        this.loadingService.show();
        this.companyService.updateCompany(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] == true) {
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigate(["/setup/company-list"]);
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
}
