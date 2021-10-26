import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class ApprovalGroupService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllApprovalGroup() {
        return this.apiService.get("/approvalGroup/allapprovalGroup").pipe(
            map(data => {
                return data;
            })
        );
    }

    getApprovalGroup(approvalGroupId) {
        return this.apiService
            .get(
                `/approvalGroup/approvalGroup?approvalGroupId=${approvalGroupId}`
            )
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteApprovalGroup(approvalGroupId) {
        return this.apiService
            .delete(`/approvalGroup/delete?approvalGroupId=${approvalGroupId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    updateApprovalGroup(body): Observable<any> {
        return this.apiService.post(`/approvalGroup/update`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    getOperations() {
        return this.apiService.get(`/approvalGroup/operation`).pipe(
            map(data => {
                return data;
            })
        );
    }
    getOperationTypes() {
        return this.apiService.get(`/approvalGroup/operation-type`).pipe(
            map(data => {
                return data;
            })
        );
    }

    getApprovalGroupMapping(operationId) {
        return this.apiService
            .get(
                `/approvalGroup/approval-group-mapping?operationId=${operationId}`
            )
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteApprovalGroupMapping(approvalGroupMappingId) {
        return this.apiService
            .delete(
                `/approvalGroup/delete-mapping?approvalGroupMappingId=${approvalGroupMappingId}`
            )
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    updateApprovalGroupMapping(body): Observable<any> {
        return this.apiService.post(`/approvalGroup/update-mapping`, body).pipe(
            map(data => {
                return data;
            })
        );
    }
}
