import { Injectable } from "@angular/core";
import {map, tap} from 'rxjs/operators';
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class GLTransactionService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllGLTransaction() {
        return this.apiService.get("/glTransaction/allglTransaction").pipe(
            map(data => {
                return data;
            })
        );
    }

    getAllGLCustomerTransaction() {
        return this.apiService.get("/glTransaction/allglCustomerTransaction").pipe(
            map(data => {
                return data;
            })
        );
    }

    getGLTransaction(glTransactionId) {
        return this.apiService
            .get(`/glTransaction/get/single?TransactionId=${glTransactionId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    getGLCustomerTransaction(glTransactionId) {
        return this.apiService
            .get(`/glTransaction/glCustomerTransaction?glTransactionId=${glTransactionId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }
    getDepositTransaction(payload) {
        return this.apiService
            .post(`/creditappraisal/search/customer/transaction`, payload)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }
    glTransactionSearch(payload: Object): Observable<any> {
        return this.apiService.post(`/glTransaction/search`, payload).pipe(map(data => {
            return data
        }))
    }
    exportGlTransactions(payload: any):Observable<any> {
        return this.apiService.post(`/glTransaction/export`, payload).pipe(tap(data => {
            return data;
        }))
    }
    exportCustomerTransaction(payload: any):Observable<any> {
        return this.apiService.post(`/creditappraisal/export/customer/transaction`, payload).pipe(tap(data => {
            return data;
        }))
    }

    fsTemplateReport(payload: any):Observable<any> {
        return this.apiService.post(`/gltransaction/upload/fstemplate`, payload).pipe(tap(data => {
            return data;
        }))
    }
}
