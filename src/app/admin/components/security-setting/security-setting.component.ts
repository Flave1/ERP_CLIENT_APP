import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-security-setting',
  templateUrl: './security-setting.component.html',
  styleUrls: ['./security-setting.component.css']
})
export class SecuritySettingComponent implements OnInit {
  formTitle: string = 'Security Settings';
  show: boolean;
  checked: boolean;
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initialiseForm()
  }
  initialiseForm() {
    this.form = this.fb.group({
      activeDirectory: [false]
    })
  }
  submitInfo() {

  }

  goBack() {

  }

  getValue(value: any) {
   const val = this.form.get('activeDirectory').value;
    this.show = val
  }
}
