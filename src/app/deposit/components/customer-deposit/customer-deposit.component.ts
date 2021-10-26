import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DepositAccountOpeningService} from '../../../core/services/depositaccountopening.service';
import {LoadingService} from '../../../core/services/loading.service';
import {DepositAccountService} from '../../../core/services/depositaccount.service';
import swal from 'sweetalert2'
@Component({
  selector: 'app-customer-deposit',
  templateUrl: './customer-deposit.component.html',
  styleUrls: ['./customer-deposit.component.css']
})
export class CustomerDepositComponent implements OnInit {
  formTitle: string = 'Deposit Form';
  form: FormGroup;
  structures: any[] = [];
  customers: any[] = [];
  constructor(
    private fb: FormBuilder,
    private customerService: DepositAccountOpeningService,
    private loadingService: LoadingService,
    private depositService: DepositAccountService
  ) { }

  ngOnInit(): void {
    this.initialiseForm();
    this.getAllCustomer()
  }
  initialiseForm() {
    this.form = this.fb.group({
      id: [0],
      account_number: [''],
      customerId: [''],
      deposit_amount: [0],
      transaction_particulars: [''],
      remark: [''],
      transaction_mode: [0],
      instrument_number: [""],
      instrument_date: [''],
      value_date: ['']
    })
  }
  getAllCustomer() {
    this.loadingService.show();
    this.customerService.getAllCustomerLite().subscribe(
      data => {
        this.loadingService.hide();
        this.customers = data.customerLiteAccountDetails;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  submitForm(form: FormGroup) {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    let present_day = `${yyyy}-${mm}-${dd}`;

    const payload = form.value;
    payload.deposit_amount = parseFloat(payload.deposit_amount);
    payload.transaction_mode = +payload.transaction_mode;
    if (payload.value_date < present_day) {
      return swal.fire('GOS FINANCIAL', 'Value Date cannot be backdated', 'error')
    }
    this.loadingService.show();
    return this.depositService.addDeposit(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire('GOS FINANCIAL', message, 'success').then(() => {
          this.initialiseForm()
        })
      } else {
        swal.fire('GOS FINANCIAL', message, 'error')
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error')
    })
  }

  goBack() {

  }

  getCustomer(value: any) {
    const item = this.customers.find(item => item.customerId === +value);
    this.form.patchValue({
      customerId: +value,
      account_number: item.accountNumber
    })
  }
}
