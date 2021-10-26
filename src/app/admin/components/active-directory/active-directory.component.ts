import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";

@Component({
  selector: 'app-active-directory',
  templateUrl: './active-directory.component.html',
  styleUrls: ['./active-directory.component.css']
})
export class ActiveDirectoryComponent implements OnInit {
  formTitle: string = 'Active Directory';
  form: FormGroup;
  show: string;

  constructor(
    private fb: FormBuilder,
    private _location: Location
  ) { }

  ngOnInit() {
    this.form = this.fb.group({

    })
  }

  getValue(value: any) {
    this.show = value;
  }

  submitInfo(form: FormGroup) {
    const payload = form.value
  }

  goBack() {
    this._location.back();
  }
}
