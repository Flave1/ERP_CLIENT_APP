import { saveAs } from "file-saver";
import { CommonService } from "./../../../core/services/common.service";
import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "src/app/core/services/product.service";
import { LoadingService } from "src/app/core/services/loading.service";
import { FeeService } from "src/app/core/services/fee.service";
import { LoanScheduleService } from "src/app/core/services/loanschedule";
import { SubGLService } from "src/app/core/services/subgl.service";
import { SelectItem } from "primeng/api";
import { CollateralService } from "src/app/core/services/collateral.service";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html"
})
export class ProductComponent implements OnInit {
  form: FormGroup;
  feeform: FormGroup;
  productFeeForm: FormGroup;
  formTitle: string = "Create New Product";
  AllCollateral: SelectItem[] = [];
  activeIndex: number = 0;
  productInformation: any[] = [];
  selectedProductInformation: any[];
  repaymentTypeInformation: any[] = [];
  displayProductFee: boolean = false;
  otherTabDisabled: boolean = true;
  productId: any;
  amountTitle: string = "";
  productProductFees: any[] = [];
  feeList: any[] = [];
  productTypeList: any[] = [];
  frequencyTypeList: any[] = [];
  accountList: any[] = [];
  scheduleTypes: any[] = [];
  selectedFrequency: string;
  weightedRisk: number;
  @ViewChild("fileInput") fileInput: any;
  interestType: any;
  fileToUpload: File;
  glArr: SelectItem[] = [];
  selectedGl: any;
  selectedProductFee: any[] = [];
  collateralTypes: any[] = [];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private productService: ProductService,
    private feeService: FeeService,
    private commonService: CommonService,
    private loanScheduleService: LoanScheduleService,
    private subGLService: SubGLService,
    private router: Router,
    private route: ActivatedRoute,
    private collateralService: CollateralService
  ) {
    this.form = this.fb.group({
      productId: [0],
      productCode: ["", Validators.required],
      paymentType: ["", Validators.required],
      productName: ["", Validators.required],
      earlyTerminationCharge: [0, Validators.required],
      lateTerminationCharge: [0, Validators.required],
      lowRiskDefinition: [0, Validators.required],
      rate: [0],
      period: [""],
      cleanUpCircle: [0],
      weightedMaxScore: ["", Validators.required],
      productLimit: ["", Validators.required],
      defaultvalue: [0],
      defaultRange: [0],
      significant2: [""],
      significant3: [""],
      productTypeId: [""],
      principalGL: [""],
      allowableCollaterals: [0],
      interestIncomeExpenseGL: [""],
      interestReceivablePayableGL: [""],
      frequencyTypeId: ["", Validators.required],
      scheduleTypeId: ["", Validators.required],
      collateralPercentage: [""],
      poratedInterest: [""],
      feeIncomeGL: [""]
    });
    this.productFeeForm = this.fb.group({
      productFeeId: 0,
      productId: 0,
      productPaymentType: ["", Validators.required],
      feeId: ["", Validators.required],
      productFeeType: ["", Validators.required],
      productAmount: ["", Validators.required]
    });
    this.glArr = [];
  }

  ngOnInit() {
    this.accountList =  [
      {
        subGLId: 1,
        subGLName: 'Interest Receivable',
        subGLCode: 'INT-1093456'
      },
      {
        subGLId: 1,
        subGLName: 'Interest Payable',
        subGLCode: 'EXP-109356'
      }
    ]
    this.glArr = this.accountList.map(item => ({
      label: `${item.subGLName} | ${item.subGLCode}`,
      value: item.subGLId
    }));
    this.route.queryParams.subscribe(params => {
      this.productId = params["editproductinfo"];
      if (this.productId != null || this.productId != undefined) {
        this.editProduct(this.productId);
        this.getProductFeeByProduct(this.productId);
        this.getAllRepaymentType();
      }
    });
    this.getAllIntegralFee();
    this.getAllRepaymentType();
    this.getFrequencyTypes();
    this.getAllProductTypes();
    this.getAllGLAccount();
    this.getLoanScheduleTypes();
    this.getAllCollateralTypes();
  }

  getAllCollateralTypes(): void {
    this.loadingService.show();
    this.collateralService.getAllCollateralType().subscribe(data => {
      this.collateralTypes = data.collateralTypes;
      // collateralTypes.forEach(x => {
      //   this.AllCollateral.push({
      //     label: x.name,
      //     value: x.collateralTypeId
      //   });
      // });
    }, err => {
      this.loadingService.hide()
    });
  }
  getAllProductTypes() {
    this.productService.getAllProductType().subscribe(res => {
      this.productTypeList = res.productType;
    });
  }
  getAllGLAccount() {
    this.subGLService.getAllSubGL().subscribe(
      data => {
        this.accountList = data.subGls;
        this.glArr = this.accountList.map(item => ({
          label: `${item.subGLName} | ${item.subGLCode}`,
          value: item.subGLId
        }));
      },
      err => {

      }
    );
  }
  getFrequencyTypes() {
    this.loanScheduleService.getAllFrequencyTypes().subscribe(res => {
      this.frequencyTypeList = res.lookUp;
    }, err => {

    });
  }
  getAllProductFee() {
    this.productService.getAllProductFee().subscribe(data => {
      this.productProductFees = data["result"];
    });
  }

  getAllIntegralFee() {
    this.loadingService.show();
    this.feeService.getAllFee().subscribe(
      data => {
        this.loadingService.hide();
        this.feeList = data.fees;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getProductFeeByProduct(productId) {
    this.productService.getProductFeeByProduct(productId).subscribe(data => {
      this.productProductFees = data.productFee;
    });
  }

  getAllRepaymentType() {
    this.loadingService.show();
    this.feeService.getAllRepaymentType().subscribe(data => {
      this.loadingService.hide();
      this.repaymentTypeInformation = data.repaymentType;
    }, err => {
      this.loadingService.hide()
    });
  }

  getLoanScheduleTypes() {
    this.loanScheduleService.getAllLoanScheduleType().subscribe(res => {
      this.scheduleTypes = res.lookUp;
    }, err => {

    });
  }

  onFrequencyTypeChanged(value) {
    let rate = this.form.get("rate").value;
    this.calculatePoratedInterest(rate, value);
  }
  onInterestRateChanged(value) {
    let frequency = this.form.get("frequencyTypeId").value;
    this.calculatePoratedInterest(value, frequency);
  }

  calculatePoratedInterest(rate, frequency) {
    let freq = this.frequencyTypeList.find(x => x.lookupId == frequency);
    if (freq != undefined) {
      this.selectedFrequency = freq.lookupName;
    }
    let interest = 0;
    if (Number(rate) > 0) {
      switch (Number(frequency)) {
        case 1: {
          interest = +Number(rate).toFixed(2);
          break;
        }
        case 2: {
          interest = +(Number(rate) / 2).toFixed(2);
          break;
        }
        case 3: {
          interest = +(Number(rate) / 4).toFixed(2);
          break;
        }
        case 4: {
          interest = +(Number(rate) / 6).toFixed(2);
          break;
        }
        case 5: {
          interest = +(Number(rate) / 12).toFixed(2);
          break;
        }
        case 6: {
          interest = +(Number(rate) / 24).toFixed(2);
          break;
        }
        case 7: {
          interest = +(Number(rate) / 52).toFixed(2);
          break;
        }
        case 8: {
          interest = +(Number(rate) / 365).toFixed(2);
          break;
        }
        case 9: {
          interest = +(Number(rate) / 3).toFixed(2);
          break;
        }
        default: {
          interest = 0;
          break;
        }
      }
      this.form.get("poratedInterest").setValue(interest);
    }
  }
  getSelectedGL(value) {
    this.accountList.forEach(item => {
      if (value == item.value) {
        return value == item.value;
      } else {
      }
    });
  }
  editProduct(productId) {
    this.formTitle = "Edit Product Information";
    this.loadingService.show();
    this.productService.getProduct(productId).subscribe(data => {
      this.loadingService.hide();
      let row = data.products[0];
      if (row != undefined) {
        this.otherTabDisabled = false;
      }

      this.form = this.fb.group({
        productId: [row.productId],
        productCode: [row.productCode, ],
        paymentType: [row.paymentType, ],
        productName: [row.productName, ],
        earlyTerminationCharge: [
          row.earlyTerminationCharge,
        ],
        lateTerminationCharge: [row.lateTerminationCharge,],
        lowRiskDefinition: [row.lowRiskDefinition,],
        allowableCollaterals: [row.allowableCollaterals],
        rate: [row.rate],
        period: [row.period,],
        cleanUpCircle: [row.cleanUpCircle],
        weightedMaxScore: [row.weightedMaxScore,],
        defaultvalue: [row.defaultvalue, ],
        defaultRange: [row.defaultRange],
        significant2: [row.significant2, ],
        significant3: [row.significant3, ],
        productTypeId: [row.productTypeId,],
        principalGL: [row.principalGL],
        interestIncomeExpenseGL: [
          row.interestIncomeExpenseGL,
        ],
        interestReceivablePayableGL: [row.interestReceivablePayableGL],
        frequencyTypeId: [row.frequencyTypeId,],
        scheduleTypeId: [row.scheduleTypeId,],
        collateralPercentage: [row.collateralPercentage],
        poratedInterest: [row.poratedInterest],
        productLimit: [row.productLimit],
        feeIncomeGL: [row.feeIncomeGL]
      });
      this.productId = row.productId;
      this.weightedRisk = row.weightedMaxScore;
      this.interestType = row.interestType;
      let allowCol = row.allowableCollaterals;
      this.AllCollateral.forEach((item, i, allowCol) => {
        if (item.value == allowCol[i]) {
          return item.label;
        }
      });
      this.getProductFeeByProduct(productId);
      this.calculatePoratedInterest(row.rate, row.frequencyTypeId);
    }, err => {
      this.loadingService.hide()
    });
  }

  onFeeTypeChange(feeType) {
    if (feeType == 1) {
      this.amountTitle = "Fixed";
    } else {
      this.amountTitle = "Percentage (%)";
    }
  }

  goBack() {
    this.router.navigate(["/credit/product-list"]);
  }
  submitProductInfo(formObj) {
    const payload = formObj.value;
    if (!payload.productTypeId) {
      return swal.fire("GOS FINANCIALS", "Select product type", "error");
    }
    if (!payload.productCode) {
      return swal.fire("GOS FINANCIALS", "Product Code is required", "error");
    }
    if (!payload.productName) {
      return swal.fire("GOS FINANCIALS", "Product name is required", "error");
    }
    if (!payload.paymentType) {
      return swal.fire(
        "GOS FINANCIALS",
        "Select interest payment type",
        "error"
      );
    }
    if (!payload.scheduleTypeId) {
      return swal.fire("GOS FINANCIALS", "Select schedule method", "error");
    }
    if (!payload.frequencyTypeId) {
      return swal.fire("GOS FINANCIALS", "Select frequency type", "error");
    }
    if (!payload.weightedMaxScore) {
      return swal.fire("GOS FINANCIALS", "Weighted score is required", "error");
    }
    if (!payload.productLimit) {
      return swal.fire("GOS FINANCIALS", "Product limit is required", "error");
    }
    if (!payload.lowRiskDefinition) {
      return swal.fire(
        "GOS FINANCIALS",
        "Low risk definition iS required",
        "error"
      );
    }
    if (!payload.earlyTerminationCharge) {
      return swal.fire(
        "GOS FINANCIALS",
        "Early termination charge is required",
        "error"
      );
    }
    if (!payload.lateTerminationCharge) {
      return swal.fire(
        "GOS FINANCIALS",
        "Late repayment charge is required",
        "error"
      );
    }
    if (!payload.allowableCollaterals) {
      payload.allowableCollaterals = [];
    }
    if (payload.collateralPercentage == "") {
      payload.collateralPercentage = 0
    }
    payload.interestType = this.interestType;
    payload.paymentType = parseInt(payload.paymentType);
    payload.rate = parseFloat(payload.rate);
    payload.productTypeId = parseInt(payload.productTypeId);
    payload.earlyTerminationCharge = parseInt(payload.earlyTerminationCharge);
    payload.principalGL = parseInt(payload.principalGL);
    payload.interestIncomeExpenseGL = parseInt(payload.interestIncomeExpenseGL);
    payload.interestReceivablePayableGL = parseInt(payload.interestReceivablePayableGL);
    payload.frequencyTypeId = parseInt(payload.frequencyTypeId);
    payload.scheduleTypeId = parseInt(payload.scheduleTypeId);
    payload.productLimit = parseFloat(payload.productLimit);
    payload.lateTerminationCharge = parseInt(payload.lateTerminationCharge);
    payload.lowRiskDefinition = parseFloat(payload.lowRiskDefinition);
    payload.feeIncomeGL = parseInt(payload.feeIncomeGL);
    payload.interestType = parseInt(payload.interestType);
    payload.defaultvalue = parseInt(payload.defaultvalue);
    payload.significant2 = parseInt(payload.significant2);
    payload.significant3 = parseInt(payload.significant3);
    payload.rate = parseInt(payload.rate);
    payload.collateralPercentage  = +payload.collateralPercentage;
    this.loadingService.show();
    this.productService.addProduct(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.productId = data.products.productId;
          // this.weightedRisk = data["result"].weightedMaxScore;
          this.otherTabDisabled = false;
          this.editProduct(this.productId);
          swal.fire("GOS FINANCIAL", message, "success");
          this.activeIndex = this.activeIndex + 1;
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
  onSavedButtonPressed() {
    swal.fire(
      "GOS FINANCIAL",
      "Record Saved Successfully and it being sent for approval",
      "success"
    );
    this.router.navigate(["/credit/product-list"]);
  }
  onTabChange(e) {
    this.activeIndex = e.index;
    this.productId = this.productId;
  }

  openNext() {
    this.activeIndex = this.activeIndex === 3 ? 0 : this.activeIndex + 1;
    this.productId = this.productId;
  }

  showAddNewProductFee() {
    this.displayProductFee = true;
    this.productFeeForm = this.fb.group({
      productFeeId: 0,
      productId: 0,
      productPaymentType: [""],
      feeId: [""],
      productFeeType: [""],
      productAmount: [""]
    });
  }
  editProductFee(row) {
    this.productFeeForm = this.fb.group({
      productFeeId: row.productFeeId,
      productId: row.productId,
      productPaymentType: [row.productPaymentType],
      feeId: [row.feeId],
      productFeeType: [row.productFeeType],
      productAmount: [row.productAmount]
    });
    this.onFeeTypeChange(row.productFeeType);
    this.displayProductFee = true;
  }
  deleteProductFee(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.productService
            .deleteProductFee(row.productFeeId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getProductFeeByProduct(this.productId);
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  submitProductFee(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    // if (this.amountTitle == "Percentage (%)") {
    //   body.productAmount = formObj.value.productAmount / 100;
    // } else {
    //   body.productAmount = formObj.value.productAmount;
    // }
    body.productAmount = formObj.value.productAmount;
    body.productId = this.productId;
    body.productPaymentType = parseInt(body.productPaymentType);
    body.feeId = parseInt(body.feeId);
    body.productFeeType = parseInt(body.productFeeType);
    body.productAmount = parseFloat(body.productAmount);
    this.productService.addProductFee(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.displayProductFee = false;
          this.getProductFeeByProduct(this.productId);
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
  exportProductFee() {
    this.loadingService.show();
    this.productService.exportProductFee(this.productId).subscribe(response => {
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
          var file = new File([bb], "Product Fee.xlsx", {
            type: "application/vnd.ms-excel"
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: "application/vnd.ms-excel"
          });
          window.navigator.msSaveBlob(textFileAsBlob, "Product Fee.xlsx");
        }
      }
    });
  }
  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 3 : this.activeIndex - 1;
    this.productId = this.productId;
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadProductFee() {
    if (this.fileToUpload == null) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
      return;
    }
    this.loadingService.show();
    this.productService.uploadProductFee(this.fileToUpload).then(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getProductFeeByProduct(this.productId);
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
    ).catch(err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire("GOS FINANCIAL", message, "error");
    });
  }
  multipleDelete() {
    if (this.selectedProductInformation.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedProductInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.productTypeId
        };
        targetIds.push(data);
      });
    }
    let body = {
      targetIds: targetIds
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.productService
            .deleteMultipleProductFee(body)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "Record deleted successful.",
                  "success"
                );
                __this.getProductFeeByProduct(this.productId);
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  multipleDeleteProductFee() {
    if (this.selectedProductFee.length === 0) {
      return swal.fire(
        "GOS FINANCIALS",
        "Select product fee to delete",
        "error"
      );
    }
    let targetArr = this.selectedProductFee;
    let targetIds = [];
    if (targetArr !== undefined) {
      targetArr.forEach(el => {
        let data = el.productFeeId;
        targetIds.push(data);
      });
    }
    let payload = {ids: targetIds };
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(res => {
        if (res.value) {
          this.loadingService.show();
          return this.productService
            .deleteMultipleProductFee(payload)
            .subscribe(
              res => {
                this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.deleted) {
                  swal.fire("GOS FINANCIALS", message, "success");
                  this.getProductFeeByProduct(this.productId);
                } else {
                  swal.fire("GOS FINANCIALS", message, 'error');
                }
              },
              err => {
                this.loadingService.hide();
                const message = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIALS", message, "error");
              }
            );
        }
      })
      .catch(err => {

      });
  }
}
