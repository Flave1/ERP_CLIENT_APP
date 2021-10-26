import { CustomerFsService } from "src/app/core/services/customer-fs.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";

@Component({
    selector: "app-loan-customer-fs-caption",
    templateUrl: "./loan-customer-fs-caption.component.html"
})
export class LoanCustomerFsCaptionComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add FS Caption";
    fsCaptionGroupList: any[];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private customerFsService: CustomerFsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            fSCaptionId: [0],
            fSCaptionName: ["", Validators.required],
            fSCaptionGroupId: ["", Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let fSCaptionId = params["editfscaption"];
            if (fSCaptionId != null || fSCaptionId != undefined) {
                this.editFSCaption(fSCaptionId);
            }
        });
        this.getAllFSCaptionGroup();
    }

    getAllFSCaptionGroup() {
        this.loadingService.show();
        this.customerFsService
            .getAllCustomerFSCaptionGroup()
            .subscribe(data => {
                this.loadingService.hide();
                this.fsCaptionGroupList = data.loanCustomerFSGroup;
            }, err => {
              this.loadingService.hide()
            });
    }

    editFSCaption(fSCaptionId) {
        this.formTitle = "Edit FS Caption";
        this.loadingService.show();
        this.customerFsService
            .getSingleFSCaption(fSCaptionId)
            .subscribe(data => {
                this.loadingService.hide();
                let row = data.loanCustomerFSCaption[0];
                this.form = this.fb.group({
                    fSCaptionId: [row.fsCaptionId],
                    fSCaptionName: [row.fsCaptionName, Validators.required],
                    fSCaptionGroupId: [row.fsCaptionGroupId,Validators.required],
                });
            });
    }

    goBack() {
        this.router.navigate(["/credit/loan-customer-fscaption-list"]);
    }
    submitFSCaption(formObj) {
      const payload = formObj.value;
      payload.fSCaptionGroupId = parseInt(payload.fSCaptionGroupId);
        this.loadingService.show();
        this.customerFsService.addUpdateFSCaption(payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigate([
                        "/credit/loan-customer-fscaption-list"
                    ]);
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
}
