import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AccountTypeService } from "src/app/core/services/accounttype.service";
import { CompanyService } from "src/app/core/services/company.service";

@Component({
    selector: "app-accounttype",
    templateUrl: "./accounttype.component.html"
})
export class AccountTypeComponent implements OnInit {
    companyInformation: any[] = [];
    form: FormGroup;
    formTitle: string = "Account Type Information";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private accountTypeService: AccountTypeService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            accountTypeId: [0],
            accountTypeName: ["", Validators.required],
            multiples: ["", Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let accountTypeId = params["editaccountType"];
            if (accountTypeId != null || accountTypeId != undefined) {
                this.editAccountType(accountTypeId);
            }
        });
    }



    editAccountType(accountTypeId) {
        this.formTitle = " Account Type Information";
        this.loadingService.show();
        this.accountTypeService.getAccountType(accountTypeId).subscribe(data => {
            this.loadingService.hide();
            let row = data.accountTypes[0];
            this.form = this.fb.group({
                accountTypeId: row.accountTypeId,
                accountTypeName: row.accountTypeName,
                multiples: row.multiples,
            });
        }, err => {
          this.loadingService.hide()
        });
    }

    goBack() {
        this.router.navigate(["/finance/accounttype-list"]);
    }
    submitAccountTypeInfo(formObj) {
      const payload = formObj.value;
        this.loadingService.show();
        this.accountTypeService.updateAccountType(payload).subscribe(
            data => {
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success").then(() => {
                      this.router.navigate(["/finance/accounttype-list"]);
                    });
                } else {
                    swal.fire("GOS FINANCIAL", message, "error");
                }
              this.loadingService.hide();
            },
            err => {
                this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", message, "error");
            }
        );
    }
}
