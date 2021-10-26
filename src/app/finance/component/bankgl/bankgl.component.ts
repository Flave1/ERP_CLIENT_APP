import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {SubGLService} from "../../../core/services/subgl.service";
import {LoadingService} from "../../../core/services/loading.service";
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: 'app-bankgl',
  templateUrl: './bankgl.component.html',
  styleUrls: ['./bankgl.component.css']
})
export class BankglComponent implements OnInit {
  form: FormGroup;
  formTitle: string = 'Bank GL Setup';
  glArr: any[] = [];
  subGls: any[] = [];
  constructor(
    private fb: FormBuilder,
    private subGlService: SubGLService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      let id = param.id;
      if (id) {
        this.editBankGl(id)
      }
    });
    this.form = this.fb.group({
      bankGlId: [0],
      bankName: [''],
      subGl: ['']
    });
    this.getSubGls()
  }

  getSubGls() {
    this.loadingService.show();
    return this.subGlService.getAllSubGL().subscribe(data => {
      this.loadingService.hide();
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
    payload.subGl = parseInt(payload.subGl);
    this.loadingService.show();
    return this.subGlService.updateBankGl(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire(`GOS FINANCIAL`, message, 'success');
        this.router.navigateByUrl(`/finance/bankgl-list`)
      } else {
        swal.fire(`GOS FINANCIAL`, message, 'error')
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire(`GOS FINANCIAL`, message, 'error')
    })
  }

  editBankGl(id: number) {
    this.loadingService.show();
    return this.subGlService.getBankGl(id).subscribe(res => {
      this.loadingService.hide();
      const data = res.bank[0];
      this.form = this.fb.group({
        bankGlId: [data.bankGlId],
        bankName: [data.bankName],
        subGl: [data.subGl]
      });
    })
  }
  goBack() {

  }
}
