import { Component, OnInit } from '@angular/core';
import {LoadingService} from "../../../../core/services/loading.service";
import {PurchaseService} from "../../../../core/services/purchase.service";
import swal from 'sweetalert2'
@Component({
  selector: 'app-aging-analysis',
  templateUrl: './aging-analysis.component.html',
  styleUrls: ['./aging-analysis.component.css']
})
export class AgingAnalysisComponent implements OnInit {
  dateFrom: any;
  date1: string;
  year1: number;
  dateTo: any;
  date2: string;
  reports: any[] = [];
  cols: any[] = [];
  viewHeight: string = '600px';
  constructor(
    private loadingService: LoadingService,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit() {
  }
  onDateSelect(event, number) {
    if (number === 1) {
      let d = new Date(Date.parse(event));
      this.year1 = d.getFullYear();
      this.date1 = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
    if (number === 2) {
      let d = new Date(Date.parse(event));
      this.year1 = d.getFullYear();
      this.date2 = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
  }

  getReport() {
    if (!this.date1) {
      return swal.fire('GOS FINANCIAL', 'Select start date', 'error')
    }
    if (!this.date2) {
      return swal.fire('GOS FINANCIAL', 'Select end date', 'error')
    }
    this.loadingService.show();
    return this.purchaseService.getAgingAnalysisReport(this.date1, this.date2).subscribe(data => {
      this.loadingService.hide();
      this.reports = data.aagingAnalysis;
    }, err => {
      this.loadingService.hide()
    })
  }
}
