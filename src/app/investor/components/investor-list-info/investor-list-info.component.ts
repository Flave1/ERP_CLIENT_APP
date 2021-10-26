import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonService } from '../../../core/services/common.service';
import { LoanScheduleService } from '../../../core/services/loanschedule';

import { ActivatedRoute, Router } from '@angular/router';

import { InvestorFundService } from '../../../core/services/investor-fund.service';
import swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { InvestorProducts } from '../../../../models/models';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import {DataService} from '../../../core/services/data.service';

@Component({
  selector: 'app-investor-list-info',
  templateUrl: './investor-list-info.component.html',
  styleUrls: ['./investor-list-info.component.css'],
})
export class InvestorListInfoComponent implements OnInit {
  form: FormGroup;
  formTitle = 'Investor Information';
  AllCollateral: SelectItem[] = [];
  activeIndex = 0;
  productInformation: any[] = [];
  selectedProductInformation: any[];
  repaymentTypeInformation: any[] = [];
  displayProductFee = false;
  otherTabDisabled = true;
  productId: any;
  cols: any;
  amountTitle = '';
  productProductFees: any[] = [];
  feeList: any[] = [];
  productTypeList: InvestorProducts[] = [];
  frequencyTypeList: any[] = [];
  accountList: any[] = [];
  scheduleTypes: any[] = [];
  selectedFrequency: string;
  weightedRisk: number;
  customers: any[] = [];
  currencies: any[] = [];
  loanApplicationInformation: any[] = [];
  investorFundCustomerId: any;
  runningFacilities: any[] = [];
  tenor: any;
  rate: any;
  payload: any;
  productLimit: number;
  user: any = JSON.parse(localStorage.getItem('userDetails'));
  customerInvestmentId: any;
  date1: string;
  selectedDate: string;
  selectedDate2: string;
  val: any;
  val2: any;
  formattedAmount: string;
  customerName: string;
  customerAccount: string;
  Payment = false;
  bankDetails: any[] = [];
  type: string;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private loanScheduleService: LoanScheduleService,
    private router: Router,
    private route: ActivatedRoute,
    private investorFundService: InvestorFundService,
    private currencyPipe: CurrencyPipe,
    private loanCustomerService: LoanCustomerService,
    private dataService: DataService
  ) {
    this.form = this.fb.group({
      invInvestorFundId: [0],
      productId: [''],
      investorFundCustomerId: this.investorFundCustomerId,
      proposedTenor: ['', Validators.required],
      proposedRate: ['', Validators.required],
      frequencyId: ['', Validators.required],
      period: ['', Validators.required],
      proposedAmount: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      investmentPurpose: [''],
      instrumentId: [''],
      instrumentNumer: [''],
      instrumentDate: [new Date()],
      enableRollOver: [false, Validators.required],
      confirmedPayment: [false, Validators.required],
      currencyId: [''],
      companyId: this.user.companyId,
    });
    // this.reloadRunningFacilities.subscribe(() => {
    //    this.getRunningFacilities()
    // })
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.investorFundCustomerId = params['investorId'];
      this.customerInvestmentId = params['customerInvestmentId'];
      if (
        this.investorFundCustomerId != null ||
        this.investorFundCustomerId != undefined
      ) {
        this.form = this.fb.group({
          investorFundCustomerId: this.investorFundCustomerId,
          proposedTenor: ['', Validators.required],
          proposedRate: ['', Validators.required],
          frequencyId: ['', Validators.required],
          period: [
            this.calculatePeriod(
              this.form.value.proposedTenor,
              this.form.value.frequencyId
            ),
          ],
          proposedAmount: ['', Validators.required],
          effectiveDate: ['', Validators.required],
          investmentPurpose: [''],
          instrumentId: [''],
          instrumentNumer: [''],
          instrumentDate: [new Date()],
          enableRollOver: false,
          confirmedPayment: false,
          currencyId: [''],
          productId: [''],
          companyId: [this.user.companyId],
        });
        this.getRunningFacilities();
      }
      if (
        this.customerInvestmentId != null ||
        this.customerInvestmentId != undefined
      ) {
        this.getInvestment(this.customerInvestmentId);
      }
    });
    this.getCustomers();
    this.getBankDetails();
    this.getCurrencies();
    this.getFrequencyTypes();
    this.getAllProductTypes();
    this.getCustomer(this.investorFundCustomerId);
    this.payload = {};
    this.payload.investorFundCustomerId = this.investorFundCustomerId;
  }
  getCustomers() {
    this.loadingService.show();
    return this.investorFundService.getAllInvestorCustomer().subscribe(
      (data) => {
        this.loadingService.hide();
        this.customers = data.investorLists;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getCustomer(id: number) {
    return this.loanCustomerService.getCustomer(id).subscribe(
      (data) => {
        const customerData = data.customers[0];
        this.customerName = `${customerData.firstName} ${customerData.lastName}`;
        this.form.patchValue({
          customerId: id,
        });
        this.customerAccount =
          this.customerName + ' - ' + `${customerData.casaAccountNumber}`;
        this.payload.customerId = customerData.customerId;
      },
      (err) => {}
    );
  }

  getBankDetails() {
    return this.loanCustomerService
      .getLoanCustomerBankDetailsByLoanCustomer(this.investorFundCustomerId)
      .subscribe((data) => {
        this.bankDetails = data.customerBankDetails;
      });
  }

  getPaymentMode(value: any) {
    this.val2 = value;
    this.payload.paymentMode = value;
  }
  // getInvestment() {
  //     return this.investorFundService.getInvestment()
  // }

  getCurrencies() {
    this.loadingService.show();
    return this.commonService.getAllCurrency().subscribe(
      (data) => {
        this.loadingService.hide();
        this.currencies = data.commonLookups;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getAllProductTypes() {
    this.loadingService.show();
    this.investorFundService.getProducts().subscribe(
      (res) => {
        this.loadingService.hide();
        this.productTypeList = res.infProducts;
      },
      (err) => {
        this.loadingService.hide();
        return err;
      }
    );
  }
  getFrequencyTypes() {
    this.loadingService.show();
    this.loanScheduleService.getAllFrequencyTypes().subscribe(
      (res) => {
        this.loadingService.hide();
        this.frequencyTypeList = res.lookUp;
      },
      (err) => {
        this.loadingService.hide();
        return err;
      }
    );
  }

  goBack() {
    this.router.navigate(['/investor/pending-investments']);
  }
  getRunningFacilities() {
    return this.investorFundService
      .getAllRunningFacilities(this.investorFundCustomerId)
      .subscribe(
        (data) => {
          this.runningFacilities = data.result;
        },
        (err) => {
          return err;
        }
      );
  }
  submitInvestment(formObj: FormGroup) {
    const payload = formObj.value;
    payload.investorFundCustomerId = parseInt(payload.investorFundCustomerId);
    payload.productId = parseInt(payload.productId);
    payload.proposedTenor = parseInt(payload.proposedTenor);
    payload.proposedRate = parseFloat(payload.proposedRate);
    payload.frequencyId = parseInt(payload.frequencyId);
    payload.proposedAmount = parseFloat(payload.proposedAmount);
    payload.currencyId = parseInt(payload.currencyId);
    payload.instrumentId = parseInt(payload.instrumentId);
    payload.period = payload.period.toString();
    // this.payload.
    if (!payload.proposedTenor) {
      return swal.fire('GOS FINANCIALS', 'Proposed tenor is required', 'error');
    }
    if (!payload.confirmedPayment && (payload.instrumentId == 1 || payload.instrumentId == 2)) {
      return swal.fire('GOS FINANCIALS', 'Please confirm payment', 'error');
    }
    if (!payload.proposedRate) {
      return swal.fire('GOS FINANCIALS', 'Proposed rate is required', 'error');
    }
    if (!payload.proposedAmount) {
      return swal.fire(
        'GOS FINANCIALS',
        'Proposed amount is required',
        'error'
      );
    }
    if (payload.proposedAmount > this.productLimit) {
      return swal.fire(
        'GOS FINANCIALS',
        'Proposed amount cannot be greater than product limit',
        'error'
      );
    }
    if (!payload.currencyId) {
      return swal.fire('GOS FINANCIALS', 'Currency is required', 'error');
    }
    if (!payload.effectiveDate) {
      return swal.fire('GOS FINANCIALS', 'Effective date is required', 'error');
    }
    if (!payload.investmentPurpose) {
      return swal.fire(
        'GOS FINANCIALS',
        'Investment purpose is required',
        'error'
      );
    }
    if (!payload.instrumentId) {
      return swal.fire(
        'GOS FINANCIALS',
        'Investment instrument is required',
        'error'
      );
    }
    if (payload.instrumentId == 2) {
      if (!payload.instrumentNumer) {
        return swal.fire(
          'GOS FINANCIALS',
          'Investment instrument number is required',
          'error'
        );
      }
      if (!payload.instrumentDate) {
        return swal.fire(
          'GOS FINANCIALS',
          'Investment instrument date is required',
          'error'
        );
      }
    }
    if (payload.period > this.tenor) {
      return swal.fire(
        'GOS FINANCIALS',
        'Proposed tenor cannot be greater than maximum tenor',
        'error'
      );
    }
    if (payload.proposedRate > this.rate) {
      return swal.fire(
        'GOS FINANCIALS',
        'Proposed rate cannot be greater than maximum rate',
        'error'
      );
    }
    if (this.customerInvestmentId != undefined) {
      payload.websiteInvestorFundId = parseInt(this.customerInvestmentId);
    }
    payload.effectiveDate = new Date(Date.parse(payload.effectiveDate));
    payload.s_date = payload.effectiveDate;
    payload.companyId = this.user.companyId;
    this.loadingService.show();
    this.investorFundService.addInvestorForm(payload).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.router.navigateByUrl('/investor/investments-list');
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      },
      () => {
        this.getRunningFacilities();
      }
    );
  }

  rowClicked(x) {}
  calculatePeriod(tenor, frequency) {
    switch (frequency) {
      case 1:
        return tenor / 365;
      case 2:
        return tenor / 183;
      case 3:
        return tenor / 91;
      case 4:
        return tenor / 61;
      case 5:
        return tenor / 30;
      case 6:
        return tenor / 15;
      case 7:
        return tenor / 7;
      case 8:
        return tenor / 365;
      case 9:
        return tenor / 121;
      // default:
      //     return tenor/365
    }
  }
  getProduct(value: any) {
    if (value) {
      this.loadingService.show();
      return this.investorFundService.getProduct(value).subscribe(
        (data) => {
          this.loadingService.hide();
          const row = data.infProducts[0];
          // this.form.controls['row'].setValue(row.interestRateFrequency);
          // this.form.controls['tenor'].setValue(row.maximumPeriod);
          this.form.controls['frequencyId'].setValue(row.frequencyId);
          this.rate = data.infProducts[0].interestRateAnnual;
          this.tenor = data.infProducts[0].maximumPeriod;
          this.payload.frequencyId = data.infProducts[0].frequencyId;
          this.productLimit = data.infProducts[0].productLimit;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
    }
  }
  onInputMethod(value) {
    const period = this.calculatePeriod(
      parseInt(value),
      this.payload.frequencyId
    );
    this.form.controls['period'].setValue(Math.ceil(period));
  }

  formatAmount(value) {
    if (value) {
      const amount = parseInt(value)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');

      this.payload.proposedAmount = amount;
    } else {
      this.payload.proposedAmount = 0;
    }
  }

  getInvestment(customerInvestmentId: number) {
    this.loadingService.show();
    return this.investorFundService
      .getCustomerInvestment(customerInvestmentId)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          const row = data.investorFunds[0];
          this.form = this.fb.group({
            investorFundId: [row.investorFundId],
            investorFundCustomerId: [row.investorFundCustomerId],
            proposedTenor: [row.proposedTenor],
            proposedRate: [row.proposedRate],
            frequencyId: [row.frequencyId],
            period: [row.period],
            proposedAmount: [row.proposedAmount],
            effectiveDate: [this.formatDate(row.effectiveDate)],
            investmentPurpose: [row.investmentPurpose],
            instrumentId: [row.instrumentId],
            currencyId: [row.currencyId],
            productId: [row.productId],
            instrumentDate: [this.formatDate(row.instrumentDate)],
            enableRollOver: [row.enableRollOver],
            confirmedPayment: [row.confirmedPayment],
            passedEntry: [row.passedEntry],
            instrumentNumer: [row.instrumentNumer],
          });
          this.Payment = row.confirmedPayment;
          console.log(this.Payment, 'ppp');
          this.payload.effectiveDate = this.onDateSelect(row.effectiveDate, 1);
          this.getProduct(row.productId);
          this.getValue(row.instrumentId);
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }
  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
  onDateSelect(date, type) {
    // date = this.collectionForm.get("effectiveDate").value;
    if (date != null) {
      const d = new Date(Date.parse(date));
      if (type == 1) {
        this.date1 = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        this.payload.effectiveDate = this.date1;
        this.form.get('effectiveDate').setValue(this.date1);
        return this.date1;
      }
      if (type == 2) {
        this.selectedDate = `${d.getFullYear()}-${
          d.getMonth() + 1
        }-${d.getDate()}`;
        this.form.get('liquidationDate').setValue(this.selectedDate);
        return this.selectedDate;
      }
      if (type == 3) {
        this.selectedDate2 = `${d.getFullYear()}-${
          d.getMonth() + 1
        }-${d.getDate()}`;
        this.form.get('instrumentDate').setValue(this.selectedDate2);
        return this.selectedDate2;
      }
    }
  }

  getValue(value: any) {
    this.val = value;
  }
  //
  // transformAmount(element){
  //   const formattedAmount = this.currencyPipe.transform(this.form.get('proposedAmount').value);
  //   element.target.value = formattedAmount;
  //
  // }

}
