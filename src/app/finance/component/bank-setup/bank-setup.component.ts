import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Location } from "@angular/common";
import { SubGLService } from "../../../core/services/subgl.service";
import { LoadingService } from "../../../core/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import swal from "sweetalert2";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-bank-setup",
  templateUrl: "./bank-setup.component.html",
  styleUrls: ["./bank-setup.component.css"]
})
export class BankSetupComponent implements OnInit {
  formTitle: string = "Bank Setup";
  form: FormGroup;
  countryArr: SelectItem[] = [];
  currencyArr: SelectItem[] = [];
  subGlArr: SelectItem[] = [];

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private subGlService: SubGLService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      const id = param.id;
      if (id !== undefined) {
        this.getBankSetup(id);
      }
    });
    this.form = this.fb.group({
      bankGlId: [0],
      bankName: [""],
      address: [""],
      accountNumber: [""],
      bvn: [""],
      countryId: [""],
      currencyId: [""],
      subGl: [""],
      bankCode: ['']
    });
    this.loadDropDown();
  }
  loadDropDown() {
    this.getCountries();
    this.getCurrencies();
    this.getSubGls();
  }
  getCountries() {
    this.loadingService.show();
    return this.commonService.getAllCountry().subscribe(
      data => {
        this.loadingService.hide();
        const countries: any[] = data.commonLookups;
        this.countryArr = countries.map(item => ({
          label: item.lookupName,
          value: item.lookupId
        }));
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getCurrencies() {
    return this.commonService.getAllCurrency().subscribe(data => {
      const currencies: any[] = data.commonLookups;
      this.currencyArr = currencies.map(item => ({
        label: item.lookupName,
        value: item.lookupId
      }));
    });
  }
  getSubGls() {
    this.loadingService.show();
    return this.subGlService.getAllSubGL().subscribe(
      data => {
        this.loadingService.hide();
        const glList: any[] = data.subGls;
        this.subGlArr = glList.map(item => ({
          label: `${item.subGLName} | ${item.subGLCode}`,
          value: item.subGLId
        }));
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getBankSetup(id: number) {
    this.loadingService.show();
    return this.subGlService.getBankGl(id).subscribe(
      res => {
        this.loadingService.hide();
        const row = res.bank[0];
        this.form = this.fb.group({
          bankGlId: row.bankGlId,
          bankName: row.bankName,
          address: row.address,
          accountNumber: row.accountNumber,
          bvn: row.bvn,
          countryId: row.countryId,
          currencyId: row.currencyId,
          subGl: row.subGl,
          bankCode: row.bankCode
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  addBank(form: FormGroup) {
    const payload = form.value;
    payload.countryId = +payload.countryId;
    payload.currencyId = +payload.currencyId;
    payload.subGl = +payload.subGl;
    if (isNaN(payload.accountNumber)) {
      return swal.fire("GOS FINANCIAL", "Account number can only be digits", "error");
    }
    if (payload.accountNumber.length < 10 || payload.accountNumber.length > 10) {
      return swal.fire(
        "GOS FINANCIAL",
        "Only 10 digits allowed for account number",
        "error"
      );
    }
    if (isNaN(payload.bvn)) {
      return swal.fire("GOS FINANCIAL", "BVN can only be digits", "error");
    }
    if (payload.bvn.length < 11 || payload.bvn.length > 11) {
      return swal.fire(
        "GOS FINANCIAL",
        "Only 11 digits allowed for BVN number",
        "error"
      );
    }
    this.loadingService.show();
    return this.subGlService.updateBankGl(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success").then(() => {
            this.router.navigate(["/finance/banks"]);
          });
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

  goBack() {
    this.location.back();
  }
}
