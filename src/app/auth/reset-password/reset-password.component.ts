import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../core/services/loading.service";
import {AuthService} from "../../core/services/auth.service";
import swal from "sweetalert2";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      newPassword: [""],
      confirmPassword: [""],
      email: [''],
      token: ['']
    })
    this.route.queryParams.subscribe(param => {
      this.form.patchValue({
        email: param.email,
        token: param.token
      })
    })
  }
  showMessage(title, msg, type) {
    return swal.fire(title, msg, type)
  }
  resetPassword(form: FormGroup) {
    const payload = form.value;
    this.loadingService.show();
    return this.authService.resetPassword(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        this.showMessage('GOS FINANCIAL', message, 'success').then(() => {
          this.router.navigateByUrl('/auth/login')
        })
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
