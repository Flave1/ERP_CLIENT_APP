import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SubGLService {
  constructor(private apiService: ApiService, private http: HttpClient,) {}
  userData: any = {};
  getAllSubGL() {
    return this.apiService.get(`/subgl/get/all`).pipe(
    //return this.http.get<any>(`http://107.180.93.38:5050/subgl/get/all`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getSubGL(subGLId) {
    return this.apiService
      .get(`/subgl/get/single/subglId?SubGLId=${subGLId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteSubGL(subGLId) {
    return this.apiService.delete(`/subGL/delete?subGLId=${subGLId}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  updateSubGL(body): Observable<any> {
    return this.apiService.post(`/subgl/add/update`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  exportSubGL() {
    return this.apiService.getExcel('/subgl/get/download').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  uploadSubGL(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel('/subgl/post/upload', imageFile)
      .then((data) => {
        return data;
      });
  }
  multipleDeleteSubGL(payload) {
    return this.apiService.post('/subgl/delete/targetIds', payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getSubGlByCompany(companyId: any): Observable<any> {
    return this.apiService
      .get(`/subgl/get/companyId?CompanyId=${companyId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getBankGls(): Observable<any> {
    return this.apiService.get(`/bankgl/get/all/bankgl`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getOtherBankGls(): Observable<any> {
    return this.apiService.get(`/bankgl/get/all/other_banks`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getBankGl(id: number): Observable<any> {
    return this.apiService
      .get(`/bankgl/get/single/bankgl/bankglId?ID=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  updateBankGl(payload: Object): Observable<any> {
    return this.apiService.post(`/bankgl/create/update/bankgl`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteBankGl(payload: any): Observable<any> {
    return this.apiService.post(`/bankgl/delete/bankgl/bankglId`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getGlBalances(): Observable<any> {
    return this.apiService.get(`/payment/get/bank_account/gl_balances`).pipe(
      tap(),
      map((res) => {
        return res.glBalance;
      })
    );
  }
}
