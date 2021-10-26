import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { GLTransactionService } from '../../../core/services/gltransaction.service';
import { Router } from '@angular/router';
import { LoanCustomerService } from '../../../core/services/loancustomer.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-credit-customer-transactions',
  templateUrl: './credit-customer-transactions.component.html',
  styleUrls: ['./credit-customer-transactions.component.css'],
})
export class CreditCustomerTransactionsComponent implements OnInit {
  glTransactionList: any[] = [];
  glTransactionSelected: any[] = [];
  selectedGLTransaction: any = {};
  displayInfo = false;
  viewHeight: any = '600px';
  dateFrom: any;
  dateTo: any;
  cols: any[];
  searchString: any;
  loanCustomerInformation: any[] = [];
  displaySearchModal: boolean;
  filteredSearchResults: any[];
  searchResults: any[];
  customerId: any;
  searchWords: string;
  accountNumber: any;
  payload: any;
  date1: string;
  form: FormGroup;
  constructor(
    private loadingService: LoadingService,
    private glTransactionService: GLTransactionService,
    private router: Router,
    private loanCustomerService: LoanCustomerService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'transactionCode', header: 'transactionCode' },
      { field: 'description', header: 'description' },
      { field: 'transactionDate', header: 'transactionDate' },
      { field: 'casaAccountNumber', header: 'Account Number' },
      { field: 'valueDate', header: 'valueDate' },
      { field: 'amount', header: 'amount' },
      { field: 'transactionType', header: 'transactionType' },
      { field: 'beneficiary', header: 'beneficiary' },
      { field: 'firstName', header: 'firstName' },
      { field: 'secondName', header: 'secondName' },
    ];
    this.getAllLoanCustomer();
    this.form = this.fb.group({
      date1: [''],
      date2: [''],
    });
    // this.getAllGLCustomerTransaction();
  }

  getAllGLCustomerTransaction() {
    this.loadingService.show();
    this.glTransactionService
      .getAllGLCustomerTransaction()
      .subscribe((data) => {
        this.loadingService.hide();
        this.glTransactionList = data['result'];
      });
  }
  onDateSelect(date, type) {
    // date = this.collectionForm.get("effectiveDate").value;
    if (date != null) {
      let d = new Date(Date.parse(date));
      if (type == 1) {
        const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        this.dateFrom = date;
      }
      if (type == 2) {
        const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        this.dateTo = date;
      }
    }
  }
  getDepositTransaction(form: FormGroup) {
    this.payload = form.value;
    this.payload.accountNumber = this.accountNumber;
    // this.payload = {
    //   date1: this.dateFrom,
    //   date2: this.dateTo,
    //   accountNumber: this.accountNumber
    // }
    // return;
    if (this.accountNumber == null) {
      return swal.fire(
        'GOS FINANCIAL',
        'The customer does not have transactions yet',
        'error'
      );
    }
    if (!this.payload.date1) {
      return swal.fire('GOS FINANCIAL', 'Select start date', 'error');
    }
    if (!this.payload.date2) {
      return swal.fire('GOS FINANCIAL', 'Select end date', 'error');
    }
    // return;
    this.loadingService.show();
    return this.glTransactionService
      .getDepositTransaction(this.payload)
      .subscribe(
        (data) => {
          this.glTransactionList = data.customerTransaction;
          this.loadingService.hide();
        },
        (err) => {
          this.loadingService.hide();
        },
        () => {}
      );
  }

  openSearchBox() {
    this.displaySearchModal = true;
  }
  searchDB(searchString) {
    const filterBy = searchString ? searchString.toLocaleLowerCase() : null;
    this.filteredSearchResults = this.searchResults.filter(
      (item: any) => item.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }
  getAllLoanCustomer() {
    this.loadingService.show();
    this.loanCustomerService.getAllLoanCustomerLite().subscribe(
      (data) => {
        this.loadingService.hide();
        this.searchResults = data.customerLites;
        this.filteredSearchResults = this.searchResults;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  pickSearchedData(res: any) {
    this.searchString = `${res.firstName} ${res.lastName}`;
    this.accountNumber = res.accountNumber;
    this.displaySearchModal = false;
    this.filteredSearchResults = this.searchResults;
    this.searchWords = '';
  }

  exportCustomerTransaction() {
    this.loadingService.show();
    this.glTransactionService
      .exportCustomerTransaction(this.payload)
      .subscribe((response) => {
        this.loadingService.hide();
        let data = response.export;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], 'Customer Transactions.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              'Customer Transactions.xlsx'
            );
          }
        }
      });
  }
}
