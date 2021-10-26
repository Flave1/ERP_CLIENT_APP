import { Component, OnInit } from '@angular/core';
import {LoanService} from '../../../core/services/loan.service';
import {LoadingService} from '../../../core/services/loading.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loan-applications',
  templateUrl: './loan-applications.component.html',
  styleUrls: ['./loan-applications.component.css']
})
export class LoanApplicationsComponent implements OnInit {
  loanApplicationList: any[] = [];
  cols: any;
  selectedLoanApplication: any = {};
  viewHeight: string = '600px';

  constructor(private loanService: LoanService, private loadingService: LoadingService, private router: Router) { }

  ngOnInit() {
    this.getWebsiteLoanApplications()
  }
  getWebsiteLoanApplications() {
    this.loadingService.show();
    return this.loanService.getWebsiteLoanApplications().subscribe(data => {
      this.loadingService.hide();
      this.loanApplicationList = data.loanApplications
    }, (error)=> {
      this.loadingService.hide()
    })
  }

  onRowSelect(event: any) {
    this.router.navigate(["/credit/startloanapplication-info"], {
      queryParams: { editloanCustomerinfo: event.data.customerId, id: event.data.websiteLoanApplicationId }
    });
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
}
