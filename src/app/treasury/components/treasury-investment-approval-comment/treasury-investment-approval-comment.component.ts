import {Component, Input, OnInit} from '@angular/core';
import {CreditAppraisalService} from '../../../core/services/credit-appraisal.service';
import {TreasuryService} from "../../../core/services/treasury.service";

@Component({
  selector: 'app-treasury-investment-approval-comment',
  templateUrl: './treasury-investment-approval-comment.component.html',
  styleUrls: ['./treasury-investment-approval-comment.component.css']
})
export class TreasuryInvestmentApprovalCommentComponent implements OnInit {

    trails: any[] = [];
    @Input() workflowToken: string;
    @Input() set investmentId(value: number) {
        if (value > 0) this.getApprovalTrail(value, this.workflowToken);
    }
    constructor(private treasuryService: TreasuryService) {}

    ngOnInit() {}
    getApprovalTrail(loanApplicationId, token) {
        this.treasuryService
            .getInvestmentAppraisalComments(loanApplicationId, token)
            .subscribe(data => {
                this.trails = data.aprovalDetails;
            });
    }


}
