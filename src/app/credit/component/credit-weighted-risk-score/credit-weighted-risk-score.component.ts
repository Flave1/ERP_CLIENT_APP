import { ProductService } from "./../../../core/services/product.service";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-credit-weighted-risk-score",
  templateUrl: "./credit-weighted-risk-score.component.html"
})
export class CreditWeightedRiskScoreComponent implements OnInit {
  form: FormGroup;
  weightedScoreCardForm: FormGroup;
  weightedScoreDetails: any[] = [];
  formTitle: string = "Add Weighted Risk Score";
  attributes: any[] = [];
  products: any[] = [];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private creditService: CreditRiskScoreCardService,
    private creditRiskScoreCardService: CreditRiskScoreCardService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      productId: ["", Validators.required],
      productMaxWeight: ["", Validators.required]
    });
    this.weightedScoreCardForm = this.fb.group({
      weightedRiskScoreId: [0],
      creditRiskAttributeId: ["", Validators.required],
      weightedScore: ["", Validators.required],
      useAtOrigination: [true, Validators.required]
    });
  }

  ngOnInit() {
    this.getAllCreditRiskAttribute();
    this.getProductLite();
    this.route.queryParams.subscribe(params => {
      let weightedRiskScoreId = params["editweightedscore"];
      if (weightedRiskScoreId != null || weightedRiskScoreId != undefined) {
        this.editWeightedRiskScore(weightedRiskScoreId);
      }
    });
  }
  getAllCreditRiskAttribute() {
    this.creditRiskScoreCardService
      .getAllCreditRiskAttribute()
      .subscribe(data => {
        this.attributes = data.creditRiskAttibutes;
      });
  }
  getProductLite() {
    this.productService.getAllProduct().subscribe(data => {
      this.products = data.products;
    });
  }
  editWeightedRiskScore(weightedRiskScoreId) {
    this.formTitle = "Edit Weighted Risk Score";
    this.loadingService.show();
    this.creditService
      .getSingleWeightedRiskScore(weightedRiskScoreId)
      .subscribe(
        data => {
          this.loadingService.hide();
          let listAttribute = [];
          let row = data.creditWeightedRiskScore;
          listAttribute = row;
          if (row != undefined) {
            this.form = this.fb.group({
              productId: row[0].productId,
              productMaxWeight: row[0].productMaxWeight
            });
          }
          if (listAttribute.length > 0) {
            listAttribute.forEach(res => {
              let body = {
                weightedRiskScoreId: res.weightedRiskScoreId,
                weightedScore: res.weightedScore,
                creditRiskAttributeId: res.creditRiskAttributeId,
                useAtOrigination: res.useAtOrigination
              };
              this.weightedScoreDetails.push(body);
            });
          }
        },
        err => {
          this.loadingService.hide();
        }
      );
  }

  goBack() {
    this.router.navigate(["/credit/weighted-risk-score-list"]);
  }
  submitWeightedRiskScore(formObj) {
    if (this.weightedScoreDetails.length <= 0) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please add attribute and score to continue",
        "error"
      );
    }
    let body = [];
    this.weightedScoreDetails.forEach(obj => {
      let data = {
        weightedRiskScoreId: parseInt(obj.weightedRiskScoreId),
        weightedScore: parseInt(obj.weightedScore),
        creditRiskAttributeId: parseInt(obj.creditRiskAttributeId),
        productId: parseInt(formObj.value.productId),
        productMaxWeight: parseInt(formObj.value.productMaxWeight),
        useAtOrigination: obj.useAtOrigination
      };
      body.push(data);
    });
    this.loadingService.show();
    this.creditService.addUpdateWeightedRiskScore(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/credit/weighted-risk-score-list"]);
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
    const index = this.weightedScoreDetails.indexOf(row);
    if (index !== -1) {
      this.weightedScoreDetails.splice(index, 1);
    }
  }
  addToList(formObj) {
    let obj = formObj.value;

    let scoresum = obj.weightedScore;
    this.weightedScoreDetails.forEach(obj => {
      scoresum = scoresum + obj.weightedScore;
    });
    const maxScore = this.form.get("productMaxWeight").value;

    if (maxScore == "" || maxScore == undefined) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select a product that has weighted Score",
        "info"
      );
      return;
    }
    if (scoresum > maxScore) {
      swal.fire(
        "GOS FINANCIAL",
        "Total weighted score cannot be greater then product weight",
        "error"
      );
      return;
    }
    var exist = this.weightedScoreDetails.find(
      x => x.creditRiskAttributeId == obj.creditRiskAttributeId
    );
    if (exist == null) {
      let detail = {
        weightedRiskScoreId: 0,
        weightedScore: obj.weightedScore,
        creditRiskAttributeId: obj.creditRiskAttributeId,
        useAtOrigination: obj.useAtOrigination
      };
      this.weightedScoreDetails.push(detail);
      this.weightedScoreCardForm.reset();
    } else {
      swal.fire(
        "GOS FINANCIAL",
        "Selected attribute is already added",
        "error"
      );
    }
  }
  onSelectedProductChanged(productId) {
    if (productId != undefined) {
      let maxWeight = this.products.find(x => x.productId == productId)
        .weightedMaxScore;
      this.form.get("productMaxWeight").setValue(maxWeight);
    }
  }
  getAttributeName(id) {
    return this.attributes.find(x => x.creditRiskAttributeId == id)
      .creditRiskAttribute;
  }
}
