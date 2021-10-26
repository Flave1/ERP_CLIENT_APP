import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class LoanstagingService {
  constructor(private apiService: ApiService) {}

  getAllLoanStaging(): Observable<any> {
    // debugger;
    return this.apiService.get("/loanstaging/get/all").pipe(
      tap(data => {
        return data;
      })
    );
  }

  updateLoanStaging(payload: Object): Observable<any> {
    return this.apiService.post("/loanstaging/add/update", payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  deleteLoanStaging(id: number) {
    return this.apiService.delete(`/loanstaging/delete/${id}`).pipe(
      map(data => {
        return data;
      })
    );
  }

  deleteListLoanStaging(ids) {
    return this.apiService.post(`/loanstaging/delete`, ids).pipe(
      map(data => {
        return data;
      })
    );
  }

  getLoanStagingById(id: number): Observable<any> {
    return this.apiService
      .get(`/loanstaging/get/loanstagingById?LoanStagingId=${id}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
}
