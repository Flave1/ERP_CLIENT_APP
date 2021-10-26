import { CommonService } from './../../../../core/services/common.service';
import { ProductService } from './../../../../core/services/product.service';
import { CollateralService } from './../../../../core/services/collateral.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LmsService } from './../../../../core/services/lms.service';
import swal from 'sweetalert2';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LoanService } from 'src/app/core/services/loan.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-lms-application',
  templateUrl: './lms-application.component.html',
})
export class LmsApplicationComponent implements OnInit, AfterViewInit {
  @ViewChild('myInput') fileInput: any;
  fileToUpload: File;
  disbursedLoanList: any[] = [];
  selectedLoan: any = {};
  customerTypes: any[];
  productTypes: any[] = [];
  loanSearchForm: FormGroup;
  form: FormGroup;
  activeIndex: number = 0;
  loanChequeListId: number = 0;
  status: any;
  customerId: number;
  loanApplicationId: number;
  productName: any;
  creditScore: any;
  probabilityOfDefault: any;
  loanNotSelected: boolean = true;
  loanCollaterals: any[] = [];
  productFees: any[] = [];
  loanCheques: any[] = [];
  loanReviewApplications: any[] = [];
  operationTypes: any[] = [];
  loanId: number;
  viewHeight: any = '600px';
  cols: any[] = [];
  onCharge: boolean = false;
  onPrepayment: boolean = false;
  input_values: any[] = [];
  displayChequeUpload: boolean = false;
  displayChequeUpdate: boolean = false;
  selectedDocument: string;
  binaryFile: string;
  loanManage: boolean;
  displayIdentityDetails: boolean;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private lmsService: LmsService,
    private collateralService: CollateralService,
    private productService: ProductService,
    private commonService: CommonService,
    private pipe: DatePipe,
    private router: Router,
    private loanService: LoanService
  ) {}

  ngAfterViewInit(): void {
    this.disbursedLoanList = [];
  }

  ngOnInit() {
    this.initializeSearchForm();
    this.initializeApplicationForm();
    this.getOperations();
  }
  initializeSearchForm() {
    this.loanSearchForm = this.fb.group({
      customerTypeId: ['', Validators.required],
      loanRefNumber: ['', Validators.required],
      searchString: [
        '',
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });
  }
  initializeApplicationForm() {
    this.form = this.fb.group({
      loanReviewApplicationId: [0],
      loanId: [this.selectedLoan.loanId],
      productId: [this.selectedLoan.productId],
      operationId: [''],
      customerId: [this.selectedLoan.customerId],
      reviewDetails: [''],
      proposedAmount: [this.selectedLoan.principalAmount],
      proposedRate: [this.selectedLoan.propposedInterestRate],
      proposedTenor: [this.selectedLoan.propposedTenor],
      // valueDate: this.pipe.transform(row.valueDate, "dd-MM-yyyy"),
      firstInterestPaymentDate: [
        this.pipe.transform(
          this.selectedLoan.firstInterestPaymentDate,
          'dd-MM-yyyy'
        ),
      ],
      firstPrincipalPaymentDate: [
        this.pipe.transform(
          this.selectedLoan.firstPrincipalPaymentDate,
          'dd-MM-yyyy'
        ),
      ],
      interestFrequency: [this.selectedLoan.interestFrequency],
      principalFrequency: [this.selectedLoan.principalFrequency],
      principalFrequencyName: [this.selectedLoan.principalFrequencyName],
      interestFrequencyName: [this.selectedLoan.interestFrequencyName],
      productFeeName: [this.selectedLoan.productFeeName],
      interest: [''],
      prepayment: 0,
    });
  }
  getOperations() {
    this.loadingService.show();
    this.commonService.getAllLoanManagementOperation().subscribe(
      (data) => {
        this.loadingService.hide();
        this.operationTypes = data.commonLookups;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
    // this.commonService.getAllProductType().subscribe(
    //   (data) => {
    //     this.loadingService.hide();
    //     this.productTypes = data.productType as string[];
    //   },
    //   (err) => {
    //     this.loadingService.hide();
    //   }
    // );
  }
  onOperationChange(value) {
    if (value == 17) {
      this.onCharge = true;
      this.onPrepayment = false;
      this.productFees.forEach((field) => {
        const control = this.fb.control(
          field.productFeeId,
          Validators.required
        );
        this.form.addControl(field.productFeeId, control);
      });
    } else if (value == 20) {
      this.onPrepayment = true;
      this.onCharge = false;
    } else {
      this.onCharge = false;
      this.onPrepayment = false;
    }
  }
  getAllLoanCollateral(loanApplicationId) {
    this.collateralService
      .getLoanCollateral(loanApplicationId)
      .subscribe((data) => {
        this.loanCollaterals = data.loanApplicationCollaterals;
      });
  }

  onRowSelect(event) {
    this.loanNotSelected = false;
    this.selectedLoan = event.data;
    this.loanId = event.data.loanId;
    this.customerId = event.data.customerId;
    this.loanApplicationId = event.data.loanApplicationId;
    this.productName = event.data.approvedProductName;
    this.creditScore = event.data.creditScore;
    this.probabilityOfDefault = event.data.probabilityOfDefault;
    this.activeIndex = 1;
    this.getAllLoanCollateral(this.loanApplicationId);
  }

  rowClicked(row: any): void {
    this.loanNotSelected = false;
    this.selectedLoan = row;
    this.loanId = row.loanId;
    this.customerId = row.customerId;
    this.loanApplicationId = row.loanApplicationId;
    this.productName = row.approvedProductName;
    this.creditScore = row.creditScore;
    this.probabilityOfDefault = row.probabilityOfDefault;
    this.activeIndex = 1;
    this.getAllLoanCollateral(this.loanApplicationId);
    this.getLoanCheque();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
    if (this.activeIndex == 2) {
      this.initializeApplicationForm();
    }
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoan = null;
    }
  }

  openNext() {
    this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoan = null;
    }
  }

  showAddNew(row) {
    this.activeIndex = 3;
    this.loanNotSelected = false;
    this.loanId = row.loanId;
    // this.router.navigate(["/loan-management/manage"], {
    //     queryParams: { loaninfo: row.loanId }
    // });
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 2 : this.activeIndex - 1;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoan = null;
    }
  }
  onChangeCustomerType(value) {}
  onChangeProductType(value) {}
  submitLoanSearchForm(formObj) {
    if (!formObj.value.customerTypeId) {
      return swal.fire('GOS FINANCIAL', 'Select Customer Type', 'error');
    }
    // if (!formObj.value.loanRefNumber) {
    //   return swal.fire('GOS FINANCIAL', 'Select Loan Reference Number', 'error');
    // }
    // if (!formObj.value.searchString) {
    //   return swal.fire('GOS FINANCIAL', 'Enter Search string', 'error');
    // }
    this.loadingService.show();
    let body = {
      customerTypeId: parseInt(formObj.value.customerTypeId),
      loanRefNumber: formObj.value.loanRefNumber,
      searchString: formObj.value.searchString,
    };
    this.lmsService.searchForLoan(body).subscribe(
      (data) => {
        this.loadingService.hide();
        this.disbursedLoanList = data.loanReviewList;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  submitLoanReviewApplication(formObj) {
    this.loadingService.show();
    let body = {
      loanReviewApplicationId: parseInt(formObj.value.loanReviewApplicationId),
      loanId: parseInt(this.selectedLoan.loanId),
      productId: this.selectedLoan.productId,
      operationId: parseInt(formObj.value.operationId),
      customerId: this.selectedLoan.customerId,
      reviewDetails: formObj.value.reviewDetails,
      prepayment: parseInt(formObj.value.prepayment),
      proposedAmount: this.selectedLoan.principalAmount,
      proposedRate: this.selectedLoan.propposedInterestRate,
      proposedTenor: this.selectedLoan.propposedTenor,
      // valueDate: this.pipe.transform(row.valueDate, "dd-MM-yyyy"),
      firstInterestPaymentDate: new Date(
        this.selectedLoan.firstInterestPaymentDate
      ),
      firstPrincipalPaymentDate: new Date(
        this.selectedLoan.firstPrincipalPaymentDate
      ),
      interestFrequency: this.selectedLoan.interestFrequency,
      principalFrequency: this.selectedLoan.principalFrequency,
      principalFrequencyName: this.selectedLoan.principalFrequencyName,
      interestFrequencyName: this.selectedLoan.interestFrequencyName,
    };
    this.lmsService.addUpdateLoanReviewApplication(body).subscribe((data) => {
      this.loadingService.hide();
      if (data.status.isSuccessful == true) {
        this.reset();
        swal.fire(
          'GOS FINANCIAL',
          data.status.message.friendlyMessage,
          'success'
        );
      } else {
        swal.fire(
          'GOS FINANCIAL',
          data.status.message.friendlyMessage,
          'error'
        );
      }
    });
  }
  goBack() {
    this.reset();
  }
  reset() {
    this.loanNotSelected = true;
    this.selectedLoan = {};
    this.customerId = null;
    this.loanApplicationId = null;
    this.productName = null;
    this.creditScore = null;
    this.probabilityOfDefault = null;
    this.activeIndex = 0;
  }

  logInput(value: any) {
    this.input_values = [];
    const values = {
      id: 1,
      value: value,
    };
    this.input_values.push(values);
  }

  getLoanCheque() {
    this.loanService
      .getLoanCheques(this.loanApplicationId)
      .subscribe((data) => {
        this.loanCheques = data.loanCheque;
      });
  }

  UploadLoanCheque() {
    var body = { loanChequeListId: this.loanChequeListId };
    this.loanService
      .uploadSingleLoanCheque(this.fileToUpload, body)
      .then((data) => {
        if (data.status.isSuccessful) {
          this.getLoanCheque();
          this.displayChequeUpload = false;
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'success'
          );
        } else {
          this.displayChequeUpload = false;
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'error'
          );
        }
      });
  }

  updateLoanCheque(item) {
    const body = {
      loanChequeListId: item.loanChequeListId,
      loanId: +item.loanId,
      status: +item.status,
    };
    this.loadingService.show();
    this.loanService.updateLoanStatus(body).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data.status.isSuccessful) {
          this.getLoanCheque();
          this.displayChequeUpdate = false;
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'success'
          );
        } else {
          this.displayChequeUpdate = false;
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'error'
          );
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  onUpdateClicked(row: any): void {
    this.displayChequeUpdate = true;
    this.loanChequeListId = row.loanChequeListId;
  }
  onUploadClicked(row: any): void {
    this.displayChequeUpload = true;
    this.loanChequeListId = row.loanChequeListId;
  }
  downLoadClicked(row: any): void {
    this.loanChequeListId = row.loanChequeListId;
    this.DownloadDocument();
  }

  DownloadDocument() {
    this.loadingService.show();
    var body = { loanChequeListId: this.loanChequeListId };
    this.loanService.downloadLoanDocument(body).subscribe((data) => {
      this.loadingService.hide();
      let fileDocument = data;
      if (fileDocument != undefined) {
        this.binaryFile = fileDocument.export;
        this.selectedDocument = fileDocument.fileName;
        let myDocExtention = fileDocument.fileExtension;
        var byteString = atob(this.binaryFile);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);

        if (myDocExtention == '.jpg' || myDocExtention == '.jpeg') {
          try {
            var file = new File([bb], this.selectedDocument + '.jpg', {
              type: 'image/jpg',
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'image/jpg',
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.jpg'
            );
          }
        }
        if (myDocExtention == '.png' || myDocExtention == '.png') {
          try {
            var file = new File([bb], this.selectedDocument + '.png', {
              type: 'image/png',
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'image/png',
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.png'
            );
          }
        }
        if (myDocExtention == '.pdf' || myDocExtention == '.pdf') {
          try {
            var file = new File([bb], this.selectedDocument + '.pdf', {
              type: 'application/pdf',
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'application/pdf',
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.pdf'
            );
          }
        }
        if (myDocExtention == '.xls' || myDocExtention == '.xlsx') {
          try {
            var file = new File([bb], this.selectedDocument + '.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.xlsx'
            );
          }
        }
        if (myDocExtention == '.doc' || myDocExtention == '.docx') {
          try {
            var file = new File([bb], this.selectedDocument + '.doc', {
              type: 'application/msword',
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'application/msword',
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.doc'
            );
          }
        }
      }
    });
  }

  uploadFile() {
    if (this.fileToUpload == null) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
      return;
    }
    if (
      this.fileToUpload.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return swal.fire('GOS FINANCIAL', 'Only excel files allowed', 'error');
    }
    this.loadingService.show();
    this.loanService
      .uploadLoan(this.fileToUpload)
      .then((data) => {
        let message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          // this.loanService.generateScheduleUploadedLoan().subscribe(d =>
          //   {
          //     console.log("backend response:",d.status.message.friendlyMessage);
          //   })
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        let message = err.status.message.friendlyMessage;
        this.fileInput.nativeElement.value = '';
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  downloadLoan() {
    this.loadingService.show();
    return this.loanService.downloadLoan().subscribe(
      (response) => {
        this.loadingService.hide();
        let data = response.export;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], 'Historical Loans.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              'Historical Loans.xlsx'
            );
          }
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        return swal.fire('Error', message, 'error');
      }
    );
  }
  saveAmount(item) {
    const payload = {
      loanChequeListId: item.loanChequeListId,
      amount: +item.amount,
    };
    if (!payload.amount || payload.amount === 0) {
      return swal.fire('GOS FINANCIAL', 'Amount is required', 'error');
    }
    this.loadingService.show();
    return this.loanService.saveChequeAmount(payload).subscribe(
      (response) => {
        this.loadingService.hide();
        const message = response.status.message.friendlyMessage;
        if (response.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.getLoanCheque();
          });
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
