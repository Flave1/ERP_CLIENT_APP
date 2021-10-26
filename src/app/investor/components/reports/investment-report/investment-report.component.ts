import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectItem} from 'primeng/api/selectitem';
import {LoadingService} from '../../../../core/services/loading.service';
import {TrialBalanceService} from '../../../../core/services/trialbalance.service';
import {CompanyService} from '../../../../core/services/company.service';
import {Router} from '@angular/router';
import {FinancalYearService} from '../../../../core/services/financal-year.service';
import {ReportService} from '../../../../core/services/report.service';
import {DomSanitizer} from '@angular/platform-browser';
import swal from "sweetalert2";
// import {Column} from 'primeng/shared';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-investment-report',
  templateUrl: './investment-report.component.html',
  styleUrls: ['./investment-report.component.css']
})
export class InvestmentReportComponent implements OnInit {
  cols: any[];
  fileToUpload: File;
  viewHeight: any = "600px";
  trialBalanceInformation: any[] = [];
  companyInformation: any[] = [];
  displayProcessReport = false;
  form: FormGroup;
  dateTo: any;
  dateFrom: any;
  companyId: any = "0";
  period: any;
  sub: any;
  financialYear: any[] = [];
  customerType: any;
  columns: SelectItem[];
  column: any;
  selectedColumn: any;
  corporateColumns: SelectItem[];
  date1: any;
  year1: any;
  year2: any;
  date2: any;
  displayTestReport: boolean;
  reportSrc: any;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private trialBalanceService: TrialBalanceService,
    private companyService: CompanyService,
    private router: Router,
    private financialYearService: FinancalYearService,
    private reportService: ReportService,
    private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      trialBalanceId: [0],
      companyId: ["", Validators.required],
      companyCode: ["", Validators.required],
      runDate: ["", Validators.required]
    });
    this.columns = [];
    this.corporateColumns = [];
  }

  ngOnInit() {
    this.cols = [
      { field: "glCode", header: "glCode" },
      { field: "glDescription", header: "glDescription" },
      { field: "currencyCode", header: "currencyCode" },
      { field: "companyCode", header: "companyCode" }
    ];
    // this.getAllTrialBalance();
    this.getAllCompany();
    this.getColumns()
  }

  getColumns() {
      this.loadingService.show();
      return this.reportService.getInvestmentColumn().subscribe(
        data => {
          this.loadingService.hide();
          if (data.success) {
            let individualColumn: any[];
            individualColumn = data.result;
            individualColumn.forEach(column => {
              this.columns.push({
                label: column.name,
                value: { name: column.name }
              });
            });
          } else {
            this.loadingService.hide();
          }
        },
        err => {
          this.loadingService.hide();

        }
      );
  }
  processReport() {
    this.getAllCompany();
    this.displayProcessReport = true;
  }

  getAllCompany() {
    this.loadingService.show();
    this.companyService.getAllCompanyStructure().subscribe(data => {
      this.loadingService.hide();
      this.companyInformation = data.companyStructures;

    }, err => {
      this.loadingService.hide()
    });
  }

  processData(form) {
    if (!this.companyId) {
      swal.fire("GOS FINANCIAL", "Please select Company", "error");
      return;
    }
    if (!this.dateFrom) {
      swal.fire("GOS FINANCIAL", "Please select Start Date", "error");
      return;
    }
    if (!this.dateTo) {
      swal.fire("GOS FINANCIAL", "Please select End Date", "error");
      return;
    }
    const body = {
      comp: this.companyId,
      date1: this.dateFrom,
      date2: this.dateTo,
      period: this.period,
      sub: this.sub
    };
    this.loadingService.show();
    this.trialBalanceService.getTrialBalanceBysearch(body).subscribe(
      data => {
        this.loadingService.hide();
        if (data["result"] != null) {
          this.trialBalanceInformation = data["result"];
          //this.displayProcessReport = false;
        } else {
          swal.fire("GOS FINANCIAL", data["message"], "error");
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
      }
    );
  }
  onDateSelect(event, number) {
    if (number === 1) {
      let d = new Date(Date.parse(event));
      this.year1 = d.getFullYear();
      this.date1 = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
    if (number === 2) {
      let d = new Date(Date.parse(event));
      this.year2 = d.getFullYear();
      this.date2 = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
  }
  getReport() {
    if (! this.date1) {
      return swal.fire(`GOS FINANCIAL`, 'Select start date', 'error')
    }
    if (! this.date2) {
      return swal.fire(`GOS FINANCIAL`, 'Select end date', 'error')
    }
    let path: string = `${environment.report_url}/Reporter/InvestmentReport?date1=${this.date1}&date2=${this.date2}`;
    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    this.displayTestReport = true;
    // return this.reportService
    //   .getInvestmentReport(this.date1, this.date2)
    //   .subscribe(data => {
    //     this.loadingService.hide();
    //     if (data.result != null) {
    //       path = data.result;
    //       this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    //       this.displayTestReport = true;
    //     } else {
    //       return swal.fire("GOS FINANCIAL", data["message"], "error");
    //     }
    //   }, err => {
    //     this.loadingService.hide()
    //   });
  }

}
