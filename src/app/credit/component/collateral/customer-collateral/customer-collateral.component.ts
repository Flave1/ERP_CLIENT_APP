import {
  Input,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { CollateralService } from 'src/app/core/services/collateral.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import { LoanCollateralComponent } from '../loan-collateral/loan-collateral.component';
import { CommonService } from '../../../../core/services/common.service';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-customer-collateral',
  templateUrl: './customer-collateral.component.html'
})
export class CustomerCollateralComponent implements OnInit {
  collateralCustomers: any[] = [];
  selectedCollateralCustomer: any[];
  loanApplicationId: number;
  validationCheck: boolean;
  cols: any[];
  form: FormGroup;
  fileToUpload: File;
  formTitle: string = 'Add Customer Collateral';
  allowableCollateralTypes: any[] = [];
  @Input() customerId: any;
  @Output() onChangeOfCustomerCollateral = new EventEmitter();
  currencies: any[] = [];

  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private collateralService: CollateralService,
    private currencyService: CurrencyService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      collateralCustomerId: [0],
      customerId: [parseInt(this.customerId)],
      collateralTypeId: ['', Validators.required],
      currencyId: ['', Validators.required],
      collateralVerificationStatus: [false, Validators.required],
      collateralValue: ['', Validators.required],
      collateralCode: [''],
      location: ['', Validators.required],
      documentName: [{ disabled: true, value: '' }]
    });
  }

  ngOnInit() {
    this.cols = [
      { field: 'collateralCode', header: 'collateralCode' },
      { field: 'collateralTypeName', header: 'collateralTypeName' },
      { field: 'customerName', header: 'customerName' },
      { field: 'collateralValue', header: 'collateralValue' }
    ];

    this.getLoanApplicationId();
    this.loadDropDown();
    this.getAllCollateralForCustomer(this.customerId);

    if (
      (this.form.valid && this.fileToUpload != null) ||
      this.form.value.collateralCustomerId != 0
    ) {
      this.validationCheck = true;
    } else {
      this.validationCheck = false;
    }
  }

  clearForm() {
    this.form = this.fb.group({
      collateralCustomerId: [0],
      customerId: [parseInt(this.customerId)],
      collateralTypeId: ['', Validators.required],
      currencyId: ['', Validators.required],
      collateralVerificationStatus: [false, Validators.required],
      collateralValue: ['', Validators.required],
      location: ['', Validators.required],
      collateralCode: [''],
      documentName: [{ disabled: true, value: '' }]
    });

    this.fileToUpload = null;
    (<HTMLInputElement>document.getElementById('file1')).value = '';

    if (
      (this.form.valid && this.fileToUpload != null) ||
      this.form.value.collateralCustomerId != 0
    ) {
      this.validationCheck = true;
    } else {
      this.validationCheck = false;
    }
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    if (
      (this.form.valid && this.fileToUpload != null) ||
      this.form.value.collateralCustomerId != 0
    ) {
      this.validationCheck = true;
    }
  }

  getLoanApplicationId(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.loanApplicationId = params['loanapp'];
    });
  }
  getAllowableCollateralTypes(): void {
    this.collateralService
      .getAllowableCollateralTypesByLoanApplicationId(this.loanApplicationId)
      .subscribe(
        data => {
          this.allowableCollateralTypes = data.collateralTypes;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }
  getAllCollateralForCustomer(customerId) {
    this.collateralCustomers = [];
    this.loadingService.show();
    this.collateralService.getSingleCollateralCustomer(customerId).subscribe(
      data => {
        this.loadingService.hide();
        this.collateralCustomers = data.collateralCustomers;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  loadDropDown() {
    this.getAllowableCollateralTypes();

    this.commonService.getAllCurrency().subscribe(data => {
      this.currencies = data.commonLookups;
    });
  }

  editCollateralCustomer(value) {
    this.formTitle = 'Edit Customer Collateral';
    let row = value;
    this.form = this.fb.group({
      collateralCustomerId: [row.collateralCustomerId],
      customerId: [row.customerId, Validators.required],
      collateralTypeId: [row.collateralTypeId, Validators.required],
      currencyId: [row.currencyId, Validators.required],
      collateralVerificationStatus: [
        row.collateralVerificationStatus,
        Validators.required
      ],
      collateralValue: [row.collateralValue, Validators.required],
      collateralCode: [row.collateralCode, Validators.required],
      location: [row.location, Validators.required],
      documentName: [row.documentName]
    });

    if (
      (this.form.valid && this.fileToUpload != null) ||
      this.form.value.collateralCustomerId != 0
    ) {
      this.validationCheck = true;
    } else {
      this.validationCheck = false;
    }
  }

  submitCollateralCustomerWithDocument(formObj) {
    this.loadingService.show();
    const payload = formObj.value;
    payload.customerId = parseInt(this.customerId);
    payload.loanApplicationId = this.loanApplicationId;
    payload.loanApplicationId = parseInt(payload.loanApplicationId);
    payload.currencyId = parseInt(payload.currencyId);
    payload.collateralTypeId = parseInt(payload.collateralTypeId);
    payload.customerId = parseInt(payload.customerId);
    let thisForm = formObj;

    if (this.fileToUpload != null) {
      this.collateralService
        .addUpdateCollateralCustomerWithDocument(this.fileToUpload, payload)
        .then(data => {
          this.loadingService.hide();
          const message = data.status.message.friendlyMessage;
          if (data.status.isSuccessful) {
            this.getAllCollateralForCustomer(this.customerId);
            this.onChangeOfCustomerCollateral.emit(true);
            swal.fire('GOS FINANCIAL', 'Upload Successful', 'success');
          }
        })
        .catch(err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'success');
        });
    } else {
      this.submitCollateralCustomer(thisForm);
    }

    this.clearForm();
  }

  submitCollateralCustomer(formObj) {
    this.loadingService.show();
    formObj.value.customerId = parseInt(this.customerId);

    this.collateralService.addUpdateCollateralCustomer(formObj.value).subscribe(
      data => {
        this.loadingService.hide();
        if (data.status.isSuccessful == true) {
          this.getAllCollateralForCustomer(this.customerId);
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'success'
          );
          this.onChangeOfCustomerCollateral.emit(true);
          this.clearForm();
        } else {
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'error'
          );
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', JSON.stringify(err), 'error');
      }
    );
  }

  rowClicked(row: any): void {}

  deleteCollateralCustomer(row) {
    const __this = this;
    let body = {
      collateralCustomerIds: [row.collateralCustomerId]
    };
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
          __this.loadingService.show();

          __this.collateralService
            .deleteCollateralCustomer(body)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data.status.isSuccessful) {
                this.onChangeOfCustomerCollateral.emit(true);
                swal.fire(
                  'GOS FINANCIAL',
                  'User deleted successful.',
                  'success'
                );
                __this.getAllCollateralForCustomer(this.customerId);
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  downloadCollateral(id) {
    this.loadingService.show();
    return this.collateralService.downloadCollateralDocument(id).subscribe(data => {
      this.loadingService.hide()
      // console.log(data)
      let res = data.export;
      if (res != undefined) {
        var byteString = atob(res);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);
        try {
          var file = new File([bb], data.fileName, {
            type: data.fileExtension
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: data.fileExtension
          });
          window.navigator.msSaveBlob(textFileAsBlob, data.fileName);
        }
      }
    }, err => {
      this.loadingService.hide()
    })
  }
}
