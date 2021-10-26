import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { tap } from "rxjs/operators";
import { Observable, from } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class LoanApplicationService {
    constructor(private apiService: ApiService) {}
    userData: any = {};

    getAllLoanApplication() {
        return this.apiService.get("/loanApplication/allloanApplication").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getLoanApplicationList() {
        return this.apiService
            .get("/loanapplication/get/all/list")
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getAllLoanApplicationOfferLetter() {
        return this.apiService
            .get("/loanapplication/get/all/offerletter")
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getAllLoanApplicationOfferLetterReview() {
        return this.apiService
            .get("/loanapplication/get/all/offerletter/review")
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    downloadLoanOfferLetter(loanApplicationId): Observable<any> {
        return this.apiService.post(`/loanapplication/offerletter/download?loanapplicationId=${loanApplicationId}`).pipe(
          tap(data => {
            return data;
          })
        );
      }

    getLoanApplication(loanApplicationId) {
        return this.apiService
            .get(
                `/loanapplication/get/Id?LoanApplicationId=${loanApplicationId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    GetLoanApplicationByCustomer(customerId) {
        return this.apiService
            .get(
                `/loanapplication/get/by/customer?CustomerId=${customerId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    GetRunningLoanApplicationByCustomer(customerId) {
        return this.apiService
            .get(
                `/loanapplication/get/runningloan/by/customer?CustomerId=${customerId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getRecommendations(loanApplicationId) {
        return this.apiService
            .get(
                `/loanapplication/get/recommendation?LoanApplicationId=${loanApplicationId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getLoanApplicationByCustomer(applicationRefNumber) {
        return this.apiService
            .get(
                `/loanApplication/loanApplicationByRefNumber?applicationRefNumber=${applicationRefNumber}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteLoanApplication(loanApplicationId) {
        return this.apiService
            .delete(
                `/loanApplication/delete?loanApplicationId=${loanApplicationId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    addLoanApplicationInformation(body): Observable<any> {
        return this.apiService.post(`/loanapplication/add/update`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }

    getLoanApplicationAwaitingApproval() {
        return this.apiService
            .get("/loanApplication/loanApplications-awaiting-approval")
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    goForApproval(body): Observable<any> {
        return this.apiService.post(`/loanApplication/approval`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }

    UploadCustomerOfferLetter(body: any, file: File): Promise<any> {
        return this.apiService
                .offerLetterUpload(
                    "/loanapplication/offerletter/upload",
                    body,
                    file
                )
                .then(data => {
                    return data;
                });
    }

    updateLoanRecommendation(body): Observable<any> {
        return this.apiService
            .post(`/loanapplication/add/recommendation`, body)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    SubmitForApproval(loanApplicationId) {
        return this.apiService
            .get(
                `/loanapplication/submit/appraisal?LoanApplicationId=${loanApplicationId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getAllExposure(): Observable<any> {
        return this.apiService
        .get("/loanapplication/get/all/exposure")
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    getExposureById(loanApplicationId) {
        return this.apiService
            .get(
                `/loanApplication/exposureid?id=${loanApplicationId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    deleteExposure(loanApplicationId) {
        return this.apiService
            .delete(
                `/loanApplication/deleteexposure?id=${loanApplicationId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    addUpdateExposure(body): Observable<any> {
        return this.apiService.post(`/loanapplication/add/update/exposure`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }
}
