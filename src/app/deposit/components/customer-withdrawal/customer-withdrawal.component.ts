import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DepositAccountService} from '../../../core/services/depositaccount.service';
import {LoadingService} from '../../../core/services/loading.service';

@Component({
  selector: 'app-customer-withdrawal',
  templateUrl: './customer-withdrawal.component.html',
  styleUrls: ['./customer-withdrawal.component.css']
})
export class CustomerWithdrawalComponent implements OnInit {
  withdrawals: any[] = [];
  cols: any[] = [];
  selectedWithdrawals: any;
  viewHeight: string = '600px';
  formTitle: string = "Withdrawals";

  constructor(
    private router: Router,
    private depositService: DepositAccountService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.getAllWithdrawals()
  }

  showAddNew() {
    this.router.navigate(['/deposit/withdrawalform'])
  }
  getAllWithdrawals() {
    this.loadingService.show();
    return this.depositService.getWithdrawals().subscribe(data => {
      this.loadingService.hide();
      this.withdrawals = data.customer_deposits
    }, err => {
      this.loadingService.hide()
    })
  }
}
