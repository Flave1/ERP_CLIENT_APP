import { Component, OnInit } from "@angular/core";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CommonService } from "../../../core/services/common.service";
import { SubGLService } from "../../../core/services/subgl.service";
import { LoanScheduleService } from "../../../core/services/loanschedule";
import {LoadingService} from '../../../core/services/loading.service';
import {FeeService} from '../../../core/services/fee.service';
import {SelectItem} from 'primeng/api';
import {ProductService} from '../../../core/services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CollateralService} from '../../../core/services/collateral.service';
import swal from "sweetalert2";
import {InvestorFundService} from '../../../core/services/investor-fund.service';

@Component({
    selector: "app-investor-product",
    templateUrl: "./investor-product.component.html",
    styleUrls: ["./investor-product.component.css"]
})
export class InvestorProductComponent implements OnInit {
    form: FormGroup;
    feeform: FormGroup;
    productFeeForm: FormGroup;
    formTitle: string = "Create Investor Product";
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
  glArr: SelectItem[] = [];
  selectedGl: any;
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
        private investorFundService: InvestorFundService
    ) {
        this.form = this.fb.group({
            productId: [0],
            productCode: ['', Validators.required],
            productTypeId: [0, Validators.required],
            productName: ['', Validators.required],
            earlyTerminationCharge: [0, Validators.required],
            lateTerminationCharge: [0, Validators.required],
            rate: ['', Validators.required],
            interestRepaymentTypeId: [''],
            period: [''],
            maximumPeriod: [''],
            interestRateAnnual: [''],
            interestRateFrequency: [''],
            productLimit: ['', Validators.required],
            defaultvalue: [''],
            defaultRange: [''],
            significant2: [''],
            significant3: [''],
            productPrincipalGl: [''],
            interstExpenseGl: [''],
            receiverPrincipalGl: [''],
            interestPayableGl: [''],
            taxGl: [''],
            taxRate: [0],
            productLimitId: [0],
            frequencyId: ['', Validators.required],
            scheduleMethodId: ['', Validators.required],
            poratedInterest: [''],
            interestRateMax: ['']
        });
        this.productFeeForm = this.fb.group({
            productFeeId: 0,
            productId: 0,
            productPaymentType: ['', Validators.required],
            feeId: ['', Validators.required],
            productFeeType: ['', Validators.required],
            productAmount: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.productId = params["editproductId"];
            if (this.productId != null || this.productId != undefined) {
                this.editProduct(this.productId);
                this.getProductFeeByProduct(this.productId);
                this.getAllRepaymentType();
            }
        });
        this.getAllIntegralFee();
        this.getAllRepaymentType();
        this.getFrequencyTypes();
        this.getAllProductTypes();
        this.getAllGLAccount();
        this.getLoanScheduleTypes();
        this.getAllCollateralTypes();
    }

    getAllCollateralTypes(): void{
        this.loadingService.show();
        this.collateralService.getAllCollateralType().subscribe(data => {
            let collateralTypes = data["result"];
            collateralTypes.forEach(x => {
                this.AllCollateral.push({
                    label: x.name,
                    value: x.collateralTypeId
                });
            })
        }, err => {
          this.loadingService.hide()
        });
    }
    getAllProductTypes() {
        this.investorFundService.getAllProductType().subscribe(res => {
            this.productTypeList = res.infProductTypes;
        }, err => {

        });
    }
    getAllGLAccount() {
        this.subGLService.getAllSubGL().subscribe(data => {
            this.accountList = data.subGls;
          this.glArr = this.accountList.map(item => (
            {label: `${item.subGLName} | ${item.subGLCode}`, value: item.subGLId}
          ));
        });
    }
    getFrequencyTypes() {
        this.loanScheduleService.getAllFrequencyTypes().subscribe(res => {
            this.frequencyTypeList = res.lookUp;
        });
    }
    getAllProductFee() {
        this.productService.getAllProductFee().subscribe(data => {
            this.productProductFees = data["result"];
        });
    }

    getAllIntegralFee() {
        this.loadingService.show();
        this.feeService.getAllFee().subscribe(data => {
            this.loadingService.hide();
            this.feeList = data["result"];
        });
    }

    getProductFeeByProduct(productId) {
        this.productService
            .getProductFeeByProduct(productId)
            .subscribe(data => {
                this.productProductFees = data["result"];
            });
    }

    getAllRepaymentType() {
        this.loadingService.show();
        this.feeService.getAllRepaymentType().subscribe(data => {
            this.loadingService.hide();
            this.repaymentTypeInformation = data.repaymentType;
        });
    }

    getLoanScheduleTypes() {
        this.loanScheduleService.getAllLoanScheduleType().subscribe(res => {
            this.scheduleTypes = res.lookUp;
        });
    }

    onFrequencyTypeChanged(value) {
        let rate = this.form.get("interestRateAnnual").value;
        this.calculatePoratedInterest(rate, value);
    }
    onInterestRateChanged(value) {
        let frequency = this.form.get("frequencyId").value;
        this.calculatePoratedInterest(value, frequency);
    }

    private calculatePoratedInterest(rate, frequency) {
        let freq = this.frequencyTypeList.find(x => x.lookupId == frequency);
        if (freq != undefined) {
            this.selectedFrequency = freq.lookupName;
        }
        let interest = 0;
        if (Number(rate) > 0) {
            switch (Number(frequency)) {
                case 1: {
                    interest = +(Number(rate) / 1).toFixed(2);
                    break;
                }
                case 2: {
                    interest = +(Number(rate) / 2).toFixed(2);
                    break;
                }
                case 3: {
                    interest = +(Number(rate) / 4).toFixed(2);
                    break;
                }
                case 4: {
                    interest = +(Number(rate) / 6).toFixed(2);
                    break;
                }
                case 5: {
                    interest = +(Number(rate) / 12).toFixed(2);
                    break;
                }
                case 6: {
                    interest = +(Number(rate) / 24).toFixed(2);
                    break;
                }
                case 7: {
                    interest = +(Number(rate) / 52).toFixed(2);
                    break;
                }
                case 8: {
                    interest = +(Number(rate) / 365).toFixed(2);
                    break;
                }
                case 9: {
                    interest = +(Number(rate) / 3).toFixed(2);
                    break;
                }
                default: {
                    interest = 0;
                    break;
                }
            }
            this.form.get("interestRateFrequency").setValue(interest);
        }
    }

    editProduct(productId) {
        this.formTitle = "Edit Product Information";
        this.loadingService.show();
        this.investorFundService.getProduct(productId).subscribe(data => {
            this.loadingService.hide();
            let row = data.infProducts[0];
            if (row != undefined) {
                this.otherTabDisabled = false;
            }
            this.form = this.fb.group({
                productId: [row.productId, Validators.required],
                productCode: [row.productCode, Validators.required],
                paymentType: [row.paymentType, Validators.required],
                productName: [row.productName, Validators.required],
                earlyTerminationCharge: [row.earlyTerminationCharge, Validators.required],
                lateTerminationCharge: [row.lateTerminationCharge, Validators.required],
                lowRiskDefinition: [row.lowRiskDefinition, Validators.required],
                interestRepaymentTypeId: [row.interestRepaymentTypeId, Validators.required],
                rate: [row.rate, Validators.required],
                maximumPeriod: [row.maximumPeriod, Validators.required],
                interestRateAnnual: [row.interestRateAnnual],
                interestRateFrequency: [row.interestRateFrequency, Validators.required],
                productPrincipalGl: [row.productPrincipalGl, Validators.required],
                receiverPrincipalGl: [row.receiverPrincipalGl],
                interstExpenseGl: [row.interstExpenseGl, Validators.required],
                interestPayableGl: [row.interestPayableGl, Validators.required],
                productTypeId: [row.productTypeId, Validators.required],
                principalGL: [row.principalGL, Validators.required],
                taxRate: [row.taxRate, Validators.required],
                taxGl: [row.taxGl, Validators.required],
                interestIncomeExpenseGL: [
                    row.interestIncomeExpenseGL,
                    Validators.required
                ],
                interestReceivablePayableGL: [
                    row.interestReceivablePayableGL,
                    Validators.required
                ],
                frequencyId: [row.frequencyId, Validators.required],
                scheduleMethodId: [row.scheduleMethodId, Validators.required],
                collateralPercentage: [row.collateralPercentage],
                interestRateMax: [row.interestRateMax],
                productLimit: [row.productLimit]
            });
            this.productId = row.productId;

            this.weightedRisk = row.weightedMaxScore;
            this.selectedFrequency = row.frequencyName;
            this.getProductFeeByProduct(productId);
            this.calculatePoratedInterest(row.rate, row.frequencyTypeId);
        });
    }

    onFeeTypeChange(feeType) {
        if (feeType == 1) {
            this.amountTitle = "Fixed";
        } else {
            this.amountTitle = "Percentage";
        }
    }

    goBack() {
        this.router.navigate(["/investor/product-list"]);
    }
    submitProductInfo(formObj) {
      const payload = formObj.value;
      payload.scheduleMethodId = 1;
      payload.interestRepaymentTypeId = 1;
      payload.rate = parseFloat(payload.rate);
      payload.productTypeId = parseInt(payload.productTypeId);
      payload.productLimit = parseFloat(payload.productLimit);
      payload.interestRateMax = parseFloat(payload.interestRateMax);
      payload.interestRepaymentTypeId = parseInt(payload.interestRepaymentTypeId);
      payload.scheduleMethodId = parseInt(payload.scheduleMethodId);
      payload.frequencyId = parseInt(payload.frequencyId);
      payload.maximumPeriod = parseInt(payload.maximumPeriod);
      payload.interestRateAnnual = parseFloat(payload.interestRateAnnual);
      payload.interestRateFrequency = parseFloat(payload.interestRateFrequency);
      payload.productPrincipalGl = parseInt(payload.productPrincipalGl);
      payload.receiverPrincipalGl = parseInt(payload.receiverPrincipalGl);
      payload.interstExpenseGl = parseInt(payload.interstExpenseGl);
      payload.interestPayableGl = parseInt(payload.interestPayableGl);
      payload.earlyTerminationCharge = parseFloat(payload.earlyTerminationCharge);
      payload.taxRate = parseFloat(payload.taxRate);
      payload.taxGl = parseInt(payload.taxGl);
        this.loadingService.show();
        this.investorFundService.updateProduct(payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    // this.productId = data["result"].productId;
                    // this.weightedRisk = data["result"].weightedMaxScore;
                    // this.otherTabDisabled = false;
                    // this.editProduct(this.productId);
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigateByUrl('/investor/product-list')
                    // this.activeIndex = this.activeIndex + 1;
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

}
