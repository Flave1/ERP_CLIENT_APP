import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { DepositAccountOpeningService } from '../../../core/services/depositaccountopening.service';

@Component({
  selector: 'app-accountopening-list',
  templateUrl: './accountopening-list.component.html',
})
export class AccountopeningListComponent implements OnInit {
  activeIndex: number = 0;
  Customer: any[] = [];
  selectedCustomer: any[];
  cols: any[];
  viewHeight: any = '600px';
  constructor(
    private loadingService: LoadingService,
    private CustomerService: DepositAccountOpeningService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'customerTypeName', header: 'customerTypeName' },
      { field: 'firstName', header: 'firstName' },
      { field: 'email', header: 'email' },
      { field: 'phoneNo', header: 'phoneNo' },
    ];
    this.getAllCustomer();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }
  showAddNew() {
    this.router.navigate(['/deposit/accountopening']);
  }

  getAllCustomer() {
    this.loadingService.show();
    this.CustomerService.getAllCustomerLite().subscribe(
      (data) => {
        this.loadingService.hide();
        this.Customer = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  editCustomer(row) {
    this.router.navigate(['/deposit/accountopening'], {
      queryParams: { editCustomer: row.customerId, type: row.customerTypeId },
    });
  }
  deleteCustomer(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete this Record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.CustomerService.deleteCustomer(row.customerId).subscribe(
            (data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                __this.getAllCustomer();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  openNext() {
    this.activeIndex = this.activeIndex === 5 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 5 : this.activeIndex - 1;
  }
  onRowSelect(event) {
    this.router.navigate(['/deposit/accountopening'], {
      queryParams: { editCustomer: event.data.customerId },
    });
  }
}
