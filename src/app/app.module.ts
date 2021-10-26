import { JwtService } from './core/services/jwt.service';
import { AuthService } from './core/services/auth.service';
import { AuthLayoutComponent } from './shared/layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layout/main-layout.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  LocationStrategy,
  HashLocationStrategy,
  DatePipe,
  DecimalPipe,
  CurrencyPipe,
} from '@angular/common';
import { AppRoutes } from './app.routes';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
// import { GrowlModule } from "primeng/growl";
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { OrderListModule } from 'primeng/orderlist';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
// import { RadioButtonModule } from "primeng/radiobutton";
import { RatingModule } from 'primeng/rating';
// import { ScheduleModule } from "primeng/schedule";
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';

import { AppComponent } from './app.component';
import {
  AppMenuComponent,
  AppSubMenuComponent,
} from './shared/common/app.menu.component';
import { AppTopbarComponent } from './shared/common/app.topbar.component';
import { AppFooterComponent } from './shared/common/app.footer.component';
import { AppBreadcrumbComponent } from './shared/common/app.breadcrumb.component';
import { AppRightpanelComponent } from './shared/common/app.rightpanel.component';
import { AppInlineProfileComponent } from './shared/common/app.profile.component';
import { DashboardDemoComponent } from './demo/view/dashboarddemo.component';
import { SampleDemoComponent } from './demo/view/sampledemo.component';
import { FormsDemoComponent } from './demo/view/formsdemo.component';
import { DataDemoComponent } from './demo/view/datademo.component';
import { PanelsDemoComponent } from './demo/view/panelsdemo.component';
import { OverlaysDemoComponent } from './demo/view/overlaysdemo.component';
// import { MenusDemoComponent } from "./demo/view/menusdemo.component";
import { MessagesDemoComponent } from './demo/view/messagesdemo.component';
import { MiscDemoComponent } from './demo/view/miscdemo.component';
import { EmptyDemoComponent } from './demo/view/emptydemo.component';
import { ChartsDemoComponent } from './demo/view/chartsdemo.component';
import { FileDemoComponent } from './demo/view/filedemo.component';
import { UtilsDemoComponent } from './demo/view/utilsdemo.component';
import { DocumentationComponent } from './demo/view/documentation.component';

