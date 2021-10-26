import { DocumentTypeComponent } from './components/document-type/document-type.component';
import { WorkflowStaffListComponent } from './components/workflow/workflow-staff/workflow-staff-list.component';
import { JobTitleListComponent } from './components/job-title/job-title-list.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { CountryListComponent } from "./components/country/country-list.component";
import { CountryComponent } from "./components/country/country.component";
import { StateComponent } from "./components/state/state.component";
import { StateListComponent } from "./components/state/state-list.component";
import { CityComponent } from "./components/city/city.component";
import { CityListComponent } from "./components/city/city-list.component";
import { CurrencyComponent } from "./components/currency/currency.component";
import { CurrencyListComponent } from "./components/currency/currency-list.component";
import { CurrencyRateComponent } from "./components/currencyrate/currencyrate.component";
import { CurrencyRateListComponent } from "./components/currencyrate/currencyrate-list.component";
import { BranchComponent } from "./components/branch/branch.component";
import { BranchListComponent } from "./components/branch/branch-list.component";
import { CompanyComponent } from "./components/company/company.component";
import { CompanyListComponent } from "./components/company/company-list.component";
import { DepartmentListComponent } from "./components/department/department-list.component";
import { DepartmentComponent } from "./components/department/department.component";
import { ApprovalGroupComponent } from "./components/approvalgroup/approvalgroup.component";
import { ApprovalGroupListComponent } from "./components/approvalgroup/approvalgroup-list.component";
import { ApprovalLevelComponent } from "./components/approvallevel/approvallevel.component";
import { ApprovalLevelListComponent } from "./components/approvallevel/approvallevel-list.component";
import { ApprovalLevelStaffComponent } from "./components/approvallevelstaff/approvallevelstaff.component";
import { ApprovalLevelStaffListComponent } from "./components/approvallevelstaff/approvallevelstaff-list.component";
import { ApprovalgroupmappingComponent } from "./components/approvalgroupmapping/approvalgroupmapping.component";
import { IdentificationComponent } from "./components/identification/identification.component";
import { IdentificationListComponent } from "./components/identification/identification-list.component";
import { EndOfDayComponent } from "./components/end-of-day/end-of-day.component";
import { JobTitleComponent } from './components/job-title/job-title.component';
import { WorkflowGroupListComponent } from './components/workflow/workflow-group/workflow-group-list.component';
import { WorkflowGroupComponent } from './components/workflow/workflow-group/workflow-group.component';
import { WorkflowLevelListComponent } from './components/workflow/workflow-level/workflow-level-list.component';
import { WorkflowLevelComponent } from './components/workflow/workflow-level/workflow-level.component';
import { WorkflowStaffComponent } from './components/workflow/workflow-staff/workflow-staff.component';
import { WorkFlowMappingComponent } from './components/workflow/workflow-mapping/work-flow-mapping.component';
import { WorkflowMappingListComponent } from './components/workflow/workflow-mapping/workflow-mapping-list.component';
import { ProductTypeComponent } from './components/product-type/product-type.component';
import { WorkflowActivationComponent } from './components/workflow/workflow-activation/workflow-activation.component';
import { EmailconfigListComponent } from './components/emailconfig-list/emailconfig-list.component';
import {EmailconfigComponent} from './components/emailconfig/emailconfig.component';
import { AuthenticationSetupComponent } from './components/authentication-setup/authentication-setup.component';
import { AuthenticationSetupListComponent } from './components/authentication-setup-list/authentication-setup-list.component';
import { SolutionsSetupComponent } from './components/solutions-setup/solutions-setup.component';


@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [
        CountryListComponent,
        CountryComponent,
        StateComponent,
        StateListComponent,
        CityComponent,
        CityListComponent,
        CurrencyComponent,
        CurrencyListComponent,
        CurrencyRateComponent,
        CurrencyRateListComponent,
        BranchComponent,
        BranchListComponent,
        CompanyComponent,
        CompanyListComponent,
        DepartmentListComponent,
        DepartmentComponent,
        ApprovalGroupComponent,
        ApprovalGroupListComponent,
        ApprovalLevelComponent,
        ApprovalLevelListComponent,
        ApprovalLevelStaffComponent,
        ApprovalLevelStaffListComponent,
        ApprovalgroupmappingComponent,
        IdentificationComponent,
        IdentificationListComponent,
        EndOfDayComponent,
        JobTitleComponent,
        JobTitleListComponent, 

        WorkflowGroupListComponent,
        WorkflowGroupComponent,
        WorkflowLevelListComponent,
        WorkflowLevelComponent,
        WorkflowStaffListComponent,
        WorkflowStaffComponent,
        WorkflowMappingListComponent,
        WorkFlowMappingComponent, 
        WorkflowActivationComponent,
        
        DocumentTypeComponent,
        ProductTypeComponent,
        EmailconfigComponent,
        EmailconfigListComponent,
        AuthenticationSetupComponent,
        AuthenticationSetupListComponent,
        SolutionsSetupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SetupModule {}
