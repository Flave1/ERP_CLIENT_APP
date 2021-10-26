import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class RegistryService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  getAllRegistry() {
    return this.apiService.get("/registry/get/all").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllRegistryByStatement(statementId) {
    return this.apiService
      .get(`/registry/allregistryByStatement?statementId=${statementId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  GetAllRegistryTemplate() {
    return this.apiService.get("/registrytemplate/get/all").pipe(
      tap(data => {
        return data;
      })
    );
  }

  GetAllregistryTemplateByStatement(statementId) {
    return this.apiService
      .get(
        `/registrytemplate/get/by/statementtypeId?StatementTypeId=${statementId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getRegistryTemplate(registryTemplateId) {
    return this.apiService
      .get(
        `/registrytemplate/single/Id?RegistryTemplateId=${registryTemplateId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getRegistry(registryId) {
    return this.apiService
      .get(`/registry/single/Id?RegistryId=${registryId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getIndustry(companyId: any): Observable<any> {
    return this.apiService
      .get(`/registry/companyregistry?Id=${companyId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteRegistry(registryId) {
    return this.apiService
      .delete(`/registry/delete?registryId=${registryId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteRegistryTemplate(registryTemplateId) {
    return this.apiService
      .delete(
        `/registryTemplate/delete?registryTemplateId=${registryTemplateId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateRegistry(body): Observable<any> {
    return this.apiService.post(`/registry/add/update`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  updateRegistryTemplate(body): Observable<any> {
    return this.apiService.post(`/registrytemplate/add/update`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllFinType() {
    return this.apiService.get("/registry/allFinType").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllFinSubType() {
    return this.apiService.get("/registry/allFinSubType").pipe(
      tap(data => {
        return data;
      })
    );
  }

  GetDistinctIndustry() {
    return this.apiService.get("/registry/get/distinct/industry").pipe(
      tap(data => {
        return data;
      })
    );
  }

  GetDistinctCaption() {
    return this.apiService.get("/registry/distinctCaption").pipe(
      tap(data => {
        return data;
      })
    );
  }

  GetDistinctSubCaption() {
    return this.apiService.get("/registry/distinctSubCaption").pipe(
      tap(data => {
        return data;
      })
    );
  }

  GetDistinctCaptionByIndustry() {
    return this.apiService.get("/registry/get/distinct/caption/by/industry").pipe(
      tap(data => {
        return data;
      })
    );
  }

  GetDistinctSubCaptionByIndustry() {
    return this.apiService.get("/registry/get/distinct/sub/caption/by/industry").pipe(
      tap(data => {
        return data;
      })
    );
  }

  GetDistinctSubCaptionByIndustryByCaption(caption) {
    return this.apiService
      .get(`/registry/get/distinct/sub/caption/by/industry/by/caption?Caption=${caption}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  exportRegistryTemplate() {
    return this.apiService.getExcel("/registrytemplate/get/download").pipe(
      tap(data => {
        return data;
      })
    );
  }

  uploadRegistryTemplate(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel("/registrytemplate/post/upload", imageFile)
      .then(data => {
        return data;
      });
  }

  exportRegistry() {
    return this.apiService.getExcel("/registry/get/download").pipe(
      tap(data => {
        return data;
      })
    );
  }

  uploadRegistry(imageFile: File, body: any): Promise<any> {
    return this.apiService
      .uploadRegistry("/registry/post/upload", imageFile, body)
      .then(data => {
        return data;
      });
  }
  deleteMultipleTemplate(payload: any): Observable<any> {
    return this.apiService
      .post(`/registrytemplate/delete/targetIds`, payload)
      .pipe(
        tap(
          data => {
            return data;
          },
          catchError(err => {
            return err;
          })
        )
      );
  }
  allregistryTemplateByIndustry(industry: string): Observable<any> {
    return this.apiService
      .get(
        `/registrytemplate/by/industry?Industry=${industry}`
      )
      .pipe(
        tap(
          data => {
            return data;
          },
          catchError(err => {
            throw err;
          })
        )
      );
  }
  deleteMultipleRegistry(payload: any): Observable<any> {
    return this.apiService
      .post(`/registry/delete/targetIds`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get registry by statement
  getRegistryByStatement(statementId: any): Observable<any> {
    return this.apiService
      .get(`/registry/get/by/statementtypeId?StatementTypeId=${statementId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getRegistryByCompany(companyId: any): Observable<any> {
    return this.apiService.get(
      `/registry/get/by/companyId?CompanyId=${companyId}`
    );
  }
  getVariables(): Observable<any> {
    return this.apiService.get(`/registry/get/all/variables`).pipe(
      tap(data => {
        return data;
      })
    );
  }
}
