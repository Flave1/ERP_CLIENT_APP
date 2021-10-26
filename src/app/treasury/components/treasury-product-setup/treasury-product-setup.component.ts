import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { LoadingService } from "../../../core/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import swal from "sweetalert2";
import { TreasuryService } from "../../../core/services/treasury.service";

@Component({
  selector: "app-treasury-product-setup",
  templateUrl: "./treasury-product-setup.component.html",
  styleUrls: ["./treasury-product-setup.component.css"]
})
export class TreasuryProductSetupComponent implements OnInit {
  form: FormGroup;
  formTitle = "Create Product Type";
  companyId: any = JSON.parse(localStorage.getItem("userDetails")).companyId;
  productTypeId: any;
  constructor(
    public fb: FormBuilder,
    private treasuryService: TreasuryService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      productTypeId: 0,
      name: ["", Validators.required],
      description: ["", Validators.required],
      companyId: this.companyId,
      type: [""]
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
    if (!payload.name) {
      return swal.fire("GOS FINANCIALS", "Name is required", "error");
    }
    if (!payload.description) {
      return swal.fire("GOS FINANCIALS", "Description is required", "error");
    }
    if (!payload.type) {
      return swal.fire("GOS FINANCIALS", "Select treasury type", "error");
    }
    this.loadingService.show();
    return this.treasuryService.updateProductType(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigateByUrl(`/treasury/product-type`);
        } else {
          return swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }

  editProductType(productTypeId: any) {
    this.formTitle = "Edit Product Type Information";
    this.loadingService.show();
    this.treasuryService.getProductType(productTypeId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.productTypes[0];
        this.form = this.fb.group({
          productTypeId: row.productTypeId,
          name: [row.name],
          type: [row.type],
          description: [row.description],
          companyId: row.companyId
        });
        this.productTypeId = row.productTypeId;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
}
