import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssetClassificationListComponent } from "./components/setup/asset-classification-list/asset-classification-list.component";
import { AssetClassificationComponent } from "./components/setup/asset-classification/asset-classification.component";
import { SharedModule } from "../shared/shared.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpTokenInterceptor } from "../core/interceptors/http.interceptor.service";
import {PpeService} from "./services/ppe.service";
import { AdditionListComponent } from './components/addition-list/addition-list.component';
import { AdditionComponent } from './components/addition/addition.component';
import { AdditionApprovalsComponent } from './components/addition-approvals/addition-approvals.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterListComponent } from './components/register-list/register-list.component';
import { ReassessmentListComponent } from './components/reassessment-list/reassessment-list.component';
import { ReassessmentComponent } from './components/reassessment/reassessment.component';
import { DisposalListComponent } from './components/disposal-list/disposal-list.component';
import { DisposalComponent } from './components/disposal/disposal.component';
import { ReassessResidualValueComponent } from './components/reassess-residual-value/reassess-residual-value.component';
import { ReassessApprovalsComponent } from './components/reassess-approvals/reassess-approvals.component';
import { DisposalApprovalComponent } from './components/disposal-approval/disposal-approval.component';
import { ReevaluateCostComponent } from './components/reevaluate-cost/reevaluate-cost.component';
import { ReevaluationListComponent } from './components/reevaluation-list/reevaluation-list.component';
import { ReevaluationApprovalsComponent } from './components/reevaluation-approvals/reevaluation-approvals.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    AssetClassificationListComponent,
    AssetClassificationComponent,
    AdditionListComponent,
    AdditionComponent,
    AdditionApprovalsComponent,
    RegisterComponent,
    RegisterListComponent,
    ReassessmentListComponent,
    ReassessmentComponent,
    DisposalListComponent,
    DisposalComponent,
    ReassessResidualValueComponent,
    ReassessApprovalsComponent,
    DisposalApprovalComponent,
    ReevaluateCostComponent,
    ReevaluationListComponent,
    ReevaluationApprovalsComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    PpeService
  ]
})
export class PpeModule {}
