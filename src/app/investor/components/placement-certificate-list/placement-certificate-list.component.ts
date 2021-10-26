import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { LoadingService } from "../../../core/services/loading.service";
import { ReportService } from "../../../core/services/report.service";
import { Router } from "@angular/router";
import {InvestorFundService} from '../../../core/services/investor-fund.service';
import { environment } from "src/environments/environment";

@Component({
    selector: "app-placement-certificate-list",
    templateUrl: "./placement-certificate-list.component.html",
    styleUrls: ["./placement-certificate-list.component.css"]
})
export class PlacementCertificateListComponent implements OnInit {
    activeIndex: number = 0;
    loanApplicationInformation: any[] = [];
    selectedLoanApplicationInformation: any[];
    displayReport: boolean = false;
    displayTestReport: boolean;
    reportSrc: SafeResourceUrl;
    workingLoanApplication: string;
    cols: any[];
    viewHeight: any = "600px";
    constructor(
        private loadingService: LoadingService,
        private sanitizer: DomSanitizer,
        private reportServ: ReportService,
        private router: Router,
        private investorFundService: InvestorFundService
    ) {}

    ngOnInit() {
        this.cols = [
            {
                field: "approvedProductName",
                header: "approvedProductName"
            },
            {
                field: "customerName",
                header: "customerName"
            },
            {
                field: "approvedAmount",
                header: "approvedAmount"
            },
            {
                field: "approvedRate",
                header: "approvedRate"
            },
            {
                field: "applicationRefNumber",
                header: "applicationRefNumber"
            }
        ];
        this.getAllInvestors();
    }

    getAllInvestors() {
        this.loadingService.show();
        this.investorFundService
            .getCertificateLists()
            .subscribe(data => {
                this.loadingService.hide();
                this.loanApplicationInformation = data.investorFunds;
            }, err => {
                this.loadingService.hide()
            });
    }
    // editLoanCustomer(row) {
    //     this.router.navigate(["/credit/offerLetter-info"], {
    //         queryParams: { editloanCustomerinfo: row.customerId }
    //     });
    // }

    popoverSeeMore(selectedRefNumber) {

        if (selectedRefNumber.refNumber != null) {
            this.displayTestReport = false;
            this.displayReport = false;
            let path: string = "";
            let appl = this.loanApplicationInformation.find(
                x =>
                    x.refNumber ==
                    selectedRefNumber.refNumber
            );
            if (appl != null) {
                this.displayReport = true;
                this.displayTestReport = true;
                path = `${environment.report_url}/Reporter/OfferLetterReportInvestment?applicationRefNo=${selectedRefNumber.refNumber}`;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
            }
            return;
        }
        // load data ..
    }
}
