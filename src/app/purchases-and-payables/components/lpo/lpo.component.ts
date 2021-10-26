import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { PurchaseService } from '../../../core/services/purchase.service';
import { LoadingService } from '../../../core/services/loading.service';
import { SubGLService } from '../../../core/services/subgl.service';
import { SupplierService } from '../../../core/services/supplier.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lpo',
  templateUrl: './lpo.component.html',
  styleUrls: ['./lpo.component.css'],
})
export class LpoComponent implements OnInit {
  @ViewChild('phaseFile') phaseFile: any;
  id: number;
  formTitle: string = 'LPO';
  form: FormGroup;
  lpoArr: any[] = [];
  glArr: any[] = [];
  proposedPaymentTerms: any[] = [];
  viewHeight: string = '600px';
  serviceTerms: any[] = [];
  subGlArr: any[] = [];
  subgls: any[] = [];
  displayReport: boolean = false;
  displayTestReport: boolean;
  taxArr: any[] = [];
  taxLists: any[] = [];
  tax: any[] = [];
  phaseDocument: File;
  approvalStatus: number;
  reportSrc: SafeResourceUrl;
  paymentTerms: any[] = [];
  constructor(
    private _route: ActivatedRoute,
    private _location: Location,
    private _purchasesService: PurchaseService,
    private _loadingService: LoadingService,
    private _fb: FormBuilder,
    private _subGlService: SubGLService,
    private _supplierService: SupplierService,
    private _router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      lpoNumber: [''],
      supplierNumber: [''],
      supplierAddress: [''],
      name: [''],
      deliveryDate: [null],
      requestDate: [null],
      grossAmount: [''],
      tax: [''],
      amountPayable: [''],
      location: [''],
      taxId: [[]],
      debitGl: [''],
      description: [''],
      servicetermsId: [''],
    });
    this._route.queryParams.subscribe((param) => {
      this.id = param.id;
      if (this.id !== undefined) {
        this.getSingleLpo(this.id);
      }
    });
    this.getSubGl();
    this.getServiceTerms();
  }
  getSubGl() {
    return this._subGlService.getAllSubGL().subscribe(
      (data) => {
        this.subgls = data.subGls;
        this.subGlArr = this.subgls.map((item) => ({
          label: `${item.subGLName} | ${item.subGLCode}`,
          value: item.subGLId,
        }));
      },
      (err) => {}
    );
  }
  getServiceTerms() {
    return this._supplierService.getServiceTerms().subscribe((data) => {
      this.serviceTerms = data.serviceTerms;
    });
  }
  getSingleLpo(id: number) {
    this._loadingService.show();
    return this._purchasesService.getSingleLpo(id).subscribe(
      (data) => {
        this._loadingService.hide();
        const row = data.lpOs[0];
        this.approvalStatus = row.approvalStatusId;
        this.form = this._fb.group({
          lpoNumber: row.lpoNumber,
          supplierNumber: row.supplierNumber,
          supplierAddress: row.supplierAddress,
          name: row.name,
          deliveryDate: new Date(row.deliveryDate),
          requestDate: new Date(row.requestDate),
          grossAmount: row.grossAmount,
          tax: row.tax,
          amountPayable: row.amountPayable,
          location: row.location,
          debitGl: row.debitGl,
          taxId: row.taxId,
          description: row.description,
          servicetermsId: row.servicetermsId,
        });
        const paymentTerms = row.paymentTerms;
        this.proposedPaymentTerms = paymentTerms.filter((item) => {
          return item.proposedBy === 1;
        });
        this.paymentTerms = paymentTerms.filter((item) => {
          return item.proposedBy === 2;
        });
        this.taxLists = row.taxes;
        if (this.taxLists != null) {
          this.taxLists.forEach((item) => {
            this.taxArr.push({ label: item.taxName, value: item.taxID });
          });
        }
      },
      (err) => {
        this._loadingService.hide();
      }
    );
  }
  submitInfo(form: FormGroup) {
    const data = form.value;
    if (data.taxId == null) {
      data.taxId = [];
    }
    const payload = {
      taxId: data.taxId,
      debitGl: data.debitGl,
      lpoId: +this.id,
      servicetermsId: +data.servicetermsId,
    };

    this._loadingService.show();
    this._purchasesService.updateLpo(payload).subscribe(
      (res) => {
        this._loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          this.taxArr = [];
          swal.fire('Successful', message, 'success').then(() => {
            this._router.navigateByUrl('/purchases-and-supplier/lpos');
          });
          // this._router.navigateByUrl('/purchases-and-supplier/lpos')
        } else {
          swal.fire('Error', message, 'error');
        }
      },
      (err) => {
        this._loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('Error', message, 'error');
      }
    );
  }

  goBack() {
    this._location.back();
  }

  requestPayment(item) {
    const payload = {
      paymentTermId: item.paymentTermId,
    };
    this._loadingService.show();
    return this._purchasesService.requestPayment(payload).subscribe(
      (res) => {
        this._loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('Successful', message, 'success').then(() => {
            this._router.navigateByUrl('/purchases-and-supplier/invoice-lists');
          });
        } else {
          swal.fire('Error', message, 'error');
        }
      },
      (err) => {
        this._loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('Error', message, 'error');
      }
    );
  }

  getValue(value) {}
  handleFileUpload(file: FileList) {
    this.phaseDocument = file.item(0);
  }
  savePaymentDetails(item: any) {
    const payload = {
      paymentTermId: item.paymentTermId,
      jobStatus: +item.status,
    };
    this._loadingService.show();
    return this._purchasesService
      .updateProjectPhase(this.phaseDocument, payload)
      .then((res) => {
        const message = res.status.message.fiendlyMessage;
        this._loadingService.hide();
        if (res.status.isSuccessful) {
          swal.fire('Successful', message, 'success');
          this.phaseFile.nativeElement.value = '';
          this.getSingleLpo(this.id);
        } else {
          swal.fire('Error', message, 'error');
        }
      })
      .catch((err) => {
        this._loadingService.hide();
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire('Error', message, 'error');
      });
  }

  download(id) {
    this._loadingService.show();
    return this._purchasesService.downloadCertificate(id).subscribe(
      (data) => {
        this._loadingService.hide();
        if (data.status.isSuccessful) {
          var byteString = atob(data.fIle);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], `${data.fileName}.${data.extension}`, {
              type: `${data.extension}`,
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: `${data.extension}`,
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              `${data.fileName}.${data.extension}`
            );
          }
        }
      },
      (err) => {
        this._loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('Error', message, 'error');
      }
    );
  }
}
