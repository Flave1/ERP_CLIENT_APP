import { Component, OnInit } from "@angular/core";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { Router } from "@angular/router";
import { LoadingService } from "../../../core/services/loading.service";

@Component({
  selector: "app-pending-liquidation",
  templateUrl: "./pending-liquidation.component.html",
  styleUrls: ["./pending-liquidation.component.css"]
})
export class PendingLiquidationComponent implements OnInit {
  investments: any[] = [];
  cols: any[];
  selectedInvestment: any;
  viewHeight: string;

  constructor(
    private investorFundService: InvestorFundService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.getPendingLiquidations();
  }
  getPendingLiquidations() {
    this.loadingService.show();
    return this.investorFundService.getPendingCustomerLiquidations().subscribe(
      data => {
        this.loadingService.hide();
        this.investments = data.liquidations;
      },
      err => {
        this.loadingService.hide();

      }
    );
  }

  selectRow(event: any) {
    this.router.navigate(["/investor/liquidate"], {
      queryParams: {
        investorId: event.investorFundCustomerId,
        websiteLiquidationOperationId: event.websiteLiquidationOperationId
      }
    });
  }
}
