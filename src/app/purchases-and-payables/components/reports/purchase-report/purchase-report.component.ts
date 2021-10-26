import { Component, OnInit } from '@angular/core';
import {LoadingService} from "../../../../core/services/loading.service";
import {PurchaseService} from "../../../../core/services/purchase.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import swal from 'sweetalert2'
@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {
  form: FormGroup;
  report: any[] = [];
  cols: any[];
  viewHeight: string = '600px';
  constructor(
    private loadingService: LoadingService,
    private purchaseService: PurchaseService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      fromDate: [''],
      toDate: ['']
    })
  }

  getReport(form: FormGroup) {
    const {fromDate, toDate} = form.value;
    if (!fromDate) {
      return swal.fire('GOS FINANCIAL', 'Select start date', 'error')
    }
    if (!toDate) {
      return swal.fire('GOS FINANCIAL', 'Select end date', 'error')
    }
    this.loadingService.show();
    return this.purchaseService.getPurchaseReport(fromDate, toDate).subscribe(data => {
      this.loadingService.hide();
      this.report = data.purchAndsPayables
    }, err => {
      this.loadingService.hide()
    })
  }
}
