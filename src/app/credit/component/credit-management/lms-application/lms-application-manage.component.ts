import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { LoanService } from 'src/app/core/services/loan.service';

@Component({
  selector: 'app-lms-application-manage',
  templateUrl: './lms-application-manage.component.html',
})
export class LmsApplicationManageComponent implements OnInit {
  formTitle: string;
  selectedLoan: any = {};
  // loanId: any;
  loanScheduleId: any;
  displayComments: boolean = false;
  displayDecision: boolean = false;
  commentForm: FormGroup;
  viewHeight: any = '600px';
  selectedComment: any;
  selectedDate: any = null;
  selectedDecision: any;
  decisionForm: FormGroup;
  _loanId: number;
  @Input() set loanId(value: number) {
    this._loanId = value;
    if (value > 0) {
      //this.loanId = value;
      this.getManagedLoanInformation(value);
    }
  }
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute,
    private loanService: LoanService
  ) {
    this.commentForm = this.fb.group({
      loanId: 0,
      loanCommentId: 0,
      loanScheduleId: 0,
      comment: ['', Validators.required],
      nextStep: ['', Validators.required],
      date: null,
    });
    this.decisionForm = this.fb.group({
      loanId: 0,
      loanDecisionId: 0,
      loanScheduleId: 0,
      decision: ['', Validators.required],
      date: null,
    });
  }

  ngOnInit() {
    if (this.loanId != undefined) {
      this.getManagedLoanInformation(this.loanId);
    }
    //   this.route.queryParams.subscribe(params => {
    //     let loanId = params["loaninfo"];
    //     if (loanId != null || loanId != undefined) {
    //         this.loanId = loanId;
    //         this.getManagedLoanInformation(loanId);
    //     }
    // });
  }

  editComment(row) {
    this.commentForm = this.fb.group({
      loanId: row.loanId,
      loanCommentId: row.loanCommentId,
      loanScheduleId: row.loanScheduleId,
      comment: [row.comment, Validators.required],
      nextStep: [row.nextStep, Validators.required],
      date: new Date(row.date),
    });
  }

  editDecision(row) {
    this.decisionForm = this.fb.group({
      loanId: row.loanId,
      loanDecisionId: row.loanDecisionId,
      loanScheduleId: row.loanScheduleId,
      decision: [row.decision, Validators.required],
      date: new Date(row.date),
    });
  }

  initialCommentForm() {
    this.commentForm = this.fb.group({
      comment: [''],
      nextStep: [''],
      date: null,
    });
    this.decisionForm = this.fb.group({
      decision: [''],
      date: null,
    });
  }

  getManagedLoanInformation(loanId) {
    this.loadingService.show();
    this.formTitle = 'Manage Loan Account';
    this.loanService.getManagedLoanInformation(loanId).subscribe((data) => {
      this.loadingService.hide();
      this.selectedLoan = data.manageLoans;
    });
  }

  getManagedLoanInformationComment(loanScheduleId) {
    this.loadingService.show();
    this.loanScheduleId = loanScheduleId;
    this.formTitle = 'Manage Loan Account';
    this.loanService
      .getManagedLoanInformationComment(this._loanId, loanScheduleId)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.selectedComment = data.loanComments;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
    this.displayComments = true;
    this.initialCommentForm();
  }

  getManagedLoanInformationDecision(loanScheduleId) {
    this.loadingService.show();
    this.loanScheduleId = loanScheduleId;
    this.formTitle = 'Manage Loan Account';
    this.loanService
      .getManagedLoanInformationDecision(this._loanId, loanScheduleId)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.selectedDecision = data.loanDecisions;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
    this.displayDecision = true;
    this.initialCommentForm();
  }

  // getManagedLoanInformationCommentById(commentId) {
  //   this.loadingService.show();
  //   this.formTitle = "Manage Loan Account";
  //   this.loanService.getManagedLoanInformationCommentById(this.loanId, this.loanScheduleId, commentId).subscribe(data => {
  //       this.loadingService.hide();
  //       this.selectedLoan = data["result"];
  //   });
  // }

  goBack() {
    this.router.navigate(['/loan-management/application']);
  }

  submitLoanComment(formObj) {
    let body = formObj.value;
    body.loanId = this._loanId;
    body.loanScheduleId = parseInt(this.loanScheduleId);
    body.date = this.formatDate(body.date);
    if (!body.date) {
      return swal.fire('GOS FINANCIAL', 'Date is required', 'error');
    }
    if (!body.comment) {
      return swal.fire('GOS FINANCIAL', 'Comment field is required', 'error');
    }
    if (!body.nextStep) {
      return swal.fire('GOS FINANCIAL', 'Next step field is required', 'error');
    }
    this.loadingService.show();
    this.loanService.addLoanComment(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.commentForm.reset();
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getManagedLoanInformationComment(this.loanScheduleId);
          this.getManagedLoanInformation(this._loanId);

          //this.displayComments = false;
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  submitLoanDecision(formObj) {
    let body = formObj.value;
    body.loanId = this._loanId;
    body.loanScheduleId = parseInt(this.loanScheduleId);
    body.date = this.selectedDate;
    if (!body.date) {
      return swal.fire('GOS FINANCIAL', 'Date is required', 'error');
    }
    if (!body.decision) {
      return swal.fire('GOS FINANCIAL', 'Decision is required', 'error');
    }
    this.loadingService.show();
    this.loanService.addLoanDecision(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.decisionForm.reset();
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getManagedLoanInformationDecision(this.loanScheduleId);
          this.getManagedLoanInformation(this._loanId);

          //this.displayComments = false;
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  deleteLoanComment(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete user?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          let ids = [];
          ids.push(row.loanCommentId);
          __this.loadingService.show();

          __this.loanService.deleteLoanComment(ids).subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getManagedLoanInformationComment(this.loanScheduleId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  deleteLoanDecision(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete user?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          let ids = [];
          ids.push(row.loanDecisionId);
          __this.loadingService.show();
          __this.loanService.deleteLoanDecision(ids).subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getManagedLoanInformationDecision(this.loanScheduleId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
