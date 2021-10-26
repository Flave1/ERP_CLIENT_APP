import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class AccountTypeService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllAccountType() {
        return this.apiService.get("/financeaccounttype/get/all").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getAccountType(accountTypeId) {
        return this.apiService
            .get(`/financeaccounttype/get/single/accounttypeId?AccountTypeId=${accountTypeId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteAccountType(accountTypeId) {
        return this.apiService
            .delete(`/accountType/delete?accountTypeId=${accountTypeId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    updateAccountType(body): Observable<any> {
        return this.apiService.post(`/financeaccounttype/add/update`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }
    exportAccountType() {
        return this.apiService.getExcel('/financeaccounttype/get/download').pipe(tap(data => {
            return data;
        }))
    };
    uploadAccountType(imageFile: File): Promise<any> {
        return this.apiService.uploadExcel('/financeaccounttype/post/upload', imageFile).then(data => {
            return data;
        })
    };
    multipleDeleteAccountType(payload) {
        return this.apiService.post('/financeaccounttype/delete/targetIds', payload).pipe(tap(data => {
            return data;
        }));
    }
}
