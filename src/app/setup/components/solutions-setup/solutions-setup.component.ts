import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CommonService} from "../../../core/services/common.service";
import {LoadingService} from "../../../core/services/loading.service";
import swal from 'sweetalert2'

@Component({
  selector: 'app-solutions-setup',
  templateUrl: './solutions-setup.component.html',
  styleUrls: ['./solutions-setup.component.css']
})
export class SolutionsSetupComponent implements OnInit {
  formTitle: 'Solutions Setup';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      solutionModuleId: [0],
      solutionName: ['']
    })
  }

  goBack() {

  }

  submitInfo(form: FormGroup) {
    const payload = form.value;
    if (!payload.solutionName) {
      return swal.fire('GOS FINANCIAL', 'Solution name is required', 'error')
    }

    this.loadingService.show()
    return this.commonService.updateModules(payload).subscribe(data => {
      this.loadingService.hide();
      const message = data.status.message.friendlyMessage;
      if (data.status.isSuccessful) {
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
