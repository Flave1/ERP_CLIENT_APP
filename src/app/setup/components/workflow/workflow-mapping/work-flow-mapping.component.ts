import { Validators } from "@angular/forms";
import { WorkflowService } from "./../../../../core/services/workflow.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { LoadingService } from "src/app/core/services/loading.service";
import { CompanyService } from "src/app/core/services/company.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-work-flow-mapping",
  templateUrl: "./work-flow-mapping.component.html"
})
export class WorkFlowMappingComponent implements OnInit {
  workflowForm: FormGroup;
  workflowDetailsForm: FormGroup;
  WorkflowDetails: any[] = [];
  formTitle: string = "Add Workflow";
  accessList: any[];
  accessLevelList: any[];
  accessLevels: SelectItem[];
  operationList: any[];
  workflowGroupList: any[];
  workflowLevelList: any[] = [];
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
  workflowId: any = 0;
  filteredWorkflowLevel: any[] = [];
  operationId: number;
  accessLevelDetails: any[];
  enableAccessLevel: boolean;
  enableTopAccessLevel: boolean;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private companyService: CompanyService,
    private workflowService: WorkflowService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.workflowForm = this.fb.group({
      workflowId: 0,
      workflowName: ["", Validators.required],
      operationId: ["", Validators.required],
      workflowAccessId: [""],
      workflowAccessIds: [[], Validators.required]
    });
    this.workflowDetailsForm = this.fb.group({
      workflowDetailId: 0,
      workflowId: [0],
      workflowGroupId: ["", Validators.required],
      workflowLevelId: ["", Validators.required],
      accessId: ["", Validators.required],
      accessOfficeIds: [[], Validators.required],
      position: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let workflowId = params["workflow"];
      let operation = params["operation"];

      if (workflowId != null && operation != undefined) {
        this.operationId = operation;
        this.workflowId = workflowId;
        this.workflowForm.get("operationId").setValue(operation);
        if (this.workflowId > 0) {
          this.editWorkflow(this.workflowId);
        }
      }
    });
    this.positions = this.allPositions;
    this.getAllAccess();
    this.getOperations();
    this.getAllWorkflowGroup();
    this.getAllWorkflowLevel();
  }
  getAllAccess() {
    this.companyService.getAllCompanyStructureDefinition().subscribe(
      data => {
        this.accessList = data.companyStructureDefinitions;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getOperations() {
    this.loadingService.show();
    this.workflowService.getWorkflowOperation().subscribe(data => {
      this.loadingService.hide();
      this.operationList = data.operations
    }, err => {
      this.loadingService.hide()
    });
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
  getAllWorkflowLevel() {
    this.loadingService.show();
    this.workflowService.getAllWorkflowLevel().subscribe(data => {
      this.loadingService.hide();
      this.workflowLevelList = data.workflowLevels;
    }, err => {
      this.loadingService.hide()
    });
  }
  onAccessLevelChanged(value) {
    // if (value != null) {
    //
    // }
    this.loadingService.show();
    this.companyService
      .getCompanyStructureByAccessId(value)
      .subscribe(data => {
        this.loadingService.hide();
        this.enableTopAccessLevel = true;
        this.accessLevelList = data.companyStructures;
        this.accessLevels = [];
        if (this.accessLevelList !== undefined) {
          this.accessLevelList.forEach(el => {
            this.accessLevels.push({
              label: el.name,
              value: el.companyStructureId
            });
          });
        }
        this.parseValueToInt(value, 2)
      }, err => {
        this.loadingService.hide();
      });
  }

  onAccessLevelDetailChanged(value) {
    if (value != null) {
      this.loadingService.show();
      this.companyService
        .getCompanyStructureByAccessId(value)
        .subscribe(data => {
          this.loadingService.hide();
          this.enableAccessLevel = true;
          this.accessLevelList = data.companyStructures;
          this.accessLevelDetails = [];
          if (this.accessLevelList !== undefined) {
            this.accessLevelList.forEach(el => {
              this.accessLevelDetails.push({
                label: el.name,
                value: el.companyStructureId
              });
            });
          }
        }, err => {
          this.loadingService.hide()
        });
    }
  }
  onWorkflowGroupChange(value) {
    this.filteredWorkflowLevel = this.workflowLevelList.filter(
      x => x.workflowGroupId == value
    );
  }

  filterPositions(list: any[], filter: boolean = true) {
    this.positions = this.allPositions;
    if (filter) {
      list.forEach(element => {
        this.positions = this.positions.filter(x => x.id != element.position);
      });
    }
  }
  addToList(formObj) {
    let obj = formObj.value;

    const exist = this.WorkflowDetails.find(
      x => x.workflowLevelId == obj.workflowLevelId
    );
    if (exist == null) {
      let detail = {
        workflowDetailId: 0,
        workflowId: parseInt(this.workflowId),
        workflowGroupId: parseInt(obj.workflowGroupId),
        workflowLevelId: parseInt(obj.workflowLevelId),
        accessId: parseInt(obj.accessId),
        accessOfficeIds: obj.accessOfficeIds,
        position: parseInt(obj.position)
      };
      this.WorkflowDetails.push(detail);
      this.filterPositions(this.WorkflowDetails);
      this.workflowDetailsForm.reset();
    } else {
      swal.fire("GOS FINANCIAL", "Selected Level is already added", "error");
    }
  }
  getWorkflowLevelName(id) {
    return this.workflowLevelList.find(x => x.workflowLevelId == id)
      ?.workflowLevelName;
  }
  removeDetail(row) {
    var index = this.WorkflowDetails.indexOf(row);
    if (index !== -1) {
      this.WorkflowDetails.splice(index, 1);
    }
    this.filterPositions(this.WorkflowDetails);
  }
  editWorkflow(workflowId) {
    this.formTitle = "Edit Workflow";
    this.loadingService.show();
    this.workflowService.getSingleWorkflow(workflowId).subscribe(data => {
      this.loadingService.hide();
      let details: any[];
      let row = data.workflows[0];
      details = row.workflowDetails;
      this.workflowForm = this.fb.group({
        workflowId: row.workflowId,
        workflowName:  [row.workflowName, Validators.required],
        operationId:  [row.operationId, Validators.required],
        workflowAccessId: [row.workflowAccessId],
        workflowAccessIds:  [row.workflowAccessIds, Validators.required],
      });
      if (details.length > 0) {
        details.forEach(obj => {
              let body = {
                workflowDetailId: obj.workflowDetailId,
                workflowId: obj.workflowId,
                workflowGroupId: obj.workflowGroupId,
                workflowLevelId:obj.workflowLevelId,
                accessId: obj.accessId,
                accessOfficeIds:obj.accessOfficeIds,
                position: obj.position,
              };
              this.WorkflowDetails.push(body);
          });
      }
      // this.loadingService.hide();
      // let details = [];
      // let row = data.workflowdetails;
      // details = row;
      // this.workflowForm = this.fb.group({
      //   workflowId: row.workflowId,
      //   workflowName: [row.workflowName, Validators.required],
      //   operationId: [row.operationId, Validators.required],
      //   workflowAccessId: [row.workflowAccessId],
      //   workflowAccessIds: [row.workflowAccessIds, Validators.required]
      // });
      // if (details.length > 0) {
      //   details.forEach(obj => {
      //     let body = {
      //       workflowDetailId: obj.workflowDetailId,
      //       workflowId: obj.workflowId,
      //       workflowGroupId: obj.workflowGroupId,
      //       workflowLevelId: obj.workflowLevelId,
      //       accessId: obj.accessId,
      //       accessOfficeIds: obj.accessOfficeIds,
      //       position: obj.position
      //     };
      //     this.WorkflowDetails.push(body);
      //   });
      // }
      this.filterPositions(this.WorkflowDetails);
      this.onAccessLevelChanged(row.workflowAccessId);
    });
  }
  submitWorkflow(formObj) {
    if (this.WorkflowDetails.length <= 0) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please add workflow details to continue",
        "error"
      );

    }
    let body = {
      workflowId: parseInt(formObj.value.workflowId),
      workflowName: formObj.value.workflowName,
      operationId: parseInt(formObj.value.operationId),
      workflowAccessId: parseInt(formObj.value.workflowAccessId),
      workflowAccessIds: formObj.value.workflowAccessIds,
      details: this.WorkflowDetails
    };
    // return;
    this.loadingService.show();
    this.workflowService.addUpdateWorkflow(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        this.WorkflowDetails = [];
        this.router.navigate(["/setup/workflow-mapping-list"]);
        swal.fire("GOS FINANCIAL", message, "success");
        // if (data["result"] == true) {
        //
        // } else {
        //   swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
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
      this.workflowForm.patchValue({
        operationId: parsedValue
      })
    }
    if (num == 2) {
      this.workflowForm.patchValue({
        workflowAccessId: parsedValue
      })
    }
    if (num == 3) {
      this.workflowDetailsForm.patchValue({
        workflowGroupId: parsedValue
      })
    }
    if (num == 4) {
      this.workflowDetailsForm.patchValue({
        workflowLevelId: parsedValue
      })
    }
    if (num == 5) {
      this.workflowDetailsForm.patchValue({
        accessId: parsedValue
      })
    }
    if (num == 6) {
      this.workflowDetailsForm.patchValue({
        position: parsedValue
      })
    }
  }
  goBack() {
    this.router.navigate(["/setup/workflow-mapping-list"]);
  }
}
