import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DepositAccountOpeningService } from "../../../core/services/depositaccountopening.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import swal from "sweetalert2";
import { CurrencyService } from "../../../core/services/currency.service";

@Component({
  selector: "app-till-and-vault",
  templateUrl: "./till-and-vault.component.html",
  styleUrls: ["./till-and-vault.component.css"]
})
export class TillAndVaultComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Till And Vault Operation Form";
  searchResults: any[];
  AccountName: any;
  companyId: Number;
  filteredSearchResults: any[];
  displaySearchModal: boolean = false;
  accountSetUpProduct: any[] = [];
  branchId: any;
  payload: any;
  tillVaultId: number;
  currencies: any[] = [];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private DepositFormService: DepositAccountOpeningService,
    private route: ActivatedRoute,
    private CustomerService: DepositAccountOpeningService,
    private DepositAccountService: DepositAccountService,
    private currency: CurrencyService
  ) {
    this.form = this.fb.group({
      // depositFormId: [0],
      tillVaultId: [0],
      structure: this.companyId,
      substructure: this.branchId,
      openingBalance: [""],
      incomingCash: [""],
      currency: [""],
      outgoingCash: [""],
      closingBalance: [""],
      shortage: [""],
      cashAvailable: [""]
    });
  }

  ngOnInit() {
    this.payload = {};
    this.route.queryParams.subscribe(param => {
      this.tillVaultId = param.id;
      if (this.tillVaultId != undefined) {
        this.formTitle = "Edit Till and Vault";
        this.gettillVault(this.tillVaultId);
      }
    });
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
    this.getCurrencies();
  }
  getCurrencies() {
    this.loadingService.show();
    return this.currency.getAllCurrency().subscribe(
      data => {
        this.loadingService.hide();
        this.currencies = data.result;
      },
      err => {
        this.loadingService.hide();

      }
    );
  }

  goBack() {
    this.router.navigate(["/deposit/till-vault-list"]);
  }

  submitTransactionCorrection(formObj) {
    const payload = formObj.value;
    payload.structure = this.companyId;
    payload.substructure = this.branchId;
    // if (!payload.queryStartDate) {
    //     return swal.fire("GOSFINANCIAL", 'Currency is required', "error");
    // };
    // if (!payload.queryEndDate) {
    //     return swal.fire("GOSFINANCIAL", 'Opening is required', "error");
    // }
    // if (!payload.currency) {
    //     return swal.fire("GOSFINANCIAL", 'Select currency', "error");
    // }
    // if (!payload.openingBalance) {
    //     return swal.fire("GOSFINANCIAL", 'Select beneficiary currency', "error");
    // }
    // if (!payload.closingBalance) {
    //     return swal.fire("GOSFINANCIAL", 'Amount is required', "error");
    // };

    this.loadingService.show();
    this.DepositAccountService.updateTillVault(formObj.value).subscribe(
      data => {
        this.loadingService.hide();
        if (data["success"] == true) {
          swal.fire("GOS FINANCIAL", data["message"], "success");
          this.router.navigate(["/deposit/till-vault-list"]);
        } else {
          swal.fire("GOS FINANCIAL", data["message"], "error");
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
      }
    );
  }

  gettillVault(id: number) {
    this.loadingService.show();
    return this.DepositAccountService.getTillVault(id).subscribe(
      data => {
        this.loadingService.hide();
        const row = data.result;
        this.form = this.fb.group({
          // depositFormId: [0],
          tillVaultId: [row.tillVaultId],
          structure: row.companyId,
          substructure: row.branchId,
          outgoingCash: [row.outgoingCash],
          incomingCash: [row.incomingCash],
          currency: [row.currency],
          openingBalance: [row.openingBalance],
          closingBalance: [row.closingBalance],
          cashAvailable: [row.cashAvailable],
          shortage: [row.shortage]
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  logMethod() {

  }
}
