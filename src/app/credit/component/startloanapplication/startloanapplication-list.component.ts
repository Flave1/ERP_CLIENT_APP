import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-startloanapplication-list',
  templateUrl: './startloanapplication-list.component.html',
})
export class StartLoanApplicationListComponent implements OnInit {
  cols: any[];
  activeIndex: number = 0;
  loanCustomerInformation: any[] = [];
  selectedLoanCustomerInformation: any[];
  viewHeight: any = '600px';
  searchUser: FormGroup;
  constructor(
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.searchUser = this.fb.group({
      fullName: [''],
      email: [''],
      accountNumber: [''],
    });
    this.cols = [
      { field: 'customerTypeName', header: 'customerTypeName' },
      { field: 'firstName', header: 'firstName' },
      { field: 'phoneNo', header: 'phoneNo' },
      { field: 'currentExposure', header: 'currentExposure' },
      { field: 'totalExposure', header: 'totalExposure' },
    ];
    // this.getAllStartLoanCustomer();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }
  showAddNew() {
    this.router.navigate(['/credit/startloanapplication-info']);
  }

  getAllStartLoanCustomer() {
    this.loadingService.show();
    this.loanCustomerService.getAllStartLoanCustomer().subscribe(
      (data) => {
        this.loadingService.hide();
        this.loanCustomerInformation = data.customers;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  onRowSelect(event) {
    this.router.navigate(['/credit/startloanapplication-info'], {
      queryParams: { editloanCustomerinfo: event.data.customerId },
    });
  }
  applyForLoan(row) {
    if (row.currentExposure > row.totalExposure) {
      swal.fire(
        'GOS FINANCIAL',
        'Current Exposure is more than Total Exposure',
        'error'
      );
      return;
    }
    this.router.navigate(['/credit/startloanapplication-info'], {
      queryParams: { editloanCustomerinfo: row.customerId },
    });
  }
  deleteLoanCustomer(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete item?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomer(row.customerId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'User deleted successful.',
                  'success'
                );
                __this.getAllStartLoanCustomer();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
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
  multipleDelete() {
    if (this.selectedLoanCustomerInformation.length === 0) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
      return;
    }
    const tempData = this.selectedLoanCustomerInformation;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        const data = {
          targetId: el.userAccountId,
        };
        targetIds.push(data);
      });
    }
    const body = {
      targetIds: targetIds,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        // if (result.value) {
        //     __this.loadingService.show();
        //
        //     __this.customerFsService
        //         .deleteMultipleUsers(body)
        //         .subscribe(data => {
        //             __this.loadingService.hide();
        //             if (data['result'] == true) {
        //                 swal.fire(
        //                     'GOS FINANCIAL',
        //                     'Record deleted successful.',
        //                     'success'
        //                 );
        //                 __this.getAllUser();
        //             } else {
        //                 swal.fire(
        //                     'GOS FINANCIAL',
        //                     'Record not deleted',
        //                     'error'
        //                 );
        //             }
        //         });
        // } else {
        //     swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        // }
      });
  }

  searchCustomers(userDetails: FormGroup) {
    const { fullName, email, accountNumber } = userDetails.value;
    this.loadingService.show();
    return this.loanCustomerService
      .searchLoanCustomers(fullName, email, accountNumber)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.loanCustomerInformation = data.customers;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }
}
