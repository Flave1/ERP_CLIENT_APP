import { WorkflowActivationComponent } from './setup/components/workflow/workflow-activation/workflow-activation.component';
import { DocumentTypeComponent } from './setup/components/document-type/document-type.component';
import { ProductTypeComponent } from './setup/components/product-type/product-type.component';
import { WorkflowStaffListComponent } from './setup/components/workflow/workflow-staff/workflow-staff-list.component';
import { WorkflowLevelListComponent } from './setup/components/workflow/workflow-level/workflow-level-list.component';
import { JobTitleListComponent } from './setup/components/job-title/job-title-list.component';
import { LoanLgdHistoryComponent } from './credit/component/ifrs/loan-lgd-history/loan-lgd-history.component';
import { LoanCollateralComponent } from './credit/component/collateral/loan-collateral/loan-collateral.component';
import { LoanCustomerFsRatioDetailListComponent } from './credit/component/loan-customer-fs/loan-customer-fs-ratio-detail/loan-customer-fs-ratio-detail-list.component';
import { LoanCustomerFsRatioDetailComponent } from './credit/component/loan-customer-fs/loan-customer-fs-ratio-detail/loan-customer-fs-ratio-detail.component';
import { LoanCustomerFsCaptionDetailListComponent } from './credit/component/loan-customer-fs/loan-customer-fs-caption-detail/loan-customer-fs-caption-detail-list.component';
import { LoanCustomerFsCaptionDetailComponent } from './credit/component/loan-customer-fs/loan-customer-fs-caption-detail/loan-customer-fs-caption-detail.component';
import { LoanCustomerFsCaptionListComponent } from './credit/component/loan-customer-fs/loan-customer-fs-caption/loan-customer-fs-caption-list.component';
import { LoanCustomerFsCaptionComponent } from './credit/component/loan-customer-fs/loan-customer-fs-caption/loan-customer-fs-caption.component';
import { LoanCustomerFsCaptionGroupListComponent } from './credit/component/loan-customer-fs/loan-customer-fs-caption-group/loan-customer-fs-caption-group-list.component';
import { LoanApplicationScoreCardHistoryComponent } from './credit/component/ifrs/loan-application-score-card-history/loan-application-score-card-history.component';
import { MacroEconomicVariableComponent } from './credit/component/ifrs/macro-economic-variable/macro-economic-variable.component';
import { LoanBookingComponent } from './credit/component/loan-booking/loan-booking.component';
import { CreditWeightedriskScoreListComponent } from './credit/component/credit-weighted-risk-score/credit-weightedrisk-score-list.component';
import { CreditWeightedRiskScoreComponent } from './credit/component/credit-weighted-risk-score/credit-weighted-risk-score.component';
import { CreditRiskRatingListComponent } from './credit/component/credit-risk-rating/credit-risk-rating-list.component';
import { CreditRiskRatingComponent } from './credit/component/credit-risk-rating/credit-risk-rating.component';

