import { LoadingService } from 'src/app/core/services/loading.service';
import { LoanApplicationService } from './../../../core/services/loanapplication.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { CreditRiskScoreCardService } from 'src/app/core/services/creditriskscorecard';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-loan-eligibility-check',
  templateUrl: './loan-eligibility-check.component.html',
})
export class LoanEligibilityCheckComponent implements OnInit {
  otherTabDisabled: boolean = false;
  activeIndex: number = 0;
  loanApplicationId: any;
  loanInfo: any = {};
  creditRating: string;
  creditRatingList: any;
  customerId: number;
  exposureDetails: any;
  proposedAmount: any;
  totalExposure: any;
  fromDashboard: boolean;
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private loanApplicationService: LoanApplicationService,
    private creditService: CreditRiskScoreCardService,
    private loanCustomerService: LoanCustomerService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((param) => {
      this.customerId = param.customerId;
    });
    this.route.url.subscribe((data) => {
      // Get the last piece of the URL
      let routePath = data[data.length - 1].path;
      if (routePath != undefined) {
        this.loanApplicationId = Number(routePath);
        this.getLoanInfo(this.loanApplicationId);
      }
    });
  }
  onTabChange(e) {
    this.activeIndex = e.index;
    if (this.activeIndex == 1) {
      //this.getLoanInfo(this.loanApplicationId);
    }
  }

  getAllStartLoanCustomer() {
    this.loadingService.show();
    this.loanCustomerService
      .getAllStartLoanCustomerbyId(this.customerId)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.exposureDetails = data.customers[0].currentExposure;
          this.totalExposure = data.customers[0].totalExposure;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }
  getAllCreditRating(loan) {
    this.loadingService.show();
    this.creditService.getAllCreditRating().subscribe(
      (data) => {
        this.loadingService.hide();
        this.creditRatingList = data.creditRiskRating;
        if (this.creditRatingList != undefined) {
          let exactRate = this.creditRatingList.find(
            (x) =>
              x.minRange < loan.probabilityOfDefault &&
              x.maxRange > loan.probabilityOfDefault
          );
          if (exactRate != undefined) {
            this.creditRating = exactRate.rate;
          } else {
            this.creditRating = 'N/A';
          }
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  openNext() {
    this.activeIndex = this.activeIndex === 1 ? 0 : this.activeIndex + 1;
    if (this.activeIndex == 1) {
      //this.getLoanInfo(this.loanApplicationId);
    }
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 1 : this.activeIndex - 1;
  }
  goBack() {
    this.router.navigate(['/credit/application-list']);
  }
  getLoanInfo(loanApplicationId) {
    this.loanApplicationService
      .getLoanApplication(loanApplicationId)
      .subscribe((data) => {
        this.loanInfo = data.loanApplications[0];
        this.proposedAmount = data.loanApplications[0].proposedAmount;
        if (this.loanInfo != undefined) {
          this.customerId = this.loanInfo.customerId;
          this.getAllCreditRating(this.loanInfo);
          this.getAllStartLoanCustomer();
        }
      });
  }
  ProceedToApproval() {
    const amount = this.exposureDetails + this.proposedAmount;
    if (amount > this.totalExposure) {
      swal.fire(
        'GOS FINANCIAL',
        'Current Exposure is more than Total Exposure',
        'error'
      );
      return;
    }
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to proceed to approval?',
        text: 'You wont be able to make changes once you click proceed!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();
          __this.loanApplicationService
            .SubmitForApproval(__this.loanApplicationId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data.responseId == 1) {
                swal.fire(
                  'GOS FINANCIAL',
                  data.status.message.friendlyMessage,
                  'success'
                );
                __this.router.navigate(['/credit/application-list']);
                // } else if (data.responseId == 2) {
                //     __this.activeIndex = 0;
                //     swal.fire(
                //         "GOS FINANCIAL",
                //         "Please fill Score Card to continue",
                //         "error"
                //     );
                // } else if (data.responseId == 3) {
                //     __this.activeIndex = 0;
                //     swal.fire(
                //         "GOS FINANCIAL",
                //         "Please fill Credit Bureau to continue",
                //         "error"
                //     );
              } else if (data.responseId == 4) {
                this.router.navigate(['/credit/loan-collateral'], {
                  queryParams: {
                    loanapp: __this.loanApplicationId,
                    obligor: this.customerId,
                    loanman: ``,
                  },
                });
              } else {
                swal.fire(
                  'GOS FINANCIAL',
                  data.status.message.friendlyMessage,
                  'error'
                );
              }
            });
        } else {
          __this.activeIndex = 0;
        }
      });
  }
}
