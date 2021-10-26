import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepositAccountOpeningService {
  constructor(private apiService: ApiService) {}
  userData: any = {};

  getAllCustomerLite() {
    return this.apiService
      .get('/deposit/accountopening/get/individual_corporate/customer_lite')
      .pipe(
        tap((data) => {
          return data;
        }),
        map((res) => {
          return res.list;
        })
      );
  }
  getAllCustomerOtherLite() {
    return this.apiService
      .get('/accountopening/get/all/customerlite/otherinfo')
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getAllDepositForm() {
    return this.apiService.get('/accountsetup/get/all/depositform').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteCustomer(cityId): Observable<any> {
    return this.apiService.post(`/deposit2/customer?id=${cityId}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteDepositForm(cityId): Observable<any> {
    return this.apiService.post(`/deposit2/depositform?id=${cityId}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteCustomerIdentityDetails(cityId): Observable<any> {
    return this.apiService.post(`/deposit2/identity?id=${cityId}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteCustomerNextofKin(cityId): Observable<any> {
    return this.apiService.post(`/deposit2/nextofkin?id=${cityId}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteCustomerContactPersons(KeyContactPersonId): Observable<any> {
    return this.apiService
      .post(`/accountopening/delete/keycontacts`, KeyContactPersonId)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteCustomerDirector(payload): Observable<any> {
    return this.apiService
      .post(`/accountopening/delete/directors`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteCustomerSignatory(signatoriesId): Observable<any> {
    return this.apiService
      .post(`/accountopening/delete/signatory`, signatoriesId)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteMultipleCustomer(body): Observable<any> {
    return this.apiService.post(`/deposit2/customer`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteMultipleDepositForm(body): Observable<any> {
    return this.apiService.post(`/accountsetup/delete/depositform`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  deleteCustomerBankDetails(body): Observable<any> {
    return this.apiService.post(`/deposit2/customer`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getCustomer(id) {
    return this.apiService
      .get(`/accountopening/get/customerdetailsbyid?CustomerId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getDirector(setupId) {
    return this.apiService.get(`/deposit2/directorid?id=${setupId}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getDepositformById(setupId) {
    return this.apiService
      .get(`/accountsetup/get/depositformbyid?SearchId=${setupId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getKYC(setupId) {
    return this.apiService
      .get(`/accountopening/get/all/kycustomer?cid=${setupId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getSignature(sid) {
    return this.apiService
      .get(`/accountopening/view/signatory?SignatoryId=${sid}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  // getDirectorSignature(sid) {
  //     return this.apiService
  //         .get(`/deposit2/signaturecid?id=${sid}`)
  //         .pipe(
  //             tap(data => {
  //                 return data;
  //             })
  //         );
  // }

  getSignatory(id) {
    return this.apiService
      .get(`/accountopening/get/customer/signatory?customerId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getSignatorybyId(setupId) {
    return this.apiService
      .get(`/accountopening/get/signatureuploadbyids?SearchId=${setupId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getDirectorbyCID(setupId) {
    return this.apiService
      .get(`/accountopening/get/all/directors?customerId=${setupId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCustomerIdentityDetailsByCustomer(id) {
    return this.apiService
      .get(`/accountopening/get/all/customeridentitfications?customerId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCustomerNextOfKinByCustomer(setupId) {
    return this.apiService
      .get(`/accountopening/get/all/nextofkin?cid=${setupId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCustomerContactPersons(id) {
    return this.apiService
      .get(`/accountopening/get/keycontactpersonse?customerId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  addupdateCustomerKYc(body) {
    return this.apiService.post(`/accountopening/add/kyc`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  addUpdateCustomer(body): Observable<any> {
    return this.apiService
      .post(`/accountopening/add/update/customer`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  addUpdateDepositForm(body): Observable<any> {
    return this.apiService
      .post(`/accountsetup/add/update/depositform`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  addCustomerIdentityDetails(body): Observable<any> {
    return this.apiService
      .post(`/accountopening/add/customeridentitfication`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  addCustomerAccountInfo(body): Observable<any> {
    return this.apiService
      .post(`/accountopening/add/account/detail`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  addCustomerNextOfKin(body): Observable<any> {
    return this.apiService.post(`/accountopening/add/nextofkin`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  addCustomerContactPerson(body): Observable<any> {
    return this.apiService.post(`/accountopening/add/keycontacts`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  addCustomerDirector(body): Observable<any> {
    return this.apiService.post(`/accountopening/add/directors`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // addCustomerSignatory(body): Promise<any> {
  //     return this.apiService.uploadCustomerSignature(body).then(
  //         tap(data => {
  //             return data;
  //         })
  //     );
  // }

  uploadSignatorySignature(file: File, body: any): Promise<any> {
    return this.apiService.uploadSignatorySignature(file, body).then(
      tap((data) => {
        return data;
      })
    );
  }

  uploadDirectorSignature(file: File, body: any) {
    return this.apiService.uploadDirectorSignature(file, body).then(
      tap((data) => {
        return data;
      })
    );
  }

  uploadFile(file: File, body: any) {
    return this.apiService.uploadFileCustomer(file, body).then(
      tap((data) => {
        return data;
      })
    );
  }

  getCustomerDocumentByCustomer(customerId) {
    return this.apiService.get(`/deposit2/kycdoc?cid=${customerId}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getCustomerDocument(CustomerDocumentId) {
    return this.apiService
      .get(`/deposit2/kycdocid?id=${CustomerDocumentId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteCustomerDocument(CustomerDocumentId) {
    return this.apiService
      .delete(`/deposit2/kycdoc?id=${CustomerDocumentId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
}
