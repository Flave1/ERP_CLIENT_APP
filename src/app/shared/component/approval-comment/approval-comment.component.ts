import { Component, OnInit, Input } from "@angular/core";
import { CreditAppraisalService } from "src/app/core/services/credit-appraisal.service";

@Component({
    selector: "app-approval-comment",
    templateUrl: "./approval-comment.component.html"
})
export class ApprovalCommentComponent implements OnInit {
    trails: any[] = [];
    @Input() workFlowToken: string;
    @Input() set applicationId(value: number) {
        if (value > 0) this.getApprovalTrail(value, this.workFlowToken);
    }
    constructor(private creditAppraisalService: CreditAppraisalService) {}

    ngOnInit() {}
    getApprovalTrail(targetId, workflowToken) {
        this.creditAppraisalService
            .getApprovalTrail(targetId, workflowToken)
            .subscribe(data => {
                this.trails = data.details;
            });
    }
}
