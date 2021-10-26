import {Component, Input, OnInit} from '@angular/core';
import {TreasuryService} from "../../../core/services/treasury.service";

@Component({
  selector: 'app-treasury-liquidation-comments',
  templateUrl: './treasury-liquidation-comments.component.html',
  styleUrls: ['./treasury-liquidation-comments.component.css']
})
export class TreasuryLiquidationCommentsComponent implements OnInit {

  trails: any[] = [];
  @Input() workflowToken: string;
  @Input() set investmentId(value: number) {
    if (value > 0) this.getApprovalTrail(value, this.workflowToken);
  }
  constructor(private treasuryService: TreasuryService) {}

  ngOnInit() {}
  getApprovalTrail(loanApplicationId, token) {
    this.treasuryService
      .getLiquidationComments(loanApplicationId, token)
      .subscribe(data => {
        this.trails = data["result"];
      });
  }


}
