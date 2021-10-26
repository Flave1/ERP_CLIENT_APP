import swal from "sweetalert2";
import {Component, OnInit, ViewChild} from '@angular/core';
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { SubGLService } from "src/app/core/services/subgl.service";
import { saveAs } from 'file-saver';
import {CompanyService} from '../../../core/services/company.service';
import {JwtService} from '../../../core/services/jwt.service';


@Component({
    selector: "app-subGL-list",
    templateUrl: "./subgl-list.component.html"
})
export class SubGLListComponent implements OnInit {
    subGLInformation: any[] = [];
    @ViewChild('fileInput') fileInput: any;
    selectedsubGLInformation: any[];
    private fileToUpload: File;
    viewHeight: any = '600px';
    companies: any[] = [];
    staffId: number;
  cols: any[] = [];
    constructor(
        private loadingService: LoadingService,
        private subGLService: SubGLService,
        private router: Router,
        private companyService: CompanyService,
        private jwtService: JwtService
    ) {}

    ngOnInit() {
      this.cols = [
        {
          header: 'subGLCode',
          field: 'subGLCode'
        },
        {
          header: 'subGLName',
          field: 'subGLName'
        },
        {
          header: 'glName',
          field: 'glName'
        }
      ]
      this.staffId = this.jwtService.getUserDetails().staffId;
        this.getAllSubGL();
        this.getCompanies();
    }

    showAddNew() {
        this.router.navigate(["/finance/subGL-info"]);
    }

    getAllSubGL() {
        this.loadingService.show();
        this.subGLService.getAllSubGL().subscribe(data => {
            this.loadingService.hide();
            this.subGLInformation = data.subGls;


        });
    }
    editSubGL(row) {
        this.router.navigate(["/finance/subGL-info"], {
            queryParams: { editsubGL: row.subGLId }
        });

    }

    rowClicked(row: any): void {

      }

    deleteSubGL(row) {
        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.subGLService
                    .deleteSubGL(row.subGLId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllSubGL();
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
    exportSubGL() {
        this.loadingService.show();
        this.subGLService.exportSubGL().subscribe(response => {
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
                 const file = new File([bb], 'Sub Ledger.xlsx', {
                   type: 'application/vnd.ms-excel'
                 });
                 saveAs(file);
               } catch (err) {
                 const textFileAsBlob = new Blob([bb], {
                   type: 'application/vnd.ms-excel'
                 });
                 window.navigator.msSaveBlob(textFileAsBlob, 'Sub Ledger.xlsx');
               }
             } else {
               swal.fire(`GOS FINANCIAL`, 'Unable to download', 'error')
             }
        }, err => {
             this.loadingService.hide();
          swal.fire(`GOS FINANCIAL`, 'Unable to download', 'error')
        });
    }
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }
    uploadSubGL() {
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
        this.subGLService.uploadSubGL(this.fileToUpload).then(
            data => {
              const message = data.status.message.friendlyMessage;
               if (data.status.isSuccessful) {
                   this.fileToUpload = null;
                   this.getAllSubGL();
                   this.fileInput.nativeElement.value = '';
                   swal.fire('GOS FINANCIAL', message, 'success');
               } else {
                   this.fileToUpload = null;
                   this.fileInput.nativeElement.value = '';
                   swal.fire('GOS FINANCIAL', message, 'error');
               }
               this.loadingService.hide()
            }
        ).catch(err => {
            this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
            this.fileInput.nativeElement.value = '';
            swal.fire('GOS FINANCIAL', message, 'error');
        });
    }
    multipleDelete() {
        if (this.selectedsubGLInformation.length === 0) {
            swal.fire(
                'GOS FINANCIAL',
                'Please select records you want to delete',
                'error'
            );
            return;
        }
        const tempData = this.selectedsubGLInformation;
        const targetIds = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                // const data = {
                //     targetId: el.subGLId
                // };
                targetIds.push(el.subGLId);
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

                __this.subGLService
                    .multipleDeleteSubGL(body)
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
                                __this.getAllSubGL();
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
                      this.loadingService.hide()
                    });
            } else {
                swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
            }
        });
    }

    getCompanies() {
      this.loadingService.show();
      return this.companyService.getCompanyStructureByStatffId(this.staffId).subscribe(data => {
        this.loadingService.hide();
        this.companies = data.companyStructures
      }, err => {
        this.loadingService.hide()
      })
    }

  filterGL(value: any) {
    if (value == 0) {
      return this.getAllSubGL()
    } else {
      this.loadingService.show();
      return this.subGLService.getSubGlByCompany(value).subscribe(data => {
        this.loadingService.hide();
        this.subGLInformation = data.subGls
      }, err => {
        this.loadingService.hide();
      })
    }
  }
}
