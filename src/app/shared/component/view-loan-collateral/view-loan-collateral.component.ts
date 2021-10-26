import { Component, OnInit, Input } from "@angular/core";
import { CollateralService } from "src/app/core/services/collateral.service";

@Component({
    selector: "app-view-loan-collateral",
    templateUrl: "./view-loan-collateral.component.html"
})
export class ViewLoanCollateralComponent implements OnInit {
    loanCollaterals: any[];
    _loanApplicationId: number;
    collateralValue: number;
    get loanApplicationId(): number {
        return this._loanApplicationId;
    }
    @Input() set loanApplicationId(value: number) {
        this._loanApplicationId = value;
        if (value > 0) {
            this.getAllLoanCollateral(value);
        }
    }
    constructor(private collateralService: CollateralService) {}

    ngOnInit() {}

    getAllLoanCollateral(loanApplicationId) {
        this.collateralService
            .getLoanCollateral(loanApplicationId)
            .subscribe(data => {
                this.loanCollaterals = data.loanApplicationCollaterals;
                if(this.loanCollaterals.length > 0){
                    this.collateralValue = this.loanCollaterals[0].collateralValue;
                }else{
                    this.collateralValue = 0.00;
                }
            });
    }
}
