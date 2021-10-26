import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-deposits',
  templateUrl: './customer-deposits.component.html',
  styleUrls: ['./customer-deposits.component.css']
})
export class CustomerDepositsComponent implements OnInit {
  deposits: any[] = [];
  selectedVal: any;
  viewHeight: string = '600px';

  constructor() { }

  ngOnInit(): void {
  }

  multipleDelete() {

  }

  showAddNew() {

  }

  exportSetup() {

  }

  uploadSetup() {

  }

  handleFileInput(files: FileList) {

  }

  editSetup(x) {

  }
}
