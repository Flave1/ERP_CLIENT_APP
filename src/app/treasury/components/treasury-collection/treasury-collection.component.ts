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
import {Location} from '@angular/common';

@Component({
  selector: "app-treasury-collection",
  templateUrl: "./treasury-collection.component.html",
  styleUrls: ["./treasury-collection.component.css"]
})
export class TreasuryCollectionComponent implements OnInit {
  form: FormGroup;
  feeform: FormGroup;
  productFeeForm: FormGroup;
  formTitle: string = "Collection Form";
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
  period: any;
  effectiveDate: any;
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
    private loanApplicationService: LoanApplicationService,
    private _location: Location
  ) {
    this.form = this.fb.group({
      treasureIssuerInvestmentId: [0],
      productId: [0],
      issuerRegistrationId: [""],
      proposedTenor: ["", Validators.required],
      proposedRate: ["", Validators.required],
      frequencyId: [0, Validators.required],
      period: ["", Validators.required],
      proposedAmount: ["", Validators.required],
      effectiveDate: ["", Validators.required],
      investmentPurpose: [""],
      instrumentId: [0],
      instrumentNumer: [""],
      instrumentDate: [""],
      enableRollOver: ["", Validators.required],
      currencyId: [0],
      collectionDate: [""],
      amountReceivable: [""]
    });

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

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
  calculateInterest(principal: number, rate: number, tenor: number) {
    return (principal * rate * tenor) / 100;
  }
  calculateAmountPayable(principal: number, interest: number) {
    return principal + interest;
  }
  getInvestment(id: any) {
    this.loadingService.show();
    return this.treasuryService.getIssuerInvestment(id).subscribe(data => {
      this.loadingService.hide();
      let row = data.issuerInvestments[0];
      this.period = row.period;
      this.effectiveDate = row.effectiveDate;
      const interest = this.calculateInterest(
        row.proposedAmount,
        row.proposedRate / 100,
        row.proposedTenor
      );
      const amountPayable = this.calculateAmountPayable(
        row.proposedAmount,
        interest
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
        instrumentNumer: [row.instrumentNumer],
        collectionDate: [""],
        currencyId: [row.currencyId],
        productId: [row.productId],
        amountReceivable: [
          amountPayable
        ]
      });
    }, err => {
      this.loadingService.hide();
    });
  }
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
    this._location.back()
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
  addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }
  submitCollection(formObj) {
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
    if (!payload.collectionDate) {
      return swal.fire("GOS FINANCIALS", "Please select collection date", 'error');
    }
    const maturityDate = this.addDays(
      new Date(this.effectiveDate),
      this.period
    );
    // if (payload.collectionDate < maturityDate) {
    //   return swal.fire(
    //     "GOS FINANCIALS",
    //     "Maturity date not reached yet, please request for liquidation"
    //   );
    // }
    return swal
      .fire({
        title: "Are you sure you want to proceed to collection?",
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          this.loadingService.show();
          this.treasuryService.updateCollection(payload).subscribe(
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
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      })
      .catch(err => {

      });
  }

  rowClicked(x) {}
}
