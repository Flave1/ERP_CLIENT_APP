import { LmsService } from './../../../../core/services/lms.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ProductService } from 'src/app/core/services/product.service';
import { CollateralService } from 'src/app/core/services/collateral.service';
import { CreditAppraisalService } from 'src/app/core/services/credit-appraisal.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { LoanService } from 'src/app/core/services/loan.service';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-lms-appraisal',
  templateUrl: './lms-appraisal.component.html',
})
export class LmsAppraisalComponent implements OnInit {
  canSubmit: boolean = false;
  boardMember: boolean = false;
  products: any[] = [];
  recommendationCommentForm: FormGroup;
  activeIndex: number = 0;
  loanReviewApplicationList: any[] = [];
  selectedLoanApplication: any = {};
  customerId: number;
  loanApplicationId: number;
  productFees: any[] = [];
  productName: string;
  displayApprovalComment: boolean = false;
  privilege: any = {};
  creditScore: string;
  probabilityOfDefault: string;
  trails: any[] = [];
  operationId: number = 16;
  loanNotSelected: boolean = true;
  loanCollaterals: any[];
  loanReviewApplicationId: any;
  loanId: number;
  IntegralFee: any = 0;
  loandate: any;
  InterateRate: any;
  Tenor: any;
  Amount: any;
  scheduldeDetails: any;
  canBook: boolean = false;
  cols: any[];
  viewHeight: any = '600px';
  prepaymentOperation: boolean = false;
  workFlowToken: string;
  showDialog: boolean;
  staffId: any;
  staffs: any[] = [];
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private productService: ProductService,
    private collateralService: CollateralService,
    private creditAppraisalService: CreditAppraisalService,
    private lmsService: LmsService,
    private loanService: LoanService,
    private dataService: DataService
  ) {
    this.dataService.getData.subscribe((res) => {
      (this.Amount = res.approvedAmount),
        (this.loandate = res.firstPrincipalPaymentDate);
      this.InterateRate = res.approvedRate;
      this.Tenor = res.approvedTenor;
      this.IntegralFee = 0;
    });
    this.dataService.getScheduleData.subscribe((data) => {
      console.log("schdeduledata", data);
      this.Amount = data.amount;
      this.loandate = data.firstInterestPaymentDate;
      this.InterateRate = data.rate;
      this.Tenor = data.tenor;
    });
    this.dataService.getRealData.subscribe((res) => {
      if (this.operationId == 20) {
        (this.Amount = res.new_amount),
          (this.loandate = res.firstPrincipalPaymentDate);
        this.InterateRate = res.rate;
        this.Tenor = res.tenor;
        this.IntegralFee = 0;
      }
    });
  }

  ngOnInit() {
    this.scheduldeDetails = {};
    this.cols = [
      {
        field: 'productName',
        header: 'loanRefNumber',
      },
      {
        field: 'loanRefNumber',
        header: 'loanRefNumber',
      },
      {
        field: 'customerName',
        header: 'customerName',
      },
      {
        field: 'propposedInterestRate',
        header: 'propposedInterestRate',
      },
      {
        field: 'propposedTenor',
        header: 'propposedTenor',
      },
      {
        field: 'propposedAmount',
        header: 'propposedAmount',
      },
    ];
    this.clearRequestControls();
    this.getAllLoanApplication();
    this.getUserPriviledge(this.operationId);
  }

  clearRequestControls() {
    this.recommendationCommentForm = this.fb.group({
      comment: ['', Validators.required],
      approvalStatusId: [0, Validators.required],
    });
  }

  getAllLoanApplication() {
    this.loadingService.show();
    this.lmsService
      .getAllLoanReviewApplicationAwaitingApproval()
      .subscribe((data) => {
        this.loadingService.hide();
        this.loanReviewApplicationList = data.loanReviewList;
        //this.operationId = data.loanReviewList[0].operationId;
      });
  }

  getAllLoanApplicationById(Id) {
    this.loanService.getAllLoanApplicationbyId(Id).subscribe((data) => {
      this.IntegralFee = 0;
      this.loandate = data['result'][0].effectiveDate;
      this.InterateRate = data['result'][0].proposedRate;
      this.Tenor = data['result'][0].proposedTenor;
      this.Amount = data['result'][0].approvedAmount;
    });
  }

  getSchedule(event: any) {
    if (event) {
      this.scheduldeDetails = event;
      swal.fire('GOS FINANCIAL', 'Schedule generated successfully', 'success');
      this.canBook = true;
    } else {
      this.canBook = false;
      swal.fire(
        'GOS FINANCIAL',
        'Opps! The schedule generation failed.',
        'error'
      );
    }
  }

  getUserPriviledge(operationId) {
    this.loadingService.show();
    this.creditAppraisalService.getUserPriviledge(operationId).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data != null) {
          this.privilege = data;
          if (!this.privilege) {
            this.canSubmit = true;
          }
        } else {
          this.privilege = {};
        }
      },
      (err) => {
        throw new Error(err);
      }
    );
  }

  getApprovalTrail(loanApplicationId, operationId) {
    this.creditAppraisalService
      .getApprovalTrail(loanApplicationId, operationId)
      .subscribe((data) => {
        this.trails = data.details;
        this.staffs = data.previousStaff;
      });
  }
  getAllLoanCollateral(loanApplicationId) {
    this.collateralService
      .getLoanCollateral(loanApplicationId)
      .subscribe((data) => {
        this.loanCollaterals = data.loanApplicationCollaterals;
      });
  }
  onTabChange(e) {
    this.activeIndex = e.index;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoanApplication = null;
    }
  }

  openNext() {
    this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoanApplication = null;
    }
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 2 : this.activeIndex - 1;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoanApplication = null;
    }
  }

  onRowSelect(event) {
    this.loanNotSelected = false;
    this.selectedLoanApplication = event.data;
    this.customerId = event.data.customerId;
    this.loanApplicationId = event.data.loanApplicationId;
    this.loanReviewApplicationId = event.data.loanReviewApplicationId;
    this.loanId = event.data.loanId;
    this.productName = event.data.productName;
    this.creditScore = event.data.creditScore;
    this.probabilityOfDefault = event.data.probabilityOfDefault;
    this.workFlowToken = event.data.workflowToken;
    this.activeIndex = 1;
    this.getAllLoanCollateral(this.loanApplicationId);
    this.getApprovalTrail(this.loanId, this.workFlowToken);
    //this.getAllLoanApplicationById(this.loanApplicationId);
  }
  onSelectClicked(row) {
    this.loanNotSelected = false;
    this.selectedLoanApplication = row;
    this.customerId = row.customerId;
    this.loanApplicationId = row.loanApplicationId;
    this.loanReviewApplicationId = row.loanReviewApplicationId;
    this.loanId = row.loanId;
    this.productName = row.productName;
    this.creditScore = row.creditScore;
    this.probabilityOfDefault = row.probabilityOfDefault;
    this.workFlowToken = row.workflowToken;
    this.activeIndex = 1;
    this.getAllLoanCollateral(this.loanApplicationId);
    this.getApprovalTrail(this.loanId, this.workFlowToken);
    this.operationId = row.operationId;
    if (this.operationId == 20) {
      this.prepaymentOperation = true;
    } else {
      this.prepaymentOperation = false;
    }
  }

  submitApproval(formObj) {
    let body = {
      targetId: this.loanReviewApplicationId,
      approvalStatusId: parseInt(formObj.value.approvalStatusId),
      comment: formObj.value.comment,
      referredStaffId: +this.staffId,
      loanId: this.loanId,
      customerId: this.customerId,
      productId: this.selectedLoanApplication.productId,
      loanApplicationId: this.loanApplicationId,
      currencyId: this.selectedLoanApplication.currencyId,
      exchangeRate: this.selectedLoanApplication.exchangeRate,
      companyId: this.selectedLoanApplication.companyId,
      principalAmount: this.Amount,
      principalFrequencyTypeId: this.scheduldeDetails.principalFrequency,
      interestFrequencyTypeId: this.scheduldeDetails.interestFrequency,
      scheduleTypeId: this.scheduldeDetails.scheduleMethodId,
      effectiveDate: this.scheduldeDetails.effectiveDate,
      maturityDate: this.scheduldeDetails.maturityDate,
      loanStatusId: this.scheduldeDetails.loanApplicationStatusId,
      firstPrincipalPaymentDate: this.scheduldeDetails
        .principalFirstpaymentDate,
      firstInterestPaymentDate: this.scheduldeDetails.interestFirstpaymentDate,
      accrualBasis: this.scheduldeDetails.accurialBasis,
      firstDayType: this.scheduldeDetails.firstDayType,
      interestRate: this.scheduldeDetails.interestRate,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to approve this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();
          __this.lmsService.goForLoanReviewApproval(body).subscribe((data) => {
            __this.loadingService.hide();
            if (data.status.isSuccessful == true) {
              swal.fire(
                'GOS FINANCIAL',
                data.status.message.friendlyMessage,
                'success'
              );
              __this.getAllLoanApplication();
              this.activeIndex = 0;
            } else {
              swal.fire(
                'GOS FINANCIAL',
                data.status.message.friendlyMessage,
                'error'
              );
            }
          });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  saveGeneratedSchedule(formObj) {
    let body = {
      targetId: this.loanReviewApplicationId,
      approvalStatusId: parseInt(formObj.value.approvalStatusId),
      comment: formObj.value.comment,

      loanId: this.loanId,
      customerId: this.customerId,
      productId: this.selectedLoanApplication.productId,
      loanApplicationId: this.loanApplicationId,
      currencyId: this.selectedLoanApplication.currencyId,
      exchangeRate: this.selectedLoanApplication.exchangeRate,
      companyId: this.selectedLoanApplication.companyId,
      principalAmount: this.Amount,
      principalFrequencyTypeId: this.scheduldeDetails.principalFrequency,
      interestFrequencyTypeId: this.scheduldeDetails.interestFrequency,
      scheduleTypeId: this.scheduldeDetails.scheduleMethodId,
      effectiveDate: this.scheduldeDetails.effectiveDate,
      maturityDate: this.scheduldeDetails.maturityDate,
      loanStatusId: this.scheduldeDetails.loanApplicationStatusId,
      firstPrincipalPaymentDate: this.scheduldeDetails
        .principalFirstpaymentDate,
      firstInterestPaymentDate: this.scheduldeDetails.interestFirstpaymentDate,
      accrualBasis: this.scheduldeDetails.accurialBasis,
      firstDayType: this.scheduldeDetails.firstDayType,
      interestRate: this.scheduldeDetails.interestRate,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to save this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();
          __this.lmsService
            .SaveLoanReviewApprovalSchedule(body)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data.status.isSuccessful == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  data.status.message.friendlyMessage,
                  'success'
                );
                this.canSubmit = true;
                // __this.getAllLoanApplication();
                // this.activeIndex = 0;
              } else {
                swal.fire(
                  'GOS FINANCIAL',
                  data.status.message.friendlyMessage,
                  'error'
                );
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  getValue(value: string) {
    if (value == '5') {
      this.showDialog = true;
    } else {
      this.staffId = 0;
    }
  }

  dismissDialog() {
    this.showDialog = false;
  }
}
