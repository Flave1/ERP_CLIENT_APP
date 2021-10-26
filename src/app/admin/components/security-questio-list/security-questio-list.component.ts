import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CommonService} from "../../../core/services/common.service";
import {LoadingService} from "../../../core/services/loading.service";
import swal from'sweetalert2'
@Component({
  selector: 'app-security-questio-list',
  templateUrl: './security-questio-list.component.html',
  styleUrls: ['./security-questio-list.component.css']
})
export class SecurityQuestioListComponent implements OnInit {
  questions: any[] = [];
  viewHeight: string = '600px';
  selectedItem: any[] = [];

  constructor(
    private router: Router,
    private commonService: CommonService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.getSecurityQuestions()
  }
  getSecurityQuestions() {
    this.loadingService.show();
    return this.commonService.getSecurityQuestions().subscribe(data => {
      this.loadingService.hide();
      this.questions = data.questions
    }, err => {
      this.loadingService.hide()
    })
  }
  showAddNew() {
    this.router.navigateByUrl('/admin/sec-questions')
  }

  editItem(questionId: any) {
    this.router.navigate(['/admin/sec-questions'], {
      queryParams: {
        id: questionId
      }
    })
  }

  deleteItem(questionId: any) {
    swal.fire({
      title: "Are you sure you want to delete this question?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!"
    }).then(result => {
      if (result.value) {
        this.loadingService.show();
        return this.commonService.deleteQuestions(questionId).subscribe(res => {
          this.loadingService.hide();
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire('GOS FINANCIAL', message, 'success').then(() => {
              return this.getSecurityQuestions();
            })
          } else {
            swal.fire('GOS FINANCIAL', message, 'error')
          }
        }, err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'success')
        })
      }
    })

  }
}
