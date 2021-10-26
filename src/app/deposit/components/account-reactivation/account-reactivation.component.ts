import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DepositAccountOpeningService } from "../../../core/services/depositaccountopening.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import swal from "sweetalert2";
import { CommonService } from "../../../core/services/common.service";
import { CurrencyService } from "../../../core/services/currency.service";
import { CustomerAccountService } from "../../../core/services/customeraccount.service";

@Component({
  selector: "app-account-reactivation",
  templateUrl: "./account-reactivation.component.html",
  styleUrls: ["./account-reactivation.component.css"]
})
export class AccountReactivationComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Account Reactivation Form";
  searchResults: any[];
  AccountName: any;
  companyId: Number;
  filteredSearchResults: any[];
  displaySearchModal: boolean = false;
  accountSetUpProduct: any[] = [];
  branchId: any;
  payload: any;
  currencies: any[] = [];
  customer: any;
  customers: any[] = [];
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
    private customeraccountInfoService: CustomerAccountService
  ) {
    this.form = this.fb.group({
      // depositFormId: [0],
      structure: this.companyId,
      substructure: this.branchId,
      customerId: [""],
      account_number: [""],
      status: [""],
      accountBalance: [""],
      currency: [[]],
      reactivation_reason: [""],
      charges: [""],
      approverName: [""],
      approverComment: [""],
      product: [0]
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
    this.getAllCustomer();
  }

  getAccountSetUp() {
    return this.DepositAccountService.getAllAccountSetup().subscribe(
      data => {
        this.accountSetUpProduct = data.depositAccounts;
      },
      err => {
      },
      () => { }
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
  submitAccountClosure(formObj) {
    const payload = formObj.value;
    payload.structure = +this.companyId;
    payload.substructure = +this.branchId;
    // payload.currency = +payload.currency;
    this.loadingService.show();
    this.DepositAccountService.accountReactivation(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success").then(() => {
            this.router.navigateByUrl('/deposit/account-reactivation-list')
          })
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
  getAllCustomer() {
    this.loadingService.show();
    this.CustomerService.getAllCustomerOtherLite().subscribe(data => {
      this.loadingService.hide();
      this.customers = data.customerLiteAccountDetails;
      this.filteredSearchResults = this.searchResults;
    });
  }

  getDetails(id: any) {
    const item = this.customers.find(val => val.customerId === +id)
    this.form.patchValue({
      customerId: +item.customerId,
      account_number: item.accountNumber,
      accountBalance: item.availableBalance,
      charges: item.charges,
      product: item.product
    });
  }
}
