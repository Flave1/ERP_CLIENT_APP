import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";

@Component({
  selector: "app-transactiontax",
  templateUrl: "./transactiontax.component.html"
})
export class TransactiontaxComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Transaction Tax";
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private DepositAccountService: DepositAccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      transactionTaxId: [0],
      name: ["", Validators.required],
      fixedOrPercentage: ["", Validators.required],
      amount_Percentage: ["", Validators.required],
      description: [""]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let setupId = params["editTransactionTax"];
      if (setupId != null || setupId != undefined) {
        this.editTransactiontax(setupId);
      }
    });
  }

  editTransactiontax(setupId) {
    this.formTitle = "Edit Transaction tax";
    this.loadingService.show();
    this.DepositAccountService.getTransactiontax(setupId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.transactionTaxes[0];
        this.form = this.fb.group({
          transactionTaxId: row.transactionTaxId,
          name: row.name,
          fixedOrPercentage: row.fixedOrPercentage,
          amount_Percentage: row.amount_Percentage,
          description: row.description
        });
      },
      error => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(["/deposit/transactiontax-list"]);
  }
  submitTransactiontax(formObj) {
    const payload = formObj.value;
    payload.amount_Percentage = parseFloat(payload.amount_Percentage);
    this.loadingService.show();
    this.DepositAccountService.updateTransactiontax(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
      if (data.status.isSuccessful) {
        swal.fire("GOSFINANCIAL", message, "success");
        this.router.navigate(["/deposit/transactiontax-list"]);
      } else {
        swal.fire("GOSFINANCIAL", message, "error");
      }
        // if (data["result"] == true) {
        //     swal.fire("GOSFINANCIAL", data["message"], "success");
        //     this.router.navigate(["/deposit/transactiontax-list"]);
        // } else {
        //     swal.fire("GOSFINANCIAL", data["message"], "error");
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
