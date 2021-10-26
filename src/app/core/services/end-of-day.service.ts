import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';

let AppConstant: any = {};

@Injectable()
export class EndOfDayService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  private handleEror(error: any) {
    return throwError(error);
  }
  getAllPublicHoliday() {
    return this.apiService.get('/publicholiday/allpublicHoliday').pipe(
      map((data) => {
        return data;
      })
    );
  }

  getPublicHoliday(publicHolidayId) {
    return this.apiService
      .get(`/publicholiday/allpublicHoliday?publicHolidayId=${publicHolidayId}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getnextApplicationDate() {
    return this.apiService.get('/publicholiday/application-date').pipe(
      map((data) => {
        return data;
      })
    );
  }

  save(body): Observable<any> {
    return this.apiService.post(`/publicholiday/update`, body).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getEndOfDay() {
    return this.apiService.get('/endofday/end-of-day').pipe(
      map((data) => {
        return data;
      })
    );
  }

  runEodOperation(): Observable<any> {
    return this.apiService.post(`/financialtransaction/end/of/day`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  runImpairment(): Observable<any> {
    return this.apiService.post(`/ifrs/run/impairment`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  loanYearWeekends(body): Observable<any> {
    return this.apiService
      .post(`/publicholiday/addWeekendsInTheYear`, body)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  delete(id) {
    return this.apiService.delete(`/publicholiday/delete/${id}`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getImpairment(include) {
    return this.apiService.get(`/ifrs/get/impairment?includePastDue=${include}`).pipe(
      map((data) => {
        return data;
      })
    );
  }
  exportImpairment(): Observable<any> {
    return this.apiService.getExcel(`/ifrs/get/export/impairment`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  multipleHolidayDelete(body: any): Observable<any> {
    return this.apiService.post(`/publicholiday/delete`, body).pipe(
      map((data) => {
        return data;
      })
    );
  }
  saveEodSetup(payload) {
    return this.apiService
      .post(`/financialtransaction/end/of/daysetup`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  // get eod

  getEod(): Observable<any> {
    return this.apiService
      .get(`/financialtransaction/get/end/of/daysetup`)
      .pipe(tap(), catchError(this.handleEror));
  }
  getApplicationDate() {
    return this.apiService.get(`/gl/get/application/date`).pipe(
      tap(),
      map((res) => {
        return res['applicationDate'];
      })
    );
  }
}
