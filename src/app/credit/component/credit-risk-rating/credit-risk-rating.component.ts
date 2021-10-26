import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-credit-risk-rating",
    templateUrl: "./credit-risk-rating.component.html"
})
export class CreditRiskRatingComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add Credit Risk Rating";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private creditService: CreditRiskScoreCardService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            creditRiskRatingId: [0],
            rate: ["", Validators.required],
            minRange: ["", Validators.required],
            maxRange: ["", Validators.required],
            advicedRange: [""],
            rateDescription: [""]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let creditRatingId = params["editcreditrating"];
            if (creditRatingId != null || creditRatingId != undefined) {
                this.editCreditRating(creditRatingId);
            }
        });
    }

    editCreditRating(creditRatingId) {
        this.formTitle = "Edit Credit Risk Rating";
        this.loadingService.show();
        this.creditService
            .getSingleCreditRating(creditRatingId)
            .subscribe(data => {
                this.loadingService.hide();
                let row = data.creditRiskRating[0];
                this.form = this.fb.group({
                    creditRiskRatingId: [row.creditRiskRatingId],
                    rate: [row.rate, Validators.required],
                    minRange: [row.minRange, Validators.required],
                    maxRange: [row.maxRange, Validators.required],
                    advicedRange: [row.advicedRange],
                    rateDescription: [row.rateDescription]
                });
            }, err => {
              this.loadingService.hide()
            });
    }

    goBack() {
        this.router.navigate(["/credit/credit-risk-rating-list"]);
    }
    submitCreditRating(formObj) {
      const payload = formObj.value;
        if (isNaN(formObj.value.advicedRange)) {
            return swal.fire("GOS FINANCIAL", 'Advised range should be a number', "error");
        }
        if (formObj.value.advicedRange > 1) {
            return swal.fire("GOS FINANCIAL", 'Advised range should be between 0 and 1', "error");
        }
        if (isNaN(formObj.value.minRange)) {
            return swal.fire("GOS FINANCIAL", 'Min range should be a number', "error");
        }
        if (isNaN(formObj.value.maxRange)) {
            return swal.fire("GOS FINANCIAL", 'Max range should be a number', "error");
        }
        if (formObj.value.minRange > 1) {
           return swal.fire("GOS FINANCIAL", 'Min range should be between 0 and 1', "error");
        }
        if (formObj.value.maxRange > 1) {
            return swal.fire("GOS FINANCIAL", 'Max range should be between 0 and 1', "error");
        }
      payload.minRange = parseFloat(payload.minRange);
      payload.maxRange = parseFloat(payload.maxRange);
      payload.advicedRange = parseFloat(payload.advicedRange);
      payload.interestRate = parseFloat(payload.interestRate);
      payload.pd = parseFloat(payload.pd);
        this.loadingService.show();
        this.creditService.addUpdateCreditRating(payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigate(["/credit/credit-risk-rating-list"]);
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
