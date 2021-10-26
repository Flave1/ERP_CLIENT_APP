import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { CompanyService } from "src/app/core/services/company.service";
import swal from "sweetalert2";
import { CustomerFsService } from "src/app/core/services/customer-fs.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-loan-customer-fs-caption-group",
  templateUrl: "./loan-customer-fs-caption-group.component.html"
})
export class LoanCustomerFsCaptionGroupComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Customer FS Caption Group";
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private customerFsService: CustomerFsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      fSCaptionGroupId: [0],
      fSCaptionGroupName: ["", Validators.required]
      // position: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let fsCaptionGroupId = params["editFSCaptionGroup"];
      if (fsCaptionGroupId != null || fsCaptionGroupId != undefined) {
        this.editFSCaptionGroup(fsCaptionGroupId);
      }
    });
  }

  editFSCaptionGroup(fSCaptionGroupId) {
    this.formTitle = "Edit Customer FS Caption Group";
    this.loadingService.show();
    this.customerFsService
      .getSingleFSCaptionGroup(fSCaptionGroupId)
      .subscribe(data => {
        this.loadingService.hide();
        let row = data.loanCustomerFSCaption[0];
        this.form = this.fb.group({
          fSCaptionGroupId: [row.fsCaptionGroupId, Validators.required],
          fSCaptionGroupName: [row.fsCaptionGroupName, Validators.required]
          // position: [row.position, Validators.required]
        });
      });
  }

  submitForm(form) {
    this.loadingService.show();

    let bodyObj = {
      fSCaptionGroupName: form.value.fSCaptionGroupName,
      fSCaptionGroupId: parseInt(form.value.fSCaptionGroupId)
    };
    this.customerFsService.addUpdateFSCaptionGroup(bodyObj).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.router.navigate(["/credit/loan-customer-fscaption-group-list"]);
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
  goBack() {
    this.router.navigate(["/credit/loan-customer-fscaption-group-list"]);
  }
}
