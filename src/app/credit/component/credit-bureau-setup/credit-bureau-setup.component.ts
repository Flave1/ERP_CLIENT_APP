import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { Router, ActivatedRoute } from "@angular/router";
import { GLService } from "src/app/core/services/gl.service";
import { CommonService } from "../../../core/services/common.service";
import { SubGLService } from "src/app/core/services/subgl.service";

@Component({
  selector: "app-credit-bureau-setup",
  templateUrl: "./credit-bureau-setup.component.html"
})
export class CreditBureauSetupComponent implements OnInit {
  form: FormGroup;
  glAccountList: any[] = [];
  formTitle: string = "Add Credit Bureau";
  glList: any[] = [];
  glArr: any[] = [];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private glService: GLService,
    private subglService: SubGLService,
    private creditService: CreditRiskScoreCardService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      creditBureauId: [0],
      corporateChargeAmount: ["", Validators.required],
      creditBureauName: ["", Validators.required],
      gLAccountId: ["", Validators.required],
      individualChargeAmount: ["", Validators.required],
      isMandatory: [false, Validators.required]
    });
  }

  ngOnInit() {
    this.getAllsubGL();
    this.route.queryParams.subscribe(params => {
      let creditBureauId = params.id;
      if (creditBureauId != null || creditBureauId != undefined) {
        this.editCreditBureau(creditBureauId);
      }
    });
  }
  getAllsubGL() {
    this.loadingService.show();
    this.subglService.getAllSubGL().subscribe(data => {
      this.loadingService.hide();
      this.glList = data.subGls;
      this.glArr = this.glList.map(item => ({
        label: `${item.subGLName} | ${item.subGLCode}`,
        value: item.subGLId
      }));
    }, err => {
      this.loadingService.hide()
    });
  }
  editCreditBureau(creditBureauId) {
    this.formTitle = "Edit Credit Bureau";
    this.loadingService.show();
    this.creditService.getSingleCreditBureau(creditBureauId).subscribe(data => {
      this.loadingService.hide();
      let row = data.creditBureau[0];
      this.form = this.fb.group({
        creditBureauId: [row.creditBureauId],
        corporateChargeAmount: [row.corporateChargeAmount, Validators.required],
        creditBureauName: [row.creditBureauName, Validators.required],
        gLAccountId: [row.glAccountId, Validators.required],
        individualChargeAmount: [
          row.individualChargeAmount,
          Validators.required
        ],
        isMandatory: [row.isMandatory, Validators.required]
      });
    });
  }

  goBack() {
    this.router.navigate(["/credit/credit-bureau-list"]);
  }
  submitCreditBureau(formObj) {
    const payload = formObj.value;
    payload.corporateChargeAmount = parseInt(payload.corporateChargeAmount);
    payload.individualChargeAmount = parseInt(payload.individualChargeAmount);
    this.loadingService.show();
    this.creditService.addUpdateCreditBureau(payload).subscribe(
      data => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        if(data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/credit/credit-bureau-list"]);
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
        // if (data["result"] == true) {
        //     swal.fire("GOS FINANCIAL", data["message"], "success");
        //     this.router.navigate(["/setup/credit-bureau-list"]);
        // } else {
        //     swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
      },
      err => {
        this.loadingService.hide();
        let message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
}
