import {Component, OnInit, ViewChild} from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { CreditRiskScoreCardService } from 'src/app/core/services/creditriskscorecard';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import {saveAs} from 'file-saver'
import {CommonService} from "../../../core/services/common.service";

@Component({
    selector: 'app-credit-bureau-setup-list',
    templateUrl: './credit-bureau-setup-list.component.html'
})
export class CreditBureauSetupListComponent implements OnInit {
    @ViewChild('fileInput') fileInput: any;
    fileToUpload: File;
    creditBureauList: any[] = [];
    selectedCreditBureau: any[];
    viewHeight: any = '600px';
  cols: any[] = [];
    constructor(
        private loadingService: LoadingService,
        private creditService: CreditRiskScoreCardService,
        private router: Router,
        private commonService: CommonService
    ) {}

    ngOnInit() {
      this.cols = [
        {
          header: 'creditBureauName',
          field: 'creditBureauName'
        }
      ]
        this.getAllCreditBureua();
    }

    showAddNew() {
        this.router.navigate(['/credit/credit-bureau']);
    }

    getAllCreditBureua() {
        this.loadingService.show();
        this.creditService.getAllCreditBureau().subscribe(data => {
            this.loadingService.hide();
            this.creditBureauList = data.creditBureau;
        }, err => {
          this.loadingService.hide()
        });
    }
    editCreditBureau(row) {
        this.router.navigate(['/credit/credit-bureau'], {
            queryParams: { id: row.creditBureauId }
        });
    }

    rowClicked(row: any): void {

    }

    deleteCreditBureau(row) {
        const __this = this;
        swal.fire({
            title: 'Are you sure you want to delete user?',
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.creditService
                    .deleteCreditBureau(row.creditBureauId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data['result'] == true) {
                            swal.fire(
                                'GOS FINANCIAL',
                                'User deleted successful.',
                                'success'
                            );
                            __this.getAllCreditBureua();
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
    exportCreditBureau() {
        this.loadingService.show();
        this.creditService.exportCreditBureauData().subscribe(response => {
            this.loadingService.hide();
            const data = response.export;
            if (data != undefined) {
                const byteString = atob(data);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const bb = new Blob([ab]);
                try {
                    const file = new File([bb], 'Credit Bureau.xlsx', {
                        type: 'application/vnd.ms-excel'
                    });
                    saveAs(file);
                } catch (err) {
                    const textFileAsBlob = new Blob([bb], {
                        type: 'application/vnd.ms-excel'
                    });
                    window.navigator.msSaveBlob(
                        textFileAsBlob,
                        'Credit Bureau.xlsx'
                    );
                }
            } else {
              swal.fire(`GOS FINANCIAL`, 'Unable to download data', 'error');
            }
        }, err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        });
    }
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }

    multipleDelete(){
      if (this.selectedCreditBureau.length == 0) {
        return swal.fire('GOS FINANCIAL', 'Please select the records you want to delete', 'error')
      }
      let targetIds = [];
      this.selectedCreditBureau.forEach(el => {
        // let data = {
        //   targetId: el.creditBureauId
        // };
        targetIds.push(el.creditBureauId);
      });
      let payload = {ids: targetIds};
      swal.fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      }).then(result => {
        if (result.value) {
          this.loadingService.show();
          return this.creditService.multipleDeleteCreditBureau(payload).subscribe(res => {
            this.loadingService.hide();
            const message = res.status.message.friendlyMessage;
            if (res.deleted) {
              this.getAllCreditBureua();
              swal.fire('GOS FINANCIAL', message, 'success')
            } else {
              swal.fire('GOS FINANCIAL', message, 'error')
            }
          }, err => {
            this.loadingService.hide();
            const message = err.status.message.friendlyMessage;
            swal.fire('GOS FINANCIAL', message, 'error')
          })
        } else {
          swal.fire("Info", "Cancelled", "info");
        }
      }).catch(err => {
      })
    }

    uploadCreditBureau() {
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
        this.creditService.uploadCreditBureauData(this.fileToUpload).then(
            data => {
              this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                this.fileToUpload = null;
                this.getAllCreditBureua();
                this.fileInput.nativeElement.value = '';
                swal.fire('GOS FINANCIAL', message, 'success')
              } else {
                swal.fire('GOS FINANCIAL', message, 'error')
              }
            }
        ).catch(err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error')
        });
    }
}
