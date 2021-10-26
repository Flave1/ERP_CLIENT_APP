import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";

@Component({
  selector: "app-accounttype",
  templateUrl: "./accounttype.component.html"
})
export class AccounttypeComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add AccountType";
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private depositAccountService: DepositAccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      accountTypeId: [0],
      name: ["", Validators.required],
      description: ["",],
      accountNunmberPrefix: [""]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let setupId = params["editaccountype"];
      if (setupId != null || setupId != undefined) {
        this.editAccountType(setupId);
      }
    });
  }

  editAccountType(setupId) {
    this.formTitle = "Edit AccountType";
    this.loadingService.show();
    this.depositAccountService.getAccountType(setupId).subscribe(data => {
      this.loadingService.hide();
      let row = data.accountTypes[0];
      this.form = this.fb.group({
        accountTypeId: row.accountTypeId,
        name: row.name,
        description: row.description,
        accountNunmberPrefix: [row.accountNunmberPrefix]
      });
    });
  }

  goBack() {
    this.router.navigate(["/deposit/accounttype-list"]);
  }
  submitAccountType(formObj) {
    this.loadingService.show();
    this.depositAccountService.updateAccountType(formObj.value).subscribe(
      data => {

        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/deposit/accounttype-list"]);
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error')
        }

        // if (data["result"] == true) {
        //     swal.fire("GOSFINANCIAL", data["message"], "success");
        //     this.router.navigate(["/deposit/accounttype-list"]);
        // } else {
        //     swal.fire("GOSFINANCIAL", data["message"], "error");
        // }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
}
