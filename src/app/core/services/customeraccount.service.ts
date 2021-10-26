import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class CustomerAccountService {
    constructor(private apiService: ApiService) {}
    userData: any = {};

    getAllCustomerAccount() {
        return this.apiService.get("/accountopening/get/casa/list").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getCustomerAccount(casaAccountId) {
        return this.apiService
            .get(`/casa/getCustomerAccount?casaAccountId=${casaAccountId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getCustomerAccountNumber(customerAccountNumber) {
        return this.apiService
            .get(
                `/casa/getCustomerAccountNumber?customerAccountNumber=${customerAccountNumber}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteCustomerAccount(casaAccountId) {
        return this.apiService
            .delete(`/casa/delete?casaAccountId=${casaAccountId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    addUpdateCasa(body): Observable<any> {
        return this.apiService.post(`/casa/update`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }

    getCustomerAccountAwaitingApproval() {
        return this.apiService.get("/casa/casa-awaiting-approval").pipe(
            tap(data => {
                return data;
            })
        );
    }

    goForApproval(body): Observable<any> {
        return this.apiService.post(`/casa/approval`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }

    getCustomerAccounts(customerId): Observable<any> {
        return this.apiService
            .get(`/casa/customer-casa-accounts?customerId=${customerId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
}
