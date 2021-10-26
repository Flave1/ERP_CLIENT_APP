import { Component, OnInit } from '@angular/core';
import { PurchaseService } from "../../../core/services/purchase.service";
import { LoadingService } from "../../../core/services/loading.service";
import { count } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html',
  styleUrls: ['./purchase-dashboard.component.css']
})
export class PurchaseDashboardComponent implements OnInit {
  data: any;
  ageAnalysis: any;
  purchasableDays: any;
  payableDaysAnalysis: any;
  projectStatus: any;
  dashboardCount: any = {};
  payableDays: any[] = [];
  supplierTypes: any[] = []
  constructor(
    private purchaseService: PurchaseService,
    private loadingService: LoadingService,
    public router: Router
  ) { }

  ngOnInit() {
    this.getCounts();
    this.getProjectStatus();
    this.getAgingAnalyis();
    this.getPayableDaysCount();
    this.getPurchasableDaysAnalysis();
    this.getPayableDaysAnalysis();
  }
  getCounts() {
    this.loadingService.show();
    return this.purchaseService.getCounts().subscribe(data => {
      this.loadingService.hide();
      this.dashboardCount = data.dashboardCount
    }, err => {
      this.loadingService.hide()
    })
  }
  getProjectStatus() {
    this.loadingService.show();
    return this.purchaseService.getProjectStatus().subscribe(data => {
      this.loadingService.hide();
      this.projectStatus = {
        labels: data.labels,
        datasets: [
          {
            label: data.datasets[0].label,
            backgroundColor: '#ff6347',
            borderColor: '#ff6347',
            data: data.datasets[0].data
          },
        ]
      }
    }, err => {
      this.loadingService.hide()
    })
  }
  getAgingAnalyis() {
    this.loadingService.show();
    return this.purchaseService.getAgingAnalysis().subscribe(data => {
      this.loadingService.hide();
      const res = data.datasets[0].data
      const filteredData = res.filter(item => {
        return item !== 0
      });

      this.ageAnalysis = {
        labels: data.labels,
        datasets: [
          {
            label: data.datasets[0].label,
            backgroundColor: '#7B79FF',
            borderColor: '#7B79FF',
            data: data.datasets[0].data
          },
        ]
      }
    }, err => {
      this.loadingService.hide()
    })
  }

  getPayableDaysCount() {
    this.loadingService.show();
    return this.purchaseService.getPayableDaysCount().subscribe(data => {
      this.loadingService.hide();
      this.supplierTypes = data.labels;
      this.payableDays = data.payableDays[0].data;

    }, err => {
      this.loadingService.hide()
    })
  }

  getPurchasableDaysAnalysis() {
    this.loadingService.show();
    return this.purchaseService.getPurchDaysAnalysis().subscribe(data => {
      this.loadingService.hide();
      this.purchasableDays = {
        labels: data.labels,
        datasets: [
          {
            label: data.datasets[0].label,
            backgroundColor: '#ff6347',
            borderColor: '#ff6347',
            data: data.datasets[0].data
          },
        ]
      }
    }, err => {
      this.loadingService.hide()
    })
  }

  getPayableDaysAnalysis() {
    this.loadingService.show();
    return this.purchaseService.getPayableTrendAnalysis().subscribe(data => {
      this.loadingService.hide();
      this.payableDaysAnalysis = {
        labels: data.labels,
        datasets: [
          {
            label: data.datasets[0].label,
            backgroundColor: '#ff6347',
            borderColor: '#ff6347',
            data: data.datasets[0].data
          },
        ]
      }
    }, err => {
      this.loadingService.hide()
    })
  }
}
