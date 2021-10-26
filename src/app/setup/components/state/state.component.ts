import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { StateService } from "src/app/core/services/state.service";
import { CountryService } from "src/app/core/services/country.service";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-state",
  templateUrl: "./state.component.html"
})
export class StateComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add State Information";
  countryList: any[];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private stateService: StateService,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      stateId: [0],
      code: ["", Validators.required],
      name: ["", Validators.required],
      countryId: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let stateId = params["editstate"];
      if (stateId != null || stateId != undefined) {
        this.editState(stateId);
      }
    });
    this.getAllCountry();
  }

  getAllCountry() {
    this.loadingService.show();
    this.commonService.getAllCountry().subscribe(
      data => {
        this.loadingService.hide();
        this.countryList = data.commonLookups;

      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  editState(stateId) {
    this.formTitle = "Edit State Information";
    this.loadingService.show();
    this.commonService.getState(stateId).subscribe(data => {
      this.loadingService.hide();
      let row = data.commonLookups[0];
      this.form = this.fb.group({
        stateId: row.lookupId,
        code: row.code,
        name: row.lookupName,
        countryId: row.parentId
      });
    });
  }

  goBack() {
    this.router.navigate(["/setup/state-list"]);
  }
  submitStateInfo(formObj) {
    const payload = formObj.value;
    payload.countryId = parseInt(payload.countryId)
    this.loadingService.show();
    this.commonService.updateState(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/setup/state-list"]);
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
