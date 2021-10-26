import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class CurrencyService {
  constructor(private apiService: ApiService) { }
  userData: any = {};
  getAllCurrency() {
    return this.apiService.get("/common/currencies").pipe(
      map(data => {
        return data;
      })
    );
  }

  getOperatingAccount() {
    return this.apiService
      .get(`/creditclassification/get/all/operating/account`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  getCurrencyRate(currencyId) {
    return this.apiService
      .get(`/common/currencyRates/currencyId?CurrencyId=${currencyId}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  deleteCurrency(currencyId) {
    return this.apiService
      .delete(`/currency/delete?currencyId=${currencyId}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  updateCurrency(body): Observable<any> {
    return this.apiService.post(`/currency/update`, body).pipe(
      map(data => {
        return data;
      })
    );
  }

  updateOperatingAccount(body): Observable<any> {
    return this.apiService
      .post(`/creditclassification/add/update/operating/account`, body)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  uploadCurrencies(File: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/common/upload/currency`, File)
      .then(data => {
        return data;
      });
  }
  exportCurrencies(): Observable<any> {
    return this.apiService
      .getExcel(`/common/download/currencies`)
      .pipe(data => {
        return data;
      });
  }
}
