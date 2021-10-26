import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { InvestorProducts } from '../../../models/models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InvestorFundService {
  constructor(private apiService: ApiService) {}

  handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  }
  updateProductType(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfundproduct/add/update/producttype`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getAllProductType(): Observable<any> {
    return this.apiService.get(`/investorfundproduct/get/all/producttype`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getProductType(id: any): Observable<any> {
    return this.apiService
      .get(`/investorfundproduct/get/producttypebyid?SearchId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  multipleDeleteProductType(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfundproduct/delete/producttype`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  uploadProductType(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/investorfundproduct/upload/producttype`, imageFile)
      .then((res) => {
        return res;
      });
  }
  exportProductType(): Observable<any> {
    return this.apiService
      .getExcel(`/investorfundproduct/download/producttype`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  updateProduct(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfundproduct/add/update/product`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getProducts(): Observable<InvestorProducts> {
    return this.apiService.get(`/investorfundproduct/get/all/product`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getProduct(id: number): Observable<any> {
    return this.apiService
      .get(`/investorfundproduct/get/productbyid?SearchId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  multipleDeleteInvestorProduct(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfundproduct/delete/product`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  uploadInvestorProducts(Image: File): Promise<any> {
    return this.apiService
      .uploadExcel('/investorfundproduct/upload/product', Image)
      .then((data) => {
        return data;
      });
  }
  downloadInvestorProducts(): Observable<any> {
    return this.apiService
      .getExcel('/investorfundproduct/download/product')
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  addInvestorCustomer(payload: any): Observable<any> {
    return this.apiService.post(`/loanCustomer/update`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllInvestorCustomer(): Observable<any> {
    return this.apiService.get(`/investorfund/get/all/investorlist`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllInvestors(): Observable<any> {
    return this.apiService
      .get(`/investorcustomer/all-customer-list`)
      .pipe(tap((data) => data));
  }
  getInvestorCustomer(id: number): Observable<any> {
    return this.apiService.get(`/investorcustomer/customer-Id?Id=${id}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getInvestments(): Observable<any> {
    return this.apiService.get(`/investorfund/get/all/running/investment`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getInvestmentAppraisals(): Observable<any> {
    return this.apiService.get(`/investorfund/get/approval/list`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllInvestorFund(): Observable<any> {
    return this.apiService.get(`/investorfund/get/all/investorfund`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getInvestment(id: any): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/investorfundbyid?SearchId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  multipleDeleteInvestorCustomer(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorcustomer/multiple-delete-customer`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  downloadInvestorCustomer(): Observable<any> {
    return this.apiService.getExcel(`/investorcustomer/export-customer`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  uploadInvestorCustomer(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/investorcustomer/InvestorCustomer-upload`, imageFile)
      .then((data) => {
        return data;
      });
  }
  getInvestorBankDetails(customerId): Observable<any> {
    return this.apiService
      .get(`/loancustomer/get/bankdetails/customer?CustomerId=${customerId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  uploadInvestorCustomerDocument(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/investorcustomer/document-upload`, imageFile)
      .then((data) => {
        return data;
      });
  }
  getInvestorDocuments(id): Observable<any> {
    return this.apiService.get(`/investorcustomer/all-documents?id=${id}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getinvestorDocumentById(id: any, cid): Observable<any> {
    return this.apiService
      .get(`/investorcustomer/Documents-Id?Id=${id}&cid=${cid}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  deleteDocument(id: any): Observable<any> {
    return this.apiService
      .delete(`/investorcustomer/delete-documents?Id=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  multipleDeleteInvestorDocuments(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorcustomer/multiple-delete-documents`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getIdentityDetails(id): Observable<any> {
    return this.apiService
      .get(`/investorcustomer/all-identity-details?id=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getIdentityDetail(id: any): Observable<any> {
    return this.apiService
      .get(`/investorcustomer/identity-details-Id?Id=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  deleteIdentityDetail(id: any): Observable<any> {
    return this.apiService
      .delete(`/investorcustomer/delete-identity-details?Id=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  multipleDeleteInvestorIdentityDetails(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorcustomer/multiple-delete-identity-details`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getNextOfKinDetails(id): Observable<any> {
    return this.apiService
      .get(`/investorcustomer/all-next-of-kin?id=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getNextOfKin(id: any): Observable<any> {
    return this.apiService
      .get(`/investorcustomer/Next-Of-Kin-Id?Id=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  deleteNextOfKin(id: any): Observable<any> {
    return this.apiService
      .delete(`/investorcustomer/delete-next-of-kin?Id=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  multipleDeleteNextOfKin(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorcustomer/multiple-delete-next-of-kin`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  addNextOfKin(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorcustomer/update-next-of-kin`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  addIdentityDetails(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorcustomer/update-identity-details`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  addBankDetails(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorcustomer/update-bank-details`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  deleteInvestorBankDetail(id: any): Observable<any> {
    return this.apiService
      .delete(`/investorcustomer/delete-bank-details?Id=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  uploadInvestorFile(file: File, body: any): Promise<any> {
    return this.apiService.uploadInvestorCustomer(file, body).then((data) => {
      return data;
    });
  }
  addInvestorForm(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/add/update/investorfund`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getInvestorFund(): Observable<any> {
    return this.apiService.get(`/investorfund/all-investor-fund`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllRunningFacilities(id: any): Observable<any> {
    return this.apiService
      .get(`/investorfund/all-investor-running-facilities?id=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  submitInvestmentApproval(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/update/go/for/approval`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  submitCollectionApproval(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/update/go/for/collection/approval`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  submitLiquidationApproval(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/update/go/for/liquidation/approval`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  updateCollection(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/add/update/collection`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  updateLiquidate(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/add/update/liquidation`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  updateRollover(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/update/investorfund/rollover`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  updateTopUp(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/update/investorfund/topup`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  investmentRecommendation(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/add/update/investmentrecommendation`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  collectionRecommendation(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/collection-recommendation`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  liquidationRecommendation(payload: any): Observable<any> {
    return this.apiService
      .post(`/investorfund/liquidation-recommendation`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getRecommendationLog(id: any): Observable<any> {
    return this.apiService
      .get(`/investorfund/recommendation-log?InvInvestorFundId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getLiquidationRecommendationLogs(id: any): Observable<any> {
    return this.apiService
      .get(
        `/investorfund/liquidation-recommendation-log?InvInvestorFundId=${id}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getCollectionRecommendationLogs(id: any): Observable<any> {
    return this.apiService
      .get(
        `/investorfund/collection-recommendation-log?InvInvestorFundId=${id}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  collectionAppraisal(): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/collection/approval/list`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getCollection(id: number): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/collectionbyid?SearchId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getLiquidation(id: number): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/liquidationbyid?SearchId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  liquidationAppraisal(): Observable<any> {
    return this.apiService
      .get('/investorfund/get/liquidation/approval/list')
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getCertificateLists(): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/all/investmentcertificates`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getInvestmentByStatus(status: any): Observable<any> {
    return this.apiService
      .get(
        `/investorfund/get/all/running/investmentbystatus?searchId=${status}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getPendingInvestments(): Observable<any> {
    return this.apiService.get(`/investorfund/get/all/website/list`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getCustomerInvestment(id: number): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/website/Id?SearchId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getCustomerPendingCollections(): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/all/collectionwebsite/list`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getPendingCustomerCollection(id: number): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/collectionwebsite/Id?SearchId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getPendingCustomerTopUp(): Observable<any> {
    return this.apiService.get(`/investorfund/get/all/website/topup/list`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getPendingCustomerTopUpByID(id: string): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/website/topup/Id?SearchId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getPendingCustomerRollover(): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/all/website/rollover/list`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getPendingCustomerRolloverByID(id: string): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/website/rollover/Id?SearchId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getPendingCustomerLiquidations(): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/all/liquidationwebsite/list`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getPendingCustomerLiquidation(id: string): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/liquidationwebsite/Id?SearchId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getCurrentBalance(date: string, id: number): Observable<any> {
    return this.apiService
      .get(
        `/investorfund/get/current/balance?SearchId=${id}&SearchDate=${date}`
      )
      .pipe((data) => {
        return data;
      });
  }

  getCollectionBalance(id: number): Observable<any> {
    return this.apiService
      .get(`/investorfund/get/collection/current/balance?SearchId=${id}`)
      .pipe((data) => {
        return data;
      });
  }

  getInvestmentDetails(): Observable<any> {
    return this.apiService.get(`/dashboard/investmentapplicationdetails`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getInvestmentConcentration(): Observable<any> {
    return this.apiService
      .get(`/dashboard/investment/concentration`)
      .pipe((data) => {
        return data;
      });
  }
  getInvestmentChart(): Observable<any> {
    return this.apiService
      .get(`/dashboard/investmentapplication/chart`)
      .pipe((data) => {
        return data;
      });
  }

  searchInvestorCustomers(
    fullName: string,
    email: string,
    accountNumber: string
  ): Observable<any> {
    return this.apiService
      .get(
        `/investorfund/get/all/investorlist/search?FullName=${fullName}&LastName=${email}&AccountNumber=${accountNumber}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  exportInvestments() {
    return this.apiService.getExcel(`/investorfund/download/investorfund`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  uploadInvestments(fileToUpload: any): Promise<any> {
    return this.apiService
      .uploadExcel(`/investorfund/upload/investorfund`, fileToUpload)
      .then((res) => {
        return res;
      });
  }

  searchInvestments(
    refNumber: string = '',
    name: string = ''
  ): Observable<any> {
    return this.apiService
      .post(
        `/investorfund/get/all/running/investment/search?RefNumber=${refNumber}&SearchString=${name}`,
        {}
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
}
