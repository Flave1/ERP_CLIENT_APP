import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.css']
})
export class SecurityQuestionComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  questions: any[] = [];
  userName: string
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      answer: [''],
      questionId: [''],
      userName: ['']
    });
  }

  ngOnInit() {
  }

  getQuestion(username) {
    return this.authService.getQuestion(username).subscribe(res => {
      this.questions = res.question
    })
  }

  submit(form: FormGroup) {
    const payload = form.value;
    payload.questionId = +payload.questionId;
    if (!payload.questionId) {
      return swal.fire('GOS FINANCIAL', 'Select a question', 'error')
    }
    if (!payload.answer) {
      return swal.fire('GOS FINANCIAL', 'Provide an answer to the selected question', 'error')
    }
    payload.userName = this.userName
    this.loading = true;
    return this.authService.answerQuestion(payload).subscribe(res => {
      this.loading = false;
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire('GOS FINANCIAL', message, 'success')
      } else {
        swal.fire('GOS FINANCIAL', message, 'error')
      }
    }, err => {
      this.loading = false;
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error')
    })
  }
}
