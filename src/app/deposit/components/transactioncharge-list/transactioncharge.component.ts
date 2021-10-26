import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import {Location} from '@angular/common';

@Component({
  selector: "app-transactioncharge",
  templateUrl: "./transactioncharge.component.html"
})
export class TransactionchargeComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Transaction Charge";
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private DepositAccountService: DepositAccountService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.form = this.fb.group({
      transactionChargeId: [0],
      name: ["", Validators.required],
      fixedOrPercentage: ["", Validators.required],
      amount_Percentage: ["", Validators.required],
      description: [""]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let setupId = params["editTransactionCharge"];
      if (setupId != null || setupId != undefined) {
        this.editTransactionCharge(setupId);
      }
    });
  }

  editTransactionCharge(setupId) {
    this.formTitle = "Edit Transaction Charge";
    this.loadingService.show();
    this.DepositAccountService.getTransactionCharge(setupId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.transactionCharges[0];
        this.form = this.fb.group({
          transactionChargeId: row.transactionChargeId,
          name: row.name,
          fixedOrPercentage: row.fixedOrPercentage,
          amount_Percentage: row.amount_Percentage,
          description: row.description
        });
      }, err => {
        this.loadingService.hide()
      }
    );
  }

  goBack() {
    this.location.back()
  }
  submitTransactionCharge(formObj) {
    this.loadingService.show();
    const payload = formObj.value;
    payload.amount_Percentage = parseFloat(payload.amount_Percentage)
    this.DepositAccountService.updateTransactionCharge(
      payload
    ).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.router.navigate(["/deposit/transactioncharge-list"]);
        } else {
          swal.fire("GOSFINANCIAL", message, "error");
        }
        // if (data["result"] == true) {
        //   swal.fire("GOSFINANCIAL", data["message"], "success");
        //   this.router.navigate(["/deposit/transactioncharge-list"]);
        // } else {
        //   swal.fire("GOSFINANCIAL", data["message"], "error");
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
