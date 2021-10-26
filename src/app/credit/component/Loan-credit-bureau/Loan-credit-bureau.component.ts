import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
    selector: "app-Loan-credit-bureau",
    templateUrl: "./Loan-credit-bureau.component.html"
})
export class LoanCreditBureauComponent implements OnInit {
    form: FormGroup;

    creditBureauList: any[] = [];
    applicationCreditBureau: any = {};
    _loanApplicationId: number;

    get loanApplicationId(): number {
        return this._loanApplicationId;
    }
    @Input() set loanApplicationId(value: number) {
        this._loanApplicationId = value;
        if (value > 0) this.getApplicationCreditBureua(value);
    }
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private creditScoreCardService: CreditRiskScoreCardService,
        private router: Router
    ) {
        this.form = this.fb.group({
            loanCreditBureauId: [0],
            loanApplicationId: [this.loanApplicationId],
            creditBureauId: [""],
            chargeAmount: [""],
            reportStatus: [""],
            supportDocument: [""]
        });
    }

    ngOnInit() {
        this.getAllCreditBureua();
    }

    getAllCreditBureua() {
        this.loadingService.show();
        this.creditScoreCardService.getAllCreditBureau().subscribe(data => {
            this.loadingService.hide();
            this.creditBureauList = data.creditBureau;
        }, err => {
          this.loadingService.hide();
        });
    }
    getApplicationCreditBureua(loanApplicationId) {
        this.loadingService.show();
        this.creditScoreCardService
            .getApplicationCreditBureau(loanApplicationId)
            .subscribe(data => {
                this.loadingService.hide();
                this.applicationCreditBureau = data.loanCreditBureau;
                if (this.applicationCreditBureau != undefined) {
                    this.form = this.fb.group({
                        loanCreditBureauId: [
                            this.applicationCreditBureau.loanCreditBureauId
                        ],
                        loanApplicationId: [this.loanApplicationId],
                        creditBureauId: [
                            this.applicationCreditBureau.creditBureauId
                        ],
                        chargeAmount: [
                            this.applicationCreditBureau.chargeAmount
                        ],
                        reportStatus: [
                            this.applicationCreditBureau.reportStatus
                        ],
                        supportDocument: [
                            this.applicationCreditBureau.supportDocument
                        ]
                    });
                }
            });
    }
    onCreditBureauChanged(creditBureauId) {
        let charges = this.creditBureauList.find(
            x => x.creditBureauId == creditBureauId
        ).corporateChargeAmount;
        if (charges != undefined) {
            this.form.get("chargeAmount").setValue(charges);
        }
    }
    fileToUpload: File;
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }
    submitForm(formObj) {
        this.loadingService.show();

        let body = {
            loanCreditBureauId: parseInt(formObj.value.loanCreditBureauId),
            loanApplicationId: this.loanApplicationId,
            creditBureauId: parseInt(formObj.value.creditBureauId),
            chargeAmount: parseFloat(formObj.value.chargeAmount),
            reportStatus: formObj.value.reportStatus,
            supportDocument: ""
        };

        this.creditScoreCardService
            .UploadLoanCreditBureau(body, this.fileToUpload)
            .then(
                data => {
                    this.loadingService.hide();
                    const message = data.status.message.friendlyMessage;
                    if (data.status.isSuccessful) {
                        swal.fire("GOS FINANCIAL", message, "success");
                    } else {
                        swal.fire("GOS FINANCIAL", message, "error");
                    }
                }
            ).catch(err => {

              this.loadingService.hide()
        });
    }
}
