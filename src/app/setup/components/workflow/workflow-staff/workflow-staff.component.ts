import { WorkflowService } from "./../../../../core/services/workflow.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { UserAccountService } from "src/app/core/services/user.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-workflow-staff",
  templateUrl: "./workflow-staff.component.html"
})
export class WorkflowStaffComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Workflow Staff ";
  workflowLevelList: any[];
  workflowGroupList: any[];
  staffList: any[];
  filteredWorkflowLevel: any[];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private workflowService: WorkflowService,
    private staffService: UserAccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeControl();
    this.getAllWorkflowGroup();
    this.getAllWorkflowLevel();
    this.getAllStaff();
    this.route.queryParams.subscribe(params => {
      let workflowLevelStaffId = params["editworkflowlevelstaff"];
      if (workflowLevelStaffId != null || workflowLevelStaffId != undefined) {
        this.editWorkflowLevelStaff(workflowLevelStaffId);
      }
    });
  }

  initializeControl() {
    this.form = this.fb.group({
      workflowLevelStaffId: 0,
      staffId: ["", Validators.required],
      workflowGroupId: ["", Validators.required],
      workflowLevelId: ["", Validators.required]
    });
  }

  getAllWorkflowLevel() {
    this.loadingService.show();
    this.workflowService.getAllWorkflowLevel().subscribe(
      data => {
        this.loadingService.hide();
        this.workflowLevelList = data.workflowLevels;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getAllWorkflowGroup() {
    this.loadingService.show();
    this.workflowService.getAllWorkflowGroup().subscribe(
      data => {
        this.loadingService.hide();
        this.workflowGroupList = data.workflowGroups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getAllStaff() {
    this.loadingService.show();
    this.staffService.getStaffList().subscribe(
      data => {
        this.loadingService.hide();
        this.staffList = data["staff"];
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  onWorkflowGroupChange(value) {
    if (this.workflowLevelList != undefined) {
      this.filteredWorkflowLevel = this.workflowLevelList.filter(
        x => x.workflowGroupId == value
      );
    }
    this.parseValueToInt(value, 2)
  }

  editWorkflowLevelStaff(workflowLevelStaffId) {
    this.formTitle = "Edit Workflow Staff ";
    this.loadingService.show();
    this.workflowService
      .getSingleWorkflowLevelStaff(workflowLevelStaffId)
      .subscribe(data => {
        this.loadingService.hide();
        let row = data.workflowlevelStaffs[0];
        this.form = this.fb.group({
          workflowLevelStaffId: row.workflowLevelStaffId,
          staffId: [row.staffId, Validators.required],
          workflowLevelId: [row.workflowLevelId, Validators.required],
          workflowGroupId: [row.workflowGroupId, Validators.required]
        });
        this.onWorkflowGroupChange(row.workflowGroupId);
      });
  }

  goBack() {
    this.router.navigate(["/setup/workflow-staff-list"]);
  }
  submitWorkflowLevelStaffInfo(formObj) {
    this.loadingService.show();
    this.workflowService.addUpdateWorkflowLevelStaff(formObj.value).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/setup/workflow-staff-list"]);
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

  parseValueToInt(value: string, num: number) {
    let parsedValue = parseInt(value);
    if (num == 1) {
      this.form.patchValue({
        staffId: parsedValue
      });
    }
    if (num == 2) {
      this.form.patchValue({
        workflowGroupId: parsedValue
      });
    }
    if (num == 3) {
      this.form.patchValue({
        workflowLevelId: parsedValue
      });
    }
  }
}
