import { CollateralService } from 'src/app/core/services/collateral.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router } from '@angular/router';
import { CreditAppraisalService } from 'src/app/core/services/credit-appraisal.service';
import { ProductService } from 'src/app/core/services/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { CustomerFsService } from 'src/app/core/services/customer-fs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-credit-appraisal',
  templateUrl: './credit-appraisal.component.html',
})
export class CreditAppraisalComponent implements OnInit, OnDestroy {
  boardMember: boolean = false;
  products: any[] = [];
  recommendationCommentForm: FormGroup;
  fsRatioValueData: any[] = [];
  fsCaptionRatios: any[] = [];
  fsRatioValueTableCols: any[] = [];
  fsRatiosTableCols: any[];
  rowGroupMetadata: {};
  activeIndex: number = 0;
  activeIndexRatio: number = 0;
  loanApplicationList: any[] = [];
  selectedLoanApplication: any = {};
  customerId: number;
  loanApplicationId: number;
  productName: string;
  productId: number;
  displayApprovalComment: boolean = false;
  privilege: any = {};
  trails: any[] = [];
  actualdate: any;
  operationId: number = 9;
  loanNotSelected: boolean = true;
  approveActionLabel: string = 'Approve';
  authorizeActionLabel: string = 'Authorize';
  viewHeight: any = '600px';
  cols: any[];
  workFlowToken: string;
  showDialog: boolean;
  staffId: any;
  staffs: any[] = [];
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private productService: ProductService,
    private collateralService: CollateralService,
    private creditAppraisalService: CreditAppraisalService,
    private customerFsService: CustomerFsService,
    private router: Router
  ) {}

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
        field: 'proposedProductName',
        header: 'proposedProductName',
      },
      {
        field: 'proposedAmount',
        header: 'proposedAmount',
      },
      {
        field: 'approvedAmount',
        header: 'approvedAmount',
      },
    ];
    this.clearRequestControls();
    this.getAllLoanApplication();
    this.getUserPriviledge(this.operationId);
    if (this.customerId > 0 || this.customerId != null) {
      this.getCustomerRatioCalculation(this.customerId);
      this.getCustomerFSRatioValue(this.customerId);
    }
  }

  clearRequestControls() {
    this.recommendationCommentForm = this.fb.group({
      comment: ['', Validators.required],
      vote: ['', Validators.required],
      principal: [''],
      rate: [''],
      tenor: [''],
      productId: [''],
      trailId: [''],
      statusId: [''],
      exchangeRate: [''],
      initialExposure: [''],
      totalExposure: [''],
      newExposure: [''],
    });
  }

  getAllLoanApplication(): Subscription {
    this.loadingService.show();
    return this.creditAppraisalService.getCreditLoanApplication().subscribe(
      (data) => {
        this.loadingService.hide();
        this.loanApplicationList = data.loanApplications;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getUserPriviledge(operationId): Subscription {
    return this.creditAppraisalService.getUserPriviledge(operationId).subscribe(
      (data) => {
        this.privilege = data;
      },
      (error) => {
        this.loadingService.hide();
      }
    );
  }

  getApprovalTrail(loanApplicationId, workflowToken) {
    this.workFlowToken = workflowToken;
    this.creditAppraisalService
      .getApprovalTrail(loanApplicationId, workflowToken)
      .subscribe((data) => {
        this.trails = data.details;
        this.actualdate = data.details.arrivalDate;
        this.staffs = data.previousStaff;
      });
  }

  getCustomerRatioCalculation(customerId) {
    this.fsCaptionRatios = [];
    this.customerFsService
      .getCustomerFSRatioCalculations(customerId)
      .subscribe((data) => {
        this.fsCaptionRatios = data.loanCustomerFSRatioCalculation;
        if (this.fsCaptionRatios.length > 0) {
          let fsDate1 =
            this.fsCaptionRatios[0].fsDate1 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsCaptionRatios[0].fsDate1).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';
          let fsDate2 =
            this.fsCaptionRatios[0].fsDate2 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsCaptionRatios[0].fsDate2).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';
          let fsDate3 =
            this.fsCaptionRatios[0].fsDate3 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsCaptionRatios[0].fsDate3).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';
          let fsDate4 =
            this.fsCaptionRatios[0].fsDate4 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsCaptionRatios[0].fsDate4).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';

          this.fsRatiosTableCols = [
            { field: 'ratio1', header: fsDate1 },
            { field: 'ratio2', header: fsDate2 },
            { field: 'ratio3', header: fsDate3 },
            { field: 'ratio4', header: fsDate4 },
          ];
        }
      });
  }

  getCustomerFSRatioValue(customerId) {
    this.fsRatioValueData = [];
    this.customerFsService
      .getCustomerFSRatioValue(customerId)
      .subscribe((data) => {
        this.fsRatioValueData = data.loanCustomerFSRatioCaptionReport;
        if (this.fsRatioValueData.length > 0) {
          let fsDate1 =
            this.fsRatioValueData[0].fsDate1 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsRatioValueData[0].fsDate1).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';
          let fsDate2 =
            this.fsRatioValueData[0].fsDate2 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsRatioValueData[0].fsDate2).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';
          let fsDate3 =
            this.fsRatioValueData[0].fsDate3 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsRatioValueData[0].fsDate3).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';
          let fsDate4 =
            this.fsRatioValueData[0].fsDate4 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsRatioValueData[0].fsDate4).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';

          this.fsRatioValueTableCols = [
            { field: 'ratioValue1', header: fsDate1 },
            { field: 'ratioValue2', header: fsDate2 },
            { field: 'ratioValue3', header: fsDate3 },
            { field: 'ratioValue4', header: fsDate4 },
          ];
        }
      });
    this.updateRowGroupMetaData();
  }

  onTabChange(e) {
    this.activeIndex = e.index;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoanApplication = null;
    }
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.fsRatioValueData) {
      for (let i = 0; i < this.fsRatioValueData.length; i++) {
        let rowData = this.fsRatioValueData[i];
        let fsGroupCaption = rowData.fsGroupCaption;
        if (i == 0) {
          this.rowGroupMetadata[fsGroupCaption] = {
            index: 0,
            size: 1,
          };
        } else {
          let previousRowData = this.fsRatioValueData[i - 1];
          let previousRowGroup = previousRowData.fsGroupCaption;
          if (fsGroupCaption === previousRowGroup)
            this.rowGroupMetadata[fsGroupCaption].size++;
          else
            this.rowGroupMetadata[fsGroupCaption] = {
              index: i,
              size: 1,
            };
        }
      }
    }
  }

  onTabChangeRatio(e) {
    this.activeIndexRatio = e.index;
  }

  openNextRatio() {
    this.activeIndexRatio =
      this.activeIndexRatio === 2 ? 0 : this.activeIndexRatio + 1;
  }

  openPrevRatio() {
    this.activeIndexRatio =
      this.activeIndexRatio === 0 ? 2 : this.activeIndexRatio - 1;
  }

  openNext() {
    this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 2 : this.activeIndex - 1;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedLoanApplication = null;
    }
  }

  getApplicationStatus(approvalStatus) {
    if (approvalStatus == 2)
      return '<span class="label label-info">Documentation</span>';
    if (approvalStatus == 3)
      return '<span class="label label-danger">DIS</span>';

    return '<span class="label label-warning">NEW</span>';
  }
  onRowSelect(event) {
    this.loanNotSelected = false;
    this.selectedLoanApplication = event.data;
    this.customerId = event.data.customerId;
    this.loanApplicationId = event.data.loanApplicationId;
    this.productName = event.data.approvedProductName;
    this.productId = event.data.approvedProductId;
    this.workFlowToken = event.data.workflowToken;
    this.activeIndex = 1;
    this.getApprovalTrail(this.loanApplicationId, this.workFlowToken);
    this.getCustomerRatioCalculation(this.customerId);
    this.getCustomerFSRatioValue(this.customerId);
  }

  withinApprovalLimits() {
    if (this.selectedLoanApplication == null) return;
    if (
      this.privilege.maximumAmount >=
      this.selectedLoanApplication.approvedAmount
    ) {
      return true;
    }
    return false;
  }

  getApproveButtonLabel() {
    if (this.withinApprovalLimits() == true) {
      return this.approveActionLabel;
    }
    return this.authorizeActionLabel;
  }

  forward() {
    this.displayApprovalComment = true;
  }

  onLineItemChange(input, value, id = null) {}
  disableChanges() {
    return false;
  }

  submitApproval(formObj) {
    let body = {
      targetId: this.loanApplicationId,
      approvalStatusId: parseInt(formObj.value.vote),
      comment: formObj.value.comment,
      referredStaffId: +this.staffId,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to approve this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.creditAppraisalService
            .goForApproval(body)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data.status.isSuccessful == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  data.status.message.friendlyMessage,
                  'success'
                );
                __this.getAllLoanApplication();
                __this.loanNotSelected = true;
                __this.selectedLoanApplication = null;
                __this.recommendationCommentForm.reset();
                __this.activeIndex = 0;
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
    this.loanNotSelected = false;
    this.selectedLoanApplication = row;
    this.customerId = row.customerId;
    this.loanApplicationId = row.loanApplicationId;
    this.productName = row.approvedProductName;
    this.productId = row.approvedProductId;
    this.workFlowToken = row.workflowToken;
    this.activeIndex = 1;
    this.getApprovalTrail(this.loanApplicationId, this.workFlowToken);

    this.getCustomerRatioCalculation(this.customerId);
    this.getCustomerFSRatioValue(this.customerId);
  }
  getValue(value: string) {
    if (value == '5') {
      this.showDialog = true;
    } else {
      this.staffId = 0;
    }
  }
  dismissDialog() {
    this.showDialog = false;
  }

  ngOnDestroy(): void {
    this.loadingService.hide();
    this.getAllLoanApplication().unsubscribe();
    this.getUserPriviledge(9).unsubscribe();
  }
}
