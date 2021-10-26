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
import { LoanCustomerService } from "../../../core/services/loancustomer.service";

@Component({
  selector: "app-collection",
  templateUrl: "./collection.component.html",
  styleUrls: ["./collection.component.css"]
})
export class CollectionComponent implements OnInit {
  form: FormGroup;
  feeform: FormGroup;
  formTitle: string = "Collection Form";
  AllCollateral: SelectItem[] = [];
  activeIndex: number = 0;
  taxAmount: number = 0;
  amountPayable: number = 0;
  interestPayable: number = 0;
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
  investorFundCustomerId: any;
  investmentId: any;
  period: any;
  effectiveDate: any;
  accountNumber: any;
  investorName: any;
  maturityDate: any;
  paymentMode: any = "";
  bankDetails: any[] = [];
  websiteCollectionOperationId: number;
  date1: string;
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
    private loanApplicationService: LoanApplicationService,
    private loanCustomerService: LoanCustomerService
  ) {
    this.form = this.fb.group({
      invInvestorFundId: [0],
      productId: [0],
      investorFundCustomerId: [""],
      proposedTenor: ["", Validators.required],
      proposedRate: ["", Validators.required],
      frequencyId: [0, Validators.required],
      period: ["", Validators.required],
      proposedAmount: [, Validators.required],
      effectiveDate: ["", Validators.required],
      investmentPurpose: [""],
      instrumentId: [0],
      instrumentNumer: [""],
      instrumentDate: [""],
      enableRollOver: ["", Validators.required],
      currencyId: [0],
      collectionDate: [""],
      amountPayable: [""],
      taxAmount: [""],
      interestPayable: [""],
      account: [""],
      websiteCollectionOperationId: [0]
    });

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.investorFundCustomerId = params["investorId"];
      this.investmentId = params["investmentId"];
      this.websiteCollectionOperationId = params.websiteCollectionOperationId;
      if (
        (this.investorFundCustomerId != null ||
          this.investorFundCustomerId != undefined) &&
        (this.investmentId != null || this.investmentId != undefined)
      ) {
        this.getInvestment(this.investmentId, 1);
      }
      if (
        this.investorFundCustomerId != null &&
        this.websiteCollectionOperationId != undefined
      ) {
        this.getInvestment(this.websiteCollectionOperationId, 2);
      }
    });
    this.getCustomers();
    this.getCurrencies();
    this.getFrequencyTypes();
    this.getAllProductTypes();
    this.getBankDetails();
    this.getCurrentBalance();
    // this.getRunningFacilities();
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

  getCurrentBalance() {
    this.loadingService.show();
    return this.investorFundService
      .getCollectionBalance(this.investmentId)
      .subscribe(
        data => {
          if (data.status.isSuccessful){
            this.loadingService.hide();
            this.amountPayable = data.currentBalance.amountPayable
            this.taxAmount = data.currentBalance.taxAmount
            this.interestPayable = data.currentBalance.interestPayable
            // this.form.get("amountPayable").setValue(data.currentBalance.amountPayable);
            // this.form.get("taxAmount").setValue( data.currentBalance.taxAmount);
            // this.form.get("interestPayable").setValue(data.currentBalance.interestPayable);
          }else {
            this.loadingService.hide();
            swal.fire("GOS FINANCIAL", "The selected date doesn't have a current balance", "error");
          }

        },
        err => {
          this.loadingService.hide();

        }
      );
  }

  calculateInterest(principal: number, rate: number, tenor: number) {
    return (principal * rate * tenor) / 100;
  }
  calculateAmountPayable(principal: number, interest: number) {
    return principal + interest;
  }
  getInvestment(id: any, type) {
    if (type == 1) {
      return this.investorFundService.getInvestment(id).subscribe(data => {
        let row = data.investorFunds[0];
        this.period = row.period;
        this.effectiveDate = row.effectiveDate;
        this.accountNumber = row.accountNumber;
        this.investorName = row.investorName;
        this.maturityDate = row.maturityDate;
        // const interest = this.calculateInterest(
        //   row.approvedAmount,
        //   row.approvedRate / 100,
        //   row.approvedTenor
        // );
        // const amountPayable = this.calculateAmountPayable(
        //   row.approvedAmount,
        //   interest
        // );
        this.form = this.fb.group({
          investorFundId: [row.investorFundId],
          investorFundCustomerId: [row.investorFundCustomerId],
          proposedTenor: [row.proposedTenor],
          proposedRate: [row.proposedRate],
          frequencyId: [row.frequencyId],
          period: [row.period],
          proposedAmount: [row.approvedAmount],
          effectiveDate: [this.onDateSelect(row.effectiveDate, 1)],
          investmentPurpose: [row.investmentPurpose],
          instrumentId: [row.instrumentId],
          instrumentNumer: [row.instrumentNumer],
          collectionDate: [""],
          currencyId: [row.currencyId],
          productId: [row.productId],
          amountPayable: this.amountPayable,
          taxAmount: this.taxAmount,
          interestPayable: this.interestPayable,
          paymentAccount: this.paymentMode,
          account: [row.accountNumber]      
        });     
      });     
    }
    if (type == 2) {
      return this.investorFundService
        .getPendingCustomerCollection(this.websiteCollectionOperationId)
        .subscribe(data => {
          let row = data.collections[0];
          this.period = row.period;
          this.effectiveDate = row.effectiveDate;
          this.accountNumber = row.accountNumber;
          this.investorName = row.investorName;
          this.maturityDate = row.maturityDate;
          const interest = this.calculateInterest(
            row.approvedAmount,
            row.approvedRate / 100,
            row.approvedTenor
          );
          const amountPayable = this.calculateAmountPayable(
            row.approvedAmount,
            interest
          );
          this.form = this.fb.group({
            investorFundId: [row.investorFundId],
            investorFundCustomerId: [row.investorFundCustomerId],
            proposedTenor: [row.proposedTenor],
            proposedRate: [row.proposedRate],
            frequencyId: [row.frequencyId],
            period: [row.period],
            proposedAmount: [row.proposedAmount],
            effectiveDate: [this.onDateSelect(row.effectiveDate, 1)],
            investmentPurpose: [row.investmentPurpose],
            instrumentId: [row.instrumentId],
            instrumentNumer: [row.instrumentNumer],
            collectionDate: [new Date(row.collectionDate)],
            currencyId: [row.currencyId],
            productId: [row.productId],
            amountPayable: [row.amountPayable],
            interestPayable: [row.interestPayable],
            taxAmount: [row.taxAmount],
            account: [row.account],
            websiteCollectionOperationId: this.websiteCollectionOperationId
          });
          this.paymentMode = row.paymentAccount;
          this.accountNumber = row.account;
        });
    }  
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
  getRunningFacilities() {
    return this.investorFundService
      .getAllRunningFacilities(this.investorFundCustomerId)
      .subscribe(
        data => {
        },
        err => {
          return err;
        }
      );
  }
  addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }
  submitCollection(formObj) {
    const payload = formObj.value;
    payload.proposedAmount = parseFloat(payload.proposedAmount);
    payload.period = parseFloat(payload.period);
    payload.amountPayable = parseFloat(payload.amountPayable);
    payload.taxAmount = parseFloat(payload.taxAmount);
    payload.interestPayable = parseFloat(payload.interestPayable);
    payload.paymentAccount = this.paymentMode;
    payload.effectiveDate = new Date(payload.effectiveDate);
    payload.websiteCollectionOperationId = parseFloat(payload.websiteCollectionOperationId);
    if (!payload.collectionDate) {
      return swal.fire("GOS FINANCIALS", "Please select collection date");
    }
    if (!payload.collectionDate) {
      // return swal
      //   .fire(
      //     "GOS FINANCIALS",
      //     "Maturity date not reached yet, please request for liquidation"
      //   )
      //   .then(res => {
      //     if (res) {
      //     }
      //   });
    } else {
      swal
        .fire({
          title: "Are you sure you want to proceed to collection?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        })
        .then(result => {
          if (result.value) {
            this.loadingService.show();
            this.investorFundService.updateCollection(payload).subscribe(
              data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                  // this.productId = data["result"].productId;
                  // this.weightedRisk = data["result"].weightedMaxScore;
                  // this.otherTabDisabled = false;
                  // this.editProduct(this.productId);
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.router.navigateByUrl("/investor/pending-collections");
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
          } else {
            swal.fire("GOS FINANCIALS", "Cancelled", "error");
          }
        })
        .catch(err => {

        });
    }
  }
  getLoanApplication(investorFundCustomerId) {
    this.loadingService.show();
    this.loanApplicationService
      .GetRunningLoanApplicationByCustomer(this.investorFundCustomerId)
      .subscribe(data => {
        this.loadingService.hide();
        this.loanApplicationInformation = data["result"];
      });
  }
  getBankDetails() {
    return this.loanCustomerService
      .getLoanCustomerBankDetailsByLoanCustomer(this.investorFundCustomerId)
      .subscribe(data => {
        this.bankDetails = data.result;
      });
  }
  rowClicked(x) {}
  onDateSelect(date, type) {
    // date = this.collectionForm.get("effectiveDate").value;
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
        this.form.get("collectionDate").setValue(this.selectedDate);
        return this.selectedDate;
      }

    }

  }
}
