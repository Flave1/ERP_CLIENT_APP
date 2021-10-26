import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class ApprovalLevelStaffService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllApprovalLevelStaff() {
        return this.apiService.get("/approvalLevelStaff/allapprovalLevelStaff").pipe(
            map(data => {
                return data;
            })
        );
    }

    getApprovalLevelStaff(approvalLevelStaffId) {
        return this.apiService
            .get(`/approvalLevelStaff/approvalLevelStaff?approvalLevelStaffId=${approvalLevelStaffId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteApprovalLevelStaff(approvalLevelStaffId) {
        return this.apiService
            .delete(`/approvalLevelStaff/delete?approvalLevelStaffId=${approvalLevelStaffId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    updateApprovalLevelStaff(body): Observable<any> {
        return this.apiService.post(`/approvalLevelStaff/update`, body).pipe(
            map(data => {
                return data;
            })
        );
    }
}
