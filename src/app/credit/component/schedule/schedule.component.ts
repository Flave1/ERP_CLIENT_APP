import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter
} from "@angular/core";
import swal from "sweetalert2";
import { LoanScheduleService } from "src/app/core/services/loanschedule";
import { LoadingService } from "src/app/core/services/loading.service";
import { LoanSchedule } from "src/app/models/schedule";
import { DateUtilService } from "src/app/core/services/dateutils";

@Component({
  selector: "schedule-template",
  templateUrl: "schedule.component.html",
  styles: [
    `
      .ui-datepicker {
        top: 100px !important;
      }
    `
  ]
})
export class ScheduleComponent implements OnInit {
  checked: boolean;
  hideDisbursementCheck: string = "hide";
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

  //Output Event emmitter definition consumed during loan Booking
  @Output() notify: EventEmitter<any> = new EventEmitter<string>();

  //Input variables modified during loan Booking
  @Input() PrincipalLoanAmount: number;
  @Input() interestRate: number;
  @Input() integralFeeAmount: number;
  @Input() tenor: number;
  @Input() viewStatus: boolean = false;
  @Input() scheduleTitle: string = "Schedule Simulation";
  @Input() callendarPixelInput: number = 290;
  @Input() productTypeId: number;
  @Input() loanApprovedAmountText: string = "Loan Amount";
  @Input() noDataDiv: string = null;
  //end of input variables

  constructor(
    private fb: FormBuilder,
    private loanScheduleService: LoanScheduleService,
    private loadingSrv: LoadingService,
    private dateUtilService: DateUtilService,
    private router: Router
  ) {}

  ngOnInit() {
    this.callendarPixel = String(this.callendarPixelInput) + "px";
    this.initializeForm();
    this.getLoanScheduleTypes();
    this.getDayCount();
    this.getFrequencyTypes();

    if (this.PrincipalLoanAmount > 0) {
      this.data.principalAmount = this.loanAmount = this.PrincipalLoanAmount;
      this.onPrincipalblur();
    }

    if (this.interestRate > 0) {
      this.data.interestRate = this.interestRate;
      this.scheduleGroupForm.controls["interestRate"].setValue(
        this.interestRate
      );
    }

    if (this.integralFeeAmount > 0) {
      this.data.integralFeeAmount = this.integralFeeAmount;
      this.scheduleGroupForm.controls["integralFeeAmount"].setValue(
        this.interestRate
      );
    }

    if (this.tenor > 0) {
      this.data.tenor = this.tenor;
      this.scheduleGroupForm.controls["tenor"].setValue(this.tenor);
    }
  }

  public _loanAmount = 0;

  @Input()
  set loanAmount(loanAmount: number) {
    this._loanAmount = loanAmount;
    if (loanAmount > 0) {
      this.data.principalAmount = this.loanAmount;
      this.principalBalance = this.loanAmount;
      this.scheduleGroupForm.controls["principalAmount"].setValue(
        this.loanAmount
      );
      this.onPrincipalblur();
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
        this.data.principalAmount.replace(/[,]+/g, "").trim()
      );
      this.principalValanceString = this.principalBalance.toLocaleString(
        "en-US",
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

  onscheduleMethodChangedOne() {
    let sValue: number = Number(this.data.scheduleMethod);
    if (sValue === 5) {
      this.scatteredMethod = true;
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, "").trim()
      );
    } else {
      this.scatteredMethod = false;
      this.onscheduleMethodChanged(sValue);
      // this.initializeForm();
    }
  }

  getDayCount() {
    this.loanScheduleService.getAllDayCount().subscribe(res => {
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
        "System cannot calculate maturity date with zero tenor.",
        "error",
        "FintrakBanking"
      );
    } else {
      var maturityDate = this.dateUtilService.dateAdd(
        this.scheduleGroupForm.value.loanDate,
        "day",
        this.data.tenor
      );
      this.scheduleGroupForm.controls["maturityDate"].setValue(maturityDate);

      this.validateOnBackdate();
    }
  }

  getFrequencyTypes() {
    this.loanScheduleService.getAllFrequencyTypes().subscribe(res => {
      this.frequencies = res.lookUp;
    });
  }

  validateOnBackdate() {
    var today = new Date();
    var startDate = this.scheduleGroupForm.value.loanDate;
    if (new Date(startDate).valueOf() < new Date().valueOf()) {
      swal.fire(
        "GOS FINANCIAL",
        "Loan Schedule Generation', 'Schedule back-dating detected! \n' + 'Note: this loan will when booked will not be disbursed', 'info",
        "success"
      );
      this.checked = true;
      this.hideDisbursementCheck = null;
    } else {
      this.checked = false;
      this.hideDisbursementCheck = "hide";
    }
  }

