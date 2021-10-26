import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "../../../../core/services/loading.service";
import { TrialBalanceService } from "../../../../core/services/trialbalance.service";
import { CompanyService } from "../../../../core/services/company.service";
import { Router } from "@angular/router";
import { FinancalYearService } from "../../../../core/services/financal-year.service";
import swal from "sweetalert2";
import { SelectItem } from "primeng/api";
import { ReportService } from "../../../../core/services/report.service";
import { DomSanitizer } from "@angular/platform-browser";
import {environment} from "../../../../../environments/environment";

interface Column {
  name: string;
  id: number;
}
@Component({
  selector: "app-customer-report",
  templateUrl: "./customer-report.component.html",
  styleUrls: ["./customer-report.component.css"]
})
export class CustomerReportComponent implements OnInit {
  cols: any[];
  fileToUpload: File;
  viewHeight: any = "600px";
  trialBalanceInformation: any[] = [];
  companyInformation: any[] = [];
  selectedtrialBalanceInformation: any[];
  displayProcessReport = false;
  form: FormGroup;
  dateTo: any;
  dateFrom: any;
  companyId: any = "0";
  period: any;
  sub: any;
  financialYear: any[] = [];
  reportMode: any = 0;
  customerType: any;
  columns: SelectItem[];
  columnsList: any[] = [];
  column: any;
  selectedColumn: Column;
  corporateColumns: SelectItem[];
  displayTestReport: boolean;
  reportSrc: any;
  date1: any;
  date2: any;
  year1: any;
  year2: any;
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
    // this.columns = [
    //     { label: "Customer ID", value: { id: 1, name: "Customer ID" } },
    //     { label: "Customer Name", value: { id: 2, name: "Customer Name" } },
    //     { label: "Date of Birth", value: { id: 3, name: "Date of Birth" } },
    //     { label: "Gender", value: { id: 4, name: "Gender" } },
    //     {
    //         label: "Marital Status",
    //         value: { id: 5, name: "Marital Status" }
    //     },
    //     { label: "Phone Number", value: { id: 5, name: "Phone Number" } },
    //     { label: "Email Address", value: { id: 6, name: "Email Address" } },
    //     {
    //         label: "Customer Address",
    //         value: { id: 7, name: "Customer Address" }
    //     },
    //     { label: "Next of Kin", value: { id: 8, name: "Next of Kin" } },
    //     {
    //         label: "Employment Status",
    //         value: { id: 9, name: "Employment Status" }
    //     },
    //     { label: "Employer", value: { id: 10, name: "Employer" } },
    //     {
    //         label: "No of Dependants",
    //         value: { id: 11, name: "No of Dependants" }
    //     },
    //     {
    //         label: "Current Exposure",
    //         value: { id: 12, name: "Current  Exposure" }
    //     },
    //     {
    //         label: "Maximum Exposure",
    //         value: { id: 13, name: "Maximum Exposure" }
    //     },
    //     {
    //         label: "Account Officer",
    //         value: { id: 14, name: "Account Officer" }
    //     }
    // ];
    // this.corporateColumns = [
    //     { label: "Customer ID", value: { id: 15, name: "Customer ID" } },
    //     { label: "Company Name", value: { id: 16, name: "Company Name" } },
    //     {
    //         label: "Business Registration Status",
    //         value: { id: 17, name: "Business Registration Status" }
    //     },
    //     {
    //         label: "Date of Incorporation",
    //         value: { id: 18, name: "Date of Incorporation" }
    //     },
    //     {
    //         label: "Company Director",
    //         value: { id: 19, name: "Comapny Director" }
    //     },
    //     {
    //         label: "Number of years in business",
    //         value: { id: 20, name: "Number of years in business" }
    //     },
    //     {
    //         label: "Annual turnover",
    //         value: { id: 21, name: "Annual turnover" }
    //     }
    //     // {label:' Customer Address,', value:{id:22, name: ' Customer Address,'}},
    //     // {label:' Next of Kin,', value:{id:23, name: 'Next of Kin,'}},
    //     // {label:' Employment Status,', value:{id:24, name: ' Employment Status,'}},
    //     // {label:'Employer,', value:{id:25, name: 'Employer,'}},
    //     // {label:' No of Dependants,', value:{id:26, name: ' No of Dependants,'}},
    //     // {label:'Current Exposure,', value:{id:27, name: 'Current  Exposure,'}},
    //     // {label:'Maximum Exposure,', value:{id:28, name: 'Maximum Exposure,'}},
    //     // {label:'Account Officer,', value:{id:28, name: 'Account Officer,'}},
    // ];
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
  }

  processReport() {
    this.getAllCompany();
    this.displayProcessReport = true;
  }

  getAllCompany() {
    this.loadingService.show();
    this.companyService.getAllCompanyStructure().subscribe(
      data => {
        this.loadingService.hide();
        this.companyInformation = data.companyStructures;

      },
      err => {
        this.loadingService.hide();
      }
    );
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
  getColumn(columnId) {
    switch (columnId) {
      case "1":
        this.loadingService.show();
        return this.reportService.getIndividualColumn().subscribe(
          data => {
            this.loadingService.hide();
            this.columnsList = data.result;
            let id = 0;
            if (this.columnsList !== undefined) {
              this.columnsList.forEach(el => {
                this.columns.push({
                  label: el.name,
                  value: { name: el.name, id: id++ }
                });
              });
            }
          },
          err => {
            this.loadingService.hide();
          }
        );
      case "2":
        this.loadingService.show();
        return this.reportService.getCorporateColumn().subscribe(
          data => {
            this.loadingService.hide();
            this.columnsList = data.result;
            if (this.columnsList !== undefined) {
              this.columnsList.forEach(column => {
                return this.corporateColumns.push({
                  label: column.name,
                  value: column.name
                });
              });
            }
          },
          err => {
            this.loadingService.hide();
          }
        );
      default:
        return "";
    }
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
    // if (this.year1 != this.period && this.year2 !== this.period) {
    //     return swal.fire(
    //         "GOS FINANCIAL",
    //         "The selected dates must correspond to the period",
    //         "error"
    //     );
    // }
    const body = {
      comp: this.companyId,
      date1: this.dateFrom,
      date2: this.dateTo,
      period: this.period,
      sub: this.sub
    };
    let path: string = "";
    if (this.customerType == 1) {
      path = `${environment.report_url}/Reporter/LoanIndividualCustomerReport?date1=${this.date1}&date2=${this.date2}&customerTypeId=${this.customerType}`;
      this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        path
      );
      this.displayTestReport = true;
    }
    if (this.customerType == 2) {
      path = `${environment.report_url}/Reporter/LoanCorporateCustomerReport?date1=${this.date1}&date2=${this.date2}&customerTypeId=${this.customerType}`;
      this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        path
      );
      this.displayTestReport = true;
    }

  }
}
