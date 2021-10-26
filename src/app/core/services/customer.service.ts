import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import {tap} from 'rxjs/operators';
import { Observable } from "rxjs";
import {promise} from 'selenium-webdriver';

@Injectable({
    providedIn: "root"
})
export class CustomerService {
    constructor(private apiService: ApiService) {}
    userData: any = {};

    getAllCustomer() {
        return this.apiService.get("/customer/allcustomer").pipe(
            tap(data => {
                return data;
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

    getAllCustomerAuthorization() {
        return this.apiService.get("/customer/allcustomerauthorization").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getAllCustomerBusinessOwner() {
        return this.apiService.get("/customer/allcustomerbusinessowner").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getAllCustomerDocument() {
        return this.apiService.get("/customer/allcustomerdocument").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getCustomerByCountry(countryId) {
        return this.apiService
            .get(`/customer/customerbycountry?countryId=${countryId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getCustomer(customerId) {
        return this.apiService
            .get(`/customer/customer?customerId=${customerId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getCustomerAuthorization(customerAuthorizationId) {
        return this.apiService
            .get(
                `/customer/customerauthorization?customerAuthorizationId=${customerAuthorizationId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getCustomerBusinessOwner(customerBusinessOwnerId) {
        return this.apiService
            .get(
                `/customer/customerbusinessowner?customerBusinessOwnerId=${customerBusinessOwnerId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getCustomerDocument(customerDocumentId) {
        return this.apiService
            .get(
                `/customer/customerdocument?customerDocumentId=${customerDocumentId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteCustomer(customerId) {
        return this.apiService
            .delete(`/customer/delete?customerId=${customerId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    deleteCustomerAuthorization(customerAuthorizationId) {
        return this.apiService
            .delete(
                `/customer/deleteauthorization?customerAuthorizationId=${customerAuthorizationId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    deleteCustomerBusinessOwner(customerBusinessOwnerId) {
        return this.apiService
            .delete(
                `/customer/deletebusinessowner?customerBusinessOwnerId=${customerBusinessOwnerId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    deleteCustomerDocument(customerDocumentId) {
        return this.apiService
            .delete(
                `/customer/deletedocument?customerDocumentId=${customerDocumentId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    addCustomerInformation(body): Observable<any> {
        return this.apiService.post(`/customer/updatecustomer`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }
    addCustomerAuthorization(body): Observable<any> {
        return this.apiService
            .post(`/customer/updatecustomerauthorization`, body)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    addCustomerBusinessOwner(body): Observable<any> {
        return this.apiService.post(`/customer/updatebusinessowner`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }
    addCustomerDocument(body): Observable<any> {
        return this.apiService.post(`/customer/updatedocument`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }



    goForApproval(body): Observable<any> {
        return this.apiService.post(`/customer/approval`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }

    addUpdateDocumentType(body): Observable<any> {
        return this.apiService.post(`/loanCustomer/document-type`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }

    getAllDocumentType() {
        return this.apiService.get("/loanCustomer/all-document-type").pipe(
            tap(data => {
                return data;
            })
        );
    }

    deleteDocumentType(documentTypeId) {
        return this.apiService
            .delete(
                `/loanCustomer/delete-document-type?documentTypeId=${documentTypeId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }



}
