import { CustomerService } from "./../../../../core/services/customer.service";
import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { CollateralService } from "src/app/core/services/collateral.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";
import { CurrencyService } from "src/app/core/services/currency.service";
import { LoanCustomerService } from "src/app/core/services/loancustomer.service";

@Component({
  selector: "app-collateral-customer",
  templateUrl: "./collateral-customer.component.html"
})
export class CollateralCustomerComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Customer Collateral";
  collateralTypes: any[] = [];
  customers: any[] = [];
  currencies: any[] = [];

  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private collateralService: CollateralService,
    private currencyService: CurrencyService,
    private loanCustomerService: LoanCustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      collateralCustomerId: [0],
      customerId: ["", Validators.required],
      collateralTypeId: ["", Validators.required],
      currencyId: ["", Validators.required],
      valuationCycle: ["", Validators.required],
      allowSharing: ["", Validators.required],
      collateralValue: ["", Validators.required],
      haircut: ["", Validators.required],
      location: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let collateralCustomerId = params["editcollateralCustomer"];
      if (collateralCustomerId != null || collateralCustomerId != undefined) {
        this.editCollateralCustomer(collateralCustomerId);
      }
    });
    this.loadDropDown();
  }

  loadDropDown() {
    this.collateralService.getAllCollateralType().subscribe(data => {
      this.collateralTypes = data["result"];
    });

    this.loanCustomerService.getAllLoanCustomerLite().subscribe(data => {
      this.customers = data.customerLites;
    });

    this.currencyService.getAllCurrency().subscribe(data => {
      this.currencies = data["result"];
    });
  }

  editCollateralCustomer(collateralCustomerId) {
    this.formTitle = "Edit Customer Collateral";
    this.loadingService.show();
    this.collateralService
      .getCollateralCustomer(collateralCustomerId)
      .subscribe(
        data => {
          this.loadingService.hide();
          let row = data.collateralCustomers[0];
          this.form = this.fb.group({
            collateralCustomerId: [row.collateralCustomerId],
            customerId: [row.customerId, Validators.required],
            collateralTypeId: [row.collateralTypeId, Validators.required],
            currencyId: [row.currencyId, Validators.required],
            valuationCycle: [row.valuationCycle, Validators.required],
            allowSharing: [row.allowSharing, Validators.required],
            collateralValue: [row.collateralValue, Validators.required],
            haircut: [row.haircut, Validators.required],
            location: [row.location, Validators.required]
          });
        },
        err => {
          this.loadingService.hide();
        }
      );
  }

  goBack() {
    this.router.navigate(["/credit/collateral-customer-list"]);
  }

  submitCollateralCustomer(formObj) {
    this.loadingService.show();
    this.collateralService.addUpdateCollateralCustomer(formObj.value).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.router.navigate(["/credit/collateral-customer-list"]);
        } else {
          swal.fire("GOSFINANCIAL", message, "error");
        }
        // if (data["result"] == true) {
        //   swal.fire("GOS FINANCIAL", data["message"], "success");
        //   this.router.navigate(["/credit/collateral-customer-list"]);
        // } else {
        //   swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSFINANCIAL", message, "error");
      }
    );
  }
}
