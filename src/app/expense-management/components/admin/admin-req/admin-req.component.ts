import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ClassificationSetup,
  CostCentre,
  ExpenseDetails,
  Requisition,
} from '../../../../models/models';
import swal from 'sweetalert2';
import { CompanyService } from '../../../../core/services/company.service';
import { DataService } from '../../../../core/services/data.service';
import { StaffInfoService } from '../../../../core/services/staff.service';
import { formatDate } from '@angular/common';

interface Settlement {
  id: number;
  name: string;
}
@Component({
  selector: 'app-admin-req',
  templateUrl: './admin-req.component.html',
  styleUrls: ['./admin-req.component.css'],
})
export class AdminReqComponent implements OnInit {
  _fromApproval: boolean;
  get fromApproval(): boolean {
    return this._fromApproval;
  }
  @Input() set fromAproval(value) {
    this._fromApproval = value;
    console.log(this._fromApproval);
  }
  requisitionForm: FormGroup;
  expenseDetailsForm: FormGroup;
  formTitle: string = 'Expense Requisition Note';
  departments: any[] = [];
  viewHeight: string = '300px';
  expenseDetails: ExpenseDetails[] = [];
  showExpenseDetails: boolean;
  classifications: ClassificationSetup[] = [];
  costCentreList: CostCentre[] = [];
  index: number = null;
  settleMents: Settlement[] = [];
  settlementDetails: any;
  showTransferDialog: boolean;
  showOthers: boolean;
  showSettlementDetails: boolean;
  _requisitionId: number;
  settlementForm: FormGroup;
  staffs: any[] = [];
  get requisitionId(): number {
    return this._requisitionId;
  }
  @Input() set requisitionId(value: number) {
    this._requisitionId = value;
    this.getRequisition(value);

    // this.getRequisition(value);
    // console.log(value);
  }
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private expenseManagementService: ExpenseManagementService,
    private fb: FormBuilder,
    private companyService: CompanyService,
    private dataService: DataService,
    private staffService: StaffInfoService
  ) {
    this.dataService.getTotalSum.subscribe((value) => {
      this.requisitionForm.patchValue({
        totalAmount: value,
      });
    });
    this.dataService.emitErnApproval.subscribe((data) => {
      this.requisitionForm.patchValue({
        requisitionId: data.requistionDate,
        erNnumber: data.erNnumber,
        description: data.description,
        requestBy: data.requestBy,
        deparmentment: data.deparmentment,
        requestDate: new Date(data.requestDate),
        totalAmount: data.totalAmount,
        expectedDeliveryDate: data.expectedDeliveryDate,
        deliveryLocation: data.deliveryLocation,
        modeOfPayment: data.modeOfPayment,
        comment: data.comment,
        expenseDetails: data.requisitiondetails,
      });
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      const id = param.id;
      if (id !== undefined) {
        this.getRequisition(id);
      }
    });
    this.settleMents = [
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
    this.initialiseForm();
    this.initialiseExpenseDetails();
    this.initialiseSettlementForm();
    this.getClassifications();
    this.getCostCentreList();
    this.getCompanyStructures();
    this.generateErnNumber();
    // this.generateERN(8).then((val) => {
    //   this.requisitionForm.patchValue({
    //     ernNumber: val,
    //   });
    // });
  }
  generateErnNumber() {
    this.expenseManagementService.generateErnNumber().subscribe((data) => {
      this.requisitionForm.patchValue({
        erNnumber: data,
      });
    });
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

  getStaffs(id: number) {
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
  initialiseForm() {
    this.requisitionForm = this.fb.group({
      requisitionId: [0],
      erNnumber: [''],
      description: [''],
      requestBy: [''],
      deparmentment: [''],
      requestDate: [new Date()],
      totalAmount: [''],
      expectedDeleiveryDate: [''],
      modeOfPayment: [''],
      comment: [''],
      bankName: [''],
      location: [''],
      bankAccountNumber: [''],
      bankAccountName: [''],
      otherModeOfPayComment: [''],
      addEdit_requisitiondetails: [[]],
    });
  }
  initialiseSettlementForm() {
    this.settlementForm = this.fb.group({
      bankName: [''],
      bankAccountNumber: [''],
      bankAccountName: [''],
      otherModeOfPayComment: [''],
    });
  }
  initialiseExpenseDetails() {
    this.expenseDetailsForm = this.fb.group({
      requisitionDetailId: [0],
      description: [''],
      quantity: [''],
      unitPrice: [''],
      subTotal: [''],
      classificationsetupId: [''],
      costCenter: [''],
      isBudgeted: [false],
    });
  }
  getRequisition(id: number) {
    console.log('gotten : ' + id);
    return this.expenseManagementService
      .getRequisition(id)
      .subscribe((data) => {
        this.requisitionForm.patchValue({
          requisitionId: data.requisitionId,
          erNnumber: data.erNnumber,
          description: data.description,
          requestBy: data.requestBy,
          deparmentment: data.deparmentment,
          requestDate: new Date(data.requestDate),
          totalAmount: data.totalAmount,
          expectedDeleiveryDate: new Date(data.expectedDeleiveryDate),
          location: data.location,
          modeOfPayment: data.modeOfPayment,
          comment: data.comment,
          bankName: data.bankName,
          bankAccountNumber: data.bankAccountNumber,
          bankAccountName: data.bankAccountName,
          otherModeOfPayComment: data.otherModeOfPayComment,
          addEdit_requisitiondetails: data['requisitiondetails'],
        });
        this.getStaffs(data.deparmentment);
        this.expenseDetails = data['requisitiondetails'];
        const totalSum = this.calculateTotalSum(this.expenseDetails);
        this.requisitionForm.patchValue({
          totalAmount: totalSum,
        });
      });
  }

  submitDetails(requisitionForm: FormGroup) {
    const payload = requisitionForm.value;
    payload.addEdit_requisitiondetails = this.expenseDetails;
    payload.requestBy = +payload.requestBy; // to be deleted
    payload.modeOfPayment = +payload.modeOfPayment;
    payload.deparmentment = +payload.deparmentment;
    payload.expectedDeleiveryDate = this.formatDate(
      payload.expectedDeleiveryDate
    );
    if (this.settlementDetails !== undefined) {
      payload.bankName = this.settlementDetails.bankName;
      payload.bankAccountNumber = this.settlementDetails.bankAccountNumber;
      payload.bankAccountName = this.settlementDetails.bankAccountName;
      payload.otherModeOfPayComment = this.settlementDetails.otherModeOfPayComment;
    }
    this.loadingService.show();
    return this.expenseManagementService.addAdminRequisition(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res['status'].message.friendlyMessage;
        if (res['status'].isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, 'success').then(() => {
            this.initialiseForm();
            this.router.navigateByUrl(
              '/expense-management/admin-requisition-list'
            );
          });
        } else {
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      },
      (error) => {
        this.loadingService.hide();
        debugger;
        const message = error.error.status.message.friendlyMesage;
        swal.fire(`GOS FINANCIAL`, message, 'error');
      }
    );
  }

  goBack() {
    this.router.navigateByUrl('/expense-management/admin-requisition-list');
  }

  showAddNew() {
    this.showExpenseDetails = true;
  }
  deleteItem(el: any, i: number) {
    swal
      .fire({
        text: 'Do you  want to delete this Item?',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        icon: 'question',
      })
      .then((result) => {
        if (result.value) {
          if (el.requisitionDetailId !== 0) {
            const row = [];
            row.push(el.requisitionDetailId);
            const payload = {
              targetIds: row,
            };
            // this.deletePaymentTerms(payload)
          }
          this.expenseDetails.splice(i, 1);
          const totalSum = this.calculateTotalSum(this.expenseDetails);
          this.requisitionForm.patchValue({
            totalAmount: totalSum,
          });
        }
      })
      .catch((err) => {});
  }
  editItem(row, index) {
    this.expenseDetailsForm.patchValue({
      description: row.description,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      subTotal: row.subTotal,
      classificationsetupId: row.classificationsetupQuery.classificationsetupId,
      costCenter: row.costCenter.costCenterId,
      isBudgeted: row.isBudgeted,
    });
    this.index = index;
    this.showExpenseDetails = true;
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
  saveExpenseDetails(expenseDetailsForm: FormGroup) {
    const details = expenseDetailsForm.value;
    details.classificationsetupId = +details.classificationsetupId;
    details.costCenter = +details.costCenter;
    if (!details.description) {
      return swal.fire('GOS FINANCIAL', 'Description is required', 'error');
    }
    if (!details.quantity) {
      return swal.fire('GOS FINANCIAL', 'Quantity is required', 'error');
    }
    if (!details.unitPrice) {
      return swal.fire('GOS FINANCIAL', 'Unit Price is required', 'error');
    }
    if (!details.costCenter) {
      return swal.fire('GOS FINANCIAL', 'Select Cost Centre', 'error');
    }
    if (!details.classificationsetupId) {
      return swal.fire(
        'GOS FINANCIAL',
        'Select Expense Classification',
        'error'
      );
    }
    const costCentre = this.costCentreList.find(
      (item) => item.costCenterId === +details.costCenter
    );
    const classification = this.classifications.find(
      (item) => item.classificationsetupId === +details.classificationsetupId
    );
    details.classificationsetupQuery = {
      name: classification.name,
      classificationsetupId: details.classificationsetupId,
    };
    details.costCenter = {
      name: costCentre.name,
      costCenterId: details.costCenter,
    };
    // details.costCenterName = costCentre.name;
    // details.classificationsetupName = classification.name;
    details.classificationsetupId = +details.classificationsetupId;
    details.costCenterId = +details.costCenter.costCenterId;
    if (this.index !== null) {
      this.expenseDetails = this.expenseDetails.map((item, index) => {
        if (index == this.index) {
          return details;
        }
        return item;
      });
    } else {
      this.expenseDetails.push(details);
    }
    this.index = null;
    const totalSum = this.calculateTotalSum(this.expenseDetails);
    this.requisitionForm.patchValue({
      totalAmount: totalSum,
    });
    this.showExpenseDetails = false;
    this.initialiseExpenseDetails();
  }
  calculateTotalSum(expenseDetails) {
    return expenseDetails.reduce((total, item) => item.subTotal + total, 0);
  }
  closeModal() {
    this.initialiseExpenseDetails();
    this.showExpenseDetails = false;
  }

  getValue(value: any) {
    if (value === '2') {
      this.showSettlementDetails = true;
      this.showTransferDialog = true;
      this.showOthers = false;
    }
    if (value === '4') {
      this.showSettlementDetails = true;
      this.showOthers = true;
      this.showTransferDialog = false;
    }
  }

  savePaymentMode(settlementForm: FormGroup) {
    this.settlementDetails = settlementForm.value;
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
