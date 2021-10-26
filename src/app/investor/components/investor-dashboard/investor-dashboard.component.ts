import { Component, OnInit } from "@angular/core";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { LoadingService } from "../../../core/services/loading.service";

import swal from "sweetalert2";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-investor-dashboard",
  templateUrl: "./investor-dashboard.component.html",
  styleUrls: ["./investor-dashboard.component.css"]
})
export class InvestorDashboardComponent implements OnInit {
  data: any;
  doughnutData: any;
  height: string = "500px";
  investments: any = 0;
  productLists: any[] = [];
  productId: any = "";
  amount: any;
  interest: any;
  period: any;
  fv_value: any = 0;
  productInfo: any;
  investmentDetails: any;
  frequency: string;
  display: any;
  frequencyId: number;
  constructor(
    private investorFundService: InvestorFundService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.data = {
    //     labels: [
    //         "January",
    //         "February",
    //         "March",
    //         "April",
    //         "May",
    //         "June",
    //         "July"
    //     ],
    //     datasets: [
    //         {
    //             label: "Investments",
    //             data: [65, 59, 80, 81, 56, 55, 40],
    //             fill: false,
    //             borderColor: "#4bc0c0"
    //         },
    //         {
    //             label: "Collections",
    //             data: [28, 48, 40, 19, 86, 27, 90],
    //             fill: false,
    //             borderColor: "#565656"
    //         },
    //         {
    //             label: "Liquidations",
    //             data: [78, 48, 60, 19, 86, 47, 20],
    //             fill: false,
    //             borderColor: "#FF6384"
    //         }
    //     ]
    // };
    // this.doughnutData = {
    //     labels: ["A", "B", "C"],
    //     datasets: [
    //         {
    //             data: [300, 50, 100],
    //             backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    //             hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
    //         }
    //     ]
    // };
    // this.getInvestments();
    this.getProducts();
    this.getInvestmentDetails();
    this.getInvestmentChart();
    this.getInvestmentConcentration();
  }
  getInvestments() {
    this.loadingService.show();
    return this.investorFundService.getInvestments().subscribe(
      data => {
        this.loadingService.hide();
        if (data.result.length > 0) {
          this.investments = data.investorFunds.length;
        } else {
          return this.investments;
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getProducts() {
    return this.investorFundService.getProducts().subscribe(
      data => {
        this.productLists = data.infProducts;
      },
      err => {

      }
    );
  }
  getProduct(id: any) {
    this.loadingService.show();
    return this.investorFundService.getProduct(id).subscribe(
      data => {
        this.loadingService.hide();
        this.productInfo = data.infProducts[0];
        this.interest = this.productInfo.interestRateAnnual;
        this.period = this.productInfo.maximumPeriod;
        this.frequency = this.productInfo.frequencyName;
        if (this.frequency !== null) {
          this.display = `${this.interest}% (${this.frequency})`;
        } else {
          this.display = `${this.interest}%`;
        }

      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  calculateFv() {
    if (!this.productId) {
      return swal.fire("GOS FINANCIALS", "Select Product", "error");
    }
    if (!this.amount) {
      return swal.fire("GOS FINANCIALS", "Amount is required", "error");
    }
    if (!this.interest) {
      return swal.fire("GOS FINANCIALS", "Interest is required", "error");
    }
    if (!this.period) {
      return swal.fire("GOS FINANCIALS", "Period is required", "error");
    }
    this.fv_value = (
      this.amount * Math.pow(1 + this.interest / 100, this.period)
    ).toFixed(2);
  }
  getInvestmentDetails() {
    this.loadingService.show();
    return this.investorFundService.getInvestmentDetails().subscribe(
      data => {
        this.loadingService.hide();
        this.investmentDetails = data.investmentApplicationDetail;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  goToInvestments() {
    this.router.navigateByUrl("/investor/pending-investments");
  }
  goToPendingCollections() {
    this.router.navigateByUrl("/investor/pending-collections");
  }
  goToPendingLiquidations() {
    this.router.navigateByUrl("/investor/pending-liquidations");
  }
  goToPendingRollover() {
    this.router.navigateByUrl("/investor/pending-rollover");
  }
  goToPendingTopUp() {
    this.router.navigateByUrl("/investor/pending-topup");
  }

  getInvestmentConcentration(): Subscription {
    this.loadingService.show();
    return this.investorFundService.getInvestmentConcentration().subscribe(
      data => {
        this.loadingService.hide();
        this.doughnutData = {
          labels: data.investmentConcentration.labels,
          datasets: [
            {
              data: data.investmentConcentration.datasets.data,
              backgroundColor:
                data.investmentConcentration.datasets.backgroundColor,
              hoverBackgroundColor:
                data.investmentConcentration.datasets.hoverBackgroundColor
            }
          ]
        };
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getInvestmentChart(): Subscription {
    this.loadingService.show();
    return this.investorFundService.getInvestmentChart().subscribe(
      data => {
        this.loadingService.hide();
        this.data = {
          labels: data.investmentChart.labels,
          datasets: [
            {
              label: data.investmentChart.datasets[0].label,
              data: data.investmentChart.datasets[0].data,
              fill: data.investmentChart.datasets[0].fill,
              borderColor: data.investmentChart.datasets[0].borderColor
            },
            {
              label: data.investmentChart.datasets[1].label,
              data: data.investmentChart.datasets[1].data,
              fill: data.investmentChart.datasets[1].fill,
              borderColor: data.investmentChart.datasets[1].borderColor
            },
            {
              label: data.investmentChart.datasets[2].label,
              data: data.investmentChart.datasets[2].data,
              fill: data.investmentChart.datasets[2].fill,
              borderColor: data.investmentChart.datasets[2].borderColor
            }
          ]
        };
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
}
