import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { GLService } from "src/app/core/services/gl.service";
import { TrialBalanceService } from "src/app/core/services/trialbalance.service";
import { CompanyService } from "src/app/core/services/company.service";
import { CurrencyService } from "src/app/core/services/currency.service";


@Component({
    selector: "app-trialBalance",
    templateUrl: "./trialbalance.component.html"
})
export class TrialBalanceComponent implements OnInit {
    companyInformation: any[] = [];
    glInformation: any[] = [];
    currencyInformation: any[] = [];
    form: FormGroup;
    formTitle: string = "Add TrialBalance Information";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private trialBalanceService: TrialBalanceService,
        private companyService: CompanyService,
        private currencyService: CurrencyService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            trialBalanceId: [0],
            glCode: ["", Validators.required],
            glDescription: ["", Validators.required],
            openingBalance: [0],
            creditBalance: [0],
            debitBalance: [0],
            balance: ["", Validators.required],
            exchangeRate: [1],
            translatedBalance: [0],
            currencyCode: ["", Validators.required],
            companyCode: ["", Validators.required],
            runDate: ["", Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let trialBalanceId = params["edittrialBalance"];
            if (trialBalanceId != null || trialBalanceId != undefined) {
                this.editTrialBalance(trialBalanceId);
            }
        });
        this.getAllCurrency();
        this.getAllCompany();

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

    getAllCurrency() {
        this.loadingService.show();
        this.currencyService.getAllCurrency().subscribe(data => {
            this.loadingService.hide();
            this.currencyInformation = data["result"];

        });
    }

    editTrialBalance(trialBalanceId) {
        this.formTitle = "Edit TrialBalance Information";
        this.loadingService.show();
        this.trialBalanceService.getTrialBalance(trialBalanceId).subscribe(data => {
            this.loadingService.hide();
            let row = data["result"];
            this.form = this.fb.group({
                trialBalanceId: row.trialBalanceId,
                glCode: row.glCode,
                glDescription: row.glDescription,
                openingBalance: row.openingBalance,
                creditBalance: row.creditBalance,
                debitBalance: row.debitBalance,
                balance: row.balance,
                exchangeRate: row.exchangeRate,
                translatedBalance: row.translatedBalance,
                currencyCode: row.currencyCode,
                companyCode: row.companyCode,
                runDate: new Date(row.runDate),
            });
        });
    }

    goBack() {
        this.router.navigate(["/finance/trialBalance-list"]);
    }
    submitTrialBalanceInfo(formObj) {
        this.loadingService.show();
        this.trialBalanceService.updateTrialBalance(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] == true) {
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigate(["/finance/trialBalance-list"]);
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
