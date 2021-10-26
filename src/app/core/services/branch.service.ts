import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class BranchService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllBranch() {
        return this.apiService.get("/branch/allbranch").pipe(
            map(data => {
                return data;
            })
        );
    }

    getBranch(branchId) {
        return this.apiService
            .get(`/branch/branch?branchId=${branchId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteBranch(branchId) {
        return this.apiService
            .delete(`/branch/delete?branchId=${branchId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    updateBranch(body): Observable<any> {
        return this.apiService.post(`/branch/update`, body).pipe(
            map(data => {
                return data;
            })
        );
    }
}
