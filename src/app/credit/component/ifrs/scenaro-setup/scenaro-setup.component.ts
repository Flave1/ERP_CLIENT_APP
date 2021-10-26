import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";
import { IfrsService } from "src/app/core/services/ifrs.service";

@Component({
  selector: "app-scenaro-setup",
  templateUrl: "./scenaro-setup.component.html"
})
export class ScenaroSetupComponent implements OnInit {
  companyInformation: any[] = [];
  glInformation: any[] = [];
  currencyInformation: any[] = [];
  form: FormGroup;
  formTitle: string = "Add IFRS Scenario Setup Data";
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private ifrsService: IfrsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      scenarioId: [0],
      scenario: [""],
      likelihood: [""],
      rate: [""]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let setupId = params["editsetupdata"];
      if (setupId != null || setupId != undefined) {
        this.editSetupData(setupId);
      }
    });
  }

  editSetupData(setupId) {
    this.formTitle = "Edit Setup Data";
    this.loadingService.show();
    this.ifrsService.getIFRSScenarioSetupData(setupId).subscribe(data => {
      this.loadingService.hide();
      let row = data.ifrsScenarioSetup[0];
      this.form = this.fb.group({
        scenarioId: [row.scenarioId],
        scenario: [row.scenario],
        likelihood: [row.likelihood],
        rate: [row.rate]
      });
    }, err => {
      this.loadingService.hide()
    });
  }

  goBack() {
    this.router.navigate(["/credit/scenario-setup-data-list"]);
  }
  submitSetupData(formObj) {
    const payload = formObj.value;
    payload.likelihood = parseInt(payload.likelihood);
    payload.rate = parseInt(payload.rate);
    this.loadingService.show();
    this.ifrsService.updateIFRSScenarioSetupData(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/credit/scenario-setup-data-list"]);
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
