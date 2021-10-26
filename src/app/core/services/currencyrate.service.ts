import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class CurrencyRateService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  getAllCurrencyRate() {
    return this.apiService.get("/currencyRate/allcurrencyRate").pipe(
      map(data => {
        return data;
      })
    );
  }

  getCurrencyRate(currencyRateId) {
    return this.apiService
      .get(
        `/common/get/single/currencyRateById?CurrencyRateId=${currencyRateId}`
      )
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  deleteCurrencyRate(currencyRateId) {
    return this.apiService
      .delete(`/currencyRate/delete?currencyRateId=${currencyRateId}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  updateCurrencyRate(body): Observable<any> {
    return this.apiService.post(`/currencyRate/update`, body).pipe(
      map(data => {
        return data;
      })
    );
  }
  multipleDeleteCurrencyRate(payload: Object): Observable<any> {
    return this.apiService
      .post(`/common/delete/currencyRateById`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  exportCurrencyRate(): Observable<any> {
    return this.apiService
      .getExcel(`/common/download/currenyrate`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  uploadCurrencyRate(File: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/common/upload/uploadrate`, File)
      .then(data => {
        return data;
      });
  }

  getTranslationList(): Observable<any> {
    return this.apiService.get(`/financeaccounttype/get/all/translation`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getTranslation(id: number): Observable<any> {
    return this.apiService
      .get(`/financeaccounttype/get/single/translationId?TranslationId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateTranslation(payload: Object): Observable<any> {
    return this.apiService
      .post(`/financeaccounttype/update/translation`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  multipleDeleteTranslation(payload: Object): Observable<any> {
    return this.apiService
      .post(`/financeaccounttype/delete/targetIds/translation `, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  exportTranslation(): Observable<any> {
    return this.apiService.getExcel(`/financeaccounttype/get/download/translation`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  uploadTranslation(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/financeaccounttype/post/upload/translation`, imageFile)
      .then(data => {
        return data;
      });
  }

  updateTranslationGl(payload: Object): Observable<any> {
    return this.apiService
      .post(`/financeaccounttype/update/translationgl`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getTranslationGl(id: number): Observable<any> {
    return this.apiService
      .get(`/financeaccounttype/get/single/translationglId?TranslationId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadTranslationGl(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/financeaccounttype/post/upload/translationgl`, imageFile)
      .then(data => {
        return data;
      });
  }

  exportTranslationGl(): Observable<any> {
    return this.apiService.get(`/financeaccounttype/get/download/translationgl`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  multipleDelete(payload: Object): Observable<any> {
    return this.apiService
      .post(`/financeaccounttype/delete/targetIds/translationgl `, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
}
