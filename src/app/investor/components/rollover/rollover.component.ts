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

@Component({
  selector: 'app-rollover',
  templateUrl: './rollover.component.html',
  styleUrls: ['./rollover.component.css']
})
export class RolloverComponent implements OnInit {
  form: FormGroup;
  feeform: FormGroup;
  productFeeForm: FormGroup;
  formTitle: string = "Roll Over Form";
  AllCollateral: SelectItem[] = [];
  activeIndex: number = 0;
  productInformation: any[] = [];
  selectedProductInformation: any[];
  repaymentTypeInformation: any[] = [];
  displayProductFee: boolean = false;
  otherTabDisabled: boolean = true;
  productId: any;
  amountTitle: string = "";
  date1: string;
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
  investorFundCustomerId: any;
  investmentId: any;
  earlyTerminationCharge: any;
  proposedRate: any;
  principal: any;
  accountNumber: any;
  issuerName: any;
  bankDetails: any[] = [];
  paymentMode: any = "";
  investorName: any;
  investorFundIdWebsiteRolloverId: string;
  liquidationDate: any;
  selectedDate: string;
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
    private loanApplicationService: LoanApplicationService
  ) {
    this.form = this.fb.group({
      invInvestorFundId: [0],
      productId: [""],
      investorFundCustomerId: [0],
      proposedTenor: ["", Validators.required],
      proposedRate: ["", Validators.required],
      frequencyId: [0, Validators.required],
      period: ["", Validators.required],
      proposedAmount: [Validators.required],
      effectiveDate: ["", Validators.required],
      investmentPurpose: [""],
      instrumentId: [0],
      earlyTerminationCharge: [""],
      instrumentDate: [""],
      enableRollOver: ["", Validators.required],
      currencyId: [0],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.investorFundCustomerId = params["investorId"];
      this.investmentId = params["investmentId"];
      this.investorFundIdWebsiteRolloverId =
        params["investorFundIdWebsiteRolloverId"];
      if (
        (this.investorFundCustomerId != null ||
          this.investorFundCustomerId != undefined) &&
        (this.investmentId != null || this.investmentId != undefined)
      ) {
        this.getInvestment(this.investmentId, 1);
      }
      if (
        this.investorFundIdWebsiteRolloverId != undefined
      ) {
        this.getInvestment(this.investorFundIdWebsiteRolloverId, 2);
      }
    });
    this.getCustomers();
    this.getCurrencies();
    this.getFrequencyTypes();
    this.getAllProductTypes();
    this.getBankDetails();
  }
  getCustomers() {
    return this.investorFundService.getAllInvestorCustomer().subscribe(
      data => {
        this.customers = data.investorLists;
      },
      err => {

      }
    );
  }
  calculateTerminationCharge(
    terminationRate: number,
    principalAndInterest: number
  ) {
    return terminationRate * principalAndInterest;
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
  getInvestment(id: any, type) {
    if (type == 1) {
      return this.investorFundService.getInvestment(id).subscribe(data => {
        let row = data.investorFunds[0];
        this.earlyTerminationCharge = row.terminationCharge / 100;
        this.proposedRate = row.approvedRate / 100;
        this.principal = row.approvedAmount;
        this.accountNumber = row.accountNumber;
        this.investorName = row.investorName;
        this.investmentId = row.investorFundId;
        this.form = this.fb.group({
          investorFundId: [row.investorFundId],
          investorFundCustomerId: [row.investorFundCustomerId],
          proposedTenor: [row.approvedTenor],
          proposedRate: [row.approvedRate],
          frequencyId: [row.frequencyId],
          period: [row.period],
          proposedAmount: [
            row.payout
          ],
          effectiveDate: [null],
          investmentPurpose: [row.investmentPurpose],
          instrumentId: [row.instrumentId],
          earlyTerminationCharge: [],
          liquidationDate: [""],
          currencyId: [row.currencyId],
          productId: [row.productId],
          amountPayable: [],
          account: [row.account],
          paymentAccount: this.paymentMode
        });
      });
    }
    if (type == 2) {
      return this.investorFundService
        .getPendingCustomerRolloverByID(this.investorFundIdWebsiteRolloverId)
        .subscribe(
          data => {
            let row = data.investorFunds[0];
            this.earlyTerminationCharge = row.terminationCharge / 100;
            this.proposedRate = row.approvedRate / 100;
            this.principal = row.approvedAmount;
            this.accountNumber = row.accountNumber;
            this.investorName = row.investorName;
            this.paymentMode = row.paymentAccount;
            this.accountNumber = row.account;
            this.investmentId = row.investorFundId;

            this.form = this.fb.group({
              investorFundId: [row.investorFundId],
              investorFundCustomerId: [row.investorFundCustomerId],
              proposedTenor: [row.proposedTenor],
              proposedRate: [row.proposedRate],
              frequencyId: [row.frequencyId],
              period: [row.period],
              proposedAmount: [row.proposedAmount],
              effectiveDate: [null],
              //effectiveDate: [this.onDateSelect(row.effectiveDate, 1)],
              investmentPurpose: [row.investmentPurpose],
              instrumentId: [row.instrumentId],
              earlyTerminationCharge: [row.earlyTerminationCharge],
              liquidationDate: [new Date(row.liquidationDate)],
              currencyId: [row.currencyId],
              productId: [row.productId],
              amountPayable: [row.amountPayable],
              account: [row.account],
              paymentAccount: this.paymentMode
            });
          },
          err => {

          },
          () => {
          }
        );
    }
  }

  getCurrencies() {
    this.loadingService.show();
    this.commonService.getAllCurrency().subscribe(
      data => {
        this.loadingService.hide();
        this.currencies = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getAllProductTypes() {
    this.investorFundService.getProducts().subscribe(
      res => {
        this.productTypeList = res.infProducts;
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

  submit(formObj) {
    const payload = formObj.value;
    payload.earlyTerminationCharge = parseFloat(payload.earlyTerminationCharge);
    payload.amountPayable = parseFloat(
      payload.amountPayable
    );
    payload.period = payload.period;
    payload.investorFundId = this.investmentId;
    payload.proposedTenor = parseFloat(payload.proposedTenor);
    payload.proposedAmount = parseFloat(
      payload.proposedAmount
    );
    if (this.investorFundIdWebsiteRolloverId != undefined) {
      payload.investorFundIdWebsiteRolloverId = parseInt(this.investorFundIdWebsiteRolloverId)
    }

    swal
      .fire({
        title: "Are you sure you want to roll over?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(res => {
        if (res.value) {
          this.loadingService.show();
          this.investorFundService.updateRollover(payload).subscribe(
            data => {
              this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.router.navigateByUrl("/investor/investments-list");
              } else {
                swal.fire("GOS FINANCIAL", message, "error");
              }
            },
            err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOS FINANCIAL", message, "error");
            },
            () => {}
          );
        } else {
          return swal.fire("GOS FINANCIALS", "Cancelled", "error");
        }
      });
  }

  getBankDetails() {
    return this.investorFundService
      .getInvestorBankDetails(this.investorFundCustomerId)
      .subscribe(data => {
        this.bankDetails = data.customerBankDetails;
      });
  }
  rowClicked(x) {}
  getCurrentBalance() {
    this.loadingService.show();
    let date = new Date(Date.parse(this.form.get("liquidationDate").value));
    let queryDate = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`;
    return this.investorFundService
      .getCurrentBalance(queryDate, this.investmentId)
      .subscribe(
        data => {
          this.loadingService.hide();
          let currentBalance: any = data.currentBalance;
          let interestEarned = currentBalance - this.principal;
          let terminationCharge: any = (
            this.earlyTerminationCharge * interestEarned
          ).toFixed(2);
          let payout = (currentBalance - terminationCharge)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,");
          this.form.get("amountPayable").setValue(payout);
          this.form.get("earlyTerminationCharge").setValue(terminationCharge);
        },
        err => {
          this.loadingService.hide();

        }
      );
  }

  onDateSelect(date, type) {
    if (date != null) {
      let d = new Date(Date.parse(date));
      if (type == 1) {
        this.date1 = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        this.form.get("effectiveDate").setValue(this.date1);
        return this.date1;
      }
      if (type == 2) {
        this.selectedDate = `${d.getFullYear()}-${d.getMonth() +
        1}-${d.getDate()}`;
        this.form.get("liquidationDate").setValue(this.selectedDate);
        return this.selectedDate;
      }

    }

  }
}
