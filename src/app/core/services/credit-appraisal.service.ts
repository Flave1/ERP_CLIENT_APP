import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class CreditAppraisalService {
    constructor(private apiService: ApiService) {}
    userData: any = {};

    getCreditLoanApplication() {
        return this.apiService.get("/creditappraisal/get/all").pipe(
            map(data => {
                return data;
            })
        );
    }
    getUserPriviledge(operationId) {
        return this.apiService
            .get(`/workflow/staff/canedit`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }
    getApprovalTrail(targetId, WorkflowToken) {
        return this.apiService
            .get(
                `/creditappraisal/get/approval/comments?TargetId=${targetId}&WorkflowToken=${WorkflowToken}`
            )
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    goForApproval(body): Observable<any> {
        return this.apiService.post(`/creditappraisal/update/loan/approval`, body).pipe(
            map(data => {
                return data;
            })
        );
    }
}
