import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class IdentificationService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  getAllIdentification() {
    return this.apiService.get("/common/Identifications").pipe(
      map(data => {
        return data;
      })
    );
  }

  getIdentification(identificationId) {
    return this.apiService
      .get(
        `/common/get/single/identificationById?IdentificationId=${identificationId}`
      )
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  deleteIdentification(identificationId) {
    return this.apiService
      .delete(`/identification/delete?identificationId=${identificationId}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }



  updateIdentification(body): Observable<any> {
    return this.apiService.post(`/identification/update`, body).pipe(
      map(data => {
        return data;
      })
    );
  }
  exportIdentification(): Observable<any> {
    return this.apiService
      .getExcel(`/common/download/identification`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  uploadIdentification(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/identification/upload-identification`, imageFile)
      .then(data => {
        return data;
      });
  }
}
