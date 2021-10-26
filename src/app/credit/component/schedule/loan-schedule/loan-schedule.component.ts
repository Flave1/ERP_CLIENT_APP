import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanScheduleService } from 'src/app/core/services/loanschedule';
import { LoadingService } from 'src/app/core/services/loading.service';
import { DateUtilService } from 'src/app/core/services/dateutils';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { LoanService } from 'src/app/core/services/loan.service';
import { DataService } from '../../../../core/services/data.service';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-loan-schedule',
  templateUrl: './loan-schedule.component.html',
})
export class LoanScheduleComponent implements OnInit {
  checked: boolean;
  hideDisbursementCheck: string = 'hide';
  display: boolean = false;
  displayScheduleModalForm: boolean = false;
  show: boolean = false;
  message: any;
  title: any;
  cssClass: any;
  scheduleGroupForm: FormGroup;
  scheduleTypes: any[];
  schedules: any[];
  scheduleHeader: any = {};
  maturityDate: any;
  scheduleParams: any = {};
  basis: any[];
  frequencies: any[];
  scatteredMethod: boolean = false;
  bulletMethod: boolean = false;
  ballonMethod: boolean = false;
  scatterdPayments: any[] = [];
  irregularSchedules: any[];
  data: any = {};
  irreSchedules: boolean = false;
  principalBalance: any = 0;
  principalValanceString: any;
  callendarPixel: string;
  body: any;
  //Output Event emmitter definition consumed during loan Booking
  @Output() notify: EventEmitter<any> = new EventEmitter<string>();