import { CreditRiskAttributeListComponent } from './credit/component/credit-risk-attribute/credit-risk-attribute-list.component';
import { CreditRiskCategoryListComponent } from './credit/component/credit-risk-category/credit-risk-category-list.component';
import { PurchaseRequisitionListComponent } from './purchase/purchase-requisition-list/purchase-requisition-list.component';
import { SupplierApprovalComponent } from './purchases-and-payables/components/supplier/supplier-approval/supplier-approval.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthLayoutComponent } from './shared/layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layout/main-layout.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './core/services/auth.guard';
import { UserAccountComponent } from './admin/components/user-account/user-account.component';
import { UserAccountListComponent } from './admin/components/user-account/user-account-list.component';
import { StaffInfoListComponent } from './admin/components/staff-info/staff-info-list.component';
import { StaffInfoComponent } from './admin/components/staff-info/staff-info.component';
import { CountryListComponent } from './setup/components/country/country-list.component';
import { CountryComponent } from './setup/components/country/country.component';
import { StateComponent } from './setup/components/state/state.component';
import { StateListComponent } from './setup/components/state/state-list.component';
import { CityComponent } from './setup/components/city/city.component';
import { CityListComponent } from './setup/components/city/city-list.component';
import { CurrencyComponent } from './setup/components/currency/currency.component';
import { CurrencyListComponent } from './setup/components/currency/currency-list.component';
import { CurrencyRateComponent } from './setup/components/currencyrate/currencyrate.component';
import { CurrencyRateListComponent } from './setup/components/currencyrate/currencyrate-list.component';
import { BranchListComponent } from './setup/components/branch/branch-list.component';
import { BranchComponent } from './setup/components/branch/branch.component';
import { CompanyListComponent } from './setup/components/company/company-list.component';
import { CompanyComponent } from './setup/components/company/company.component';
import { DepartmentComponent } from './setup/components/department/department.component';
import { DepartmentListComponent } from './setup/components/department/department-list.component';
import { ApprovalGroupComponent } from './setup/components/approvalgroup/approvalgroup.component';
import { ApprovalGroupListComponent } from './setup/components/approvalgroup/approvalgroup-list.component';
import { ApprovalLevelComponent } from './setup/components/approvallevel/approvallevel.component';
import { ApprovalLevelListComponent } from './setup/components/approvallevel/approvallevel-list.component';
import { ApprovalLevelStaffComponent } from './setup/components/approvallevelstaff/approvallevelstaff.component';
import { ApprovalLevelStaffListComponent } from './setup/components/approvallevelstaff/approvallevelstaff-list.component';
import { SupplierRegistrationComponent } from './purchases-and-payables/components/supplier/supplier-registration/supplier-registration.component';
import { SupplierListComponent } from './purchases-and-payables/components/supplier/supplier-registration/supplier-list.component';
import { ApprovalgroupmappingComponent } from './setup/components/approvalgroupmapping/approvalgroupmapping.component';
import { CustomerRegistrationComponent } from './core/components/customer-registration/customer-registration.component';
import { CustomerListComponent } from './core/components/customer-registration/customer-list.component';
import { CustomerApprovalComponent } from './core/components/customer-approval/customer-approval.component';
import { UserroleComponent } from './admin/components/userrole/userrole.component';
import { UserroleActivityComponent } from './admin/components/userrole/userrole.activity.component';
import { PurchaseEntryComponent } from './purchase/purchase-entry/purchase-entry.component';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';
import { PuchaseRequisitionEntryComponent } from './purchase/puchase-requisition-entry/puchase-requisition-entry.component';
import { GLListComponent } from './finance/component/gl/gl-list.component';
import { GLComponent } from './finance/component/gl/gl.component';
import { SubGLListComponent } from './finance/component/subgl/subgl-list.component';
import { SubGLComponent } from './finance/component/subgl/subgl.component';
import { RegistryComponent } from './finance/component/registry/registry.component';
import { RegistryListComponent } from './finance/component/registry/registry-list.component';
import { GLMappingListComponent } from './finance/component/glmapping/glmapping-list.component';
import { AccountTypeComponent } from './finance/component/accounttype/accounttype.component';
import { AccountTypeListComponent } from './finance/component/accounttype/accounttype-list.component';
import { RegistryTemplateListComponent } from './finance/component/registrytemplate/registrytemplate-list.component';
import { TrialBalanceComponent } from './finance/component/trialbalance/trialbalance.component';
import { TrialBalanceListComponent } from './finance/component/trialbalance/trialbalance-list.component';
import { GLRemapListComponent } from './finance/component/glmapping/glremap-list.component';
import { FeeComponent } from './credit/component/fee/fee.component';
import { FeeListComponent } from './credit/component/fee/fee-list.component';
import { ProductComponent } from './credit/component/product/product.component';
import { ProductListComponent } from './credit/component/product/product-list.component';
import { IdentificationComponent } from './setup/components/identification/identification.component';
import { IdentificationListComponent } from './setup/components/identification/identification-list.component';
import { LoanCustomerComponent } from './credit/component/loancustomer/loancustomer.component';
import { LoanCustomerListComponent } from './credit/component/loancustomer/loancustomer-list.component';
import { CreditRiskScoreCardComponent } from './credit/component/creditriskscorecard/creditriskscorecard.component';
import { CreditRiskScoreCardListComponent } from './credit/component/creditriskscorecard/creditriskscorecard-list.component';
import { StartLoanApplicationComponent } from './credit/component/startloanapplication/startloanapplication.component';
import { StartLoanApplicationListComponent } from './credit/component/startloanapplication/startloanapplication-list.component';
import { LoanApplicationComponent } from './credit/component/startloanapplication/loanapplication.component';
// import { CreditRiskCategoryComponent } from "./credit/component/credit-risk-category/credit-risk-category.component";
// import { CreditRiskAttributeComponent } from "./credit/component/credit-risk-attribute/credit-risk-attribute.component";
// import { LoanApplicationListComponent } from "./credit/component/loan-application-list/loan-application-list.component";
import { LoanEligibilityCheckComponent } from './credit/component/loan-eligibility-check/loan-eligibility-check.component';
import { LoanApplicationListComponent } from './credit/component/loan-application-list/loan-application-list.component';
import { CreditRiskAttributeComponent } from './credit/component/credit-risk-attribute/credit-risk-attribute.component';
import { CreditRiskCategoryComponent } from './credit/component/credit-risk-category/credit-risk-category.component';
import { CreditBureauSetupListComponent } from './credit/component/credit-bureau-setup/credit-bureau-setup-list.component';
import { CreditBureauSetupComponent } from './credit/component/credit-bureau-setup/credit-bureau-setup.component';
import { CreditAppraisalComponent } from './credit/component/credit-appraisal/credit-appraisal.component';
import { OfferLetterListComponent } from './credit/component/offerlettergeneration/offerletter-list.component';
import { ScheduleComponent } from './credit/component/schedule/schedule.component';
import { OfferLetterReviewComponent } from './credit/component/offerlettergeneration/offerletterreview.component';
import { LoanBooingApprovalComponent } from './credit/component/loan-booing-approval/loan-booing-approval.component';
import { SetupDataComponent } from './credit/component/ifrs/setup-data/setup-data.component';
import { SetupDataListComponent } from './credit/component/ifrs/setup-data/setup-data-list.component';
import { MacroEconomicVariableListComponent } from './credit/component/ifrs/macro-economic-variable/macro-economic-variable-list.component';
import { LoanCustomerFsCaptionGroupComponent } from './credit/component/loan-customer-fs/loan-customer-fs-caption-group/loan-customer-fs-caption-group.component';
import { CustomerAccountInfoListComponent } from './casa/components/customeraccount/customeraccount-info-list.component';
import { CustomerAccountInfoComponent } from './casa/components/customeraccount/customeraccount-info.component';
import { CustomerAccountApprovalComponent } from './casa/components/customeraccount-approval/customeraccount-approval.component';
import { LoanReviewOperationsListComponent } from './credit/loan-management/loan-operations/loanreviewoperations-list.component';
import { CallMemoListComponent } from './credit/component/call-memo/call-memo-list.component';
import { CollateralApprovalComponent } from './credit/component/collateral/collateral-approval/collateral-approval.component';
import { CollateralCustomerListComponent } from './credit/component/collateral/collateral-customer/collateral-customer-list.component';
import { CollateralCustomerComponent } from './credit/component/collateral/collateral-customer/collateral-customer.component';
import { CollateralTypeListComponent } from './credit/component/collateral/collateral-type/collateral-type-list.component';
import { CollateralTypeComponent } from './credit/component/collateral/collateral-type/collateral-type.component';
import { LmsApplicationComponent } from './credit/component/credit-management/lms-application/lms-application.component';
import { LmsAppraisalComponent } from './credit/component/credit-management/lms-appraisal/lms-appraisal.component';
import { LmsOfferLetterComponent } from './credit/component/credit-management/lms-offer-letter/lms-offer-letter.component';
import { LoanPrepaymentComponent } from './credit/component/credit-management/loan-prepayment/loan-prepayment.component';
import { LoanOperationsApprovalComponent } from './credit/loan-management/loan-operations-approval/loanoperations-approval.component';
import { EndOfDayComponent } from './setup/components/end-of-day/end-of-day.component';
import { StatementTypeListComponent } from './finance/component/statementtype/statementtype-list.component';
import { StatementTypeComponent } from './finance/component/statementtype/statementtype.component';
import { RegistryTemplateComponent } from './finance/component/registrytemplate/registrytemplate.component';
import { CompanySetupComponent } from './admin/components/company-setup/company-setup.component';
import { CompanyStructureComponent } from './admin/components/company-structure/company-structure.component';
import { CompanyStructureListComponent } from './admin/components/company-structure/company-structure-list.component';
// tslint:disable-next-line:max-line-length
import { CompanyStructureDefinitionComponent } from './admin/components/company-structure-definition/company-structure-definition.component';
import { CompanyStructureDefinitionListComponent } from './admin/components/company-structure-definition/company-structure-definition-list.component';
import { JobTitleComponent } from './setup/components/job-title/job-title.component';
import { WorkflowGroupListComponent } from './setup/components/workflow/workflow-group/workflow-group-list.component';
import { WorkflowGroupComponent } from './setup/components/workflow/workflow-group/workflow-group.component';
import { WorkflowLevelComponent } from './setup/components/workflow/workflow-level/workflow-level.component';
import { WorkflowStaffComponent } from './setup/components/workflow/workflow-staff/workflow-staff.component';
import { WorkflowMappingListComponent } from './setup/components/workflow/workflow-mapping/workflow-mapping-list.component';
import { WorkFlowMappingComponent } from './setup/components/workflow/workflow-mapping/work-flow-mapping.component';
import { GLTransactionListComponent } from './finance/component/gltransaction/gltransaction-list.component';
import { GLTransactionComponent } from './finance/component/gltransaction/gltransaction.component';
import { CreditRiskRatingPDComponent } from './credit/component/credit-risk-rating-pd/credit-risk-rating-pd.component';
import { CreditRiskRatingPDListComponent } from './credit/component/credit-risk-rating-pd/credit-risk-rating-pd-list.component';
import { ExposureListComponent } from './setup/components/exposure/exposure-list.component';
import { CustomertransactionListComponent } from './casa/components/customertransaction/customertransaction-list.component';
import { AccounttypeListComponent } from './deposit/components/accounttype-list/accounttype-list.component';
import { AccounttypeComponent } from './deposit/components/accounttype-list/accounttype.component';
import { CategoryListComponent } from './deposit/components/category-list/category-list.component';
import { CategoryComponent } from './deposit/components/category-list/category.component';
import { BusinesscategoryListComponent } from './deposit/components/businesscategory-list/businesscategory-list.component';
import { BusinesscategoryComponent } from './deposit/components/businesscategory-list/businesscategory.component';
import { TransactionchargeListComponent } from './deposit/components/transactioncharge-list/transactioncharge-list.component';
import { TransactionchargeComponent } from './deposit/components/transactioncharge-list/transactioncharge.component';
import { TransactiontaxListComponent } from './deposit/components/transactiontax-list/transactiontax-list.component';
import { TransactiontaxComponent } from './deposit/components/transactiontax-list/transactiontax.component';
import { AccountsetupListComponent } from './deposit/components/accountsetup-list/accountsetup-list.component';
import { AccountsetupComponent } from './deposit/components/accountsetup-list/accountsetup.component';
import { AccountopeningListComponent } from './deposit/components/accountopening-list/accountopening-list.component';
import { AccountopeningComponent } from './deposit/components/accountopening-list/accountopening.component';
import { AccountopeningSignatoriesComponent } from './deposit/components/accountopening-list/accountopening-signatories.component';
import { AccountopeningDirectorsComponent } from './deposit/components/accountopening-list/accountopening-directors.component';
import { CreditClassificationListComponent } from './credit/component/credit-classification/credit-classification-list/credit-classification-list.component';
import { CreditClassificationUpdateComponent } from './credit/component/credit-classification/credit-classification-update/credit-classification-update.component';
import { LoanStagingListComponent } from './credit/component/loan-staging/loan-staging-list/loan-staging-list.component';
import { LoanStagingUpdateComponent } from './credit/component/loan-staging/loan-staging-update/loan-staging-update.component';
import { CollateralManagementComponent } from './credit/component/collateral-management/collateral-management.component';
import { DepositformComponent } from './deposit/components/depositform-list/depositform.component';
import { DepositformListComponent } from './deposit/components/depositform-list/depositform-list.component';
import { ChangeOfRateComponent } from './deposit/components/change-of-rate/change-of-rate.component';
import { ChangeOfRateListComponent } from './deposit/components/change-of-rate-list/change-of-rate-list.component';
import { ChangeOfRateFormListComponent } from './deposit/components/change-of-rate-form-list/change-of-rate-form-list.component';
import { ChangeOfRateFormComponent } from './deposit/components/change-of-rate-form/change-of-rate-form.component';
// tslint:disable-next-line:max-line-length
import { ClosureOfBankAccountFormComponent } from './deposit/components/closure-of-bank-account-form/closure-of-bank-account-form.component';
import { AccountReactivationComponent } from './deposit/components/account-reactivation/account-reactivation.component';
import { WithdrawalFormComponent } from './deposit/components/withdrawal-form/withdrawal-form.component';
import { TransferFormComponent } from './deposit/components/transfer-form/transfer-form.component';
import { CashierTellerBalancingTransactionComponent } from './deposit/components/cashier-teller-balancing-transaction/cashier-teller-balancing-transaction.component';
import { TransactionCorrectionComponent } from './deposit/components/transaction-correction/transaction-correction.component';
import { FinancialYearComponent } from './finance/component/financial-year/financial-year.component';
import { FinancialYearSetupComponent } from './finance/component/financial-year-setup/financial-year-setup.component';
import { JournalsComponent } from './finance/component/journal/journals/journals.component';
import { JournalFormComponent } from './finance/component/journal/journal-form/journal-form.component';
import { CurrencySetupComponent } from './finance/component/currency-setup/currency-setup.component';
import { CurrencySetupListComponent } from './finance/component/currency-setup-list/currency-setup-list.component';
import { ExchangeRateManagementComponent } from './finance/component/exchange-rate-management/exchange-rate-management.component';
import { CompanySetupListComponent } from './admin/components/company-setup-list/company-setup-list.component';
import { InvestorProductListsComponent } from './investor/components/investor-product-lists/investor-product-lists.component';
import { InvestorProductComponent } from './investor/components/investor-product/investor-product.component';
import { InvestorProductSetUpComponent } from './investor/components/investor-product-set-up/investor-product-set-up.component';
import { InvestorCustomerComponent } from './investor/components/investor-customer/investor-customer.component';
import { InvestorCustomerListComponent } from './investor/components/investor-customer-list/investor-customer-list.component';
import { InvestorListComponent } from './investor/components/investor-list/investor-list.component';
import { InvestorListInfoComponent } from './investor/components/investor-list-info/investor-list-info.component';
import { ProductTypeListComponent } from './credit/component/product-type-list/product-type-list.component';
import { CollectionComponent } from './investor/components/collection/collection.component';
import { LiquidateComponent } from './investor/components/liquidate/liquidate.component';
import { RolloverComponent } from './investor/components/rollover/rollover.component';
import { InvestmentslistsComponent } from './investor/components/investmentslists/investmentslists.component';
import { InvestmentAppraisalComponent } from './investor/components/investment-appraisal/investment-appraisal.component';
import { CollectionAppraisalComponent } from './investor/components/collection-appraisal/collection-appraisal.component';
import { LiquidationAppraisalComponent } from './investor/components/liquidation-appraisal/liquidation-appraisal.component';
import { PlacementCertificateListComponent } from './investor/components/placement-certificate-list/placement-certificate-list.component';
import { TreasuryProductTypeListComponent } from './treasury/components/treasury-product-type-list/treasury-product-type-list.component';
import { TreasuryProductSetupComponent } from './treasury/components/treasury-product-setup/treasury-product-setup.component';
import { TreasuryProductListComponent } from './treasury/components/treasury-product-list/treasury-product-list.component';
import { TreasuryProductComponent } from './treasury/components/treasury-product/treasury-product.component';
import { IssuerInfoComponent } from './treasury/components/issuer-info/issuer-info.component';
import { IssuerListComponent } from './treasury/components/issuer-list/issuer-list.component';
import { OperatingAccountComponent } from './credit/operatingAccount/operatingAccount.component';
import { TreasuryPlacementListComponent } from './treasury/components/treasury-placement-list/treasury-placement-list.component';
import { TreasuryPlacementComponent } from './treasury/components/treasury-placement/treasury-placement.component';
import { TreasuryCollectionComponent } from './treasury/components/treasury-collection/treasury-collection.component';
import { TreasuryLiquidationComponent } from './treasury/components/treasury-liquidation/treasury-liquidation.component';
import { InvestorDashboardComponent } from './investor/components/investor-dashboard/investor-dashboard.component';
import { TreasuryInvestmentAppraisalComponent } from './treasury/components/treasury-investment-appraisal/treasury-investment-appraisal.component';
import { FsReportComponent } from './finance/component/fs-report/fs-report.component';
import { PlReportComponent } from './finance/component/pl-report/pl-report.component';
import { SoceReportComponent } from './finance/component/soce-report/soce-report.component';
import { TreasuryCollectionAppraisalComponent } from './treasury/components/treasury-collection-appraisal/treasury-collection-appraisal.component';
import { TreasuryLiquidationAppraisalComponent } from './treasury/components/treasury-liquidation-appraisal/treasury-liquidation-appraisal.component';
import { CustomerReportComponent } from './credit/component/reports/customer-report/customer-report.component';
import { LoanReportComponent } from './credit/component/reports/loan-report/loan-report.component';
import { SummaryReportComponent } from './credit/component/reports/summary-report/summary-report.component';
import { InvestorReportComponent } from './investor/components/reports/investor-report/investor-report.component';
import { ProductTypeSetupComponent } from './credit/component/product-type-setup/product-type-setup.component';
// tslint:disable-next-line:max-line-length
import { CreditCustomerTransactionsComponent } from './credit/component/credit-customer-transactions/credit-customer-transactions.component';
import { InvestmentReportComponent } from './investor/components/reports/investment-report/investment-report.component';
import { EmailconfigComponent } from './setup/components/emailconfig/emailconfig.component';
import { EmailconfigListComponent } from './setup/components/emailconfig-list/emailconfig-list.component';
import { LmsApplicationManageComponent } from './credit/component/credit-management/lms-application/lms-application-manage.component';
import { ScenaroSetupComponent } from './credit/component/ifrs/scenaro-setup/scenaro-setup.component';
import { ScenaroSetupListComponent } from './credit/component/ifrs/scenaro-setup/scenaro-setup-list.component';
import { InvestmentProductTypeListComponent } from './investor/components/investment-product-type-list/investment-product-type-list.component';
import { LoanApplicationsComponent } from './credit/component/loan-applications/loan-applications.component';
import { NotificationComponent } from './core/components/notification/notification.component';
import { NotificationsComponent } from './core/components/notifications/notifications.component';
import { PendingInvestmentsComponent } from './investor/components/pending-investments/pending-investments.component';
import { PendingLiquidationComponent } from './investor/components/pending-liquidation/pending-liquidation.component';
import { PendingCollectionComponent } from './investor/components/pending-collection/pending-collection.component';
import { PaymentDueLoansComponent } from './credit/component/payment-due-loans/payment-due-loans.component';
import { PastDueLoansComponent } from './credit/component/past-due-loans/past-due-loans.component';
import { RunImpairmentsComponent } from './credit/component/run-impairments/run-impairments.component';
import { VariablesComponent } from './finance/component/variables/variables.component';
import { TranslationListComponent } from './finance/component/translation-list/translation-list.component';
import { TranslationComponent } from './finance/component/translation/translation.component';
import { CertificateListComponent } from './treasury/components/certificate-list/certificate-list.component';
import { WithdrawalSetupListComponent } from './deposit/components/withdrawal-setup-list/withdrawal-setup-list.component';
import { WithdrawalSetupComponent } from './deposit/components/withdrawal-setup/withdrawal-setup.component';
import { BankClosureSetupListComponent } from './deposit/components/bank-closure-setup-list/bank-closure-setup-list.component';
import { BankClosureSetupComponent } from './deposit/components/bank-closure-setup/bank-closure-setup.component';
import { AccountActivationSetupListComponent } from './deposit/components/account-activation-setup-list/account-activation-setup-list.component';
import { AccountActivationSetupComponent } from './deposit/components/account-activation-setup/account-activation-setup.component';
import { TransferSetupListComponent } from './deposit/components/transfer-setup-list/transfer-setup-list.component';
import { TransferSetupComponent } from './deposit/components/transfer-setup/transfer-setup.component';
import { CalloverSetupListComponent } from './deposit/components/callover-setup-list/callover-setup-list.component';
import { CalloverSetupComponent } from './deposit/components/callover-setup/callover-setup.component';
import { JournalApprovalComponent } from './finance/component/journal/Journal-approval/Journal-approval.component';
import { CashierTellerBalancingComponent } from './deposit/components/cashier-teller-balancing/cashier-teller-balancing.component';
import { TillVaultSetupListComponent } from './deposit/components/till-vault-setup-list/till-vault-setup-list.component';
import { TillVaultSetupComponent } from './deposit/components/till-vault-setup/till-vault-setup.component';
import { TillAndVaultListComponent } from './deposit/components/till-and-vault-list/till-and-vault-list.component';
import { TillAndVaultComponent } from './deposit/components/till-and-vault/till-and-vault.component';
import { TransactionCorrectionListComponent } from './deposit/components/transaction-correction-list/transaction-correction-list.component';
import { TaxSetupComponent } from './purchases-and-payables/components/setup/tax-setup/tax-setup.component';
import { ServiceTermsComponent } from './purchases-and-payables/components/setup/service-terms/service-terms.component';
import { SupplierTypeComponent } from './purchases-and-payables/components/setup/supplier-type/supplier-type.component';
import { TaxSetupListComponent } from './purchases-and-payables/components/setup/tax-setup-list/tax-setup-list.component';
import { ServiceTermsListComponent } from './purchases-and-payables/components/setup/service-terms-list/service-terms-list.component';
import { SupplierTypeListComponent } from './purchases-and-payables/components/setup/supplier-type-list/supplier-type-list.component';
import { AssetClassificationListComponent } from './ppe/components/setup/asset-classification-list/asset-classification-list.component';
import { AssetClassificationComponent } from './ppe/components/setup/asset-classification/asset-classification.component';
import { AdditionComponent } from './ppe/components/addition/addition.component';
import { AdditionListComponent } from './ppe/components/addition-list/addition-list.component';
import { SupplierApprovalDetailsComponent } from './purchases-and-payables/components/supplier-approval-details/supplier-approval-details.component';
import { PrnApprovalsComponent } from './purchases-and-payables/prn-approvals/prn-approvals.component';
import { BidsComponent } from './purchases-and-payables/components/bids/bids.component';
import { BidApprovalsComponent } from './purchases-and-payables/components/bid-approvals/bid-approvals.component';
import { LpoListComponent } from './purchases-and-payables/components/lpo-list/lpo-list.component';
import { LpoApprovalComponent } from './purchases-and-payables/components/lpo-approval/lpo-approval.component';
import { AdditionApprovalsComponent } from './ppe/components/addition-approvals/addition-approvals.component';
import { InvoiceListComponent } from './purchases-and-payables/components/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './purchases-and-payables/components/invoice-detail/invoice-detail.component';
import { RegisterListComponent } from './ppe/components/register-list/register-list.component';
import { RegisterComponent } from './ppe/components/register/register.component';
import { ReassessmentListComponent } from './ppe/components/reassessment-list/reassessment-list.component';
import { ReassessmentComponent } from './ppe/components/reassessment/reassessment.component';
import { BankglListComponent } from './finance/component/bankgl-list/bankgl-list.component';
import { BankglComponent } from './finance/component/bankgl/bankgl.component';
import { ReassessResidualValueComponent } from './ppe/components/reassess-residual-value/reassess-residual-value.component';
import { ReassessApprovalsComponent } from './ppe/components/reassess-approvals/reassess-approvals.component';
import { DisposalListComponent } from './ppe/components/disposal-list/disposal-list.component';
import { DisposalComponent } from './ppe/components/disposal/disposal.component';
import { PaymentListsComponent } from './purchases-and-payables/components/payment-lists/payment-lists.component';
import { DisposalApprovalComponent } from './ppe/components/disposal-approval/disposal-approval.component';
import { ExcelReportComponent } from './finance/component/excel-report/excel-report.component';
import { PendingSuppliersComponent } from './purchases-and-payables/components/pending-suppliers/pending-suppliers.component';
import { BidComponent } from './purchases-and-payables/components/bid/bid.component';
import { BidTenderComponent } from './purchases-and-payables/components/bid-tender/bid-tender.component';
import { LpoComponent } from './purchases-and-payables/components/lpo/lpo.component';
import { BankSetupListComponent } from './finance/component/bank-setup-list/bank-setup-list.component';
import { BankSetupComponent } from './finance/component/bank-setup/bank-setup.component';
import { ReevaluateCostComponent } from './ppe/components/reevaluate-cost/reevaluate-cost.component';
import { ReevaluationListComponent } from './ppe/components/reevaluation-list/reevaluation-list.component';
import { AuthenticationSetupComponent } from './setup/components/authentication-setup/authentication-setup.component';
import { AuthenticationSetupListComponent } from './setup/components/authentication-setup-list/authentication-setup-list.component';
import { SolutionsSetupComponent } from './setup/components/solutions-setup/solutions-setup.component';
import { ReevaluationApprovalsComponent } from './ppe/components/reevaluation-approvals/reevaluation-approvals.component';
import { ActiveDirectoryComponent } from './admin/components/active-directory/active-directory.component';
import { SecuritySettingsComponent } from './admin/components/security-settings/security-settings.component';
import { SecurityQuestionsComponent } from './admin/components/security-questions/security-questions.component';
import { SecurityQuestioListComponent } from './admin/components/security-questio-list/security-questio-list.component';
import { SecuritySettingComponent } from './admin/components/security-setting/security-setting.component';
import { FlutterTransferListComponent } from './finance/component/flutterwave/flutter-transfer-list/flutter-transfer-list.component';
import { FluterwaveKeyComponent } from './finance/component/fluterwave-key/fluterwave-key.component';
import { FluterwaveKeyListComponent } from './finance/component/fluterwave-key-list/fluterwave-key-list.component';
import { AgingAnalysisComponent } from './purchases-and-payables/components/reports/aging-analysis/aging-analysis.component';
import { PurchaseDashboardComponent } from './purchases-and-payables/components/purchase-dashboard/purchase-dashboard.component';
import { PendingRolloverComponent } from './investor/components/pending-rollover/pending-rollover.component';
import { PendingTopupComponent } from './investor/components/pending-topup/pending-topup.component';
import { OtpConfirmationComponent } from './auth/otp-confirmation/otp-confirmation.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { EodSetupComponent } from './finance/component/eod-setup/eod-setup.component';
import { PurchaseReportComponent } from './purchases-and-payables/components/reports/purchase-report/purchase-report.component';
import { SecurityQuestionComponent } from './auth/security-question/security-question.component';
import { TransactionCorrectionSetupListComponent } from './deposit/components/transaction-correction-setup-list/transaction-correction-setup-list.component';
import { TransactionCorrectionSetupComponent } from './deposit/components/transaction-correction-setup/transaction-correction-setup.component';
import { ClosureOfBankAccountApprovalComponent } from './deposit/components/closure-of-bank-account-form/closure-of-bank-account-approval.component';
import { ChangeOfRatesApprovalComponent } from './deposit/components/change-of-rate-form/change-of-rates-approval.component';
import { CustomerWithdrawalComponent } from './deposit/components/customer-withdrawal/customer-withdrawal.component';
import { CustomerDepositComponent } from './deposit/components/customer-deposit/customer-deposit.component';
import { CustomerDepositsComponent } from './deposit/components/customer-deposits/customer-deposits.component';
import { AccountReactivationListComponent } from './deposit/components/account-reactivation-list/account-reactivation-list.component';
import { AccountReactivationAppraisalsComponent } from './deposit/components/account-reactivation-appraisals/account-reactivation-appraisals.component';
import { ClassificationComponent } from './expense-management/components/set-up/classification/classification.component';
import { OutOfStationComponent } from './expense-management/components/set-up/out-of-station/out-of-station.component';
import { CostCentreComponent } from './expense-management/components/set-up/cost-centre/cost-centre.component';
import { ClassificationListComponent } from './expense-management/components/set-up/classification-list/classification-list.component';
import { OutOfStationListComponent } from './expense-management/components/set-up/out-of-station-list/out-of-station-list.component';
import { CostCentreListComponent } from './expense-management/components/set-up/cost-centre-list/cost-centre-list.component';
import { AdminReqListComponent } from './expense-management/components/admin/admin-req-list/admin-req-list.component';
import { AdminReqComponent } from './expense-management/components/admin/admin-req/admin-req.component';
import { ErnApprovalComponent } from './expense-management/components/admin/ern-approval/ern-approval.component';
import { ErnApprovalListComponent } from './expense-management/components/admin/ern-approval-list/ern-approval-list.component';
import { ApprovedErnComponent } from './expense-management/components/admin/approved-ern/approved-ern.component';
import { ErnPaymentProposalComponent } from './expense-management/components/admin/ern-payment-proposal/ern-payment-proposal.component';
import { ErnPaymentApprovalComponent } from './expense-management/components/admin/ern-payment-approval/ern-payment-approval.component';
import { RetirementListComponent } from './expense-management/components/admin/retirement-list/retirement-list.component';
import { RetirementComponent } from './expense-management/components/admin/retirement/retirement.component';
import { ClaimsComponent } from './expense-management/components/admin/claims/claims.component';
import { ClaimComponent } from './expense-management/components/admin/claim/claim.component';
import { ClaimApprovalsComponent } from './expense-management/components/admin/claim-approvals/claim-approvals.component';
import { ReqClaimsComponent } from './expense-management/components/admin/req-claims/req-claims.component';
import { EssRetirementComponent } from './expense-management/components/ess/ess-retirement/ess-retirement.component';
import { CollectionsComponent } from './expense-management/components/admin/collections/collections.component';
import { EssRetirementsComponent } from './expense-management/components/ess/ess-retirements/ess-retirements.component';
import { EssApprovedErnComponent } from './expense-management/components/ess/ess-approved-ern/ess-approved-ern.component';
import { EssRequisitionComponent } from './expense-management/components/ess/ess-requisition/ess-requisition.component';
import { EssRequisitionsComponent } from './expense-management/components/ess/ess-requisitions/ess-requisitions.component';
import { RequestsComponent } from './expense-management/components/ess/requests/requests.component';
import { PaymentsComponent } from './investor/components/payments/payments.component';
import { CustomerTransactionComponent } from './investor/components/customer-transaction/customer-transaction.component';
import { MainDashboardComponent } from './core/components/main-dashboard/main-dashboard.component';
import { MainDashboardPageComponent } from './core/components/main-dashboard-page/main-dashboard-page.component';
// import { ReqClaimsComponent } from './expense-management/components/admin/req-claims/req-claims.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'GOS ERP | Login',
        },
      },
      {
        path: 'otp',
        component: OtpConfirmationComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'change/password',
        component: ResetPasswordComponent,
      },
      {
        path: 'security-question',
        component: SecurityQuestionComponent,
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '',
        component: MainDashboardComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'home',
            component: MainDashboardPageComponent,
          },
          {
            path: 'credit',
            component: DashboardComponent,
          },
          {
            path: 'investor',
            component: InvestorDashboardComponent,
          },
          {
            path: 'purchases',
            component: PurchaseDashboardComponent,
          },
        ],
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'notification',
        component: NotificationComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  // {
  //     path: "admin",
  //     loadChildren: "./admin/admin.module#AdminModule"
  // },
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create-user',
        component: UserAccountComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user-account-list',
        component: UserAccountListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'staff-info',
        component: StaffInfoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'staff-info-list',
        component: StaffInfoListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user-role',
        component: UserroleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user-role-activity',
        component: UserroleActivityComponent,
      },
      {
        path: 'active-directory',
        component: ActiveDirectoryComponent,
      },
      {
        path: 'security-settings',
        component: SecuritySettingsComponent,
      },
      {
        path: 'sec-questions-list',
        component: SecurityQuestioListComponent,
      },
      {
        path: 'sec-questions',
        component: SecurityQuestionsComponent,
      },
      {
        path: 'security',
        component: SecuritySettingComponent,
      },
    ],
  },
  {
    path: 'organization',
    component: MainLayoutComponent,
    children: [
      {
        path: 'company-setup',
        component: CompanySetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'company-setup-list',
        component: CompanySetupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'company-structure',
        component: CompanyStructureComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'company-structure-list',
        component: CompanyStructureListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'company-structure-definition',
        component: CompanyStructureDefinitionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'company-structure-definition-list',
        component: CompanyStructureDefinitionListComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'setup',
    component: MainLayoutComponent,
    children: [
      {
        path: 'country',
        component: CountryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'country-list',
        component: CountryListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'state',
        component: StateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'state-list',
        component: StateListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'city',
        component: CityComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'city-list',
        component: CityListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'currency',
        component: CurrencyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'currency-list',
        component: CurrencyListComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'currencyrate',
        component: CurrencyRateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'currencyrate-list',
        component: CurrencyRateListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'document-type',
        component: DocumentTypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'company',
        component: CompanyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'company-list',
        component: CompanyListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'branch',
        component: BranchComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'emailconfig-list',
        component: EmailconfigListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'email-config',
        component: EmailconfigComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'branch-list',
        component: BranchListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'department',
        component: DepartmentComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'department-list',
        component: DepartmentListComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'identification',
        component: IdentificationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'identification-list',
        component: IdentificationListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'end-of-day',
        component: EndOfDayComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'eod-setup',
        component: EodSetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'job-title',
        component: JobTitleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'job-title-list',
        component: JobTitleListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'workflow-group-list',
        component: WorkflowGroupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'workflow-group',
        component: WorkflowGroupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'workflow-level-list',
        component: WorkflowLevelListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'workflow-level',
        component: WorkflowLevelComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'workflow-staff-list',
        component: WorkflowStaffListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'workflow-staff',
        component: WorkflowStaffComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'workflow-mapping-list',
        component: WorkflowMappingListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'workflow-mapping',
        component: WorkFlowMappingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'workflow-activation',
        component: WorkflowActivationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-type',
        component: ProductTypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'document-type',
        component: DocumentTypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'authentication-list',
        component: AuthenticationSetupListComponent,
      },
      {
        path: 'authentication',
        component: AuthenticationSetupComponent,
      },
      {
        path: 'module-setup',
        component: SolutionsSetupComponent,
      },
    ],
  },

  {
    path: 'approval',
    component: MainLayoutComponent,
    children: [
      {
        path: 'approvalgroup',
        component: ApprovalGroupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'approvalgroup-list',
        component: ApprovalGroupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'approvallevel',
        component: ApprovalLevelComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'approvallevel-list',
        component: ApprovalLevelListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'approvallevelstaff',
        component: ApprovalLevelStaffComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'approvallevelstaff-list',
        component: ApprovalLevelStaffListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'approvalgroup-mapping',
        component: ApprovalgroupmappingComponent,
        canActivate: [AuthGuard],
      },
      // {
      //     path: "city",
      //     component: CityComponent,
      //     canActivate: [AuthGuard]
      // },
    ],
  },

  {
    path: 'purchases-and-supplier',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: PurchaseDashboardComponent,
      },
      {
        path: 'tax-setup-list',
        component: TaxSetupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tax-setup',
        component: TaxSetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'service-terms-setup-list',
        component: ServiceTermsListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'service-terms',
        component: ServiceTermsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'supplier-type-setup-list',
        component: SupplierTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'supplier-type',
        component: SupplierTypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'supplier-info',
        component: SupplierRegistrationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pending-suppliers',
        component: PendingSuppliersComponent,
      },
      {
        path: 'supplier-list',
        component: SupplierListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'supplier-approval',
        component: SupplierApprovalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'supplier-appoval-details',
        component: SupplierApprovalDetailsComponent,
      },
      {
        path: 'purchase-info',
        component: PurchaseEntryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'purchase-list',
        component: PurchaseListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'requisition-list',
        component: PurchaseRequisitionListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'requisition-info',
        component: PuchaseRequisitionEntryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'prn-approvals',
        component: PrnApprovalsComponent,
      },
      {
        path: 'bids',
        component: BidsComponent,
      },
      {
        path: 'bid',
        component: BidComponent,
      },
      {
        path: 'bid-tender',
        component: BidTenderComponent,
      },
      {
        path: 'bids-approvals',
        component: BidApprovalsComponent,
      },
      {
        path: 'lpos',
        component: LpoListComponent,
      },
      { path: 'lpo', component: LpoComponent },
      {
        path: 'lpo-approvals',
        component: LpoApprovalComponent,
      },
      {
        path: 'invoice-lists',
        component: InvoiceListComponent,
      },
      {
        path: 'invoice-detail',
        component: InvoiceDetailComponent,
      },
      {
        path: 'payment-lists',
        component: PaymentListsComponent,
      },
      {
        path: 'aging-analysis',
        component: AgingAnalysisComponent,
      },
      {
        path: 'purchase-report',
        component: PurchaseReportComponent,
      },
    ],
  },
  {
    path: 'ppe',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'asset-classification-list',
        component: AssetClassificationListComponent,
      },
      { path: 'asset-classification', component: AssetClassificationComponent },
      {
        path: 'addition',
        component: AdditionComponent,
      },
      {
        path: 'addition-list',
        component: AdditionListComponent,
      },
      {
        path: 'addition-approvals',
        component: AdditionApprovalsComponent,
      },
      {
        path: 'register-list',
        component: RegisterListComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'reassessment-list',
        component: ReassessmentListComponent,
      },
      {
        path: 'reassess-useful-life',
        component: ReassessmentComponent,
      },
      {
        path: 'reassess-residual-value',
        component: ReassessResidualValueComponent,
      },
      {
        path: 'reevaluation-list',
        component: ReevaluationListComponent,
      },
      {
        path: 'reevalute-cost',
        component: ReevaluateCostComponent,
      },
      {
        path: 'reevaluation-appraisals',
        component: ReevaluationApprovalsComponent,
      },
      {
        path: 'reassessment-appraisals',
        component: ReassessApprovalsComponent,
      },
      {
        path: 'disposal-list',
        component: DisposalListComponent,
      },
      {
        path: 'disposal',
        component: DisposalComponent,
      },
      {
        path: 'disposal-appraisal',
        component: DisposalApprovalComponent,
      },
    ],
  },
  // {
  //   path: "purchase",
  //   component: MainLayoutComponent,
  //   children: [
  //     {
  //       path: "purchase-info",
  //       component: PurchaseEntryComponent,
  //       canActivate: [AuthGuard]
  //     },
  //     {
  //       path: "purchase-list",
  //       component: PurchaseListComponent,
  //       canActivate: [AuthGuard]
  //     },
  //     {
  //       path: "requisition-list",
  //       component: PurchaseRequisitionListComponent,
  //       canActivate: [AuthGuard]
  //     },
  //     {
  //       path: "requisition-info",
  //       component: PuchaseRequisitionEntryComponent,
  //       canActivate: [AuthGuard]
  //     },
  //     {
  //       path: "purchase-approval",
  //       component: SupplierApprovalComponent
  //     }
  //   ]
  // },
  {
    path: 'customer',
    component: MainLayoutComponent,
    children: [
      {
        path: 'customer-info',
        component: CustomerRegistrationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customer-list',
        component: CustomerListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customer-approval',
        component: CustomerApprovalComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'finance',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'gl-info',
        component: GLComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'gl-list',
        component: GLListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'subGL-info',
        component: SubGLComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'subGL-list',
        component: SubGLListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accounttype-info',
        component: AccountTypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accounttype-list',
        component: AccountTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'registry-info',
        component: RegistryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'registry-list',
        component: RegistryListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'glmapping-list',
        component: GLMappingListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'glRemap-list',
        component: GLRemapListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'registrytemplate-info',
        component: RegistryTemplateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'registrytemplate-list',
        component: RegistryTemplateListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'variables',
        component: VariablesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'financial-year-list',
        component: FinancialYearComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'journals',
        component: JournalsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'journals-approval',
        component: JournalApprovalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addjournals',
        component: JournalFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'financial-year-info',
        component: FinancialYearSetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'trialBalance-info',
        component: TrialBalanceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'trialBalance-list',
        component: TrialBalanceListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'statementtype-info',
        component: StatementTypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'statementtype-list',
        component: StatementTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'gltransaction-list',
        component: GLTransactionListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'gltransaction-info',
        component: GLTransactionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'currency-setup',
        component: CurrencySetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'currency-setup-list',
        component: CurrencySetupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'exchange-rate',
        component: ExchangeRateManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'fs-report',
        component: FsReportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pl-report',
        component: PlReportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'soce-report',
        component: SoceReportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'excel-report',
        component: ExcelReportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'translation-setup',
        component: TranslationListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'translation',
        component: TranslationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'flutterwave-transfer',
        component: FlutterTransferListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'key-setup',
        component: FluterwaveKeyComponent,
      },
      {
        path: 'bankgl-list',
        component: BankglListComponent,
      },
      {
        path: 'bankgl',
        component: BankglComponent,
      },
      {
        path: 'banks',
        component: BankSetupListComponent,
      },
      {
        path: 'bank',
        component: BankSetupComponent,
      },
    ],
  },

  {
    path: 'casa',
    component: MainLayoutComponent,
    children: [
      {
        path: 'customeraccount-info',
        component: CustomerAccountInfoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customeraccount-info-list',
        component: CustomerAccountInfoListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customeraccount-approval',
        component: CustomerAccountApprovalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customertransaction-list',
        component: CustomertransactionListComponent,
        canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: 'deposit',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'depositform-list',
        component: DepositformListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'depositform',
        component: DepositformComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'changeofrateform-list',
        component: ChangeOfRateFormListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'changeofrateform',
        component: ChangeOfRateFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accountclosure',
        component: ClosureOfBankAccountFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accountreactivation',
        component: AccountReactivationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'withdrawalform',
        component: WithdrawalFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transferform',
        component: TransferFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'callover',
        component: CashierTellerBalancingTransactionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'callover-form',
        component: CashierTellerBalancingComponent,
      },
      {
        path: 'transactioncorrection',
        component: TransactionCorrectionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transactioncorrection-list',
        component: TransactionCorrectionListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accounttype-list',
        component: AccounttypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accounttype',
        component: AccounttypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'category-list',
        component: CategoryListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'category',
        component: CategoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'businesscategory-list',
        component: BusinesscategoryListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'businesscategory',
        component: BusinesscategoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transactioncharge-list',
        component: TransactionchargeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transactioncharge',
        component: TransactionchargeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'changeofrate',
        component: ChangeOfRateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'changeofrate-list',
        component: ChangeOfRateListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transactiontax',
        component: TransactiontaxComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transactiontax-list',
        component: TransactiontaxListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accountsetup-list',
        component: AccountsetupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accountsetup',
        component: AccountsetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accountopening-list',
        component: AccountopeningListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accountopening',
        component: AccountopeningComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customeraccount-approval',
        component: CustomerAccountApprovalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accountopening-signatories',
        component: AccountopeningSignatoriesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'accountopening-directors',
        component: AccountopeningDirectorsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'withdrawal-setup-list',
        component: WithdrawalSetupListComponent,
      },
      { path: 'withdrawal-setup', component: WithdrawalSetupComponent },
      {
        path: 'bankclosure-setup-list',
        component: BankClosureSetupListComponent,
      },
      {
        path: 'bankclosure-setup',
        component: BankClosureSetupComponent,
      },
      {
        path: 'account-activation-list',
        component: AccountActivationSetupListComponent,
      },
      {
        path: 'account-activation',
        component: AccountActivationSetupComponent,
      },
      {
        path: 'transfer-setup-list',
        component: TransferSetupListComponent,
      },
      {
        path: 'transfer-setup',
        component: TransferSetupComponent,
      },
      {
        path: 'callover-setup-list',
        component: CalloverSetupListComponent,
      },
      {
        path: 'callover-setup',
        component: CalloverSetupComponent,
      },
      {
        path: 'till-vault-setup-list',
        component: TillVaultSetupListComponent,
      },
      {
        path: 'till-vault-setup',
        component: TillVaultSetupComponent,
      },
      {
        path: 'till-vault-list',
        component: TillAndVaultListComponent,
      },
      {
        path: 'till-vault',
        component: TillAndVaultComponent,
      },
      {
        path: 'transaction-correction-setup-list',
        component: TransactionCorrectionSetupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transaction-correction-setup',
        component: TransactionCorrectionSetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'closure-of-bank-account-approval',
        component: ClosureOfBankAccountApprovalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'change-of-rates-approval',
        component: ChangeOfRatesApprovalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customer-deposits',
        component: CustomerDepositsComponent,
      },
      {
        path: 'customer-deposit',
        component: CustomerDepositComponent,
      },
      {
        path: 'withdrawals',
        component: CustomerWithdrawalComponent,
      },
      {
        path: 'account-reactivation-list',
        component: AccountReactivationListComponent,
      },
      {
        path: 'account-reactivation-appraisal',
        component: AccountReactivationAppraisalsComponent,
      },
    ],
  },

  {
    path: 'credit',
    component: MainLayoutComponent,
    children: [
      {
        path: 'loan-staging',
        component: LoanStagingListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-staging-update',
        component: LoanStagingUpdateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'credit-classification',
        component: CreditClassificationListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'credit-classification-update',
        component: CreditClassificationUpdateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'credit-bureau',
        component: CreditBureauSetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'credit-bureau-list',
        component: CreditBureauSetupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'fee-info',
        component: FeeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'exposure-list',
        component: ExposureListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'operating-account',
        component: OperatingAccountComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'fee-list',
        component: FeeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'creditriskscorecard-info',
        component: CreditRiskScoreCardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'creditriskscorecard-list',
        component: CreditRiskScoreCardListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-type-list',
        component: ProductTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-type-setup',
        component: ProductTypeSetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-info',
        component: ProductComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-list',
        component: ProductListComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'loancustomer-info',
        component: LoanCustomerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loancustomer-list',
        component: LoanCustomerListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'startloanapplication-info',
        component: StartLoanApplicationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'startloanapplication-list',
        component: StartLoanApplicationListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loanapplications',
        component: LoanApplicationsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loanapplication-info',
        component: LoanApplicationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'category',
        component: CreditRiskCategoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'category-list',
        component: CreditRiskCategoryListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'attribute',
        component: CreditRiskAttributeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'attribute-list',
        component: CreditRiskAttributeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'application-list',
        component: LoanApplicationListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'eligibility-check/:id',
        component: LoanEligibilityCheckComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'credit-risk-rating',
        component: CreditRiskRatingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'credit-risk-rating-list',
        component: CreditRiskRatingListComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'credit-risk-rating-pd',
        component: CreditRiskRatingPDComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'credit-risk-rating-pd-list',
        component: CreditRiskRatingPDListComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'weighted-risk-score',
        component: CreditWeightedRiskScoreComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'weighted-risk-score-list',
        component: CreditWeightedriskScoreListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'credit-appraisal',
        component: CreditAppraisalComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'schedule',
        component: ScheduleComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'offerletter-list',
        component: OfferLetterListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'offerletterreview',
        component: OfferLetterReviewComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-booking',
        component: LoanBookingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-booking-approval',
        component: LoanBooingApprovalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'setup-data',
        component: SetupDataComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'setup-data-list',
        component: SetupDataListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'scenario-setup-data-list',
        component: ScenaroSetupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'scenario-setup-data',
        component: ScenaroSetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'macro-economic-variable',
        component: MacroEconomicVariableComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'macro-economic-variable-list',
        component: MacroEconomicVariableListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-application-score-card-history',
        component: LoanApplicationScoreCardHistoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-lgd-history',
        component: LoanLgdHistoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'run-impairments',
        component: RunImpairmentsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-customer-fscaption-group',
        component: LoanCustomerFsCaptionGroupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-customer-fscaption-group-list',
        component: LoanCustomerFsCaptionGroupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-customer-fscaption',
        component: LoanCustomerFsCaptionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-customer-fscaption-list',
        component: LoanCustomerFsCaptionListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-customer-fscaption-detail',
        component: LoanCustomerFsCaptionDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-customer-fscaption-detail-list',
        component: LoanCustomerFsCaptionDetailListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-customer-fscaption-ratio-detail',
        component: LoanCustomerFsRatioDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-customer-fscaption-ratio-detail-list',
        component: LoanCustomerFsRatioDetailListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loanreviewoperations-list',
        component: LoanReviewOperationsListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'call-memo-list',
        component: CallMemoListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'collateral-approval',
        component: CollateralApprovalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'collateral-customer-list',
        component: CollateralCustomerListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'collateral-customer',
        component: CollateralCustomerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'collateral-type-list',
        component: CollateralTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'collateral-type',
        component: CollateralTypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-collateral',
        component: LoanCollateralComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loanoperations-approval',
        component: LoanOperationsApprovalComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'loan-management',
    component: MainLayoutComponent,
    children: [
      {
        path: 'collateral',
        component: CollateralManagementComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'application',
        component: LmsApplicationComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'manage',
        component: LmsApplicationManageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'appraisal',
        component: LmsAppraisalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'offer-letter',
        component: LmsOfferLetterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-prepayment',
        component: LoanPrepaymentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-repayment',
        component: DepositformListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'add-loan-repayment',
        component: DepositformComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customertransaction-list',
        component: CreditCustomerTransactionsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'payments-due',
        component: PaymentDueLoansComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'overdue',
        component: PastDueLoansComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'reports',
    component: MainLayoutComponent,
    children: [
      {
        path: 'customer-report',
        component: CustomerReportComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'loan-report',
        component: LoanReportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'summary-report',
        component: SummaryReportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investor-report',
        component: InvestorReportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investment-report',
        component: InvestmentReportComponent,
        canActivate: [AuthGuard],
      },
      // {
      //     path: "offer-letter",
      //     component: LmsOfferLetterComponent,
      //     canActivate: [AuthGuard]
      // },
      // {
      //     path: "loan-prepayment",
      //     component: LoanPrepaymentComponent,
      //     canActivate: [AuthGuard]
      // }
    ],
  },
  {
    path: 'investor',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: InvestorDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-type',
        component: InvestmentProductTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-type-setup',
        component: InvestorProductSetUpComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-list',
        component: InvestorProductListsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product',
        component: InvestorProductComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investor-customer',
        component: InvestorCustomerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investor-customer-list',
        component: InvestorCustomerListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investor-list',
        component: InvestorListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investor-list-info',
        component: InvestorListInfoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'collection',
        component: CollectionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'liquidate',
        component: LiquidateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'rollover',
        component: RolloverComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investments-list',
        component: InvestmentslistsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investment-appraisal',
        component: InvestmentAppraisalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'collection-appraisal',
        component: CollectionAppraisalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'liquidation-appraisal',
        component: LiquidationAppraisalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'placement-certificate-list',
        component: PlacementCertificateListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transactions',
        component: CustomerTransactionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'payment',
        component: PaymentsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pending-investments',
        component: PendingInvestmentsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pending-liquidations',
        component: PendingLiquidationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pending-collections',
        component: PendingCollectionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pending-rollover',
        component: PendingRolloverComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pending-topup',
        component: PendingTopupComponent,
        canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: 'treasury',
    component: MainLayoutComponent,
    children: [
      {
        path: 'product-type',
        component: TreasuryProductTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-type-setup',
        component: TreasuryProductSetupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-list',
        component: TreasuryProductListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product',
        component: TreasuryProductComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'issuer-info',
        component: IssuerInfoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'issuer-list',
        component: IssuerListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investments-list',
        component: TreasuryPlacementListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'placement-info',
        component: TreasuryPlacementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investment-appraisal',
        component: TreasuryInvestmentAppraisalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'collection',
        component: TreasuryCollectionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'liquidate',
        component: TreasuryLiquidationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'rollover',
        component: RolloverComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investments-list',
        component: InvestmentslistsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'investment-appraisal',
        component: InvestmentAppraisalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'collection-appraisal',
        component: TreasuryCollectionAppraisalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'liquidation-appraisal',
        component: TreasuryLiquidationAppraisalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'placement-certificate-list',
        component: CertificateListComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'expense-management',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'classification-setup-list',
        component: ClassificationListComponent,
      },
      {
        path: 'classification-setup',
        component: ClassificationComponent,
      },
      {
        path: 'out-of-station-list',
        component: OutOfStationListComponent,
      },
      {
        path: 'out-of-station',
        component: OutOfStationComponent,
      },
      {
        path: 'cost-centre-list',
        component: CostCentreListComponent,
      },
      {
        path: 'cost-centre',
        component: CostCentreComponent,
      },
      {
        path: 'requisitions',
        component: EssRequisitionsComponent,
      },
      {
        path: 'requisition',
        component: EssRequisitionComponent,
      },
      {
        path: 'approved-requisitions',
        component: EssApprovedErnComponent,
      },
      {
        path: 'requests',
        component: RequestsComponent,
      },
      {
        path: 'ess-retirements',
        component: EssRetirementsComponent,
      },
      {
        path: 'ess-retirement',
        component: EssRetirementComponent,
      },
      {
        path: 'admin-requisition-list',
        component: AdminReqListComponent,
      },
      {
        path: 'admin-requisition',
        component: AdminReqComponent,
      },
      {
        path: 'ern-approval',
        component: ErnApprovalListComponent,
      },
      {
        path: 'approved-ern',
        component: ApprovedErnComponent,
      },
      {
        path: 'payment-proposal',
        component: ErnPaymentProposalComponent,
      },
      {
        path: 'payment-approval',
        component: ErnPaymentApprovalComponent,
      },
      {
        path: 'retirements',
        component: RetirementListComponent,
      },
      {
        path: 'retirement',
        component: RetirementComponent,
      },
      {
        path: 'claims',
        component: ClaimsComponent,
      },
      {
        path: 'claim',
        component: ClaimComponent,
      },
      {
        path: 'req-claim-approval',
        component: ReqClaimsComponent,
      },
      {
        path: 'claims-approval',
        component: ClaimApprovalsComponent,
      },
      {
        path: 'collections',
        component: CollectionsComponent,
      },
    ],
  },
];

export const AppRoutes: ModuleWithProviders<any> = RouterModule.forRoot(routes);
