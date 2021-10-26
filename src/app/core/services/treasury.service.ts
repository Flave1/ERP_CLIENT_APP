import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TreasuryService {
  constructor(private apiService: ApiService) {}
  updateProductType(payload: any): Observable<any> {
    return this.apiService
      .post(`/treasuryproduct/add/update/producttype`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getAllProductTypes(): Observable<any> {
    return this.apiService.get(`/treasuryproduct/get/all/producttype`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getProductType(id: any): Observable<any> {
    return this.apiService
      .get(`/treasuryproduct/get/producttypebyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  uploadProductType(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/treasuryproduct/upload/producttype`, imageFile)
      .then(data => {
        return data;
      });
  }
  exportProductType(): Observable<any> {
    return this.apiService
      .getExcel(`/treasuryproduct/download/producttype`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  multipleDeleteProductType(payload: any): Observable<any> {
    return this.apiService
      .post(`/treasuryproduct/delete/producttype`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  updateProduct(payload): Observable<any> {
    return this.apiService
      .post(`/treasuryproduct/add/update/treasuryproduct`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getAllProducts(): Observable<any> {
    return this.apiService.get(`/treasuryproduct/get/all/treasuryproduct`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getProduct(id: any): Observable<any> {
    return this.apiService
      .get(`/treasuryproduct/get/treasuryproductbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  multipleDeleteProduct(payload: any): Observable<any> {
    return this.apiService
      .post(`/treasuryproduct/delete/treasuryproduct`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  exportProduct(): Observable<any> {
    return this.apiService
      .getExcel(`/treasuryproduct/download/treasuryproduct`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  uploadProducts(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/treasuryproduct/upload/treasuryproduct`, imageFile)
      .then(data => {
        return data;
      });
  }
  updateIssuerRegistration(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerregistration/update-issuer-registration`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getAllIssuer(): Observable<any> {
    return this.apiService
      .get(`/issuerregistration/get/all/issuerregistration`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getAllIssuerList(id: any): Observable<any> {
    return this.apiService
      .get(`/issuerregistration/all-issuer-list?id=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getIssuer(id: any): Observable<any> {
    return this.apiService
      .get(`/issuerregistration/get/issuerregistrationbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  multipleDeleteIssuer(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerregistration/delete/issuerregistration`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  downloadIssuer(): Observable<any> {
    return this.apiService
      .getExcel(`/issuerregistration/download/issuerregistration`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  uploadIssuers(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/issuerregistration/upload/issuerregistration`, imageFile)
      .then(data => {
        return data;
      });
  }
  updateContactInfo(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerregistration/add/update/issuerregistration`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  saveIdentityDetails(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerregistration/add/update/identitydetails`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getIdentityDetails(id: any): Observable<any> {
    return this.apiService
      .get(`/issuerregistration/get/identitydetailsbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteIdentityDetails(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerregistration/delete/identitydetails`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  saveBankDetails(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerregistration/add/update/bankdetails`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getBankDetails(id: any): Observable<any> {
    return this.apiService
      .get(`/issuerregistration/get/bankdetailsbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteBankDetails(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerregistration/delete/bankdetails`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  uploadTreasuryFile(file: File, body: any): Promise<any> {
    return this.apiService.uploadTreasury(file, body).then(data => {
      return data;
    });
  }
  getIssuerDocuments(id: any): Observable<any> {
    return this.apiService
      .get(`/issuerregistration/get/documentsbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getDocument(id: any): Observable<any> {
    return this.apiService
      .get(`/issuerregistration/Documents-Id?Id=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteIssuerDocument(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerregistration/delete/documents`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  updateIssuerInvestment(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerinvestment/add/update/issuerinvestment`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getAllIssuerInvestments(): Observable<any> {
    return this.apiService
      .get(`/issuerinvestment/get/all/issuerinvestment`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getIssuerInvestment(id: any): Observable<any> {
    return this.apiService
      .get(`/issuerinvestment/get/issuerinvestmentbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  updateCollection(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerinvestment/add/update/collection`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getCollection(id: number): Observable<any> {
    return this.apiService
      .get(`/issuerinvestment/get/collectionbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  updateLiquidation(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerinvestment/add/update/liquidation`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getLiquidation(id: number): Observable<any> {
    return this.apiService
      .get(`/issuerinvestment/get/liquidationbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getInvestmentAppraisal(): Observable<any> {
    return this.apiService
      .get('/issuerinvestment/get/all/staff/investment/awaiting/approvals')
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  submitInvestmentApproval(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerinvestment/staff/investment/approval/request`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  liquidationAppraisal(): Observable<any> {
    return this.apiService
      .get(`/issuerinvestment/get/all/staff/liquidation/awaiting/approvals`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  collectionAppraisal(): Observable<any> {
    return this.apiService
      .get(`/issuerinvestment/get/all/staff/collection/awaiting/approvals`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  submitCollectionApproval(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerinvestment/staff/collection/approval/request`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  submitLiquidationApproval(payload: any): Observable<any> {
    return this.apiService
      .post(`/issuerinvestment/staff/liquidation/approval/request`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getCollectionRecommendationLogs(id: any) {
    return this.apiService
      .get(`/investorfund/recommendation-log?InvInvestorFundId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getInvestmentAppraisalComments(id: number, token: string): Observable<any> {
    return this.apiService
      .get(
        `/issuerinvestment/get/issuerinvestment/approval/comments?TargetId=${id}&WorkflowToken=${token}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getCollectionComments(
    targetId: number,
    workflowToken: string
  ): Observable<any> {
    return this.apiService
      .get(
        `/issuerinvestment/get/collection/approval/comments?TargetId=${targetId}&WorkflowToken=${workflowToken}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getLiquidationComments(id: number, token: string): Observable<any> {
    return this.apiService
      .get(
        `/issuerinvestment/get/liquidation/approval/comments?TargetId=${id}&WorkflowToken=${token}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  investmentRecommendation(body) {
    return this.apiService
      .post(`/issuerinvestment/add/update/investmentrecommendation`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getInvestmentRecommendations(id: any) {
    return this.apiService.get(`/issuerinvestment/get/recommendation?SearchId=${id}`).pipe(tap(data => {
      return data;
    }))
  }
}
