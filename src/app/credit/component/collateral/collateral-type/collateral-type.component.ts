import { CollateralService } from "src/app/core/services/collateral.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-collateral-type",
  templateUrl: "./collateral-type.component.html"
})
export class CollateralTypeComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Collateral Type";
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private collateralService: CollateralService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      collateralTypeId: [0],
      name: ["", Validators.required],
      details: [""],
      requireInsurancePolicy: [false],
      hairCut: [0, Validators.required],
      valuationCycle: [0, Validators.required],
      allowSharing: [false]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let collateralTypeId = params["editcollateraltype"];
      if (collateralTypeId != null || collateralTypeId != undefined) {
        this.editCollateralType(collateralTypeId);
      }
    });
  }

  editCollateralType(collateralTypeId) {
    this.formTitle = "Edit Collateral Type";
    this.loadingService.show();
    this.collateralService.getCollateralType(collateralTypeId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.collateralTypes[0];
        this.form = this.fb.group({
          collateralTypeId: [row.collateralTypeId],
          name: [row.name, Validators.required],
          details: [row.details],
          requireInsurancePolicy: [row.requireInsurancePolicy],
          hairCut: [row.hairCut, Validators.required],
          valuationCycle: [row.valuationCycle, Validators.required],
          allowSharing: [row.allowSharing]
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(["/credit/collateral-type-list"]);
  }
  submitCollateralType(formObj) {
    const payload = formObj.value;
    payload.collateralTypeId = parseInt(payload.collateralTypeId);
    this.loadingService.show();
    this.collateralService.addUpdateCollateralType(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.router.navigate(["/credit/collateral-type-list"]);
        } else {
          swal.fire("GOSFINANCIAL", message, "error");
        }
        // if (data["result"] == true) {
        //     swal.fire("GOS FINANCIAL", data["message"], "success");
        //     this.router.navigate(["/credit/collateral-type-list"]);
        // } else {
        //     swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSFINANCIAL", message, "error");
      }
    );
  }
}
