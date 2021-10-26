import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.css']
})
export class SecuritySettingsComponent implements OnInit {
  formTitle: string = 'Security Settings';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _location: Location
  ) { }

  ngOnInit() {
  }

  submitInfo(form: FormGroup) {
    const payload = form.value
  }

  goBack() {
    this._location.back()
  }
}
