import { SupplierService } from '../../../../core/services/supplier.service';
import swal from 'sweetalert2';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
})
export class SupplierListComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  activeIndex: number = 0;
  supplierInformation: any[] = [];
  selectedSupplierInformation: any[];
  viewHeight: string = '600px';
  cols: any[];
  fileToUpload: File;
  private selectedItem: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'supplierTypeName',
        field: 'supplierTypeName',
      },
      {
        header: 'name',
        field: 'name',
      },
      {
        header: 'supplierNumber',
        field: 'supplierNumber',
      },
      {
        header: 'createdOn',
        field: 'createdOn',
      },
      {
        header: 'email',
        field: 'email',
      },
      {
        header: 'phoneNo',
        field: 'phoneNo',
      },
      {
        header: 'statusName',
        field: 'statusName',
      },
    ];
    this.getAllSupplier();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }
  showAddNew() {
    this.router.navigate(['/purchases-and-supplier/supplier-info']);
  }

  getAllSupplier() {
    this.loadingService.show();
    this.supplierService.getAllSupplier().subscribe(
      (data) => {
        this.loadingService.hide();
        this.supplierInformation = data.suppliers;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  editSupplier(row) {
    this.router.navigate(['/purchases-and-supplier/supplier-info'], {
      queryParams: { id: row.supplierId },
    });
  }
  deleteSupplier(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService
            .deleteSupplier(row.supplierId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'User deleted successful.',
                  'success'
                );
                __this.getAllSupplier();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  openNext() {
    this.activeIndex = this.activeIndex === 5 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 5 : this.activeIndex - 1;
  }

  multipleDelete() {
    if (this.selectedSupplierInformation.length == 0) {
      return swal.fire(`GOS FINANCIALS`, `Select item(s) to delete`, `error`);
    }
    let tempData = this.selectedSupplierInformation;
    let ids = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        const data = {
          targetId: el.supplierId,
        };
        ids.push(data);
        // let data = el.depositAccountId;
        // this.AccountSetup.push(data);
      });
      const payload = { req: ids };
      swal
        .fire({
          title: 'Are you sure you want to delete record?',
          text: "You won't be able to revert this",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes!',
        })
        .then((result) => {
          if (result.value) {
            this.loadingService.show();
            return this.supplierService.deleteSupplierInfo(payload).subscribe(
              (res) => {
                this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.deleted) {
                  swal.fire('GOS FINANCIAL', message, 'success');
                  this.selectedSupplierInformation = [];
                  this.getAllSupplier();
                } else {
                  swal.fire(`GOS FINANCIAL`, message, 'error');
                }
              },
              (err) => {
                this.loadingService.hide();
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            );
          } else {
            swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
          }
        });
    }
  }

  exportItems() {
    this.loadingService.show();
    this.supplierService.exportSupplier().subscribe(
      (response) => {
        this.loadingService.hide();
        let data = response;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], 'Suppliers List.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(textFileAsBlob, 'Suppliers List.xlsx');
          }
        } else {
          return swal.fire('GOS FINANCIAL', 'An error occurred', 'error');
        }
      },
      (err) => {
        return this.loadingService.hide();
      }
    );
  }
  uploadItems() {
    if (this.fileToUpload == null) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
      return;
    }
    if (
      this.fileToUpload.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return swal.fire('GOS FINANCIAL', 'Only excel files allowed', 'error');
    }
    this.loadingService.show();
    this.supplierService
      .uploadSupplierInfo(this.fileToUpload)
      .then((data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          this.getAllSupplier();
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const error = JSON.parse(err);
        // console.log(error);
        if (error.status) {
          const message = error.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        } else {
          const message = error.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      });
  }

  handleFileInput(file: any) {
    this.fileToUpload = file.item(0);
  }

  sendForApproval(id) {
    this.loadingService.show();
    return this.supplierService.sendForApproval(id).subscribe(
      (res) => {
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, 'success').then(() => {
            this.getAllSupplier();
          });
        } else {
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, 'error');
      }
    );
  }
}
