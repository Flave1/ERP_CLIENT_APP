import { Component, OnInit } from '@angular/core';
import {LoanService} from '../../../core/services/loan.service';
import {LoadingService} from '../../../core/services/loading.service';

@Component({
  selector: 'app-past-due-loans',
  templateUrl: './past-due-loans.component.html',
  styleUrls: ['./past-due-loans.component.css']
})
export class PastDueLoansComponent implements OnInit {
  viewHeight: string = '600px';
  overdues: any[] = [];
  cols: any;
  activeIndex: number = 0;
  loanId: any;
  loanSelected: boolean;
  selectedLoan: null;
  constructor(
    private loanService: LoanService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.cols = [
      {
        field: 'customerName', header: 'customerName'
      }
    ];
    this.getOverdues();
  }

  getOverdues() {
    this.loadingService.show();
    return this.loanService.getOverdues().subscribe(data => {
      this.loadingService.hide();
     this.overdues = data.manageLoans;
    }, err => {

      this.loadingService.hide()
    })
  }

  onTabChange(e) {
    this.activeIndex = e.index;
    if (this.activeIndex == 0) {
      this.loanSelected = false;
      this.selectedLoan = null;
    }
  }

  selectLoan(event: any) {
    this.loanId = event.data.loanId;
    this.activeIndex = 1
  }
}
