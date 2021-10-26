import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TreasuryProductSetupComponent } from "./components/treasury-product-setup/treasury-product-setup.component";
import { TreasuryProductTypeListComponent } from "./components/treasury-product-type-list/treasury-product-type-list.component";
import { TreasuryProductListComponent } from "./components/treasury-product-list/treasury-product-list.component";
import { TreasuryProductComponent } from "./components/treasury-product/treasury-product.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { IssuerListComponent } from './components/issuer-list/issuer-list.component';
import { IssuerInfoComponent } from './components/issuer-info/issuer-info.component';
import { TreasuryPlacementListComponent } from './components/treasury-placement-list/treasury-placement-list.component';
import { TreasuryPlacementComponent } from './components/treasury-placement/treasury-placement.component';
import { TreasuryCustomerListComponent } from './components/treasury-customer-list/treasury-customer-list.component';
import { TreasuryCollectionComponent } from './components/treasury-collection/treasury-collection.component';
import { TreasuryLiquidationComponent } from './components/treasury-liquidation/treasury-liquidation.component';
import { TreasuryLiquidationAppraisalComponent } from './components/treasury-liquidation-appraisal/treasury-liquidation-appraisal.component';
import { TreasuryCollectionAppraisalComponent } from './components/treasury-collection-appraisal/treasury-collection-appraisal.component';
import {TreasuryService} from '../core/services/treasury.service';
import { TreasuryInvestmentAppraisalComponent } from './components/treasury-investment-appraisal/treasury-investment-appraisal.component';
import { TreasuryCustomerDetailsComponent } from './components/treasury-customer-details/treasury-customer-details.component';
import { TreasuryInvestmentDetailsComponent } from './components/treasury-investment-details/treasury-investment-details.component';
import { TreasuryInvestmentApprovalCommentComponent } from './components/treasury-investment-approval-comment/treasury-investment-approval-comment.component';
import { TreasuryCollectionDetailsComponent } from './components/treasury-collection-details/treasury-collection-details.component';
import { TreasuryLiquidationDetailsComponent } from './components/treasury-liquidation-details/treasury-liquidation-details.component';
import { CertificateListComponent } from './components/certificate-list/certificate-list.component';
import { TreasuryCollectionCommentsComponent } from './components/treasury-collection-comments/treasury-collection-comments.component';
import { TreasuryLiquidationCommentsComponent } from './components/treasury-liquidation-comments/treasury-liquidation-comments.component';

@NgModule({
    imports: [CommonModule, SharedModule, RouterModule],
    declarations: [
        TreasuryProductSetupComponent,
        TreasuryProductTypeListComponent,
        TreasuryProductListComponent,
        TreasuryProductComponent,
        IssuerListComponent,
        IssuerInfoComponent,
        TreasuryPlacementListComponent,
        TreasuryPlacementComponent,
        TreasuryCustomerListComponent,
        TreasuryCollectionComponent,
        TreasuryLiquidationComponent,
        TreasuryLiquidationAppraisalComponent,
        TreasuryCollectionAppraisalComponent,
        TreasuryLiquidationComponent,
        TreasuryCollectionComponent,
        TreasuryCollectionAppraisalComponent,
        TreasuryCustomerListComponent,
        TreasuryPlacementListComponent,
        TreasuryPlacementComponent,
        TreasuryInvestmentAppraisalComponent,
        TreasuryCustomerDetailsComponent,
        TreasuryInvestmentDetailsComponent,
        TreasuryInvestmentApprovalCommentComponent,
        TreasuryCollectionDetailsComponent,
        TreasuryLiquidationDetailsComponent,
        CertificateListComponent,
        TreasuryCollectionCommentsComponent,
        TreasuryLiquidationCommentsComponent
    ],
    providers: [TreasuryService]
})
export class TreasuryModule {}
