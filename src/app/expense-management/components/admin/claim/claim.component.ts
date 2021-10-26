import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ClassificationSetup,
  CostCentre,
  ExpenseDetails,
} from '../../../../models/models';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { CompanyService } from '../../../../core/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { StaffInfoService } from '../../../../core/services/staff.service';
import { SubGLService } from 'src/app/core/services/subgl.service';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css'],
})
export class ClaimComponent implements OnInit {
  @Input() reload: boolean;
  _claimType: number;
  get claimType(): number {
    return this._claimType;
  }
  @Input() set claimType(value) {
    if (value) {
      this._claimType = value;
      if (this._claimType === 1) {
        this.getClaimFromRequisition(this._claimId);
      }
      if (this._claimType === 2) {
        this.getClaim(this._claimId);
      }
    }
  }
  _fromApproval: boolean;
  get fromApproval(): boolean {
    return this._fromApproval;
  }
  @Input() set fromAproval(value) {
    this._fromApproval = value;
  }
  _claimId: any;
  get claimId() {
    return this._claimId;
  }
  @Input() set claimId(data) {
    if (data) {
      this._claimId = data;
      if (this._claimType == 1) {
        this.getClaimFromRequisition(data);
      } else {
        this.getClaim(data);
      }
    }
  }
  @ViewChild('fileInput') fileInput: ElementRef;
  formTitle: string = 'Claim';
  claimsForm: FormGroup;
  departments: any[] = [];
  costCentreList: CostCentre[] = [];
  classifications: ClassificationSetup[] = [];
  showExpenseDetails: boolean;
  expenseDetailsForm: FormGroup;
  expenseDetails: ExpenseDetails[] = [];
  viewHeight: string = '400px';
  index: number = null;
  fileToUpload: File;
  staffs: any[] = [];
  otherBanksList: any[] = [];
  constructor(
    private fb: FormBuilder,
    private expenseManagementService: ExpenseManagementService,
    private loadingService: LoadingService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private staffService: StaffInfoService,
    private subGlService: SubGLService,
    private dataService: DataService
  ) {
    dataService.reloadClaimsData.subscribe((res) => {
      console.log(res);
      if (res === 1) {
        this.getClaimFromRequisition(this._claimId);
      }
      if (res === 2) {
        this.getClaim(this._claimId);
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      const id = +param.id;
      if (id) {
        this.getClaim(id);
      }
    });
    this.initialiseClaimsForm();
    this.initialiseExpenseDetailsForm();
    this.getCompanyStructures();
    this.getCostCentreList();
    this.getClassifications();
    this.generateClaimNumber();
    this.getOtherBanks();
  }
  generateClaimNumber() {
    this.expenseManagementService
      .generateNoReqClaimNumber()
      .subscribe((data) => {
        this.claimsForm.patchValue({
          claimNo: data,
        });
      });
  }
  getClaim(id: number) {
    this.loadingService.show();
    return this.expenseManagementService.getClaim(id).subscribe(
      (data) => {
        // this._claimType = null;
        this.loadingService.hide();
        this.claimsForm.patchValue({
          newClaimId: data.newClaimID,
          claimNo: data.claimNo,
          dept: data.dept,
          employee: data.employee,
          dateRequested: new Date(data.dateRequested),
          amountRequesting: data.amountRequesting,
          purposeOfExpense: data.purposeOfExpense,
          costCentre: data.costCentreId,
          classificationsetupId:
            data.classificationsetupQuery.classificationsetupId,
          accountToFundBankName: data.accountToFundBankName,
          accountToFundNumber: data.accountToFundNumber,
          accountToFundName: data.accountToFundName,
        });
        this.expenseDetails = data['detail'];
        this.getStaffByStructure(data.dept);
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getClaimFromRequisition(id: number) {
    this.loadingService.show();
    return this.expenseManagementService.getClaimById(id).subscribe(
      (data) => {
        // this._claimType = null;
        this.loadingService.hide();
        this.claimsForm.patchValue({
          newClaimId: data['claimsId'],
          claimNo: data.claimNo,
          dept: data['deptId'],
          employee: data['requisitionnote'].requestBy,
          dateRequested: new Date(data.dateRequested),
          amountRequesting: data['amountRequested'],
          purposeOfExpense: data['requisitionnote'].description,
          costCentre: data.costCentreId,
          classificationsetupId: data.classificationsetupId,
          accountToFundBankName: data.accountToFundBankName,
          accountToFundNumber: data.accountToFundNumber,
          accountToFundName: data.accountToFundName,
        });
        this.expenseDetails = data['detail'];
        this.getStaffByStructure(data['deptId']);
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getCompanyStructures() {
    this.loadingService.show();
    return this.companyService.getAllCompanyStructure().subscribe(
      (data) => {
        this.loadingService.hide();
        this.departments = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getClassifications() {
    return this.expenseManagementService
      .getClassifications()
      .subscribe((data) => {
        this.classifications = data;
      });
  }

  getCostCentreList() {
    return this.expenseManagementService
      .getCostCentreList()
      .subscribe((data) => {
        this.costCentreList = data;
      });
  }
  initialiseClaimsForm() {
    this.claimsForm = this.fb.group({
      newClaimId: [0],
      claimNo: [''],
      dept: [''],
      employee: [''],
      dateRequested: [''],
      amountRequesting: [''],
      purposeOfExpense: [''],
      costCentre: [''],
      classificationsetupId: [''],
      accountToFundBankName: [''],
      accountToFundNumber: [''],
      accountToFundName: [''],
    });
  }
  initialiseExpenseDetailsForm() {
    this.expenseDetailsForm = this.fb.group({
      description: [''],
      quantity: [''],
      unitCost: [''],
      subTotal: [''],
    });
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  submitDetails(claimsForm: FormGroup) {
    const payload = claimsForm.value;
    payload.details = this.expenseDetails;
    payload.classificationsetupId = +payload.classificationsetupId;
    payload.costCentre = +payload.costCentre;
    payload.dept = +payload.dept;
    payload.employee = +payload.employee;
    payload.dateRequested = this.formatDate(payload.dateRequested);
    // if (!this.fileToUpload) {
    //   return swal.fire('GOS FINANCIAL', 'Evidence is required', 'error');
    // }
    if (
      payload.accountToFundNumber.length < 10 ||
      payload.accountToFundNumber.length > 10
    ) {
      return swal.fire(
        'GOS FINANCIAL',
        'Account number can only be 10 digits',
        'error'
      );
    }
    this.loadingService.show();
    return this.expenseManagementService
      .addClaim(payload, this.fileToUpload)
      .subscribe(
        (res) => {
          this.loadingService.hide();
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            const claimId = res.process_Id;
            this.uploadEvidence(this.fileToUpload, claimId).then(() => {
              swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                this.fileInput.nativeElement.value = '';
                this.router.navigateByUrl('/expense-management/claims');
              });
            });
          } else {
            return swal.fire('GOS FINANCIAL', message, 'error');
          }
        },
        (error) => {
          this.loadingService.hide();
          // console.log(error.error);
          // const error = JSON.parse(err);
          const message = error.error.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      );
  }
  uploadEvidence(file: File, claimId: number) {
    this.loadingService.show();
    return this.expenseManagementService
      .uploadNoReqClaimEvidence(file, claimId)
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
  goBack() {
    this.router.navigate(['/expense-management/claims']);
  }

  closeModal() {
    this.showExpenseDetails = false;
    this.initialiseExpenseDetailsForm();
  }
  calculateSubTotal(price) {
    const qty = this.expenseDetailsForm.get('quantity').value;
    if (!qty) {
      return swal.fire('Error', 'Enter the quantity', 'error');
    }
    const subTotal = price * qty;
    this.expenseDetailsForm.patchValue({
      subTotal: subTotal,
    });
  }
  calculateAmount(qty) {
    const price = this.expenseDetailsForm.get('unitPrice').value;
    if (price) {
      const subTotal = price * qty;
      this.expenseDetailsForm.patchValue({
        subTotal: subTotal,
      });
    } else {
      return;
    }
  }
  calculateTotalSum(expenseDetails) {
    return expenseDetails.reduce((total, item) => item.subTotal + total, 0);
  }
  saveExpenseDetails(expenseDetailsForm: FormGroup) {
    const payload = expenseDetailsForm.value;
    if (!payload.description) {
      return swal.fire('GOS FINANCIAL', 'Description is required', 'error');
    }
    if (!payload.quantity) {
      return swal.fire('GOS FINANCIAL', 'Quantity is required', 'error');
    }
    if (!payload.unitCost) {
      return swal.fire('GOS FINANCIAL', 'Unit price is required', 'error');
    }
    if (this.index !== null) {
      this.expenseDetails = this.expenseDetails.map((item, index) => {
        if (index == this.index) {
          return payload;
        }
        return item;
      });
    } else {
      this.expenseDetails.push(payload);
    }
    this.index = null;
    const totalSum = this.calculateTotalSum(this.expenseDetails);
    this.claimsForm.patchValue({
      amountRequesting: totalSum,
    });
    this.showExpenseDetails = false;
    this.initialiseExpenseDetailsForm();
  }

  showAddNew() {
    this.showExpenseDetails = true;
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
  editItem(row, index) {
    this.expenseDetailsForm.patchValue({
      description: row.description,
      quantity: row.quantity,
      unitCost: row.unitCost,
      subTotal: row.subTotal,
    });
    this.index = index;
    this.showExpenseDetails = true;
  }

  getStaffByStructure(id: number) {
    this.loadingService.show();
    return this.staffService.getStaffByCompanyId(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.staffs = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getOtherBanks() {
    this.loadingService.show();
    return this.subGlService.getOtherBankGls().subscribe(
      (data) => {
        this.loadingService.hide();
        this.otherBanksList = data.otherBanks;
      },
      (err) => {
        this.loadingService.hide();
        console.log(err);
      }
    );
  }
}
