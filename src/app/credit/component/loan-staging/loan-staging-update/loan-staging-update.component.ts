import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, Validator } from "@angular/forms";
import swal from "sweetalert2";
import { LoadingService } from "src/app/core/services/loading.service";
import { LoanstagingService } from "src/app/core/services/loanstaging.service";

@Component({
  selector: "app-loan-staging-update",
  templateUrl: "./loan-staging-update.component.html"
})
export class LoanStagingUpdateComponent implements OnInit {
  formTitle: string = "Add New Loan Staging";
  id: number = 0;
  form: FormGroup;
  loanStaging: any = {};
  selectedTo: any[] = [];
  selectedFrom: any[] = [];
  stagesTo: any[] = [
    { text: "", value: 0 },
    { text: "Stage 1", value: 1 },
    { text: "Stage 2", value: 2 },
    { text: "Stage 3", value: 3 }
  ];
  stagesFrom: any[] = [
    { text: "", value: 0 },
    { text: "Stage 1", value: 1 },
    { text: "Stage 2", value: 2 },
    { text: "Stage 3", value: 3 }
  ];
  loanStagingId: any;
  constructor(
    private loanStagingService: LoanstagingService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.form = this.fb.group({
      loanStagingId: [0],
      probationPeriod: [0, [Validators.min(1), Validators.required]],
      from: [0, [Validators.min(1), Validators.required]],
      to: [0, [Validators.min(1), Validators.required]]
    });
  }

  modifyStagingDropdown(data, stageRangeName) {
    if (stageRangeName == "from") {
      this.selectedTo = this.stagesTo.filter(x => x.value != data);
      this.parseValueToInt(data, 1);
    }
    if (stageRangeName == "to") {
      this.selectedFrom = this.stagesFrom.filter(x => x.value != data);
      this.parseValueToInt(data, 2);
    }
  }

  saveLoanStaging(form: any): void {
    const payload = form.value;
    this.loadingService.show();
    this.loanStagingService.updateLoanStaging(payload).subscribe(
      res => {
        this.loadingService.hide();
        let message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/credit/loan-staging"]);
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        let message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
    //return this.loadingService.hide();
  }
  getLoanStaging(id: number) {
      this.loanStagingService
        .getLoanStagingById(id)
        .subscribe(res => {
          let row: any = res["loanStagings"][0];
          this.form = this.fb.group({
            loanStagingId: row.loanStagingId,
            probationPeriod: row.probationPeriod,
            from: row.from,
            to: row.to
          });
        });
      // get the credit classification from the system

  }

  getLoanStagingId() {}
  parseValueToInt(value: string, num): void {
    let parsedValue = parseInt(value);
    if (num == 1) {
      this.form.patchValue({
        from: parsedValue
      });
    }
    if (num == 2) {
      this.form.patchValue({
        to: parsedValue
      });
    }
  }
  goBack() {
    this.router.navigate(["/credit/loan-staging"]);
  }

  initializeDropdown() {
    this.selectedFrom = this.stagesFrom;
    this.selectedTo = this.stagesTo;
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loanStagingId = params["id"];
      if (this.loanStagingId != undefined) {
        this.formTitle = `Edit Loan Staging`;
        this.getLoanStaging(this.loanStagingId)
      }
      // this.id = loanStagingId;
    });
    this.initializeDropdown();
  }
}
