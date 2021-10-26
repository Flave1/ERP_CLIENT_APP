import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { UserAccountService } from './../../../core/services/user.service';
//import { UserAccountService } from "src/app/core/services/user.service";

@Component({
    selector: 'app-user-account-list',
    templateUrl: './user-account-list.component.html'
})
export class UserAccountListComponent implements OnInit {
    fileToUpload: File;
    // @ViewChild('fileInput') fileInput: any;
    @ViewChild("myInput")
    myInputVariable: ElementRef;
    userAccount: any[] = [];
    selectedUserAccount: any = {};
    cols: any[];
    viewHeight: any = '600px';
    constructor(
        private loadingService: LoadingService,
        private userAccountService: UserAccountService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getAllUser();
        this.cols = [
            { field: 'userName', header: 'Username' },
            { field: 'email', header: 'Email' },
            { field: 'phoneNumber', header: 'Phone Number' }
        ];
    }

    showAddNew() {
        this.router.navigate(['/admin/create-user']);
    }

    getAllUser() {
        this.loadingService.show();
        this.userAccountService.getAllUserAccount().subscribe(data => {
            this.loadingService.hide();
            this.userAccount = data['result'];
        }, err => {

          this.loadingService.hide()
        });
    }
    editUser(row) {
        this.router.navigate(['/admin/create-user'], {
            queryParams: { edituseraccount: row.userAccountId }
        });
    }
    deleteUser(row) {
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

                __this.userAccountService
                    .deleteUserAccount(row.userAccountId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data['result'] == true) {
                            swal.fire(
                                'GOS FINANCIAL',
                                'User deleted successful.',
                                'success'
                            );
                            __this.getAllUser();
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

    exportUsers() {
        this.loadingService.show();
        this.userAccountService.exportUsers().subscribe(response => {
            this.loadingService.hide();
            const data = response.result;
            if (data != undefined) {
                const byteString = atob(data);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const bb = new Blob([ab]);
                try {
                    const file = new File([bb], 'users.xlsx', {
                        type: 'application/vnd.ms-excel'
                    });
                    saveAs(file);
                } catch (err) {
                    const textFileAsBlob = new Blob([bb], {
                        type: 'application/vnd.ms-excel'
                    });
                    window.navigator.msSaveBlob(textFileAsBlob, 'users.xlsx');
                }
            }
        });
    }
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }
    uploadUsers() {
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
        this.userAccountService.uploadUsers(this.fileToUpload).then(
            data => {
                if (data.success) {
                    this.loadingService.hide();
                    // this.fileToUpload = null;
                    this.myInputVariable.nativeElement.value = "";
                    swal.fire("GOS FINANCIAL", data.message, "success");
                    this.getAllUser();
                } else {
                    this.loadingService.hide();
                    this.myInputVariable.nativeElement.value = "";
                    swal.fire("GOS FINANCIAL", data.message, "error");
                }
            }
        ).catch(err => {
            this.loadingService.hide();
            this.myInputVariable.nativeElement.value = "";
            swal.fire(
                "GOS FINANCIAL",
                err.message,
                "error"
            );
        });
    }
    multipleDelete() {
        if (this.selectedUserAccount.length == 0) {
            swal.fire(
                'GOS FINANCIAL',
                'Please select records you want to delete',
                'error'
            );
            return;
        }
        const tempData = this.selectedUserAccount;
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
            if (result.value) {
                __this.loadingService.show();

                __this.userAccountService
                    .deleteMultipleUsers(body)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data['result'] == true) {
                            swal.fire(
                                'GOS FINANCIAL',
                                'Record deleted successful.',
                                'success'
                            );
                            __this.getAllUser();
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
