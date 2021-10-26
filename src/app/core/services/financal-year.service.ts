import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { tap } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class FinancalYearService {
    constructor(private apiService: ApiService) {}
    updateFinancialYear(payload: any): Observable<any> {
        return this.apiService.post(`/financialyear/add/update`, payload).pipe(
            tap(data => {
                return data;
            })
        );
    }
    getAllFinacialYear(): Observable<any> {
        return this.apiService.get(`/financialyear/get/all`).pipe(
            tap(data => {
                return data;
            })
        );
    }
    getAllFinacialYearByStatus(): Observable<any> {
        return this.apiService.get(`/financialyear/get/status `).pipe(
            tap(data => {
                return data;
            })
        );
    }
    getFinancialYear(id: any): Observable<any> {
        return this.apiService.get(
                `/financialyear/get/single/Id?FinancialYearId=${id}`)
            .pipe(tap(data => {
                    return data;
                })
            );
    }
    multipleDeleteMethod(payload: any):Observable<any> {
        return this.apiService.post(`/financialyear/delete/targetIds`, payload).pipe(tap(data => {
            return data;
        }))
    };
    exportFinancialYear():Observable<any> {
        return this.apiService.get(`/financialyear/get/download`).pipe(tap(data => {
            return data
        }))
    };
    uploadFinancialYear(imageFile: File): Promise<any> {
        return this.apiService.uploadExcel(`/financialyear/post/upload`, imageFile).then(data => {
            return data
        })
    }
}
