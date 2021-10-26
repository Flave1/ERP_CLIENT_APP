import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ServiceTermsComponent } from "./components/setup/service-terms/service-terms.component";
import { SupplierTypeComponent } from "./components/setup/supplier-type/supplier-type.component";
import { TaxSetupComponent } from "./components/setup/tax-setup/tax-setup.component";
import { TaxSetupListComponent } from "./components/setup/tax-setup-list/tax-setup-list.component";
import { ServiceTermsListComponent } from "./components/setup/service-terms-list/service-terms-list.component";
import { SupplierTypeListComponent } from "./components/setup/supplier-type-list/supplier-type-list.component";
import { SharedModule } from "../shared/shared.module";
import {SupplierListComponent} from "./components/supplier/supplier-registration/supplier-list.component";
import {SupplierRegistrationComponent} from "./components/supplier/supplier-registration/supplier-registration.component";
import {SupplierService} from "../core/services/supplier.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpTokenInterceptor} from "../core/interceptors/http.interceptor.service";
import { SupplierApprovalDetailsComponent } from './components/supplier-approval-details/supplier-approval-details.component';
import { PrnApprovalsComponent } from './prn-approvals/prn-approvals.component';
import { BidsComponent } from './components/bids/bids.component';
import { BidApprovalsComponent } from './components/bid-approvals/bid-approvals.component';
import { LpoListComponent } from './components/lpo-list/lpo-list.component';
import { LpoApprovalComponent } from './components/lpo-approval/lpo-approval.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './components/invoice-detail/invoice-detail.component';
import { PaymentListsComponent } from './components/payment-lists/payment-lists.component';
import { PendingSuppliersComponent } from './components/pending-suppliers/pending-suppliers.component';
import { BidComponent } from './components/bid/bid.component';
import { BidTenderComponent } from './components/bid-tender/bid-tender.component';
import { LpoComponent } from './components/lpo/lpo.component';
import { AgingAnalysisComponent } from './components/reports/aging-analysis/aging-analysis.component';
import { PurchaseDashboardComponent } from './components/purchase-dashboard/purchase-dashboard.component';
import {ChartModule} from "primeng/chart";
import { PurchaseReportComponent } from './components/reports/purchase-report/purchase-report.component';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';

@NgModule({
  imports: [CommonModule, SharedModule, ChartModule, AngularMultiSelectModule],
  declarations: [
    TaxSetupComponent,
    ServiceTermsComponent,
    SupplierTypeComponent,
    TaxSetupListComponent,
    ServiceTermsListComponent,
    SupplierTypeListComponent,
    SupplierListComponent,
    SupplierRegistrationComponent,
    SupplierApprovalDetailsComponent,
    PrnApprovalsComponent,
    BidsComponent,
    BidApprovalsComponent,
    LpoListComponent,
    LpoApprovalComponent,
    InvoiceListComponent,
    InvoiceDetailComponent,
    PaymentListsComponent,
    PendingSuppliersComponent,
    BidComponent,
    BidTenderComponent,
    LpoComponent,
    AgingAnalysisComponent,
    PurchaseDashboardComponent,
    PurchaseReportComponent
  ],
  exports: [
    SupplierApprovalDetailsComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    SupplierService
  ]
})
export class PurchasesAndPayablesModule {}