  //Input variables modified during loan Booking
  @Input() PrincipalLoanAmount: number;
  @Input() interestRate: number;
  @Input() integralFeeAmount: number = 0;
  @Input() tenor: number;
  @Input() viewStatus: boolean = false;
  @Input() scheduleTitle: string = 'Schedule Simulation';
  @Input() callendarPixelInput: number = 290;
  @Input() productTypeId: number;
  @Input() loanApprovedAmountText: string = 'Loan Amount';
  @Input() noDataDiv: string = null;
  //end of input variables
  autoPopulate: any = {};
  _loanApplicationId: number;
  get loanApplicationId(): number {
    return this._loanApplicationId;
  }
  @Input() set loanApplicationId(value: number) {
    this._loanApplicationId = value;
    // if (value != null) {
    //     this.getAutoPopulateSchedule(value);
    // }
  }
  subscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private loanScheduleService: LoanScheduleService,
    private loadingSrv: LoadingService,
    private dateUtilService: DateUtilService,
    private loanService: LoanService,
    private dataService: DataService,
    private router: Router
  ) {
    this.subscription = this.loanService
      .getLoanApplication()
      .subscribe((id) => {
        if (id) {
          this.getAutoPopulateSchedule(id);
        }
      });
  }

  ngOnInit() {
    this.callendarPixel = String(this.callendarPixelInput) + 'px';
    this.initializeForm();
    this.getLoanScheduleTypes();
    this.getDayCount();
    this.getFrequencyTypes();
    this.data.basis = 2;
    if (this.PrincipalLoanAmount > 0) {
      this.data.principalAmount = this.loanAmount = this.PrincipalLoanAmount;
      // this.onPrincipalblur();
    }

    if (this.interestRate > 0) {
      this.data.interestRate = this.interestRate;
      this.scheduleGroupForm.controls['interestRate'].setValue(
        this.interestRate
      );
    }

    if (this.integralFeeAmount > 0) {
      this.data.integralFeeAmount = this.integralFeeAmount;
      this.scheduleGroupForm.controls['integralFeeAmount'].setValue(
        this.interestRate
      );
    } else {
      this.scheduleGroupForm.controls['integralFeeAmount'].setValue(0);
    }

    if (this.tenor > 0) {
      this.data.tenor = this.tenor;
      this.scheduleGroupForm.controls['tenor'].setValue(this.tenor);
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  getAutoPopulateSchedule(loanApplicationId) {
    this.loanService
      .getAutoPopulateSchedule(loanApplicationId)
      .subscribe((data) => {
        this.autoPopulate = data.loanSchedule;
        if (this.autoPopulate != null) {
          this.data.scheduleMethod = this.autoPopulate.scheduleMethodId;
          this.data.loanDate = this.autoPopulate.effectiveDate;
          this.data.basis = this.autoPopulate.accurialBasis;
          this.data.interestRate = this.interestRate;
          this.data.integralFeeAmount = this.integralFeeAmount;
          this.scheduleGroupForm = this.fb.group({
            principalAmount: [this.PrincipalLoanAmount],
            interestRate: [this.interestRate],
            loanDate: [new Date(this.autoPopulate.effectiveDate)],
            scheduleMethod: [this.autoPopulate.scheduleMethodId],
            interestFrequency: [this.autoPopulate.interestFrequency],
            principalfrequency: [this.autoPopulate.principalFrequency],
            tenor: [this.tenor],
            principalFirstDate: [
              new Date(this.autoPopulate.principalFirstpaymentDate),
            ],
            intrestFirstDate: [
              new Date(this.autoPopulate.interestFirstpaymentDate),
            ],
            maturityDate: [new Date(this.autoPopulate.maturityDate)],
            numberOfPayments: [''],
            basis: [''],
            accurialBasis: [this.autoPopulate.accurialBasis],
            integralFeeAmount: [this.integralFeeAmount],
            firstDayType: [this.autoPopulate.firstDayType],
            withoutDisburment: [false],
            internalRateOfReturn: [''],
          });
          // this.onscheduleMethodChangedOne();
          this.onscheduleMethodChanged(this.autoPopulate.scheduleMethodId);
        }
      });
  }

  _loanAmount = 0;

  @Input()
  set loanAmount(loanAmount: number) {
    this._loanAmount = loanAmount;
    if (loanAmount > 0) {
      this.data.principalAmount = this.loanAmount;
      this.principalBalance = this.loanAmount;
      this.scheduleGroupForm.controls['principalAmount'].setValue(
        this.loanAmount
      );
      // this.onPrincipalblur();
    }
  }
  get loanAmount(): number {
    return this._loanAmount;
  }

  onscheduleMethodChanged(sValue) {
    this.bulletMethod = true;
    this.ballonMethod = true;
    if (sValue === 5) {
      this.scatteredMethod = true;
      this.data.principalAmount = this.scheduleGroupForm.value.principalAmount;
      this.data.interestRate = this.scheduleGroupForm.value.interestRate;
      this.data.loanDate = this.scheduleGroupForm.value.loanDate;
      this.data.scheduleMethod = this.scheduleGroupForm.value.scheduleMethod;
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, '').trim()
      );
      this.principalValanceString = this.principalBalance.toLocaleString(
        'en-US',
        { minimumFractionDigits: 2 }
      );
    } else if (sValue === 3) {
      this.bulletMethod = false;
      this.ballonMethod = false;
    } else if (sValue === 7) {
      this.ballonMethod = true;
      this.bulletMethod = false;
    } else {
      this.scatteredMethod = false;
      this.ballonMethod = false;
    }
  }

  onscheduleMethodChangedOne(sValue: number) {
    // let sValue: number = Number(this.data.scheduleMethod);
    if (sValue === 5) {
      this.scatteredMethod = true;
      this.principalBalance = Number(this.PrincipalLoanAmount);
      this.principalValanceString = Number(this.PrincipalLoanAmount);
      this.data.interestRate = this.interestRate;
      this.data.integralFeeAmount = this.integralFeeAmount;
    } else {
      this.scatteredMethod = false;
      this.onscheduleMethodChanged(sValue);
    }
  }

  getDayCount() {
    this.loanScheduleService.getAllDayCount().subscribe((res) => {
      this.basis = res.lookUp;
    });
  }

  // calculateTenor() {
  //     var numDays = this.dateUtilService.dateDiff(this.scheduleGroupForm.value.loanDate, this.scheduleGroupForm.value.maturityDate);
  //     this.scheduleGroupForm.controls['tenor'].setValue((numDays + 1));
  // }

  calculateMaturityDate() {
    if (this.data.tenor <= 0) {
      this.showMessage(
        'System cannot calculate maturity date with zero tenor.',
        'error',
        'FintrakBanking'
      );
    } else {
      var maturityDate = this.dateUtilService.dateAdd(
        this.scheduleGroupForm.value.loanDate,
        'day',
        this.data.tenor
      );
      this.scheduleGroupForm.controls['maturityDate'].setValue(maturityDate);

      this.validateOnBackdate();
    }
  }

  getFrequencyTypes() {
    this.loanScheduleService.getAllFrequencyTypes().subscribe((res) => {
      this.frequencies = res.lookUp;
    });
  }

  validateOnBackdate() {
    const today = new Date();
    const startDate = this.scheduleGroupForm.value.loanDate;

    if (new Date(startDate).valueOf() < new Date().valueOf()) {
      swal.fire(
        'GOS FINANCIAL',
        "Loan Schedule Generation', 'Schedule back-dating detected! \n' + 'Note: this loan will when booked will not be disbursed', 'info",
        'success'
      );
      this.checked = true;
      this.hideDisbursementCheck = null;
    } else {
      this.checked = false;
      this.hideDisbursementCheck = 'hide';
    }
  }

  addToList() {
    if (
      Number(this.principalBalance) -
        Number(this.data.amount.replace(/[,]+/g, '').trim()) <
      0
    ) {
      this.showMessage(
        'Payment amount cannot be greater than principal amount',
        'error',
        'FintrakBanking'
      );
      return;
    }
    if (new Date(this.data.scateredDate) < new Date(this.data.loanDate)) {
      this.showMessage(
        'Payment date cannot be less than effective date',
        'error',
        'FintrakBanking'
      );
      this.data.scateredDate = null;
      return;
    }
    var pmts = {
      payDate: this.dateUtilService.formatJsonDate(this.data.scateredDate),
      realDate: this.data.scateredDate,
      payAmount: this.data.amount,
    };

    this.scatterdPayments.push(pmts);
    this.principalBalance =
      Number(this.principalBalance) - Number(pmts.payAmount);
    this.principalValanceString = this.principalBalance.toLocaleString(
      'en-US',
      { minimumFractionDigits: 2 }
    );
    this.data.scateredDate = '';
    this.data.amount = '';
  }

  onPrincipalblur() {
    if (this.data.principalAmount == '') return;
    var realChar: string = this.data.principalAmount;
    var currVal: string = this.data.principalAmount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === 'M' || currVal == 'm') {
      let result: Number = Number(realChar) * 1000000;
      this.data.principalAmount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, '').trim()
      );

      this.principalValanceString = this.principalBalance.toLocaleString(
        'en-US',
        { minimumFractionDigits: 2 }
      );
    } else if (
      currVal === 'T' ||
      currVal == 't' ||
      currVal === 'K' ||
      currVal === 'k'
    ) {
      let result: Number = Number(realChar) * 1000;
      this.data.principalAmount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, '').trim()
      );
      this.principalValanceString = this.principalBalance.toLocaleString(
        'en-US',
        { minimumFractionDigits: 2 }
      );
    } else if (currVal === 'b' || currVal === 'B') {
      let result: Number = Number(realChar) * 1000000000;
      this.data.principalAmount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, '').trim()
      );
      this.principalValanceString = this.principalBalance.toLocaleString(
        'en-US',
        { minimumFractionDigits: 2 }
      );
    } else {
      let result: Number = Number(realChar);
      this.data.principalAmount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, '').trim()
      );
      this.principalValanceString = this.principalBalance.toLocaleString(
        'en-US',
        { minimumFractionDigits: 2 }
      );
    }
  }

  formatValue() {
    if (this.data.amount == '') return;
    var realChar: string = this.data.amount;
    var currVal: string = this.data.amount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === 'M' || currVal == 'm') {
      let result: Number = Number(realChar) * 1000000;
      this.data.amount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
    } else if (
      currVal === 'T' ||
      currVal == 't' ||
      currVal === 'K' ||
      currVal === 'k'
    ) {
      let result: Number = Number(realChar) * 1000;
      this.data.amount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
    } else if (currVal === 'b' || currVal === 'B') {
      let result: Number = Number(realChar) * 1000000000;
      this.data.amount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
    } else {
      let result: Number = Number(realChar);
      this.data.amount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
    }
  }

  formatFeeValue() {
    if (this.data.integralFeeAmount == '') return;
    let realChar: string = this.data.integralFeeAmount;
    let currVal: string = this.data.integralFeeAmount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === 'M' || currVal == 'm') {
      let result: Number = Number(realChar) * 1000000;
      this.data.integralFeeAmount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
    } else if (
      currVal === 'T' ||
      currVal == 't' ||
      currVal === 'K' ||
      currVal === 'k'
    ) {
      let result: Number = Number(realChar) * 1000;
      this.data.integralFeeAmount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
    } else if (currVal === 'b' || currVal === 'B') {
      let result: Number = Number(realChar) * 1000000000;
      this.data.integralFeeAmount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
    } else {
      let result: Number = Number(realChar);
      this.data.integralFeeAmount = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
    }
  }

  generateIrregularSchedule() {
    if (
      Number(this.principalBalance) > 0 ||
      Number(this.principalBalance) < 0
    ) {
      this.showMessage(
        'Payment amount must be equal to principal amount',
        'error',
        'FintrakBanking'
      );
      return;
    }
    this.loadingSrv.show();
    var payments = [];
    this.scatterdPayments.forEach((v) => {
      payments.push({
        paymentDate: new Date(v.realDate),
        paymentAmount: v.payAmount,
      });
    });
    let body = {
      scheduleMethodId: this.data.scheduleMethod,
      principalAmount: this.PrincipalLoanAmount,
      effectiveDate: this.formatDate(this.data.loanDate),
      interestRate: this.interestRate,
      accurialBasis: this.data.basis,
      integralFeeAmount: this.integralFeeAmount,
      irregularPaymentSchedule: payments,
    };

    this.loanScheduleService.generatePeriodicLoanSchedule(body).subscribe(
      (res) => {
        this.loadingSrv.hide();
        var details = {
          principalAmount: body.principalAmount,
          interestRate: body.interestRate,
          effectiveDate: new Date(body.effectiveDate),
          maturityDate: '',
          effectiveInterestRate: 0,
          schedules: res.result,
        };

        this.schedules = details.schedules;
        this.maturityDate = this.schedules[
          this.schedules.length - 1
        ].paymentDate;
        details.maturityDate = this.maturityDate;
        details.effectiveInterestRate = this.schedules[1].internalRateOfReturn;
        this.scheduleHeader = details;
        if (this.scheduleHeader.interestRate == '') {
          this.scheduleHeader.interestRate = details.effectiveInterestRate;
        }

        //SCHEDULE EVENT EMITTER : REQUIRED AT LOAN BOOKING
        //THIS BLOCK EMITS THE EVENT PARATERS TO LOAN BOOKING
        let scheduleDetailsForLoanBooking = {
          scheduleMethodId: body.scheduleMethodId,
          principalAmount: body.principalAmount,
          effectiveDate: new Date(body.effectiveDate),
          interestRate: body.interestRate,
          principalFrequency: this.data.principalfrequency,
          interestFrequency: this.data.interestFrequency,
          tenor: this.data.tenor,
          principalFirstpaymentDate: new Date(this.data.principalFirstDate),
          interestFirstpaymentDate: new Date(this.data.intrestFirstDate),
          maturityDate: new Date(this.maturityDate),
          accurialBasis: body.accurialBasis,
          integralFeeAmount: body.integralFeeAmount,
          firstDayType: this.data.interestChargeType,
          irregularPaymentSchedule: body.irregularPaymentSchedule,
          effectiveInterestRate: details.effectiveInterestRate,
          schedules: details.schedules,
          formData: this.scheduleGroupForm.value,
        };

        this.notify.emit(scheduleDetailsForLoanBooking);
        //END OF EVENT EMITTER

        this.displayScheduleModalForm = true;

        this.loadingSrv.hide();
      },
      (err) => {}
    );
  }

  onSubmit(formObj) {
    let value = formObj.value;
    let payments = [];

    payments.push({
      paymentDate: new Date(),
      paymentAmount: 500,
    });

    this.body = {
      scheduleMethodId: parseInt(this.data.scheduleMethod),
      principalAmount: this.data.principalAmount,
      effectiveDate: this.formatDate(value.loanDate),
      interestRate: this.interestRate,
      principalFrequency: parseInt(value.principalfrequency),
      interestFrequency: parseInt(value.interestFrequency),
      tenor: this.tenor,
      principalFirstpaymentDate: this.formatDate(value.principalFirstDate),
      interestFirstpaymentDate: this.formatDate(value.intrestFirstDate),
      maturityDate: this.formatDate(value.maturityDate),
      accurialBasis: parseInt(value.accurialBasis),
      integralFeeAmount: this.integralFeeAmount,
      firstDayType: parseInt(value.firstDayType),
      irregularPaymentSchedule: payments,
    };
    console.log("schedulebody", this.body)
    this.loadingSrv.show();
    this.loanScheduleService.generatePeriodicLoanSchedule(this.body).subscribe(
      (res) => {
        this.loadingSrv.hide();
        if (res.status.isSuccessful == true) {
          if (res.loanPaymentSchedule.length) {
            var details = {
              principalAmount: value.principalAmount,
              interestRate: value.interestRate,
              effectiveDate: new Date(value.loanDate),
              maturityDate: new Date(value.maturityDate),
              effectiveInterestRate: value.effectiveInterestRate,
              schedules: res.loanPaymentSchedule,
            };

            //window.localStorage.removeItem("schedules");
            //window.localStorage.setItem("schedules", JSON.stringify(details));

            this.schedules = details.schedules;
            this.maturityDate = this.schedules[
              this.schedules.length - 1
            ].paymentDate;
            details.maturityDate = new Date(this.maturityDate);
            details.effectiveInterestRate = this.schedules[0].effectiveInterestRate;
            details.principalAmount = this.schedules[0].endPrincipalAmount;
            this.scheduleHeader = details;
            if (this.scheduleHeader.interestRate == '') {
              this.scheduleHeader.interestRate = details.effectiveInterestRate;
            }

            //SCHEDULE EVENT EMITTER : REQUIRED AT LOAN BOOKING
            //THIS BLOCK EMITS THE EVENT PARATERS TO LOAN BOOKING
            let scheduleDetailsForLoanBooking = {
              scheduleMethodId: this.body.scheduleMethodId,
              principalAmount: details.principalAmount,
              effectiveDate: new Date(this.body.effectiveDate),
              interestRate: this.body.interestRate,
              principalFrequency: this.body.principalFrequency,
              interestFrequency: this.body.interestFrequency,
              tenor: this.body.tenor,
              principalFirstpaymentDate: new Date(
                this.body.principalFirstpaymentDate
              ),
              interestFirstpaymentDate: new Date(
                this.body.interestFirstpaymentDate
              ),
              maturityDate: new Date(this.body.maturityDate),
              accurialBasis: this.body.accurialBasis,
              integralFeeAmount: this.body.integralFeeAmount,
              firstDayType: this.body.firstDayType,
              irregularPaymentSchedule: this.body.irregularPaymentSchedule,
              effectiveInterestRate: details.effectiveInterestRate,
              schedules: details.schedules,
              formData: this.scheduleGroupForm.value,
            };

            this.notify.emit(scheduleDetailsForLoanBooking);
            //END OF EVENT EMITTER

            this.displayScheduleModalForm = true;

            this.loadingSrv.hide();

            //this.router.navigate(['/credit/loan/schedule/view']);
          }
        } else {
          swal.fire(
            'GOS FINANCIAL',
            res.status.message.friendlyMessage,
            'error'
          );
        }
      },
      (err) => {
        this.loadingSrv.hide();
      }
    );
  }

  initializeForm() {
    this.scheduleGroupForm = this.fb.group({
      principalAmount: ['', Validators.required],
      interestRate: ['', Validators.required],
      loanDate: ['', Validators.required],
      scheduleMethod: ['', Validators.required],
      interestFrequency: ['', Validators.required],
      principalfrequency: [''],
      tenor: ['', Validators.required],
      principalFirstDate: [''],
      intrestFirstDate: ['', Validators.required],
      maturityDate: ['', Validators.required],
      numberOfPayments: [''],
      basis: [''],
      accurialBasis: ['', Validators.required],
      integralFeeAmount: [''],
      firstDayType: ['0'],
      withoutDisburment: [false],
      internalRateOfReturn: [''],
    });
  }

  exportToExcel() {
    this.loadingSrv.show();
    this.loanScheduleService.exportSchedule(this.body).subscribe(
      (res) => {
        this.loadingSrv.hide();
        const data = res.export;
        if (data != undefined) {
          const byteString = atob(data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const bb = new Blob([ab]);
          try {
            const file = new File([bb], 'Schedule.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(textFileAsBlob, 'Schedule.xlsx');
          }
        }
      },
      (err) => {
        this.loadingSrv.hide();
      }
    );
  }

  getLoanScheduleTypes() {
    this.loanScheduleService.getAllLoanScheduleType().subscribe((res) => {
      this.scheduleTypes = res.lookUp;
    });
  }

  removeItem(evt, indx) {
    evt.preventDefault();
    let currRecord = this.scatterdPayments[indx];
    this.principalBalance =
      Number(this.principalBalance) +
      Number(currRecord.payAmount.replace(/[,]+/g, '').trim());
    this.principalValanceString = this.principalBalance.toLocaleString(
      'en-US',
      { minimumFractionDigits: 2 }
    );
    this.scatterdPayments.splice(indx, 1);
  }

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }

  hideMessage(event) {
    this.show = false;
  }

  calculateTenor() {
    var numDays = this.dateUtilService.dateDiff(
      this.scheduleGroupForm.value.loanDate,
      this.scheduleGroupForm.value.maturityDate
    );
    this.scheduleGroupForm.controls['tenor'].setValue(numDays + 1);
  }

  onEffectiveDateSelect(date) {
    this.scheduleGroupForm.controls['maturityDate'].setValue(null);
    let effectiveDate = new Date(date);
    var maturityDate = new Date(
      effectiveDate.getTime() + this.tenor * 86400 * 1000
    );
    this.scheduleGroupForm.controls['maturityDate'].setValue(
      new Date(maturityDate)
    );
  }
  onInterestDateSelect(date) {
    this.scheduleGroupForm.controls['maturityDate'].setValue(null);
    let interestFirstpaymentDate = new Date(date);
    var maturityDate = new Date(
      interestFirstpaymentDate.getTime() + this.tenor * 86400 * 1000
    );
    this.scheduleGroupForm.controls['maturityDate'].setValue(
      new Date(maturityDate)
    );
  }

  formatDate(date) {
    let dateObj = new Date(date),
      month = '' + (dateObj.getMonth() + 1),
      day = '' + dateObj.getDate(),
      year = '' + dateObj.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
