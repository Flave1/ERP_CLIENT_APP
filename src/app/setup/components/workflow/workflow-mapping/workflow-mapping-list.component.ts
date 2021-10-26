import { WorkflowService } from "./../../../../core/services/workflow.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";
@Component({
  selector: "app-workflow-mapping-list",
  templateUrl: "./workflow-mapping-list.component.html"
})
export class WorkflowMappingListComponent implements OnInit {
  workflowForm: FormGroup;
  operationTypes: any[];
  operations: any[];
  workflowList: any[];
  displayWorkflow: boolean = false;
  filteredOperations: any[];
  operationId: any;
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
  modules: any;
  filteredOprationTypes: any[];

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private workflowService: WorkflowService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.operationControl();
    this.getAllModules();
    this.getOperations();
    this.getOperationypes();
  }
  operationControl() {
    this.workflowForm = this.fb.group({
      operationTypeId: [""],
      operationId: [""],
      moduleId: [""]
    });
  }

  getOperations() {
    this.loadingService.show();
    this.workflowService.getWorkflowOperation().subscribe(
      data => {
        this.loadingService.hide();
        this.operations = data.operations;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getOperationypes() {
    this.loadingService.show();
    this.workflowService.getWorkflowOperationTypes().subscribe(
      data => {
        this.loadingService.hide();
        this.operationTypes = data.workflowOperationTypes;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getAllModules() {
    this.commonService.getAllModules().subscribe(
      response => {
        this.modules = response.commonLookups;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  onOperationTypeChanged(id) {
    this.filteredOperations = this.operations.filter(
      x => x.operationTypeId == id
    );
  }

  onOperationChanged(id) {
    this.operationId = id;
    if (this.operationId > 0) {
      this.getWorkflowByOperation(this.operationId);
      this.displayWorkflow = true;
    } else {
      this.displayWorkflow = false;
    }
  }
  getWorkflowByOperation(operationId) {
    this.operationId = operationId;
    this.displayWorkflow = true;
    this.loadingService.show();
    this.workflowService.getWorkflowByOperation(operationId).subscribe(
      data => {
        this.loadingService.hide();
        this.workflowList = data["workflows"];
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  onModuleChanged(value) {
    if (this.operationTypes) {
      this.filteredOprationTypes = this.operationTypes.filter(
        x => x.moduleId == value
      );
    }
  }

  filterPositions(list: any[], filter: boolean = true) {
    this.positions = this.allPositions;
    if (filter) {
      list.forEach(element => {
        this.positions = this.positions.filter(x => x.id != element.position);
      });
    }
  }

  showAddNewWorkflow() {
    this.router.navigate(["/setup/workflow-mapping"], {
      queryParams: { workflow: 0, operation: this.operationId }
    });
  }
  editWorkflow(row) {
    this.router.navigate(["/setup/workflow-mapping"], {
      queryParams: { workflow: row.workflowId, operation: row.operationId }
    });
  }
  deleteWorkflow(row) {
    // const this = this;
    let data = [];
    data.push(row.workflowId);
    let payload = {
      workflowIds: data
    };
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(
        result => {
          if (result.value) {
            this.loadingService.show();
            this.workflowService.deleteWorkflow(payload).subscribe(data => {
              this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                this.loadingService.hide()
                swal.fire("GOS FINANCIAL", message, "success");
                this.getWorkflowByOperation(row.operationId);
              } else {
                this.loadingService.hide();
                swal.fire("GOS FINANCIAL", message, "error");
              }
            }, err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOS FINANCIAL", message, "error");
            });
          } else {
            swal.fire("GOS FINANCIAL", "Cancelled", "error");
          }
        },
      );
  }
}
