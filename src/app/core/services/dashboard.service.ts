import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getPerformanceMatrics(): Observable<any> {
    return this.apiService.get(`/dashboard/performancematrics`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getLoanApplicationDetails(): Observable<any> {
    return this.apiService.get(`/dashboard/loanapplicationdetails`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getLoanPAR(): Observable<any> {
    return this.apiService.get(`/dashboard/loanpar`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getLoanConcentrationDetails(): Observable<any> {
    return this.apiService.get(`/dashboard/loanconcentrationdetails`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getLoanOverDue(): Observable<any> {
    return this.apiService.get(`/dashboard/loanoverdue`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getFrequencyTypes(): Observable<any> {
    return this.apiService.get('/loanschedule/get/all/frequencytype').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getLoanApplicationId(cid: any, pid: any): Observable<any> {
    return this.apiService
      .get(`/loanApplication/loanApplicationbyPId?cid=${cid}&pid=${pid}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getLoanStagingData(): Observable<any> {
    return this.apiService.get(`/dashboard/loanstaging`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  public requestDataFromMultipleSources(): Observable<any[]> {
    const response1 = this.getLoanStagingData();
    const response2 = this.getPerformanceMatrics();
    const response3 = this.getLoanApplicationDetails();
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([response1, response2, response3]);
  }
}
