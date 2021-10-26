import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GLService } from "../core/services/gl.service";
import { GLComponent } from "./component/gl/gl.component";
import { GLListComponent } from "./component/gl/gl-list.component";
import { SubGLListComponent } from "./component/subgl/subgl-list.component";
import { SubGLComponent } from "./component/subgl/subgl.component";
import { SubGLService } from "../core/services/subgl.service";
import { RegistryComponent } from "./component/registry/registry.component";
import { RegistryListComponent } from "./component/registry/registry-list.component";
import { RegistryService } from "../core/services/registry";
import { GLMappingListComponent } from "./component/glmapping/glmapping-list.component";
import { GLMappingService } from "../core/services/glmapping.service";
import { AccountTypeComponent } from "./component/accounttype/accounttype.component";
import { AccountTypeListComponent } from "./component/accounttype/accounttype-list.component";
import { AccountTypeService } from "../core/services/accounttype.service";
import { RegistryTemplateListComponent } from "./component/registrytemplate/registrytemplate-list.component";
import { TrialBalanceComponent } from "./component/trialbalance/trialbalance.component";
import { TrialBalanceListComponent } from "./component/trialbalance/trialbalance-list.component";
import { TrialBalanceService } from "../core/services/trialbalance.service";
import { GLRemapListComponent } from "./component/glmapping/glremap-list.component";
import { StatementTypeComponent } from "./component/statementtype/statementtype.component";
import { StatementTypeListComponent } from "./component/statementtype/statementtype-list.component";
import { StatementTypeService } from "../core/services/statementtype.service";
import { RegistryTemplateComponent } from "./component/registrytemplate/registrytemplate.component";
import { GLTransactionListComponent } from "./component/gltransaction/gltransaction-list.component";
import { GLTransactionService } from "../core/services/gltransaction.service";
import { GLTransactionComponent } from "./component/gltransaction/gltransaction.component";
import {RouterModule} from "@angular/router";
import { FinancialYearSetupComponent } from './component/financial-year-setup/financial-year-setup.component';
import { FinancialYearComponent } from './component/financial-year/financial-year.component';
import { JournalFormComponent } from './component/journal/journal-form/journal-form.component';
import { JournalsComponent } from './component/journal/journals/journals.component';
import { CurrencySetupComponent } from './component/currency-setup/currency-setup.component';
import { CurrencySetupListComponent } from './component/currency-setup-list/currency-setup-list.component';
import { ExchangeRateManagementComponent } from './component/exchange-rate-management/exchange-rate-management.component';
import { FsReportComponent } from './component/fs-report/fs-report.component';
import { PlReportComponent } from './component/pl-report/pl-report.component';
import { SoceReportComponent } from './component/soce-report/soce-report.component';
import { VariablesComponent } from './component/variables/variables.component';
import { TranslationListComponent } from './component/translation-list/translation-list.component';
import { TranslationComponent } from './component/translation/translation.component';
import { JournalApprovalComponent } from "./component/journal/Journal-approval/Journal-approval.component";
import { BankglListComponent } from './component/bankgl-list/bankgl-list.component';
import { BankglComponent } from './component/bankgl/bankgl.component';
import { BankSetupListComponent } from './component/bank-setup-list/bank-setup-list.component';
import { BankSetupComponent } from './component/bank-setup/bank-setup.component';
import { FluterwaveKeyComponent } from './component/fluterwave-key/fluterwave-key.component';
import { FluterwaveKeyListComponent } from './component/fluterwave-key-list/fluterwave-key-list.component';
import { EodSetupComponent } from './component/eod-setup/eod-setup.component';

@NgModule({
    imports: [CommonModule, SharedModule, RouterModule],
    declarations: [
        GLListComponent,
        GLComponent,
        SubGLListComponent,
        SubGLComponent,
        RegistryComponent,
        RegistryListComponent,
        GLMappingListComponent,
        AccountTypeComponent,
        AccountTypeListComponent,
        RegistryTemplateListComponent,
        TrialBalanceComponent,
        TrialBalanceListComponent,
        GLRemapListComponent,
        StatementTypeComponent,
        StatementTypeListComponent,
        RegistryTemplateComponent,
        GLTransactionListComponent,
        GLTransactionComponent,
        FinancialYearSetupComponent,
        FinancialYearComponent,
        JournalFormComponent,
        JournalsComponent,
        CurrencySetupComponent,
        CurrencySetupListComponent,
        ExchangeRateManagementComponent,
        FsReportComponent,
        PlReportComponent,
        SoceReportComponent,
        VariablesComponent,
        TranslationListComponent,
        TranslationComponent,
        JournalApprovalComponent,
        BankglListComponent,
        BankglComponent,
        BankSetupListComponent,
        BankSetupComponent,
        FluterwaveKeyComponent,
        FluterwaveKeyListComponent,
        EodSetupComponent,
    ],
    providers: [GLService,SubGLService,RegistryService,GLMappingService,AccountTypeService,TrialBalanceService,
    StatementTypeService,GLTransactionService]
})
export class FinanceModule {}
