import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { LoadingService } from "../../../core/services/loading.service";
import { ProductService } from "../../../core/services/product.service";
import { FeeService } from "../../../core/services/fee.service";
import { CommonService } from "../../../core/services/common.service";
import { LoanScheduleService } from "../../../core/services/loanschedule";
import { SubGLService } from "../../../core/services/subgl.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CollateralService } from "../../../core/services/collateral.service";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import swal from "sweetalert2";
import { TreasuryService } from "../../../core/services/treasury.service";

@Component({
  selector: "app-treasury-product",
  templateUrl: "./treasury-product.component.html",
  styleUrls: ["./treasury-product.component.css"]
})
export class TreasuryProductComponent implements OnInit {
  form: FormGroup;
  feeform: FormGroup;
  productFeeForm: FormGroup;
  formTitle: string = "Create Treasury Product";
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
    private treasuryService: TreasuryService
  ) {
    this.form = this.fb.group({
      productId: [0],
      productCode: [""],
      productTypeId: [0],
      productName: [""],
      earlyTerminationCharge: [0],
      lateTerminationCharge: [0],
      rate: [""],
      interestRepaymentTypeId: [""],
      period: [""],
      maximumPeriod: [""],
      interestRateAnnual: [""],
      interestRateFrequency: [""],
      productLimit: [""],
      defaultvalue: [""],
      defaultRange: [""],
      significant2: [""],
      significant3: [""],
      productPrincipalGL: [""],
      interestReceivableGL: [""],
      payingPrincipalGL: [""],
      interestIncomeGL: [""],
      productLimitId: [0],
      frequencyId: [""],
      scheduleMethodId: [""],
      poratedInterest: [""],
      interestRateMax: [0],
      maximumExposure: [""]
    });
    this.productFeeForm = this.fb.group({
      productFeeId: 0,
      productId: 0,
      productPaymentType: [""],
      feeId: [""],
      productFeeType: [""],
      productAmount: [""]
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

  getAllCollateralTypes(): void {
    this.loadingService.show();
    this.collateralService.getAllCollateralType().subscribe(data => {
      let collateralTypes = data["result"];
      collateralTypes.forEach(x => {
        this.AllCollateral.push({
          label: x.name,
          value: x.collateralTypeId
        });
      });
    });
  }
  getAllProductTypes() {
    this.treasuryService.getAllProductTypes().subscribe(
      res => {
        this.productTypeList = res.productTypes;

      },
      err => {

      }
    );
  }
  getAllGLAccount() {
    this.subGLService.getAllSubGL().subscribe(data => {
      this.accountList = data.subGls;
      this.glArr = this.accountList.map(item => ({
        label: `${item.subGLName} | ${item.subGLCode}`,
        value: item.subGLId
      }));
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
    this.productService.getProductFeeByProduct(productId).subscribe(data => {
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

  calculatePoratedInterest(rate, frequency) {
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
    this.treasuryService.getProduct(productId).subscribe(data => {
      this.loadingService.hide();
      let row = data.products[0];
      if (row != undefined) {
        this.otherTabDisabled = false;
      }
      this.form = this.fb.group({
        productId: [row.productId],
        productCode: [row.productCode],
        paymentType: [row.paymentType],
        productName: [row.productName],
        earlyTerminationCharge: [
          row.earlyTerminationCharge
        ],
        lateTerminationCharge: [row.lateTerminationCharge],
        lowRiskDefinition: [row.lowRiskDefinition],
        interestRepaymentTypeId: [
          row.interestRepaymentTypeId
        ],
        rate: [row.rate],
        maximumPeriod: [row.maximumPeriod],
        interestRateAnnual: [row.interestRateAnnual],
        interestRateFrequency: [row.interestRateFrequency],
        productPrincipalGL: [row.productPrincipalGL],
        payingPrincipalGL: [row.payingPrincipalGL],
        interestReceivableGL: [row.interestReceivableGL],
        productTypeId: [row.productTypeId],
        // principalGL: [row.principalGL],
        interestIncomeGL: [row.interestIncomeGL],
        frequencyId: [row.frequencyId],
        scheduleMethodId: [row.scheduleMethodId],
        collateralPercentage: [row.collateralPercentage],
        interestRateMax: [row.interestrateMax],
        productLimit: [row.productLimit],
        maximumExposure: [row.maximumExposure]
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
    this.router.navigate(["/treasury/product-list"]);
  }
  submitProductInfo(formObj) {
    const payload = formObj.value;
    payload.productTypeId = +payload.productTypeId;
    payload.interestRate = +payload.interestRate;
    payload.paymentType = +payload.paymentType;
    payload.productLimit = +payload.productLimit;
    payload.interestrateMax = +payload.interestrateMax;
    payload.interestRepaymentTypeId = +payload.interestRepaymentTypeId;
    payload.scheduleMethodId = +payload.scheduleMethodId;
    payload.frequencyId = +payload.frequencyId;
    payload.maximumPeriod = +payload.maximumPeriod;
    payload.interestRateAnnual = +payload.interestRateAnnual;
    payload.interestRateFrequency = +payload.interestRateFrequency;
    payload.productPrincipalGL = +payload.productPrincipalGL;
    payload.payingPrincipalGL = +payload.payingPrincipalGL;
    payload.interestIncomeGL = +payload.interestIncomeGL;
    payload.interestReceivableGL = +payload.interestReceivableGL;
    payload.maximumExposure = +payload.maximumExposure;
    // payload.interestrateMax = 0;
    this.loadingService.show();
    this.treasuryService.updateProduct(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigateByUrl("/treasury/product-list");
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
