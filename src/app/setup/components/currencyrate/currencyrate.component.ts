import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CurrencyRateService } from "src/app/core/services/currencyrate.service";
import { CurrencyService } from "src/app/core/services/currency.service";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-currencyrate",
  templateUrl: "./currencyrate.component.html"
})
export class CurrencyRateComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add CurrencyRate Information";
  currencyList: any[];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private currencyRateService: CurrencyRateService,
    private currencyService: CurrencyService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      currencyRateId: [0],
      currencyId: ["", Validators.required],
      buyingRate: [0],
      sellingRate: [0],
      date: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let currencyRateId = params["editcurrencyRate"];
      if (currencyRateId != null || currencyRateId != undefined) {
        this.editCurrencyRate(currencyRateId);
      }
    });
    this.getAllCurrency();
  }

  getAllCurrency() {
    this.loadingService.show();
    this.commonService.getAllCurrency().subscribe(
      data => {
        this.loadingService.hide();
        this.currencyList = data["commonLookups"];
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  editCurrencyRate(currencyRateId) {
    this.formTitle = "Edit CurrencyRate Information";
    this.loadingService.show();
    this.currencyRateService.getCurrencyRate(currencyRateId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.commonLookups[0];
        this.form = this.fb.group({
          currencyRateId: row.lookupId,
          buyingRate: row.buyingRate,
          sellingRate: row.sellingRate,
          currencyId: row.parentId,
          date: new Date(row.date)
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(["/setup/currencyrate-list"]);
  }
  submitCurrencyRateInfo(formObj) {
    const payload = formObj.value;
    payload.currencyId = parseInt(payload.currencyId);
    payload.buyingRate = parseFloat(payload.buyingRate);
    payload.sellingRate = parseFloat(payload.sellingRate);
    this.loadingService.show();
    this.commonService.updateCurrencyRate(payload).subscribe(
      data => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/setup/currencyrate-list"]);
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        let message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }

  parseValueToInt(value: string) {
    let parsedValue = parseInt(value);
    this.form.patchValue({
      currencyId: parsedValue
    });
  }
}
