import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DepositAccountOpeningService } from "../../../core/services/depositaccountopening.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import swal from "sweetalert2";
import { CurrencyService } from "../../../core/services/currency.service";
import { CustomerAccountService } from "../../../core/services/customeraccount.service";
import { CommonService } from "../../../core/services/common.service";
import { CompanyService } from "../../../core/services/company.service";
import {Location} from '@angular/common';

@Component({
  selector: "app-withdrawal-form",
  templateUrl: "./withdrawal-form.component.html",
  styleUrls: ["./withdrawal-form.component.css"]
})
export class WithdrawalFormComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Withdrawal Form";
  searchResults: any[];
  AccountName: any;
  companyId: Number;
  filteredSearchResults: any[];
  displaySearchModal: boolean = false;
  accountSetUpProduct: any[] = [];
  branchId: any;
  payload: any;
  currencies: any[] = [];
  product: any;
  accountType: any[] = [];
  customers: any[] = [];
  customer: any;
  staffId: number;
  companyStructure: any[] = [];
  daily_widthrawal_limit: number;
  currencyArr: any[] = [];
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
    private commonService: CommonService,
    private companyService: CompanyService,
    private location: Location
  ) {

  }

  ngOnInit() {
   this.initialiseForm();
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
    this.getCurrencies();
    this.getAccountType();
    this.getAllCustomer();
    this.getCompanyStructure()
  }
  initialiseForm() {
    this.form = this.fb.group({
      id: [0],
      customerId: [0],
      structure: this.companyId,
      substructure: this.branchId,
      transactionReference: [""],
      account_number: [""],
      customer_number: [""],
      product: [0],
      decimal: [0],
      accountName: [""],
      accountType: [""],
      description: [""],
      withdrawal_type: [0],
      currency: [''],
      transactionDate: [""],
      value_date: [""],
      amount: [0],
      withdrawal_instrument_date: [new Date()],
      withdrawal_instrument_number: [""],
      exchnage_right: [""],
    });
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
  getAccountSetUp() {
    return this.DepositAccountService.getAllAccountSetup().subscribe(
      data => {
        this.accountSetUpProduct = data.depositAccounts;
      },
      err => {

      },
      () => {}
    );
  }
  getCurrencies() {
    this.loadingService.show();
    return this.currency.getAllCurrency().subscribe(
      data => {
        this.loadingService.hide();
        this.currencies = data.commonLookups;
      },
      err => {
        this.loadingService.hide();

      }
    );
  }
  editAccountSetup(depositAccountId) {
    this.formTitle = "Edit Deposit Form";
    this.loadingService.show();
    this.DepositFormService.getDepositformById(depositAccountId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data["result"];

        this.form = this.fb.group({
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
          instrumentDate: new Date(row.instrumentDate)
        });
      }
    );
  }

  goBack() {
    this.router.navigate(["/deposit/depositform-list"]);
  }

  submitWithdrawal(formObj) {
    const payload = formObj.value;
    payload.structure = parseInt(payload.structure);
    payload.product = parseInt(payload.product);
    payload.accountType = parseInt(payload.accountType);
    payload.currency = parseInt(payload.currency);
    payload.amount = parseFloat(payload.amount);
    payload.exchnage_right = parseFloat(payload.exchangeRate);
    payload.totalCharge = parseFloat(payload.totalCharge);
    payload.withdrawal_type = +payload.withdrawal_type;
    payload.substructure = this.branchId;
    // if (payload.amount > this.daily_widthrawal_limit) {
    //  return swal.fire('GOS FINANCIAL', 'Amount cannot be greater than withdrawal limit', 'error')
    // }
    this.loadingService.show();
    this.DepositAccountService.updateWithdrawals(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
         this.router.navigate(['/deposit/withdrawals'])
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

  // getAllCustomer() {
  //   this.loadingService.show();
  //   this.CustomerService.getAllCustomerLite().subscribe(
  //     data => {
  //       this.loadingService.hide();
  //       this.searchResults = data.customerLites;
  //       this.filteredSearchResults = this.searchResults;
  //     },
  //     err => {
  //       this.loadingService.hide();
  //     }
  //   );
  // }

  logMethod() {

  }
  getAccountType() {
    this.loadingService.show();
    return this.DepositAccountService.getAllAccountType().subscribe(
      data => {
        this.loadingService.hide();
        this.accountType = data.accountTypes;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getDetails(id: any) {
   const item = this.accountSetUpProduct.find(val => val.depositAccountId === +id);

   this.form.patchValue({
     accountType: item.accountTypeId
   });
  }

  getCustomerDetails(id: any) {
    const item = this.searchResults.find(val => val.customerId === +id);
    this.form.patchValue({
      customerId: item.customerId,
      account_number: item.accountNumber,
      currency: item.currencies
      // accountBalance: item.availableBalance.toFixed(2)
    });
    const currency = item.currencies;
    this.currencyArr = this.currencies.filter((c) => {
      return currency.includes(c.lookupId)
    });
    this.daily_widthrawal_limit = item.daily_widthrawal_limit;
  }
  getExchangeRate(id) {
    this.loadingService.show();
    return this.commonService.getCurrencyRate(id).subscribe(data => {
      this.loadingService.hide();
      let rate:string = data.commonLookups[0].buyingRate;
      this.form.patchValue({
        exchnage_right: rate.toString()
      })
    }, err => {
      this.loadingService.hide();
    })
  }
  getAllCustomer() {
    this.loadingService.show();
    this.CustomerService.getAllCustomerOtherLite().subscribe(data => {
      this.loadingService.hide();
      this.searchResults = data.customerLiteAccountDetails;
      this.filteredSearchResults = this.searchResults;
    });
  }
}
