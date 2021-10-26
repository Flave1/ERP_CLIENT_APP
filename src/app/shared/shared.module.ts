import { ToastModule } from 'primeng/toast';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeTableModule } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ApprovalCommentComponent } from './component/approval-comment/approval-comment.component';
import { ViewLoanDetailsComponent } from './component/view-loan-details/view-loan-details.component';
import { ViewLoanScheduleComponent } from './component/view-loan-schedule/view-loan-schedule.component';
import { ViewLoanCollateralComponent } from './component/view-loan-collateral/view-loan-collateral.component';
import { ViewLoanChargeFeeComponent } from './component/view-loan-charge-fee/view-loan-charge-fee.component';
import { ViewCreditRatingComponent } from './component/view-credit-rating/view-credit-rating.component';
import { ViewDeletedLoanScheduleComponent } from './component/view-deleted-loan-schedule/view-deleted-loan-schedule.component';
import { TransactionCorrectionComponent } from '../deposit/components/transaction-correction/transaction-correction.component';
import { LoanCustomerFsCaptionDetailComponent } from '../credit/component/loan-customer-fs/loan-customer-fs-caption-detail/loan-customer-fs-caption-detail.component';
import { InvestmentAppraisalComponent } from '../investor/components/investment-appraisal/investment-appraisal.component';
import { InvestmentDetailsComponent } from '../investor/components/investment-details/investment-details.component';
import { InvestmentCustomerDetailsComponent } from '../investor/components/investment-customer-details/investment-customer-details.component';
import { InvestmentApprovalCommentComponent } from '../investor/components/investment-approval-comment/investment-approval-comment.component';
import { LmsApplicationManageComponent } from '../credit/component/credit-management/lms-application/lms-application-manage.component';
import { RouterModule } from '@angular/router';
import { ApprovalDetailsComponent } from './component/approval-details/approval-details.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {MatSelectModule} from '@angular/material/select';
import {NgSelectModule} from '@ng-select/ng-select';
// import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    TableModule,
    DropdownModule,
    TabViewModule,
    DialogModule,
    AccordionModule,
    RadioButtonModule,
    TreeTableModule,
    TooltipModule,
    OrganizationChartModule,
    ToastModule,
    MultiSelectModule,
    InputSwitchModule,
    RouterModule,
    AngularMultiSelectModule,
    MatSelectModule,
    NgSelectModule
    // ScrollingModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    TableModule,
    DropdownModule,
    TabViewModule,
    DialogModule,
    AccordionModule,
    RadioButtonModule,
    TreeTableModule,
    TooltipModule,
    OrganizationChartModule,
    ToastModule,
    MultiSelectModule,
    NgSelectModule,
    InputSwitchModule,
    ApprovalCommentComponent,
    ViewLoanDetailsComponent,
    ViewLoanScheduleComponent,
    ViewLoanCollateralComponent,
    ViewLoanChargeFeeComponent,
    ViewCreditRatingComponent,
    ViewDeletedLoanScheduleComponent,
    TransactionCorrectionComponent,
    LoanCustomerFsCaptionDetailComponent,
    InvestmentAppraisalComponent,
    InvestmentDetailsComponent,
    InvestmentCustomerDetailsComponent,
    InvestmentApprovalCommentComponent,
    LmsApplicationManageComponent,
    RouterModule,
    ApprovalDetailsComponent
    // ScrollingModule
  ],
  declarations: [
    LoanCustomerFsCaptionDetailComponent,
    ApprovalCommentComponent,
    ViewLoanDetailsComponent,
    ViewLoanScheduleComponent,
    ViewLoanCollateralComponent,
    ViewLoanChargeFeeComponent,
    ViewCreditRatingComponent,
    ViewDeletedLoanScheduleComponent,
    TransactionCorrectionComponent,
    InvestmentAppraisalComponent,
    InvestmentDetailsComponent,
    InvestmentCustomerDetailsComponent,
    InvestmentApprovalCommentComponent,
    LmsApplicationManageComponent,
    ApprovalDetailsComponent
  ]
})
export class SharedModule {}
