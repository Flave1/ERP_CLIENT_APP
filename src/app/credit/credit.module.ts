import { CollateralTypeListComponent } from './component/collateral/collateral-type/collateral-type-list.component';
import { LoanCustomerFsRatioDetailListComponent } from './component/loan-customer-fs/loan-customer-fs-ratio-detail/loan-customer-fs-ratio-detail-list.component';
import { LoanCustomerFsCaptionComponent } from './component/loan-customer-fs/loan-customer-fs-caption/loan-customer-fs-caption.component';
import { LoanCustomerFsCaptionDetailListComponent } from './component/loan-customer-fs/loan-customer-fs-caption-detail/loan-customer-fs-caption-detail-list.component';
import { LoanCustomerFsCaptionListComponent } from './component/loan-customer-fs/loan-customer-fs-caption/loan-customer-fs-caption-list.component';
import { CustomerFsService } from './../core/services/customer-fs.service';
import { CreditBureauSetupListComponent } from './component/credit-bureau-setup/credit-bureau-setup-list.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeComponent } from './component/fee/fee.component';
import { FeeListComponent } from './component/fee/fee-list.component';
import { FeeService } from '../core/services/fee.service';
import { ProductComponent } from './component/product/product.component';
import { ProductListComponent } from './component/product/product-list.component';
import { ProductService } from '../core/services/product.service';
import { LoanCustomerComponent } from './component/loancustomer/loancustomer.component';
import { LoanCustomerListComponent } from './component/loancustomer/loancustomer-list.component';
import { LoanCustomerService } from '../core/services/loancustomer.service';
import { CreditRiskScoreCardComponent } from './component/creditriskscorecard/creditriskscorecard.component';
import { CreditRiskScoreCardListComponent } from './component/creditriskscorecard/creditriskscorecard-list.component';
import { CreditRiskScoreCardService } from '../core/services/creditriskscorecard';
import { StartLoanApplicationComponent } from './component/startloanapplication/startloanapplication.component';
import { StartLoanApplicationListComponent } from './component/startloanapplication/startloanapplication-list.component';
import { LoanApplicationComponent } from './component/startloanapplication/loanapplication.component';
import { LoanApplicationService } from '../core/services/loanapplication.service';
import { LoanEligibilityCheckComponent } from './component/loan-eligibility-check/loan-eligibility-check.component';
import { ApplicationScoreCardComponent } from './component/application-score-card/application-score-card.component';
import { CreditRiskAttributeListComponent } from './component/credit-risk-attribute/credit-risk-attribute-list.component';
import { CreditRiskAttributeComponent } from './component/credit-risk-attribute/credit-risk-attribute.component';
import { CreditRiskCategoryListComponent } from './component/credit-risk-category/credit-risk-category-list.component';
import { CreditRiskCategoryComponent } from './component/credit-risk-category/credit-risk-category.component';
import { LoanApplicationListComponent } from './component/loan-application-list/loan-application-list.component';
import { LoanCreditBureauComponent } from './component/Loan-credit-bureau/Loan-credit-bureau.component';
import { CreditBureauSetupComponent } from './component/credit-bureau-setup/credit-bureau-setup.component';
import { CreditRiskRatingComponent } from './component/credit-risk-rating/credit-risk-rating.component';
import { CreditRiskRatingListComponent } from './component/credit-risk-rating/credit-risk-rating-list.component';
import { CreditWeightedRiskScoreComponent } from './component/credit-weighted-risk-score/credit-weighted-risk-score.component';
import { CreditWeightedriskScoreListComponent } from './component/credit-weighted-risk-score/credit-weightedrisk-score-list.component';
import { CreditAppraisalComponent } from './component/credit-appraisal/credit-appraisal.component';
import { ScheduleComponent } from './component/schedule/schedule.component';
import { OfferLetterListComponent } from './component/offerlettergeneration/offerletter-list.component';
import { LoanScheduleService } from '../core/services/loanschedule';
import { CreditAppraisalService } from '../core/services/credit-appraisal.service';
import { LoanCustomerDetailsComponent } from './component/loan-customer-details/loan-customer-details.component';
import { LoanApplicationDetailsComponent } from './component/loan-application-details/loan-application-details.component';
import { OfferLetterReviewComponent } from './component/offerlettergeneration/offerletterreview.component';
import { LoanBookingComponent } from './component/loan-booking/loan-booking.component';
import { LoanService } from '../core/services/loan.service';
import { LoanScheduleComponent } from './component/schedule/loan-schedule/loan-schedule.component';
import { LoanBooingApprovalComponent } from './component/loan-booing-approval/loan-booing-approval.component';
import { LoanApplicationScoreCardHistoryComponent } from './component/ifrs/loan-application-score-card-history/loan-application-score-card-history.component';
import { MacroEconomicVariableComponent } from './component/ifrs/macro-economic-variable/macro-economic-variable.component';
import { SetupDataComponent } from './component/ifrs/setup-data/setup-data.component';
import { SetupDataListComponent } from './component/ifrs/setup-data/setup-data-list.component';
import { MacroEconomicVariableListComponent } from './component/ifrs/macro-economic-variable/macro-economic-variable-list.component';
import { IfrsService } from '../core/services/ifrs.service';
import { ScoreCardHistoryComponent } from './component/ifrs/score-card-history/score-card-history.component';
import { LoanCustomerFsCaptionGroupComponent } from './component/loan-customer-fs/loan-customer-fs-caption-group/loan-customer-fs-caption-group.component';
import { LoanCustomerFsCaptionGroupListComponent } from './component/loan-customer-fs/loan-customer-fs-caption-group/loan-customer-fs-caption-group-list.component';
import { LoanCustomerFsRatioDetailComponent } from './component/loan-customer-fs/loan-customer-fs-ratio-detail/loan-customer-fs-ratio-detail.component';
import { LoanCustomerFsCaptionDetailComponent } from './component/loan-customer-fs/loan-customer-fs-caption-detail/loan-customer-fs-caption-detail.component';
import { LoanReviewOperationsListComponent } from './loan-management/loan-operations/loanreviewoperations-list.component';
import { CallMemoComponent } from './component/call-memo/call-memo.component';
import { CallMemoListComponent } from './component/call-memo/call-memo-list.component';
import { CollateralApprovalComponent } from './component/collateral/collateral-approval/collateral-approval.component';
import { CollateralCustomerListComponent } from './component/collateral/collateral-customer/collateral-customer-list.component';
import { CollateralCustomerComponent } from './component/collateral/collateral-customer/collateral-customer.component';
import { CollateralTypeComponent } from './component/collateral/collateral-type/collateral-type.component';
import { LoanCollateralComponent } from './component/collateral/loan-collateral/loan-collateral.component';
import { CollateralService } from '../core/services/collateral.service';
import { LmsApplicationComponent } from './component/credit-management/lms-application/lms-application.component';
import { LmsAppraisalComponent } from './component/credit-management/lms-appraisal/lms-appraisal.component';
import { LmsOfferLetterComponent } from './component/credit-management/lms-offer-letter/lms-offer-letter.component';
import { LmsService } from '../core/services/lms.service';
import { LmsApplicationDetailsComponent } from './component/credit-management/lms-application-details/lms-application-details.component';
import { LoanPrepaymentComponent } from './component/credit-management/loan-prepayment/loan-prepayment.component';
import { LoanOperationsApprovalComponent } from './loan-management/loan-operations-approval/loanoperations-approval.component';
import { LoanRestuctureComponent } from './component/schedule/loan-restucture/loan-restucture.component';
import { LoanLgdHistoryComponent } from './component/ifrs/loan-lgd-history/loan-lgd-history.component';
import { CustomerCollateralComponent } from './component/collateral/customer-collateral/customer-collateral.component';
import { CreditRiskRatingPDComponent } from './component/credit-risk-rating-pd/credit-risk-rating-pd.component';
import { CreditRiskRatingPDListComponent } from './component/credit-risk-rating-pd/credit-risk-rating-pd-list.component';
import { CreditClassificationListComponent } from './component/credit-classification/credit-classification-list/credit-classification-list.component';
import { CreditClassificationUpdateComponent } from './component/credit-classification/credit-classification-update/credit-classification-update.component';
import { LoanStagingListComponent } from './component/loan-staging/loan-staging-list/loan-staging-list.component';
import { LoanStagingUpdateComponent } from './component/loan-staging/loan-staging-update/loan-staging-update.component';
import { CollateralManagementComponent } from './component/collateral-management/collateral-management.component';
import { CustomerReportComponent } from './component/reports/customer-report/customer-report.component';
import { LoanReportComponent } from './component/reports/loan-report/loan-report.component';
import { SummaryReportComponent } from './component/reports/summary-report/summary-report.component';
import { ProductTypeSetupComponent } from './component/product-type-setup/product-type-setup.component';
import { ProductTypeListComponent } from './component/product-type-list/product-type-list.component';
import { CreditCustomerTransactionsComponent } from './component/credit-customer-transactions/credit-customer-transactions.component';
import { LoanApplicationsComponent } from './component/loan-applications/loan-applications.component';
import { PastDueLoansComponent } from './component/past-due-loans/past-due-loans.component';
import { PaymentDueLoansComponent } from './component/payment-due-loans/payment-due-loans.component';
import { RunImpairmentsComponent } from './component/run-impairments/run-impairments.component';
import { CustomerInfoComponent } from './component/customer/customer-info/customer-info.component';
import { DirectorInfoComponent } from './component/customer/director-info/director-info.component';
import { IdentityInfoComponent } from './component/customer/identity-info/identity-info.component';
import { NextofkinInfoComponent } from './component/customer/nextofkin-info/nextofkin-info.component';
import { BankInfoComponent } from './component/customer/bank-info/bank-info.component';
import { DocumentInfoComponent } from './component/customer/document-info/document-info.component';
import { ShareholderInfoComponent } from './component/customer/shareholder-info/shareholder-info.component';
import { CardInfoComponent } from './component/customer/card-info/card-info.component';
import { IdentityInfoListComponent } from './component/customer/identity-info-list/identity-info-list.component';
import { NextofkinInfoListComponent } from './component/customer/nextofkin-info-list/nextofkin-info-list.component';
import { DocumentInfoListComponent } from './component/customer/document-info-list/document-info-list.component';
import { BankInfoListComponent } from './component/customer/bank-info-list/bank-info-list.component';
import { DirectorInfoListComponent } from './component/customer/director-info-list/director-info-list.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    FeeComponent,
    FeeListComponent,
    ProductComponent,
    ProductListComponent,
    LoanCustomerComponent,
    LoanCustomerListComponent,
    CreditRiskScoreCardComponent,
    CreditRiskScoreCardListComponent,
    StartLoanApplicationComponent,
    StartLoanApplicationListComponent,
    LoanApplicationComponent,
    LoanEligibilityCheckComponent,
    ApplicationScoreCardComponent,
    CreditRiskAttributeListComponent,
    CreditRiskAttributeComponent,
    CreditRiskCategoryListComponent,
    CreditRiskCategoryComponent,
    LoanApplicationListComponent,
    LoanCreditBureauComponent,
    CreditBureauSetupComponent,
    CreditBureauSetupListComponent,
    CreditRiskRatingComponent,
    CreditRiskRatingListComponent,
    CreditWeightedRiskScoreComponent,
    CreditWeightedriskScoreListComponent,
    CreditAppraisalComponent,
    ScheduleComponent,
    OfferLetterListComponent,

    LoanCustomerDetailsComponent,
    LoanApplicationDetailsComponent,
    OfferLetterReviewComponent,
    LoanBookingComponent,
    LoanBooingApprovalComponent,
    LoanScheduleComponent,

    LoanApplicationScoreCardHistoryComponent,
    MacroEconomicVariableComponent,
    MacroEconomicVariableListComponent,
    SetupDataComponent,
    SetupDataListComponent,
    ScoreCardHistoryComponent,
    LoanLgdHistoryComponent,
    LoanCustomerFsCaptionGroupComponent,
    LoanCustomerFsCaptionGroupListComponent,
    // LoanCustomerFsCaptionDetailComponent,
    LoanCustomerFsCaptionDetailListComponent,
    LoanCustomerFsCaptionComponent,
    LoanCustomerFsCaptionListComponent,
    LoanCustomerFsRatioDetailComponent,
    LoanCustomerFsRatioDetailListComponent,
    LoanReviewOperationsListComponent,
    CallMemoComponent,
    CallMemoListComponent,
    CollateralApprovalComponent,
    CollateralCustomerListComponent,
    CollateralCustomerComponent,
    CollateralTypeListComponent,
    CollateralTypeComponent,
    CustomerCollateralComponent,
    LoanCollateralComponent,

    //Loan Management
    LmsApplicationComponent,
    LmsAppraisalComponent,
    LmsOfferLetterComponent,
    LmsApplicationDetailsComponent,
    LoanPrepaymentComponent,
    LoanOperationsApprovalComponent,
    LoanRestuctureComponent,
    CreditRiskRatingPDComponent,
    CreditRiskRatingPDListComponent,
    CreditClassificationListComponent,
    CreditClassificationUpdateComponent,
    LoanStagingListComponent,
    LoanStagingUpdateComponent,
    CollateralManagementComponent,
    CustomerReportComponent,
    LoanReportComponent,
    SummaryReportComponent,
    ProductTypeSetupComponent,
    ProductTypeListComponent,
    CreditCustomerTransactionsComponent,
    LoanApplicationsComponent,
    PastDueLoansComponent,
    PaymentDueLoansComponent,
    RunImpairmentsComponent,
    CustomerInfoComponent,
    DirectorInfoComponent,
    IdentityInfoComponent,
    NextofkinInfoComponent,
    BankInfoComponent,
    DocumentInfoComponent,
    ShareholderInfoComponent,
    CardInfoComponent,
    IdentityInfoListComponent,
    NextofkinInfoListComponent,
    DocumentInfoListComponent,
    BankInfoListComponent,
    DirectorInfoListComponent,
  ],
  providers: [
    FeeService,
    ProductService,
    LoanCustomerService,
    CreditRiskScoreCardService,
    LoanApplicationService,
    LoanScheduleService,
    CreditAppraisalService,
    LoanService,
    IfrsService,
    CustomerFsService,
    CollateralService,
    LmsService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreditModule {}
