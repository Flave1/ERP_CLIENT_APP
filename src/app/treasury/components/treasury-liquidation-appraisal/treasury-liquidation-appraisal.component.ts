import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { ProductService } from "../../../core/services/product.service";
import { CollateralService } from "../../../core/services/collateral.service";
import { CreditAppraisalService } from "../../../core/services/credit-appraisal.service";
import { CustomerFsService } from "../../../core/services/customer-fs.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { TreasuryService } from "../../../core/services/treasury.service";

@Component({
  selector: "app-treasury-liquidation-appraisal",
  templateUrl: "./treasury-liquidation-appraisal.component.html",
  styleUrls: ["./treasury-liquidation-appraisal.component.css"]
})
export class TreasuryLiquidationAppraisalComponent implements OnInit {
  products: any[] = [];
  recommendationCommentForm: FormGroup;
  fsRatioValueData: any[] = [];
  rowGroupMetadata: {};
  activeIndex: number = 0;
  activeIndexRatio: number = 0;
  liquidations: any[] = [];
  selectedItem: any = {};
  customerId: number;
  loanApplicationId: number;
  productName: string;
  productId: number;
  displayApprovalComment: boolean = false;
  privilege: any = {};
  trails: any[] = [];
  actualdate: any;
  operationId: number = 32;
  loanNotSelected: boolean = true;
  approveActionLabel: string = "Approve";
  authorizeActionLabel: string = "Authorize";
  viewHeight: any = "600px";
  treasureIssuerInvestmentId: any;
  liquidationId: any;
  workFlowToken: string;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private productService: ProductService,
    private collateralService: CollateralService,
    private creditAppraisalService: CreditAppraisalService,
    private customerFsService: CustomerFsService,
    private router: Router,
    private treasuryService: TreasuryService
  ) {}

  ngOnInit() {
    this.clearRequestControls();
    this.getLiquidationApprovals();
    this.getUserPriviledge(this.operationId);
    // if(this.customerId > 0 || this.customerId != null){
    //     this.getCustomerRatioCalculation(this.customerId);
    //     this.getCustomerFSRatioValue(this.customerId);
    // }
  }

  clearRequestControls() {
    this.recommendationCommentForm = this.fb.group({
      comment: ["", Validators.required],
      vote: ["", Validators.required],
      principal: [""],
      rate: [""],
      tenor: [""],
      productId: [""],
      trailId: [""],
      statusId: [""],
      exchangeRate: [""],
      initialExposure: [""],
      totalExposure: [""],
      newExposure: [""]
    });
  }

  getLiquidationApprovals() {
    this.loadingService.show();
    this.treasuryService.liquidationAppraisal().subscribe(
      data => {
        this.loadingService.hide();
        this.liquidations = data.liquidations;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getUserPriviledge(operationId) {
    this.creditAppraisalService
      .getUserPriviledge(operationId)
      .subscribe(data => {
        this.privilege = data["result"];
      });
  }

  getApprovalTrail(loanApplicationId, operationId) {
    this.creditAppraisalService
      .getApprovalTrail(loanApplicationId, operationId)
      .subscribe(data => {
        this.trails = data["result"];
        this.actualdate = data["result"].arrivalDate;
      });
  }

  onTabChange(e) {
    this.activeIndex = e.index;
    if (this.activeIndex == 0) {
      this.loanNotSelected = true;
      this.selectedItem = null;
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
            size: 1
          };
        } else {
          let previousRowData = this.fsRatioValueData[i - 1];
          let previousRowGroup = previousRowData.fsGroupCaption;
          if (fsGroupCaption === previousRowGroup)
            this.rowGroupMetadata[fsGroupCaption].size++;
          else
            this.rowGroupMetadata[fsGroupCaption] = {
              index: i,
              size: 1
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
      this.selectedItem = null;
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
    this.selectedItem = event.data;
    this.customerId = event.data.issuerRegistrationId;
    this.treasureIssuerInvestmentId = event.data.loanApplicationId;
    this.productName = event.data.approvedProductName;
    this.productId = event.data.approvedProductId;
    this.liquidationId = event.data.liquidationOperationId;
    this.workFlowToken = event.data.workflowToken;
    this.activeIndex = 1;
    this.getApprovalTrail(this.liquidationId, this.workFlowToken);
  }

  withinApprovalLimits() {
    if (this.selectedItem == null) return;
    if (this.privilege.maximumAmount >= this.selectedItem.approvedAmount) {
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
      targetId: this.liquidationId,
      approvalStatusId: +formObj.value.vote,
      approvalComment: formObj.value.comment,
      workflowToken: this.workFlowToken
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to approve this record?",
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.treasuryService
            .submitLiquidationApproval(body)
            .subscribe(data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getLiquidationApprovals();
                __this.loanNotSelected = true;
                __this.selectedItem = null;
                __this.recommendationCommentForm.reset();
                __this.activeIndex = 0;
              } else {
                swal.fire("GOS FINANCIAL", message, "error");
              }
            }, err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOS FINANCIAL", message, "error");
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  // getCustomerDetails(id: number) {
  //     return this.treasuryService.getInvestorCustomer(id).subscribe(data => {
  //
  //     }, err => {
  //         return err
  //     })
  // }
  onSelectClicked(row) {
    this.loanNotSelected = false;
    this.selectedItem = row;
    this.customerId = row.issuerRegistrationId;
    this.treasureIssuerInvestmentId = row.treasureIssuerInvestmentId;
    this.liquidationId = row.liquidationId;
    this.productName = row.productName;
    this.productId = row.approvedProductId;
    this.workFlowToken = row.workflowToken;
    this.activeIndex = 1;
    // this.getCustomerDetails(this.customerId)
    this.getApprovalTrail(this.liquidationId, this.workFlowToken);
    //
    // this.getCustomerRatioCalculation(this.customerId);
    // this.getCustomerFSRatioValue(this.customerId);
  }
}
