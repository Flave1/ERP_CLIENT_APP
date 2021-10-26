import { DepositAccountOpeningService } from 'src/app/core/services/depositaccountopening.service';
import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DepositAccountService } from '../../../core/services/depositaccount.service';
import { CommonService } from '../../../core/services/common.service';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import { FeeService } from 'src/app/core/services/fee.service';

@Component({
  selector: 'app-depositform',
  templateUrl: './depositform.component.html',
})
export class DepositformComponent implements OnInit {
  form: FormGroup;
  formTitle: string;
  searchResults: any[];
  AccountName: any;
  companyId: Number;
  filteredSearchResults: any[];
  displaySearchModal: boolean = false;
  accountNumbers: any[] = [];
  url: string;
  currencyArray: any[] = [];
  currencyArr: any[] = [];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private DepositFormService: DepositAccountOpeningService,
    private route: ActivatedRoute,
    private CustomerService: LoanCustomerService,
    private feeService: FeeService,
    private commonService: CommonService
  ) {
    // this.form = this.fb.group({
    //     depositFormId: [0],
    //     accountId: [0],
    //     structure: this.companyId,
    //     operation: [0, Validators.required],
    //     transactionId: [0, Validators.required],
    //     accountNumber: [""],
    //     amount: [0],
    //     valueDate: [""],
    //     transactionDate: [new Date()],
    //     transactionDescription: [""],
    //     transactionParticulars: [""],
    //     remark: [""],
    //     modeOfTransaction: [""],
    //     instrumentNumber: [""],
    //     instrumentDate: [""]
    // });
  }

  ngOnInit() {
    this.url = this.router.url;
    if (this.url.includes('/loan-management/add-loan-repayment')) {
      this.formTitle = 'Loan Repayment Form';
    } else {
      this.formTitle = 'Add New Deposit';
    }
    var emp = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = emp.companyId;
    this.getAllCustomer();
    this.route.queryParams.subscribe((params) => {
      let DepositFormId = params['editDepositForm'];
      if (DepositFormId != null || DepositFormId != undefined) {
        this.editAccountSetup(DepositFormId);
      }
    });
    this.initialiseForm();
    this.getCurrencies();
  }
  getCurrencies() {
    return this.commonService.getAllCurrency().subscribe((data) => {
      this.currencyArray = data.commonLookups;
    });
  }
  initialiseForm() {
    this.form = this.fb.group({
      id: [0],
      accountNumber: [''],
      customerId: [''],
      amount: [0],
      transactionParticulars: [''],
      remark: [''],
      modeOfTransaction: [''],
      instrumentNumber: [''],
      instrumentDate: [''],
      valueDate: [''],
      currency: [''],
      structure: [0],
    });
  }
  editAccountSetup(depositAccountId) {
    this.formTitle = 'Edit Deposit Form';
    this.loadingService.show();
    this.DepositFormService.getDepositformById(depositAccountId).subscribe(
      (data) => {
        this.loadingService.hide();
        let row = data['result'];
        this.form = this.fb.group({
          depositFormId: row.depositFormId,
          structure: row.structure,
          operation: row.operation,
          transactionId: row.transactionId,
          accountNumber: row.accountNumber,
          amount: row.amount,
          valueDate: new Date(row.valueDate),
          transactionDate: new Date(row.transactionDate),
          transactionDescription: row.transactionDescription,
          transactionParticulars: row.transactionParticulars,
          remark: row.remark,
          modeOfTransaction: row.modeOfTransaction,
          instrumentNumber: row.instrumentNumber,
          instrumentDate: new Date(row.instrumentDate),
        });
      },
      (error) => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(['/deposit/depositform-list']);
  }

  submitAccountSetup(formObj) {
    this.loadingService.show();
    formObj.value.structure = this.companyId;
    formObj.value.amount = parseFloat(formObj.value.amount);
    this.DepositFormService.addUpdateDepositForm(formObj.value).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data.status.isSuccessful == true) {
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'success'
          );
          this.router.navigate(['/deposit/depositform-list']);
        } else {
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'error'
          );
        }
      },
      (err) => {
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', JSON.stringify(err), 'error');
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
    payload.amount = parseFloat(payload.amount);
    payload.currency = +payload.currency;
    payload.structure = this.companyId;
    payload.transactionDate = payload.value_date;
    if (!payload.valueDate) {
      return swal.fire('GOD FINANCIAL', 'Value date is required', 'error');
    }
    if (!payload.instrumentDate) {
      return swal.fire('GOD FINANCIAL', 'Instrument date is required', 'error');
    }
    if (payload.value_date < present_day) {
      return swal.fire(
        'GOS FINANCIAL',
        'Value Date cannot be backdated',
        'error'
      );
    }
    this.loadingService.show();
    return this.feeService.addDeposit(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.router.navigate(['/deposit/depositform-list']);
          });
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

  openSearchBox() {
    this.displaySearchModal = true;
  }

  pickSearchedData(row) {
    this.form.patchValue({
      customerId: row.customerId,
      accountNumber: row.accountNumber,
      // amount: row.charge,
      // currency: row.currencies,
    });
    // const currency = row.currencies;
    // this.currencyArr = this.currencyArray.filter((c) => {
    //   return currency.includes(c.lookupId);
    // });
    // this.form = this.fb.group({
    //     accountId: [row.customerId],
    //     depositFormId: [0],
    //     structure: this.companyId,
    //     operation: [0, Validators.required],
    //     transactionId: [0, Validators.required],
    //     accountNumber: row.accountNumber,
    //     amount: [row.charge],
    //     valueDate: [""],
    //     transactionDate: new Date(),
    //     transactionDescription: [""],
    //     transactionParticulars: [""],
    //     remark: [""],
    //     modeOfTransaction: [""],
    //     instrumentNumber: [""],
    //     instrumentDate: [""]
    // });
    this.displaySearchModal = false;
  }

  searchDB(searchString) {
    // searchString.preventDefault;
    const filterBy = searchString ? searchString.toLocaleLowerCase() : null;
    this.filteredSearchResults = this.searchResults.filter(
      (item: any) => item.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1
    );

    // this.filteredSearchResults = this.searchResults
    //     .map(x => {
    //         return x.filter(y => y.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
    //     })
  }

  getAllCustomer() {
    this.loadingService.show();
    this.CustomerService.getAllLoanCustomerLite().subscribe((data) => {
      this.loadingService.hide();
      this.searchResults = data.customerLites;
      this.filteredSearchResults = this.searchResults;
    });
  }

  close() {
    this.displaySearchModal = false;
    this.filteredSearchResults = this.searchResults;
  }
}
