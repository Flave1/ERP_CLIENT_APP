import { Component, OnInit } from '@angular/core';
import { SearchColumn } from '../../../models/models';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];
  cols: SearchColumn[] = [];
  selectedItems: any;

  constructor() {}

  ngOnInit(): void {}

  showAddNew() {}
}
