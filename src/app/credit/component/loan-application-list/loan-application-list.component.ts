import { LoanApplicationService } from './../../../core/services/loanapplication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loan-application-list',
  templateUrl: './loan-application-list.component.html',
})
export class LoanApplicationListComponent implements OnInit, OnDestroy {
  loanApplicationList: any[] = [];
  selectedLoanApplication: any = {};
  viewHeight: string = '600px';
  cols: any[];
  constructor(
    private loadingService: LoadingService,
    private loanApplicationService: LoanApplicationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'applicationRefNumber', header: 'applicationRefNumber' },
      { field: 'customerName', header: 'customerName' },
      { field: 'proposedAmount', header: 'proposedAmount' },
      // { field: "currentExposure", header: "currentExposure" },
      // { field: "totalExposure", header: "totalExposure" }
    ];
    this.getLoanApplicationList();
  }

  getLoanApplicationList(): Subscription {
    this.loadingService.show();
    return this.loanApplicationService.getLoanApplicationList().subscribe(
      (data) => {
        this.loadingService.hide();
        this.loanApplicationList = data.loanApplications;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getApplicationStatus(approvalStatus) {
    if (approvalStatus == 1)
      return '<span class="label label-success"> Eligibility Pending </span>';
    if (approvalStatus == 2)
      return '<span class="label label-info">Application Completed</span>';
    if (approvalStatus == 13)
      return '<span class="label label-danger">Eligibility In Progress</span>';
    if (approvalStatus == 14)
      return '<span class="label label-danger">Appraisal Pending</span>';
    if (approvalStatus == 3)
      return '<span class="label label-warning">Appraisal In Progress </span>';

    return '<span class="label label-warning">NEW </span>';
  }
  onRowSelect(event) {
    if (event.data.loanApplicationStatusId == 1) {
      this.router.navigate([
        '/credit/eligibility-check',
        event.data.loanApplicationId,
      ]);
    }
  }

  ngOnDestroy(): void {
    this.loadingService.hide();
    this.getLoanApplicationList().unsubscribe();
  }
}
