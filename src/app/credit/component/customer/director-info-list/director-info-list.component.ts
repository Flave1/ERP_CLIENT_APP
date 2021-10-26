import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';
import swal from 'sweetalert2';
import { LoadingService } from '../../../../core/services/loading.service';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-director-info-list',
  templateUrl: './director-info-list.component.html',
  styleUrls: ['./director-info-list.component.css'],
})
export class DirectorInfoListComponent implements OnInit {
  loanCustomerDirectors: any[] = [];
  @Input() customerId: any;
  @Output() editDirector: EventEmitter<any> = new EventEmitter<any>();
  @Output() toggleModal: EventEmitter<any> = new EventEmitter<any>();
  binaryFile: string;
  displayOutput: boolean;
  constructor(
    private loanCustomerService: LoanCustomerService,
    private loadingService: LoadingService,
    private dataService: DataService
  ) {
    this.dataService.reloadDirectors.subscribe(() => {
      this.getLoanCustomerDirectorByLoanCustomer();
    });
  }

  ngOnInit(): void {
    this.getLoanCustomerDirectorByLoanCustomer();
  }

  getLoanCustomerDirectorByLoanCustomer() {
    this.loanCustomerService
      .getLoanCustomerDirectorByLoanCustomer(this.customerId)
      .subscribe(
        (data) => {
          if (data.customerDirectors != null) {
            this.loanCustomerDirectors = data.customerDirectors;
          }
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }
  deleteDirectors(row) {
    const ids = [];
    ids.push(row.customerDirectorId);
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
            .deleteLoanCustomerDirector({ ids })
            .subscribe(
              (data) => {
                __this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.deleted) {
                  swal.fire('GOS FINANCIAL', message, 'success');
                  __this.getLoanCustomerDirectorByLoanCustomer();
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

  editDirectors(data) {
    this.editDirector.emit(data);
  }

  viewSignature(customerDocumentId: any, file: string) {
    this.binaryFile = file;
    // this.selectedDocument = doc.documentTitle;
    this.displayOutput = true;
    // this.loadingService.show();
    // this.loanCustomerService
    //   .viewSignature(customerDocumentId, this.customerId)
    //   .subscribe(
    //     data => {
    //       this.loadingService.hide();
    //       let doc = data["result"];
    //       if (doc != undefined) {
    //         this.binaryFile = doc.signature;
    //         this.selectedDocument = doc.documentTitle;
    //         this.displayOutput = true;
    //       }
    //     },
    //     err => {
    //       this.loadingService.hide();
    //     }
    //   );
  }

  showAddNewDirectors() {
    this.toggleModal.emit(true);
  }
}
