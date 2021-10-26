import { JwtService } from './jwt.service';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoanCustomerService {
  // http: any;
  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private http: HttpClient
  ) {}

  private handleError(error: any) {
    return throwError(error);
  }
  userData: any = {};

  getAllLoanCustomer() {
    return this.apiService.get('/loancustomer/get/all/lite').pipe(
      tap(data => {
        return data;
      })
    );
  }
  searchCustomers(
    fullName: string,
    email: string,
    accountNumber: string
  ): Observable<any> {
    return this.apiService
      .get(
        `/loancustomer/get/all/lite/search?FullName=${fullName}&Email=${email}&AccountNumber=${accountNumber}`
      )
      .pipe(tap(data => {
        return data;
      }), );
  }

  searchLoanCustomers(
    fullName: string, email: string, accountNumber:string
  ): Observable<any> {
    return this.apiService
      .get(
        `/loancustomer/start/loan/customer/search?FullName=${fullName}&Email=${email}&AccountNumber=${accountNumber}`
      )
      .pipe(tap(data => {
        return data;
      }), );
  }
  getCustomer(id: number): Observable<any> {
    return this.apiService
      .get(`/loancustomer/get/loancustomerById?CustomerId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getAllLoanCustomerLite(event: any = 0) {
    return this.apiService.get('/loancustomer/get/all/lite').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllStartLoanCustomer() {
    return this.apiService.get('/loancustomer/start/loan/customer').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllLoanCustomerDirector() {
    return this.apiService.get('/loanCustomer/allloanCustomerDirector').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllLoanCustomerNextOfKin() {
    return this.apiService.get('/loanCustomer/allloanCustomerNextOfKin').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllLoanCustomerDocument() {
    return this.apiService.get('/loanCustomer/allloanCustomerDocument').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllLoanCustomerBankDetails() {
    return this.apiService.get('/loanCustomer/allloanCustomerBankDetails').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllLoanCustomerDirectorShareHolder() {
    return this.apiService
      .get('/loanCustomer/allloanCustomerDirectorShareHolder')
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllLoanCustomerIdentityDetails() {
    return this.apiService
      .get('/loanCustomer/allloanCustomerIdentityDetails')
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // getLoanCustomerByCountry(countryId) {
  //     return this.apiService
  //         .get(`/loanCustomer/loanCustomerbycountry?countryId=${countryId}`)
  //         .pipe(
  //             tap(data => {
  //                 return data;
  //             })
  //         );
  // }

  getAllStartLoanCustomerbyId(loanCustomerId) {
    return this.apiService
      .get(`/loancustomer/start/loan/customer/Id?CustomerId=${loanCustomerId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomer(loanCustomerId) {
    return this.apiService
      .get(`/loancustomer/get/loancustomerById?CustomerId=${loanCustomerId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  loanCustomerCASA(loanCustomerId) {
    return this.apiService
      .get(`/loancustomer/get/loancustomer/casa?CustomerId=${loanCustomerId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerDirector(loanCustomerDirectorId) {
    return this.apiService
      .get(
        `/loanCustomer/loanCustomerdirector?loanCustomerDirectorId=${loanCustomerDirectorId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerNextOfKin(loanCustomerNextOfKinId) {
    return this.apiService
      .get(
        `/loanCustomer/loanCustomerNextOfKin?loanCustomerNextOfKinId=${loanCustomerNextOfKinId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerDocument(loanCustomerDocumentId) {
    return this.apiService
      .get(
        `/loancustomer/get/documentById?DocumentTypeId=${loanCustomerDocumentId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerBankDetails(loanCustomerBankDetailsId) {
    return this.apiService
      .get(
        `/loanCustomer/loanCustomerBankDetails?loanCustomerBankDetailsId=${loanCustomerBankDetailsId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerCardDetails(CustomerId) {
    return this.apiService
      .get(`/loancustomer/get/carddetails/customer?CustomerId=${CustomerId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerDirectorShareHolder(loanCustomerDirectorShareHolderId) {
    return this.apiService
      .get(
        `/loanCustomer/loanCustomerDirectorShareHolder?loanCustomerDirectorShareHolderId=${loanCustomerDirectorShareHolderId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerIdentityDetails(loanCustomerIdentityDetailsId) {
    return this.apiService
      .get(
        `/loanCustomer/loanCustomerIdentityDetails?loanCustomerIdentityDetailsId=${loanCustomerIdentityDetailsId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerDirectorByLoanCustomer(customerId) {
    return this.apiService
      .get(`/loancustomer/get/director/customer?CustomerId=${customerId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerNextOfKinByLoanCustomer(customerId) {
    return this.apiService
      .get(`/loancustomer/get/nextofkin/customer?CustomerId=${customerId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerDocumentByLoanCustomer(customerId) {
    return this.apiService
      .get(`/loancustomer/get/document/customer?CustomerId=${customerId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerBankDetailsByLoanCustomer(customerId) {
    return this.apiService
      .get(`/loancustomer/get/bankdetails/customer?CustomerId=${customerId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerDirectorShareHolderByLoanCustomer(customerId) {
    return this.apiService
      .get(
        `/loancustomer/get/directorshareholder/customer?CustomerId=${customerId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getLoanCustomerIdentityDetailsByLoanCustomer(customerId) {
    return this.apiService
      .get(`/loancustomer/get/identity/customer?CustomerId=${customerId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteLoanCustomer(loanCustomerId) {
    return this.apiService
      .delete(`/loanCustomer/delete?loanCustomerId=${loanCustomerId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteLoanCustomerDirector(ids: any) {
    return this.apiService.post(`/loancustomer/delete/director`, ids).pipe(
      tap(data => {
        return data;
      })
    );
  }
  deleteLoanCustomerNextOfKin(ids: any) {
    return this.apiService.post(`/loancustomer/delete/nextofkin`, ids).pipe(
      tap(data => {
        return data;
      })
    );
  }
  deleteLoanCustomerDocument(ids) {
    return this.apiService
      .post(`/loancustomer/delete/document?Ids=${ids}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteLoanCustomerBankDetails(ids: any) {
    return this.apiService.post(`/loancustomer/delete/bankdetails`, ids).pipe(
      tap(data => {
        return data;
      })
    );
  }
  deleteLoanCustomerDirectorShareHolder(ids: any[]) {
    return this.apiService
      .post(`/loancustomer/delete/directorshareholder`, ids)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteLoanCustomerIdentityDetails(ids: any) {
    return this.apiService.post(`/loancustomer/delete/identity`, ids).pipe(
      tap(data => {
        return data;
      })
    );
  }

  addLoanCustomerInformation(body): Observable<any> {
    return this.apiService.post(`/loancustomer/add/update`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }
  addLoanCustomerDirector(file: File, body: any): Promise<any> {
    return this.apiService
      .uploadCreditDirectorSignature(file, body)
      .then(data => {
        return data;
      });
  }
  addLoanCustomerNextOfKin(body): Observable<any> {
    return this.apiService
      .post(`/loancustomer/add/update/nextofkin`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  addLoanCustomerDocument(body): Observable<any> {
    return this.apiService.post(`/loanCustomer/updatedocument`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }
  addLoanCustomerBankDetails(body): Observable<any> {
    return this.apiService
      .post(`/loancustomer/add/update/bankdetails`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  addLoanCustomerCardDetails(body): Observable<any> {
    return this.apiService
      .post(`/loancustomer/add/update/carddetails`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  validateCardDetails(cardNumber): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('content-type', 'application/json');
    headers.set(
      'Authorization',
      `Bearer FLWSECK-578dd3a5c39b33130235efdf21506fe4-X`
    );
    return this.http
      .get(`https://api.flutterwave.com/v3/card-bins/${cardNumber}`, {
        headers
      })
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  addLoanCustomerDirectorShareHolder(body): Observable<any> {
    return this.apiService
      .post(`/loancustomer/add/update/directorshareholder`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addLoanCustomerIdentityDetails(body): Observable<any> {
    return this.apiService.post(`/loancustomer/add/update/identity`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getLoanCustomerAwaitingApproval() {
    return this.apiService
      .get('/loanCustomer/loanCustomers-awaiting-approval')
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  goForApproval(body): Observable<any> {
    return this.apiService.post(`/loanCustomer/approval`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  uploadFile(file: File, body: any) {
    return this.apiService.uploadFileLoanCustomer(file, body).then(data => {
      return data;
    });
  }

  deleteMultipleLoanCustomer(body) {
    return this.apiService.post(`/loancustomer/delete`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }
  viewSignature(directorId: any, customerId: any): Observable<any> {
    return this.apiService
      .get(
        `/loancustomer/get/director/signature?CustomerId=${customerId}&CustomerDirectorId=${directorId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  uploadLoanCustomer(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/loancustomer/upload`, file)
      .then(data => {
        return data;
      });
  }
  exportLoanCustomer(): Observable<any> {
    return this.apiService.get(`/loancustomer/download`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  uploadNextOfKins(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/loancustomer/upload/nextofkin`, file)
      .then(data => {
        return data;
      });
  }

  uploadDirectors(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/loancustomer/upload/director`, file)
      .then(data => {
        return data;
      });
  }

  uploadIndividualCustomers(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/loancustomer/individual/upload`, file)
      .then(data => {
        return data;
      });
  }

  uploadCorporateCustomers(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/loancustomer/corporate/upload`, file)
      .then(data => {
        return data;
      });
  }

  downloadIndividual() {
    return this.apiService.get('/loancustomer/download').pipe(
      tap(data => {
        return data;
      })
    );
  }

  downloadCorporate() {
    return this.apiService.get('/loancustomer/corporate/download').pipe(
      tap(data => {
        return data;
      })
    );
  }
  uploadIdentityDetails(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/loancustomer/upload/identity`, file)
      .then(data => {
        return data;
      });
  }

  uploadBankDetails(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/loancustomer/upload/bankdetails`, file)
      .then(data => {
        return data;
      });
  }

  uploadCardDetails(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/loancustomer/upload/carddetails`, file)
      .then(data => {
        return data;
      });
  }
}
