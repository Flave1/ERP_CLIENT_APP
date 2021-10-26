import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class LoanReviewOperationsService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getApprovedLoanReview() {
        return this.apiService
            .get("/loanOperations/get/approved/loan/review")
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    getRunningLoanDetails(loanRefNumber) {
        return this.apiService
            .get(
                `/loanOperations/get/running/loans/byrefNo?LoanRefNumber=${loanRefNumber}`
            )
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    getReviewedLoanDetails(loanId) {
        return this.apiService
            .get(
                `/lms/get/rewiew/loans/loanId?LoanId=${loanId}`
            )
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    getOperationType() {
        return this.apiService.get("/loanOperations/get/operationtype").pipe(
            map(data => {
                return data;
            })
        );
    }

    getOperationTypeRestructure() {
        return this.apiService.get("/loanOperations/get/operationtype/resturcture").pipe(
            map(data => {
                return data;
            })
        );
    }

    getLoanScheduleByLoanId(loanId) {
        return this.apiService
            .get(`/loanOperations/get/loanschedule/by/loanId?LoanId=${loanId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    // deleteLoanReviewOperations(glMappingId) {
    //     return this.apiService
    //         .delete(`/loanOperations/delete?glMappingId=${glMappingId}`)
    //         .pipe(
    //             map(data => {
    //                 return data;
    //             })
    //         );
    // }

    getLoanOperationAwaitingApproval() {
        return this.apiService
            .get("/loanOperations/getLoanOperationAwaitingApproval")
            .pipe(
                map(data => {
                    return data;
                })
            );
    }


    goForApproval(body): Observable<any> {
        return this.apiService.post(`/loanOperations/loan-reviewoperations-approval`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    addOperationReview(body): Observable<any> {
        return this.apiService
            .post(`/loanOperations/add/loan/operation/approval`, body)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }
}
