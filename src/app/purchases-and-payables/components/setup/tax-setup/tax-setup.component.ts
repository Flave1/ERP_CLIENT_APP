import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Location } from "@angular/common";
import { saveAs } from "file-saver";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingService } from "../../../../core/services/loading.service";
import { SupplierService } from "../../../../core/services/supplier.service";
import swal from "sweetalert2";
import { SubGLService } from "../../../../core/services/subgl.service";
@Component({
  selector: "app-tax-setup",
  templateUrl: "./tax-setup.component.html",
  styleUrls: ["./tax-setup.component.css"]
})
export class TaxSetupComponent implements OnInit {
  formTitle: string = "Tax Setup";
  form: FormGroup;
  id: number = 0;
  glArr: any[] = [];
  subGls: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private supplierService: SupplierService,
    private router: Router,
    private subGlService: SubGLService
  ) { }

  ngOnInit() {
    this.getSubGls();
    this.route.queryParams.subscribe(param => {
      this.id = param.id;
      if (this.id != undefined) {
        this.getTaxSetup(this.id);
      }
    });
    this.form = this.formBuilder.group({
      taxSetupId: [0],
      taxName: [""],
      percentage: [""],
      type: [""],
      subGl: [""],
    });
    // this.subGls = [
    //   {
    //     glId: 1,
    //     glName: "Interest Receivable"
    //   },
    //   {
    //     glId: 1,
    //     glName: "Interest Payable"
    //   }
    // ];
  }

  getSubGls() {
    this.loadingService.show();
    return this.subGlService.getAllSubGL().subscribe(data => {
      this.loadingService.hide()
      this.subGls = data.subGls;
      this.glArr = this.subGls.map(item => ({
        label: `${item.subGLName} | ${item.subGLCode}`,
        value: item.subGLId
      }));
    }, err => {
      this.loadingService.hide()
    })
  }
  submitInfo(form: FormGroup) {
    const payload = form.value;
    payload.percentage = parseFloat(payload.percentage);
    payload.subGl = parseInt(payload.subGl);
    payload.taxSetupId = parseInt(payload.taxSetupId);
    this.loadingService.show();
    return this.supplierService.updateTaxSetup(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, "success");
          this.router.navigateByUrl(`/purchases-and-supplier/tax-setup-list`)
        } else {
          swal.fire(`GOS FINANCIAL`, message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        if (err.status) {
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, "error");
        } else {
          const message = err.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, "error");
        }
      }
    );
  }

  goBack() {
    this.location.back();
  }

  getTaxSetup(taxSetupId: number) {
    this.loadingService.show();
    return this.supplierService.getTaxSetup(taxSetupId).subscribe(
      data => {
        this.loadingService.hide();
        const row = data.tasxSetups[0];
        this.form = this.formBuilder.group({
          taxName: [row.taxName],
          percentage: [row.percentage],
          type: [row.type],
          subGl: [row.subGL],
          taxSetupId: row.taxSetupId
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  exportTaxSetup() {
    this.loadingService.show();
    this.supplierService.exportTaxSetup().subscribe(response => {
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
          var file = new File([bb], "StaffList.xlsx", {
            type: "application/vnd.ms-excel"
          });

          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: "application/vnd.ms-excel"
          });
          window.navigator.msSaveBlob(
            textFileAsBlob,
            "TaxSetup.xlsx"
          );
        }
      }
    });
  }


}
