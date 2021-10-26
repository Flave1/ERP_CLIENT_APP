import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassificationComponent } from './components/set-up/classification/classification.component';
import { OutOfStationComponent } from './components/set-up/out-of-station/out-of-station.component';
import { CostCentreComponent } from './components/set-up/cost-centre/cost-centre.component';
import { CostCentreListComponent } from './components/set-up/cost-centre-list/cost-centre-list.component';
import { OutOfStationListComponent } from './components/set-up/out-of-station-list/out-of-station-list.component';
import { ClassificationListComponent } from './components/set-up/classification-list/classification-list.component';
import { SharedModule } from '../shared/shared.module';
import { TableModule } from 'primeng/table';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from '../core/interceptors/http.interceptor.service';
import { ExpenseManagementService } from '../core/services/expense-management.service';
import { AdminReqListComponent } from './components/admin/admin-req-list/admin-req-list.component';
import { AdminReqComponent } from './components/admin/admin-req/admin-req.component';
import { ErnApprovalComponent } from './components/admin/ern-approval/ern-approval.component';
import { ErnApprovalListComponent } from './components/admin/ern-approval-list/ern-approval-list.component';
import { ApprovedErnComponent } from './components/admin/approved-ern/approved-ern.component';
import { ErnPaymentProposalComponent } from './components/admin/ern-payment-proposal/ern-payment-proposal.component';
import { ErnPaymentApprovalComponent } from './components/admin/ern-payment-approval/ern-payment-approval.component';
import { RetirementListComponent } from './components/admin/retirement-list/retirement-list.component';
import { RetirementComponent } from './components/admin/retirement/retirement.component';
import { ClaimsComponent } from './components/admin/claims/claims.component';
import { ClaimComponent } from './components/admin/claim/claim.component';
import { ClaimApprovalsComponent } from './components/admin/claim-approvals/claim-approvals.component';
import { CollectionsComponent } from './components/admin/collections/collections.component';
import { ReqClaimsComponent } from './components/admin/req-claims/req-claims.component';
import { EssRequisitionsComponent } from './components/ess/ess-requisitions/ess-requisitions.component';
import { EssRequisitionComponent } from './components/ess/ess-requisition/ess-requisition.component';
import { EssApprovedErnComponent } from './components/ess/ess-approved-ern/ess-approved-ern.component';
import { EssRetirementsComponent } from './components/ess/ess-retirements/ess-retirements.component';
import { EssRetirementComponent } from './components/ess/ess-retirement/ess-retirement.component';
import { InputTextModule } from 'primeng/inputtext';
import { RequestsComponent } from './components/ess/requests/requests.component';

@NgModule({
  imports: [CommonModule, SharedModule, InputTextModule],
  declarations: [
    ClassificationComponent,
    OutOfStationComponent,
    CostCentreComponent,
    CostCentreListComponent,
    OutOfStationListComponent,
    ClassificationListComponent,
    AdminReqListComponent,
    AdminReqComponent,
    ErnApprovalComponent,
    ErnApprovalListComponent,
    ApprovedErnComponent,
    ErnPaymentProposalComponent,
    ErnPaymentApprovalComponent,
    RetirementListComponent,
    RetirementComponent,
    ClaimsComponent,
    ClaimComponent,
    ClaimApprovalsComponent,
    CollectionsComponent,
    ReqClaimsComponent,
    EssRequisitionsComponent,
    EssRequisitionComponent,
    EssApprovedErnComponent,
    EssRetirementsComponent,
    EssRetirementComponent,
    RequestsComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
    ExpenseManagementService,
  ],
})
export class ExpenseManagementModule {}
