import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { SelectItem } from "primeng/api";
import { SubGLService } from "src/app/core/services/subgl.service";
import { CurrencyService } from "../../../core/services/currency.service";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-accountsetup",
  templateUrl: "./accountsetup.component.html"
})
export class AccountsetupComponent implements OnInit {
  category: any[];
  businessCategory: any[];
  accountype: any[];
  transactionCharge: any[];
  transactionTax: any[];
  tax: SelectItem[];
  charge: SelectItem[];
  form: FormGroup;
  formTitle: string = "Create New Account Setup";
  searchResults: any[];
  checkCanNominateBenefactor: boolean = false;
  checkOperatedByAnother: boolean = false;
  checkStatus: boolean = false;
  checkpreTerminationLiquidationCharge: boolean = false;
  CheckcheckCollecting: boolean = false;
  checkUsePresetChartofAccount: boolean = false;
  checkUseworkflow: boolean = false;
  checkCanPlaceOnLien: boolean = false;
  AccountName: any;
  accountList: any[];
  currency: any[];
  glArr: any[] = [];
  categoryValue: any;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private subGLService: SubGLService,
    private DepositAccountService: DepositAccountService,
    private route: ActivatedRoute,
    private currencyService: CurrencyService,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      depositAccountId: [0],
      accountName: ["", Validators.required],
      accountTypeId: [0, Validators.required],
      dormancyDays: [0, Validators.required],
      description: ["description"],
      initialDeposit: [0],
      categoryId: [0, Validators.required],
      businessCategoryId: [0],
      gLMapping: [0, Validators.required],
      bankGl: [0, Validators.required],
      interestRate: [0, Validators.required],
      interestType: [""],
      checkCollecting: [false],
      maturityType: [""],
      applicableTaxId: [[], Validators.required],
      applicableChargesId: [[], Validators.required],
      preTerminationLiquidationCharge: [false],
      interestAccrual: [2],
      status: [false, Validators.required],
      operatedByAnother: [false],
      canNominateBenefactor: [false],
      usePresetChartofAccount: [false],
      transactionPrefix: [""],
      cancelPrefix: [""],
      refundPrefix: [""],
      useworkflow: [false],
      canPlaceOnLien: [false],
      currencyId: [0],
    });
  }

  ngOnInit() {
    // this.accountList = [
    //   {
    //     subGLId: 1,
    //     subGLName: "Interest Receivable",
    //     subGLCode: "INT-1093456"
    //   },
    //   {
    //     subGLId: 1,
    //     subGLName: "Interest Payable",
    //     subGLCode: "EXP-109356"
    //   }
    // ];
    // this.glArr = this.accountList.map(item => ({
    //   label: `${item.subGLName} | ${item.subGLCode}`,
    //   value: item.subGLId
    // }));
    this.route.queryParams.subscribe(params => {
      let casaAccountId = params["editAccountSetup"];
      if (casaAccountId != null || casaAccountId != undefined) {
        this.editAccountSetup(casaAccountId);
      }
    });
    this.getCategory();
    this.getAccounttype();
    this.getTransactionCharge();
    this.getTransactionTax();
    this.getBusinessCategory();
    this.getAllGLAccount();
    this.getCurrencies();


  }

  getCategory() {
    this.loadingService.show();
    this.DepositAccountService.getAllcategory().subscribe(
      data => {
        this.category = data.categories;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getCurrencies() {
    return this.commonService.getAllCurrency().subscribe(
      data => {
        this.currency = data.commonLookups;
        this.loadingService.hide();
      },
      err => {

      }
    );
  }

  getAccounttype() {
    this.loadingService.show();
    this.DepositAccountService.getAllAccountType().subscribe(
      data => {
        this.accountype = data.accountTypes;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getBusinessCategory() {
    this.loadingService.show();
    this.DepositAccountService.getAllbusinessCategory().subscribe(
      data => {
        this.businessCategory = data.businessCategories;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getTransactionTax() {
    this.loadingService.show();
    this.DepositAccountService.getAllTransactionTax().subscribe(
      data => {
        this.transactionTax = data.transactionTaxes;
        this.tax = [];
        this.loadingService.hide();
        if (this.transactionTax !== undefined) {
          this.transactionTax.forEach(el => {
            this.tax.push({
              label: el.name,
              value: el.transactionTaxId
            });
          });
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getTransactionCharge() {
    this.loadingService.show();
    this.DepositAccountService.getAllTransactionCharge().subscribe(
      data => {
        this.transactionCharge = data.transactionCharges;
        this.charge = [];
        this.loadingService.hide();
        if (this.transactionCharge !== undefined) {
          this.transactionCharge.forEach(el => {
            this.charge.push({
              label: el.name,
              value: el.transactionChargeId
            });
          });
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  editAccountSetup(depositAccountId) {
    this.formTitle = "Edit Account Setup Information";
    this.loadingService.show();
    this.DepositAccountService.getAccountSetup(depositAccountId).subscribe(
      data => {
        let row = data.depositAccounts[0];
        this.form = this.fb.group({
          depositAccountId: row.depositAccountId,
          accountName: row.accountName,
          description: row.description,
          accountTypeId: row.accountTypeId,
          dormancyDays: row.dormancyDays,
          initialDeposit: row.initialDeposit,
          categoryId: row.categoryId,
          businessCategoryId: row.businessCategoryId,
          gLMapping: row.gLMapping,
          bankGl: row.bankGl,
          interestRate: row.interestRate,
          interestType: row.interestType,
          checkCollecting: row.checkCollecting,
          maturityType: row.maturityType,
          applicableTaxId: [row.applicableTaxId],
          applicableChargesId: [row.applicableChargesId],
          preTerminationLiquidationCharge: row.preTerminationLiquidationCharge,
          interestAccrual: row.interestAccrual,
          status: row.status,
          operatedByAnother: row.operatedByAnother,
          canNominateBenefactor: row.canNominateBenefactor,
          usePresetChartofAccount: row.usePresetChartofAccount,
          transactionPrefix: row.transactionPrefix,
          cancelPrefix: row.cancelPrefix,
          refundPrefix: row.refundPrefix,
          useworkflow: row.useworkflow,
          canPlaceOnLien: row.canPlaceOnLien,
          currencyId: row.currencyId,
        });
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(["/deposit/accountsetup-list"]);
  }

  getAllGLAccount() {
    this.loadingService.show();
    this.subGLService.getAllSubGL().subscribe(
      data => {
        this.accountList = data.subGls;
        this.loadingService.hide();
        this.glArr = this.accountList.map(item => ({
          label: `${item.subGLName} | ${item.subGLCode}`,
          value: item.subGLId
        }));

      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  submitAccountSetup(formObj) {
    const payload = formObj.value;
    payload.depositAccountId = parseInt(payload.depositAccountId);
    payload.accountTypeId = parseInt(payload.accountTypeId);
    payload.currencyId = parseInt(payload.currencyId);
    payload.initialDeposit = parseFloat(payload.initialDeposit);
    payload.categoryId = parseInt(payload.categoryId);
    payload.businessCategoryId = parseInt(payload.businessCategoryId);
    payload.glMapping = parseInt(payload.glMapping);
    payload.glMapping = parseInt(payload.glMapping);
    payload.bankGl = parseInt(payload.bankGl);
    payload.interestRate = parseFloat(payload.interestRate);
    payload.applicableTaxId = payload.applicableTaxId;
    payload.applicableChargesId = payload.applicableChargesId;
    payload.interestAccrual = parseFloat(payload.interestAccrual);
    payload.dormancyDays = parseInt(payload.dormancyDays)
    this.loadingService.show();
    this.DepositAccountService.addUpdateAccountsetup(payload).subscribe(
      data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.loadingService.hide();
          this.router.navigate(["/deposit/accountsetup-list"]);
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

  getValue(value: any) {

    this.categoryValue = value;
  }
}
