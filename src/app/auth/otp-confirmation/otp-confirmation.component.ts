import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingService } from "../../core/services/loading.service";
import { AuthService } from "../../core/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import swal from "sweetalert2";
import { JwtService } from "../../core/services/jwt.service";

@Component({
  selector: "app-otp-confirmation",
  templateUrl: "./otp-confirmation.component.html",
  styleUrls: ["./otp-confirmation.component.css"]
})
export class OtpConfirmationComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private jwtService: JwtService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: [""],
      otp: [""]
    });
  }
  getUserDetails() {
    this.loadingService.show();
    return this.authService.getProfile().subscribe(
      data => {
        if (data != null) {
          this.jwtService.saveUserDetails(data);
          let activities;
          if (data.activities != null) {
            activities = data.activities.map(item => {
              return item.toLocaleLowerCase();
            });
            this.jwtService.saveUserActivities(activities).then(() => {
              this.router.navigateByUrl('/');
            });
          } else {
            swal
              .fire(
                "GOS FINANCIAL",
                `User won't be able to see any page, contact the super admin`,
                "error"
              )
              .then(() => {
                this.router.navigate(["/"]);
              });
          }
        }
        this.loadingService.hide();
      },
      error => {
        const message = error.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, "error");
        this.loadingService.hide();
      }
    );
  }
  onSubmit(form: FormGroup) {
    const { otp, email } = form.value;
    this.loadingService.show();
    return this.authService.confirmToken(otp, email).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {

          if (res.token !== null) {
            localStorage.setItem('refreshToken', res.refreshToken);
            this.jwtService.saveToken(res.token).then(() => {
              this.getUserDetails();
            });
          } else {
            swal.fire('GOS FINANCIAL', message, 'success').then(() => {
              this.router.navigateByUrl('/login/otp')
            })

          }
        }
      }, err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error')
      })
  }
}
