import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { Location } from '@angular/common';

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html"
})
export class CategoryComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Category";
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private DepositAccountService: DepositAccountService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.form = this.fb.group({
      categoryId: [0],
      name: ["", Validators.required],
      description: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let setupId = params["editcategory"];
      if (setupId != null || setupId != undefined) {
        this.editCategory(setupId);
      }
    });
  }

  editCategory(setupId) {
    this.formTitle = "Edit Category";
    this.loadingService.show();
    this.DepositAccountService.getCategory(setupId).subscribe(data => {
      this.loadingService.hide();
      let row = data.categories[0];
      this.form = this.fb.group({
        categoryId: row.categoryId,
        name: row.name,
        description: row.description
      });
    });
  }

  goBack() {
    this.location.back()
  }
  submitCategory(formObj) {
    const payload = formObj.value;
    this.loadingService.show();
    this.DepositAccountService.updateCategory(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.router.navigate(["/deposit/category-list"]);
        } else {
          swal.fire("GOSFINANCIAL", message, "error");
        }
        // if (data["result"] == true) {
        //   swal.fire("GOSFINANCIAL", data["message"], "success");
        //   this.router.navigate(["/deposit/category-list"]);
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
