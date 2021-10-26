import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";
import { IfrsService } from "src/app/core/services/ifrs.service";

@Component({
    selector: "app-setup-data",
    templateUrl: "./setup-data.component.html"
})
export class SetupDataComponent implements OnInit {
    companyInformation: any[] = [];
    glInformation: any[] = [];
    currencyInformation: any[] = [];
    form: FormGroup;
    formTitle: string = "Add IFRS Setup Data";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private ifrsService: IfrsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            setUpId: [0],
            ccf: [""],
            classification_Type: [""],
            deteroriation_Level: [""],
            groupBased: [""],
            historical_PD_Year_Count: [""],
            ltpdapproach: [""],
            pdBasis: [""],
            runDate: [new Date()],
            threshold: [""]
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
        this.ifrsService.getIFRSSetupData(setupId).subscribe(data => {
            this.loadingService.hide();
            let row = data.setUpData[0];
            this.form = this.fb.group({
                setUpId: [row.setUpId],
                ccf: [row.ccf],
                classification_Type: [row.classification_Type],
                deteroriation_Level: [row.deteroriation_Level],
                groupBased: [row.groupBased],
                historical_PD_Year_Count: [row.historical_PD_Year_Count],
                ltpdapproach: [row.ltpdapproach],
                pdBasis: [row.pdBasis],
                runDate: [new Date(row.runDate)],
                threshold: [row.threshold]
            });
        }, err => {
          this.loadingService.hide();
        });
    }

    goBack() {
        this.router.navigate(["/credit/setup-data-list"]);
    }
    submitSetupData(formObj) {
      const payload = formObj.value;
      payload.threshold = parseInt(payload.threshold);
      payload.deteroriation_Level = parseInt(payload.deteroriation_Level);
      payload.classification_Type = parseInt(payload.classification_Type);
      payload.historical_PD_Year_Count = parseInt(payload.historical_PD_Year_Count);
      payload.ltpdapproach = parseInt(payload.ltpdapproach);
      payload.ccf = parseInt(payload.ccf);
      payload.runDate = this.formatDate(payload.runDate);
        this.loadingService.show();
        this.ifrsService.updateIFRSSetupData(payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigate(["/credit/setup-data-list"]);
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

  formatDate(date) {
    let dateObj = new Date(date),
      month = '' + (dateObj.getMonth() + 1),
      day = '' + dateObj.getDate(),
      year = '' + dateObj.getFullYear();

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }
}
