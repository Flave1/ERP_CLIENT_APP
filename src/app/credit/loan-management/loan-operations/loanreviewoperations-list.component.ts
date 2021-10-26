import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CompanyService } from "src/app/core/services/company.service";
import { LoanReviewOperationsService } from "src/app/core/services/loan-review-operations.service";
import { LoanScheduleService } from "src/app/core/services/loanschedule";
import { DateUtilService } from "src/app/core/services/dateutils";




@Component({
    selector: "app-loanreviewoperations-list",
    templateUrl: "./loanreviewoperations-list.component.html"
})
export class LoanReviewOperationsListComponent implements OnInit {
    frequencyTypesInformation: any[] = [];
    dayCountInformation: any[] = [];
    customerId: number;
    loanId: number;
    tenor: number;
    feeAmount:any;
    loanAmount:any;
    maturityDate:any;
    firstInterestPaymentDate:any;
    firstPrincipalPaymentDate:any;
    operationId: number;
    productTypeId: number;
    loanReviewOperationTypeId: number;
    interestRate: any;
    reviewDetails:any;
    activeIndex: number = 0;
    cols: any[];
    loanScheduleByLoanInformation: any[]= [];
    loanScheduleTypeInformation: any[] = [];
    operationTypeInformation: any[] = [];
    companyInformation: any[] = [];
    loanreviewoperationsForm: FormGroup;
    loanreviewoperationsInformation: any[] = [];
    loanreviewInformation: any[] = [];
    selectedloanreviewoperationsInformation: any = {};
    displayOperation = false;
    displayUnMappingGL = false;
    loanreviewoperationsFormGroup: FormGroup;
    loanNotSelected: boolean = true;
    displayPrepayment: boolean = false;
    displayLoanPrepayment: boolean = false;
    displayPaymentDateChange: boolean = false;
    displayTenor: boolean = false;
    displayInterestrate: boolean = false;
    displayInterestandPrincipalFrequencyChange: boolean = false;
    displayPrincipalFrequencyChange: boolean = false;
    displayInterestFrequencyChange: boolean = false;
    displayRestructure: boolean = false;
    systemCurrentDate: any;
    data: any = {};
    entityName: string;
    refNo: any;
    lmsApplicationDetailId: number = 0;
    objBody: any = {};
    scatterdPayments: any[] = [];
    viewHeight: any = '600px';
  applicationDate: any;

    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private loanreviewoperationsService: LoanReviewOperationsService,
        private companyService: CompanyService,
        private loanSrv: LoanScheduleService,
        private dateUtilService: DateUtilService,
        private router: Router
    ) {
        this.loanreviewoperationsForm = this.fb.group({
            loanReviewOperationsId: [0],
            loanId: [""],
            operationTypeId: [""],
            productTypeId: [""],
            proposedEffectiveDate: [""],
            interateRate: [""],
            reviewDetails: [""],
            prepayment: [""],
            principalFrequencyTypeId: [""],
            interestFrequencyTypeId: [""],
            principalFirstPaymentDate: [""],
            interestFirstPaymentDate: [""],
            maturityDate: [""],
            tenor: [0],
            cASA_AccountId: [""],
            overDraftTopup: [""],
            fee_Charges: [""],
            terminationAndReBook: [""],
            completeWriteOff: [""],
            cancelUndisbursedLoan: [""],
            approvalStatusId: [""],
            isManagementRate: [""],
            operationCompleted: [""],
            scheduleTypeId: [""],
            scheduleDayCountId: [""],
            interestTypeId: [""],
            lmsApplicationDetailId: [""],
            staffId: [""],
            companyId: [""],
            systemCurrentDate:[""],

            principalAmount: [""],
            interestRate: [0],
            loanDate: [""],
            scheduleMethod: [""],
            interestFrequency: [""],
            principalfrequency: [""],
            principalFirstDate: [""],
            intrestFirstDate: [""],
            previousMaturityDate: [""],
            numberOfPayments: [""],
            basis: [""],
            integralFeeAmount: [""],
            interestChargeType: ["0"],
            withoutDisburment: [false],
            accountNumber: [""],
            productName: [""],
            newtenor: [0],
            newInterateRate: [""],
        });
    }

    ngOnInit() {
        this.cols = [
            { field: 'loanReferenceNumber', header: 'loanReferenceNumber' },
            { field: 'productName', header: 'customerName' },
            { field: 'productName', header: 'productName' },
            { field: 'operationName', header: 'operationName' },
        ];
        this.getApprovedLoanReview();
        this.getOperationType();
        this.getAllLoanScheduleType();
        this.getDayCount();
        this.getAllFrequencyTypes();
        this.getLoanReviewDetails(this.loanId);
    }


    getApprovedLoanReview() {
        this.loadingService.show();
        this.loanreviewoperationsService.getApprovedLoanReview().subscribe(data => {
            this.loadingService.hide();
            this.loanreviewoperationsInformation = data.loans;
        }, () => {
            this.loadingService.hide()
        });
    }

    getLoanReviewDetails(loanId) {
      this.loadingService.show();
      this.loanreviewoperationsService.getReviewedLoanDetails(loanId).subscribe(data => {
          this.loadingService.hide();
          this.loanreviewInformation = data.loanReviewApplication[0];
          this.interestRate = data.loanReviewApplication[0].approvedRate;
          this.operationId = data.loanReviewApplication[0].operationId;
          if(this.operationId == 16){
            this.loanAmount = data.loanReviewApplication[0].approvedAmount;
          }
          this.tenor = data.loanReviewApplication[0].approvedTenor;
      }, () => {
          this.loadingService.hide()
      });
  }


    getDayCount() {
        this.loadingService.show();
        this.loanSrv.getAllDayCount().subscribe(data => {
            this.loadingService.hide();
            this.dayCountInformation = data.lookUp;
        }, () => {
            this.loadingService.hide()
        });
      }


      getAllFrequencyTypes() {
        this.loadingService.show();
        this.loanSrv.getAllFrequencyTypes().subscribe(data => {
            this.loadingService.hide();
            this.frequencyTypesInformation = data.lookUp;
        }, () => {
            this.loadingService.hide()
        });
      }


      getAllLoanScheduleType() {
        this.loadingService.show();
        this.loanSrv.getAllLoanScheduleType().subscribe(data => {
            this.loadingService.hide();
            this.loanScheduleTypeInformation = data.lookUp;
        }, () => {
            this.loadingService.hide()
        });
      }

    getOperationType() {
        this.loadingService.show();
        this.loanreviewoperationsService.getOperationTypeRestructure().subscribe(
            data => {
                this.loadingService.hide();
        this.operationTypeInformation = data.loanOperationType;
                }, () => {
                this.loadingService.hide()
            });
    }


    getLoanScheduleByLoanId(loanId) {
        this.loadingService.show();
        this.loanreviewoperationsService.getLoanScheduleByLoanId(loanId).subscribe(
            data => {
                this.loadingService.hide();
        this.loanScheduleByLoanInformation = data["result"];
                }, () => {
                this.loadingService.hide()
            });
    }
    onRowSelect(event) {
        this.loanNotSelected = false;
        this.selectedloanreviewoperationsInformation = event.data;
        this.customerId = event.data.customerId;
        this.loanId = event.data.loanId;
        this.interestRate = event.data.interestRate;
        this.lmsApplicationDetailId = event.data.lmsApplicationDetailId;
        this.productTypeId = event.data.productTypeId;
        this.loanReviewOperationTypeId = event.data.loanReviewOperationTypeId;
        this.reviewDetails = event.data.reviewDetails;
        this.maturityDate = event.data.maturityDate;
        this.loanAmount = event.data.outstandingPrincipal;
        this.firstInterestPaymentDate = event.data.firstInterestPaymentDate;
        this.firstPrincipalPaymentDate = event.data.firstPrincipalPaymentDate;
        this.applicationDate = event.data.effectiveDate;
        //this.feeAmount = event.data.feeAmount;
        this.feeAmount = 0;
        this.tenor = event.data.tenor;
        this.activeIndex = 1;
        this.loaddataForm(this.selectedloanreviewoperationsInformation);
        this.getLoanReviewDetails(this.loanId);
        // outstandingPrincipal
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


    getSchedule(event: any) {
      if (event) {
          this.selectedloanreviewoperationsInformation = event;
          swal.fire(
              "GOS FINANCIAL",
              "Schedule generated successfully",
              "success"
          );
      } else {
          swal.fire(
              "GOS FINANCIAL",
              "Opps! The schedule generation failed.",
              "error"
          );
      }
  }

    onOperationChange(operationTypeId) {
        this.displayLoanPrepayment = false;
        this.displayTenor = false;
        this.displayPrepayment = false;
        this.displayInterestrate = false;
        this.displayPaymentDateChange =false;
        this.displayInterestandPrincipalFrequencyChange=false;
        this.displayPrincipalFrequencyChange =false;
        this.displayInterestFrequencyChange =false;
        this.displayRestructure =false;
        let sValue = Number(operationTypeId)
        if(sValue === 19){
        this.displayTenor = false;
        this.displayLoanPrepayment = false;
        this.displayPaymentDateChange =false;
        this.displayPrincipalFrequencyChange =false;
        this.displayInterestandPrincipalFrequencyChange=false;
        this.displayInterestFrequencyChange =false;
        this.displayRestructure =false;
        this.displayInterestrate = true;
        }
        else if(sValue === 25){
        this.displayLoanPrepayment = false;
        this.displayInterestrate = false;
        this.displayPaymentDateChange =false;
        this.displayPrincipalFrequencyChange =false;
        this.displayInterestandPrincipalFrequencyChange=false;
        this.displayInterestFrequencyChange =false;
        this.displayRestructure =false;
        this.displayTenor = true;
        }
        else if (sValue === 20){
        this.displayTenor = false;
        this.displayInterestrate = false;
        this.displayPaymentDateChange =false;
        this.displayPrincipalFrequencyChange =false;
        this.displayInterestandPrincipalFrequencyChange=false;
        this.displayInterestFrequencyChange =false;
        this.displayRestructure =false;
        this.displayLoanPrepayment = true;
        }
        else if (sValue === 21){
          this.displayTenor = false;
          this.displayInterestrate = false;
          this.displayLoanPrepayment = false;
          this.displayPaymentDateChange =false;
          this.displayInterestFrequencyChange =false;
          this.displayInterestandPrincipalFrequencyChange=false;
          this.displayRestructure =false;
          this.displayPrincipalFrequencyChange =true;
          }
          else if (sValue === 22){
            this.displayTenor = false;
            this.displayInterestrate = false;
            this.displayLoanPrepayment = false;
            this.displayPaymentDateChange =false;
            this.displayPrincipalFrequencyChange =false;
            this.displayInterestandPrincipalFrequencyChange=false;
            this.displayRestructure =false;
            this.displayInterestFrequencyChange =true;
            }
        else if (sValue === 23){
          this.displayTenor = false;
          this.displayInterestrate = false;
          this.displayLoanPrepayment = false;
          this.displayPaymentDateChange =false;
          this.displayInterestFrequencyChange =false;
          this.displayPrincipalFrequencyChange =false;
          this.displayRestructure =false;
          this.displayInterestandPrincipalFrequencyChange=true;
          }
        else if (sValue === 24){
          this.displayTenor = false;
          this.displayInterestrate = false;
          this.displayLoanPrepayment = false;
          this.displayPrincipalFrequencyChange =false;
          this.displayInterestandPrincipalFrequencyChange=false;
          this.displayInterestFrequencyChange =false;
          this.displayRestructure =false;
          this.displayPaymentDateChange =true;
          }
          else if (sValue === 27){
            this.displayTenor = false;
            this.displayInterestrate = false;
            this.displayLoanPrepayment = false;
            this.displayPrincipalFrequencyChange =false;
            this.displayInterestandPrincipalFrequencyChange=false;
            this.displayInterestFrequencyChange =false;
            this.displayPaymentDateChange =false;
            this.displayRestructure =true;
            }
        else{
        this.displayLoanPrepayment = false;
        this.displayTenor = false;
        this.displayPrepayment = false;
        this.displayInterestrate = false;
        this.displayPaymentDateChange =false;
        this.displayPrincipalFrequencyChange =false;
        this.displayInterestandPrincipalFrequencyChange=false;
        this.displayInterestFrequencyChange =false;
        this.displayRestructure =false;
         }
    }

    loaddataForm(data) {
        if (data != undefined) {
          const row = data;
          this.loanreviewoperationsForm.controls["systemCurrentDate"].setValue(
            new Date(row.systemCurrentDate)
          );
          this.loanreviewoperationsForm.controls["principalAmount"].setValue(
            row.outstandingPrincipal
          );
          this.loanreviewoperationsForm.controls["interestRate"].setValue(
            row.interestRate
          );
          this.loanreviewoperationsForm.controls["proposedEffectiveDate"].setValue(
            new Date(row.effectiveDate)
          );
          this.loanreviewoperationsForm.controls["scheduleMethod"].setValue(
            row.scheduleTypeId
          );
          this.loanreviewoperationsForm.controls["interestFrequency"].setValue(
            row.interestFrequencyTypeId
          );
          this.loanreviewoperationsForm.controls["principalfrequency"].setValue(
            row.principalFrequencyTypeId
          );
          this.loanreviewoperationsForm.controls["tenor"].setValue(row.tenor);

          this.loanreviewoperationsForm.controls["principalFirstDate"].setValue(
            new Date(row.firstPrincipalPaymentDate)
          );
          this.loanreviewoperationsForm.controls["intrestFirstDate"].setValue(
            new Date(row.firstInterestPaymentDate)
          );
          this.loanreviewoperationsForm.controls["previousMaturityDate"].setValue(
            new Date(row.maturityDate)
          );
          this.loanreviewoperationsForm.controls["maturityDate"].setValue(
            new Date(row.maturityDate)
          );
          this.loanreviewoperationsForm.controls["numberOfPayments"].setValue(
            row.principalNumberOfInstallment
          );
          this.loanreviewoperationsForm.controls["basis"].setValue(
            row.accrualBasis
          );
          this.loanreviewoperationsForm.controls["integralFeeAmount"].setValue(0);
          this.loanreviewoperationsForm.controls["interestChargeType"].setValue(0);
          this.loanreviewoperationsForm.controls["withoutDisburment"].setValue(
            false
          );
          this.loanreviewoperationsForm.controls["productName"].setValue(
            row.productName
          );
          this.calculateTenor();
        }
      }

      calculateMaturityDate() {
        this.loanreviewoperationsForm.controls["maturityDate"].setValue(null);
        let newTenor = this.loanreviewoperationsForm.get("newtenor").value;
        if (newTenor <= 0) {
          swal.fire(
            "GOS FINANCIAL",
            "System cannot calculate maturity date with zero tenor.",
            "error"
          );
        }
        let effectiveDate = this.loanreviewoperationsForm.get(
          "proposedEffectiveDate"
        ).value;
        let ret = new Date(effectiveDate);
        var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
        this.loanreviewoperationsForm.controls["maturityDate"].setValue(
          maturityDate
        );
      }

      calculateTenor() {
        this.loanreviewoperationsForm.controls["newtenor"].setValue(null);
        let effectiveDate = this.loanreviewoperationsForm.get(
          "proposedEffectiveDate"
        ).value;
        let maturityDate = this.loanreviewoperationsForm.get("maturityDate").value;
        if (new Date(effectiveDate) > new Date(maturityDate)) {
          swal.fire(
            "GOS FINANCIAL",
            "Effective Date cannot be greater than Maturity Date.",
            "error"
          );
          return;
        }
        var tenor = this.dateUtilService.dateDiff(effectiveDate, maturityDate);
        this.loanreviewoperationsForm.controls["newtenor"].setValue(tenor);
      }

    rowClicked(row: any): void {

      }

      submitLoanReviewOperationForm(formObj) {
        if (this.data.operationTypeId == 59 || this.data.operationTypeId == 30) {
                if (new Date(formObj.value.rebookInterestFirstPmtDate) > new Date(formObj.value.rebookPrincipalFirstPmtDate)) {
                  swal.fire("GOS FINANCIAL",'Interest First Payment Date must be less than Principal First Payment Date .', 'info');
                  return
                }
              }
              if (this.data.operationTypeId == 25) {
                if (new Date(formObj.value.intrestFirstDate) > new Date(formObj.value.principalFirstDate)) {
                  swal.fire("GOS FINANCIAL",'Interest First Payment Date must be less than Principal First Payment Date .', 'info');
                  return
                }
              }
              if(formObj.value.prepayment == "") {
                formObj.value.prepayment = 0;
              }
        this.loadingService.show();
        if (this.data.operationTypeId == 25) {
          this.objBody = {
            loanReviewOperationsId: 0,
            loanId: this.loanId,
            lmsApplicationDetailId: this.lmsApplicationDetailId,
            productTypeId: this.productTypeId,
            operationTypeId: parseInt(formObj.value.operationTypeId),
            reviewDetails: this.reviewDetails,
            proposedEffectiveDate: new Date(formObj.value.systemCurrentDate),
            interateRate: this.interestRate,
            prepayment: formObj.value.prepayment,
            maturityDate: new Date(formObj.value.maturityDate),
            principalFrequencyTypeId: formObj.value.principalfrequency,
            interestFrequencyTypeId: formObj.value.interestFrequency,
            principalFirstPaymentDate: formObj.value.principalFirstDate,
            interestFirstPaymentDate: formObj.value.intrestFirstDate,
            tenor: formObj.value.tenor,
            cASA_AccountId: formObj.value.cASA_AccountId,
            accountNumber: formObj.value.accountNumber,
            overDraftTopup: formObj.value.overDraftTopup,
            fee_Charges: formObj.value.fee_Charges,
            terminationAndReBook: formObj.value.terminationAndReBook,
            completeWriteOff: formObj.value.completeWriteOff,
            cancelUndisbursedLoan: formObj.value.cancelUndisbursedLoan,
            approvalStatusId: formObj.value.approvalStatusId,
            isManagementRate: formObj.value.isManagementRate,
            reviewIrregularSchedule: this.scatterdPayments
          };
        }
        else  if (this.data.operationTypeId == 19) {
          this.objBody = {
            loanReviewOperationsId: 0,
            loanId: this.loanId,
            lmsApplicationDetailId: this.lmsApplicationDetailId,
            productTypeId: this.productTypeId,
            operationTypeId: parseInt(formObj.value.operationTypeId),
            reviewDetails: this.reviewDetails,
            proposedEffectiveDate: new Date(formObj.value.systemCurrentDate),
            interateRate: this.interestRate,
            prepayment: formObj.value.prepayment,
            maturityDate: new Date(formObj.value.maturityDate),
            principalFrequencyTypeId: formObj.value.principalfrequency,
            interestFrequencyTypeId: formObj.value.interestFrequency,
            principalFirstPaymentDate: formObj.value.principalFirstDate,
            interestFirstPaymentDate: formObj.value.intrestFirstDate,
            tenor: formObj.value.tenor,
            cASA_AccountId: formObj.value.cASA_AccountId,
            accountNumber: formObj.value.accountNumber,
            overDraftTopup: formObj.value.overDraftTopup,
            fee_Charges: formObj.value.fee_Charges,
            terminationAndReBook: formObj.value.terminationAndReBook,
            completeWriteOff: formObj.value.completeWriteOff,
            cancelUndisbursedLoan: formObj.value.cancelUndisbursedLoan,
            approvalStatusId: formObj.value.approvalStatusId,
            isManagementRate: formObj.value.isManagementRate,
            reviewIrregularSchedule: this.scatterdPayments
          };
        }

        else  if (this.data.operationTypeId == 24) {
          this.objBody = {
            loanReviewOperationsId: 0,
            loanId: this.loanId,
            lmsApplicationDetailId: this.lmsApplicationDetailId,
            productTypeId: this.productTypeId,
            operationTypeId: parseInt(formObj.value.operationTypeId),
            reviewDetails: this.reviewDetails,
            proposedEffectiveDate: new Date(formObj.value.systemCurrentDate),
            interateRate: this.interestRate,
            prepayment: formObj.value.prepayment,
            maturityDate: new Date(formObj.value.maturityDate),
            principalFrequencyTypeId: formObj.value.principalfrequency,
            interestFrequencyTypeId: formObj.value.interestFrequency,
            principalFirstPaymentDate: formObj.value.principalFirstDate,
            interestFirstPaymentDate: formObj.value.intrestFirstDate,
            tenor: formObj.value.tenor,
            cASA_AccountId: formObj.value.cASA_AccountId,
            accountNumber: formObj.value.accountNumber,
            overDraftTopup: formObj.value.overDraftTopup,
            fee_Charges: formObj.value.fee_Charges,
            terminationAndReBook: formObj.value.terminationAndReBook,
            completeWriteOff: formObj.value.completeWriteOff,
            cancelUndisbursedLoan: formObj.value.cancelUndisbursedLoan,
            approvalStatusId: formObj.value.approvalStatusId,
            isManagementRate: formObj.value.isManagementRate,
            reviewIrregularSchedule: this.scatterdPayments
          };
        }
        else if (this.data.operationTypeId == 21) {
          this.objBody = {
            loanReviewOperationsId: 0,
            loanId: this.loanId,
            lmsApplicationDetailId: this.lmsApplicationDetailId,
            productTypeId: this.productTypeId,
            operationTypeId: parseInt(formObj.value.operationTypeId),
            reviewDetails: this.reviewDetails,
            proposedEffectiveDate: new Date(formObj.value.systemCurrentDate),
            interateRate: this.interestRate,
            prepayment: formObj.value.prepayment,
            maturityDate: new Date(formObj.value.maturityDate),
            principalFrequencyTypeId: formObj.value.principalFrequency,
            interestFrequencyTypeId: formObj.value.interestFrequencyTypeId,
            principalFirstPaymentDate: formObj.value.principalFirstPaymentDate,
            interestFirstPaymentDate: formObj.value.interestFirstPaymentDate,
            tenor: formObj.value.tenor,
            cASA_AccountId: formObj.value.cASA_AccountId,
            accountNumber: formObj.value.accountNumber,
            overDraftTopup: formObj.value.overDraftTopup,
            fee_Charges: formObj.value.fee_Charges,
            terminationAndReBook: formObj.value.terminationAndReBook,
            completeWriteOff: formObj.value.completeWriteOff,
            cancelUndisbursedLoan: formObj.value.cancelUndisbursedLoan,
            approvalStatusId: formObj.value.approvalStatusId,
            isManagementRate: formObj.value.isManagementRate,
            reviewIrregularSchedule: this.scatterdPayments
          };
        }
        else if (this.data.operationTypeId == 22) {
          this.objBody = {
            loanReviewOperationsId: 0,
            loanId: this.loanId,
            lmsApplicationDetailId: this.lmsApplicationDetailId,
            productTypeId: this.productTypeId,
            operationTypeId: parseInt(formObj.value.operationTypeId),
            reviewDetails: this.reviewDetails,
            proposedEffectiveDate: new Date(formObj.value.systemCurrentDate),
            interateRate: this.interestRate,
            prepayment: formObj.value.prepayment,
            maturityDate: new Date(formObj.value.maturityDate),
            principalFrequencyTypeId: formObj.value.principalFrequencyTypeId,
            interestFrequencyTypeId: formObj.value.interestFrequency,
            principalFirstPaymentDate: formObj.value.principalFirstPaymentDate,
            interestFirstPaymentDate: formObj.value.interestFirstPaymentDate,
            tenor: formObj.value.tenor,
            cASA_AccountId: formObj.value.cASA_AccountId,
            accountNumber: formObj.value.accountNumber,
            overDraftTopup: formObj.value.overDraftTopup,
            fee_Charges: formObj.value.fee_Charges,
            terminationAndReBook: formObj.value.terminationAndReBook,
            completeWriteOff: formObj.value.completeWriteOff,
            cancelUndisbursedLoan: formObj.value.cancelUndisbursedLoan,
            approvalStatusId: formObj.value.approvalStatusId,
            isManagementRate: formObj.value.isManagementRate,
            reviewIrregularSchedule: this.scatterdPayments
          };
        }
        else if (this.data.operationTypeId == 23) {
          this.objBody = {
            loanReviewOperationsId: 0,
            loanId: this.loanId,
            lmsApplicationDetailId: this.lmsApplicationDetailId,
            productTypeId: this.productTypeId,
            operationTypeId: parseInt(formObj.value.operationTypeId),
            reviewDetails: this.reviewDetails,
            proposedEffectiveDate: new Date(formObj.value.systemCurrentDate),
            interateRate: this.interestRate,
            prepayment: formObj.value.prepayment,
            maturityDate: new Date(formObj.value.maturityDate),
            principalFrequencyTypeId: formObj.value.principalFrequency,
            interestFrequencyTypeId: formObj.value.interestFrequency,
            principalFirstPaymentDate: formObj.value.principalFirstPaymentDate,
            interestFirstPaymentDate: formObj.value.interestFirstPaymentDate,
            tenor: formObj.value.tenor,
            cASA_AccountId: formObj.value.cASA_AccountId,
            accountNumber: formObj.value.accountNumber,
            overDraftTopup: formObj.value.overDraftTopup,
            fee_Charges: formObj.value.fee_Charges,
            terminationAndReBook: formObj.value.terminationAndReBook,
            completeWriteOff: formObj.value.completeWriteOff,
            cancelUndisbursedLoan: formObj.value.cancelUndisbursedLoan,
            approvalStatusId: formObj.value.approvalStatusId,
            isManagementRate: formObj.value.isManagementRate,
            reviewIrregularSchedule: this.scatterdPayments
          };
        } else {

        //   let loanInfo = {
        //     customerId: this.selectedLoanApplication.customerId,
        //     productId: this.selectedLoanApplication.approvedProductId,
        //     loanApplicationId: this.selectedLoanApplication.loanApplicationId,
        //     currencyId: this.selectedLoanApplication.currencyId,
        //     exchangeRate: this.selectedLoanApplication.exchangeRate,
        //     companyId: this.selectedLoanApplication.companyId,
        //     principalAmount: this.selectedLoanApplication.approvedAmount,
        //     principalFrequencyTypeId: this.scheduldeDetails.principalFrequency,
        //     interestFrequencyTypeId: this.scheduldeDetails.interestFrequency,
        //     scheduleTypeId: this.scheduldeDetails.scheduleMethodId,
        //     effectiveDate: this.scheduldeDetails.effectiveDate,
        //     maturityDate: this.scheduldeDetails.maturityDate,
        //     loanStatusId: this.scheduldeDetails.loanApplicationStatusId,
        //     firstPrincipalPaymentDate: this.scheduldeDetails
        //         .principalFirstpaymentDate,
        //     firstInterestPaymentDate: this.scheduldeDetails
        //         .interestFirstpaymentDate,
        //     accrualBasis: this.scheduldeDetails.accurialBasis,
        //     firstDayType: this.scheduldeDetails.firstDayType,
        //     interestRate: this.scheduldeDetails.interestRate,
        //     casaAccountId: this.dibursementAccount
        // };
          this.objBody = {
            loanReviewOperationsId: 0,
            loanId: this.loanId,
            lmsApplicationDetailId: this.lmsApplicationDetailId,
            productTypeId: this.productTypeId,
            operationTypeId: parseInt(formObj.value.operationTypeId),
            reviewDetails: this.reviewDetails,
            proposedEffectiveDate: this.selectedloanreviewoperationsInformation.effectiveDate,
            interateRate:  this.interestRate,
            prepayment: parseInt(formObj.value.prepayment),
            maturityDate: this.selectedloanreviewoperationsInformation.maturityDate,
            principalFrequencyTypeId: formObj.value.principalfrequency,
            interestFrequencyTypeId: formObj.value.interestFrequency,
            principalFirstPaymentDate: this.selectedloanreviewoperationsInformation.principalFirstpaymentDate,
            interestFirstPaymentDate: this.selectedloanreviewoperationsInformation.interestFirstpaymentDate,
            tenor: formObj.value.tenor,
            accountNumber: formObj.value.accountNumber,
            reviewIrregularSchedule: this.scatterdPayments
          };
        }
        // return;
        if (this.loanId != null && this.objBody != null) {
          this.loanreviewoperationsService.addOperationReview(this.objBody).subscribe(
            res => {
              if (res.status.isSuccessful == true) {
                this.loadingService.hide();
                this.getApprovedLoanReview();
                this.activeIndex = 0
                swal.fire("GOS FINANCIAL", res.status.message.friendlyMessage, "success");
              } else {
                swal.fire("GOS FINANCIAL", res.status.message.friendlyMessage, "error");
                this.loadingService.hide();
              }
            },
            (err: any) => {
              swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
              this.loadingService.hide();
            }
          );
        }
      }
}
