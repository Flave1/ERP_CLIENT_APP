import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LoadingService} from "../../../core/services/loading.service";
import {GLMappingService} from "../../../core/services/glmapping.service";
import swal from 'sweetalert2'

@Component({
  selector: 'app-fluterwave-key',
  templateUrl: './fluterwave-key.component.html',
  styleUrls: ['./fluterwave-key.component.css']
})
export class FluterwaveKeyComponent implements OnInit {
  formTitle: string = 'Flutterwave Key Setup';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private glMappingService: GLMappingService
  ) { }

  ngOnInit() {
    this.getKeysList();
    this.form = this.fb.group({
      flutterWaveKeysId: 0,
      secret_keys: ['',],
      public_keys: [''],
      useFlutterWave: false
    });
  }

  goBack() {

  }
  getKeysList() {
    this.loadingService.show();
    return this.glMappingService.getFlutterKeys().subscribe(data => {
      this.loadingService.hide()
      const row = data.keys
      this.form = this.fb.group({
        flutterWaveKeysId: row.flutterWaveKeysId,
        secret_keys: [row.secret_keys],
        public_keys: [row.public_keys],
        useFlutterWave: [row.useFlutterWave]
      })
    }, err => {
      this.loadingService.hide()
    })
  }
  submit(form: FormGroup) {
    const payload = form.value;
    if (!payload.secret_keys) {
      return swal.fire('Error', 'Secret keys is required', 'error')
    }
    if (!payload.public_keys) {
      return swal.fire('Error', 'Public keys is required', 'error')
    }
    this.loadingService.show();
    return this.glMappingService.updateFlutterKeys(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire('GOS FINANCIAL', message, 'success')
      } else {
        swal.fire('GOS FINANCIAL', message, 'error')
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error')
    })
  }
}
