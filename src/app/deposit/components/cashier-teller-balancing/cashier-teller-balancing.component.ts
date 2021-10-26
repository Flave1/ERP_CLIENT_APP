import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../core/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositAccountOpeningService } from '../../../core/services/depositaccountopening.service';
import { DepositAccountService } from '../../../core/services/depositaccount.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';
import { CurrencyService } from '../../../core/services/currency.service';
import {CompanyService} from '../../../core/services/company.service';
import {JwtService} from '../../../core/services/jwt.service';

@Component({
  selector: 'app-cashier-teller-balancing',
  templateUrl: './cashier-teller-balancing.component.html',
  styleUrls: ['./cashier-teller-balancing.component.css']
})
export class CashierTellerBalancingComponent implements OnInit {
  form: FormGroup;
  formTitle: string = 'Cashier/Teller Balancing Form';
  searchResults: any[];
  AccountName: any;
  companyId: Number;
  filteredSearchResults: any[];
  displaySearchModal: boolean = false;
  accountSetUpProduct: any[] = [];
  branchId: any;
  payload: any;
  currencies: any[] = [];
  depositCashierTellerId: number;
  currencyTransactions: any[] = [];
  transactionDetails: any = {};
  viewHeight: string = '600px';
  transactions: any[] = [];
  displayTransactions: boolean;
  structures: any[] = [];
  staffId: any;
  structure: any;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private DepositFormService: DepositAccountOpeningService,
    private route: ActivatedRoute,
    private CustomerService: DepositAccountOpeningService,
    private DepositAccountService: DepositAccountService,
    private location: Location,
    private currency: CurrencyService,
    private companyService: CompanyService,
    // private jwtService: JwtService
  ) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.depositCashierTellerId = params.id;
      if (this.depositCashierTellerId != undefined) {
        this.getCallOver(this.depositCashierTellerId);
      }
    });
    const emp = JSON.parse(localStorage.getItem('userDetails'));
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
    this.initialiseForm();
    this.getCurrencies();
    this.getCashierBalancing();
    this.getCompanyStructureByStaffId()
  }
  initialiseForm() {
    this.form = this.fb.group({
      // depositFormId: [0],
      id: [0],
      currency: [''],
      amount: [0]
    });
  }
  getCompanyStructureByStaffId() {
    this.loadingService.show();
    return this.companyService.getCompanyStructureByStatffId(this.staffId).subscribe(data => {
      this.structures = data.companyStructures;
      this.loadingService.hide()
    }, er => {
      this.loadingService.hide()
    })
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
  getCallOver(id: number) {
    this.loadingService.show();
    return this.DepositAccountService.getCallover(id)
      .then(data => {
        this.loadingService.hide();
        const row = data.result;
        this.form = this.fb.group({
          // depositFormId: [0],
          id: [row.id],
          currency: [row.currency],
          amount: [row.amount]
        });
      })
      .catch(err => {
        this.loadingService.hide();
      });
  }
  goBack() {
    this.location.back();
  }

  submitCallOver(form: FormGroup) {
    const payload = form.value;
    payload.currency = +payload.currency;
    payload.amount = +payload.amount;
    this.loadingService.show();
    return this.DepositAccountService.updateCallover(payload)
      .then(res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.initialiseForm();
            this.getCashierBalancing()
          });
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('Error', message, 'error');
      });
  }
  getCashierBalancing() {
    this.loadingService.show();
    return this.DepositAccountService.getCashierBalancing().subscribe(data => {
      this.loadingService.hide();
      this.transactionDetails = data;
      this.currencyTransactions = data.currencie_and_amount;
      this.structure = data.structure
    }, err => {
      this.loadingService.hide()
    })
  }
  showTransactions(id) {

    this.displayTransactions = true;
  }
}
