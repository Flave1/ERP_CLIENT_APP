import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PurchaseListComponent } from "./purchase-list/purchase-list.component";
import { PurchaseEntryComponent } from "./purchase-entry/purchase-entry.component";
import { PurchaseRequisitionListComponent } from "./purchase-requisition-list/purchase-requisition-list.component";
import { PuchaseRequisitionEntryComponent } from "./puchase-requisition-entry/puchase-requisition-entry.component";
import { PurchaseService } from "../core/services/purchase.service";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [
        PurchaseListComponent,
        PurchaseEntryComponent,
        PurchaseRequisitionListComponent,
        PuchaseRequisitionEntryComponent
    ],
    providers: [PurchaseService]
})
export class PurchaseModule {}
