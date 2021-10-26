import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingService } from "src/app/core/services/loading.service";
import { LoanCustomerService } from "src/app/core/services/loancustomer.service";
import { LoanApplicationService } from "src/app/core/services/loanapplication.service";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { ReportService } from "src/app/core/services/report.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { saveAs } from "file-saver";

@Component({
    selector: "app-offerletterreview",
    templateUrl: "./offerletterreview.component.html"
})
export class OfferLetterReviewComponent implements OnInit {
    activeIndex: number = 0;
    loanApplicationInformation: any[] = [];
    selectedLoanApplicationInformation: any[];
    displayReport: boolean = false;
    otherTabDisabled: boolean = true;
    displayDetails: boolean = false;
    displayTestReport: boolean;
    reportSrc: SafeResourceUrl;
    selectedDocument: string;
    binaryFile: string;
    workingLoanApplication: string;
    loanApplicationId: number;
    form: FormGroup;
    fileToUpload: File;
    viewHeight: any = '600px';
    cols: any[];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private loanApplicationService: LoanApplicationService,
        private sanitizer: DomSanitizer,
        private reportServ: ReportService,
        private router: Router
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
            },
            {
                field: 'approvedRate',
                header: 'approvedRate'
            },
            {
                field: 'applicationRefNumber',
                header: 'applicationRefNumber'
            },
        ]
        this.getAllLoanApplicationOfferLetterReview();
    }

    getAllLoanApplicationOfferLetterReview() {
        this.loadingService.show();
        this.loanApplicationService
            .getAllLoanApplicationOfferLetterReview()
            .subscribe(data => {
                this.loadingService.hide();
                this.loanApplicationInformation = data.loanApplications;
            });
    }



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

    DownloadDocument(x) {
        this.loadingService.show();
        this.loanApplicationService.downloadLoanOfferLetter(x.loanApplicationId).subscribe(data => {
          this.loadingService.hide();
          let fileDocument = data;
          if (fileDocument != undefined) {
            this.binaryFile = fileDocument.export;
            this.selectedDocument = fileDocument.fileName;
            let myDocExtention = fileDocument.fileExtension;
            var byteString = atob(this.binaryFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);

            if (myDocExtention == ".jpg" || myDocExtention == ".jpeg") {
              try {
                var file = new File([bb], this.selectedDocument + ".jpg", {
                  type: "image/jpg"
                });
                saveAs(file);
              } catch (err) {
                var saveFileAsBlob = new Blob([bb], {
                  type: "image/jpg"
                });
                window.navigator.msSaveBlob(
                  saveFileAsBlob,
                  this.selectedDocument + ".jpg"
                );
              }
            }
            if (myDocExtention == ".png" || myDocExtention == ".png") {
              try {
                var file = new File([bb], this.selectedDocument + ".png", {
                  type: "image/png"
                });
                saveAs(file);
              } catch (err) {
                var saveFileAsBlob = new Blob([bb], {
                  type: "image/png"
                });
                window.navigator.msSaveBlob(
                  saveFileAsBlob,
                  this.selectedDocument + ".png"
                );
              }
            }
            if (myDocExtention == ".pdf" || myDocExtention == ".pdf") {
              try {
                var file = new File([bb], this.selectedDocument + ".pdf", {
                  type: "application/pdf"
                });
                saveAs(file);
              } catch (err) {
                var saveFileAsBlob = new Blob([bb], {
                  type: "application/pdf"
                });
                window.navigator.msSaveBlob(
                  saveFileAsBlob,
                  this.selectedDocument + ".pdf"
                );
              }
            }
            if (myDocExtention == ".xls" || myDocExtention == ".xlsx") {
              try {
                var file = new File([bb], this.selectedDocument + ".xlsx", {
                  type: "application/vnd.ms-excel"
                });
                saveAs(file);
              } catch (err) {
                var saveFileAsBlob = new Blob([bb], {
                  type: "application/vnd.ms-excel"
                });
                window.navigator.msSaveBlob(
                  saveFileAsBlob,
                  this.selectedDocument + ".xlsx"
                );
              }
            }
            if (myDocExtention == ".doc" || myDocExtention == ".docx") {
              try {
                var file = new File([bb], this.selectedDocument + ".doc", {
                  type: "application/msword"
                });
                saveAs(file);
              } catch (err) {
                var saveFileAsBlob = new Blob([bb], {
                  type: "application/msword"
                });
                window.navigator.msSaveBlob(
                  saveFileAsBlob,
                  this.selectedDocument + ".doc"
                );
              }
            }
          }
        });
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
        this.loanApplicationId = event.data.loanApplicationId;
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

        this.loanApplicationService
            .UploadCustomerOfferLetter(body, this.fileToUpload)
            .then(
                data => {
                    this.loadingService.hide();
                    if (data.status.isSuccessful) {
                        this.form.reset();
                        this.otherTabDisabled = true;
                        this.loanApplicationId = null;
                        this.activeIndex = 0;
                        swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "success");
                    } else {
                        swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
                    }
                },

            ).catch(error => {
                this.loadingService.hide();
                swal.fire("GOS FINANCIAL", JSON.stringify(error), "error");
            });
    }
}
