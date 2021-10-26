import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../core/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositAccountOpeningService } from '../../../core/services/depositaccountopening.service';
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import swal from "sweetalert2";
import { CurrencyService } from '../../../core/services/currency.service';
import { CustomerAccountService } from '../../../core/services/customeraccount.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-closure-of-bank-account-form',
  templateUrl: './closure-of-bank-account-form.component.html',
  styleUrls: ['./closure-of-bank-account-form.component.css']
})
export class ClosureOfBankAccountFormComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Account Closure Form";
  searchResults: any[];
  AccountName: any;
  companyId: Number;
  filteredSearchResults: any[];
  displaySearchModal: boolean = false;
  accountSetUpProduct: any[] = [];
  branchId: any;
  payload: any;
  currencies: any[] = [];
  customers: any[] = [];
  customerId: number;
  accountName: any;
  modeOfSettlement: string;
  customer: any;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private DepositFormService: DepositAccountOpeningService,
    private route: ActivatedRoute,
    private CustomerService: DepositAccountOpeningService,
    private DepositAccountService: DepositAccountService,
    private currency: CurrencyService,
    private customeraccountInfoService: CustomerAccountService,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      // depositFormId: [0],
      structure: this.companyId,
      substructure: this.branchId,
      // operation: [0, Validators.required],
      // transactionId: [0, Validators.required],
      productType: [""],
      closureCharges: [""],
      accountName: [""],
      accountNumber: [""],
      status: [""],
      accountBalance: [""],
      currency: [0],
      closingDate: [""],
      reason: [""],
      charges: [""],
      finalSettlement: [""],
      beneficiary: [""],
      modeOfSettlement: [""],
      approverName: [""],
      approverComment: [""],
      transferAccount: [""],
      accountId: [""],
    });
  }

  ngOnInit() {
    this.payload = {};
    const emp = JSON.parse(localStorage.getItem("userDetails"));
    this.companyId = emp.companyId;
    this.branchId = emp.branchId;
    // this.getAllCustomer();
    // this.route.queryParams.subscribe(params => {
    //     let DepositFormId = params["editDepositForm"];
    //     if (DepositFormId != null || DepositFormId != undefined) {
    //         this.editAccountSetup(DepositFormId);
    //     }
    // });
    this.getAccountSetUp();
    this.getCurrencies();
    this.getCustomers();
  }
  getAccountSetUp() {
    return this.DepositAccountService.getAllAccountSetup().subscribe(data => {
      this.accountSetUpProduct = data.depositAccounts;
    }, err => {
    }, () => { })
  }

  editAccountSetup(depositAccountId) {
    this.formTitle = "Edit Deposit Form";
    this.loadingService.show();
    this.DepositFormService.getDepositformById(depositAccountId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data["result"];

        this.form = this.fb.group({
          accountId: [row.accountId],
          depositFormId: row.depositFormId,
          structure: row.structure,
          operation: row.operation,
          transactionId: row.transactionId,
          accountNumber: row.accountNumber,
          amount: row.amount,
          valueDate: new Date(row.valueDate),
          transactionDate: new Date(row.transactionDate),
          transactionDescription: row.transactionDescription,
          transactionParticulars: row.transactionParticulars,
          remark: row.remark,
          modeOfTransaction: row.modeOfTransaction,
          instrumentNumber: row.instrumentNumber,
          instrumentDate: new Date(row.instrumentDate),
        });
      }
    );
  }

  goBack() {
    this.router.navigate(["/deposit/depositform-list"]);
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

  submitAccountClosure(formObj) {
    const payload = formObj.value;
    payload.structure = this.companyId;
    payload.substructure = this.branchId;
    payload.currency = parseInt(payload.currency);

    payload.modeOfSettlement = parseInt(payload.modeOfSettlement);
    // if (!payload.accountName) {
    //   return swal.fire("GOSFINANCIAL", "Account Name is required", "error");
    // }
    payload.accountName = '';

    payload.status = parseInt(payload.status);

    if (!payload.beneficiary) {
      return swal.fire("GOSFINANCIAL", 'Beneficiary field is required', "error");
    }
    if (!payload.accountNumber) {
      return swal.fire("GOSFINANCIAL", 'Account Number is required', "error");
    }
    // if (!payload.status) {
    //   return swal.fire("GOSFINANCIAL", 'Status is required', "error");
    // }
    // if (!payload.accountBalance) {
    //   return swal.fire("GOSFINANCIAL", 'Enter Account number', "error");
    // }
    // if (isNaN(this.payload.accountNumber)) {
    //     return swal.fire("GOSFINANCIAL", 'Account number can only be numbers', "error");
    // }
    if (!payload.currency) {
      return swal.fire("GOSFINANCIAL", 'Select currency', "error");
    }
    if (!payload.closingDate) {
      return swal.fire("GOSFINANCIAL", 'Select closing date', "error");
    }
    if (!payload.reason) {
      return swal.fire("GOSFINANCIAL", 'Enter reason for closing', "error");
    }
    // if (!payload.charges) {
    //   return swal.fire("GOSFINANCIAL", 'Charges field is required', "error");
    // }
    if (!payload.modeOfSettlement) {
      return swal.fire("GOSFINANCIAL", 'Select mode of settlement', "error");
    }
    if (!payload.beneficiary) {
      return swal.fire("GOSFINANCIAL", 'Beneficiary field is required', "error");
    }
    if (payload.modeOfSettlement == 'bank') {
      if (!payload.transferAccount) {
        return swal.fire("GOSFINANCIAL", 'Settlement account number is required', "error");
      }
    }

    payload.finalSettlement = parseInt(payload.finalSettlement);
    // return;
    this.loadingService.show();
    this.DepositAccountService.updateBankClosure(payload).subscribe(
      data => {
        var message = data.status.message.friendlyMessage;
        this.loadingService.hide();
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          formObj.reset();
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        var message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
  getCustomers() {
    this.loadingService.show();
    return this.CustomerService.getAllCustomerOtherLite().subscribe(data => {

      this.customers = data.customerLiteAccountDetails
      this.loadingService.hide();
    }, err => {
      this.loadingService.hide();
    })
  }


  logMethod(item) {
    this.modeOfSettlement = item
  }

  getDetails(item: any) {
    this.form.patchValue({
      accountName: item.customerId,
      accountNumber: item.accountNumber,
      accountBalance: item.availableBalance.toFixed(2),
      accountId: item.customerId,
      status: item.status,
      currency: item.currency,
      charges: item.charges,
      finalSettlement: [item.availableBalance - item.charges]
    });
  }
}
