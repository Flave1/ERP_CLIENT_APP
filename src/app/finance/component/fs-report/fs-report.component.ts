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
import {environment} from "../../../../environments/environment";

@Component({
    selector: "app-fs-report",
    templateUrl: "./fs-report.component.html",
    styleUrls: ["./fs-report.component.css"]
})
export class FsReportComponent implements OnInit {
    cols: any[];
    fileToUpload: File;
    viewHeight: any = "600px";
    trialBalanceInformation: any[] = [];
    companyInformation: any[] = [];
    selectedtrialBalanceInformation: any[];
    displayProcessReport = false;
    form: FormGroup;
    dateTo: Date;
    dateFrom: Date;
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

    // showAddNew() {
    //     this.router.navigate(["/finance/trialBalance-info"]);
    // }

    onDateSelect(event, number) {
        if (number === 1) {
            let d = new Date(Date.parse(event));
            this.year1 = d.getFullYear();
            this.date1 = `${d.getFullYear()}-${d.getMonth() +
                1}-${d.getDate()}`;
        }
        if (number === 2) {
            let d = new Date(Date.parse(event));
            this.year2 = d.getFullYear();
            this.date2 = `${d.getFullYear()}-${d.getMonth() +
                1}-${d.getDate()}`;
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
        console.log("body",body);
        let path: string = `${environment.report_url}/Reporter/FinancialStatementReport?date1=${this.dateFrom}&date2=${this.dateTo}`;
      this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        path
      );
      this.displayTestReport = true;

        // this.reportService.getFsReport(this.date1, this.date2).subscribe(
        //     data => {
        //         this.loadingService.hide();
        //         if (data["result"] != null) {
        //
        //             path = data.result;
        //             this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        //                 path
        //             );
        //             this.displayTestReport = true;
        //         } else {
        //             swal.fire("GOS FINANCIAL", data["message"], "error");
        //         }
        //     },
        //     err => {
        //         this.loadingService.hide();
        //         swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
        //     }
        // );
    }
}