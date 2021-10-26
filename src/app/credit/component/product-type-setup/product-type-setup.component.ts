import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { LoadingService } from "../../../core/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import swal from "sweetalert2";
import { ProductService } from "../../../core/services/product.service";
import {Location} from "@angular/common";

@Component({
  selector: "app-product-type-setup",
  templateUrl: "./product-type-setup.component.html",
  styleUrls: ["./product-type-setup.component.css"]
})
export class ProductTypeSetupComponent implements OnInit {
  form: FormGroup;
  formTitle = "Create Product Type";
  companyId: any = JSON.parse(localStorage.getItem("userDetails")).companyId;
  productTypeId: any;
  constructor(
    public fb: FormBuilder,
    private investorFundService: InvestorFundService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location
  ) {
    this.form = this.fb.group({
      productTypeId: 0,
      productTypeName: ["", Validators.required],
      // requirePrincipalGL: [false, Validators.required],
      // requireInterestIncomeExpenseGL: [false, Validators.required],
      // requireInterestReceivablePayableGL: [false, Validators.required],
      companyid: this.companyId
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.productTypeId = params["editProductTypeId"];
      if (this.productTypeId != null || this.productTypeId != undefined) {
        this.editProductType(this.productTypeId);
      }
    });
  }

  submitProductInfo(form: any) {
    const payload = form.value;
    if (!payload.productTypeName) {
      return swal.fire("GOS FINANCIALS", "Name is required", "error");
    }
    this.loadingService.show();
    return this.productService.addUpdateProductType(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.router.navigateByUrl(`/credit/product-type-list`);
        } else {
          swal.fire("GOSFINANCIAL", message, "error");
        }
        // if (res.result) {
        //     swal.fire('GOS FINANCIALS', res.message, 'success');
        //     this.router.navigateByUrl(`/credit/product-type-list`)
        // } else {
        //     return swal.fire('GOS FINANCIALS', res.message, 'error')
        // }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSFINANCIAL", message, "error");
      }
    );
  }

  editProductType(productTypeId: any) {
    this.formTitle = "Edit Product Type Information";
    this.loadingService.show();
    this.productService.getProductType(productTypeId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.productType[0];
        this.form = this.fb.group({
          productTypeId: row.productTypeId,
          productTypeName: [row.productTypeName],
          // requirePrincipalGL: [row.requirePrincipalGL],
          // requireInterestIncomeExpenseGL: [row.requireInterestIncomeExpenseGL],
          // requireInterestReceivablePayableGL: [row.requireInterestReceivablePayableGL],
          companyId: row.companyId
        });
        this.productTypeId = row.productTypeId;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  back() {
    this.location.back()
  }
}
