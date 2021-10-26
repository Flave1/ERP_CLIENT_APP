import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Observable, from } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class CreditRiskScoreCardService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  getAllCreditRiskScoreCard() {
    return this.apiService.get("/creditriskscorecard/get/all").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllGroupedAttribute() {
    return this.apiService.get("/creditriskscorecard/get/group/attribute").pipe(
      tap(data => {
        return data;
      })
    );
  }

  GetAllCreditRiskScoreCardTemplate() {
    return this.apiService
      .get("/creditRiskScoreCard/allcreditRiskScoreCardTemplate")
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getCreditRiskScoreCard(creditRiskAttributeId) {
    return this.apiService
      .get(
        `/creditriskscorecard/get/Id?CreditRiskAttributeId=${creditRiskAttributeId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteCreditRiskScoreCard(creditRiskScoreCardId) {
    return this.apiService
      .delete(
        `/creditRiskScoreCard/delete?creditRiskScoreCardId=${creditRiskScoreCardId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateCreditRiskScoreCard(body): Observable<any> {
    return this.apiService.post(`/creditriskscorecard/add/update`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }
multiDeleteScoredCard(ids: any):Observable<any> {
    return this.apiService.post(`/creditriskscorecard/delete`, ids).pipe(tap(data => {
      return data;
    }))
}
  getAllRepaymentType() {
    return this.apiService.get("/creditRiskScoreCard/allrepaymentType").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllCreditRiskCategory() {
    return this.apiService.get(`/creditriskscorecard/get/all/category`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllSystemCreditRiskAttribute() {
    return this.apiService
      .get(`/creditriskscorecard/get/system/attribute`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSingleCreditRiskCategory(creditRiskCategoryId) {
    return this.apiService
      .get(
        `/creditriskscorecard/get/Id/category?CreditRiskCategoryId=${creditRiskCategoryId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteCreditRiskCategory(creditRiskCategoryId) {
    return this.apiService
      .delete(
        `/creditRiskScoreCard/risk-category?creditRiskCategoryId=${creditRiskCategoryId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateCreditRiskCategory(body): Observable<any> {
    return this.apiService
      .post(`/creditriskscorecard/add/update/category`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllCreditRiskAttribute() {
    return this.apiService.get(`/creditriskscorecard/get/all/attribute`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllMappedCreditRiskAttribute() {
    return this.apiService
      .get(`/creditriskscorecard/get/mapped/attribute`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSingleCreditRiskAttribute(creditRiskAttributeId) {
    return this.apiService
      .get(
        `/creditriskscorecard/get/Id/attribute?CreditRiskAttributeId=${creditRiskAttributeId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteCreditRiskAttribute(creditRiskAttributeId) {
    return this.apiService
      .delete(
        `/creditRiskScoreCard/risk-attribute?creditRiskAttributeId=${creditRiskAttributeId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  exportCreditRiskAttribute() {
    return this.apiService
      .getExcel("/creditriskscorecard/download/attribute")
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadCreditRiskAttribute(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel("/creditriskscorecard/upload/attribute", imageFile)
      .then(data => {
        return data;
      });
  }
  deleteMultipleCreditRiskAttribute(body) {
    return this.apiService
      .post(`/creditriskscorecard/delete/attribute`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateCreditRiskAttribute(body): Observable<any> {
    return this.apiService
      .post(`/creditriskscorecard/add/update/attribute`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllCreditBureau() {
    return this.apiService.get(`/creditriskscorecard/get/all/creditbureau`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getApplicationCreditBureau(loanApplicationId) {
    return this.apiService
      .get(
        `/creditriskscorecard/get/Id/loan/creditbureau?LoanApplicationId=${loanApplicationId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSingleCreditBureau(creditBureauId) {
    return this.apiService
      .get(
        `/creditriskscorecard/get/Id/creditbureau?CreditBureauId=${creditBureauId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteCreditBureau(creditBureauId) {
    return this.apiService
      .delete(
        `/creditRiskScoreCard/credit-bureau?creditBureauId=${creditBureauId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateCreditBureau(body): Observable<any> {
    return this.apiService
      .post(`/creditriskscorecard/add/update/creditbureau`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllCreditRating() {
    return this.apiService.get(`/creditriskscorecard/get/all/rating`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getCreditRatingDetail(loanApplicationId) {
    return this.apiService
      .get(
        `/creditriskscorecard/get/loanapplicationId/rating?LoanApplicationId=${loanApplicationId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSingleCreditRating(creditRiskRatingId) {
    return this.apiService
      .get(
        `/creditriskscorecard/get/Id/rating?CreditRiskRatingId=${creditRiskRatingId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteCreditRating(creditRiskRatingId) {
    return this.apiService
      .delete(
        `/creditRiskScoreCard/risk-rating?creditRiskRatingId=${creditRiskRatingId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateCreditRating(body): Observable<any> {
    return this.apiService
      .post(`/creditriskscorecard/add/update/rating`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  exportCreditCreditRating() {
    return this.apiService
      .getExcel("/creditriskscorecard/download/rating")
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadCreditCreditRating(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel("/creditriskscorecard/upload/rating", imageFile)
      .then(data => {
        return data;
      });
  }
  deleteMultipleCreditRating(body) {
    return this.apiService
      .post(`/creditriskscorecard/delete/rating`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllWeightedRiskScore() {
    return this.apiService.get(`/creditRiskScoreCard/all-weighted-risk`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getSingleWeightedRiskScore(productId) {
    return this.apiService
      .get(`/creditriskscorecard/get/Id/weightedscore?ProductId=${productId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getWeightedRiskScoreByCustomerType(productId, customerTypeId) {
    return this.apiService
      .get(
        `/creditriskscorecard/get/customertype/weightedscore?ProductId=${productId}&CustomerTypeId=${customerTypeId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteWeightedRiskScore(weightedRiskScoreId) {
    return this.apiService
      .delete(
        `/creditRiskScoreCard/weighted-risk?weightedRiskScoreId=${weightedRiskScoreId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateWeightedRiskScore(body): Observable<any> {
    return this.apiService
      .post(`/creditriskscorecard/add/update/weightedscore`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getApplicationAttribute(loanApplicationId) {
    return this.apiService
      .get(
        `/creditriskscorecard/get/application/attribute?LoanApplicationId=${loanApplicationId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateCreditRiskApplicationScoreCard(body): Observable<any> {
    return this.apiService
      .post(`/creditriskscorecard/add/application/scorecard`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  UploadLoanCreditBureau(body: any, file: File): Promise<any> {
    return this.apiService
      .upload("/creditriskscorecard/add/update/loan/creditbureau", body, file)
      .then(data => {
        return data;
      })
  }

  getAllCreditRatingPD() {
    return this.apiService.get(`/creditRiskScoreCard/all-risk-rating-pd`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getGroupedPdRating() {
    return this.apiService
      .get(`/creditriskscorecard/get/grouped/rating/pd`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  // getCreditRatingDetail(loanApplicationId) {
  //     return this.apiService.get(`/creditRiskScoreCard/risk-rating-detail?loanApplicationId=${loanApplicationId}`).pipe(
  //         tap(data => {
  //             return data;
  //         })
  //     );
  // }

  getSingleCreditRatingPD(creditRiskRatingPDId) {
    return this.apiService
      .get(
        `/creditriskscorecard/get/Id/rating/pd?CreditRiskRatingPDId=${creditRiskRatingPDId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteCreditRatingPD(creditRiskRatingPDId) {
    return this.apiService
      .delete(
        `/creditRiskScoreCard/risk-rating-pd?creditRiskRatingPDId=${creditRiskRatingPDId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateCreditRatingPD(body): Observable<any> {
    return this.apiService
      .post(`/creditriskscorecard/add/update/rating/pd`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  multiDeleteRating(payload: Object): Observable<any> {
    return this.apiService
      .post(`/creditriskscorecard/delete/rating/pd`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  uploadPdRiskRating(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/creditriskscorecard/upload/rating/pd`, file)
      .then(data => {
        return data;
      });
  }
  exportPdRiskRating(): Observable<any> {
    return this.apiService
      .get(`/creditriskscorecard/download/rating/pd`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  exportCreditBureauData(): Observable<any> {
    return this.apiService
      .getExcel(`/creditriskscorecard/download/creditbureau`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  uploadCreditBureauData(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/creditriskscorecard/upload/creditbureau`, imageFile)
      .then(data => {
        return data;
      });
  }
  multipleDeleteCreditBureau(payload: any): Observable<any> {
    return this.apiService
      .post(`/creditriskscorecard/delete/creditbureau`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getCreditBureauList(): Observable<any> {
    return this.apiService.get(`/creditriskscorecard/get/all/creditbureau`).pipe(tap(data => {
      return data;
    }))
  }
}
