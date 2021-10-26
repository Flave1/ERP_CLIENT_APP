import { LmsService } from "./../../../../core/services/lms.service";
import { Component, OnInit } from "@angular/core";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { ReportService } from "src/app/core/services/report.service";
import swal from "sweetalert2";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-lms-offer-letter",
    templateUrl: "./lms-offer-letter.component.html"
})
export class LmsOfferLetterComponent implements OnInit {
    activeIndex: number = 0;
    loanApplicationInformation: any[] = [];
    selectedLoan: any = {};
    displayReport: boolean = false;
    otherTabDisabled: boolean = true;
    displayDetails: boolean = false;
    displayTestReport: boolean;
    reportSrc: SafeResourceUrl;
    workingLoanApplication: string;
    loanApplicationId: number;
    form: FormGroup;
    fileToUpload: File;
    viewHeight: any = '600px';
    cols: any[];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private lmsService: LmsService,
        private sanitizer: DomSanitizer,
        private reportServ: ReportService,
    ) {
        this.form = this.fb.group({
            loanApplicationId: [0],
            reportStatus: ["", Validators.required],
            supportDocument: ["", Validators.required]
        });
    }

    ngOnInit() {
        this.cols = [
            {
                field: 'productName',
                header: 'productName'
            },
            {
                field: 'customerName',
                header: 'customerName'
            },
            {
                field: 'propposedInterestRate',
                header: 'propposedInterestRate'
            },
            {
                field: 'propposedTenor',
                header: 'propposedTenor'
            },
            {
                field: 'propposedAmount',
                header: 'propposedAmount'
            },
            {
                field: 'bookingDate',
                header: 'bookingDate'
            }
        ]
        this.getAllLoanApplicationOfferLetterReview();
    }

    getAllLoanApplicationOfferLetterReview() {
        this.loadingService.show();
        this.lmsService.getLoanReviewOfferLetter().subscribe(data => {
            this.loadingService.hide();
            this.loanApplicationInformation = data.loanReviewList;
        });
    }

    popoverSeeMore(selectedRefNumber) {
        if (selectedRefNumber.loanRefNumber != null) {
            this.displayTestReport = false;
            this.displayReport = false;
            let path: string = "";
            let appl = this.loanApplicationInformation.find(
                x =>
                    x.loanRefNumber ==
                    selectedRefNumber.loanRefNumber
            );
            if (appl != null) {
                this.displayReport = true;
                this.displayTestReport = true;
                path = `${environment.report_url}/Reporter/OfferLetterReportLMS?applicationRefNo=${selectedRefNumber.loanRefNumber}`;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
            }
            return;
        }
    }

    onTabChange(e) {
        this.activeIndex = e.index;
    }

    openNext() {
        this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
    }

    openPrev() {
        this.activeIndex = this.activeIndex === 0 ? 2 : this.activeIndex - 1;
    }

    onRowSelect(event) {
        this.activeIndex = 1;
        this.otherTabDisabled = false;
        this.displayDetails = true;
        this.loanApplicationId = event.data.loanReviewApplicationId;
    }
    reset() {
        this.activeIndex = 0;
        this.otherTabDisabled = true;
        this.selectedLoan = {};
        this.displayDetails = false;
        this.loanApplicationId = null;
    }

    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }

    submitForm(formObj) {
        this.loadingService.show();

        let body = {
            loanApplicationId: this.loanApplicationId,
            chargeAmount: formObj.value.chargeAmount,
            reportStatus: formObj.value.reportStatus,
            supportDocument: ""
        };

        this.lmsService
            .UploadLoanReviewOfferLetter(body, this.fileToUpload)
            .then(
                data => {
                    this.loadingService.hide();
                    if (data.status.isSuccessful) {
                        this.form.reset();
                        this.reset();
                        swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "success");
                    } else {
                        swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
                    }
                },
                err => {
                    this.loadingService.hide();
                    swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
                }
            );
    }
}
