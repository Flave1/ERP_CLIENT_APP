import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassificationSetup } from '../../../../models/models';
import { DataService } from '../../../../core/services/data.service';
import { CompanyService } from '../../../../core/services/company.service';
import swal from 'sweetalert2';
import { StaffInfoService } from '../../../../core/services/staff.service';

interface Settlement {
  id: number;
  name: string;
}
@Component({
  selector: 'app-retirement',
  templateUrl: './retirement.component.html',
  styleUrls: ['./retirement.component.css'],
})
export class RetirementComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  formTitle: string = 'Retirement';
  retirementForm: FormGroup;
  settleMents: any;
  departments: any;
  amountApproved: number;
  amountUsed: number;
  claims: any[] = [];
  refunds: any[] = [];
  showClaims: boolean;
  showRefunds: boolean;
  claimsForm: FormGroup;
  classifications: ClassificationSetup[] = [];
  viewHeight: string = '600px';
  fileToUpload: File;
  claimsData: any;
  balance: number;
  refundForm: FormGroup;
  refundMode: Settlement[] = [];
  retirementData: any;
  staffs: any[] = [];
  sourceURL: any;
  constructor(
    private fb: FormBuilder,
    private expenseManagementService: ExpenseManagementService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private companyService: CompanyService,
    private router: Router,
    private staffService: StaffInfoService
  ) {}

  ngOnInit(): void {
    this.refundMode = [
      {
        id: 1,
        name: 'Cash',
      },
      {
        id: 2,
        name: 'Transfer',
      },
      {
        id: 3,
        name: 'Cheque',
      },
      {
        id: 4,
        name: 'Others',
      },
    ];
    this.route.queryParams.subscribe((param) => {
      const id = +param.id;
      this.sourceURL = +param.sourceUrl;
      if (id !== undefined) {
        this.getRetirement(id);
      }
    });
    this.initializeForm();
    this.initialiseClaimsForm();
    this.initialiseRefundForm();
    this.getClassifications();
    this.getStaffs();
    this.generateClaimNumber();
  }
  getStaffs() {
    return this.staffService.getAllStaff().subscribe((data) => {
      this.staffs = data.staff;
    });
  }
  initializeForm() {
    this.retirementForm = this.fb.group({
      retirementId: [''],
      ernnumber: [''],
      totalAmountApproved: [''],
      requisitionDate: [''],
      retirementDate: [new Date()],
      description: [''],
      amountUsed: [''],
      balance: [''],
    });
  }

  initialiseClaimsForm() {
    this.claimsForm = this.fb.group({
      claimsNo: [''],
      requestedBy: [''],
      amountRequested: [''],
      dateRequested: [''],
      classificationsetupId: [''],
      accountToFundNumber: [''],
      accountToFundBankName: [''],
      accountToFundName: [''],
    });
  }
  initialiseRefundForm() {
    this.refundForm = this.fb.group({
      amountToFund: [''],
      modeOfRefund: [''],
    });
  }
  generateClaimNumber() {
    this.expenseManagementService.generateErnNumber().subscribe((data) => {
      this.claimsForm.patchValue({
        claimsNo: data,
      });
    });
  }
  getRetirement(id: number) {
    this.loadingService.show();
    return this.expenseManagementService.getRetirement(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.retirementForm.patchValue({
          retirementId: data.retirementId,
          ernnumber: data.erNumber,
          totalAmountApproved: data.totalAmountApproved,
          requisitionDate: new Date(data.requisitionDate),
          retirementDate: new Date(),
          description: data.description,
          amountUsed: data.amountUsed,
          balance: data.balance,
          account: data.account,
        });
        this.retirementData = data;
        this.amountApproved = data.totalAmountApproved;
        this.calculateBalance(data.amountUsed);
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getValue(value: any) {}
  uploadEvidence(file: File, claimId: number) {
    this.loadingService.show();
    return this.expenseManagementService
      .uploadReqClaimEvidence(file, claimId)
      .then((res) => {
        this.loadingService.hide();
        if (res.status.isSuccessful) {
          this.fileInput.nativeElement.value = '';
        }
      })
      .catch((err) => {
        this.loadingService.hide();
      });
  }
  submitDetails(retirementForm: FormGroup) {
    const payload = retirementForm.value;
    this.retirementData = payload;
    payload.amountUsed = +payload.amountUsed;
    payload.balance = +payload.balance;
    for (const key in this.claimsData) {
      payload[key] = this.claimsData[key];
    }
    // if (!this.fileToUpload) {
    //   return swal.fire('GOS FINANCIAL', 'Select a pdf file to upload', 'error');
    // }
    this.loadingService.show();
    return this.expenseManagementService.saveClaims(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          const claimId = res.process_Id;
          this.uploadEvidence(this.fileToUpload, claimId).then(() => {
            swal.fire('GOS FINANCIAL', message, 'success').then(() => {
              this.router.navigateByUrl('/expense-management/retirements');
            });
          });
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        // console.log(err);
        // const error = JSON.parse(err);
        const message = err.error.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
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

  goBack() {
    this.router.navigateByUrl('/expense-management/retirements');
  }

  calculateBalance(value: any) {
    // const amountApproved = this.retirementForm.get('totalAmountApproved').value;
    this.amountUsed = +value;
    this.balance = +this.amountApproved - +value;
    this.retirementForm.patchValue({
      balance: Math.abs(this.balance),
    });
  }

  claim() {
    this.showClaims = true;
    this.claimsForm.patchValue({
      amountRequested: Math.abs(this.balance),
    });
  }

  refund() {
    this.showRefunds = true;
    this.refundForm.patchValue({
      amountToFund: Math.abs(this.balance),
    });
  }

  closeModal() {
    this.showClaims = false;
  }

  saveClaims(claimsForm: FormGroup) {
    this.claimsData = claimsForm.value;
    this.claimsData.amountRequested = +this.claimsData.amountRequested;
    this.claimsData.classificationsetupId = +this.claimsData
      .classificationsetupId;
    if (this.claimsData.amountRequested > Math.abs(this.balance)) {
      return swal.fire(
        'GOS FINANCIAL',
        'The requested amount is greater than the balance',
        'error'
      );
    }
    this.claims.push(this.claimsData);
    this.showClaims = false;
    this.initialiseClaimsForm();
  }

  showAddNew() {}

  editItem(x, i) {}

  getClassifications() {
    this.loadingService.show();
    return this.expenseManagementService.getClassifications().subscribe(
      (data) => {
        this.loadingService.hide();
        this.classifications = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  saveRefund(refundForm: FormGroup) {
    const payload = refundForm.value;
    payload.modeOfRefund = +payload.modeOfRefund;
    payload.amountToFund = +payload.amountToFund;
    console.log(this.retirementData);
    for (const key in this.retirementData) {
      payload[key] = this.retirementData[key];
    }
    payload.classificationsetupId = 1;
    payload.balance = Math.abs(this.balance);
    payload.companyBank = 0;
    payload.ernnumber = payload.erNumber;
    this.loadingService.show();
    return this.expenseManagementService.updateRefund(payload).subscribe(
      (response) => {
        this.loadingService.hide();
        const message = response.status.message.friendlyMessage;
        if (response.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.router.navigateByUrl('/expense-management/retirements');
          });
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        // const error = JSON.parse(err);
        console.log(err);
        const message = err.error.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  closeRefundModal() {
    this.showRefunds = false;
  }
}
