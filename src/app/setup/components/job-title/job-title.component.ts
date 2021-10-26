import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CountryService } from 'src/app/core/services/country.service';
import {CommonService} from "../../../core/services/common.service";

@Component({
  selector: 'app-job-title',
  templateUrl: './job-title.component.html',
})
export class JobTitleComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Job Title";
  constructor(
      public fb: FormBuilder,
      private loadingService: LoadingService,
      private countryService: CountryService,
      private router: Router,
      private route: ActivatedRoute,
      private commonService: CommonService
  ) {


      this.form = this.fb.group({
        jobTitleId: [0],
        name: ["", Validators.required],
        jobDescription: [""],
        skills: [""],
        skillDescription: [""],
      });
  }

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
          let jobTitleId = params["editJobTitle"];
          if (jobTitleId != null || jobTitleId != undefined) {
              this.editJobTitle(jobTitleId);
          }
      });
  }

  editJobTitle(jobTitleId) {
      this.formTitle = "Edit Job Title";
      this.loadingService.show();
      this.commonService
          .getJobTitle(jobTitleId)
          .subscribe(data => {
              this.loadingService.hide();
              let row = data.commonLookups[0];
              this.form = this.fb.group({
                jobTitleId: [row.lookupId],
                name: [row.lookupName, Validators.required],
                jobDescription: [row.description],
                skills: [row.skills],
                skillDescription: [row.skillDescription],
              });
          });
  }

  goBack() {
      this.router.navigate(["/setup/job-title-list"]);
  }
  submitJobTitle(formObj) {
      this.loadingService.show();
      this.commonService.updateJobTitle(formObj.value).subscribe(
          data => {
              this.loadingService.hide();
              let message = data.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "success");
            this.router.navigate(["/setup/job-title-list"]);
              // if (data["result"] == true) {
              //     swal.fire("GOS FINANCIAL", data["message"], "success");
              //     this.router.navigate(["/setup/job-title-list"]);
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
