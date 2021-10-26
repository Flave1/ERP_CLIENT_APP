import { SharedModule } from "../shared/shared.module";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerAccountService } from "../core/services/customeraccount.service";
import { CustomerAccountInfoComponent } from "./components/customeraccount/customeraccount-info.component";
import { CustomerAccountInfoListComponent } from "./components/customeraccount/customeraccount-info-list.component";
import { CustomerAccountApprovalComponent } from "./components/customeraccount-approval/customeraccount-approval.component";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [
        CustomerAccountInfoComponent,
        CustomerAccountInfoListComponent,
        CustomerAccountApprovalComponent
    ],
    providers: [
        CustomerAccountService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CasaModule {}
