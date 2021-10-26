import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoadingService } from '../../../../core/services/loading.service';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';
import { DataService } from '../../../../core/services/data.service';
import { SubGLService } from '../../../../core/services/subgl.service';

@Component({
  selector: 'app-bank-info',
  templateUrl: './bank-info.component.html',
  styleUrls: ['./bank-info.component.css'],
})
export class BankInfoComponent implements OnInit {
  @Input() customerId: string;
  @Input() bankDetailsForm: FormGroup;
  @Input() displayBankDetails: boolean;
  @Output() submitBankDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() toggleModal: EventEmitter<any> = new EventEmitter<any>();
  banks: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService,
    private fb: FormBuilder,
    private dataService: DataService,
    private subGLService: SubGLService
  ) {}

  ngOnInit(): void {
    this.initialiseForm();
    this.getBanks();
  }
  initialiseForm() {
    this.bankDetailsForm = this.fb.group({
      customerId: 0,
      customerBankDetailsId: [0],
      bvn: ['', Validators.required],
      account: ['', Validators.required],
      bank: ['', Validators.required],
    });
  }
  submitLoanCustomerBankDetails(formObj) {
    const body = formObj.value;
    body.customerId = parseInt(this.customerId);
    if (body.customerBankDetailsId == null) {
      body.customerBankDetailsId = 0;
    }
    if (!body.bank) {
      return swal.fire('GOS FINANCIALS', 'Bank name is required', 'error');
    }
    if (!body.account) {
      return swal.fire('GOS FINANCIALS', 'Account number is required', 'error');
    }
    if (isNaN(body.account)) {
      return swal.fire(
        'GOS FINANCIALS',
        'Only numbers allowed for account number',
        'error'
      );
    }
    if (body.account.length < 10 || body.account.length > 10) {
      return swal.fire(
        'GOS FINANCIALS',
        'Account number must be 10 digits',
        'error'
      );
    }
    if (isNaN(body.bvn)) {
      return swal.fire(
        'GOS FINANCIALS',
        'Only numbers allowed for bvn',
        'error'
      );
    }
    if (body.bvn.length < 11 || body.bvn.length > 11) {
      return swal.fire('GOS FINANCIALS', 'BVN must be 11 digits', 'error');
    }
    this.loadingService.show();
    this.loanCustomerService.addLoanCustomerBankDetails(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          // this.getLoanCustomerBankDetailsByLoanCustomer(this.customerId);
          // this.displayBankDetails = false;
          this.toggleModal.emit(false);
          this.dataService.reloadBankDetails.emit();
          formObj.reset();
        } else {
          // this.displayBankDetails = false;
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
  closeBankModal(value) {
    this.toggleModal.emit(value);
    this.initialiseForm();
  }
  getBanks() {
    return this.subGLService.getOtherBankGls().subscribe((data) => {
      this.banks = data.otherBanks;
    });
  }
}
