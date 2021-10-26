
import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingService } from "src/app/core/services/loading.service";
import { LoanCustomerService } from "src/app/core/services/loancustomer.service";
import { LoanApplicationService } from "src/app/core/services/loanapplication.service";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { ReportService } from "src/app/core/services/report.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-offerletter-list",
    templateUrl: "./offerletter-list.component.html"
})
export class OfferLetterListComponent implements OnInit {
    activeIndex: number = 0;
    loanApplicationInformation: any[] = [];
    selectedLoanApplicationInformation: any[];
    displayReport: boolean = false;
    displayTestReport: boolean;
    reportSrc: SafeResourceUrl;
    workingLoanApplication: string;
    cols: any[];
    viewHeight: any = '600px';
    constructor(
        private loadingService: LoadingService,
        private loanApplicationService: LoanApplicationService,
        private sanitizer: DomSanitizer,
        private reportServ: ReportService,
        private router: Router
    ) { }

    ngOnInit() {
        this.cols = [
            {
                field: 'approvedProductName',
                header: 'approvedProductName'
            },
            {
                field: 'customerName',
                header: 'customerName'
            },
            {
                field: 'approvedAmount',
                header: 'approvedAmount'
            }
            ,
            {
                field: 'approvedRate',
                header: 'approvedRate'
            },
            {
                field: 'applicationRefNumber',
                header: 'applicationRefNumber'
            }
        ]
        this.getAllLoanCustomer();
    }

    getAllLoanCustomer() {
        this.loadingService.show();
        this.loanApplicationService.getAllLoanApplicationOfferLetter().subscribe(data => {
            this.loadingService.hide();
            this.loanApplicationInformation = data.loanApplications;
        });
    }
    // editLoanCustomer(row) {
    //     this.router.navigate(["/credit/offerLetter-info"], {
    //         queryParams: { editloanCustomerinfo: row.customerId }
    //     });
    // }


    popoverSeeMore(selectedRefNumber) {
        if (selectedRefNumber.applicationRefNumber != null) {
            this.loadingService.show();
            this.displayTestReport = true;
            this.displayReport = true;           
            let path: string = '';
            let appl = this.loanApplicationInformation.find(x => x.applicationRefNumber == selectedRefNumber.applicationRefNumber);
            if (appl != null) {
                path = `${environment.report_url}/Reporter/OfferLetterReport?ApplicationRefNo=${selectedRefNumber.applicationRefNumber}`;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
                this.loadingService.hide();
            }
            return;
        }
        // load data ..
    }
}
