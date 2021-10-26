import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ProductService } from 'src/app/core/services/product.service';
import { CreditAppraisalService } from 'src/app/core/services/credit-appraisal.service';
import swal from 'sweetalert2';
import { CollateralService } from 'src/app/core/services/collateral.service';
import { DataService } from '../../../core/services/data.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-loan-booing-approval',
  templateUrl: './loan-booing-approval.component.html',
})
export class LoanBooingApprovalComponent implements OnInit, OnDestroy {
  bookedLoanList: any[] = [];
  selectedLoan: any = {};
  customerId: number;
  loanApplicationId: number;
  activeIndex: number = 0;
  boardMember: boolean = false;
  products: any[] = [];
  productName: string;
  viewHeight: any = '600px';
  displayApprovalComment: boolean = false;
  privilege: any = {};
  creditScore: string;
  probabilityOfDefault: string;
  trails: any[] = [];
  operationId: number = 10;
  loanNotSelected: boolean = true;
  canBook: boolean = false;
  loanAmount: number;
  integralFeeAmount: number;
  data: any = {};
  approvalStatusData: any[] = [];
  loanId: number;
  productId: any;
  cols: any[];
  workFlowToken: string;
  showDialog: boolean;
  staffId: any;
  staffs: any[] = [];
  fsValue: any[] = [];
  constructor(
    private loanService: LoanService,
    private loadingService: LoadingService,
    private productService: ProductService,
    private creditAppraisalService: CreditAppraisalService,
    private collateralService: CollateralService,
    private dataService: DataService
  ) {
    this.dataService.showSection.subscribe((res) => {
      this.fsValue = res.fsValue;
    });
  }

  ngOnInit() {
    this.cols = [
      {
        field: 'bookingDate',
        header: 'bookingDate',
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
        field: 'productName',
        header: 'productName',
      },
      {
        field: 'principalAmount',
        header: 'principalAmount',
      },
    ];
    this.loanNotSelected = true;
    this.getAllBookedLoan();
  }
  getAllBookedLoan(): Subscription {
    this.loadingService.show();
    return this.loanService.getAllBookedLoan().subscribe((data) => {
      this.loadingService.hide();
      if (data.manageLoans == null) {
        this.bookedLoanList = [];
      } else {
        this.bookedLoanList = data.manageLoans;
      }
    });
  }

  onTabChange(e) {
    this.activeIndex = e.index;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoan = {};
    }
  }

  openNext() {
    this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoan = null;
    }
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 2 : this.activeIndex - 1;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoan = null;
    }
  }
  onRowSelect(event) {
    this.selectedLoan = event.data;
    this.customerId = event.data.customerId;
    this.loanApplicationId = event.data.loanId;
    this.loanAmount = Number(event.data.principalAmount);
    this.productName = event.data.productName;
    this.productId = event.data.productId;
    this.creditScore = event.data.creditScore;
    this.loanId = event.data.loanId;
    this.probabilityOfDefault = event.data.probabilityOfDefault;
    this.workFlowToken = event.data.workflowToken;
    this.activeIndex = 1;
    this.loanNotSelected = false;
    this.getApprovalTrail(this.loanId, this.workFlowToken);
  }

  onSelectClicked(row) {
    this.selectedLoan = row;
    this.customerId = row.customerId;
    this.loanApplicationId = row.loanApplicationId;
    this.loanAmount = Number(row.principalAmount);
    this.productName = row.productName;
    this.productId = row.productId;
    this.creditScore = row.creditScore;
    this.loanId = row.loanId;
    this.probabilityOfDefault = row.probabilityOfDefault;
    this.workFlowToken = row.workflowToken;
    this.activeIndex = 1;
    this.loanNotSelected = false;
    this.getApprovalTrail(this.loanId, this.workFlowToken);
  }
  getApprovalTrail(loanApplicationId, operationId) {
    this.creditAppraisalService
      .getApprovalTrail(loanApplicationId, operationId)
      .subscribe((data) => {
        this.trails = data.details;
        this.staffs = data.previousStaff;
      });
  }

  submitApproval(formObj) {
    let body = {
      targetId: this.selectedLoan.loanId,
      approvalStatusId: parseInt(formObj.approvalStatusId),
      comment: formObj.comment,
      referredStaffId: +this.staffId,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to book this loan?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanService.goForApproval(body).subscribe((data) => {
            __this.loadingService.hide();
            if (data.status.isSuccessful == true) {
              swal.fire(
                'GOS FINANCIAL',
                data.status.message.friendlyMessage,
                'success'
              );
              __this.canBook = false;
              __this.getAllBookedLoan();
              __this.loanNotSelected = true;
              __this.activeIndex = 0;
              __this.selectedLoan = {};
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
  resetButton(value) {}

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

  ngOnDestroy(): void {
    this.loadingService.hide();
    this.getAllBookedLoan().unsubscribe();
  }
}
