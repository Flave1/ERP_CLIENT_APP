import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingService} from '../../../core/services/loading.service';
import {GLService} from '../../../core/services/gl.service';
import {CompanyService} from '../../../core/services/company.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FinancalYearService} from '../../../core/services/financal-year.service';
import swal from "sweetalert2";
import {CurrencyRateService} from '../../../core/services/currencyrate.service';

@Component({
  selector: 'app-currency-setup',
  templateUrl: './currency-setup.component.html',
  styleUrls: ['./currency-setup.component.css']
})
export class CurrencySetupComponent implements OnInit {

    companyInformation: any[] = [];
    form: FormGroup;
    formTitle: string = "Add Translation Set Up";
    currencyRates: any[] = [];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private glService: GLService,
        private companyService: CompanyService,
        private router: Router,
        private route: ActivatedRoute,
        private financialYearService: FinancalYearService,
        private currencyService: CurrencyRateService
    ) {
        this.form = this.fb.group({
            currencyId: [0],
            companyId: ["", Validators.required],
            functionalCurrency: ["", Validators.required],
            reportingCurrency: ["", Validators.required],
            exchangeRate: ["", Validators.required]
            // glClassId:["", Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let glId = params["editcurrencysetup"];
            if (glId != null || glId != undefined) {
                this.editFinancialYear(glId);
            }

        });
        this.getAllCompany();
        this.getCurrencies()
    }

    getAllCompany() {
        this.loadingService.show();
        this.companyService.getAllCompanyStructure().subscribe(data => {
            this.loadingService.hide();
            this.companyInformation = data.companyStructures;


        }, err => {
          this.loadingService.hide()
        });
    }
    getCurrencies() {
        this.currencyService.getAllCurrencyRate().subscribe(data => {
            this.currencyRates = data.result
        }, err => {
            return err
        })
    }
    editFinancialYear(financialYearId) {
        this.formTitle = "Edit Translation Setup";
        this.loadingService.show();
        this.financialYearService.getFinancialYear(financialYearId).subscribe(data => {
            this.loadingService.hide();
            let row = data.financialYear[0];
            this.form = this.fb.group({
                currencyId: row.currencyId,
                companyId: row.companyId,
                functionalCurrency: row.functionalCurrency,
                reportingCurrency: row.reportingCurrency,
                status:row.status,
            });
        }, err => {
            this.loadingService.hide()
        });
    }

    goBack() {
        this.router.navigate(["/finance/currency-setup-list"]);
    }
    submitFinancialYear(formObj) {
        const payload = formObj.value;
        if (!payload.name) {
            return swal.fire("GOS FINANCIAL", 'Name is required', "error");
        }
        if (!payload.startDate) {
            return swal.fire("GOS FINANCIAL", 'Start date is required', "error");
        }
        if (!payload.endDate) {
            return swal.fire("GOS FINANCIAL", 'End date is required', "error");
        }
        if (!payload.status) {
            return swal.fire("GOS FINANCIAL", 'Status is required', "error");
        }
        this.loadingService.show();
        this.financialYearService.updateFinancialYear(payload).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] == true) {
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigateByUrl("/finance/currency-setup-list");
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
