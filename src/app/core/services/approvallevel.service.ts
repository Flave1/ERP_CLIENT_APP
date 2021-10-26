import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class ApprovalLevelService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllApprovalLevel() {
        return this.apiService.get("/approvalLevel/allapprovalLevel").pipe(
            map(data => {
                return data;
            })
        );
    }

    getApprovalLevel(approvalLevelId) {
        return this.apiService
            .get(`/approvalLevel/approvalLevel?approvalLevelId=${approvalLevelId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteApprovalLevel(approvalLevelId) {
        return this.apiService
            .delete(`/approvalLevel/delete?approvalLevelId=${approvalLevelId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    updateApprovalLevel(body): Observable<any> {
        return this.apiService.post(`/approvalLevel/update`, body).pipe(
            map(data => {
                return data;
            })
        );
    }
}
