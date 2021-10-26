import swal from "sweetalert2";
import { CreditRiskScoreCardService } from "./../../../core/services/creditriskscorecard";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-credit-risk-category",
    templateUrl: "./credit-risk-category.component.html"
})
export class CreditRiskCategoryComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add Credit Category";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private creditService: CreditRiskScoreCardService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            categoryId: [0],
            categoryName: ["", Validators.required],
            description: [""],
            useInOrigination: [true]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let categoryId = params.id;
            if (categoryId != null || categoryId != undefined) {
                this.editCategory(categoryId);
            }
        });
    }

    editCategory(categoryId) {
        this.formTitle = "Edit Credit Risk Category";
        this.loadingService.show();
        this.creditService
            .getSingleCreditRiskCategory(categoryId)
            .subscribe(data => {
                this.loadingService.hide();
                let row = data.creditRiskCategory[0];
                this.form = this.fb.group({
                    categoryId: row.categoryId,
                    categoryName: row.categoryName,
                    description: row.description,
                    useInOrigination: row.useInOrigination
                });
            }, err => {
              this.loadingService.hide()
            });
    }

    goBack() {
        this.router.navigate(["/credit/category-list"]);
    }
    submitCategory(formObj) {
        this.loadingService.show();
        this.creditService.addUpdateCreditRiskCategory(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigate(["/credit/category-list"]);
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
