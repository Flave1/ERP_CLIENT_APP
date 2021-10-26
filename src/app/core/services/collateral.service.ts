import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollateralService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  getAllCollateralType() {
    return this.apiService.get('/collateral/get/all/collateraltype').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllCollateralManagementResource() {
    return this.apiService.get(`/collateral/get/collateral/management`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllowableCollateralTypesByLoanApplicationId(loanApplicationId: number) {
    return this.apiService
      .get(
        `/collateral/get/allowable/collateraltype?LoanApplicationId=${loanApplicationId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCollateralType(collateralTypeId) {
    return this.apiService
      .get(
        `/collateral/get/Id/collateraltype?CollateralTypeId=${collateralTypeId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteCollateralType(collateralTypeId) {
    return this.apiService
      .delete(
        `/collateral/collateral-type?collateralTypeId=${collateralTypeId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  addUpdateCollateralType(body): Observable<any> {
    return this.apiService
      .post(`/collateral/add/update/collateraltype`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  exportCollateralType() {
    return this.apiService.getExcel('/collateral/download/collateraltype').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  uploadCollateralType(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel('/collateral/upload/collateraltype', imageFile)
      .then((data) => {
        return data;
      });
  }
  deleteMultipleCollateralType(body) {
    return this.apiService.post(`/collateral/delete/collateraltype`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllCollateralCustomer() {
    return this.apiService.get('/collateral/get/all/collateralcustomer').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getSingleCollateralCustomer(customerId) {
    return this.apiService
      .get(`/collateral/collateral/single/customer?CustomerId=${customerId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCollateralCustomer(collateralCustomerId) {
    return this.apiService
      .get(
        `/collateral/get/collateralcustomerById?CollateralCustomerId=${collateralCustomerId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteCollateralCustomer(body) {
    return this.apiService
      .post(`/collateral/delete/collateralcustomer`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  addUpdateCollateralCustomerWithDocument(file: File, body: any) {
    return this.apiService
      .uploadCollateralDocumentWithData(
        `/collateral/add/update/collateralcustomerdocument`,
        file,
        body
      )
      .then((data) => {
        return data;
      });
  }
  addUpdateCollateralCustomer(body): Observable<any> {
    return this.apiService
      .post(`/collateral/add/collateralcustomer`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  exportCollateralCustomer() {
    return this.apiService
      .getExcel('/collateral/download/collateralcustomer')
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  uploadCollateralCustomer(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel('/collateral/upload/collateralcustomer', imageFile)
      .then((data) => {
        return data;
      });
  }
  deleteMultipleCollateralCustomer(body) {
    return this.apiService
      .post(`/collateral/delete/collateralcustomer`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCustomerCollateral(
    loanApplicationId,
    verificationStatus: boolean,
    includeNotAllowSharing: boolean
  ) {
    return this.apiService
      .get(
        `/collateral/get/customer/collateral?LoanApplicationId=${loanApplicationId}&IncludeNotAllowSharing=${includeNotAllowSharing}&VerificationStatus=${verificationStatus}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCollateralMappingViewLoanApplicationId(
    loanApplicationId: number,
    collateralCustomerId: number,
    collateralCustomerConsumptionId: number
  ) {
    return this.apiService
      .get(
        `/collateral/current/customer/collateral/value?CollateralCustomerId=${collateralCustomerId}&collateralCustomerConsumptionId=${collateralCustomerConsumptionId}&LoanApplicationId=${loanApplicationId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getLoanCollateral(loanApplicationId) {
    return this.apiService
      .get(
        `/collateral/get/loanapplicationccollateral/loanapplicationId?LoanApplicationId=${loanApplicationId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteLoanCollateral(loanApplicationCollateralId) {
    return this.apiService
      .delete(
        `/collateral/loan-collateral?loanApplicationCollateralId=${loanApplicationCollateralId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteLoanConsumptionCollateral(body) {
    return this.apiService
      .post(`/collateral/delete/loancustomercollateral`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  addUpdateCustomerLoanCollateralConsumption(body): Observable<any> {
    return this.apiService
      .post(`/collateral/customer/loan/collateral/consumption`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getRequireLoanCollateralAmount(loanApplicationId: number) {
    return this.apiService
      .get(
        `/collateral/require/collateral/value?LoanApplicationId=${loanApplicationId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  addUpdateLoanCollateral(body): Observable<any> {
    return this.apiService.post(`/collateral/loan-collateral`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  // upload collaterals

  uploadCollaterals(): Observable<any> {
    return this.apiService
      .post(`/collateral/upload/collateralcustomer/document`, {})
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  // upload collateral types
  uploadCollateralTypes(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/collateral/upload/collateralcustomer`, file)
      .then((data) => {
        return data;
      });
  }
  downloadCollateralDocument(id: number): Observable<any> {
    return this.apiService
      .get(
        `/collateral/download/collateral/document?collateralCustomerId=${id}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  downloadCollaterals() {
    return this.apiService
      .getExcel(`/collateral/download/collateral/customers`)
      .pipe(tap((data) => data));
  }
}
