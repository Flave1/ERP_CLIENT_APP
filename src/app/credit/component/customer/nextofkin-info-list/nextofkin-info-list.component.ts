import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';
import { LoadingService } from '../../../../core/services/loading.service';
import swal from 'sweetalert2';
import { DataService } from '../../../../core/services/data.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-nextofkin-info-list',
  templateUrl: './nextofkin-info-list.component.html',
  styleUrls: ['./nextofkin-info-list.component.css'],
})
export class NextofkinInfoListComponent implements OnInit {
  @Output() toggleModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() editNextOfKin: EventEmitter<any> = new EventEmitter<any>();
  @Input() customerId: any;
  loanCustomerNextOfKins: any[] = [];
  constructor(
    private loanCustomerService: LoanCustomerService,
    private loadingService: LoadingService,
    private dataService: DataService
  ) {
    this.dataService.reloadNextOKin.subscribe(() => {
      this.getLoanCustomerNextOfKinByLoanCustomer();
    });
  }

  ngOnInit(): void {
    this.getLoanCustomerNextOfKinByLoanCustomer();
  }

  getLoanCustomerNextOfKinByLoanCustomer() {
    this.loanCustomerService
      .getLoanCustomerNextOfKinByLoanCustomer(this.customerId)
      .subscribe((data) => {
        if (data.customerNextOfKin != null) {
          this.loanCustomerNextOfKins = data.customerNextOfKin;
        }
      });
  }
  showAddNewNextOfKins() {
    this.toggleModal.emit(true);
  }

  editNextOfKins(data) {
    this.editNextOfKin.emit(data);
  }
  deleteNextOfKins(row) {
    const ids = [];
    ids.push(row.customerNextOfKinId);
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
            .deleteLoanCustomerNextOfKin({ ids })
            .subscribe(
              (data) => {
                __this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.deleted) {
                  swal.fire('GOS FINANCIAL', message, 'success');
                  __this.getLoanCustomerNextOfKinByLoanCustomer();
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
