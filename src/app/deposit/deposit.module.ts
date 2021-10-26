import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ChangeOfRateComponent } from './components/change-of-rate/change-of-rate.component';
import { ChangeOfRateListComponent } from './components/change-of-rate-list/change-of-rate-list.component';
import { ChangeOfRateFormComponent } from './components/change-of-rate-form/change-of-rate-form.component';
import { ChangeOfRateFormListComponent } from './components/change-of-rate-form-list/change-of-rate-form-list.component';
import { ClosureOfBankAccountFormComponent } from './components/closure-of-bank-account-form/closure-of-bank-account-form.component';
import { AccountReactivationComponent } from './components/account-reactivation/account-reactivation.component';
import { WithdrawalFormComponent } from './components/withdrawal-form/withdrawal-form.component';
import { TransferFormComponent } from './components/transfer-form/transfer-form.component';
import { CashierTellerBalancingComponent } from './components/cashier-teller-balancing/cashier-teller-balancing.component';
import { CashierTellerBalancingTransactionComponent } from './components/cashier-teller-balancing-transaction/cashier-teller-balancing-transaction.component';
import { TransactionCorrectionComponent } from './components/transaction-correction/transaction-correction.component';
import { TransactionCorrectionListComponent } from './components/transaction-correction-list/transaction-correction-list.component';
import { TillAndVaultListComponent } from './components/till-and-vault-list/till-and-vault-list.component';
import { TillAndVaultComponent } from './components/till-and-vault/till-and-vault.component';
import { AccountActivationSetupComponent } from './components/account-activation-setup/account-activation-setup.component';
import { WithdrawalSetupListComponent } from './components/withdrawal-setup-list/withdrawal-setup-list.component';
import { WithdrawalSetupComponent } from './components/withdrawal-setup/withdrawal-setup.component';
import { ChangeOfRateSetupComponent } from './components/change-of-rate-setup/change-of-rate-setup.component';
import { BankClosureSetupListComponent } from './components/bank-closure-setup-list/bank-closure-setup-list.component';
import { BankClosureSetupComponent } from './components/bank-closure-setup/bank-closure-setup.component';
import { AccountActivationSetupListComponent } from './components/account-activation-setup-list/account-activation-setup-list.component';
import { TransferSetupListComponent } from './components/transfer-setup-list/transfer-setup-list.component';
import { TransferSetupComponent } from './components/transfer-setup/transfer-setup.component';
import { CalloverSetupListComponent } from './components/callover-setup-list/callover-setup-list.component';
import { CalloverSetupComponent } from './components/callover-setup/callover-setup.component';
import { TillVaultSetupListComponent } from './components/till-vault-setup-list/till-vault-setup-list.component';
import { TillVaultSetupComponent } from './components/till-vault-setup/till-vault-setup.component';
import { TillVaultListComponent } from './components/till-vault-list/till-vault-list.component';
import { TillVaultComponent } from './components/till-vault/till-vault.component';
import { TransactionCorrectionSetupListComponent } from './components/transaction-correction-setup-list/transaction-correction-setup-list.component';
import { TransactionCorrectionSetupComponent } from './components/transaction-correction-setup/transaction-correction-setup.component';
import { ClosureOfBankAccountApprovalComponent } from './components/closure-of-bank-account-form/closure-of-bank-account-approval.component';
import { ChangeOfRatesApprovalComponent } from './components/change-of-rate-form/change-of-rates-approval.component';
import { CustomerDepositsComponent } from './components/customer-deposits/customer-deposits.component';
import { CustomerDepositComponent } from './components/customer-deposit/customer-deposit.component';
import { CustomerWithdrawalComponent } from './components/customer-withdrawal/customer-withdrawal.component';
import { AccountReactivationListComponent } from './components/account-reactivation-list/account-reactivation-list.component';
import { AccountReactivationAppraisalsComponent } from './components/account-reactivation-appraisals/account-reactivation-appraisals.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    ChangeOfRateComponent,
    ChangeOfRateListComponent,
    ChangeOfRateFormComponent,
    ChangeOfRateFormListComponent,
    ClosureOfBankAccountFormComponent,
    AccountReactivationComponent,
    WithdrawalFormComponent,
    TransferFormComponent,
    CashierTellerBalancingComponent,
    CashierTellerBalancingTransactionComponent,
    TransactionCorrectionListComponent,
    TillAndVaultListComponent,
    TillAndVaultComponent,
    AccountActivationSetupComponent,
    WithdrawalSetupListComponent,
    WithdrawalSetupComponent,
    ChangeOfRateSetupComponent,
    BankClosureSetupListComponent,
    BankClosureSetupComponent,
    AccountActivationSetupListComponent,
    TransferSetupListComponent,
    TransferSetupComponent,
    CalloverSetupListComponent,
    CalloverSetupComponent,
    TillVaultSetupListComponent,
    TillVaultSetupComponent,
    TillVaultListComponent,
    TillVaultComponent,
    TransactionCorrectionSetupListComponent,
    TransactionCorrectionSetupComponent,
    ClosureOfBankAccountApprovalComponent,
    ChangeOfRatesApprovalComponent,
    CustomerDepositsComponent,
    CustomerDepositComponent,
    CustomerWithdrawalComponent,
    AccountReactivationListComponent,
    AccountReactivationAppraisalsComponent
  ]
})
export class DepositModule { }
