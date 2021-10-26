import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { CollateralService } from 'src/app/core/services/collateral.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-collateral-customer-list',
    templateUrl: './collateral-customer-list.component.html'
})
export class CollateralCustomerListComponent implements OnInit {
    collateralCustomers: any[] = [];
    selectedCollateralCustomer: any[];
    cols: any[];
    @ViewChild('fileInput') fileInput: ElementRef;
    viewHeight: any = '600px';
    fileToUpload: File;
    constructor(
        private loadingService: LoadingService,
        private collateralService: CollateralService,
        private router: Router
    ) {}

    ngOnInit() {
        this.cols = [
            { field: 'collateralCode', header: 'collateralCode' },
            { field: 'collateralTypeName', header: 'collateralTypeName' },
            { field: 'customerName', header: 'customerName' },
            { field: 'collateralValue', header: 'collateralValue' }
        ];
        this.getAllCollateralCustomer();
    }

    showAddNew() {
        this.router.navigate(['/credit/collateral-customer']);
    }

    getAllCollateralCustomer() {
        this.loadingService.show();
        this.collateralService.getAllCollateralCustomer().subscribe(data => {
            this.loadingService.hide();
            this.collateralCustomers = data.collateralCustomers;
        }, err => {
          this.loadingService.hide()
        });
    }
    editCollateralCustomer(row) {
        this.router.navigate(['/credit/collateral-customer'], {
            queryParams: { editcollateralCustomer: row.collateralCustomerId }
        });
    }
    onRowSelect(event) {
        this.router.navigate(['/credit/collateral-customer'], {
            queryParams: {
                editcollateralCustomer: event.data.collateralCustomerId
            }
        });
    }
    rowClicked(row: any): void {

    }

    deleteCollateralCustomer(row) {
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

                __this.collateralService
                    .deleteCollateralCustomer(row.collateralCustomerId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data['result'] == true) {
                            swal.fire(
                                'GOS FINANCIAL',
                                'User deleted successful.',
                                'success'
                            );
                            __this.getAllCollateralCustomer();
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

    exportCollateralCustomer() {
        this.loadingService.show();
        this.collateralService.exportCollateralCustomer().subscribe(response => {
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
                    const file = new File([bb], 'CollateralCustomer.xlsx', {
                        type: 'application/vnd.ms-excel'
                    });
                    saveAs(file);
                } catch (err) {
                    const textFileAsBlob = new Blob([bb], {
                        type: 'application/vnd.ms-excel'
                    });
                    window.navigator.msSaveBlob(textFileAsBlob, 'CollateralCustomer.xlsx');
                }
            }
        });
    }

    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }


    uploadCollateralCustomer() {
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
        this.collateralService.uploadCollateralCustomer(this.fileToUpload).then(
            data => {
                this.loadingService.hide();
               if (data.success) {
                   this.fileToUpload = null;
                   this.getAllCollateralCustomer();
                   this.fileInput.nativeElement.value = '';
                   swal.fire('GOS FINANCIAL', data.message, 'success');
               } else {
                   this.fileToUpload = null;
                   this.fileInput.nativeElement.value = '';
                   swal.fire('GOS FINANCIAL', data.message, 'error');
               }
            }
        ).catch(err => {
            this.fileInput.nativeElement.value = '';
            swal.fire('GOS FINANCIAL', err.message, 'success');
        });
    }
    multipleDelete() {
        if (this.selectedCollateralCustomer.length == 0) {
            swal.fire(
                'GOS FINANCIAL',
                'Please select records you want to delete',
                'error'
            );
            return;
        }
        const tempData = this.selectedCollateralCustomer;
        const targetIds = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                const data =  el.collateralCustomerId;
                targetIds.push(data);
            });
        }
        const body = {
          collateralCustomerIds: targetIds
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

                __this.collateralService
                    .deleteMultipleCollateralCustomer(body)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data.deleted == true) {
                            swal.fire(
                                'GOS FINANCIAL',
                                'Record deleted successful.',
                                'success'
                            );
                            __this.getAllCollateralCustomer();
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
}
