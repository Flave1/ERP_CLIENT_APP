import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class CityService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  getAllCity() {
    return this.apiService.get("/city/allcity").pipe(
      map(data => {
        return data;
      })
    );
  }

  deleteCity(cityId) {
    return this.apiService.delete(`/city/delete?cityId=${cityId}`).pipe(
      map(data => {
        return data;
      })
    );
  }

  updateCity(body): Observable<any> {
    return this.apiService.post(`/city/update`, body).pipe(
      map(data => {
        return data;
      })
    );
  }
  multiDeleteCity(payload: Object): Observable<any> {
    return this.apiService.post(`/common/delete/cityById`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }
  exportCity(): Observable<any> {
    return this.apiService.getExcel(`/common/download/cities`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  uploadCity(File: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/common/upload/city`, File)
      .then(data => {
        return data;
      });
  }
}
