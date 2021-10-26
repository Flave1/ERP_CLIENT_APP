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
import { CurrencyService } from "../../../core/services/currency.service";
import { LoanApplicationService } from "../../../core/services/loanapplication.service";
import swal from "sweetalert2";
import { TreasuryService } from "../../../core/services/treasury.service";

@Component({
  selector: "app-treasury-liquidation",
  templateUrl: "./treasury-liquidation.component.html",
  styleUrls: ["./treasury-liquidation.component.css"]
})
export class TreasuryLiquidationComponent implements OnInit {
  form: FormGroup;
  feeform: FormGroup;
  productFeeForm: FormGroup;
  formTitle: string = "Liquidation Form";
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
  investmentId: any;
  earlyTerminationCharge: any;
  proposedRate: any;
  principal: any;
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
    private treasuryService: TreasuryService,
    private currencyService: CurrencyService,
    private loanApplicationService: LoanApplicationService
  ) {
    this.form = this.fb.group({
      treasureIssuerInvestmentId: [0],
      productId: [""],
      issuerRegistrationId: [""],
      proposedTenor: ["", Validators.required],
      proposedRate: ["", Validators.required],
      frequencyId: ["", Validators.required],
      period: ["", Validators.required],
      proposedAmount: [, Validators.required],
      effectiveDate: ["", Validators.required],
      investmentPurpose: [""],
      instrumentId: [""],
      earlyTerminationCharge: [""],
      instrumentDate: [""],
      enableRollOver: ["", Validators.required],
      currencyId: [""],
      liquidationDate: [""],
      amountReceivable: [""]
    });
    this.productFeeForm = this.fb.group({
      productFeeId: 0,
      productId: 0,
      productPaymentType: ["", Validators.required],
      feeId: ["", Validators.required],
      productFeeType: ["", Validators.required],
      productAmount: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // this.issuerRegistrationId = params["issuerId"];
      this.investmentId = params["investmentId"];
      if (this.investmentId != null || this.investmentId != undefined) {
        this.getInvestment(this.investmentId);
      }
    });
    this.getCustomers();
    this.getCurrencies();
    this.getFrequencyTypes();
    this.getAllProductTypes();
    // this.getRunningFacilities();
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
  calculateTerminationCharge(
    rate: number,
    principal: number,
    interest: number
  ) {
    return rate * (principal + interest);
  }
  calculateInterest(principal: number, rate: number, tenor: number) {
    return (principal * rate * tenor) / 100;
  }
  calculateAmountPayable(
    principal: number,
    interest: number,
    terminationCharge: number
  ) {
    return principal + interest - terminationCharge;
  }
  getInvestment(id: any) {
    return this.treasuryService.getIssuerInvestment(id).subscribe(data => {
      let row = data.issuerInvestments[0];
      this.earlyTerminationCharge = row.terminationCharge / 100;
      this.proposedRate = row.proposedRate / 100;
      this.principal = row.proposedAmount;
      const interest = this.calculateInterest(
        this.principal,
        this.proposedRate,
        row.proposedTenor
      );
      const terminationCharge = this.calculateTerminationCharge(
        this.proposedRate,
        this.principal,
        interest
      );
      const amountPayable = this.calculateAmountPayable(
        this.principal,
        interest,
        terminationCharge
      );
      this.form = this.fb.group({
        treasureIssuerInvestmentId: [row.treasureIssuerInvestmentId],
        issuerRegistrationId: row.issuerRegistrationId,
        proposedTenor: [row.proposedTenor],
        proposedRate: [row.proposedRate],
        frequencyId: [row.frequencyId],
        period: [row.period],
        proposedAmount: [
          row.proposedAmount
        ],
        effectiveDate: [new Date(row.effectiveDate)],
        investmentPurpose: [row.investmentPurpose],
        instrumentId: [row.instrumentId],
        earlyTerminationCharge: [
          terminationCharge
        ],
        liquidationDate: [""],
        currencyId: [row.currencyId],
        productId: [row.productId],
        amountReceivable: [
          amountPayable
        ]
      });
    });
  }
  getCurrencies() {
    return this.currencyService.getAllCurrency().subscribe(
      data => {
        this.currencies = data.result;
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
    this.router.navigate(["/investor/investments-list"]);
  }
  // getRunningFacilities() {
  //     return this.treasuryService.getAllRunningFacilities(this.issuerRegistrationId).subscribe(
  //         data => {
  //
  //         },
  //         err => {
  //             return err;
  //         }
  //     );
  // }
  liquidate(formObj) {
    const payload = formObj.value;
    payload.issuerRegistrationId = +payload.issuerRegistrationId;
    payload.treasureIssuerInvestmentId = +this.investmentId;
    payload.productId = +payload.productId;
    payload.tenor = +payload.tenor;
    payload.rate = +payload.rate;
    payload.frequencyId = +payload.frequencyId;
    payload.period = +payload.period;
    payload.proposedAmount = +payload.proposedAmount;
    payload.currencyId = +payload.currencyId;
    payload.amountReceivable = +payload.amountReceivable;
    payload.earlyTerminationCharge = +payload.earlyTerminationCharge
    if (!payload.liquidationDate) {
      return swal.fire(
        "GOS FINANCIALS",
        "Please select liquidation date",
        "error"
      );
    }
    swal
      .fire({
        title: "Are you sure you want to proceed to liquidate?",
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(res => {
        if (res.value) {
          this.loadingService.show();
          this.treasuryService.updateLiquidation(formObj.value).subscribe(
            data => {
              this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.router.navigateByUrl("/treasury/investments-list");
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
          return swal.fire("GOS FINANCIALS", "Cancelled", "error");
        }
      });
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

  rowClicked(x) {}
}
