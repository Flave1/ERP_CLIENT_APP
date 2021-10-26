import { Injectable } from "@angular/core";
import {  tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class GLMappingService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  getAlltransfers() {
    return this.apiService.post("/creditappraisal/get/all/flutterwave/transactions").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllGLMapping() {
    return this.apiService.get("/glmapping/get/all").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getUnMappingGL() {
    return this.apiService.get("/glmapping/get/all/unmapping").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getGLMapping(glMappingId) {
    return this.apiService
      .get(`/glmapping/single/Id?GlMappingId=${glMappingId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteGLMapping(glMappingId) {
    return this.apiService
      .delete(`/glMapping/delete?glMappingId=${glMappingId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateGLMapping(body): Observable<any> {
    return this.apiService.post(`/glmapping/add/update`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  updateMultipleGLMapping(body): Observable<any> {
    return this.apiService.post(`/glmapping/add/multiple/update`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }
  multipleDeleteGlMapping(payload: any): Observable<any> {
    return this.apiService.post(`/glmapping/delete/targetIds`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // gl tapping by company
  getMappingByCompany(companyId: any): Observable<any> {
    return this.apiService
      .get(`/glmapping/get/unmapping/companyId?CompanyId=${companyId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // gl retap by company
  glRemapByCompany(companyId: any):Observable<any> {
    return this.apiService.get(`/glmapping/get/mapping/companyId?companyId=${companyId}`).pipe(tap(data => {
      return data;
    }))
  }
  updateFlutterKeys(payload):Observable<any> {
    return this.apiService.post(`/payment/flutterwave/update/keys`, payload).pipe(tap(data => {
      return data;
    }))
  };
  getFlutterKeys():Observable<any> {
    return this.apiService.get(`/payment/flutterwave/get/keys`).pipe(tap(data => {
      return data;
    }))
  }
}
