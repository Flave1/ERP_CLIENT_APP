import { AuthLayoutComponent } from "./../shared/layout/auth-layout.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import {OtpConfirmationComponent} from "./otp-confirmation/otp-confirmation.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";

const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "/auth/login",
  //   pathMatch: "full"
  // },
  {
    path: "login",
    component: LoginComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}

export const routedComponents = [LoginComponent];
