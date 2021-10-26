import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DepositAccountOpeningService } from "../../../core/services/depositaccountopening.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import swal from "sweetalert2";
import { CustomerAccountService } from "../../../core/services/customeraccount.service";
import { CurrencyService } from "../../../core/services/currency.service";
import { CommonService } from "../../../core/services/common.service";
import {CompanyService} from "../../../core/services/company.service";
import {Location} from "@angular/common";

@Component({
  selector: "app-transfer-form",
  templateUrl: "./transfer-form.component.html",
  styleUrls: ["./transfer-form.component.css"]
})
export class TransferFormComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Transfer Form";
  searchResults: any[];
  AccountName: any;
  companyId: Number;
  filteredSearchResults: any[];
  displaySearchModal: boolean = false;
  accountSetUpProduct: any[] = [];
  branchId: any;
  payload: any;
  customer: any;
  product: any;
  customers: any[] = [];
  currencies: any[] = [];
  companyStructure: any[] = [];
  staffId: number;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private DepositFormService: DepositAccountOpeningService,
    private route: ActivatedRoute,
    private CustomerService: DepositAccountOpeningService,
    private DepositAccountService: DepositAccountService,
    private customeraccountInfoService: CustomerAccountService,
    private currency: CurrencyService,
    private commonService: CommonService,
    private companyService: CompanyService,
    private location: Location
  ) {
    this.form = this.fb.group({
      transferFormId: [0],
      structure: this.companyId,
      transactionReference: ["", Validators.required],
      product: [""],
      payingAccountName: [""],
      payingAccountNumber: [""],
      beneficiaryAccountName: [""],
      beneficiaryAccountNumber: [""],
      externalReference: [""],
      transactionNarration: [""],
      beneficiaryAccountCurrency: [""],
      payingAccountCurrency: [""],
      transactionDate: [""],
      valueDate: [""],
      amount: [""],
      exchangeRate: [""],
      totalCharge: [""]
    });
  }

  ngOnInit() {
    this.payload = {};

    const emp = JSON.parse(localStorage.getItem("userDetails"));
    this.companyId = emp.companyId;
    this.branchId = emp.branchId;
    this.staffId = emp.staffId;
    // this.getAllCustomer();
    // this.route.queryParams.subscribe(params => {
    //     let DepositFormId = params["editDepositForm"];
    //     if (DepositFormId != null || DepositFormId != undefined) {
    //         this.editAccountSetup(DepositFormId);
    //     }
    // });
    this.getAccountSetUp();
    this.getCustomers();
    this.getCurrencies();
    this.getCompanyStructure()
  }
  getAccountSetUp() {
    this.loadingService.show();
    return this.DepositAccountService.getAllAccountSetup().subscribe(
      data => {
        this.loadingService.hide();
        this.accountSetUpProduct = data.depositAccounts;
      },
      err => {
        this.loadingService.hide();

      },
      () => {}
    );
  }

  getCurrencies() {
    this.loadingService.show();
    return this.commonService.getAllCurrency().subscribe(
      data => {
        this.loadingService.hide();
        this.currencies = data.commonLookups;
      },
      err => {
        this.loadingService.hide();

      }
    );
  }
  goBack() {
    this.location.back()
  }
  getCompanyStructure() {
    this.loadingService.show();
    return this.companyService
      .getCompanyStructureByStatffId(this.staffId)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.companyStructure = data.companyStructures;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }
  submitWithdrawal(formObj) {
    const payload = formObj.value;
    payload.structure = parseInt(payload.structure);
    payload.product = parseInt(payload.product);
    payload.amount = parseFloat(payload.amount);
    payload.exchangeRate = parseFloat(payload.exchangeRate);
    payload.totalCharge = parseFloat(payload.totalCharge);
    if (!payload.product) {
      return swal.fire("GOS FINANCIAL", "Product Type is required", "error");
    }
    if (!payload.payingAccountName) {
      return swal.fire("GOS FINANCIAL", "Customer Name is required", "error");
    }
    // if (!payload.accountNumber) {
    //     return swal.fire("GOS FINANCIAL", 'Account Number is required', "error");
    // }
    // if (isNaN(payload.accountNumber)) {
    //     return swal.fire("GOS FINANCIAL", 'Account number can only be numbers', "error");
    // };
    if (!payload.beneficiaryAccountName) {
      return swal.fire(
        "GOS FINANCIAL",
        "Beneficiary account name is required",
        "error"
      );
    }
    if (!payload.beneficiaryAccountNumber) {
      return swal.fire(
        "GOS FINANCIAL",
        "Beneficiary account number is required",
        "error"
      );
    }
    if (isNaN(payload.beneficiaryAccountNumber)) {
      return swal.fire(
        "GOS FINANCIAL",
        "Account number can only be numbers",
        "error"
      );
    }
    if (!payload.payingAccountCurrency) {
      return swal.fire(
        "GOS FINANCIAL",
        "Select paying account currency",
        "error"
      );
    }
    if (!payload.beneficiaryAccountCurrency) {
      return swal.fire("GOS FINANCIAL", "Select beneficiary currency", "error");
    }
    if (!payload.amount) {
      return swal.fire("GOS FINANCIAL", "Amount is required", "error");
    }
    if (isNaN(payload.amount)) {
      return swal.fire("GOS FINANCIAL", "Amount can only be numbers", "error");
    }
    if (!payload.transactionDate) {
      return swal.fire("GOS FINANCIAL", "Choose transaction date", "error");
    }
    if (!payload.valueDate) {
      return swal.fire("GOS FINANCIAL", "Choose value date", "error");
    }
    if (!payload.exchangeRate) {
      return swal.fire("GOS FINANCIAL", "Exchange rate is required", "error");
    }

    this.loadingService.show();
    return this.DepositAccountService.updateTransferForm(payload)
      .subscribe(res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          formObj.reset();
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      }, err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      })
  }

  getCustomers() {
    this.loadingService.show();
    return this.customeraccountInfoService.getAllCustomerAccount().subscribe(
      data => {
        this.loadingService.hide();
        this.customers = data.customerLite;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  logMethod() {

  }
  getDetails(item) {

    this.product = item.depositAccountId;
    this.form.controls.product.setValue(item.depositAccountId);
    this.form.controls.accountType.setValue(item.accountTypeId);
    // this.form.patchValue({
    //   product: item.depositAccountId,
    //   accountType: item.accountTypeId
    // })
  }

  getCustomerDetails(item: any) {
    this.form.patchValue({
      payingAccountName: item.customerId,
      payingAccountNumber: parseInt(item.accountNumber)
    });
  }
}
