import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ProductService } from 'src/app/core/services/product.service';
import { CreditAppraisalService } from 'src/app/core/services/credit-appraisal.service';
import swal from 'sweetalert2';
import { CollateralService } from 'src/app/core/services/collateral.service';
import { CustomerAccountService } from 'src/app/core/services/customeraccount.service';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanApplicationService } from 'src/app/core/services/loanapplication.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-loan-booking',
  templateUrl: './loan-booking.component.html',
})
export class LoanBookingComponent implements OnInit {
  // @ViewChild('fileInput') fileToUpload: any;
  loanApplicationList: any[] = [];
  form: FormGroup;
  selectedLoanApplication: any = {};
  customerId: number;
  loanApplicationId: number;
  activeIndex: number = 0;
  boardMember: boolean = false;
  products: any[] = [];
  productFees: any[] = [];
  productName: string;
  displayApprovalComment: boolean = false;
  privilege: any = {};
  loanApp: any = {};
  creditScore: string;
  probabilityOfDefault: string;
  trails: any[] = [];
  operationId: number = 9;
  loanNotSelected: boolean = true;
  canBook: boolean = false;
  loanAmount: number;
  integralFeeAmount: number;
  scheduldeDetails: any = {};
  loanCollaterals: any[];
  customerAccounts: any[];
  productId: any;
  dibursementAccount: any;
  loanCustomer: any[];
  loanCheques: any[];
  viewHeight: any = '600px';
  fileToUpload: File;
  @ViewChild('fileInput') fileInput: any;
  cols: any[];
  fsValue: any[] = [];
  amount: number;
  constructor(
    private loanApplicationService: LoanApplicationService,
    private loanService: LoanService,
    private loadingService: LoadingService,
    private productService: ProductService,
    private creditAppraisalService: CreditAppraisalService,
    private loanCustomerService: LoanCustomerService,
    private collateralService: CollateralService,
    private customerAccountService: CustomerAccountService,
    public fb: FormBuilder,
    private dataService: DataService
  ) {
    this.dataService.showSection.subscribe((res) => {
      this.fsValue = res.fsValue;
    });
    this.form = this.fb.group({
      loanChequeId: [0],
      loanApplicationId: [0],
      generalUpload: [''],
      start: [''],
      end: [''],
    });
  }

