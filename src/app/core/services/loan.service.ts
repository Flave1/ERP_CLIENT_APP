import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private subject = new Subject<number>();

  constructor(private apiService: ApiService) {}
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  sendLoanApplication(loanApplicationId: number) {
    this.subject.next(loanApplicationId);
  }

  getLoanApplication(): Observable<number> {
    return this.subject.asObservable();
  }
  getAllLoanApplication() {
    return this.apiService.get('/loan/get/reviewed/loans').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllLoanApplicationbyId(setupId) {
    return this.apiService
      .get(`/loan/reviewed-loans-by-Id?loanApplicationId=${setupId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getAllBookedLoan() {
    return this.apiService.get('/loan/get/loan/approval/list').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getLoanDetailInformation(loanId) {
    return this.apiService
      .get(`/loan/get/loan/detailed/information/loanId?LoanId=${loanId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getManagedLoanInformation(loanId) {
    return this.apiService
      .get(`/loan/get/loan/manage/information/loanId?LoanId=${loanId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getManagedLoanInformationComment(loanId, loanscheduleId) {
    return this.apiService
      .get(
        `/loan/get/all/loan/comment?LoanId=${loanId}&LoanScheduleId=${loanscheduleId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getLoanCheques(loanId) {
    return this.apiService
      .get(`/loan/get/all/loan/cheque?LoanApplicationId=${loanId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  saveChequeAmount(payload: Object): Observable<any> {
    return this.apiService
      .post(`/loan/update/loan/cheque/amount`, payload)
      .pipe(
        tap(),
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
  uploadLoanAmount(file, loanApplicationId): Promise<any> {
    return this.apiService
      .uploadChequeAmount(
        `/loan/upload/loan/cheque/amount`,
        { loanApplicationId },
        file
      )
      .then((data) => {
        return data;
      });
  }
  updateLoanStatus(body): Observable<any> {
    return this.apiService.post(`/loan/update/loan/cheque/status`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  downloadLoanDocument(body): Observable<any> {
    return this.apiService.post(`/loan/download/single/loan/cheque`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  uploadSingleLoanCheque(file: File, body): Promise<any> {
    return this.apiService.uploadSingleLoanCheque(file, body).then((data) => {
      return data;
    });
  }

  uploadLoan(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel('/loan/upload/historical/loans', imageFile)
      .then((data) => {
        return data;
      });
  }

  generateScheduleUploadedLoan() {
    return this.apiService.get(`/loan/generate/schedule/historical/loans`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  addLoanCheque(file: File, body): Promise<any> {
    return this.apiService.updateLoanCheque(file, body).then((data) => {
      return data;
    });
  }

  getManagedLoanInformationDecision(loanId, loanscheduleId) {
    return this.apiService
      .get(
        `/loan/get/all/loan/decision?LoanId=${loanId}&LoanScheduleId=${loanscheduleId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getManagedLoanInformationCommentById(loanId, loanscheduleId, commentId) {
    return this.apiService
      .get(
        `/loan/all-CreditLoanComment-Id?loanId=${loanId}&loanscheduleId=${loanscheduleId}&commentId=${commentId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getAutoPopulateSchedule(loanApplicationId) {
    return this.apiService
      .get(
        `/loan/get/loan/schedule/input?LoanApplicationId=${loanApplicationId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  addLoanBooking(body): Observable<any> {
    return this.apiService.post(`/loan/add/update/loan/booking`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  addLoanComment(body): Observable<any> {
    return this.apiService.post(`/loan/add/update/loan/comment`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  addLoanDecision(body): Observable<any> {
    return this.apiService.post(`/loan/add/update/loan/decision`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  goForApproval(body): Observable<any> {
    return this.apiService.post(`/loan/update/loan/approval`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteLoanComment(ids) {
    return this.apiService.post(`/loan/delete/loan/comment`, { ids }).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteLoanDecision(ids) {
    return this.apiService.post(`/loan/delete/loan/decision`, { ids }).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getWebsiteLoanApplications(): Observable<any> {
    return this.apiService.get(`/loanapplication/get/all/website/list`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getLoanApplicationData(id: number): Observable<any> {
    return this.apiService.get(
      `/loanapplication/get/website/Id?LoanApplicationId=${id}`
    );
  }

  getPaymentDues(): Observable<any> {
    return this.apiService
      .get(`/loan/get/loan/payment/due/list`)
      .pipe((data) => {
        return data;
      });
  }

  getOverdues(): Observable<any> {
    return this.apiService
      .get(`/loan/get/loan/past/due/list`)
      .pipe(tap((data) => data));
  }

  downloadLoan(): Observable<any> {
    return this.apiService
      .get(`/loan/download/loans`)
      .pipe(tap(), catchError(this.handleError));
  }
}
