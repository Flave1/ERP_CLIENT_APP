import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { OtpConfirmationComponent } from "./otp-confirmation/otp-confirmation.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import {UrlSerializer} from "@angular/router";
import CustomUrlSerializer from "../core/interceptors/urlSerializer.service";
import { SecurityQuestionComponent } from './security-question/security-question.component';

@NgModule({
  imports: [CommonModule, SharedModule, AuthRoutingModule],
  declarations: [
    LoginComponent,
    OtpConfirmationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SecurityQuestionComponent
  ],
  providers:[
    // { provide: UrlSerializer, useClass: CustomUrlSerializer }
  ]
})
export class AuthModule {}
