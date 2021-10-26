import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../../core/services/loan.service';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-payment-due-loans',
  templateUrl: './payment-due-loans.component.html',
  styleUrls: ['./payment-due-loans.component.css'],
})
export class PaymentDueLoansComponent implements OnInit {
  viewHeight: string = '600px';
  paymentsDue: any[] = [];
  cols: any;
  activeIndex: any;
  loanId: any;
  loanSelected: boolean;
  selectedLoan: any;
  constructor(
    private loanService: LoanService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        field: 'customerName',
        header: 'customerName',
      },
    ];
    this.getPaymentsDue();
  }
  getPaymentsDue() {
    this.loadingService.show();
    return this.loanService.getPaymentDues().subscribe(
      (data) => {
        this.loadingService.hide();
        this.paymentsDue = data.manageLoans;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  onTabChange(e) {
    this.activeIndex = e.index;
    if (this.activeIndex == 0) {
      this.loanSelected = false;
      this.selectedLoan = null;
    }
  }

  selectLoan(event: any) {
    console.log(event);
    this.selectedLoan = event;
    this.loanId = event.loanId;
    this.loanSelected = true;
    this.activeIndex = 1;
  }
}
