import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { IdentificationService } from "src/app/core/services/identification.service";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-identification",
  templateUrl: "./identification.component.html"
})
export class IdentificationComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Identification Information";
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private identificationService: IdentificationService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      identificationId: [0],
      identificationName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let identificationId = params.id;
      if (identificationId != null || identificationId != undefined) {
        this.editIdentification(identificationId);
      }
    });
  }

  editIdentification(identificationId) {
    this.formTitle = "Edit Identification Information";
    this.loadingService.show();
    this.identificationService
      .getIdentification(identificationId)
      .subscribe(data => {
        this.loadingService.hide();
        let row = data.commonLookups[0];
        this.form = this.fb.group({
          identificationId: row.lookupId,
          identificationName: row.lookupName
        });
      }, err => {
        this.loadingService.hide()
      });
  }

  goBack() {
    this.router.navigate(["/setup/identification-list"]);
  }
  submitIdentificationInfo(formObj) {
    const payload = formObj.value;
    this.loadingService.show();
    this.commonService.updateIdentity(payload).subscribe(
      data => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "success");
        this.router.navigate(["/setup/identification-list"]);
        // if (data["result"] == true) {
        //     swal.fire("GOS FINANCIAL", data["message"], "success");
        //     this.router.navigate(["/setup/identification-list"]);
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
