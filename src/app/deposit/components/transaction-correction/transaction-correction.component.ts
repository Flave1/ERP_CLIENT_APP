import { Component, OnInit } from '@angular/core';
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingService} from '../../../core/services/loading.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DepositAccountOpeningService} from '../../../core/services/depositaccountopening.service';
import swal from "sweetalert2";
import {CurrencyService} from '../../../core/services/currency.service';

@Component({
  selector: 'app-transaction-correction',
  templateUrl: './transaction-correction.component.html',
  styleUrls: ['./transaction-correction.component.css']
})
export class TransactionCorrectionComponent implements OnInit {

    form: FormGroup;
    formTitle: string = "Transaction Correction Form";
    searchResults: any[];
    AccountName: any;
    companyId : Number;
    filteredSearchResults: any[];
    displaySearchModal: boolean = false;
    accountSetUpProduct: any[] = [];
    branchId: any;
    payload: any;
  transactionCorrectionId: any;
  currencies: any[] = [];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private router: Router,
        private DepositFormService: DepositAccountOpeningService,
        private route: ActivatedRoute,
        private CustomerService: DepositAccountOpeningService,
        private DepositAccountService: DepositAccountService,
        private currency: CurrencyService,
    ) {
        this.form = this.fb.group({
            // depositFormId: [0],
          transactionCorrectionId: [0],
            structure: this.companyId,
            substructure: this.branchId,
            queryStartDate: [""],
            queryEndDate: [''],
            currency: [''],
            openingBalance: [''],
            closingBalance: [''],
        });
    }

    ngOnInit() {
        this.payload = {};
        this.route.queryParams.subscribe(param => {
          this.transactionCorrectionId = param.id;
          if (this.transactionCorrectionId != undefined) {
            this.getTransactionCorrection(this.transactionCorrectionId)
          }
        })
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
        // this.getAccountSetUp()
      this.getCurrencies();
    }
    getAccountSetUp() {
        return this.DepositAccountService.getAllAccountSetup().subscribe(data => {
            this.accountSetUpProduct = data.depositAccounts;
        }, err => {

        }, () => {})
    }


    goBack() {
        this.router.navigate(["/deposit/depositform-list"]);
    }


    submitTransactionCorrection(formObj) {
        const payload = formObj.value;
      payload.structure = this.companyId;
      payload.substructure = this.branchId;
        // if (!payload.queryStartDate) {
        //     return swal.fire("GOSFINANCIAL", 'Product Type is required', "error");
        // };
        // if (!payload.queryEndDate) {
        //     return swal.fire("GOSFINANCIAL", 'Customer Name is required', "error");
        // }
        // if (!payload.currency) {
        //     return swal.fire("GOSFINANCIAL", 'Account Number is required', "error");
        // }
        // if (!payload.openingBalance) {
        //     return swal.fire("GOSFINANCIAL", 'Beneficiary account name is required', "error");
        // }
        // if (!payload.closingBalance) {
        //     return swal.fire("GOSFINANCIAL", 'Beneficiary account number is required', "error");
        // }

        this.loadingService.show();

        this.DepositAccountService.updateTransactionCorrection(
            formObj.value
        ).subscribe(
            data => {
                this.loadingService.hide();
                if (data["success"] == true) {
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigate(["/deposit/transactioncorrection-list"]);
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


  logMethod() {

    }


  getTransactionCorrection(transactionCorrectionId: number) {
    this.loadingService.show();
    return this.DepositAccountService.getTransactionCorrection(transactionCorrectionId).subscribe(data => {
      this.loadingService.hide();
      const row = data.result;
      this.form = this.fb.group({
        // depositFormId: [0],
        transactionCorrectionId: [row.transactionCorrectionId],
        structure: row.companyId,
        substructure: row.branchId,
        queryStartDate: [new Date(row.queryStartDate)],
        queryEndDate: [new Date(row.queryEndDate)],
        currency: [row.currency],
        openingBalance: [row.openingBalance],
        closingBalance: [row.closingBalance],
      });
    }, err => {
      this.loadingService.hide();
    })
  }
}
