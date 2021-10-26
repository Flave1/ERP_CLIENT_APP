import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class UserAccountService {
    constructor(private apiService: ApiService) { }
    userData: any = {};
    getAllUserAccount() {
        return this.apiService.get("/auth/all-user").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getSingleUserAccount(userAccountId) {
        return this.apiService
            .get(`/auth/single-user?userAccountId=${userAccountId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getStaffList() {
        return this.apiService.get(`/admin/get/all/staff`).pipe(
            tap(data => {
                return data;
            })
        );
    }

    deleteUserAccount(userAccountId) {
        return this.apiService
            .delete(`/auth/delete-user?userAccountId=${userAccountId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    addUserAccount(body): Observable<any> {
        return this.apiService.post(`/auth/user`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }

    exportUsers() {
        return this.apiService.getExcel("/auth/export-users").pipe(
            tap(data => {
                return data;
            })
        );
    }

    uploadUsers(imageFile: File): Promise<any> {
        return this.apiService
            .uploadExcel("/auth/upload-users", imageFile)
            .then(data => {
                return data
            });
    }
    deleteMultipleUsers(body) {
        return this.apiService.post(`/auth/multiple-delete-users`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }
}
