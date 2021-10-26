import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { Router } from '@angular/router';
import { DepositAccountService } from '../../../core/services/depositaccount.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cashier-teller-balancing-transaction',
  templateUrl: './cashier-teller-balancing-transaction.component.html',
  styleUrls: ['./cashier-teller-balancing-transaction.component.css']
})
export class CashierTellerBalancingTransactionComponent implements OnInit {
  callover: any[] = [];
  selectedCallover: any[];
  viewHeight: any = '600px';
  cols: any[];
  constructor(
    private loadingService: LoadingService,
    private DepositAccountService: DepositAccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'name' },
      { field: 'fixedOrPercentage', header: 'fixedOrPercentage' },
      { field: 'amount_Percentage', header: 'amount_Percentage' },
      { field: 'description', header: 'description' }
    ];
    this.getCallovers();
  }

  showAddNew() {
    this.router.navigate(['/deposit/callover-form']);
  }

  getCallovers() {
    this.loadingService.show();
    this.DepositAccountService.getCallovers()
      .then(data => {
        this.loadingService.hide();
        this.callover = data['result'];
      })
      .catch(err => {
        this.loadingService.hide();
      });
  }
  editCallover(row) {
    this.router.navigate(['/deposit/callover-form'], {
      queryParams: { id: row.depositCashierTellerId }
    });
  }

  submitCallover(formObj) {
    this.loadingService.show();
    let body = { setup: formObj };
    this.DepositAccountService.deleteCallover(body)
      .then(data => {
        this.loadingService.hide();
        if (data['result'] == true) {
          swal.fire('GOSFINANCIAL', data['message'], 'success');
          this.getCallovers();
        } else {
          swal.fire('GOSFINANCIAL', data['message'], 'error');
        }
      })
      .catch(err => {
        this.loadingService.hide();
      });
  }

  multipleDelete() {
    if (this.selectedCallover.length == 0) {
      return swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
    }
    let tempData = this.selectedCallover;
    let items = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          setupId: el.depositCashierTellerId
        };
        items.push(data);
      });
      const __this = this;
      swal
        .fire({
          title: 'Are you sure you want to delete record?',
          text: "You won't be able to revert this",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes!'
        })
        .then(result => {
          if (result.value) {
            this.submitCallover(items);
          } else {
            swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
          }
        });
    }
  }
}
