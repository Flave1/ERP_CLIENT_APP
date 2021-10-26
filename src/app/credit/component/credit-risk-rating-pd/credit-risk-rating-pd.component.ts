import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { Router, ActivatedRoute } from "@angular/router";
import {ProductService} from '../../../core/services/product.service';


@Component({
    selector: "app-credit-risk-rating-pd",
    templateUrl: "./credit-risk-rating-pd.component.html"
})
export class CreditRiskRatingPDComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add Credit Risk Rating PD";
  productsArr:any[]= [];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private creditService: CreditRiskScoreCardService,
        private router: Router,
        private route: ActivatedRoute,
        private productService: ProductService
    ) {
        this.form = this.fb.group({
            creditRiskRatingPDId: [0],
            pd: ["", Validators.required],
            minRange: ["", Validators.required],
            maxRange: ["", Validators.required],
            advicedRange: [""],
            description: [""],
          productId: [""],
          interestRate: [""]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let creditRatingId = params["editcreditrating"];
            if (creditRatingId != null || creditRatingId != undefined) {
                this.editCreditRating(creditRatingId);
            }
        });
        this.getProducts()
    }
  getProducts() {
      return this.productService.getAllProduct().subscribe(data => {
        this.productsArr = data.products;
      }, err => {
      })
  }
    editCreditRating(creditRatingId) {
        this.formTitle = "Edit Credit Risk Rating PD";
        this.loadingService.show();
        this.creditService
            .getSingleCreditRatingPD(creditRatingId)
            .subscribe(data => {
                this.loadingService.hide();
                let row = data.creditRiskRatingPD[0];
                this.form = this.fb.group({
                    creditRiskRatingPDId: [row.creditRiskRatingPDId],
                    pd: [row.pd, Validators.required],
                    minRange: [row.minRange, Validators.required],
                    maxRange: [row.maxRange, Validators.required],
                    description: [row.description],
                  productId: [row.productId],
                  interestRate: [row.interestRate]
                });
            });
    }

    goBack() {
        this.router.navigate(["/credit/credit-risk-rating-pd-list"]);
    }
    submitCreditRating(formObj) {
      const payload = formObj.value;
      payload.minRange = parseFloat(payload.minRange);
      payload.maxRange = parseFloat(payload.maxRange);
      payload.interestRate = parseFloat(payload.interestRate);
      payload.productId = parseInt(payload.productId);
      payload.pd = parseInt(payload.pd);
      if (!payload.productId) {
        return swal.fire('GOS FINANCIAL', 'Select Product', 'error')
      }
        this.loadingService.show();
        this.creditService.addUpdateCreditRatingPD(payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigate(["/credit/credit-risk-rating-pd-list"]);
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
}
