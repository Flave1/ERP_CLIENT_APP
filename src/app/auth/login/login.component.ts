import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import swal from 'sweetalert2';
import { JwtService } from '../../core/services/jwt.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  returnUrl: string;
  redirectURL: any;
  moduleName: any[] = [];
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService,
    private jwtService: JwtService,
    private route: ActivatedRoute,
    public titleService: Title
  ) {
    this.form = this.fb.group({
      userName: [''],
      password: [''],
    });
  }
  ngOnInit() {
    // this.setTitle('GOS ERP | Login');
    let params = this.route.snapshot.queryParams;

    if (params['returnUrl']) {
      this.redirectURL = params['returnUrl'];
    }

    if (this.redirectURL) {
      this.router
        .navigateByUrl(this.redirectURL)
        .catch(() => this.router.navigate(['/']));
    } else {
      this.router.navigate(['/']);
    }
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  async getModules() {
    await this.authService.getModules().subscribe((data) => {
      data.map((item) => {
        if (item.isActive) {
          this.moduleName.push(item.moduleCode);
          this.jwtService.saveModules(this.moduleName);
        }
      });
    });
  }
  getUserDetails() {
    this.loadingService.show();
    return this.authService.getProfile().subscribe(
      (data) => {
        if (data != null) {
          this.jwtService.saveUserDetails(data);
          let activities;
          if (data.activities != null) {
            activities = data.activities.map((item) => {
              return item.toLocaleLowerCase();
            });
            this.jwtService.saveUserActivities(activities).then(() => {
              this.router.navigateByUrl(this.redirectURL);
            });
          } else {
            swal
              .fire(
                'GOS FINANCIAL',
                `User won't be able to see any page, contact the super admin`,
                'error'
              )
              .then(() => {
                this.router.navigate(['/']);
              });
          }
        }
        this.loadingService.hide();
      },
      (error) => {
        const message = error.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, 'error');
        this.loadingService.hide();
      }
    );
  }
  public onSubmit(values: FormGroup) {
    const payload = values.value;
    if (!payload.userName) {
      return swal.fire('GOS FINANCIAL', 'Username is required', 'error');
    }
    if (!payload.password) {
      return swal.fire('GOS FINANCIAL', 'Password is required', 'error');
    }
    if (this.form.valid) {
      this.loadingService.show();
      return this.authService.userLogin(payload).subscribe(
        (res) => {
          this.loadingService.hide();
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            if (res.token !== null) {
              localStorage.setItem('refreshToken', res.refreshToken);
              this.jwtService.saveToken(res.token).then(() => {
                this.getModules().then(() => {
                  this.getUserDetails();
                });
              });
            } else {
              swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                this.router.navigateByUrl('/auth/otp');
              });
            }
          } else if (res.isSecurityQuestion) {
          }
        },
        (err) => {
          this.loadingService.hide();
          let error = err.error.status.message;
          if (err.error.isSecurityQuestion) {
            this.router.navigate(['/auth/security-question'], {
              queryParams: {
                username: payload.userName,
              },
            });
          }
          swal.fire('GOS FINANCIALS', error.friendlyMessage, 'error');
          // error.forEach(error => {
          //   swal.fire('GOS FINANCIALS', error.friendlyMessage, 'error')
          // })
          this.loadingService.hide();
        }
      );
    }
  }
}
