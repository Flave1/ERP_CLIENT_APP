import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanApplicationService } from 'src/app/core/services/loanapplication.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { parse } from 'querystring';

@Component({
  selector: 'app-exposure-list',
  templateUrl: './exposure-list.component.html'
})
export class ExposureListComponent implements OnInit {
  ExposureList: any[] = [];
  selectedExposure: any[];
  form: FormGroup;
  formTitle = 'Add Exposure Parameter';
  displayExposure = false;
  cols: any[];
    viewHeight: any = '600px';
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private loanApplicationService: LoanApplicationService,
    ) {
        this.form = this.fb.group({
          exposureParameterId: [0],
          customerTypeId: [0],
          description: '',
          percentage: [0],
          shareHolderAmount: [0]
        });
    }

    ngOnInit() {
        this.getAllExposure();
        this.cols = [
                      { field: 'customerTypeName', header: 'customerTypeName' },
                      { field: 'description', header: 'description' },
                      { field: 'percentage', header: 'percentage' },
                      { field: 'shareHolderAmount', header: 'shareHolderAmount' },
                    ];
    }


    showAddNew() {
      this.form = this.fb.group({
        exposureParameterId: 0,
        customerTypeId: 0,
        description: '',
        percentage: '',
        shareHolderAmount: ''
    });
        this.displayExposure = true;
    }

    getAllExposure() {
        this.loadingService.show();
        this.loanApplicationService.getAllExposure().subscribe(data => {
            this.loadingService.hide();
            this.ExposureList = data.exposure;
        }, err => {
          this.loadingService.hide()
        });
    }
    editExposure(row) {
        this.formTitle = 'Edit Exposure Parameter';
        this.form = this.fb.group({
            exposureParameterId: [row.exposureParameterId],
            customerTypeId: [row.customerTypeId],
            description: [row.description],
            percentage: [row.percentage],
            shareHolderAmount: [row.shareHolderAmount]
        });
        this.displayExposure = true;
    }

    rowClicked(row: any): void {

      }

    deleteExposure(row) {
        const __this = this;
        swal.fire({
            title: 'Are you sure you want to delete this record?',
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();
                __this.loanApplicationService
                    .deleteExposure(row.exposureParameterId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data['result'] == true) {
                            swal.fire(
                                'GOS FINANCIAL',
                                'Record deleted successful.',
                                'success'
                            );
                            __this.getAllExposure();
                        } else {
                            swal.fire(
                                'GOS FINANCIAL',
                                'Record not deleted',
                                'error'
                            );
                        }
                    });
            } else {
                swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
            }
        });
    }
    submitExposure(formObj) {
      this.loadingService.show();
      formObj.value.customerTypeId = parseInt(formObj.value.customerTypeId);
      formObj.value.percentage = parseFloat(formObj.value.percentage);
      formObj.value.shareHolderAmount = parseFloat(formObj.value.shareHolderAmount);
      this.loanApplicationService.addUpdateExposure(formObj.value).subscribe(
          data => {
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                  swal.fire('GOS FINANCIAL', message, 'success');
                  this.getAllExposure();
                  this.form.reset();
                  this.displayExposure = false;
              } else {
                  swal.fire('GOS FINANCIAL', message, 'error');
              }
            this.loadingService.hide();
          },
          err => {
            const message = err.status.message.friendlyMessage;
              this.loadingService.hide();
              swal.fire('GOS FINANCIAL', message, 'error');
          }
      );
  }

    multipleDelete(){
        if (this.selectedExposure.length === 0) {
            swal.fire(
                "GOS FINANCIAL",
                "Please select records you want to delete",
                "error"
            );
            return;
        }
        let tempData = this.selectedExposure;
        let targetIds = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                let data ={
                    targetId: el.companyStructureId,
                }
                targetIds.push(data);
            });
        }
        let body = {
            targetIds: targetIds
        }
        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            // if (result.value) {
            //     __this.loadingService.show();
            //
            //     __this.companyService
            //         .deleteMultipleCompanyStructure(body)
            //         .subscribe(data => {
            //             __this.loadingService.hide();
            //             if (data["result"] == true) {
            //                 swal.fire(
            //                     "GOS FINANCIAL",
            //                     "Record deleted successful.",
            //                     "success"
            //                 );
            //                 __this.getAllCompanyStructure();
            //             } else {
            //                 swal.fire(
            //                     "GOS FINANCIAL",
            //                     "Record not deleted",
            //                     "error"
            //                 );
            //             }
            //         });
            // } else {
            //     swal.fire("GOS FINANCIAL", "Cancelled", "error");
            // }
        });
    }
}
