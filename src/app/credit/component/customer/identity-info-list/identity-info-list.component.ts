import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';
import { DataService } from '../../../../core/services/data.service';
import swal from 'sweetalert2';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-identity-info-list',
  templateUrl: './identity-info-list.component.html',
  styleUrls: ['./identity-info-list.component.css'],
})
export class IdentityInfoListComponent implements OnInit {
  @Input() customerId: string;
  @Output() editIdentity: EventEmitter<any> = new EventEmitter<any>();
  @Output() toggleModal: EventEmitter<any> = new EventEmitter<any>();
  loanCustomerIdentityDetails: any[] = [];
  constructor(
    private loanCustomerService: LoanCustomerService,
    private dataService: DataService,
    private loadingService: LoadingService
  ) {
    this.dataService.reloadIdentity.subscribe(() => {
      this.getLoanCustomerIdentityDetailsByLoanCustomer();
    });
  }

  ngOnInit(): void {
    this.getLoanCustomerIdentityDetailsByLoanCustomer();
  }

  getLoanCustomerIdentityDetailsByLoanCustomer() {
    this.loanCustomerService
      .getLoanCustomerIdentityDetailsByLoanCustomer(this.customerId)
      .subscribe((data) => {
        if (data.customerIdentity != null) {
          this.loanCustomerIdentityDetails = data.customerIdentity;
        }
      });
  }

  editIdentityDetails(x) {
    this.editIdentity.emit(x);
  }
  deleteIdentityDetails(row) {
    const ids = [];
    ids.push(row.customerIdentityDetailsId);
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
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomerIdentityDetails({ ids })
            .subscribe(
              (data) => {
                __this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.deleted) {
                  swal.fire('GOS FINANCIAL', message, 'success');
                  __this.getLoanCustomerIdentityDetailsByLoanCustomer();
                } else {
                  swal.fire('GOS FINANCIAL', message, 'error');
                }
              },
              (err) => {
                this.loadingService.hide();
                const message = err.status.message.friendlyMessage;
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  showAddNewIdentityDetails() {
    this.toggleModal.emit(true);
  }
}
