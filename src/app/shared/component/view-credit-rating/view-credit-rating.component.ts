import { Component, OnInit, Input } from "@angular/core";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";

@Component({
    selector: "app-view-credit-rating",
    templateUrl: "./view-credit-rating.component.html"
})
export class ViewCreditRatingComponent implements OnInit {
    creditRatingDetail: any = {};
    _loanApplicationId: number;
    get loanApplicationId(): number {
        return this._loanApplicationId;
    }
    @Input() set loanApplicationId(value: number) {
        this._loanApplicationId = value;
        if (value > 0) this.getCreditRatingDetail(value);
    }
    constructor(
        private creditRiskScoreCardService: CreditRiskScoreCardService
    ) {}

    ngOnInit() {}
    getCreditRatingDetail(loanApplicationId) {
        this.creditRiskScoreCardService
            .getCreditRatingDetail(loanApplicationId)
            .subscribe(data => {
                this.creditRatingDetail = data.creditRiskRatingDetails;
            });
    }
}
