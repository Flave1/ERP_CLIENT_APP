import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-credit-risk-attribute",
    templateUrl: "./credit-risk-attribute.component.html"
})
export class CreditRiskAttributeComponent implements OnInit {
    form: FormGroup;
    categories: any[] = [];
    system: any[] = [];
    formTitle: string = "Add Credit Risk Attribute";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private creditService: CreditRiskScoreCardService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            creditRiskAttributeId: [0],
            creditRiskCategoryId: ["", Validators.required],
            creditRiskAttribute: ["", Validators.required],
            systemAttribute: ["", Validators.required]
        });
    }

    ngOnInit() {
        this.getAllSystemCreditRiskAttribute();
        this.getAllCreditRiskCategory();

        this.route.queryParams.subscribe(params => {
            let attributeId = params.id;
            if (attributeId != null || attributeId != undefined) {
                this.editAttribute(attributeId);
            }
        });
    }
    getAllCreditRiskCategory() {
        this.creditService.getAllCreditRiskCategory().subscribe(data => {
            this.categories = data.creditRiskCategory;
        });
    }

    getAllSystemCreditRiskAttribute() {
        this.creditService.getAllSystemCreditRiskAttribute().subscribe(data => {
            this.system = data.systemAttibutes;
        });
    }

    editAttribute(attributeId) {
        this.formTitle = "Edit Credit Risk Attribute";
        this.loadingService.show();
        this.creditService
            .getSingleCreditRiskAttribute(attributeId)
            .subscribe(data => {
                this.loadingService.hide();
                let row = data.creditRiskAttibutes[0];
                this.form = this.fb.group({
                    creditRiskAttributeId: [row.creditRiskAttributeId],
                    creditRiskCategoryId: [
                        row.creditRiskCategoryId
                    ],
                    creditRiskAttribute: [
                        row.creditRiskAttribute
                    ],
                    systemAttribute: [
                        row.systemAttribute
                    ],
                });
            });
    }

    goBack() {
        this.router.navigate(["/credit/attribute-list"]);
    }
    submitAttribute(formObj) {
      const payload = formObj.value;
      payload.creditRiskCategoryId = parseInt(payload.creditRiskCategoryId);
      // payload.systemAttribute = parseInt(payload.systemAttribute)
        this.loadingService.show();
        this.creditService
            .addUpdateCreditRiskAttribute(formObj.value)
            .subscribe(
                data => {
                    this.loadingService.hide();
                    const message = data.status.message.friendlyMessage;
                    if (data.status.isSuccessful) {
                        swal.fire("GOS FINANCIAL", message, "success");
                        this.router.navigate(["/credit/attribute-list"]);
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
