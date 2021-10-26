import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LoadingService} from "../../core/services/loading.service";
import {AuthService} from "../../core/services/auth.service";
import swal from 'sweetalert2'
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['']
    })
  }
  showMessage(title, msg, type) {
    return swal.fire(title, msg, type)
  }
  onSubmit(form: FormGroup) {
    const payload = form.value;
    this.loadingService.show();
    return this.authService.forgotPassword(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
       this.showMessage('GOS FINANCIAL', message, 'success')
      } else {
        this.showMessage('GOS FINANCIAL', message, 'error')
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      this.showMessage('GOS FINANCIAL', message, 'error')
    })
  }
}
