import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingService } from "src/app/core/services/loading.service";
import { LoanApplicationService } from "src/app/core/services/loanapplication.service";
import { ValidationService } from "src/app/core/services/validation.service";
import { ProductService } from "src/app/core/services/product.service";
import { CurrencyService } from "src/app/core/services/currency.service";
import { LoanCustomerService } from "src/app/core/services/loancustomer.service";
import { LoanScheduleService } from "src/app/core/services/loanschedule";
import { LoanService } from "../../../core/services/loan.service";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-loanapplication",
  templateUrl: "./loanapplication.component.html"
})
export class LoanApplicationComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Create New LoanApplication";
  activeIndex: number = 0;
  loanApplicationInformation: any[] = [];
  productInformation: any[] = [];
  currencyInformation: any[] = [];
  loanCustomerInformation: any[] = [];
  selectedLoanApplicationInformation: any[];
  customerId: any;
  proposedProductId: any;
  selectPoliticallyPosition: boolean = false;
  selectPoliticallyExposed: boolean = false;
  selectRelativePoliticallyPosition: boolean = false;
  loanApplicationDirectors: any[] = [];
  loanApplicationIdentityDetails: any[] = [];
  loanApplicationNextOfKins: any[] = [];
  loanApplicationBankDetails: any[] = [];
  loanApplicationDirectorShareHolder: any[] = [];
  frequencyTypeList: any[] = [];
  ProductLimit: any;
  cols: any[];
  id: number;
  productId: number;
  payload: any;
  customerName: string;
  customerAccount: string;
  bankDetails: any[] = [];
  paymentMode: any = "";
  repaymentMode: any = "";
  accountNumber: any;
  paymentAccount: any = "";
  repaymentAccount: any = "";
  date1: string;
  selectedDate: string;
  val: any
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private loanApplicationService: LoanApplicationService,
    private productService: ProductService,
    private currencyService: CurrencyService,
    private loanCustomerService: LoanCustomerService,
    private loanScheduleService: LoanScheduleService,
    private router: Router,
    private route: ActivatedRoute,
    private loanService: LoanService,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      customerId: [0],
      //proposedProductId: [1],
      proposedProductId: ["", Validators.required],
      proposedTenor: ["", Validators.required],
      proposedRate: ["", Validators.required],
      proposedAmount: ["", Validators.required],
      // approvedProductId: [""],
      // approvedTenor: [""],
      // approvedRate: [""],
      // approvedAmount: [""],
      currencyId: ["", Validators.required],
      exchangeRate: [0, Validators.required],
      // statusId: [""],
      hasDoneChecklist: [false],
      effectiveDate: ["", Validators.required],
      maturityDate: [new Date()],
      firstPrincipalDate: [null],
      firstInterestDate: [null],
      purpose: ["", Validators.required],
      frequencyTypeId: [""],
      period: [""],
      websiteLoanApplicationId: 0,
      paymentMode: [0, Validators.required],
      paymentAccount: ["", Validators.required],
      repaymentMode: [0],
      repaymentAccount: [""],
      applicationDate: [new Date()],
    });
  }

  ngOnInit() {
    this.payload = {};
    this.cols = [
      {
        field: "customerName",
        header: "customerName"
      },
      {
        field: "approvedProductName",
        header: "approvedProductName"
      },
      {
        field: "approvedTenor",
        header: "approvedTenor"
      },
      {
        field: "approvedRate",
        header: "approvedRate"
      },
      {
        field: "approvedAmount",
        header: "approvedAmount"
      }
    ];
    this.route.queryParams.subscribe(params => {
      this.customerId = params.passloanapplication;
      this.id = params.id;
      if ((this.id != null || this.id != undefined) && this.customerId !== undefined) {
        this.getLoanData(this.id).then(() => {
          // this.getProduct(this.productId);
          // this.onCurrencyChanged(this.payload.currencyId);
          this.getCustomer(this.customerId)
        });
      } else if (this.customerId != null || this.customerId != undefined) {
        this.payload.customerId = this.customerId;
        this.getLoanApplicationByCustomer(this.customerId);
        this.getCustomer(this.customerId)
      } else {
        this.id = 0;
      }


    });
    this.getLoanApplication(this.customerId);
    this.getAllProduct();
    this.getAllCurrency();
    this.getFrequencyTypes();
    this.getBankDetails();
  }

  getAllCurrency() {
    this.loadingService.show();
    this.commonService.getAllCurrency().subscribe(
      data => {
        this.loadingService.hide();
        this.currencyInformation = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getCustomer(id: number) {
    return this.loanCustomerService.getCustomer(id).subscribe(data => {
      let customerData = data.customers[0];
      this.customerName = `${customerData.firstName} ${customerData.lastName}`;
      this.form.patchValue({
        customerId: id
      })
      this.customerAccount = this.customerName + " - " + `${customerData.casaAccountNumber}`
      this.payload.customerId = customerData.customerId
    }, err => {

    })
  }
  getAllLoanCustomer() {
    this.loadingService.show();
    this.loanCustomerService.getAllLoanCustomer().subscribe(data => {
      this.loadingService.hide();
      this.loanCustomerInformation = data["result"];
    });
  }
  getFrequencyTypes() {
    this.loanScheduleService.getAllFrequencyTypes().subscribe(
      res => {
        this.frequencyTypeList = res.lookUp;
      },
      err => {

      }
    );
  }
  getAllProduct() {
    this.loadingService.show();
    this.productService.getAllProduct().subscribe(data => {
      this.loadingService.hide().then(() => {
        this.productInformation = data.products;
      });
    }, err => {
      this.loadingService.hide()
    });
  }

  getLoanApplication(customerId) {
    this.loadingService.show();
    this.loanApplicationService
      .GetRunningLoanApplicationByCustomer(this.customerId)
      .subscribe(data => {
        this.loadingService.hide().then(() => {
          this.loanApplicationInformation = data.loanApplications
        });
        ;
      });
  }

  onProductChange(proposedProductId) {
    this.getProduct(proposedProductId);
  }

  getProduct(proposedProductId) {
    this.loadingService.show();
    this.productService.getProduct(proposedProductId).subscribe(data => {
      this.loadingService.hide().then(() => {
        let row = data.products[0];
        if (row != undefined) {
          this.form.controls["proposedRate"].setValue(row.rate);
          this.form.controls["proposedTenor"].setValue(row.tenor);
          this.form.controls["frequencyTypeId"].setValue(row.frequencyTypeId);
          this.form.controls["period"].setValue(row.period);
          // this.payload.proposedRate = row.rate;
          // this.payload.proposedTenor = row.tenor;
          // this.payload.frequencyTypeId = row.frequencyTypeId;
          // this.payload.period = row.period;
          this.ProductLimit = row.productLimit;
        }
      });

    }, err => {
      this.loadingService.hide()
    });
  }

  getLoanApplicationByCustomer(customerId) {
    this.formTitle = "Loan Application Information";
    this.loadingService.show();
    this.loanApplicationService
      .GetLoanApplicationByCustomer(this.customerId)
      .subscribe(
        data => {
          this.loadingService.hide();
          let row = data.loanApplications[0];
          if (row != undefined) {
          }
          // this.form.patchValue({
          //   customerId: this.customerId,
          // })
          // this.form = this.fb.group({
          //   customerId: this.customerId,
          //   proposedProductId: row.proposedProductId,
          //   proposedTenor: row.proposedTenor,
          //   proposedRate: row.proposedRate,
          //   proposedAmount: row.proposedAmount,
          //   currencyId: row.currencyId,
          //   exchangeRate: row.exchangeRate,
          //   effectiveDate: null,
          //   firstPrincipalDate: null,
          //   firstInterestDate: null,
          //   maturityDate: [new Date()],
          //   purpose: row.purpose,
          //   frequencyTypeId: [row.frequencyTypeId],
          //   period: [row.period],
          //   paymentMode: [""],
          //   paymentAccount: [""],
          //   applicationDate : [new Date()],
          // });
        },
        err => {
          this.loadingService.hide();
        }
      );
  }

  getBankDetails() {
    return this.loanCustomerService
      .getLoanCustomerBankDetailsByLoanCustomer(this.customerId)
      .subscribe(data => {
        this.bankDetails = data.customerBankDetails;
      });
  }

  goBack() {
    this.router.navigate(["/credit/startloanapplication-list"]);
  }
  rowClicked(v) { }
  submitLoanApplicationInfo(formObj: FormGroup) {
    const payload = formObj.value
    payload.customerId = this.customerId;
    if (!payload.customerId) {
      return swal.fire("GOS FINANCIAL", "Select Customer", "error");
    }
    if (!payload.proposedProductId) {
      return swal.fire("GOS FINANCIAL", "Select Product", "error");
    }
    if (!payload.proposedTenor) {
      return swal.fire("GOS FINANCIAL", "Enter proposed Tenor", "error");
    }
    if (!payload.proposedRate) {
      return swal.fire("GOS FINANCIAL", "Enter proposed rate", "error");
    }
    if (!payload.proposedAmount) {
      return swal.fire("GOS FINANCIAL", "Enter proposed amount", "error");
    }
    if (payload.proposedAmount < 1) {
      return swal.fire("GOS FINANCIAL", "Proposed amount cannot be lesss than 1", "error");
    }
    if (!payload.currencyId) {
      return swal.fire("GOS FINANCIAL", "Select currency", "error");
    }
    if (!payload.exchangeRate) {
      return swal.fire("GOS FINANCIAL", "Enter exchange rate", "error");
    }
    if (!payload.paymentAccount) {
      return swal.fire("GOS FINANCIAL", "Select Payment Account", "error");
    }
    if (
      new Date(payload.effectiveDate).toDateString() ===
      new Date(payload.firstPrincipalDate).toDateString()
    ) {
      return swal.fire(
        "GOS FINANCIAL",
        "Effective date date must not be the same as first principal payment date, select a different date",
        "error"
      );
    }
    if (
      new Date(payload.effectiveDate).toDateString() ===
      new Date(payload.firstInterestDate).toDateString()
    ) {
      return swal.fire(
        "GOS FINANCIAL",
        "Effective date must not be the same as first interest payment date, select a different date",
        "error"
      );
    }
    if (payload.proposedAmount > this.ProductLimit) {
      return swal.fire(
        "GOS FINANCIAL",
        "Proposed Amount is greater the Product Limit. Product Limit is "+ this.ProductLimit,
        "error"
      );
    }
    if (this.id == null || isNaN(this.id)) {
      payload.websiteLoanApplicationId = 0
    } else {
      payload.websiteLoanApplicationId = +this.id
    }
    payload.customerId = parseInt(payload.customerId);
    payload.proposedProductId = parseInt(payload.proposedProductId);
    payload.proposedTenor = parseInt(payload.proposedTenor);
    payload.proposedRate = parseFloat(payload.proposedRate);
    payload.proposedAmount = parseFloat(payload.proposedAmount);
    payload.currencyId = parseInt(payload.currencyId);
    payload.exchangeRate = parseFloat(payload.exchangeRate);
    payload.paymentMode = parseInt(payload.paymentMode);
    payload.repaymentMode = parseInt(payload.repaymentMode);
    this.loadingService.show();
    this.loanApplicationService
      .addLoanApplicationInformation(payload)
      .subscribe(
        data => {
          this.loadingService.hide();
          const message = data.status.message.friendlyMessage;
          if (data.status.isSuccessful) {
            this.customerId = this.payload.customerId;
            swal.fire("GOS FINANCIAL", message, "success");
            this.proceedToEligibilityCheck(data.loanApplicationId);
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
  proceedToEligibilityCheck(loanApplicationId) {
    const __this = this;
    swal
      .fire({
        title: "Proceed to Eligibility Check?",
        text: "Yes will navigate you to eligibility check!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          this.router.navigate([
            "/credit/eligibility-check",
            loanApplicationId
          ], { queryParams: { customerId: this.customerId } });
        } else {
          this.router.navigate(["/credit/application-list"]);
        }
      });
  }
  onCurrencyChanged(value) {
    this.commonService.getCurrencyRate(value).subscribe(data => {
      let rate = data.commonLookups[0];
      if (rate != undefined) {
        this.payload.exchangeRate = rate.sellingRate;
        this.form.controls["exchangeRate"].setValue(rate.sellingRate);
      }
    }, err => {
      this.loadingService.hide()
    });
  }
  getLoanData(id) {
    return new Promise((resolve, reject) => {
      this.loadingService.show();
      return this.loanService.getLoanApplicationData(id).subscribe(
        data => {
          this.loadingService.hide();
          let row = data.loanApplications[0];
          this.form = this.fb.group({
            customerId: [row.customerId],
            //proposedProductId: [1],
            proposedProductId: [row.proposedProductId],
            proposedTenor: [row.proposedTenor],
            proposedRate: [row.proposedRate],
            proposedAmount: [row.proposedAmount],
            // approvedProductId: [""],
            // approvedTenor: [""],
            applicationDate: [new Date(row.applicationDate)],
            // approvedRate: [""],
            // approvedAmount: [""],
            currencyId: [row.currencyId],
            exchangeRate: [row.exchangeRate],
            // statusId: [""],
            hasDoneChecklist: [row.hasDoneChecklist],
            effectiveDate: null,
            //effectiveDate: [new Date(this.onDateSelect(row.effectiveDate, 1))],
            maturityDate: [new Date()],
            firstPrincipalDate: [null],
            firstInterestDate: [null],
            purpose: [row.purpose],
            frequencyTypeId: [row.frequencyTypeId],
            period: [row.period],
            paymentMode: [""],
            paymentAccount: [""]
          });
          // this.payload = row;
          // this.payload.effectiveDate = new Date(this.onDateSelect(row.effectiveDate, 1));
          // this.payload.firstPrincipalDate = "";
          // this.payload.firstInterestDate = "";
          // this.productId = row.proposedProductId;
          this.getProduct(row.proposedProductId);
          this.onCurrencyChanged(row.currencyId)
          resolve();
        },
        err => {
          this.loadingService.hide();
        },
        () => { }
      );
    }).then(() => { });
  }
  onDateSelect(date, type) {
    // date = this.collectionForm.get("effectiveDate").value;
    if (date != null) {
      let d = new Date(Date.parse(date));
      if (type == 1) {
        this.date1 = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        this.payload.effectiveDate = this.date1;
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

  getPaymentMode(value: any) {
    this.val = value;
    this.payload.paymentMode = value;
  }
}
