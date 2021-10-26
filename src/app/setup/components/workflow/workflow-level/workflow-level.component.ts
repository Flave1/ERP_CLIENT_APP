import { CountryService } from 'src/app/core/services/country.service';
import { WorkflowService } from './../../../../core/services/workflow.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from "sweetalert2";
import {CommonService} from "../../../../core/services/common.service";

@Component({
  selector: 'app-workflow-level',
  templateUrl: './workflow-level.component.html',
})
export class WorkflowLevelComponent implements OnInit {

  form: FormGroup;
    formTitle: string = "Add Workflow Level ";
    workflowGroupList: any[];
    checkIsActive: boolean = true;
    positions: any[] = [];
    allPositions = [
        { id: "1", name: "Position 1" },
        { id: "2", name: "Position 2" },
        { id: "3", name: "Position 3" },
        { id: "4", name: "Position 4" },
        { id: "5", name: "Position 5" },
        { id: "6", name: "Position 6" },
        { id: "7", name: "Position 7" },
        { id: "8", name: "Position 8" },
        { id: "9", name: "Position 9" },
        { id: "10", name: "Position 10" }
    ];
    allWorkflowLevel: any[] = [];
    jobTitles: any[]=[];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private workflowService: WorkflowService,
        private countryService: CountryService,
        private router: Router,
        private route: ActivatedRoute,
        private commonService: CommonService
    ) {}

    ngOnInit() {
        this.initializeControl();
        this.route.queryParams.subscribe(params => {
            let workflowLevelId = params["editworkflowlevel"];
            if (workflowLevelId != null || workflowLevelId != undefined) {
                this.editWorkflowLevel(workflowLevelId);
            }
        });
        this.getAllJobTitle();
        this.getAllWorkflowGroup();
        this.getAllWorkflowLevel();
    }

    initializeControl() {
        this.form = this.fb.group({
            workflowLevelId:  [0],
            workflowLevelName: ["", Validators.required],
            workflowGroupId:["", Validators.required],
            position: ["", Validators.required],
          roleId: [""],
            requiredLimit: [false],
            limitAmount: [""],
            canModify: [false],
        });
    }

    getAllWorkflowGroup() {
        this.loadingService.show();
        this.workflowService.getAllWorkflowGroup().subscribe(data => {
            this.loadingService.hide();
            this.workflowGroupList = data["workflowGroups"];
        }, err => {
          this.loadingService.hide();

        });
    }
    getAllWorkflowLevel() {
        this.loadingService.show();
        this.workflowService.getAllWorkflowLevel().subscribe(data => {
            this.loadingService.hide();
            this.allWorkflowLevel = data["workflowLevels"];
        }, err => {
          this.loadingService.hide();

        });
    }
    getAllJobTitle(){
        this.commonService.getJobTitles().subscribe(data=>{
            this.jobTitles = data["commonLookups"];
        }, err => {

        })

    }
    onWorkflowLevelChange(value) {
        let levels = this.allWorkflowLevel.filter(
            x => x.workflowGroupId == value
        );
        if (levels != undefined || levels != null) {
            this.filterPositions(levels);
        }
        this.parseValueToInt(value, 1)
    }
    filterPositions(list: any[], filter: boolean = true) {
        this.positions = this.allPositions;
        if (filter) {
            list.forEach(element => {
                this.positions = this.positions.filter(
                    x => x.id != element.position
                );
            });
        }
    }

    editWorkflowLevel(workflowLevelId) {
        this.formTitle = "Edit Workflow Level";
        this.positions = this.allPositions;
        this.loadingService.show();
        this.workflowService
            .getSingleWorkflowLevel(workflowLevelId)
            .subscribe(data => {
                this.loadingService.hide();
                let row = data.workflowLevels[0];
                this.form = this.fb.group({
                  workflowLevelId:  [row.workflowLevelId],
                  workflowLevelName: [row.workflowLevelName],
                  workflowGroupId:[row.workflowGroupId],
                  position: [row.position],
                  roleId: [row.jobTitleId],
                  requiredLimit: [row.requiredLimit],
                  limitAmount: [row.limitAmount],
                  canModify:[row.canModify],

                });
            }, err => {
              this.loadingService.hide()
            });
    }

    goBack() {
        this.router.navigate(["/setup/workflow-level-list"]);
    }
    submitApprovalLevelInfo(formObj) {
      const payload = formObj.value;
     payload.limitAmount = payload.limitAmount.toString();
      // return;
        this.loadingService.show();
        this.workflowService.addUpdateWorkflowLevel(payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigate(["/setup/workflow-level-list"]);
            },
            err => {
                this.loadingService.hide();
                const error = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", error, "error");
            }
        );
    }
    parseValueToInt(value: string, num) {
      let parsedValue;
      if (num == 1) {
        parsedValue = parseInt(value);
        this.form.patchValue({
          workflowGroupId: parsedValue
        })
      }
      if (num == 2) {
        parsedValue = parseInt(value);
        this.form.patchValue({
          position: parsedValue
        })
      }
      // if (num == 3) {
      //   parsedValue = parseInt(value);
      //   this.form.patchValue({
      //     roleId: parsedValue
      //   })
      // }
    }
}
