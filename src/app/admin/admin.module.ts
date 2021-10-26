import { UserAccountListComponent } from "./components/user-account/user-account-list.component";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserAccountComponent } from "./components/user-account/user-account.component";
import { SharedModule } from "../shared/shared.module";
import { StaffInfoListComponent } from "./components/staff-info/staff-info-list.component";
import { StaffInfoComponent } from "./components/staff-info/staff-info.component";
import { UserroleComponent } from "./components/userrole/userrole.component";
import { UserroleActivityComponent } from "./components/userrole/userrole.activity.component";
import { CompanySetupComponent } from "./components/company-setup/company-setup.component";
import { CompanyStructureComponent } from "./components/company-structure/company-structure.component";
import { CompanyStructureListComponent } from "./components/company-structure/company-structure-list.component";
import { CompanyStructureDefinitionComponent } from "./components/company-structure-definition/company-structure-definition.component";
import { CompanyStructureDefinitionListComponent } from "./components/company-structure-definition/company-structure-definition-list.component";
import { CompanySetupListComponent } from './components/company-setup-list/company-setup-list.component';
import { ActiveDirectoryComponent } from './components/active-directory/active-directory.component';
import { SecuritySettingsComponent } from './components/security-settings/security-settings.component';
import { SecurityQuestionsComponent } from './components/security-questions/security-questions.component';
import { SecurityQuestioListComponent } from './components/security-questio-list/security-questio-list.component';
import { SecuritySettingComponent } from './components/security-setting/security-setting.component';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
// import { AdminRoutesModule } from "./admin.routing";

@NgModule({
  imports: [CommonModule, SharedModule, AngularMultiSelectModule],
    declarations: [
        UserAccountComponent,
        UserAccountListComponent,
        StaffInfoListComponent,
        StaffInfoComponent,
        UserroleComponent,
        UserroleActivityComponent,
        CompanySetupComponent,
        CompanyStructureComponent,
        CompanyStructureListComponent,
        CompanyStructureDefinitionComponent,
        CompanyStructureDefinitionListComponent,
        CompanySetupListComponent,
        ActiveDirectoryComponent,
        SecuritySettingsComponent,
        SecurityQuestionsComponent,
        SecurityQuestioListComponent,
        SecuritySettingComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {}
