import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { WorkflowService } from "src/app/core/services/workflow.service";
import swal from "sweetalert2";

@Component({
  selector: "app-workflow-activation",
  templateUrl: "./workflow-activation.component.html"
})
export class WorkflowActivationComponent implements OnInit {
  operationList: any[] = [];
  selectedOperation: any[];
  cols: any[];
  constructor(
    private loadingService: LoadingService,
    private workflowService: WorkflowService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "operationTypeName", header: "operationTypeName" },
      { field: "operationName", header: "operationName" }
    ];
    this.getAllOperation();
  }

  getAllOperation() {
    this.loadingService.show();
    this.workflowService.getAllWorkflowOperation().subscribe(
      data => {
        this.loadingService.hide();
        this.operationList = data["operations"];
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  submitAction() {
    // const this = this;

    swal
      .fire({
        title: `Are you sure you want to update  record?`,
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          this.loadingService.show();

          this.workflowService
            .updateWorkflowOperation(this.operationList)
            .subscribe(
              data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.getAllOperation();
                } else {
                  swal.fire("GOS FINANCIAL", message, "error");
                }
              },
              err => {
                const message = err.status.message.friendlyMessage;
                this.loadingService.hide();
                swal.fire("GOS FINANCIAL", message, "error");
              }
            );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  handleChange(e) {
    let isChecked = e.checked;
  }
}
