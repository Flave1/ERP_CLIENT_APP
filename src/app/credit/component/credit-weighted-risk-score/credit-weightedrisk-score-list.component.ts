import { Component, OnInit, Input } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ProductService } from "src/app/core/services/product.service";

@Component({
  selector: "app-credit-weightedrisk-score-list",
  templateUrl: "./credit-weightedrisk-score-list.component.html"
})
export class CreditWeightedriskScoreListComponent implements OnInit {
  weightedRiskScores: any[] = [];
  selectedWeightedRiskScore: any[];
  _productId: number;
  filteredAttribute: any[] = [];
  get productId(): number {
    return this._productId;
  }
  form: FormGroup;
  weightedScoreCardForm: FormGroup;
  weightedScoreDetails: any[] = [];
  formTitle: string = "Add Weighted Risk Score";
  attributes: any[] = [];
  products: any[] = [];
  displayWeightedRiskScore: boolean = false;
  maxWeight: number = 0;
  scoresum: any;
  maxScore: any;
  totalWeightScore: number;
  @Input() set productId(value: number) {
    this._productId = value;
    if (value > 0) {
      this.getProductWeightedRiskScores(value);
    }
  }
  _weightedRisk: number;
  viewHeight: any = "600px";
  get weightedRisk(): number {
    return this._weightedRisk;
  }
  @Input() set weightedRisk(value: number) {
    this._weightedRisk = value;
    if (value > 0) this.setWeightedRiskScoreValue(value);
  }
  productMaxWeight: any;
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
      productMaxWeight: [this.weightedRisk, Validators.required],
      customerTypeId: ["", Validators.required]
    });
    this.weightedScoreCardForm = this.fb.group({
      weightedRiskScoreId: [0],
      creditRiskAttributeId: ["", Validators.required],
      weightedScore: ["", Validators.required],
      useAtOrigination: [true, Validators.required]
    });
  }

  ngOnInit() {
    this.initializeDetailsControl();
    this.getAllMappedCreditRiskAttribute();
    this.getProductLite(false);
  }
  initializeDetailsControl() {
    this.weightedScoreCardForm = this.fb.group({
      weightedRiskScoreId: [0],
      creditRiskAttributeId: ["", Validators.required],
      weightedScore: ["", Validators.required],
      useAtOrigination: [true, Validators.required]
    });
  }
  showAddNew() {
    if (this.productId > 0) {
      this.getProductLite(true);
      this.editWeightedScore(this.productId);
    }
  }
  setWeightedRiskScoreValue(value) {
    this.form.get("productMaxWeight").setValue(value);
  }

  getProductWeightedRiskScores(productId) {
    this.loadingService.show();
    this.creditService.getSingleWeightedRiskScore(productId).subscribe(
      data => {
        this.loadingService.hide();
        this.weightedRiskScores = data.creditWeightedRiskScore;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editWeightedScore(productId) {
    this.formTitle = "Edit Weighted Risk Score";
    this.loadingService.show();
    this.creditService.getSingleWeightedRiskScore(productId).subscribe(
      data => {
        this.loadingService.hide();
        let listAttribute = [];
        let row = data.creditWeightedRiskScore;
        listAttribute = row;
        let initialValue = 0;
        this.totalWeightScore = row.reduce(function (total, currentValue) {
          return total + currentValue.weightedScore;
        }, initialValue);
        this.form = this.fb.group({
          productId: row[0].productId,
          productMaxWeight: this.weightedRisk,
          customerTypeId: row[0].customerTypeId
        });
        let customerTypeId = row.customerTypeId;
        // this.onCustomerTypeChanged(customerTypeId);
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
    this.displayWeightedRiskScore = true;
  }

  rowClicked(row: any): void {

  }

  deleteWeightedScore(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.creditService
            .deleteWeightedRiskScore(row.weightedRiskScoreId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getProductWeightedRiskScores(this._productId);
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  getAllMappedCreditRiskAttribute() {
    this.creditRiskScoreCardService
      .getAllMappedCreditRiskAttribute()
      .subscribe(data => {
        this.attributes = data.mappedAttibutes;
      }, err => {
        this.loadingService.hide()
      });
  }
  getProductLite(isAddNew) {
    this.productService.getAllProduct().subscribe(data => {
      this.products = data.products;
      if (isAddNew == true) {
        this.maxWeight = +this.products.find(x => x.productId == this.productId)
          .weightedMaxScore;
        this.form = this.fb.group({
          productId: this.productId,
          productMaxWeight: this.maxWeight,
          customerTypeId: [""]
        });
      }
    });
  }

  goBack() {
    this.displayWeightedRiskScore = false;
    this.ngOnInit();
  }
  submitWeightedRiskScore(formObj) {
    if (this.weightedScoreDetails.length <= 0) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please add attribute and score to continue",
        "error"
      );
    }
    if (this.scoresum != this.maxScore) {
      swal.fire(
        "GOS FINANCIAL",
        "Total weighted score must be equal to product weight",
        "error"
      );
      this.loadingService.hide();
      return;
    }

    if (
      formObj.value.customerTypeId == null ||
      formObj.value.customerTypeId == undefined ||
      formObj.value.customerTypeId == ""
    ) {
      swal.fire("GOS FINANCIAL", "Please select Customer Type", "error");
      this.loadingService.hide();
      return;
    }
    let body = [];
    this.weightedScoreDetails.forEach(obj => {
      let data = {
        weightedRiskScoreId: parseInt(obj.weightedRiskScoreId),
        weightedScore: parseInt(obj.weightedScore),
        creditRiskAttributeId: parseInt(obj.creditRiskAttributeId),
        productId: parseInt(formObj.value.productId),
        productMaxWeight: parseInt(formObj.value.productMaxWeight),
        customerTypeId: parseInt(formObj.value.customerTypeId),
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
          this.displayWeightedRiskScore = false;
          this.weightedScoreDetails = [];
          this.getProductWeightedRiskScores(this.productId);
          swal.fire("GOS FINANCIAL", message, "success");
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
    var index = this.weightedScoreDetails.indexOf(row);
    if (index !== -1) {
      this.weightedScoreDetails.splice(index, 1);
      this.scoresum = this.scoresum - row.weightedScore;
    }
  }
  addToList(formObj) {
    let obj = formObj.value;

    let scoresum = obj.weightedScore;
    this.scoresum = obj.weightedScore;
    this.weightedScoreDetails.forEach(obj => {
      scoresum = scoresum + obj.weightedScore;
      this.scoresum = this.scoresum + obj.weightedScore;
    });
    const maxScore = this.form.get("productMaxWeight").value;
    this.maxScore = this.form.get("productMaxWeight").value;

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
        "Total weighted score cannot be greater than product weight",
        "error"
      );
      return;
    }

    // if (scoresum < maxScore) {
    //     swal.fire(
    //         "GOS FINANCIAL",
    //         "Total weighted score cannot be less then product weight",
    //         "error"
    //     );
    //     return;
    // }
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
      this.initializeDetailsControl();
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
    if (this.attributes != undefined) {
      return this.attributes.find(x => x.creditRiskAttributeId == id)
        .creditRiskAttribute;
    }
  }
  onCustomerTypeChanged(value) {
    /// this.filteredAttribute = [];
   if (this.attributes != null) {
     this.filteredAttribute = this.attributes.filter(
       x => x.customerTypeId == value
     );
   }
    this.weightedRiskScoreByCustomerType(this.productId, value);
  }

  weightedRiskScoreByCustomerType(productId, customerTypeId) {
    this.formTitle = "Edit Weighted Risk Score";
    this.loadingService.show();
    this.creditService
      .getWeightedRiskScoreByCustomerType(productId, customerTypeId)
      .subscribe(data => {
        this.loadingService.hide();
        let listAttribute = [];
        let row = data.creditWeightedRiskScore;
        this.weightedScoreDetails = [];
        listAttribute = row;
        this.form = this.fb.group({
          productId: row[0].productId,
          productMaxWeight: this.weightedRisk,
          customerTypeId: customerTypeId
        });
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
      }, err => {
        this.loadingService.hide()
      });
  }
}
