import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import { CommonService } from "../../../core/services/common.service";
import {LoadingService} from "../../../core/services/loading.service";
import swal from "sweetalert2";

@Component({
  selector: "app-authentication-setup",
  templateUrl: "./authentication-setup.component.html",
  styleUrls: ["./authentication-setup.component.css"]
})
export class AuthenticationSetupComponent implements OnInit {
  formTitle: string = "Security Settings";
  form: FormGroup;
  dualAuthenticate: boolean;
  modules: any[] = []
  moduleId: number;
  show: boolean;
  showLockOut: boolean;
  showLoadBalance: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private route: ActivatedRoute

  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      const id = param.id;
      this.moduleId = param.id;
      if (id !== undefined) {
        this.getAuthSetup(id)
      }
    })
    this.form = this.fb.group({
      shouldAthenticate: [false],
      useActiveDirectory: [false],
      activeDirectory: [''],
      enableLoginFailedLockout: [false],
      inActiveSessionTimeout: [0],
      enableRetryOnMobileApp: [false],
      enableRetryOnWebApp: [false],
      shouldRetryAfterLockoutEnabled: [false],
      retryTimeInMinutes: [0],
      numberOfFailedLoginBeforeLockout: [0],
      passwordUpdateCycle: [0],
      enableLoadBalance: [false],
      loadBalanceInHours: [0],
      securitySettingsActiveOnWebApp: [false],
      securitySettingActiveOnMobileApp:[false],
      authSettupId: [0],
      media: [0],
      module: [0],
      activeOnMobileApp: [false],
      activeOnWebApp: [false]
    });
    this.getModules()
  }
  getModules() {
    this.loadingService.show();
    return this.commonService.getAllModule().subscribe(data => {
      this.loadingService.hide();
      this.modules = data.solutionModules
    }, err => {
      this.loadingService.hide()
    })
  }
  getValue(value: any) {
    const val = this.form.get('shouldAthenticate').value
    this.dualAuthenticate = val;
  }

  goBack() {
    this.router.navigate(["/setup/authentication-list"]);
  }

  submitInfo(form: FormGroup) {
    const payload = form.value;
    payload.media = +payload.media;
    payload.module = +payload.module;
    payload.inActiveSessionTimeout = +payload.inActiveSessionTimeout;
    payload.retryTimeInMinutes = +payload.retryTimeInMinutes;
    payload.numberOfFailedLoginBeforeLockout = +payload.numberOfFailedLoginBeforeLockout;
    payload.passwordUpdateCycle = +payload.passwordUpdateCycle;
    payload.loadBalanceInHours = +payload.loadBalanceInHours
    this.loadingService.show();
    return this.commonService.updateAuthentication(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire('GOS FINANCIAL', message, 'success').then(() => {
          this.router.navigateByUrl('/setup/authentication-list')
        })
      } else {
        return swal.fire('GOS FINANCIAL', message, 'error')
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error')
    })

  }

  getAuthSetup(id: number) {
    this.loadingService.show();
    return this.commonService.getSingleAuth(id).subscribe(data => {
      const row = data.authSettups;
      this.form = this.fb.group({
        shouldAthenticate: [row.shouldAthenticate],
        useActiveDirectory: [row.useActiveDirectory],
        activeDirectory: row.activeDirectory,
        enableLoginFailedLockout: row.enableLoginFailedLockout,
        inActiveSessionTimeout: row.inActiveSessionTimeout,
        enableRetryOnMobileApp: row.enableRetryOnMobileApp,
        enableRetryOnWebApp: row.enableRetryOnWebApp,
        retryTimeInMinutes: row.retryTimeInMinutes,
        numberOfFailedLoginBeforeLockout: row.numberOfFailedLoginBeforeLockout,
        authSettupId: [row.authSettupId],
        shouldRetryAfterLockoutEnabled: row.shouldRetryAfterLockoutEnabled,
        passwordUpdateCycle: row.passwordUpdateCycle,
        enableLoadBalance: row.enableLoadBalance,
        loadBalanceInHours: row.loadBalanceInHours,
        securitySettingsActiveOnWebApp: row.securitySettingsActiveOnWebApp,
        securitySettingActiveOnMobileApp: row.securitySettingActiveOnMobileApp,
        media: [row.media],
        module: [row.module],
        activeOnMobileApp: [row.activeOnMobileApp],
        activeOnWebApp: [row.activeOnWebApp]
      });
      this.show = row.useActiveDirectory;
      this.showLockOut = row.enableLoginFailedLockout;
      this.showLoadBalance = row.enableLoadBalance;
      this.dualAuthenticate = row.shouldAthenticate
    })
  }

  getDirectoryValue(value: any) {
    const val = this.form.get('useActiveDirectory').value
    this.show = val
  }

  getLockOutValue(value: any) {
    const val = this.form.get('enableLoginFailedLockout').value
    this.showLockOut = val;
  }

  getLoadBalanceValue() {
    this.showLoadBalance = this.form.get('enableLoadBalance').value
  }
}
