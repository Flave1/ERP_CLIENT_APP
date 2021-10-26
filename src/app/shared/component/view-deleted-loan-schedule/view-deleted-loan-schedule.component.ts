import { LoadingService } from "src/app/core/services/loading.service";
import { LoanScheduleService } from "src/app/core/services/loanschedule";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: 'app-view-deleted-loan-schedule',
  templateUrl: './view-deleted-loan-schedule.component.html'
})
export class ViewDeletedLoanScheduleComponent implements OnInit {
  schedules: any[] = [];
  scheduleHeader: any = {};
  _loanId: number;
  maturityDate: any;
  get loanId(): number {
      return this._loanId;
  }
  @Input() set loanId(value: number) {
      this._loanId = value;
      if (value > 0) this.getLoanScheduleByLoanId(value);
  }
  constructor(
      private loanScheduleService: LoanScheduleService,
      private loadingService: LoadingService
  ) {}

  ngOnInit() {
    // this.getLoanScheduleByLoanId()
  }

  getLoanScheduleByLoanId(loanId) {
      this.loadingService.show();
      this.loanScheduleService
          .getLoanScheduleByLoanIdDeleted(loanId)
          .subscribe(data =>  {
              this.loadingService.hide();
              this.schedules = data.loanPaymentSchedule;
              if (this.schedules != undefined && this.schedules.length > 0) {
                  this.scheduleHeader = this.schedules[0];
                  this.maturityDate = this.schedules[
                      this.schedules.length - 1
                  ].paymentDate;
              }
          });
  }

}
