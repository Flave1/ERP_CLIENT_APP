import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Location} from "@angular/common";
import {LoadingService} from "../../../../core/services/loading.service";
import {SupplierService} from "../../../../core/services/supplier.service";
import swal from 'sweetalert2'

@Component({
  selector: 'app-service-terms',
  templateUrl: './service-terms.component.html',
  styleUrls: ['./service-terms.component.css']
})
export class ServiceTermsComponent implements OnInit {
  formTitle: string = 'Service Terms Setup';
  form: FormGroup;
  serviceTermsId: number;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private loadingService: LoadingService,
    private supplierService: SupplierService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      serviceTermsId: [0],
      header: [""],
      content: [""]
    })
  }

  ngOnInit() {
    this.route.queryParams.subscribe((param:any) => {
      this.serviceTermsId = param.id;
      if (this.serviceTermsId != undefined) {
        this.getServiceTerm(this.serviceTermsId)
      }
    })
  }

  submitInfo(form: FormGroup) {
    const payload = form.value;
    this.loadingService.show();
    return this.supplierService.updateServiceTerm(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire(`GOS FINANCIAL`, message, 'success').then(() => {
          this.router.navigateByUrl(`/purchases-and-supplier/service-terms-setup-list`)
        })
      } else {
        swal.fire(`GOS FINANCIAL`, message, 'error')
      }
    }, err => {
      this.loadingService.hide();
      if (err.status) {
        const message = err.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, "error");
      } else {
        const message = err.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, "error");
      }
    })
  }

  goBack() {
    this.location.back()
  }

  getServiceTerm(id: number) {
    this.loadingService.show();
    return this.supplierService.getServiceTerm(id).subscribe(data => {
      this.loadingService.hide();
      const row = data.serviceTerms[0];
      this.form = this.formBuilder.group({
        serviceTermsId: [row.serviceTermsId],
        header: [row.header],
        content: [row.content]
      })
    }, err => {
      this.loadingService.hide()
    })
  }
}
