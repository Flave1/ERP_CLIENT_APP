import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";

@Component({
    selector: "app-creditriskscorecard",
    templateUrl: "./creditriskscorecard.component.html"
})
export class CreditRiskScoreCardComponent implements OnInit {
    IndustryInformation: any[] = [];
    checkedIsTotalLine: boolean = false;
    form: FormGroup;
    scoreCardForm: FormGroup;
    scoreCardDetails: any[] = [];
    formTitle: string = "Add Credit Risk Score Card";
    amountTitle: string = "";
    attributes: any[] = [];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private creditRiskScoreCardService: CreditRiskScoreCardService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            creditRiskAttributeId: ["", Validators.required],
            customerTypeId: ["", Validators.required]
        });
        this.scoreCardForm = this.fb.group({
            creditRiskScoreCardId: [0],
            value: ["", Validators.required],
            score: ["", Validators.required]
        });
    }

    ngOnInit() {
        this.getAllCreditRiskAttribute();
        this.route.queryParams.subscribe(params => {
            let creditRiskScoreCardId = params["editcreditRiskScoreCard"];
            if (
                creditRiskScoreCardId != null ||
                creditRiskScoreCardId != undefined
            ) {
                this.editCreditRiskScoreCard(creditRiskScoreCardId);
            }
        });
    }
    getAllCreditRiskAttribute() {
        this.creditRiskScoreCardService
            .getAllCreditRiskAttribute()
            .subscribe(data => {
                this.attributes = data.creditRiskAttibutes;
            }, err => {
              this.loadingService.hide()
            });
    }
    onSelectedAttributeChanged(id) {
        this.scoreCardDetails = [];
        this.editCreditRiskScoreCard(id);
    }
    editCreditRiskScoreCard(creditRiskAttributeId) {
        this.formTitle = "Edit Credit Risk Score Card";
        this.loadingService.show();
        this.creditRiskScoreCardService
            .getCreditRiskScoreCard(creditRiskAttributeId)
            .subscribe(data => {
                this.loadingService.hide();
                let listAttribute = [];
                let row = data.creditRiskScoreCard;
                listAttribute = row;
                this.form = this.fb.group({
                    creditRiskAttributeId: row[0].creditRiskAttributeId,
                    customerTypeId: row[0].customerTypeId
                });
                if (listAttribute.length > 0) {
                    listAttribute.forEach(res => {
                        let body = {
                            creditRiskScoreCardId: res.creditRiskScoreCardId,
                            value: res.value,
                            score: res.score
                        };
                        this.scoreCardDetails.push(body);
                    });
                }
            });
    }

    goBack() {
        this.router.navigate(["/credit/creditriskscorecard-list"]);
    }
    submitCreditRiskScoreCardInfo(formObj) {
        if (this.scoreCardDetails.length <= 0) {
          return swal.fire(
                "GOS FINANCIAL",
                "Please add value and score to continue",
                "error"
            );

        }
        let body = [];
        this.scoreCardDetails.forEach(obj => {
            let data = {
                creditRiskScoreCardId: parseInt(obj.creditRiskScoreCardId),
                creditRiskAttributeId: parseInt(formObj.value.creditRiskAttributeId),
                customerTypeId: parseInt(formObj.value.customerTypeId),
                value: obj.value,
                score: parseInt(obj.score)
            };
            body.push(data);
        });
        this.loadingService.show();
        this.creditRiskScoreCardService
            .updateCreditRiskScoreCard(body)
            .subscribe(
                data => {
                    this.loadingService.hide();
                    const message = data.status.message.friendlyMessage;
                    if (data.status.isSuccessful) {
                        swal.fire("GOS FINANCIAL", message, "success");
                        this.router.navigate([
                            "/credit/creditriskscorecard-list"
                        ]);
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

    deleteDetail(row) {
        var index = this.scoreCardDetails.indexOf(row);
        if (index !== -1) {
            this.scoreCardDetails.splice(index, 1);
        }
    }

    addToList(formObj) {
        let obj = formObj.value;
        let detail = {
            creditRiskScoreCardId: 0,
            value: obj.value,
            score: obj.score
        };
        this.scoreCardDetails.push(detail);
        this.scoreCardForm.reset();
    }
}
