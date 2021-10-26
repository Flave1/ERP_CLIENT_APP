import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {LoadingService} from '../../../core/services/loading.service';
import {ProductService} from '../../../core/services/product.service';
import {FeeService} from '../../../core/services/fee.service';
import {CommonService} from '../../../core/services/common.service';
import {LoanScheduleService} from '../../../core/services/loanschedule';
import {SubGLService} from '../../../core/services/subgl.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CollateralService} from '../../../core/services/collateral.service';
import {InvestorFundService} from '../../../core/services/investor-fund.service';
import {CurrencyService} from '../../../core/services/currency.service';
import {LoanApplicationService} from '../../../core/services/loanapplication.service';
import swal from "sweetalert2";
import {TreasuryService} from '../../../core/services/treasury.service';

@Component({
  selector: 'app-treasury-placement',
  templateUrl: './treasury-placement.component.html',
  styleUrls: ['./treasury-placement.component.css']
})
export class TreasuryPlacementComponent implements OnInit {

    form: FormGroup;
    feeform: FormGroup;
    productFeeForm: FormGroup;
    formTitle: string = "Treasury Placement";
    AllCollateral: SelectItem[] = [];
    activeIndex: number = 0;
    productInformation: any[] = [];
    selectedProductInformation: any[];
    repaymentTypeInformation: any[] = [];
    displayProductFee: boolean = false;
    otherTabDisabled: boolean = true;
    productId: any;
    amountTitle: string = "";
    productProductFees: any[] = [];
    feeList: any[] = [];
    productTypeList: any[] = [];
    frequencyTypeList: any[] = [];
    accountList: any[] = [];
    scheduleTypes: any[] = [];
    selectedFrequency: string;
    weightedRisk: number;
    customers: any[] = [];
    currencies: any[] = [];
    loanApplicationInformation: any[] = [];
    issuerRegistrationId: any;
    runningFacilities: any[] = [];
    reloadRunningFacilities: EventEmitter<any> = new EventEmitter;
    tenor: any;
    rate: any;
    payload: any;
    productLimit: number;
    user: any = JSON.parse(localStorage.getItem('userDetails'));
    // selectedFrequency: string;
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private productService: ProductService,
        private feeService: FeeService,
        private commonService: CommonService,
        private loanScheduleService: LoanScheduleService,
        private subGLService: SubGLService,
        private router: Router,
        private route: ActivatedRoute,
        private collateralService: CollateralService,
        private investorFundService: InvestorFundService,
        private currencyService: CurrencyService,
        private loanApplicationService: LoanApplicationService,
        private treasuryService: TreasuryService
    ) {
        this.form = this.fb.group({
            invInvestorFundId: [0],
            productId: [""],
            issuerRegistrationId:this.issuerRegistrationId,
            proposedTenor: ["", Validators.required],
            proposedRate: ["", Validators.required],
            frequencyId: ["", Validators.required],
            period: ["", Validators.required],
            proposedAmount: [, Validators.required],
            effectiveDate: ["", Validators.required],
            investmentPurpose: [""],
            instrumentId: [""],
            instrumentNumer: [""],
            instrumentDate: [""],
            enableRollOver: [false, Validators.required],
            currencyId: [""],
            companyId: [this.user.companyId]
        });
        this.productFeeForm = this.fb.group({
            productFeeId: 0,
            productId: 0,
            productPaymentType: ["", Validators.required],
            feeId: ["", Validators.required],
            productFeeType: ["", Validators.required],
            productAmount: ["", Validators.required]
        });
        // this.reloadRunningFacilities.subscribe(() => {
        //    this.getRunningFacilities()
        // })
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.issuerRegistrationId = params["investorId"];
            if (this.issuerRegistrationId != null || this.issuerRegistrationId != undefined) {
                this.form = this.fb.group({
                    issuerRegistrationId: this.issuerRegistrationId,
                    proposedTenor: ["", Validators.required],
                    proposedRate: ["", Validators.required],
                    frequencyId: ["", Validators.required],
                    period: [this.calculatePeriod(this.form.value.proposedTenor, this.form.value.frequencyId)],
                    proposedAmount: [, Validators.required],
                    effectiveDate: ["", Validators.required],
                    investmentPurpose: [""],
                    instrumentId: [""],
                    instrumentNumer: [""],
                    instrumentDate: [""],
                    enableRollOver: false,
                    currencyId: [""],
                    productId: [""],
                })
                this.getRunningFacilities();
            }
        });
        this.getCustomers();
        this.getCurrencies();
        this.getFrequencyTypes();
        this.getAllProductTypes();
        this.payload = {};
        this.payload.issuerRegistrationId = this.issuerRegistrationId
    }
    getCustomers() {
        return this.treasuryService.getAllIssuer().subscribe(
            data => {
                this.customers = data.issuerRegistrations;
            },
            err => {

            }
        );
    }
    // getInvestment() {
    //     return this.investorFundService.getInvestment()
    // }

    getCurrencies() {
        return this.commonService.getAllCurrency().subscribe(
            data => {
                this.currencies = data.commonLookups;
            },
            err => {

            }
        );
    }
    getAllProductTypes() {
        this.treasuryService.getAllProducts().subscribe(
            res => {
                this.productTypeList = res.products;
            },
            err => {
                return err;
            }
        );
    }
    getFrequencyTypes() {
        this.loanScheduleService.getAllFrequencyTypes().subscribe(
            res => {
                this.frequencyTypeList = res.lookUp;
            },
            err => {
                return err;
            }
        );
    }

    goBack() {
        this.router.navigate(["/treasury/investments-list"]);
    }
    getRunningFacilities() {
        return this.investorFundService.getAllRunningFacilities(this.issuerRegistrationId).subscribe(
            data => {
                this.runningFacilities = data.result;
            },
            err => {
                return err;
            }
        );
    }
    submitRequest() {
        if (!this.payload.proposedTenor) {
            return swal.fire('GOS FINANCIAL', 'Proposed tenor is required', 'error')
        }
        if (this.payload.proposedTenor > this.tenor) {
          return swal.fire('GOS FINANCIAL', 'Proposed tenor cannot be greater than tenor')
        }
        if (!this.payload.proposedRate) {
            return swal.fire('GOS FINANCIAL', 'Proposed rate is required', 'error')
        }
        if (!this.payload.proposedAmount) {
            return swal.fire('GOS FINANCIAL', 'Proposed amount is required', 'error')
        }
        if (this.payload.proposedAmount > this.productLimit) {
            return swal.fire('GOS FINANCIAL', 'Proposed amount cannot be greater than product limit', 'error')
        }
        if (!this.payload.currencyId) {
            return swal.fire('GOS FINANCIAL', 'Currency is required', 'error')
        }
        if (!this.payload.effectiveDate) {
            return swal.fire('GOS FINANCIAL', 'Effective date is required', 'error')
        }
        if (!this.payload.investmentPurpose) {
            return swal.fire('GOS FINANCIAL', 'Investment purpose is required', 'error')
        }
        if (!this.payload.instrumentId) {
            return swal.fire('GOS FINANCIAL', 'Investment instrument is required', 'error')
        }
        if (this.payload.instrumentId == 2) {
            if (!this.payload.instrumentNumer) {
                return swal.fire('GOS FINANCIAL', 'Investment instrument number is required', 'error')
            }
            if (!this.payload.instrumentDate) {
                return swal.fire('GOS FINANCIAL', 'Investment instrument date is required', 'error')
            }
        }
        if (this.payload.period > this.tenor) {
            return swal.fire('GOS FINANCIAL', 'Proposed tenor cannot be greater than maximum tenor', 'error')
        }
        if (this.payload.proposedRate < this.rate) {
            return swal.fire('GOS FINANCIAL', 'Proposed rate cannot be less than minimum rate', 'error')
        }
        this.payload.companyId = +this.user.companyId;
        this.payload.issuerRegistrationId = +this.payload.issuerRegistrationId;
        this.payload.productId = +this.payload.productId;
        this.payload.proposedTenor = +this.payload.proposedTenor;
        this.payload.proposedRate = +this.payload.proposedRate;
        this.payload.frequencyId = +this.payload.frequencyId;
        this.payload.proposedAmount = +this.payload.proposedAmount;
        this.payload.currencyId = +this.payload.currencyId;
        this.payload.instrumentId = +this.payload.instrumentId;
        this.payload.period = this.payload.period.toString()
        this.loadingService.show();
        this.treasuryService.updateIssuerInvestment(this.payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigateByUrl('/treasury/investments-list')
                } else {
                    swal.fire("GOS FINANCIAL", message, "error");
                }
            },
            err => {
                this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", message, "error");
            }, () => {

            }
        );
    }
    getLoanApplication(issuerRegistrationId) {
        this.loadingService.show();
        this.loanApplicationService
            .GetRunningLoanApplicationByCustomer(this.issuerRegistrationId)
            .subscribe(data => {
                this.loadingService.hide();
                this.loanApplicationInformation = data["result"];
            });
    }

    rowClicked(x) {

    }
    calculatePeriod(tenor, frequency) {
        switch (frequency) {
            case 1:
                return tenor/365;
            case 2:
                return tenor/183;
            case 3:
                return tenor/91;
            case 4:
                return tenor/61;
            case 5:
                return tenor/30;
            case 6:
                return tenor/15;
            case 7:
                return tenor/7;
            case 8:
                return tenor/365;
            case 9:
                return tenor/121;
            default:
                return tenor/365
        }
    }
    getProduct(value: any) {
        if (value) {
            this.loadingService.show();
            return this.treasuryService.getProduct(value).subscribe(data => {
                this.loadingService.hide();
                this.rate = data.products[0].interestRateFrequency;
                this.tenor = data.products[0].maximumPeriod;
                this.payload.frequencyId = data.products[0].frequencyId;
                this.productLimit = data.products[0].productLimit;
                this.selectedFrequency = data.products[0].frequencyName
            }, err => {
                this.loadingService.hide()
            })
        }
    }
    onInputMethod() {
        const period = this.calculatePeriod(parseInt(this.payload.proposedTenor), this.payload.frequencyId);
        this.payload.period = Math.ceil(period)
        return this.payload.period = Math.ceil(this.calculatePeriod(this.payload.proposedTenor, this.payload.frequencyId))
    }
    formatAmount(value) {
        if (value) {
            const amount = parseInt(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
            this.payload.proposedAmount = amount;
        } else {
            this.payload.proposedAmount = 0
        }
    }
}
