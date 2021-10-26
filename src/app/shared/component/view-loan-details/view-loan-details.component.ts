import { LoadingService } from "./../../../core/services/loading.service";
import { Component, OnInit, Input } from "@angular/core";
import { LoanService } from "src/app/core/services/loan.service";

@Component({
    selector: "app-view-loan-details",
    templateUrl: "./view-loan-details.component.html"
})
export class ViewLoanDetailsComponent implements OnInit {
    selectedLoan: any;
    _loanId: number;
    get loanId(): number {
        return this._loanId;
    }
    @Input() set loanId(value: number) {
        this._loanId = value;
        if (value > 0) this.getLoanDetailInformation(value);
    }
    constructor(
        private loadingService: LoadingService,
        private loanService: LoanService
    ) {}

    ngOnInit() {}

    getLoanDetailInformation(loanId) {
        this.loadingService.show();
        this.loanService.getLoanDetailInformation(loanId).subscribe(data => {
            this.loadingService.hide();
            this.selectedLoan = data.loanDetail;
        });
    }
}
