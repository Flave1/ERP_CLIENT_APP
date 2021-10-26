import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';
import { LoadingService } from '../../../../core/services/loading.service';
import swal from 'sweetalert2';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-bank-info-list',
  templateUrl: './bank-info-list.component.html',
  styleUrls: ['./bank-info-list.component.css'],
})
export class BankInfoListComponent implements OnInit {
  @Output() toggleModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() editBankInfo: EventEmitter<any> = new EventEmitter<any>();
  @Input() customerId: string;
  loanCustomerBankDetails: any[] = [];

  constructor(
    private loanCustomerService: LoanCustomerService,
    private loadingService: LoadingService,
    private dataService: DataService
  ) {
    this.dataService.reloadBankDetails.subscribe(() => {
      this.getLoanCustomerBankDetailsByLoanCustomer();
    });
  }

  ngOnInit(): void {
    this.getLoanCustomerBankDetailsByLoanCustomer();
  }

  showAddNewBankDetails() {
    this.toggleModal.emit(true);
  }
  getLoanCustomerBankDetailsByLoanCustomer() {
    this.loadingService.show();
    this.loanCustomerService
      .getLoanCustomerBankDetailsByLoanCustomer(this.customerId)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          if (data.customerBankDetails != null) {
            this.loanCustomerBankDetails = data.customerBankDetails;
          }
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }

  editBankDetails(data) {
    this.editBankInfo.emit(data);
  }

  deleteBankDetails(row) {
    const ids = [];
    ids.push(row.customerBankDetailsId);
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
            .deleteLoanCustomerBankDetails({ ids })
            .subscribe(
              (data) => {
                __this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.deleted) {
                  swal.fire('GOS FINANCIAL', message, 'success');
                  __this.getLoanCustomerBankDetailsByLoanCustomer();
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
}
