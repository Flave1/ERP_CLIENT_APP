import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  apiKey: any = '7dc09be90f7cd0a111914a4db143e0f3';
  constructor(private apiService: ApiService, private http: HttpClient) {}

  getAllGender(): Observable<any> {
    return this.apiService.get('/common/genders').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllTitle(): Observable<any> {
    return this.apiService.get('/common/title').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getJobTitles(): Observable<any> {
    return this.apiService.get(`/common/jobTitles`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // update job title
  updateJobTitle(payload: Object): Observable<any> {
    return this.apiService.post(`/common/add/update/jobTitle`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllMaritalStatus(): Observable<any> {
    return this.apiService.get('/common/maritalStatus').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllEmployerType(): Observable<any> {
    return this.apiService.get('/common/employerTypes').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllCountry(): Observable<any> {
    return this.apiService.get('/common/countries').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getCountry(countryId) {
    return this.apiService
      .get(`/common/get/single/countryById?CountryId=${countryId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  // add country
  updateCountry(payload: Object): Observable<any> {
    return this.apiService.post(`/common/add/update/country`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  deleteMultipleCountry(body): Observable<any> {
    return this.apiService.post(`/common/delete/countryById`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  uploadCountryList(File: File): Promise<any> {
    return this.apiService
      .uploadExcel('/common/upload/countries', File)
      .then((data) => {
        return data;
      });
  }
  exportCountryList() {
    return this.apiService.getExcel('/common/download/countries').pipe(
      map((data) => {
        return data;
      })
    );
  }
  getAllState() {
    return this.apiService.get('/common/states').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getState(stateId) {
    return this.apiService
      .get(`/common/get/single/stateById?StateId=${stateId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  // update state
  updateState(payload: Object): Observable<any> {
    return this.apiService.post(`/common/add/update/state`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  uploadStatesList(File: File): Promise<any> {
    return this.apiService
      .uploadExcel('/common/upload/states', File)
      .then((data) => {
        return data;
      });
  }
  getStateByCountry(id: number): Observable<any> {
    return this.apiService
      .get(`/common/get/states/countryId?CountryId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getAllCity(): Observable<any> {
    return this.apiService.get('/common/cities').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // update city
  updateCity(payload: Object): Observable<any> {
    return this.apiService.post(`/common/add/update/city`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getCity(cityId) {
    return this.apiService
      .get(`/common/get/get/single/cityById?CityId=${cityId}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getCityByStateId(id): Observable<any> {
    return this.apiService.get(`/common/get/cities/stateId?StateId=${id}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getCitiesByState(id: number): Observable<any> {
    return this.apiService.get(`/common/cities`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllDirectorType() {
    return this.apiService.get('/common/directorTypes').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // update document type
  updateDocumenttype(payload: Object): Observable<any> {
    return this.apiService
      .post(`/common/add/update/documentType`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getAllDocumentType() {
    return this.apiService.get('/common/documentypes').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  exportDocumentType(): Observable<any> {
    return this.apiService.get(`/common/download/documenttype`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  uploadDocumentType(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/common/upload/documenttype`, file)
      .then((data) => {
        return data;
      });
  }
  multiDeleteDocumentType(payload: Object): Observable<any> {
    return this.apiService
      .post(`/common/delete/documentTypeById`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getAllProductType() {
    //return this.apiService.get("/common/productType").pipe(
    return this.apiService.get('/product/get/all/producttype').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllGLAccount() {
    return this.apiService.get('/common/glaccount').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllLoanManagementOperation(): Observable<any> {
    return this.apiService.get('/common/loanManagementOperationType').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllBranches() {
    return this.apiService.get('/common/branches').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllDepartments() {
    return this.apiService.get('/common/departments').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllModules() {
    return this.apiService.get('/common/modules').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // get identification types
  getIdentificationTypes(): Observable<any> {
    return this.apiService.get(`/common/Identifications`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  deleteMultipleIdentification(body): Observable<any> {
    return this.apiService.post(`/common/delete/identificationById`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  updateIdentity(payload: Object): Observable<any> {
    return this.apiService
      .post(`/common/add/update/identification`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  exportIdentification(): Observable<any> {
    return this.apiService.getExcel(`/common/download/identification`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  uploadIdentification(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/common/upload/identification`, imageFile)
      .then((data) => {
        return data;
      });
  }
  // update credit bureau
  updateCreditBureau(payload: Object): Observable<any> {
    return this.apiService
      .post(`/common/add/update/creditBureau`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  // get credit bureau list
  getCreditBureauList(): Observable<any> {
    return this.apiService.get(`/common/creditBureau`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllGlAccounts(): Observable<any> {
    return this.apiService.get(`/common/glaccount`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getCountries() {
    return fetch(
      `http://battuta.medunes.net/api/country/all/?key=${this.apiKey}`
    ).then((res) => {
      return res.json();
    });
  }
  getStates(countryCode: string): Observable<any> {
    return this.http
      .get(
        `http://battuta.medunes.net/api/region/${countryCode}/all/?key=${this.apiKey}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getAllCurrency(): Observable<any> {
    //return this.http.get(`http://107.180.93.38:5050/common/currencies`).pipe(
    return this.apiService.get(`/common/currencies`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getCurrency(currencyId) {
    return this.apiService
      .get(`/common/get/single/currencyById?CurrencyId=${currencyId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getCurrencyRate(currencyId) {
    return this.apiService
      .get(`/common/currencyRates/currencyId?CurrencyId=${currencyId}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateCurrency(payload: any): Observable<any> {
    return this.apiService.post(`/common/add/update/currency`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  multipleDeleteCurrency(payload: Object): Observable<any> {
    return this.apiService.post(`/common/delete/currencyById`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllCurrencyRate(): Observable<any> {
    return this.apiService.get(`/common/currencyRates`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  updateCurrencyRate(payload: Object): Observable<any> {
    return this.apiService
      .post(`/common/add/update/currencyRate`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getAllIdentification(): Observable<any> {
    return this.apiService.get('/common/Identifications').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getJobTitle(jobTitleId: any): Observable<any> {
    return this.apiService
      .get(`/common/get/get/single/jobTitleById?JobTitleId=${jobTitleId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  deleteMultipleJobTitle(body) {
    return this.apiService.post(`/common/delete/jobTitleById`, body).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllModule(): Observable<any> {
    return this.apiService.get(`/admin/get/all/solution/module`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  updateModules(payload): Observable<any> {
    return this.apiService
      .post(`/admin/add/update/solution/module`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  updateAuthentication(payload): Observable<any> {
    return this.apiService.post(`/admin/auth/guard/add/update`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAuthSetups(): Observable<any> {
    return this.apiService.get(`/admin/auth/guard/get/all`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getSingleAuth(id: number): Observable<any> {
    return this.apiService
      .get(`/admin/auth/guard/get/single?AuthSettupId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  saveSecurityQuestion(payload: any): Observable<any> {
    return this.apiService.post(`/admin/add/update/questions`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getSecurityQuestions(): Observable<any> {
    return this.apiService.get(`/admin/get/all/questions`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteQuestions(id: any): Observable<any> {
    return this.apiService
      .post(`/admin/delete/questions?QuestionsId=${id}`, {})
      .pipe((data) => {
        return data;
      });
  }
  getQuestion(id: any): Observable<any> {
    return this.apiService
      .get(`/admin/get/single/questions?QuestionsId=${id}`)
      .pipe((data) => {
        return data;
      });
  }
  getModules(): Observable<any> {
    return this.apiService.get(`/admin/get/all/modules`).pipe(
      tap(),
      map((res) => {
        return res.all_modules;
      })
    );
  }
}
