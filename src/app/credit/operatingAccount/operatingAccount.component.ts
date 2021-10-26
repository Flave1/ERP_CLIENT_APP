import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CurrencyService } from "src/app/core/services/currency.service";
import { SubGLService } from "src/app/core/services/subgl.service";

@Component({
  selector: 'app-operatingAccount',
  templateUrl: './operatingAccount.component.html'
})
export class OperatingAccountComponent implements OnInit {
  checkedinUse: boolean = false;
  form: FormGroup;
  formTitle: string = "Edit Operating Account";
  accountList: any[];
  constructor(
      public fb: FormBuilder,
      private loadingService: LoadingService,
      private currencyService: CurrencyService,
      private router: Router,
      private route: ActivatedRoute,
      private subGLService: SubGLService,
  ) {
      this.form = this.fb.group({
        operatingAccountId: [0],
        operatingAccountName: ["", Validators.required],
          casaGL: [0],
          cashAndBankGL: [0],
          inUse: false,
          initialDeposit: [0]
      });
  }

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.editCurrency();
        this.getAllGLAccount();
      });
  }

  editCurrency() {
      this.formTitle = "Update Operating Account";
      this.loadingService.show();
      this.currencyService.getOperatingAccount().subscribe(data => {
          this.loadingService.hide();
          let row = data.operatingAccount;
          this.form = this.fb.group({
            operatingAccountId: row.operatingAccountId,
            operatingAccountName: row.operatingAccountName,
            casaGL: row.casaGL,
            cashAndBankGL: row.cashAndBankGL,
            inUse: row.inUse,
            initialDeposit: row.initialDeposit,
          });
      }, err => {
        this.loadingService.hide()
      });
  }

  getAllGLAccount() {
    this.loadingService.show();
    this.subGLService.getAllSubGL().subscribe(data => {
      this.loadingService.hide();
        this.accountList = data.subGls;
    }, err => {
      this.loadingService.hide()
    });
}

  submitOperatingAccount(formObj) {
    const payload = formObj.value;
    payload.casaGL = parseInt(payload.casaGL);
    payload.cashAndBankGL = parseInt(payload.cashAndBankGL);
    payload.initialDeposit = parseFloat(payload.initialDeposit);

      this.loadingService.show();
      this.currencyService.updateOperatingAccount(formObj.value).subscribe(
          data => {
              this.loadingService.hide();
              if (data.status.isSuccessful == true) {
                  swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "success");
              } else {
                  swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
              }
          },
          err => {
              this.loadingService.hide();
              swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
          }
      );
  }
}
