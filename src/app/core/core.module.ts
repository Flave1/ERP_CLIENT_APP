import { LoadingService } from "./services/loading.service";
import { AuthGuard } from "./services/auth.guard";
import { ApiService } from "./services/api.service";
import { CreditClassificationService } from "./services/creditclassification.service";
import { JwtService } from "./services/jwt.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { CoreRoutingModule } from "./core-routing.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpTokenInterceptor } from "./interceptors/http.interceptor.service";
import { UserAccountService } from "./services/user.service";
import { StaffInfoService } from "./services/staff.service";
import { CountryService } from "./services/country.service";
import { CurrencyService } from "./services/currency.service";
import { CurrencyRateService } from "./services/currencyrate.service";
import { BranchService } from "./services/branch.service";
import { CompanyService } from "./services/company.service";
import { DepartmentService } from "./services/department.service";
import { ApprovalLevelService } from "./services/approvallevel.service";
// import { ApprovalGroupService } from "./services/approvalGroup.service";
import { ApprovalLevelStaffService } from "./services/approvallevelstaff.service";
import { CustomerListComponent } from "./components/customer-registration/customer-list.component";
import { CustomerRegistrationComponent } from "./components/customer-registration/customer-registration.component";
import { SupplierListComponent } from "../purchases-and-payables/components/supplier/supplier-registration/supplier-list.component";
import { SupplierRegistrationComponent } from "../purchases-and-payables/components/supplier/supplier-registration/supplier-registration.component";
import { SupplierService } from "./services/supplier.service";
import { SupplierApprovalComponent } from "../purchases-and-payables/components/supplier/supplier-approval/supplier-approval.component";
import { CustomerService } from "./services/customer.service";
import { CustomerApprovalComponent } from "./components/customer-approval/customer-approval.component";
import { UserroleactivityService } from "./services/userroleactivity.service";
import { CommonService } from "./services/common.service";
import { LoanstagingService } from "./services/loanstaging.service";
import { ChartModule } from "primeng/chart";
import { SliderModule } from "primeng/slider";
import { DashboardService } from "./services/dashboard.service";
import { ApprovalGroupService } from "./services/approvalgroup.service";
import { FinancalYearService } from "./services/financal-year.service";
import { JournalService } from "./services/journal.service";
import { MailConfigService } from "./services/mail-config.service";
import {NotificationService} from './services/notification.service';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import {PurchasesAndPayablesModule} from "../purchases-and-payables/purchases-and-payables.module";
import {UrlSerializer} from "@angular/router";
import CustomUrlSerializer from "./interceptors/urlSerializer.service";
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { MainDashboardPageComponent } from './components/main-dashboard-page/main-dashboard-page.component';

@NgModule({
  imports: [CommonModule, SharedModule, ChartModule, SliderModule, PurchasesAndPayablesModule],
  declarations: [
    DashboardComponent,
    // SupplierListComponent,
    CustomerListComponent,
    CustomerRegistrationComponent,
    // SupplierRegistrationComponent,
    SupplierApprovalComponent,
    CustomerApprovalComponent,
    NotificationComponent,
    NotificationsComponent,
    MainDashboardComponent,
    MainDashboardPageComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    { provide: UrlSerializer, useClass: CustomUrlSerializer },
    JwtService,
    ApiService,
    AuthGuard,
    LoadingService,
    UserAccountService,
    StaffInfoService,
    CountryService,
    CurrencyService,
    CurrencyRateService,
    BranchService,
    CompanyService,
    DepartmentService,
    ApprovalGroupService,
    ApprovalLevelService,
    ApprovalLevelStaffService,
    // SupplierService,
    CustomerService,
    UserroleactivityService,
    CommonService,
    CreditClassificationService,
    LoanstagingService,
    DashboardService,
    FinancalYearService,
    JournalService,
    MailConfigService,
    NotificationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule {}
