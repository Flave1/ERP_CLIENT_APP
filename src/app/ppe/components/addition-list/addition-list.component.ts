import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { Router } from '@angular/router';
import { PpeService } from '../../services/ppe.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { SubGLService } from '../../../core/services/subgl.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-addition-list',
  templateUrl: './addition-list.component.html',
  styleUrls: ['./addition-list.component.css'],
})
export class AdditionListComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  additionList: any[] = [];
  selectedAdditionList: any[] = [];
  selectedItem: any;
  viewHeight: string = '600px';
  cols: any[];
  fileToUpload: File;
  displayAddition: boolean = false;
  assetClassificationsArr: { label: any; value: number[] | any[] }[];
  assetClassifications: any[] = [];
  proposedUsefulLife: number;
  residualValue: number;
  subGl: number;
  glArr: any[] = [];
  glList: any[] = [];
  subGlAddition: any;
  assetClassificationId: string = '';
  form: FormGroup;

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private ppeService: PpeService,
    private subGLService: SubGLService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.cols = [
      {
        field: 'lpoNumber',
        header: 'lpoNumber',
      },
      {
        field: 'dateOfPurchase',
        header: 'dateOfPurchase',
      },
      {
        field: 'quantity',
        header: 'quantity',
      },
      {
        field: 'description',
        header: 'description',
      },
      {
        field: 'location',
        header: 'location',
      },
    ];
    this.getAdditions();
    this.getAssetClassification();
    this.getSubGls();
    this.form = this.fb.group({
      additionFormId: 0,
      lpoNumber: [""],
      dateOfPurchase: [""],
      description: [""],
      quantity: [""],
      cost: [""],
      assetClassificationId: [""],
      subGlAddition: [""],
      usefulLife: [""],
      residualValue: [""],
      location: [""]
    });
  }
  getAdditions() {
    this.loadingService.show();
    return this.ppeService.getAdditionsLPO().subscribe(
      (data) => {
        this.loadingService.hide();
        this.additionList = data.lpos;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  showAddNew() {
    this.router.navigateByUrl('/ppe/addition');
  }
  multipleDelete() {
    if (this.selectedItem.length == 0) {
      return swal.fire(`GOS FINANCIAL`, `Select item(s) to delete`, `error`);
    }
    let tempData = this.selectedItem;
    let ids = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        ids.push(el.additionFormId);
        // let data = el.depositAccountId;
        // this.AccountSetup.push(data);
      });
      const payload = { itemIds: ids };
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
            return this.ppeService.deleteAdditions(payload).subscribe(
              (res) => {
                this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.deleted) {
                  swal.fire('GOS FINANCIAL', message, 'success');
                  this.getAdditions();
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

  displayAdditionList() {
    if (this.selectedItem.length === 0) {
      return swal.fire(
        'GOS FINANCIAL',
        'Please select items to reassess',
        'error'
      );
    }
    this.displayAddition = true;
    this.selectedAdditionList = this.selectedItem;
  }

  exportItems() {
    this.loadingService.show();
    this.ppeService.exportAdditions().subscribe(
      (response) => {
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
            const file = new File([bb], 'Additions.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(textFileAsBlob, 'Additions.xlsx');
          }
        } else {
          swal.fire(`GOS FINANCIAL`, 'Unable to download data', 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, 'error');
      }
    );
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadItems() {
    if (this.fileToUpload == null) {
      return swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
    }
    if (
      this.fileToUpload.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return swal.fire('GOS FINANCIAL', 'Only excel files allowed', 'error');
    }
    this.loadingService.show();
    this.ppeService
      .uploadAdditions(this.fileToUpload)
      .then((data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAdditions();
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  editItem(x) {
    this.router.navigate(['/ppe/addition'], {
      queryParams: {
        id: x.additionFormId,
      },
    });
  }
  getSubGls() {
    this.loadingService.show();
    return this.subGLService.getAllSubGL().subscribe(
      (data) => {
        this.loadingService.hide();
        this.glList = data.subGls;
        this.glArr = this.glList.map((item) => ({
          label: `${item.subGLName} | ${item.subGLCode}`,
          value: item.subGLId,
        }));
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getAssetClassification() {
    this.loadingService.show();
    return this.ppeService.getAssetClassifications().subscribe(
      (data) => {
        this.loadingService.hide().then(() => {
          this.assetClassifications = data.assetClassifications;
          this.assetClassificationsArr = data.assetClassifications.map(
            (item) => ({
              label: item.classificationName,
              value: item.asetClassificationId,
            })
          );
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getItemValue(id: number, row, index) {
    const item = this.assetClassifications.find(
      (item) => item.asetClassificationId === +id
    );
    // this.subGlAddition = item.subGlAddition;
    // this.proposedUsefulLife = item.usefulLifeMax;
    // this.residualValue = (row.amountPayable * item.residualValue) / 100;
    this.selectedAdditionList = this.selectedAdditionList.map((data) => {
      if (row.plpoId === data.plpoId) {
        return {
          ...data,
          subGlAddition: item.subGlAddition,
          proposedUsefulLife: item.usefulLifeMax,
          residualValue: (row.amountPayable * item.residualValue) / 100,
        };
      }
      return data;
    });
  }

  close() {
    this.displayAddition = false;
    this.selectedAdditionList = [];
    this.selectedItem = [];
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }

  saveAdditionList(selectedItem) {
    console.log(selectedItem);
    const payload = [];
    selectedItem.forEach(item => {
      const data = {
        additionFormId: 0,
        lpoNumber: item.lpoNumber,
        dateOfPurchase: this.formatDate(item.deliveryDate),
        description: item.description,
        quantity: parseInt(item.quantity),
        cost: parseFloat(item.grossAmount),
        location: item.address,
        assetClassificationId: +item.assetClassificationId,
        subGlAddition: item.subGlAddition,
        usefulLife: item.proposedUsefulLife,
        residualValue: item.residualValue,
        subGlDepreciation: 0,
        subGlAccumulatedDepreciation: 0,
        subGlDisposal: 0,
      };
      payload.push(data);
    });
    swal
      .fire({
        title: "Are you sure you want to reassess this item(s)?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          this.loadingService.show();
          return this.ppeService.updateAddition(payload).subscribe(
            res => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.selectedItem = [];
                this.displayAddition = false;
                this.getAdditions();
              } else {
                swal.fire(`GOS FINANCIAL`, message, "error");
              }
            },
            err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire(`GOS FINANCIAL`, message, "error");
            }
          );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}
