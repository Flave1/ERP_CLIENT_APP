import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { DataService } from '../../../../core/services/data.service';
import { ValidationService } from '../../../../core/services/validation.service';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.css'],
})
export class DirectorInfoComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @Input() customerId: string;
  @Input() customerDirectorId: any;
  @Input() percentageShare: any;
  @Input() directorForm: FormGroup;
  selectPoliticallyPosition: boolean;
  selectRelativePoliticallyPosition: boolean;
  @Input() isDirectorOnly: boolean;
  @Input() displayDirectors: boolean;
  @Output() directorChange: EventEmitter<any> = new EventEmitter();
  @Output() closeDirector: EventEmitter<any> = new EventEmitter();
  file: File;
  files: FileList;

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
    this.directorForm = this.fb.group({
      customerDirectorId: [0],
      directorTypeId: [0, Validators.required],
      directorType: [''],
      customerId: 0,
      position: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      politicallyPosition: [false, Validators.required],
      relativePoliticallyPosition: ['', Validators.required],
      dob: [''],
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
      signature: [''],
      percentageShare: [0],
    });
  }
  onDirectorTypeChange(value: any) {
    this.directorChange.emit(value);
  }

  // onFileChange(event: Event) {
  //   this.fileChange.emit(event);
  // }

  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
  }
  submitLoanCustomerDirectors(formObj) {
    // this.signature = this.file.name;
    const body = formObj.value;
    body.customerId = this.customerId;
    body.customerDirectorId = this.customerDirectorId;
    if (body.percentageShare == null) {
      body.percentageShare = this.percentageShare;
    }
    body.dob = this.formatDate(body.dob);
    if (!this.file) {
      return swal.fire('GOS FINANCIALS', 'Select a file', 'error');
    }
    if (
      this.file.type != 'image/png' &&
      this.file.type !== 'image/jpg' &&
      this.file.type != 'image/jpeg' &&
      this.file.type != 'image/gif'
    ) {
      return swal.fire(
        'GOS FINANCIAL',
        'Only images of type PNG, JPG, JPEG and GIF allowed',
        'error'
      );
    }
    this.loadingService.show();
    this.loanCustomerService
      .addLoanCustomerDirector(this.file, body)
      .then(
        (data) => {
          this.loadingService.hide();
          const message = data.status.message.friendlyMessage;
          if (data.status.isSuccessful) {
            swal.fire('GOS FINANCIAL', message, 'success');
            this.closeDirector.emit(false);
            this.fileInput.nativeElement.value = '';
            this.dataService.reloadDirectors.emit();
            // this.getLoanCustomerDirectorByLoanCustomer(this.customerId);
            this.directorForm.reset();
          } else {
            swal.fire('GOS FINANCIAL', message, 'error');
          }
        }
        // err => {
        //     this.loadingService.hide();
        //     swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
        // }
      )
      .catch((err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  closeDirectorModal(value: boolean) {
    this.closeDirector.emit(value);
    this.initialiseForm();
  }
  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
