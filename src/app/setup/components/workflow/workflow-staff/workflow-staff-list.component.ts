import { saveAs } from "file-saver";
import { WorkflowService } from "./../../../../core/services/workflow.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-workflow-staff-list",
  templateUrl: "./workflow-staff-list.component.html"
})
export class WorkflowStaffListComponent implements OnInit {
  fileToUpload: File;
  @ViewChild("fileInput") fileInput: any;
  workflowLevelStaffs: any[] = [];
  selectedWorkflowLevelStaff: any[] = [];
  cols: any[];
  viewHeight: any = "600px";
  constructor(
    private loadingService: LoadingService,
    private workflowService: WorkflowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllWorkflowLevelStaff();
    this.cols = [
      { field: "workflowLevelName", header: "Workflow Level" },
      { field: "staffName", header: "Staff Name" },
      { field: "accessLevel", header: "Access Level" }
    ];
  }

  showAddNew() {
    this.router.navigate(["/setup/workflow-staff"]);
  }

  getAllWorkflowLevelStaff() {
    this.loadingService.show();
    this.workflowService.getAllWorkflowLevelStaff().subscribe(
      data => {
        this.loadingService.hide();
        this.workflowLevelStaffs = data.workflowlevelStaffs;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editWorkflowLevelStaff(row) {
    this.router.navigate(["/setup/workflow-staff"], {
      queryParams: { editworkflowlevelstaff: row.workflowLevelStaffId }
    });
  }
  deleteWorkflowLevelStaff(row) {
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
            .deleteWorkflowLevelStaff(row.workflowLevelStaffId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire("GOS FINANCIAL", data["message"], "success");
                __this.getAllWorkflowLevelStaff();
              } else {
                swal.fire("GOS FINANCIAL", data["message"], "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportWorkflowLevelStaff() {
    this.loadingService.show();
    this.workflowService.exportWorkflowLevelStaff().subscribe(
      response => {
        this.loadingService.hide();
        let data = response;
        if (data != undefined) {
          let byteString = atob(data);
          let ab = new ArrayBuffer(byteString.length);
          let ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          let bb = new Blob([ab]);
          try {
            let file = new File([bb], "WorkflowLevelStaff.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            let textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              "WorkflowLevelStaff.xlsx"
            );
          }
        }
      },
      error => {
        this.loadingService.hide();
      }
    );
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  async uploadWorkflowLevelStaff() {
    if (this.fileToUpload == null) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show()
    await this.workflowService
      .uploadWorkflowLevelStaff(this.fileToUpload)
      .then(data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllWorkflowLevelStaff();
          this.loadingService.hide();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      }, err => {
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  multipleDelete() {
    if (this.selectedWorkflowLevelStaff.length == 0) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
    }
    let tempData = this.selectedWorkflowLevelStaff;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.workflowLevelStaffId
        };
        targetIds.push(el.workflowLevelStaffId);
      });
    }
    let body = {
      workflowLevelStaffIds: targetIds
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

          __this.workflowService
            .deleteMultipleWorkflowLevelStaff(body)
            .subscribe(
              data => {
                __this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.selectedWorkflowLevelStaff = []
                  __this.getAllWorkflowLevelStaff();
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
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}
