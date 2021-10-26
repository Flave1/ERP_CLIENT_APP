import { Component, OnInit } from "@angular/core";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { Router } from "@angular/router";
import { LoadingService } from "../../../core/services/loading.service";

@Component({
  selector: "app-pending-investments",
  templateUrl: "./pending-investments.component.html",
  styleUrls: ["./pending-investments.component.css"]
})
export class PendingInvestmentsComponent implements OnInit {
  investments: any[] = [];
  cols: any[];
  selectedInvestment: any;
  viewHeight: string = "600px";
  constructor(
    private investmentService: InvestorFundService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.getPendingInvestments();
  }
  getPendingInvestments() {
    this.loadingService.show();
    return this.investmentService.getPendingInvestments().subscribe(
      data => {
        this.loadingService.hide();
        this.investments = data.investorFunds;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getApplicationStatus(investmentStatus: any) {}

  selectRow(event: any) {
    this.router.navigate(["/investor/investor-list-info"], {
      queryParams: {
        investorId: event.investorFundCustomerId,
        customerInvestmentId: event.websiteInvestorFundId
      }
    });
  }
}
