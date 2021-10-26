import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class TrialBalanceService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllTrialBalance() {
        return this.apiService.get("/trialBalance/alltrialBalance").pipe(
            map(data => {
                return data;
            })
        );
    }

    getEop() {
        return this.apiService.get("/gltransaction/get/eop").pipe(
            map(data => {
                return data;
            })
        );
    }

    runEop(period): Observable<any> {
        return this.apiService.post(`/gltransaction/run/eop?Period=${period}`).pipe(
            map(data => {
                return data;
            })
        );
    }

    exportEOP(period) {
        return this.apiService.getExcel(`/gltransaction/export/eop?period=${period}`).pipe(
            map(data => {
                return data;
            })
        );
    }

    getTrialBalance(trialBalanceId) {
        return this.apiService
            .get(`/trialBalance/trialBalance?trialBalanceId=${trialBalanceId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteTrialBalance(trialBalanceId) {
        return this.apiService
            .delete(`/trialBalance/delete?trialBalanceId=${trialBalanceId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    uploadTrialBalance(imageFile: File): Promise<any> {
        return this.apiService
            .uploadExcel("/gltransaction/upload/trialbalance", imageFile)
            .then(
               data => {
                   return data;
               }
            );
    }

    updateTrialBalance(body): Observable<any> {
        return this.apiService.post(`/trialBalance/update`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    processData(body): Observable<any> {
        return this.apiService.post(`/trialBalance/process`,body).pipe(
            map(data => {
                return data;
            })
        );
    }

    getTrialBalanceBysearch(body) {
        return this.apiService.post(`/gltransaction/get/trialbalance`, body).pipe(
            map(data => {
                return data;
            })
        );
    }
    
    getTrialBalanceBysearchCurrency(body) {
        return this.apiService.post(`/gltransaction/get/trialbalance/currency`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    exportTrialBalance(body) {
        return this.apiService.post(`/trialBalance/export`, body).pipe(
            map(data => {
                return data;
            })
        );
    }
}
