import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map } from "rxjs/operators";
import { Observable, from } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class LmsService {
    constructor(private apiService: ApiService) {}

    // getAllLoanApplication() {
    //     return this.apiService.get("/loan/reviewed-loans").pipe(
    //         map(data => {
    //             return data;
    //         })
    //     );
    // }
    // getAllBookedLoan() {
    //     return this.apiService.get("/loan/loan-booking-list").pipe(
    //         map(data => {
    //             return data;
    //         })
    //     );
    // }
    // addLoanBooking(body): Observable<any> {
    //     return this.apiService.post(`/loan/loan-booking`, body).pipe(
    //         map(data => {
    //             return data;
    //         })
    //     );
    // }
    // goForApproval(body): Observable<any> {
    //     return this.apiService.post(`/loan/loan-booking-approval`, body).pipe(
    //         map(data => {
    //             return data;
    //         })
    //     );
    // }

    searchForLoan(body): Observable<any> {
        return this.apiService.post(`/lms/get/all/running/loans`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    getSingleLoanReviewApplication(loanReviewApplicationId) {
        return this.apiService
            .get(
                `/lms/get/review/loans?LoanReviewApplicationId=${loanReviewApplicationId}`
            )
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    addUpdateLoanReviewApplication(body): Observable<any> {
        return this.apiService.post(`/lms/add/application`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    getAllLoanReviewApplicationAwaitingApproval() {
        return this.apiService.get("/lms/get/all/loan/review/approval/list").pipe(
            map(data => {
                return data;
            })
        );
    }

    goForLoanReviewApproval(body): Observable<any> {
        return this.apiService.post(`/lms/add/loan/review/approval`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    SaveLoanReviewApprovalSchedule(body): Observable<any> {
        return this.apiService.post(`/lms/add/loan/review/approval/schedule`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    getLoanReviewLog(loanReviewApplicationId) {
        return this.apiService
            .get(
                `/lms/get/loan/review/log?LoanReviewApplicationId=${loanReviewApplicationId}`
            )
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    addLoanReviewLog(body): Observable<any> {
        return this.apiService.post(`/lms/add/loan/review/log`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    getLoanReviewOfferLetter() {
        return this.apiService.get(`/lms/get/loan/review/offer/letter`).pipe(
            map(data => {
                return data;
            })
        );
    }

    UploadLoanReviewOfferLetter(body: any, file: File): Promise<any> {
        return this.apiService
                .offerLetterUpload(
                    "/lms/loan/review/offer/letter/upload",
                    body,
                    file
                )
                .then(data => {
                    return data;
                });
    }
}
