import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {DepositAccountService} from '../../../core/services/depositaccount.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account-reactivation-list',
  templateUrl: './account-reactivation-list.component.html',
  styleUrls: ['./account-reactivation-list.component.css']
})
export class AccountReactivationListComponent implements OnInit {
  formTitle: string = 'Account Reactivation List';
  reactivationLists: any[] = [];
  cols: any[] = [];
  selectedItems: any;
  viewHeight: string = '600px';

  constructor(
    private loadingService: LoadingService,
    private depositService: DepositAccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAccountReactivationList()
  }

  getAccountReactivationList() {
    this.loadingService.show();
    return this.depositService.getReactivationList().subscribe(data => {
      this.loadingService.hide();
      this.reactivationLists = data.reactivated_customers;
    }, err => {
      this.loadingService.hide()
    })
  }

  showAddNew() {
    this.router.navigate(['/deposit/accountreactivation'])
  }
}