  ngOnInit() {
    this.cols = [
      {
        field: 'applicationDate',
        header: 'applicationDate',
      },
      {
        field: 'applicationRefNumber',
        header: 'applicationRefNumber',
      },
      {
        field: 'customerName',
        header: 'customerName',
      },
      {
        field: 'approvedProductName',
        header: 'approvedProductName',
      },
      {
        field: 'approvedAmount',
        header: 'approvedAmount',
      },
    ];
    this.loanNotSelected = true;
    this.getAllLoanApplication();
  }
  getAllLoanApplication() {
    this.loadingService.show();
    this.loanService.getAllLoanApplication().subscribe(
      (data) => {
        this.loadingService.hide();
        this.loanApplicationList = data.loanApplications;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getAllLoanCollateral(loanApplicationId) {
    this.collateralService
      .getLoanCollateral(loanApplicationId)
      .subscribe((data) => {
        this.loanCollaterals = data.loanApplicationCollaterals;
      });
  }

  getCustomerAccounts(customerId) {
    this.customerAccountService
      .getCustomerAccounts(customerId)
      .subscribe((data) => {
        this.customerAccounts = data['result'];
      });
  }

  getLoanCustomerDetails(customerId) {
    this.loanCustomerService.loanCustomerCASA(customerId).subscribe((data) => {
      this.loanCustomer = data.customers;
    });
  }

  getLoanApplicationById(loanpplicationId) {
    this.loadingService.show();
    this.loanApplicationService.getLoanApplication(loanpplicationId).subscribe(
      (data) => {
        this.loadingService.hide();
        this.loanApp = data.loanApplications[0];
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  onTabChange(e) {
    this.activeIndex = e.index;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoanApplication = null;
      this.canBook = false;
    }
  }

  openNext() {
    this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 2 : this.activeIndex - 1;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoanApplication = null;
      this.canBook = false;
    }
  }
  onRowSelect(event) {
    this.selectedLoanApplication = event.data;
    this.customerId = event.data.customerId;
    this.loanApplicationId = event.data.loanApplicationId;
    this.loanAmount = Number(event.data.approvedAmount);
    this.productName = event.data.approvedProductName;
    this.productId = event.data.approvedProductId;
    this.creditScore = event.data.creditScore;
    this.probabilityOfDefault = event.data.probabilityOfDefault;
    (this.integralFeeAmount = event.data.integralFee), (this.activeIndex = 1);
    this.loanNotSelected = false;
    this.getAllLoanCollateral(this.loanApplicationId);
    this.loanService.sendLoanApplication(this.loanApplicationId);

    // this.getAutoPopulateSchedule(this.loanApplicationId);
    this.getApprovalTrail(this.loanApplicationId, this.operationId);
    this.getProductFee(event.data.approvedProductId);
    // this.getCustomerAccounts(this.customerId);
    this.getCustomerAccounts(event.data.customerId);
    this.getLoanCustomerDetails(event.data.customerId);
    this.getLoanCheque();
    this.getLoanApplicationById(this.loanApplicationId);
  }
  getApprovalTrail(loanApplicationId, operationId) {
    this.creditAppraisalService
      .getApprovalTrail(loanApplicationId, operationId)
      .subscribe((data) => {
        this.trails = data['result'];
      });
  }
  getProductFee(productId) {
    this.productService.getProductFeeByProduct(productId).subscribe((data) => {
      this.productFees = data['result'];
    });
  }

  getSchedule(event: any) {
    if (event) {
      this.scheduldeDetails = event;
      swal.fire('GOS FINANCIAL', 'Schedule generated successfully', 'success');
      this.canBook = true;
    } else {
      this.canBook = false;
      swal.fire(
        'GOS FINANCIAL',
        'Opps! The schedule generation failed.',
        'error'
      );
    }
  }
  submitApproval() {
    let loanInfo = {
      customerId: this.selectedLoanApplication.customerId,
      productId: this.selectedLoanApplication.approvedProductId,
      loanApplicationId: this.selectedLoanApplication.loanApplicationId,
      currencyId: this.selectedLoanApplication.currencyId,
      exchangeRate: this.selectedLoanApplication.exchangeRate,
      companyId: 1, //this.selectedLoanApplication.companyId,
      principalAmount: this.selectedLoanApplication.approvedAmount,
      principalFrequencyTypeId: this.scheduldeDetails.principalFrequency,
      interestFrequencyTypeId: this.scheduldeDetails.interestFrequency,
      scheduleTypeId: this.scheduldeDetails.scheduleMethodId,
      effectiveDate: this.scheduldeDetails.effectiveDate,
      maturityDate: this.scheduldeDetails.maturityDate,
      loanStatusId: this.scheduldeDetails.loanApplicationStatusId,
      firstPrincipalPaymentDate: this.scheduldeDetails
        .principalFirstpaymentDate,
      firstInterestPaymentDate: this.scheduldeDetails.interestFirstpaymentDate,
      accrualBasis: this.scheduldeDetails.accurialBasis,
      firstDayType: this.scheduldeDetails.firstDayType,
      interestRate: this.scheduldeDetails.interestRate,
      casaAccountNumber: this.dibursementAccount,
      feeAmount: this.scheduldeDetails.integralFeeAmount,
      //  equityContribution,
      //  outstandingPrincipal: this.scheduldeDetails.,
      // outstandingInterest: this.scheduldeDetails.,
      // NPLDate,
      // customerRiskRatingId,
      // loanOperationId
      // staffId
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to book this loan?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();
          __this.loanService.addLoanBooking(loanInfo).subscribe((data) => {
            __this.loadingService.hide();
            if (data.status.isSuccessful == true) {
              swal.fire(
                'GOS FINANCIAL',
                data.status.message.friendlyMessage,
                'success'
              );
              __this.canBook = false;
              __this.getAllLoanApplication();
              this.loanNotSelected = true;
              this.selectedLoanApplication = null;
              this.activeIndex = 0;
            } else {
              swal.fire(
                'GOS FINANCIAL',
                data.status.message.friendlyMessage,
                'error'
              );
            }
          });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  onSelectClicked(row) {
    this.selectedLoanApplication = row;
    this.customerId = row.customerId;
    this.loanApplicationId = row.loanApplicationId;
    this.loanAmount = Number(row.approvedAmount);
    this.productName = row.approvedProductName;
    this.productId = row.approvedProductId;
    this.creditScore = row.creditScore;
    this.probabilityOfDefault = row.probabilityOfDefault;
    (this.integralFeeAmount = row.integralFee), (this.activeIndex = 1);
    this.loanNotSelected = false;
    this.getAllLoanCollateral(this.loanApplicationId);
    this.getApprovalTrail(this.loanApplicationId, this.operationId);
    this.getProductFee(row.approvedProductId);
    this.getCustomerAccounts(this.customerId);
  }

  submitCheque(formObj) {
    if (this.fileToUpload === null) {
      return swal.fire('GOS FINANCIAL', 'Select an upload file', 'error');
    }
    formObj.value.loanApplicationId = this.loanApplicationId;
    this.loadingService.show();
    this.loanService.addLoanCheque(this.fileToUpload, formObj.value).then(
      (data) => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getLoanCheque();
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        let message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  getLoanCheque() {
    this.loanService
      .getLoanCheques(this.loanApplicationId)
      .subscribe((data) => {
        this.loanCheques = data.loanCheque;
        if (this.loanCheques != null) {
          this.editCheque(this.loanApplicationId);
        }
      });
  }

  editCheque(loanId) {
    this.loadingService.show();
    this.loanService.getLoanCheques(loanId).subscribe(
      (data) => {
        this.loadingService.hide();
        let end = data.end;
        let start = data.start;
        this.form.get('end').setValue(end);
        this.form.get('start').setValue(start);
      },
      (err) => {
        this.loadingService.hide();
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

  uploadItems() {
    if (!this.fileToUpload) {
      return swal.fire('GOS FINANCIAL', 'Select file to upload', 'error');
    }
    this.loadingService.show();
    return this.loanService
      .uploadLoanAmount(this.fileToUpload, this.loanApplicationId)
      .then((data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.getLoanCheque();
          });
        } else {
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, 'error');
      });
  }
}
