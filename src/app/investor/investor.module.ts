import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductComponent } from "./components/product/product.component";
import { ProductListsComponent } from "./components/product-lists/product-lists.component";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { InvestorProductListsComponent } from "./components/investor-product-lists/investor-product-lists.component";
import { InvestorProductComponent } from "./components/investor-product/investor-product.component";
import { InvestorProductSetUpComponent } from "./components/investor-product-set-up/investor-product-set-up.component";
import {InvestorFundService} from '../core/services/investor-fund.service';
import { InvestorCustomerComponent } from './components/investor-customer/investor-customer.component';
import { InvestorCustomerListComponent } from './components/investor-customer-list/investor-customer-list.component';
import { InvestorListComponent } from './components/investor-list/investor-list.component';
import { InvestorListInfoComponent } from './components/investor-list-info/investor-list-info.component';
import { ProductTypeListComponent } from './components/product-type-list/product-type-list.component';
import { CollectionComponent } from './components/collection/collection.component';
import { LiquidateComponent } from './components/liquidate/liquidate.component';
import { RolloverComponent } from './components/rollover/rollover.component';
import { InvestmentslistsComponent } from './components/investmentslists/investmentslists.component';
import { InvestmentAppraisalComponent } from './components/investment-appraisal/investment-appraisal.component';
import { InvestmentCustomerDetailsComponent } from './components/investment-customer-details/investment-customer-details.component';
import { InvestmentDetailsComponent } from './components/investment-details/investment-details.component';
import { CollectionAppraisalComponent } from './components/collection-appraisal/collection-appraisal.component';
import { LiquidationAppraisalComponent } from './components/liquidation-appraisal/liquidation-appraisal.component';
import { InvestmentApprovalCommentComponent } from './components/investment-approval-comment/investment-approval-comment.component';
import { LiquidationDetailsComponent } from './components/liquidation-details/liquidation-details.component';
import { CollectionDetailsComponent } from './components/collection-details/collection-details.component';
import { PlacementCertificateComponent } from './components/placement-certificate/placement-certificate.component';
import { PlacementCertificateListComponent } from './components/placement-certificate-list/placement-certificate-list.component';
import { InvestorDashboardComponent } from './components/investor-dashboard/investor-dashboard.component';
import {ChartModule} from 'primeng/chart';
import { InvestorReportComponent } from './components/reports/investor-report/investor-report.component';
import { InvestmentReportComponent } from './components/reports/investment-report/investment-report.component';
import { InvestmentProductTypeListComponent } from './components/investment-product-type-list/investment-product-type-list.component';
import { PendingInvestmentsComponent } from './components/pending-investments/pending-investments.component';
import { PendingLiquidationComponent } from './components/pending-liquidation/pending-liquidation.component';
import { PendingCollectionComponent } from './components/pending-collection/pending-collection.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { CustomerTransactionComponent } from './components/customer-transaction/customer-transaction.component';

@NgModule({
    imports: [CommonModule, SharedModule, RouterModule, ChartModule],
    declarations: [
        ProductComponent,
        ProductListsComponent,
        InvestorProductListsComponent,
        InvestorProductComponent,
        InvestorProductSetUpComponent,
        InvestorCustomerComponent,
        InvestorCustomerListComponent,
        InvestorListComponent,
        InvestorListInfoComponent,
        ProductTypeListComponent,
        CollectionComponent,
        LiquidateComponent,
        RolloverComponent,
        InvestmentslistsComponent,
        // InvestmentAppraisalComponent,
        // InvestmentCustomerDetailsComponent,
        // InvestmentDetailsComponent,
        CollectionAppraisalComponent,
        LiquidationAppraisalComponent,
        // InvestmentApprovalCommentComponent,
        LiquidationDetailsComponent,
        CollectionDetailsComponent,
        PlacementCertificateComponent,
        PlacementCertificateListComponent,
        InvestorDashboardComponent,
        InvestorReportComponent,
        InvestmentReportComponent,
        InvestmentProductTypeListComponent,
        PendingInvestmentsComponent,
        PendingLiquidationComponent,
        PendingCollectionComponent,
        PaymentsComponent,
        CustomerTransactionComponent
    ],
    providers: [InvestorFundService]
})
export class InvestorModule {}
