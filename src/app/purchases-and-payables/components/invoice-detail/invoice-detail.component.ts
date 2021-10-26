import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../../../core/services/purchase.service';
import { LoadingService } from '../../../core/services/loading.service';
import { SubGLService } from '../../../core/services/subgl.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { SelectItem } from 'primeng/api';
import { SupplierService } from '../../../core/services/supplier.service';
import { CommonService } from '../../../core/services/common.service';
@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css'],
})
export class InvoiceDetailComponent implements OnInit {
  id: string;
  invoiceDetail: any;
  payments: any[] = [];
  viewHeight: string = '100vh';
  subGls: any[] = [];
  glArr: any[] = [];
  form: FormGroup;
  loading: boolean;
  bankForm: FormGroup;
  banksArr: SelectItem[] = [];
  showDialog: boolean;
  isChecked: any;
  directDebitBankId: number;
  showPaymentTerms: boolean;
  proposedPaymentTerms: any[] = [];
  supplierBanks: any[] = [];
  supplierId: number;
  supplierBankArr: any[] = [];
  supplierBankId: number;
  currency: any;
  currencies: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private loadingService: LoadingService,
    private subGlService: SubGLService,
    private fb: FormBuilder,
    private router: Router,
    private supplierService: SupplierService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      invoiceId: [''],
      bankGlId: [''],
    });
    this.bankForm = this.fb.group({
      directDebitBankId: [''],
    });
    this.route.queryParams.subscribe((param) => {
      this.id = param.id;
      if (this.id != undefined) {
        this.getInvoiceDetail(this.id).then(() => {
          // this.getSubGls();
        });
      }
    });
    this.getBanks();
    this.getCurrencies();
  }
  getCurrencies() {
    return this.commonService.getAllCurrency().subscribe((data) => {
      this.currencies = data.commonLookups;
    });
  }
  getSupplierBanks(id) {
    this.loadingService.show();
    return this.supplierService.getSupplierBankDetails(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.supplierBanks = data.supplierAccountBankDetails;
        this.supplierBankArr = this.supplierBanks.map((item) => ({
          label: `${item.accountNumber} | ${item.accountName}`,
          value: item.bankAccountDetailId,
        }));
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getBanks() {
    this.loadingService.show();
    return this.subGlService.getBankGls().subscribe(
      (data) => {
        this.loadingService.hide();
        const banks = data.bank;
        this.banksArr = banks.map((item) => ({
          label: item.bankName,
          value: item.bankGlId,
        }));
        // this.showDialog = true;
        //  this.isChecked = false;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getSubGls() {
    this.loadingService.show();
    return this.subGlService.getAllSubGL().subscribe(
      (data) => {
        this.loadingService.hide();
        this.subGls = data.subGls;
        this.glArr = this.subGls.map((item) => ({
          label: `${item.subGLName} | ${item.subGLCode}`,
          value: item.subGLId,
        }));
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  async getInvoiceDetail(id: string) {
    this.loadingService.show();
    await this.purchaseService.getInvoiceDetail(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.invoiceDetail = data.invoices[0];
        this.proposedPaymentTerms = this.invoiceDetail.paymentTerms;
        this.supplierId = this.invoiceDetail.supplierId;
        this.getSupplierBanks(this.invoiceDetail.supplierId);
        // this.payments = data.payments
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  sendForPayment(formObj, index) {
    const payload = formObj;
    payload.invoiceId = parseInt(this.id);
    payload.bankGlId = +payload.bankGlId;
    if (!payload.bankGlId) {
      return swal.fire('Error', 'Select a Gl', 'error');
    }
    // this.loading = true;
    // return this.purchaseService.processPayment(payload).subscribe(res => {
    //   this.loading = false;
    //   const message = res.status.message.friendlyMessage;
    //   if (res.status.isSuccessful) {
    //     swal.fire(`Success`, message, 'success');
    //     formObj.reset();
    //   } else {
    //     swal.fire('Error', message, 'error')
    //   }
    // }, err => {
    //   this.loading = false;
    //   const message = err.status.message.friendlyMessage;
    //   swal.fire('Error', message, 'error')
    // })
  }
  sendToApproval(id: number) {
    const payload = {
      paymentTermId: +id,
      paymentBankId: +this.directDebitBankId,
      supplierBankId: +this.supplierBankId,
      //currency: +this.currency
    };
    debugger;
    if (!payload.paymentBankId) {
      return swal.fire('Error', 'Select Bank to pay from', 'error');
    }
    if (!payload.supplierBankId) {
      return swal.fire('Error', 'Select Supplier Bank', 'error');
    }
    // if (!payload.currency) {
    //   return swal.fire('Error', 'Select Currency', 'error')
    // }
    // return;
    swal
      .fire({
        title: 'Are you sure you want to process payment?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((res) => {
        if (res.value) {
          this.loadingService.show();
          return this.purchaseService.sendPhaseForApproval(payload).subscribe(
            (data) => {
              this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                  this.router.navigate([
                    '/purchases-and-supplier/invoice-lists',
                  ]);
                });
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        }
      });
  }
  saveDirectDebit(bankForm: FormGroup) {}

  displayDialog() {}

  getValue(value: any) {
    debugger;
    this.directDebitBankId = value;
  }

  viewPaymentTerms() {
    this.showPaymentTerms = true;
  }
}
