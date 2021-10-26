import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";
import {CommonService} from "../../../core/services/common.service";
import {LoadingService} from "../../../core/services/loading.service";
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.css']
})
export class SecurityQuestionsComponent implements OnInit {
  formTitle: string = 'Security Question';
  form: FormGroup;
  questionId: any;
  constructor(
    private fb: FormBuilder,
    private _location: Location,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      this.questionId = param.id;
      if (this.questionId !== undefined) {
        this.getSecurityQuestion(this.questionId)
      }
    })
    this.form = this.fb.group({
      questionId: [0],
      question: ['']
    })
  }
  getSecurityQuestion(id) {
    this.loadingService.show();
    return this.commonService.getQuestion(id).subscribe(data => {
      this.loadingService.hide()
      const row = data.questions[0];
      this.form.patchValue({
        questionId: row.questionId,
        question: row.qiestion
      })
    }, err => {
      this.loadingService.hide()
    })
  }
  submitInfo(form: FormGroup) {
    const payload = form.value;
    this.loadingService.show();
    return this.commonService.saveSecurityQuestion(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire('GOS FINANCIAL', message, 'success');
        this.router.navigateByUrl('/admin/sec-questions-list')
      } else {
        swal.fire('GOS FINANCIAL', message, 'error')
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error')
    })
  }

  goBack() {
    this._location.back();
  }
}
