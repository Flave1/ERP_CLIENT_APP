import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../core/services/common.service';
import { LoadingService } from '../../../../core/services/loading.service';
import swal from 'sweetalert2';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';

interface Year {
  value: string;
  year: string;
}
@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.css'],
})
export class CardInfoComponent implements OnInit {
  @Input() customerId: string;
  @Input() cardDetailsForm: FormGroup;
  currencyInformation: any[] = [];
  years: Year[] = [];
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService
  ) {}

  ngOnInit(): void {
    this.generateYears(2020, 2031);
    this.getAllCurrency();
    this.initialiseForm();
  }
  initialiseForm() {
    this.cardDetailsForm = this.fb.group({
      customerId: 0,
      customerCardDetailsId: [0],
      cardNumber: ['', Validators.required],
      cvv: ['', Validators.required],
      expiryMonth: ['', Validators.required],
      expiryYear: ['', Validators.required],
      currencyCode: ['', Validators.required],
      issuingBank: ['', Validators.required],
    });
  }
  generateYears(from, to) {
    for (let i = from; i <= to; i++) {
      this.years.push({ value: i.toString(), year: i.toString() });
    }
  }
  // submitLoanCustomerCardDetails(cardDetailsForm: FormGroup) {
  //   this.submitCardInfo.emit(cardDetailsForm);
  // }
  getAllCurrency() {
    this.loadingService.show();
    this.commonService.getAllCurrency().subscribe(
      (data) => {
        this.loadingService.hide();
        this.currencyInformation = data.commonLookups;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  submitLoanCustomerCardDetails(formObj) {
    const body = formObj.value;
    body.customerId = parseInt(this.customerId);
    if (isNaN(body.cardNumber)) {
      return swal.fire(
        'GOS FINANCIALS',
        'Only numbers allowed for Card number',
        'error'
      );
    }
    if (body.cardNumber.length < 12 || body.cardNumber.length > 16) {
      return swal.fire(
        'GOS FINANCIALS',
        'Card number must be 16 digits',
        'error'
      );
    }
    if (isNaN(body.cvv)) {
      return swal.fire(
        'GOS FINANCIALS',
        'Only numbers allowed for CVV number',
        'error'
      );
    }
    if (body.cvv.length < 3 || body.cvv.length > 3) {
      return swal.fire(
        'GOS FINANCIALS',
        'CVV number must be 3 digits',
        'error'
      );
    }

    this.loadingService.show();

    if (body.customerCardDetailsId == null) {
      body.customerCardDetailsId = 0;
    }

    this.loanCustomerService.addLoanCustomerCardDetails(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          // this.getLoanCustomerCardDetails(this.customerId);
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }
}
