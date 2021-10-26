import { Component, OnInit } from "@angular/core";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { Router } from "@angular/router";
import { LoadingService } from "../../../core/services/loading.service";

@Component({
  selector: "app-pending-collection",
  templateUrl: "./pending-collection.component.html",
  styleUrls: ["./pending-collection.component.css"]
})
export class PendingCollectionComponent implements OnInit {
  investments: any[] = [];
  selectedInvestment: any;
  cols: any[];
  viewHeight: string;

  constructor(
    private investorFundService: InvestorFundService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.getPendingCollections();
  }
  getPendingCollections() {
    this.loadingService.show();
    return this.investorFundService.getCustomerPendingCollections().subscribe(
      data => {
        this.loadingService.hide();
        this.investments = data.collections;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  selectRow(event: any) {
    this.router.navigate(["/investor/collection"], {
      queryParams: {
        investorId: event.investorFundCustomerId,
        websiteCollectionOperationId: event.websiteCollectionOperationId
      }
    });
  }
}
