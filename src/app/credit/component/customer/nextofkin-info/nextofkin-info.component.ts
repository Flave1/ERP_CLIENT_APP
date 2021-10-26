import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { DataService } from '../../../../core/services/data.service';
import { ValidationService } from '../../../../core/services/validation.service';

@Component({
  selector: 'app-nextofkin-info',
  templateUrl: './nextofkin-info.component.html',
  styleUrls: ['./nextofkin-info.component.css'],
})
export class NextofkinInfoComponent implements OnInit {
  @Input() customerId: string;
  @Input() nextOfKinForm: FormGroup;
  @Input() displayNextOfKins: boolean;
  @Output() toggleModal: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private loanCustomerService: LoanCustomerService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.toggleModal.subscribe((value) => {
      this.displayNextOfKins = value;
    });
  }

  ngOnInit(): void {
    this.initialiseForm();
  }

  initialiseForm() {
    this.nextOfKinForm = this.fb.group({
      customerNextOfKinId: [0],
      customerId: 0,
      name: ['', Validators.required],
      address: ['', Validators.required],
      relationship: ['', Validators.required],
      phoneNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^0|[0-9]\d*$/),
          Validators.minLength(9),
        ],
      ],
      email: [
        '',
        Validators.compose([Validators.required, ValidationService.isEmail]),
      ],
    });
  }
  submitLoanCustomerNextOfKins(formObj) {
    this.loadingService.show();
    const body = formObj.value;
    body.customerId = parseInt(this.customerId);
    if (body.customerNextOfKinId == null) {
      body.customerNextOfKinId = 0;
    }
    this.loanCustomerService.addLoanCustomerNextOfKin(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.toggleModal.emit(false);
          // this.displayNextOfKins = false;
          formObj.reset();
          this.dataService.reloadNextOKin.emit();
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

  closeNextOfKinModal(value: boolean) {
    this.toggleModal.emit(value);
    this.initialiseForm();
  }
}
