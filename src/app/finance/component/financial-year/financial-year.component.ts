import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {GLService} from '../../../core/services/gl.service';
import {Router} from '@angular/router';
import swal from "sweetalert2";
import {FinancalYearService} from '../../../core/services/financal-year.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-financial-year',
  templateUrl: './financial-year.component.html',
  styleUrls: ['./financial-year.component.css']
})
export class FinancialYearComponent implements OnInit {
    financialYearInformation: any[] = [];
    @ViewChild('fileInput') fileInput: any;
    selectedfinancialYearInformation: any[];
    private fileToUpload: File;
    viewHeight: any = '600px';
  cols: any[] = [];
    constructor(
        private loadingService: LoadingService,
        private glService: GLService,
        private router: Router,
        private financialYearService: FinancalYearService
    ) {}

    ngOnInit() {
      this.cols = [
        {
          header: 'name',
          field: 'name',
        },
        {
          header: 'startDate',
          field: 'startDate'
        },
        {
          header: 'endDate',
          field: 'endDate'
        },
        {
          header: 'status',
          field: 'status'
        }
      ]
        this.getAllFinancialYear();
    }

    showAddNew() {
        this.router.navigateByUrl("/finance/financial-year-info");
    }

    getAllFinancialYear() {
        this.loadingService.show();
        this.financialYearService.getAllFinacialYear().subscribe(data => {
            this.loadingService.hide();
            this.financialYearInformation = data.financialYear;


        }, err => {

            this.loadingService.hide()
        }, () => {});
    }
    editFinancialYear(row) {
        this.router.navigate(["/finance/financial-year-info"], {
            queryParams: { editfinancialyear: row.financialYearId }
        });
    }

    rowClicked(row: any): void {

    }

    deleteGL(row) {
        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete user?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.glService
                    .deleteGL(row.glId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllFinancialYear();
                        } else {
                            swal.fire(
                                "GOS FINANCIAL",
                                "Record not deleted",
                                "error"
                            );
                        }
                    });
            } else {
                swal.fire("GOS FINANCIAL", "Cancelled", "error");
            }
        });
    }
    exportFinancialYear() {
        this.loadingService.show();
        this.financialYearService.exportFinancialYear().subscribe(response => {
            this.loadingService.hide();
            const data = response.export;
            // const message = response.status.message.friendlyMessage;
            if (data != undefined) {
                const byteString = atob(data);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const bb = new Blob([ab]);
                try {
                    const file = new File([bb], 'Financial Year.xlsx', {
                        type: 'application/vnd.ms-excel'
                    });
                    saveAs(file);
                } catch (err) {
                    const textFileAsBlob = new Blob([bb], {
                        type: 'application/vnd.ms-excel'
                    });
                    window.navigator.msSaveBlob(textFileAsBlob, 'Financial Year.xlsx');
                }
            } else {
              swal.fire(`GOS FINANCIAL`, 'Unable to download', 'error')
            }
        }, err => {
            this.loadingService.hide()
          swal.fire(`GOS FINANCIAL`, 'Unable to download', 'error')
        });
    }
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }
    uploadFinancialYear() {
        if (this.fileToUpload == null) {
            swal.fire(
                'GOS FINANCIAL',
                'Please select upload document to continue',
                'error'
            );
            return;
        }
      if (this.fileToUpload.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        return swal.fire(
          "GOS FINANCIAL",
          "Only excel files allowed",
          "error"
        )
      }
        this.loadingService.show();
        this.financialYearService.uploadFinancialYear(this.fileToUpload).then(
            data => {
              const message = data.status.message.friendlyMessage;
              this.loadingService.hide();
               if (data.status.isSuccessful) {

                   this.fileToUpload = null;
                   this.getAllFinancialYear();
                   this.fileInput.nativeElement.value = '';
                   swal.fire('GOS FINANCIAL', message, 'success');
               } else {

                   this.fileToUpload = null;
                   this.fileInput.nativeElement.value = '';
                   swal.fire('GOS FINANCIAL', message, 'success');
               }
            }
        ).catch(err => {
            this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
            this.fileInput.nativeElement.value = '';
            swal.fire('GOS FINANCIAL', message, 'success');
        });
    }
    multipleDelete() {
        if (this.selectedfinancialYearInformation.length === 0) {
            swal.fire(
                'GOS FINANCIAL',
                'Please select records you want to delete',
                'error'
            );
            return;
        }
        const tempData = this.selectedfinancialYearInformation;
        const targetIds = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                // const data = {
                //     targetId: el.financialYearId
                // };
                targetIds.push(el.financialYearId);
            });
        }
        const body = {
            ids: targetIds
        };
        const __this = this;
        swal.fire({
            title: 'Are you sure you want to delete record?',
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.financialYearService
                    .multipleDeleteMethod(body)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        const message = data.status.message.friendlyMessage;
                        if (data.deleted) {
                            swal.fire(
                                'GOS FINANCIAL',
                                message,
                                'success'
                            ).then(() => {
                             setTimeout(() => {
                               __this.getAllFinancialYear();
                             }, 1000)
                            });
                        } else {
                            swal.fire(
                                'GOS FINANCIAL',
                                message,
                                'error'
                            );
                        }
                    }, err => {
                      const message = err.status.message.friendlyMessage;
                      this.loadingService.hide();
                      swal.fire(
                        'GOS FINANCIAL',
                        message,
                        'error'
                      );
                    });
            } else {
                swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
            }
        });
    }

}
