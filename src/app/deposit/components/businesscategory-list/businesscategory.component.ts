import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";

@Component({
    selector: "app-businesscategory",
    templateUrl: "./businesscategory.component.html"
})
export class BusinesscategoryComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add Business Category";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private DepositAccountService: DepositAccountService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            businessCategoryId: [0],
            name: ["", Validators.required],
            description: ["", Validators.required]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const setupId = params["editbusinessCategory"];
            if (setupId != null || setupId != undefined) {
                this.editbusinesscategory(setupId);
            }
        });
    }

    editbusinesscategory(setupId) {
        this.formTitle = "Edit Business Category";
        this.loadingService.show();
        this.DepositAccountService.getbusinesscategory(setupId).subscribe(
            data => {
                this.loadingService.hide();
                const row = data.businessCategories[0];
                this.form = this.fb.group({
                    businessCategoryId: row.businessCategoryId,
                    name: row.name,
                    description: row.description
                });
            }
        );
    }

    goBack() {
        this.router.navigate(["/deposit/businesscategory-list"]);
    }
    submitbusinesscategory(formObj) {
        this.loadingService.show();
        this.DepositAccountService.updatebusinesscategory(
            formObj.value
        ).subscribe(
            data => {
                this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              swal.fire("GOSFINANCIAL", message, "success");
              this.router.navigate(["/deposit/businesscategory-list"]);
                // if (data["result"] == true) {
                //     swal.fire("GOSFINANCIAL", data["message"], "success");
                //     this.router.navigate(["/deposit/businesscategory-list"]);
                // } else {
                //     swal.fire("GOSFINANCIAL", data["message"], "error");
                // }
            },
            err => {
                this.loadingService.hide();
                const message = err.status.message.friendlyMessage;
              swal.fire("GOSFINANCIAL", message, "error");
                // swal.fire("GOSFINANCIAL", JSON.stringify(err), "error");
            }
        );
    }
}