  addToList() {
    if (
      Number(this.principalBalance) -
        Number(this.data.amount.replace(/[,]+/g, "").trim()) <
      0
    ) {
      this.showMessage(
        "Payment amount cannot be greater than principal amount",
        "error",
        "FintrakBanking"
      );
      return;
    }
    if (new Date(this.data.scateredDate) < new Date(this.data.loanDate)) {
      this.showMessage(
        "Payment date cannot be less than effective date",
        "error",
        "FintrakBanking"
      );
      this.data.scateredDate = null;
      return;
    }
    var pmts = {
      payDate: this.dateUtilService.formatJsonDate(this.data.scateredDate),
      realDate: this.data.scateredDate,
      payAmount: this.data.amount
    };

    this.scatterdPayments.push(pmts);
    this.principalBalance =
      Number(this.principalBalance) -
      Number(pmts.payAmount.replace(/[,]+/g, "").trim());
    this.principalValanceString = this.principalBalance.toLocaleString(
      "en-US",
      { minimumFractionDigits: 2 }
    );
    this.data.scateredDate = "";
    this.data.amount = "";
  }

  onPrincipalblur() {
    if (this.data.principalAmount == "") return;
    var realChar: string = this.data.principalAmount;
    var currVal: string = this.data.principalAmount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === "M" || currVal == "m") {
      let result: Number = Number(realChar) * 1000000;
      this.data.principalAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, "").trim()
      );

      this.principalValanceString = this.principalBalance.toLocaleString(
        "en-US",
        { minimumFractionDigits: 2 }
      );
    } else if (
      currVal === "T" ||
      currVal == "t" ||
      currVal === "K" ||
      currVal === "k"
    ) {
      let result: Number = Number(realChar) * 1000;
      this.data.principalAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, "").trim()
      );
      this.principalValanceString = this.principalBalance.toLocaleString(
        "en-US",
        { minimumFractionDigits: 2 }
      );
    } else if (currVal === "b" || currVal === "B") {
      let result: Number = Number(realChar) * 1000000000;
      this.data.principalAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, "").trim()
      );
      this.principalValanceString = this.principalBalance.toLocaleString(
        "en-US",
        { minimumFractionDigits: 2 }
      );
    } else {
      let result: Number = Number(realChar);
      this.data.principalAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, "").trim()
      );
      this.principalValanceString = this.principalBalance.toLocaleString(
        "en-US",
        { minimumFractionDigits: 2 }
      );
    }
  }

  formatValue() {
    if (this.data.amount == "") return;
    var realChar: string = this.data.amount;
    var currVal: string = this.data.amount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === "M" || currVal == "m") {
      let result: Number = Number(realChar) * 1000000;
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (
      currVal === "T" ||
      currVal == "t" ||
      currVal === "K" ||
      currVal === "k"
    ) {
      let result: Number = Number(realChar) * 1000;
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (currVal === "b" || currVal === "B") {
      let result: Number = Number(realChar) * 1000000000;
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else {
      let result: Number = Number(realChar);
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    }
  }

  formatFeeValue() {
    if (this.data.integralFeeAmount == "") return;
    var realChar: string = this.data.integralFeeAmount;
    var currVal: string = this.data.integralFeeAmount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === "M" || currVal == "m") {
      let result: Number = Number(realChar) * 1000000;
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (
      currVal === "T" ||
      currVal == "t" ||
      currVal === "K" ||
      currVal === "k"
    ) {
      let result: Number = Number(realChar) * 1000;
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (currVal === "b" || currVal === "B") {
      let result: Number = Number(realChar) * 1000000000;
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else {
      let result: Number = Number(realChar);
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    }
  }

  generateIrregularSchedule() {
    if (
      Number(this.principalBalance) > 0 ||
      Number(this.principalBalance) < 0
    ) {
      this.showMessage(
        "Payment amount must be equal to principal amount",
        "error",
        "FintrakBanking"
      );
      return;
    }
    this.loadingSrv.show();
    var payments = [];
    this.scatterdPayments.forEach(v => {
      payments.push({
        paymentDate: new Date(v.realDate),
        paymentAmount: v.payAmount
      });
    });
    let body = {
      scheduleMethodId: this.data.scheduleMethod,
      principalAmount: this.data.principalAmount,
      effectiveDate: this.formatDate(this.data.loanDate),
      interestRate: this.data.interestRate,
      accurialBasis: this.data.basis,
      integralFeeAmount: this.data.integralFeeAmount,
      irregularPaymentSchedule: payments
    };

    this.loanScheduleService.generatePeriodicLoanSchedule(body).subscribe(
      res => {
        this.loadingSrv.hide();
        if (res.success == true) {
          if (res.result.length) {
            var details = {
              principalAmount: body.principalAmount,
              interestRate: body.interestRate,
              effectiveDate: new Date(body.effectiveDate),
              maturityDate: "",
              effectiveInterestRate: 0,
              schedules: res.result
            };
            //window.localStorage.removeItem("schedules");
            //window.localStorage.setItem("schedules", JSON.stringify(details));

            this.schedules = details.schedules;
            this.maturityDate = this.schedules[
              this.schedules.length - 1
            ].paymentDate;
            details.maturityDate = this.maturityDate;
            details.effectiveInterestRate = this.schedules[1].internalRateOfReturn;
            this.scheduleHeader = details;
            if (this.scheduleHeader.interestRate == null) {
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
              formData: this.scheduleGroupForm.value
            };

            this.notify.emit(scheduleDetailsForLoanBooking);
            //END OF EVENT EMITTER

            this.displayScheduleModalForm = true;

            this.loadingSrv.hide();

            //this.router.navigate(['/credit/loan/schedule/view']);
          }
        } else {
          this.showMessage(res.message, "error", "FintrakBanking");
        }
      },
      err => {
        this.showMessage(
          err || "An unknown error has occured",
          "error",
          "FintrakBanking"
        );
      }
    );
  }

  onSubmit(formObj) {
    let value = formObj.value;

    var payments = [];

    payments.push({
      paymentDate: new Date(),
      paymentAmount: 500
    });

    let body = {
      scheduleMethodId: parseInt(this.data.scheduleMethod),
      principalAmount: parseInt(this.data.principalAmount),
      effectiveDate: this.formatDate(value.loanDate),
      interestRate: parseInt(value.interestRate),
      principalFrequency: parseInt(value.principalfrequency),
      interestFrequency: parseInt(value.interestFrequency),
      tenor: parseInt(value.tenor),
      principalFirstpaymentDate: this.formatDate(value.principalFirstDate),
      interestFirstpaymentDate: this.formatDate(value.intrestFirstDate),
      maturityDate: this.formatDate(value.maturityDate),
      accurialBasis: parseInt(value.accurialBasis),
      integralFeeAmount: parseInt(value.integralFeeAmount),
      firstDayType: parseInt(value.firstDayType),
      irregularPaymentSchedule: payments

      // scheduleMethodId: this.data.scheduleMethod,
      // principalAmount: this.data.principalAmount,
      // effectiveDate: new Date(value.loanDate),
      // scheduleMethodId: 1,
      // principalAmount: 1000000,
      // effectiveDate: "2019-04-30T12:11:14.475Z",
      // interestRate: value.interestRate,
      // principalFrequency: value.principalfrequency,
      // interestFrequency: value.interestFrequency,
      // tenor: value.tenor,
      // principalFirstpaymentDate: new Date(value.principalFirstDate),
      // interestFirstpaymentDate: new Date(value.intrestFirstDate),
      // maturityDate: new Date(value.maturityDate),
      // accurialBasis: value.accurialBasis,
      // integralFeeAmount: value.integralFeeAmount,
      // firstDayType: value.firstDayType,
      // irregularPaymentSchedule: payments
    };
    if (!body.scheduleMethodId) {
      return swal.fire("GOS FINANCIALS", "Select schedule method", "error");
    }
    if (!body.principalAmount) {
      return swal.fire("GOS FINANCIALS", "Loan amount is required", "error");
    }
    if (!body.effectiveDate) {
      return swal.fire("GOS FINANCIALS", "Schedue date is required", "error");
    }
    if (!body.interestRate) {
      return swal.fire("GOS FINANCIALS", "Interest rate is required", "error");
    }
    if (!body.accurialBasis) {
      return swal.fire("GOS FINANCIALS", "Accrual basis is required", "error");
    }
    if (!body.integralFeeAmount) {
      return swal.fire("GOS FINANCIALS", "Integral Fee Amount is required", "error");
    }
    if (!body.interestFrequency) {
      return swal.fire("GOS FINANCIALS", "Interest Frequency is required", "error");
    }
    if (!body.principalFrequency) {
      return swal.fire("GOS FINANCIALS", "Principal Frequency is required", "error");
    }
    if (!body.interestFirstpaymentDate) {
      return swal.fire("GOS FINANCIALS", "Interest First payment Date is required", "error");
    }
    if (!body.principalFirstpaymentDate) {
      return swal.fire("GOS FINANCIALS", "Principal First payment Date is required", "error");
    }
    if (!body.maturityDate) {
      return swal.fire("GOS FINANCIALS", "Maturity Date is required", "error");
    }
    if (!body.tenor) {
      return swal.fire("GOS FINANCIALS", "Tenor is required", "error");
    }
    if (!body.firstDayType) {
      return swal.fire("GOS FINANCIALS", "First Day Type is required", "error");
    }
    this.loadingSrv.show();
    this.loanScheduleService.generatePeriodicLoanSchedule(body).subscribe(
      res => {
        this.loadingSrv.hide();
        if (res.status.isSuccessful == true) {
          if (res.loanPaymentSchedule.length) {
            var details = {
              principalAmount: value.principalAmount,
              interestRate: value.interestRate,
              effectiveDate: new Date(value.loanDate),
              maturityDate: new Date(value.maturityDate),
              effectiveInterestRate: value.effectiveInterestRate,
              schedules: res.loanPaymentSchedule
            };

            //window.localStorage.removeItem("schedules");
            //window.localStorage.setItem("schedules", JSON.stringify(details));

            this.schedules = details.schedules;
            this.maturityDate = this.schedules[
              this.schedules.length - 1
            ].paymentDate;
            details.maturityDate = new Date(this.maturityDate);
            details.effectiveInterestRate = this.schedules[0].effectiveInterestRate;
            // details.principalAmount =
            this.scheduleHeader = details;
            if (this.scheduleHeader.interestRate == null) {
              this.scheduleHeader.interestRate = details.effectiveInterestRate;
            }

            //SCHEDULE EVENT EMITTER : REQUIRED AT LOAN BOOKING
            //THIS BLOCK EMITS THE EVENT PARATERS TO LOAN BOOKING
            let scheduleDetailsForLoanBooking = {
              scheduleMethodId: body.scheduleMethodId,
              principalAmount: details.principalAmount,
              effectiveDate: new Date(body.effectiveDate),
              interestRate: body.interestRate,
              principalFrequency: body.principalFrequency,
              interestFrequency: body.interestFrequency,
              tenor: body.tenor,
              principalFirstpaymentDate: new Date(
                body.principalFirstpaymentDate
              ),
              interestFirstpaymentDate: new Date(body.interestFirstpaymentDate),
              maturityDate: new Date(body.maturityDate),
              accurialBasis: body.accurialBasis,
              integralFeeAmount: body.integralFeeAmount,
              firstDayType: body.firstDayType,
              irregularPaymentSchedule: body.irregularPaymentSchedule,
              effectiveInterestRate: details.effectiveInterestRate,
              schedules: details.schedules,
              formData: this.scheduleGroupForm.value
            };
            this.notify.emit(scheduleDetailsForLoanBooking);
            //END OF EVENT EMITTER

            this.displayScheduleModalForm = true;

            this.loadingSrv.hide();

            //this.router.navigate(['/credit/loan/schedule/view']);
          }
        } else {
          this.showMessage(res.status.message.friendlyMessage, "error", "FintrakBanking");
        }
      },
      err => {
        this.loadingSrv.hide();
      }
    );
  }

  initializeForm() {
    this.scheduleGroupForm = this.fb.group({
      principalAmount: ["", Validators.required],
      interestRate: ["", Validators.required],
      loanDate: ["", Validators.required],
      scheduleMethod: ["", Validators.required],
      interestFrequency: ["", Validators.required],
      // principalfrequency: ['', Validators.required],
      principalfrequency: [""],
      tenor: ["", Validators.required],
      // principalFirstDate: ['', Validators.required],
      principalFirstDate: [""],
      intrestFirstDate: ["", Validators.required],
      maturityDate: ["", Validators.required],
      numberOfPayments: [""],
      basis: [""],
      accurialBasis: ["", Validators.required],
      integralFeeAmount: [""],
      firstDayType: ["0"],
      withoutDisburment: [false],
      internalRateOfReturn: [""]
    });
  }

  exportToExcel() {
    let model = {
      principalAmount: this.scheduleParams.principalAmount,
      loanDate: this.scheduleParams.loanDate,
      firstPaymentDate: this.scheduleParams.firstPaymentDate,
      interestRate: this.scheduleParams.interestRate,
      tenorMode: this.scheduleParams.tenorMode,
      numberOfPayments: this.scheduleParams.numberOfPayments,
      scheduleList: this.schedules
    };

  }

  getLoanScheduleTypes() {
    this.loanScheduleService.getAllLoanScheduleType().subscribe(res => {
      this.scheduleTypes = res.lookUp;
    });
  }

  removeItem(evt, indx) {
    evt.preventDefault();
    let currRecord = this.scatterdPayments[indx];
    this.principalBalance =
      Number(this.principalBalance) +
      Number(currRecord.payAmount.replace(/[,]+/g, "").trim());
    this.principalValanceString = this.principalBalance.toLocaleString(
      "en-US",
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
    this.scheduleGroupForm.controls["tenor"].setValue(numDays + 1);
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }
}
