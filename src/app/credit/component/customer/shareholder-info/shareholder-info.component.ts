import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-shareholder-info',
  templateUrl: './shareholder-info.component.html',
  styleUrls: ['./shareholder-info.component.css'],
})
export class ShareholderInfoComponent implements OnInit {
  @Input() directorShareHolderForm: FormGroup;
  @Output() submitShareholderInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  submitLoanCustomerDirectorShareHolders(directorShareHolderForm: FormGroup) {
    this.submitShareholderInfo.emit(directorShareHolderForm);
  }

  closeDirectorModal(value: boolean) {
    this.closeModal.emit(value);
  }
}
