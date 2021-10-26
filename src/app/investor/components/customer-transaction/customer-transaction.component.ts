import { Component, OnInit } from '@angular/core';
import { SearchColumn } from '../../../models/models';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-transaction',
  templateUrl: './customer-transaction.component.html',
  styleUrls: ['./customer-transaction.component.css'],
})
export class CustomerTransactionComponent implements OnInit {
  cols: SearchColumn[] = [];
  customerTransactions: any[] = [];
  selectedCustomerTransactions: any[] = [];
  form: FormGroup;
  searchString: string;
  displaySearchModal: boolean;
  searchWords: string;
  filteredSearchResults: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date1: [''],
      date2: [''],
    });
  }

  exportCustomerTransaction() {}

  openSearchBox() {}

  getDepositTransaction(form: FormGroup) {}

  searchDB(value: any) {}

  pickSearchedData(res: any) {}
}
