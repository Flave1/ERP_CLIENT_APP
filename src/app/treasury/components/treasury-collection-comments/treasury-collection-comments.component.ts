import {Component, Input, OnInit} from '@angular/core';
import {TreasuryService} from "../../../core/services/treasury.service";

@Component({
  selector: 'app-treasury-collection-comments',
  templateUrl: './treasury-collection-comments.component.html',
  styleUrls: ['./treasury-collection-comments.component.css']
})
export class TreasuryCollectionCommentsComponent implements OnInit {
  trails: any[] = [];
  @Input() workFlowToken: string;
  @Input() set applicationId(value: number) {
    if (value > 0) this.getApprovalTrail(value, this.workFlowToken);
  }
  constructor(private treasuryService: TreasuryService) { }

  ngOnInit() {
  }
  getApprovalTrail(targetId, workflowToken) {
    this.treasuryService
      .getCollectionComments(targetId, workflowToken)
      .subscribe(data => {
        this.trails = data.details;
      });
  }
}
