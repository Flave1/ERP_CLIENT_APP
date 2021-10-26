import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {LoanApplicationService} from '../../../core/services/loanapplication.service';
import {Router} from '@angular/router';
import {InvestorFundService} from '../../../core/services/investor-fund.service';
import {TreasuryService} from '../../../core/services/treasury.service';

@Component({
  selector: 'app-treasury-placement-list',
  templateUrl: './treasury-placement-list.component.html',
  styleUrls: ['./treasury-placement-list.component.css']
})
export class TreasuryPlacementListComponent implements OnInit {

    investmentsLists: any[] = [];
    selectedLoanApplication: any = {};
    viewHeight: any = '600px';
    cols: any[];
    constructor(
        private loadingService: LoadingService,
        private loanApplicationService: LoanApplicationService,
        private router: Router,
        private investorFundService: InvestorFundService,
        private treasuryService: TreasuryService
    ) {}

    ngOnInit() {
        this.cols = [
            { field: "applicationRefNumber", header: "applicationRefNumber" },
            { field: "customerName", header: "customerName" },
            { field: "proposedAmount", header: "proposedAmount" },
            // { field: "currentExposure", header: "currentExposure" },
            // { field: "totalExposure", header: "totalExposure" }
        ];
        this.getInvestments();
    }

    getInvestments() {
        this.loadingService.show();
        this.treasuryService.getAllIssuerInvestments().subscribe(data => {
            this.loadingService.hide();
            this.investmentsLists = data.issuerInvestments
        }, err => {
            this.loadingService.hide()
        });
    }
    getApplicationStatus(approvalStatus) {
        if (approvalStatus == 0)
            return '<span class="label label-info"> Pending </span>';
        if (approvalStatus == 1)
            return '<span class="label label-success">Running</span>';
        if (approvalStatus == 2)
            return '<span class="label label-danger">Matured</span>';
        if (approvalStatus == 3)
            return '<span class="label label-danger">Liquidated</span>';
        if (approvalStatus == 4)
            return '<span class="label label-warning">Closed </span>';

        return '<span class="label label-warning">N/A </span>';
    }
    // onRowSelect(event) {
    //     if (event.data.loanApplicationStatusId == 1) {
    //         this.router.navigate([
    //             "/credit/eligibility-check",
    //             event.data.loanApplicationId
    //         ]);
    //     }
    // }
    addDays(theDate, days) {
        return new Date(theDate.getTime() + days*24*60*60*1000);
    }
    getMaturityDate() {
        this.investmentsLists.forEach(investment => {
            return this.addDays(new Date(), investment.period)
        })
    }
    collection(row) {
        this.router.navigate(["/treasury/collection"], {
            queryParams: {
                issuerId: row.issuerRegistrationId, investmentId: row.treasureIssuerInvestmentId
            }
        });
    };
    liquidate(row) {
        this.router.navigate(["/treasury/liquidate"], {
            queryParams: {
                issuerId: row.issuerRegistrationId, investmentId: row.treasureIssuerInvestmentId
            }
        });
    }

    rollover(x) {

    }

    filterResults(value: any) {

    }
    showAddNew() {
        this.router.navigate(["/treasury/placement-info"]);
    }

}
