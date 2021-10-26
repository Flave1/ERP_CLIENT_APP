import { LoanReviewOperationsService } from "src/app/core/services/loan-review-operations.service";
import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { LmsService } from "src/app/core/services/lms.service";
import { CommonService } from "src/app/core/services/common.service";
import swal from "sweetalert2";

@Component({
    selector: "app-loan-prepayment",
    templateUrl: "./loan-prepayment.component.html"
})
export class LoanPrepaymentComponent implements OnInit {
    displaySearch: boolean = true;
    displayData: boolean = false;
    loanSearchForm: FormGroup;
    productTypes: any[];
    disbursedLoanList: any[];
    selectedLoan: any = {};
    loanId: number;
    loanApplicationId: number;
    customerId: number;
    loanRefNumber: any;
    loanDetails: any;

    loanPrepaymentForm: FormGroup;
    displayEffectiveDate: boolean;
    displayMaturityDate: boolean;
    displayIrregularSchedule: boolean;
    data: any = {};
    scatterdPayments: any[] = [];
    principalValanceString: any;
    totalAmount: any;
    principalBalance: number;
    productTypeId: number;
    newPrincipalBalance: any;
    principalAmount: any;
    viewHeight: any = '600px';
    cols: any[];
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private lmsService: LmsService,
        private loanOperationsService: LoanReviewOperationsService,
        private commonService: CommonService
    ) {}

    ngOnInit() {
        this.cols = [
            { field: 'loanReferenceNumber', header: 'loanReferenceNumber' },
            { field: 'productName', header: 'customerName' },
            { field: 'productName', header: 'productName' },
            { field: 'principalAmount', header: 'principalAmount' },
        ];
        this.initializeSearchForm();
        this.initializeControls();
        this.getAllProductType();
    }

    initializeSearchForm() {
        this.loanSearchForm = this.fb.group({
            customerTypeId: ["", Validators.required],
            productTypeId: ["", Validators.required],
            searchString: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3)
                ])
            ]
        });
    }
    getAllProductType() {
        this.commonService.getAllProductType().subscribe(data => {
            this.productTypes = data["result"];
        });
    }

    submitLoanSearchForm(formObj) {
        if (!formObj.value.customerTypeId) {
            return swal.fire(
                "GOSFINANCIAL",
                "Select Customer Type",
                "error"
            );
        };
        if (!formObj.value.productTypeId) {
            return swal.fire(
                "GOSFINANCIAL",
                "Select Product Type",
                "error"
            );
        };
        if (!formObj.value.searchString) {
            return swal.fire(
                "GOSFINANCIAL",
                "Enter search details",
                "error"
            );
        }
        this.loadingService.show();
        let body = {
            customerTypeId: formObj.value.customerTypeId,
            productTypeId: formObj.value.productTypeId,
            searchString: formObj.value.searchString
        };
        this.lmsService.searchForLoan(body).subscribe(data => {
            this.loadingService.hide();
            this.disbursedLoanList = data["result"];
        });
    }

    onRowSelect(event) {
        this.selectedLoan = event.data;
        this.customerId = event.data.customerId;
        this.loanApplicationId = event.data.loanApplicationId;
        this.loanId = event.data.loanId;
        this.loanRefNumber = event.data.loanRefNumber;
        this.productTypeId = event.data.productTypeId;
        this.getRunningLoanDetails(this.loanRefNumber);
        this.displaySearch = false;
        this.displayData = true;
    }
    rowClicked(row: any): void {

    }

    getRunningLoanDetails(loanRefNumber) {
        this.loanOperationsService
            .getRunningLoanDetails(loanRefNumber)
            .subscribe(data => {
                this.loanDetails = data["result"];
                if (this.loanDetails != null) {
                    const row = this.loanDetails;
                    this.totalAmount =
                        row.outstandingPrincipal + row.pastDueTotal;
                    this.loanPrepaymentForm = this.fb.group({
                        loanReferenceNumber: [row.loanReferenceNumber],
                        approvedAmount: [row.approvedAmount],
                        outstandingPrincipal: [row.outstandingPrincipal],
                        interestRate: [row.interestRate],
                        equityContribution: [row.equityContribution],
                        effectiveDate: [new Date(row.effectiveDate)],
                        maintainTenor: true,
                        maturityDate: [new Date(row.maturityDate)],
                        accrualedAmount: [row.accrualedAmount],
                        scheduleTypeId: [row.scheduleTypeId],
                        newtenor: [row.newtenor],
                        teno: [row.teno],
                        scheduleTypeCategoryId: [row.scheduleTypeCategoryId],
                        totalAmount: [this.totalAmount],
                        previousEffectiveDate: [
                            new Date(row.previousEffectiveDate)
                        ],
                        pastDueTotal: [row.pastDueTotal],
                        currency: [row.currency],
                        loanId: [row.loanId]
                    });
                    this.loanPrepaymentForm.controls[
                        "previousEffectiveDate"
                    ].disable();
                    this.principalValanceString = this.totalAmount;
                    this.calculateTenor();
                    if (row.scheduleTypeCategoryId === 2) {
                        this.displayIrregularSchedule = true;
                    } else {
                        this.displayIrregularSchedule = false;
                    }
                }

                this.displayMaturityDate = false;
                this.displayEffectiveDate = true;
            });
    }
    goBack() {
        this.selectedLoan = null;
        this.customerId = null;
        this.loanApplicationId = null;
        this.loanId = null;
        this.loanRefNumber = null;
        this.displaySearch = true;
        this.displayData = false;
        this.initializeControls()
    }
    initializeControls() {
        this.loanPrepaymentForm = this.fb.group({
            approvedAmount: ["", Validators.required],
            loanReferenceNumber: ["", Validators.required],
            outstandingPrincipal: ["", Validators.required],
            interestRate: ["", Validators.required],
            equityContribution: ["", Validators.required],
            effectiveDate: ["", Validators.required],
            maturityDate: ["", Validators.required],
            accrualedAmount: ["", Validators.required],
            scheduleTypeId: ["", Validators.required],
            teno: [""],
            newtenor: ["", Validators.required],
            scheduleTypeCategoryId: [0],
            totalAmount: [0],
            previousEffectiveDate: [""],
            maintainTenor: [true],
            currency: [""],
            pastDueTotal: [0]
        });
    }
    keepTenor(evt) {
        if (evt === true) {
            this.displayMaturityDate = false;
            this.displayEffectiveDate = true;
        } else {
            this.displayMaturityDate = true;
            this.displayEffectiveDate = true;
        }
    }

    calculateMaturityDate() {
        this.loanPrepaymentForm.controls["maturityDate"].setValue(null);
        let newTenor = this.loanPrepaymentForm.get("newtenor").value;
        if (newTenor <= 0) {
            swal.fire(
                "GOSFINANCIAL",
                "System cannot calculate maturity date with zero tenor.",
                "error"
            );
        }
        let effectiveDate = this.loanPrepaymentForm.get("effectiveDate").value;
        let ret = new Date(effectiveDate);
        var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
        this.loanPrepaymentForm.controls["maturityDate"].setValue(maturityDate);
    }
    calculateTenor() {
        this.loanPrepaymentForm.controls["newtenor"].setValue(null);
        let effectiveDate = this.loanPrepaymentForm.get("effectiveDate").value;
        let maturityDate = this.loanPrepaymentForm.get("maturityDate").value;
        if (new Date(effectiveDate) > new Date(maturityDate)) {
            swal.fire(
                "GOSFINANCIAL",
                "Effective Date cannot be greater than Maturity Date.",
                "error"
            );
            return;
        }
        var tenor = this.dateDiff(effectiveDate, maturityDate);
        this.loanPrepaymentForm.controls["newtenor"].setValue(tenor);
    }

    calculateBalance(event) {
        let totalAmount = this.totalAmount;
        this.newPrincipalBalance = Number(totalAmount) - Number(event);
        this.principalAmount = parseFloat(
            Number(this.newPrincipalBalance).toFixed(2)
        );
        this.principalValanceString = parseFloat(
            Number(this.newPrincipalBalance).toFixed(2)
        );
        if (Number(this.principalValanceString) < 0) {
            swal.fire(
                "GOSFINANCIAL",
                "Payment Amount cannot be greater than Total Amount",
                "error"
            );
            this.loanPrepaymentForm.controls["equityContribution"].setValue(0);
            return;
        }
    }
    dateDiff(date1, date2) {
        var dt1 = new Date(date1);
        var dt2 = new Date(date2);
        return Math.floor(
            (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
                (1000 * 60 * 60 * 24)
        );
    }
    addToList() {
        if (
            Number(this.principalValanceString) - Number(this.data.amount) <
            0
        ) {
            swal.fire(
                "GOS FINANCIAL",
                "Payment amount cannot be greater than outstanding balance",
                "error"
            );
            return;
        }
        if (
            new Date(this.data.scateredDate) <
            new Date(this.loanPrepaymentForm.get("effectiveDate").value)
        ) {
            swal.fire(
                "GOS FINANCIAL",
                "Payment date cannot be less than effective date",
                "error"
            );
            this.data.scateredDate = null;
            return;
        }
        var pmts = {
            paymentDate: new Date(this.data.scateredDate),
            paymentAmount: this.data.amount
        };
        this.scatterdPayments.push(pmts);
        this.principalBalance =
            Number(this.principalValanceString) - Number(pmts.paymentAmount);
        this.principalValanceString = parseFloat(
            Number(this.principalBalance).toFixed(2)
        );
        this.data.scateredDate = null;
        this.data.amount = null;
    }
    removeItem(evt, indx) {
        evt.preventDefault();
        let currRecord = this.scatterdPayments[indx];
        this.principalBalance =
            Number(this.principalValanceString) +
            Number(currRecord.paymentAmount);
        this.principalValanceString = this.principalBalance;
        this.scatterdPayments.splice(indx, 1);
    }

    submitForm(formObj) {
        this.loadingService.show();
        let bodyObj = {
            loanReviewOperationsId: 0,
            loanId: this.loanId,
            lmsApplicationDetailId: 0,
            productTypeId: this.productTypeId,
            operationTypeId: 20,
            reviewDetails: "Repayment Operation",
            proposedEffectiveDate: formObj.value.effectiveDate,
            interateRate: formObj.value.interestRate,
            prepayment: formObj.value.equityContribution,
            maturityDate: formObj.value.maturityDate,
            principalFrequencyTypeId: null,
            interestFrequencyTypeId: null,
            principalFirstPaymentDate: null,
            interestFirstPaymentDate: null,
            tenor: formObj.value.newtenor,
            scheduleTypeId: null,
            scheduleDayCountId: null,
            interestTypeId: null,
            reviewIrregularSchedule: this.scatterdPayments
        };
        this.loanOperationsService
            .addOperationReview(bodyObj)
            .subscribe(res => {
                this.loadingService.hide();
                if (res["success"] == true) {
                    this.scatterdPayments = [];
                    this.displayMaturityDate = false;
                    this.displayEffectiveDate = true;
                    swal.fire("GOS FINANCIAL", res["message"], "success");
                    this.displayData = false;
                    this.displaySearch = true;
                } else {
                    swal.fire("GOS FINANCIAL", res["message"], "error");
                }
            });
    }

    generateIrregularSchedule() {}
}
