import { saveAs } from 'file-saver';
import { WorkflowService } from './../../../../core/services/workflow.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
    selector: 'app-workflow-level-list',
    templateUrl: './workflow-level-list.component.html'
})
export class WorkflowLevelListComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  fileToUpload: File;
    workflowLevels: any[] = [];
    selectedWorkflowLevel: any[];
    cols: any[];
    viewHeight: any = '600px';
    constructor(
        private loadingService: LoadingService,
        private workflowService: WorkflowService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getAllWorkflowLevel();
        this.cols = [
            { field: 'workflowLevelName', header: 'Workflow Level Name' },
            { field: 'workflowGroupName', header: 'Workflow Group' },
            { field: 'position', header: 'Position'},
            { field: 'jobTitleName', header: 'Job Title'},
            { field: 'Limit Amount', header: 'Limit Amount'}
        ];
    }

    showAddNew() {
        this.router.navigate(['/setup/workflow-level']);
    }

    getAllWorkflowLevel() {
        this.loadingService.show();
        this.workflowService.getAllWorkflowLevel().subscribe(data => {
            this.loadingService.hide();
            this.workflowLevels = data['workflowLevels'];
        }, err => {
          this.loadingService.hide();

        });
    }
    editWorkflowLevel(row) {
        this.router.navigate(['/setup/workflow-level'], {
            queryParams: { editworkflowlevel: row.workflowLevelId }
        });
    }
    deleteWorkflowLevel(row) {
        // const this = this;
        swal.fire({
            title: 'Are you sure you want to delete record?',
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                this.loadingService.show();

                this.workflowService
                    .deleteWorkflowLevel(row.workflowLevelId)
                    .subscribe(data => {
                        this.loadingService.hide();
                        if (data['result'] == true) {
                            swal.fire(
                                'GOS FINANCIAL',
                                data['message'],
                                'success'
                            );
                            this.getAllWorkflowLevel();
                        } else {
                            swal.fire(
                                'GOS FINANCIAL',
                                data['message'],
                                'error'
                            );
                        }
                    });
            } else {
                swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
            }
        });
    }
    exportWorkflowLevel() {
        this.loadingService.show();
        this.workflowService.exportWorkflowLevel().subscribe(response => {
            this.loadingService.hide();
            const data = response;
            if (data != undefined) {
                const byteString = atob(data);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const bb = new Blob([ab]);
                try {
                    const file = new File([bb], 'WorkflowLevel.xlsx', {
                        type: 'application/vnd.ms-excel'
                    });
                    saveAs(file);
                } catch (err) {
                    const textFileAsBlob = new Blob([bb], {
                        type: 'application/vnd.ms-excel'
                    });
                    window.navigator.msSaveBlob(
                        textFileAsBlob,
                        'WorkflowLevel.xlsx'
                    );
                }
            }
        },  err => {
          this.loadingService.hide()
        });
    }

    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }


    async uploadWorkflowLevel() {
        if (this.fileToUpload == null) {
          return swal.fire(
                'GOS FINANCIAL',
                'Please select upload document to continue',
                'error'
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
        this.workflowService.uploadWorkflowLevel(this.fileToUpload).then(
            data => {
              this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                this.fileToUpload = null;
                this.fileInput = null;
                this.getAllWorkflowLevel();
                swal.fire('GOS FINANCIAL', message, 'success')
              } else {
                this.fileToUpload = null;
                this.fileInput.nativeElement.value = "";
                swal.fire('GOS FINANCIAL', message, 'error')
              }
            }
        ).catch(err => {
          this.loadingService.hide();
          const error = JSON.parse(err);
          const message = error.status.message.friendlyMessage;
          this.fileToUpload = null;
          this.fileInput = null;
          swal.fire('GOS FINANCIAL', message, 'error')
        });
    }
    multipleDelete() {
        if (this.selectedWorkflowLevel.length == 0) {
            swal.fire(
                'GOS FINANCIAL',
                'Please select records you want to delete',
                'error'
            );
            return;
        }
        const tempData = this.selectedWorkflowLevel;
        const targetIds = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                const  workflowLevelIds = el.workflowLevelId;
                targetIds.push(workflowLevelIds);
            });

        }

        const body = {
          workflowLevelIds: targetIds
        };
        // return;
        // const this = this;
        swal.fire({
            title: 'Are you sure you want to delete record?',
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                this.loadingService.show();

                this.workflowService
                    .deleteMultipleWorkflowLevel(body)
                    .subscribe(data => {
                        this.loadingService.hide();
                        let message = data.status.message.friendlyMessage;
                     if (data.status.isSuccessful) {
                       swal.fire('GOS FINANCIAL', message, 'success');
                       this.getAllWorkflowLevel();
                       this.selectedWorkflowLevel = [];
                     } else {
                       swal.fire(`GOS FINANCIAL`, message, 'error')
                     }
                        // if (data['result'] == true) {
                        //     swal.fire(
                        //         'GOS FINANCIAL',
                        //         'Record deleted successful.',
                        //         'success'
                        //     );
                        //     this.getAllWorkflowLevel();
                        // } else {
                        //     swal.fire(
                        //         'GOS FINANCIAL',
                        //         'Record not deleted',
                        //         'error'
                        //     );
                        // }
                    }, err => {
                      this.loadingService.hide();
                      let message = err.status.message.friendlyMessage;
                      swal.fire('GOS FINANCIAL', message, 'error');

                    });
            } else {
                swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
            }
        });
    }
}
