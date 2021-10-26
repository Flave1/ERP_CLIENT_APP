import { Component, OnInit } from "@angular/core";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { Router } from "@angular/router";
import { LoadingService } from "../../../core/services/loading.service";

@Component({
  selector: 'app-pending-rollover',
  templateUrl: './pending-rollover.component.html',
  styleUrls: ['./pending-rollover.component.css']
})
export class PendingRolloverComponent implements OnInit {

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
    this.getPendingRollover();
  }
  getPendingRollover() {
    this.loadingService.show();
    return this.investorFundService.getPendingCustomerRollover().subscribe(
      data => {
        this.loadingService.hide();
        this.investments = data.rollOver;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  selectRow(event: any) {
    this.router.navigate(["/investor/rollover"], {
      queryParams: {
        investorFundIdWebsiteRolloverId: event.investorFundIdWebsiteRolloverId
      }
    });
  }
}
