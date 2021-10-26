import swal from "sweetalert2";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, Input } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import {ActivatedRoute, Router} from "@angular/router";
import { LoanApplicationService } from "src/app/core/services/loanapplication.service";

@Component({
  selector: "app-application-score-card",
  templateUrl: "./application-score-card.component.html"
})
export class ApplicationScoreCardComponent implements OnInit {
  form: FormGroup;
  initialButton: boolean;
  fields: any[];
  _loanApplicationId: number;
  _customerId: number;
  //customerId: string;
  attributeList: any[] = [];

  get loanApplicationId(): number {
    return this._loanApplicationId;
  }
  get customerId(): number {
    return this._customerId;
  }
  @Input() productId: number;

  @Input() set loanApplicationId(value: number) {
    this._loanApplicationId = value;
    if (value > 0) this.getApplicationAttribute(value);
  }
  @Input() set customerId(value: number) {
    this._customerId = value;
  }
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private creditScoreCardService: CreditRiskScoreCardService,
    private loanApplicationService: LoanApplicationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.route.queryParams.subscribe(param => {
    //   this.customerId = param.customerId
    // });
    this.getApplicationAttribute(this._loanApplicationId);
  }

  getApplicationAttribute(loanApplicationId) {
    this.creditScoreCardService
      .getApplicationAttribute(loanApplicationId)
      .subscribe(
        data => {
          this.fields = data.applicationCreditRiskAttibute;
          if (this.fields != undefined) {
            let exist = this.fields.filter(x => x.fieldValue != null);
            if (exist != undefined && exist.length > 0) {
              exist.forEach(obj => {
                let data = {
                  attributeField: obj.fieldName,
                  score: obj.fieldValue
                };
                this.attributeList.push(data);
              });
            }
          }

          this.createControl();
        });
  }

  createControl() {
    const group = this.fb.group({
      loanApplicationId: [this.loanApplicationId],
      customerId: [this.customerId],
      productId: [this.productId],
      attributeList: [[]]
    });
    if (this.fields != undefined) {
      this.fields.forEach(field => {
        const control = this.fb.control(String(field.fieldValue), Validators.required);
        group.addControl(field.fieldName, control);
      });
    }
    this.form = group;
  }
  onSelectionChanged(fieldName, score) {
    let obj = { attributeField: fieldName, score: parseInt(score) };
    let exist = this.attributeList.find(x => x.attributeField == fieldName);
    if (exist == null) {
      this.attributeList.push(obj);
    } else {
      let index = this.attributeList.indexOf(exist);
      this.attributeList.splice(index, 1);
      this.attributeList.push(obj);
    }
  }
  goBack() {
    this.router.navigate(["/credit/application-list"]);
}

  submitForm(formObj) {
    this.form.get("attributeList").setValue(this.attributeList);
    const payload = formObj.value;
    const count = this.fields.length;
    payload.customerId = 0;
    payload.productId = 0;
    // this.loadingService.show();
    this.initialButton = true;
    this.creditScoreCardService
      .addUpdateCreditRiskApplicationScoreCard(payload)
      .subscribe(
        data => {
          const message = data.status.message.friendlyMessage;

          if (data.status.isSuccessful) {
            if (data.isDone == 2) {
              this.initialButton = false;
              return swal.fire("GOS FINANCIAL", message, "error");
            }
            this.loadingService.show();
            //swal.fire("GOS FINANCIAL", message, "success");
            this.loanApplicationService.SubmitForApproval(this.loanApplicationId)
            .subscribe(res => {
              this.initialButton = false;
                if (res.responseId == 1) {
                  this.loadingService.hide();
                  swal.fire("GOS FINANCIAL", res.status.message.friendlyMessage, "success");
                    this.router.navigate([
                        "/credit/application-list"
                    ]);
                } else if (res.responseId == 0) {
                    swal.fire("GOS FINANCIAL", res.status.message.friendlyMessage, "error");
                } else if (res.responseId == 4) {
                  this.loadingService.hide();
                    this.router.navigate(["/credit/loan-collateral"], {
                        queryParams: {
                            loanapp: this.loanApplicationId,
                            obligor: this.customerId,
                            loanman: ``
                        }
                    });
                    swal.fire(
                      "GOS FINANCIAL",
                      res.status.message.friendlyMessage,
                      "success"
                  );
                } else {
                    swal.fire(
                        "GOS FINANCIAL",
                        data.status.message.friendlyMessage,
                        "error"
                    );
                }
            });
          } else {
            //swal.fire("GOS FINANCIAL", message, "success");
            // this.loadingService.show();
            this.initialButton = false
            this.loanApplicationService.SubmitForApproval(this.loanApplicationId)
            .subscribe(res => {
                if (res.responseId == 1) {
                  this.loadingService.hide();
                  swal.fire("GOS FINANCIAL", res.status.message.friendlyMessage, "success");
                    this.router.navigate([
                        "/credit/application-list"
                    ]);
                } else if (res.responseId == 0) {
                    swal.fire("GOS FINANCIAL", res.status.message.friendlyMessage, "error");
                } else if (res.responseId == 4) {
                  this.loadingService.hide();
                    this.router.navigate(["/credit/loan-collateral"], {
                        queryParams: {
                            loanapp: this.loanApplicationId,
                            obligor: this.customerId,
                            loanman: ``
                        }
                    });
                    swal.fire(
                      "GOS FINANCIAL",
                      res.status.message.friendlyMessage,
                      "success"
                  );
                } else {
                    swal.fire(
                        "GOS FINANCIAL",
                        data.status.message.friendlyMessage,
                        "error"
                    );
                }
            }, err => {
              this.initialButton = false;
            });
          }
          this.loadingService.hide();
        },
        err => {
          // this.loadingService.hide();
          this.initialButton = false
          const message = err.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "error");
        }
      );
  }
}
