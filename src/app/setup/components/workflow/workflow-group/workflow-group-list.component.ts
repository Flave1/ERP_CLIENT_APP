import { saveAs } from "file-saver";
import { WorkflowService } from "./../../../../core/services/workflow.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-workflow-group-list",
  templateUrl: "./workflow-group-list.component.html"
})
export class WorkflowGroupListComponent implements OnInit {
  workflowGroups: any[] = [];
  selectedWorkflowGroup: any[] = [];
  fileToUpload: File;
  cols: any[];
  viewHeight: any = "600px";
  @ViewChild("fileInput") fileInput: any;
  constructor(
    private loadingService: LoadingService,
    private workflowService: WorkflowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllWorkflowGroup();
    this.cols = [{ field: "workflowGroupName", header: "WorkflowGroup Name" }];
  }

  showAddNew() {
    this.router.navigate(["/setup/workflow-group"]);
  }

  getAllWorkflowGroup() {
    this.loadingService.show();
    this.workflowService.getAllWorkflowGroup().subscribe(data => {
      this.loadingService.hide();
      this.workflowGroups = data["workflowGroups"];
    }, (err) => {
      this.loadingService.hide();
    });
  }
  editWorkflowGroup(row) {
    this.router.navigate(["/setup/workflow-group"], {
      queryParams: { editworkflowgroup: row.workflowGroupId }
    });
  }
  deleteWorkflowGroup(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.workflowService
            .deleteWorkflowGroup(row.workflowGroupId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire("GOS FINANCIAL", data["message"], "success");
                __this.getAllWorkflowGroup();
              } else {
                swal.fire("GOS FINANCIAL", data["message"], "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportWorkflowGroup() {
    this.loadingService.show();
    this.workflowService.exportWorkflowGroup().subscribe(
      response => {
        this.loadingService.hide();
        let data = response;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], "WorkflowGroup.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "WorkflowGroup.xlsx");
          }
        } else {
          this.loadingService.hide();
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  async uploadWorkflowGroup() {
    if (this.fileToUpload == null) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );

    }
    if (this.fileToUpload.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      return swal.fire(
        "GOS FINANCIAL",
        "Only excel files allowed",
        "error"
      )
    }
    this.loadingService.show();
   await this.workflowService
      .uploadWorkflowGroup(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllWorkflowGroup();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.getAllWorkflowGroup();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        this.loadingService.hide();
        this.fileToUpload = null;
        this.fileInput.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  multipleDelete() {
    if (this.selectedWorkflowGroup.length == 0) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );

    }
    let tempData = this.selectedWorkflowGroup;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.workflowGroupId;

        targetIds.push(data);
      });
    }
    let body = {
      workflowGroupIds: targetIds
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.workflowService.deleteMultipleWorkflowGroup(body).subscribe(
            data => {
              __this.loadingService.hide();
              let message = data.status.message.friendlyMessage;
             if (data.status.isSuccessful) {
               swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                 this.selectedWorkflowGroup = [];
                 __this.getAllWorkflowGroup();
               });

             } else {
               swal.fire('GOS FINANCIAL', message, 'error')
             }
              // if (data["result"] == true) {
              //   swal.fire(
              //     "GOS FINANCIAL",
              //     "Record deleted successful.",
              //     "success"
              //   );
              //   __this.getAllWorkflowGroup();
              // } else {
              //   swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              // }
            },
            err => {
              this.loadingService.hide();
              let message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      }).catch(err => {
        this.loadingService.hide();
    });
  }
}