import { CarService } from './demo/service/carservice';
// import { CountryService } from "./demo/service/countryservice";
import { EventService } from './demo/service/eventservice';
import { NodeService } from './demo/service/nodeservice';
import { BreadcrumbService } from './shared/common/breadcrumb.service';
import { AdminModule } from './admin/admin.module';
import { SetupModule } from './setup/setup.module';
import { StateService } from './core/services/state.service';
import { CityService } from './core/services/city.service';
import { CurrencyRateService } from './core/services/currencyrate.service';
import { BranchService } from './core/services/branch.service';
import { CompanyService } from './core/services/company.service';
import { DepartmentService } from './core/services/department.service';
// import { ApprovalGroupService } from "./core/services/approvalGroup.service";
import { ApprovalLevelStaffService } from './core/services/approvallevelstaff.service';
import { ApprovalLevelService } from './core/services/approvallevel.service';
import { PurchaseModule } from './purchase/purchase.module';
import { FinanceModule } from './finance/finance.module';
import { SubGLService } from './core/services/subgl.service';
import { RegistryService } from './core/services/registry';
import { CreditModule } from './credit/credit.module';
import { IdentificationService } from './core/services/identification.service';
import { DateUtilService } from './core/services/dateutils';
import { LoanApplicationService } from './core/services/loanapplication.service';
import { CasaModule } from './casa/casa.module';
import { CustomerAccountService } from './core/services/customeraccount.service';
import { LoanReviewOperationsService } from './core/services/loan-review-operations.service';
import { AppConfig } from './shared/constant/app.config';
import { AppConfigService } from './core/services/app.config.service';
import { EndOfDayService } from './core/services/end-of-day.service';
import { GLTransactionService } from './core/services/gltransaction.service';
import { ExposureListComponent } from './setup/components/exposure/exposure-list.component';
import { CustomertransactionListComponent } from './casa/components/customertransaction/customertransaction-list.component';
import { AccounttypeListComponent } from './deposit/components/accounttype-list/accounttype-list.component';
import { AccounttypeComponent } from './deposit/components/accounttype-list/accounttype.component';
import { CategoryListComponent } from './deposit/components/category-list/category-list.component';
import { CategoryComponent } from './deposit/components/category-list/category.component';
import { BusinesscategoryComponent } from './deposit/components/businesscategory-list/businesscategory.component';
import { BusinesscategoryListComponent } from './deposit/components/businesscategory-list/businesscategory-list.component';
import { TransactionchargeComponent } from './deposit/components/transactioncharge-list/transactioncharge.component';
import { TransactionchargeListComponent } from './deposit/components/transactioncharge-list/transactioncharge-list.component';
import { TransactiontaxComponent } from './deposit/components/transactiontax-list/transactiontax.component';
import { TransactiontaxListComponent } from './deposit/components/transactiontax-list/transactiontax-list.component';
import { AccountsetupListComponent } from './deposit/components/accountsetup-list/accountsetup-list.component';
import { AccountsetupComponent } from './deposit/components/accountsetup-list/accountsetup.component';
import { DepositAccountService } from './core/services/depositaccount.service';
import { DepositAccountOpeningService } from './core/services/depositaccountopening.service';
import { AccountopeningListComponent } from './deposit/components/accountopening-list/accountopening-list.component';
import { AccountopeningComponent } from './deposit/components/accountopening-list/accountopening.component';
import { AccountopeningDirectorsComponent } from './deposit/components/accountopening-list/accountopening-directors.component';
import { AccountopeningSignatoriesComponent } from './deposit/components/accountopening-list/accountopening-signatories.component';
import { DepositformListComponent } from './deposit/components/depositform-list/depositform-list.component';
import { DepositformComponent } from './deposit/components/depositform-list/depositform.component';
import { ApprovalGroupService } from './core/services/approvalgroup.service';
import { ChangeOfRateComponent } from './deposit/components/change-of-rate/change-of-rate.component';
import { ChangeOfRateListComponent } from './deposit/components/change-of-rate-list/change-of-rate-list.component';
import { DepositModule } from './deposit/deposit.module';
import { InvestorModule } from './investor/investor.module';
import { TreasuryModule } from './treasury/treasury.module';
import { OperatingAccountComponent } from './credit/operatingAccount/operatingAccount.component';
import { LmsApplicationManageComponent } from './credit/component/credit-management/lms-application/lms-application-manage.component';
import { ScenaroSetupListComponent } from './credit/component/ifrs/scenaro-setup/scenaro-setup-list.component';
import { ScenaroSetupComponent } from './credit/component/ifrs/scenaro-setup/scenaro-setup.component';
import { JournalApprovalComponent } from './finance/component/journal/Journal-approval/Journal-approval.component';
import { PurchasesAndPayablesModule } from './purchases-and-payables/purchases-and-payables.module';
import { PpeModule } from './ppe/ppe.module';
import { ExcelReportComponent } from './finance/component/excel-report/excel-report.component';
import { FlutterTransferListComponent } from './finance/component/flutterwave/flutter-transfer-list/flutter-transfer-list.component';
import { PendingRolloverComponent } from './investor/components/pending-rollover/pending-rollover.component';
import { PendingTopupComponent } from './investor/components/pending-topup/pending-topup.component';
import CustomUrlSerializer from './core/interceptors/urlSerializer.service';
import { UrlSerializer } from '@angular/router';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ExpenseManagementModule } from './expense-management/expense-management.module';
//import { SecurityQuestionComponent } from './auth/security-question/security-question.component';
// import { AssetClassificationComponent } from './ppe/components/setup/asset-classification/asset-classification.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutes,
    // AppRoutingModule,
    SharedModule,
    AuthModule,
    CoreModule,
    AdminModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    // GrowlModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RatingModule,
    // ScheduleModule,
    ScrollPanelModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TreeModule,
    TreeTableModule,
    SetupModule,
    PurchaseModule,
    FinanceModule,
    CreditModule,
    CasaModule,
    DepositModule,
    InvestorModule,
    TreasuryModule,
    PurchasesAndPayablesModule,
    PpeModule,
    AngularMultiSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    ExpenseManagementModule,
  ],
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent,
    AppComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    AppTopbarComponent,
    AppFooterComponent,
    AppBreadcrumbComponent,
    AppRightpanelComponent,
    AppInlineProfileComponent,
    DashboardDemoComponent,
    SampleDemoComponent,
    FormsDemoComponent,
    DataDemoComponent,
    PanelsDemoComponent,
    OverlaysDemoComponent,
    // MenusDemoComponent,
    MessagesDemoComponent,
    MiscDemoComponent,
    ChartsDemoComponent,
    EmptyDemoComponent,
    FileDemoComponent,
    UtilsDemoComponent,
    DocumentationComponent,
    ExposureListComponent,
    CustomertransactionListComponent,
    AccounttypeListComponent,
    AccounttypeComponent,
    CategoryListComponent,
    CategoryComponent,
    BusinesscategoryListComponent,
    BusinesscategoryComponent,
    TransactionchargeListComponent,
    TransactionchargeComponent,
    TransactiontaxListComponent,
    TransactiontaxComponent,
    AccountsetupListComponent,
    AccountsetupComponent,
    AccountopeningListComponent,
    AccountopeningComponent,
    AccountopeningDirectorsComponent,
    AccountopeningSignatoriesComponent,
    DepositformListComponent,
    DepositformComponent,
    OperatingAccountComponent,
    ScenaroSetupListComponent,
    ScenaroSetupComponent,
    ExcelReportComponent,
    FlutterTransferListComponent,
    PendingRolloverComponent,
    PendingTopupComponent,

    // SecurityQuestionComponent
    // ChangeOfRateComponent,
    // ChangeOfRateListComponent,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AppConfig,
    AppConfigService,
    CarService,
    // CountryService,
    EventService,
    NodeService,
    BreadcrumbService,
    AuthService,
    JwtService,
    StateService,
    CityService,
    CurrencyRateService,
    BranchService,
    CompanyService,
    DepartmentService,
    SubGLService,
    RegistryService,
    IdentificationService,
    DateUtilService,
    LoanApplicationService,
    CustomerAccountService,
    LoanReviewOperationsService,
    AppConfig,
    AppConfigService,
    EndOfDayService,
    GLTransactionService,
    DatePipe,
    DecimalPipe,
    ApprovalGroupService,
    Title,
    CurrencyPipe,
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
