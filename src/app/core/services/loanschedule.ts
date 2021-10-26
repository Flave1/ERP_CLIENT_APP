import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class LoanScheduleService {
  constructor(private apiService: ApiService, private http: HttpClient) {}
  userData: any = {};
  getAllDayCount() {
    return this.apiService.get("/loanschedule/get/all/daycount").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllFrequencyTypes() : Observable<any>{
    //return this.http.get(`http://192.168.1.100:90/loanschedule/get/all/frequencytype`).pipe(
    return this.apiService.get("/loanschedule/get/all/frequencytype").pipe(
      tap(data => {
        return data;
      })
    );
  }

  generatePeriodicLoanSchedule(body): Observable<any> {
    return this.apiService.post(`/loanschedule/get/periodic/schedule`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllLoanScheduleType() {
    return this.apiService.get("/loanschedule/get/all/scheduletype").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getLoanScheduleByLoanId(loanId) {
    return this.apiService
      .get(`/loanschedule/get/schedulebyLoanId?LoanId=${loanId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanScheduleByLoanIdDeleted(loanId) {
    return this.apiService
      .get(`/loanschedule/deleted/loan/schedule?LoanId=${loanId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  exportSchedule(payload: any): Observable<any> {
    return this.apiService
      .post(`/loanschedule/export/periodic/schedule`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
}
