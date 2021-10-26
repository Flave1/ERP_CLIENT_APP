import { Component, Input, OnInit } from "@angular/core";
import { CreditAppraisalService } from "../../../core/services/credit-appraisal.service";
import { TreasuryService } from "../../../core/services/treasury.service";

@Component({
  selector: "app-investment-approval-comment",
  templateUrl: "./investment-approval-comment.component.html",
  styleUrls: ["./investment-approval-comment.component.css"]
})
export class InvestmentApprovalCommentComponent implements OnInit {
  trails: any[] = [];
  @Input() workFlowToken: string;
  @Input() set investmentId(value: number) {
    if (value > 0) this.getApprovalTrail(value, this.workFlowToken);
  }
  constructor(
    private creditAppraisalService: CreditAppraisalService,
    private treasuryService: TreasuryService
  ) {}

  ngOnInit() {}
  getApprovalTrail(loanApplicationId, operationId) {
    this.creditAppraisalService
      .getApprovalTrail(loanApplicationId, operationId)
      .subscribe(data => {
        this.trails = data.details;
      });
  }
}
