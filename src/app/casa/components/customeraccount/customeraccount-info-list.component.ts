import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { CustomerAccountService } from "src/app/core/services/customeraccount.service";

@Component({
    selector: "app-customeraccount-info-list",
    templateUrl: "./customeraccount-info-list.component.html"
})
export class CustomerAccountInfoListComponent implements OnInit {
    customeraccountInformation: any[] = [];
    selectedcustomeraccountInformation: any[];
    viewHeight: any = '600px';
    private fileToUpload: File;
    cols: any[];
    constructor(
        private loadingService: LoadingService,
        private customeraccountInfoService: CustomerAccountService,
        private router: Router
    ) {}

    ngOnInit() {
        this.cols = [
            { field: "productAccountNumber", header: "productAccountNumber" },
            { field: "productAccountName", header: "productAccountName" },
            { field: "productName", header: "productName"},
            // { field: "firstName", header: "firstName"},
            // { field: "phoneNumber", header: "phoneNumber"},
            // { field: "lastName", header: "lastName"},
        ];
        this.getAllCustomerAccount();
    }

    showAddNew() {
        this.router.navigate(["/casa/customeraccount-info"]);
    }

    getAllCustomerAccount() {
        this.loadingService.show();
        this.customeraccountInfoService.getAllCustomerAccount().subscribe(data => {
            this.loadingService.hide();
            this.customeraccountInformation = data.customerLite;
        }, err => {
          this.loadingService.hide()
        });
    }
    editCustomerAccount(row) {
        this.router.navigate(["/casa/customeraccount-info"], {
            queryParams: { editcustomeraccountinfo: row.casaAccountId }
        });
    }
    deleteCustomerAccount(row) {
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

                __this.customeraccountInfoService
                    .deleteCustomerAccount(row.casaAccountId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllCustomerAccount();
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
    exportCasa() {
        this.loadingService.show();
        // this.userAccountService.exportUsers().subscribe(response => {
        //     this.loadingService.hide();
        //     const data = response.result;
        //     if (data != undefined) {
        //         const byteString = atob(data);
        //         const ab = new ArrayBuffer(byteString.length);
        //         const ia = new Uint8Array(ab);
        //         for (let i = 0; i < byteString.length; i++) {
        //             ia[i] = byteString.charCodeAt(i);
        //         }
        //         const bb = new Blob([ab]);
        //         try {
        //             const file = new File([bb], 'users.xlsx', {
        //                 type: 'application/vnd.ms-excel'
        //             });
        //             saveAs(file);
        //         } catch (err) {
        //             const textFileAsBlob = new Blob([bb], {
        //                 type: 'application/vnd.ms-excel'
        //             });
        //             window.navigator.msSaveBlob(textFileAsBlob, 'users.xlsx');
        //         }
        //     }
        // });
    }
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }
    uploadCasa() {
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

    }
    multipleDelete() {
        if (this.selectedcustomeraccountInformation.length === 0) {
            swal.fire(
                'GOS FINANCIAL',
                'Please select records you want to delete',
                'error'
            );
            return;
        }
        const tempData = this.selectedcustomeraccountInformation;
        const targetIds = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                const data = {
                    targetId: el.userAccountId
                };
                targetIds.push(data);
            });
        }
        const body = {
            targetIds: targetIds
        };
        const __this = this;
        swal.fire({
            title: 'Are you sure you want to delete record?',
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            // if (result.value) {
            //     __this.loadingService.show();
            //
            //     __this.customerFsService
            //         .deleteMultipleUsers(body)
            //         .subscribe(data => {
            //             __this.loadingService.hide();
            //             if (data['result'] == true) {
            //                 swal.fire(
            //                     'GOS FINANCIAL',
            //                     'Record deleted successful.',
            //                     'success'
            //                 );
            //                 __this.getAllUser();
            //             } else {
            //                 swal.fire(
            //                     'GOS FINANCIAL',
            //                     'Record not deleted',
            //                     'error'
            //                 );
            //             }
            //         });
            // } else {
            //     swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
            // }
        });
    }
}
