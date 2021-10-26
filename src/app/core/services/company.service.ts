import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CompanyService {
  constructor(private apiService: ApiService, private http: HttpClient) {}
  userData: any = {};
  getAllCompany() {
    return this.apiService.get('/company/company').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getCompany(companyId) {
    return this.apiService.get(`/company/company?companyId=${companyId}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteCompany(companyId) {
    return this.apiService
      .delete(`/company/delete?companyId=${companyId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  updateCompany(body): Observable<any> {
    return this.apiService.post(`/company/update`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllCompanyStructure(): Observable<any> {
    // return this.http.get(`http://107.180.93.38:5050/company/get/all/companystructures`).pipe(tap(data => {
    return this.apiService.get('/company/get/all/companystructures').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getCompanyStructureByStatffId(staffId: number): Observable<any> {
    return this.apiService
      .get(`/company/get/companystructure/staffId?StaffId=${staffId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getCompanyStructureByDefinition(structureDefinitionId) {
    return this.apiService
      .get(
        `/company/get/single/companystructure/companystructureDefinitionId?StructureDefinitionId=${structureDefinitionId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCompanyStructureByAccessId(accessId) {
    return this.apiService
      .get(`/company/get/all/companystructure/accessId?AccessId=${accessId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCompanyStructure(companyStructureId) {
    return this.apiService
      .get(
        `/company/get/single/companystructure/id?CompanyStructureId=${companyStructureId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteCompanyStructure(companyStructureId) {
    return this.apiService
      .delete(
        `/company/company-structure?companyStructureId=${companyStructureId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteMultipleCompanyStructure(body) {
    return this.apiService
      .post(`/company/delete/companystructure/targetIds`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  exportCompanyStructure() {
    return this.apiService.getExcel('/company/download/companystructure').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  uploadCompanyStructure(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel('/company/upload/companystructure', imageFile)
      .then((data) => {
        return data;
      });
  }

  addUpdateCompanyStructure(file: File, body, file2: File): Promise<any> {
    return this.apiService
      .updateCompanyStructure(file, body, file2)
      .then((data) => {
        return data;
      });
  }

  getAllCompanyStructureDefinition() {
    return this.apiService
      .get('/company/get/all/companystructureDefinition')
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCompanyStructureDefinition(structureDefinitionId) {
    return this.apiService
      .get(
        `/company/get/single/companystructuredefinition/Id?CompanyStructureDefinitionId=${structureDefinitionId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteCompanyStructureDefinition(structureDefinitionId) {
    return this.apiService
      .delete(
        `/company/company-structure-definition?structureDefinitionId=${structureDefinitionId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteMultipleCompanyStructureDefinition(body) {
    return this.apiService
      .post(`/company/delete/companystructureDefinition`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  exportCompanyStructureDefinition() {
    return this.apiService
      .get('/company/generate/excel/companystructureDefinition')
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  uploadCompanyStructureDefinition(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel('/company/upload/companystructureDefinition', imageFile)
      .then((data) => {
        return data;
      });
  }

  uploadCompanyFSTemplate(imageFile: File, body: any): Promise<any> {
    return this.apiService
      .uploadFSTemplate('/company/upload/FSTemplate', imageFile, body)
      .then((data) => {
        return data;
      });
  }

  addUpdateCompanyStructureDefinition(body): Observable<any> {
    return this.apiService
      .post(`/company/add/update/companystructureDefinition`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCompanyStructureChart() {
    return this.apiService.get('/company/company-structure-chart').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  addCotapnyInfo(payload: Object): Observable<any> {
    return this.apiService
      .post(`/company/company-structure-info`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getStructureDefinition(structureDefinitionId: any): Observable<any> {
    return this.apiService
      .get(
        `/company/company-structureInfo-by-Id?structureDefinitionId=${structureDefinitionId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getCompanyInfo(id: number) {
    return this.apiService
      .get(`/company/get/single/companystructure/id?CompanyStructureId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  // update structure definition

  updateStructureDefinition(payload: Object): Observable<any> {
    return this.apiService
      .post(`/company/update/companystructure`, payload)
      .pipe((data) => {
        return data;
      });
  }

  // get structure definition
  getCompStructureDefinition(): Observable<any> {
    return this.apiService.get(`/company/get/all/companystructures2`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  addComapnyInfo(payload: any): Observable<any> {
    return;
  }
}
