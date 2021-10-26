import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { LoadingService } from "../../../../core/services/loading.service";
import { TrialBalanceService } from "../../../../core/services/trialbalance.service";
import { CompanyService } from "../../../../core/services/company.service";
import { Router } from "@angular/router";
import { FinancalYearService } from "../../../../core/services/financal-year.service";
import swal from "sweetalert2";
import { ReportService } from "../../../../core/services/report.service";
import { DomSanitizer } from "@angular/platform-browser";
import {environment} from "../../../../../environments/environment";

interface Column {
  name: string;
  id: number;
}
@Component({
  selector: "app-loan-report",
  templateUrl: "./loan-report.component.html",
  styleUrls: ["./loan-report.component.css"]
})
export class LoanReportComponent implements OnInit {
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
  columns: SelectItem[];
  column: any;
  selectedColumn: Column;
  reportTitle: any = 0;
  year1: number;
  date2: string;
  date1: string;
  reportSrc: any;
  displayTestReport: boolean;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private trialBalanceService: TrialBalanceService,
    private companyService: CompanyService,
    private router: Router,
    private financialYearService: FinancalYearService,
    private reportService: ReportService,
    private domSanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      trialBalanceId: [0],
      companyId: ["", Validators.required],
      companyCode: ["", Validators.required],
      runDate: ["", Validators.required]
    });
    this.columns = [
      { label: "Loan ID", value: { id: 1, name: "Loan ID" } },
      {
        label: "Product Name",
        value: { id: 2, name: "Product Name" }
      },
      {
        label: "Linked Account Number",
        value: { id: 3, name: "Linked Account Number" }
      },
      { label: "Customer Name", value: { id: 4, name: "Customer Name" } },
      {
        label: "Industry",
        value: { id: 5, name: "Industry" }
      },
      {
        label: "Disbursement Date",
        value: { id: 5, name: "Disbursement Date" }
      },
      {
        label: "Maturity Date",
        value: { id: 6, name: "Maturity Date" }
      },
      {
        label: "Application Amount",
        value: { id: 7, name: "Application Amount" }
      },
      {
        label: "Approved Amount",
        value: { id: 8, name: "Approved Amount" }
      },
      {
        label: "Disbursed Amount",
        value: { id: 9, name: "Disbursed Amount" }
      },
      { label: "Tenor", value: { id: 10, name: "Tenor" } },
      {
        label: "Interest rate",
        value: { id: 11, name: "Interest rate" }
      },
      {
        label: "Total Principal",
        value: { id: 12, name: "Total Principal" }
      },
      {
        label: "Total Interest",
        value: { id: 13, name: "Total Interest" }
      },
      {
        label: "Collateral type",
        value: { id: 14, name: "Collateral type" }
      },
      {
        label: "Collateral Amount",
        value: { id: 15, name: "Collateral Amount" }
      },
      {
        label: "Repayment date",
        value: { id: 16, name: "Repayment date" }
      },
      {
        label: "Repament Amount",
        value: { id: 17, name: "Repament Amount" }
      },
      {
        label: "Last Activity Date",
        value: { id: 18, name: "Last Activity Date" }
      },
      {
        label: "Past Due Date",
        value: { id: 19, name: "Past Due Date" }
      },
      {
        label: "Last Repayment Amount",
        value: { id: 20, name: "Last Repayment Amount" }
      },
      {
        label: "Loan Cycle",
        value: { id: 21, name: "Loan Cycle" }
      },
      {
        label: "No of days in overdue",
        value: { id: 22, name: "No of days in overdue" }
      },
      {
        label: "Outstanding Principal",
        value: { id: 23, name: "Outstanding Principal" }
      },
      {
        label: "Outstanding interest",
        value: { id: 24, name: "Outstanding interest" }
      },
      {
        label: "Past due Principal",
        value: { id: 25, name: "Past due Principal" }
      },
      {
        label: "Past due Interest",
        value: { id: 26, name: "Past due Interest" }
      },
      {
        label: "Recovery Date",
        value: { id: 27, name: "Recovery Date" }
      },
      {
        label: "Recovery Amount",
        value: { id: 28, name: "Recovery Amount" }
      },
      { label: " PAR", value: { id: 28, name: " PAR" } },
      { label: "Loan Status", value: { id: 29, name: "Loan Status" } },
      {
        label: "Percentage Provisioning",
        value: { id: 30, name: "Percentage Provisioning" }
      },
      {
        label: "Amount Provisioned",
        value: { id: 31, name: "Amount Provisioned" }
      },
      {
        label: " ECL Classification",
        value: { id: 32, name: " ECL Classification" }
      },
      {
        label: " Impairment Provisioning",
        value: { id: 33, name: " Impairment Provisioning" }
      },
      {
        label: "Restructured loan",
        value: { id: 34, name: "Restructured loan" }
      },
      {
        label: "Account Officer",
        value: { id: 35, name: "Account Officer" }
      }
    ];
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
    this.getFinancialYear();
    this.getLoanReportColumn();
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
  getFinancialYear() {
    return this.financialYearService.getAllFinacialYearByStatus().subscribe(
      data => {
        this.financialYear = data.financialYear;
      },
      err => {
        return this.loadingService.hide();
      },
      () => {}
    );
  }
  getLoanReportColumn() {
    return this.reportService.getLoanReportColumn().subscribe(
      data => {
      },
      err => {
      }
    );
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
      this.year1 = d.getFullYear();
      this.date2 = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
  }
  getReport() {
    if (!this.date1) {
      return swal.fire('GOS FINANCIAL', 'Select Start Date', 'error')
    }
    if (!this.date2) {
      return swal.fire('GOS FINANCIALS', 'Select End Date', 'error')
    }

    let path = `${environment.report_url}/Reporter/LoanReport?date1=${this.date1}&date2=${this.date2}`;
    this.reportSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
      path
    );
    this.displayTestReport = true;
    this.loadingService.hide();

  }
}
