import { saveAs } from 'file-saver';
import { Component, OnInit, ViewChild } from "@angular/core";
import swal from "sweetalert2";
import { LoadingService } from "src/app/core/services/loading.service";
import { CollateralService } from "src/app/core/services/collateral.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-collateral-type-list",
    templateUrl: "./collateral-type-list.component.html"
})
export class CollateralTypeListComponent implements OnInit {
    collateralTypes: any[] = [];
    selectedCollateralType: any[];
    cols: any[];
    constructor(
        private loadingService: LoadingService,
        private collateralService: CollateralService,
        private router: Router
    ) {}

    ngOnInit() {
        this.cols = [
            { field: "name", header: "name" },
            { field: "details", header: "details" },
            {
                field: "requireInsurancePolicy",
                header: "requireInsurancePolicy"
            }
        ];
        this.getAllCollateralType();
    }

    showAddNew() {
        this.router.navigate(["/credit/collateral-type"]);
    }

    getAllCollateralType() {
        this.loadingService.show();
        this.collateralService.getAllCollateralType().subscribe(data => {
            this.loadingService.hide();
            this.collateralTypes = data.collateralTypes;
        }, err => {
          this.loadingService.hide()
        });
    }
    editCollateralType(row) {
        this.router.navigate(["/credit/collateral-type"], {
            queryParams: { editcollateraltype: row.collateralTypeId }
        });
    }
    onRowSelect(event) {
        this.router.navigate(["/credit/collateral-type"], {
            queryParams: { editcollateraltype: event.data.collateralTypeId }
        });
    }
    rowClicked(row: any): void {

    }

    deleteCollateralType(row) {
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

                __this.collateralService
                    .deleteCollateralType(row.collateralTypeId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllCollateralType();
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

    exportCollateralType() {
        this.loadingService.show();
        this.collateralService.exportCollateralType().subscribe(response => {
            this.loadingService.hide();
            let data = response.export;
            if (data != undefined) {
                var byteString = atob(data);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);
                try {
                    var file = new File([bb], "CollateralType.xlsx", {
                        type: "application/vnd.ms-excel"
                    });
                    saveAs(file);
                } catch (err) {
                    var textFileAsBlob = new Blob([bb], {
                        type: "application/vnd.ms-excel"
                    });
                    window.navigator.msSaveBlob(textFileAsBlob, "CollateralType.xlsx");
                }
            } else {
              swal.fire(`GOS FINANCIAL`, `Unable to export data`, 'error')
            }
        }, err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error')
        });
    }

    fileToUpload: File;
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
    }
    @ViewChild("fileInput") fileInput: any;
    viewHeight: any = '600px';

    uploadCollateralType() {
        if (this.fileToUpload == null) {
            swal.fire(
                "GOS FINANCIAL",
                "Please select upload document to continue",
                "error"
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
        this.collateralService.uploadCollateralType(this.fileToUpload).then(
            data => {
                this.loadingService.hide();
               if (data.status.isSuccessful) {
                   this.fileToUpload = null;
                   this.getAllCollateralType();
                   this.fileInput.nativeElement.value = "";
                   swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "success");
               } else {
                   this.fileInput.nativeElement.value = "";
                   swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
               }
            }
        ).catch(err => {
            this.loadingService.hide();
            this.fileInput.nativeElement.value = "";
            swal.fire("GOS FINANCIAL", err.message, "error");
        });
    }
    multipleDelete() {
        if (this.selectedCollateralType.length == 0) {
            swal.fire(
                "GOS FINANCIAL",
                "Please select records you want to delete",
                "error"
            );
            return;
        }
        let tempData = this.selectedCollateralType;
        let targetIds = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                let data =  el.collateralTypeId;
                targetIds.push(data);
            });
        }
        let body = {
          collateralTypeIds: targetIds
        };
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

                __this.collateralService
                    .deleteMultipleCollateralType(body)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        const message = data.status.message.friendlyMessage;
                        if (data.deleted) {
                            swal.fire(
                                "GOS FINANCIAL",
                                message,
                                "success"
                            );
                            __this.getAllCollateralType();
                        } else {
                            swal.fire(
                                "GOS FINANCIAL",
                                message,
                                "error"
                            );
                        }
                    });
            } else {
                swal.fire("GOS FINANCIAL", "Cancelled", "error");
            }
        }, err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        });
    }
}
