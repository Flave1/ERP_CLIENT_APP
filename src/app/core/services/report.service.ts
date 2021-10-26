import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ReportService {
  constructor(private apiService: ApiService, private http: HttpClient) { }
  userData: any = {};
  getOfferLetter(applicationRefNumber) {
    return this.apiService
      .get(`/report/offer-letter?applicationRefNumber=${applicationRefNumber}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  getOfferLetterLMS(loanRefNumber) {
    return this.apiService
      .get(`/report/offer-letter-lms?loanRefNumber=${loanRefNumber}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  getInvestmentCertificate(RefNumber: number): Observable<any> {
    return this.apiService
      .get(`/report/investment-certificate?RefNumber=${RefNumber}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getFsReport(date1: Date, date2: Date): Observable<any> {
    return this.apiService
      .get(`/report/fs-report?date1=${date1}&date2=${date2}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getPlReport(date1: Date, date2: Date): Observable<any> {
    return this.apiService
      .get(`/report/pl-report?date1=${date1}&date2=${date2}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getIndividualColumn(): Observable<any> {
    return this.apiService.get(`/report/individual-customer-column`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getCorporateColumn(): Observable<any> {
    return this.apiService.get(`/report/corporate-customer-column`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getCustomerReport(
    date1: any,
    date2: any,
    customer_type: any
  ): Observable<any> {
    return this.apiService
      .get(
        `/report/customer-report?date1=${date1}&date2=${date2}&ct=${customer_type}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getIndividualInvestor(): Observable<any> {
    return this.apiService
      .get(`/report/individual-investment-customer-column`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getCorporateInvestor(): Observable<any> {
    return this.apiService
      .get(`/report/corporate-investment-customers-column`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getInvestorCustomerReport(date1: any, date2: any, ct: any): Observable<any> {
    return this.apiService
      .get(
        `/report/investment-customer-report?date1=${date1}&date2=${date2}&ct=${ct}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getInvestmentColumn(): Observable<any> {
    return this.apiService.get(`/report/investment-column`).pipe(tap(data => {
      return data;
    }))
  };
  getInvestmentReport(date1: any, date2: any): Observable<any> {
    return this.apiService.get(`/report/investment-report?date1=${date1}&date2=${date2}`).pipe(tap(data => {
      return data;
    }))
  }
  getLoanReportColumn(): Observable<any> {
    return this.apiService.get(`/report/loan-column`).pipe(data => {
      return data
    })
  }

  // getReport(date1, date2): Observable<any> {
  //   return this.http.get(`${this.url}/gos/Reporter/LoanReport?date1=${date1}&date2=${date2}`).pipe(tap(data => {
  //     return data;
  //   }))
  // }
  getSummaryloanReport(body): Observable<any> {
    return this.apiService
      .post(`/loanapplication/loan/excel/report`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
}
