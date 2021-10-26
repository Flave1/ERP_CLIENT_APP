import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoadingService } from '../../../../core/services/loading.service';
import { SupplierService } from '../../../../core/services/supplier.service';
import swal from 'sweetalert2';
import { SubGLService } from '../../../../core/services/subgl.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-supplier-type',
  templateUrl: './supplier-type.component.html',
  styleUrls: ['./supplier-type.component.css'],
})
export class SupplierTypeComponent implements OnInit {
  formTitle: string = 'Supplier Type Setup';
  form: any;
  supplierTypeId: number;
  glList: any[] = [];
  glArr: any[] = [];
  taxLists: any[] = [];
  taxArr: any[];
  selectedItems: any[] = [];
  dropdownSettings: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private loadingService: LoadingService,
    private supplierService: SupplierService,
    private router: Router,
    private subGlService: SubGLService
  ) {
    this.form = this.formBuilder.group({
      supplierTypeId: [0],
      supplierTypeName: [''],
      debitGL: [''],
      creditGL: [''],
      taxApplicable: [[]],
    });
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select Currencies',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      primaryKey: 'id',
      labelKey: 'itemName',
      classes: 'myclass custom-class',
    };
    this.route.queryParams.subscribe((param) => {
      this.supplierTypeId = param.id;
      if (this.supplierTypeId != undefined) {
        this.getSupplierType(this.supplierTypeId);
      }
    });
    // this.glList =  [
    //   {
    //     subGLId: 1,
    //     subGLName: 'Interest Receivable',
    //     subGLCode: 'INT-1093456'
    //   },
    //   {
    //     subGLId: 1,
    //     subGLName: 'Interest Payable',
    //     subGLCode: 'EXP-109356'
    //   }
    // ]
    // this.glArr = this.glList.map(item => ({
    //   label: `${item.subGLName} | ${item.subGLCode}`,
    //   value: item.subGLId
    // }));
    this.getSubGls();
    this.getTaxList();
  }
  getSubGls() {
    this.loadingService.show();
    return this.subGlService.getAllSubGL().subscribe(
      (data) => {
        this.loadingService.hide();
        this.glList = data.subGls;
        if (this.glList != null) {
          this.glArr = this.glList.map((item) => ({
            label: `${item.subGLName} | ${item.subGLCode}`,
            value: item.subGLId,
          }));
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getTaxList() {
    this.loadingService.show();
    return this.supplierService.getTaxSetups().subscribe(
      (data) => {
        this.loadingService.hide();
        this.taxArr = [];
        this.taxLists = data.tasxSetups;
        if (this.taxLists != null) {
          this.taxLists.forEach((el) => {
            this.taxArr.push({ itemName: el.taxName, id: +el.taxSetupId });
          });
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  submitInfo(form: any) {
    const payload = form.value;
    payload.gL = parseInt(payload.gL);
    payload.creditGL = payload.creditGL === '' ? 0 : payload.creditGL;
    payload.debitGL = payload.debitGL === '' ? 0 : payload.debitGL;
    // payload.taxApplicable = this.selectedItems;
    // payload.taxApplicable = parseInt(payload.taxApplicable);
    // if (!payload.taxApplicable) {
    //   return swal.fire('GOS FINANCIAL', 'Select applicable tax', 'error')
    // }
    // const body = {
    //   supplierTypeId: payload.supplierTypeId,
    //   name: payload.name,
    //   gL: parseInt(payload.gL),
    //   taxApplicable: payload.taxApplicable
    // }
    this.loadingService.show();
    return this.supplierService.updateSupplierType(payload).subscribe(
      (data) => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, 'success').then(() => {
          this.router.navigateByUrl(
            `/purchases-and-supplier/supplier-type-setup-list`
          );
        });
      },
      (err) => {
        this.loadingService.hide();
        if (err.status) {
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        } else {
          const message = err.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      }
    );
  }

  goBack() {
    this.location.back();
  }

  getSupplierType(id: number) {
    this.loadingService.show();
    return this.supplierService.getSupplierType(id).subscribe(
      (data) => {
        this.loadingService.hide();
        const row = data.suppliertypes[0];
        this.form = this.formBuilder.group({
          supplierTypeId: [row.supplierTypeId],
          supplierTypeName: [row.supplierTypeName],
          creditGL: [row.creditGL],
          debitGL: [row.debitGL],
          taxApplicable: [row.taxApplicable],
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  onItemSelect(id: any) {
    this.selectedItems.push(id);
  }
}
