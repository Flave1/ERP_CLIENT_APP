import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-identity-info',
  templateUrl: './identity-info.component.html',
  styleUrls: ['./identity-info.component.css'],
})
export class IdentityInfoComponent implements OnInit {
  @Input() identityDetailsForm: FormGroup;
  @Input() identificationInformation: any[] = [];
  @Input() displayIdentityDetails: boolean;
  @Output() submitIdentityDetails: EventEmitter<any> = new EventEmitter();
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Input() customerId: string;
  constructor(
    private loanCustomerService: LoanCustomerService,
    private loadingService: LoadingService,
    private dataService: DataService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initialiseForm();
  }
  initialiseForm() {
    this.identityDetailsForm = this.fb.group({
      customerIdentityDetailsId: [0],
      customerId: [0],
      number: ['', Validators.required],
      identificationId: ['', Validators.required],
      issuer: ['', Validators.required],
    });
  }
  // submitLoanCustomerIdentityDetails(identityDetailsForm: FormGroup) {
  //   this.submitIdentityDetails.emit(identityDetailsForm);
  // }

  closeIdentityModal(value: boolean) {
    this.closeModal.emit(value);
    this.initialiseForm();
  }
  submitLoanCustomerIdentityDetails(formObj) {
    const body = formObj.value;
    body.customerId = parseInt(this.customerId);
    body.identificationId = parseInt(body.identificationId);
    if (body.customerIdentityDetailsId == null) {
      body.customerIdentityDetailsId = 0;
    }

    // return;
    this.loadingService.show();
    this.loanCustomerService.addLoanCustomerIdentityDetails(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          // this.getLoanCustomerIdentityDetailsByLoanCustomer(this.customerId);
          this.dataService.reloadIdentity.emit();
          this.closeModal.emit(false);
          this.identityDetailsForm.reset();
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
  }
}
