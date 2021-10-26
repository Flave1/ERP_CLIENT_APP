import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { TrialBalanceService } from "../../../core/services/trialbalance.service";
import { CompanyService } from "../../../core/services/company.service";
import { Router } from "@angular/router";
import { FinancalYearService } from "../../../core/services/financal-year.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";
import { ReportService } from "../../../core/services/report.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: "app-soce-report",
    templateUrl: "./soce-report.component.html",
    styleUrls: ["./soce-report.component.css"]
})
export class SoceReportComponent implements OnInit {
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
        if (this.year1 && this.year2 !== this.period) {
            return swal.fire(
                "GOS FINANCIAL",
                "The selected dates must correspond to the period",
                "error"
            );
        }
        const body = {
            comp: this.companyId,
            date1: this.formatDate(this.dateFrom),
            date2: this.formatDate(this.dateTo),
            period: this.period,
            sub: this.sub
        };
        let path: string = "";
        this.loadingService.show();
        this.reportService.getFsReport(this.date1, this.date2).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] != null) {

                    path = data.result;
                    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
                        path
                    );
                    this.displayTestReport = true;
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

  formatDate(date) {
    let dateObj = new Date(date),
      month = '' + (dateObj.getMonth() + 1),
      day = '' + dateObj.getDate(),
      year = '' + dateObj.getFullYear();

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }
}
