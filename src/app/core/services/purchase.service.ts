import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  constructor(private apiService: ApiService) {}
  userData: any = {};

  getSuppliers() {
    return this.apiService.get(`/supplier/search`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllPurchase() {
    return this.apiService.get('/purchase/all-purchase').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getSinglePurchase(plpoId) {
    return this.apiService
      .get(`/purchase/single-purchase?plpoId=${plpoId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deletePurchase(plpoId) {
    return this.apiService.delete(`/purchase/delete?plpoId=${plpoId}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  updatePurchase(body): Observable<any> {
    return this.apiService.post(`/purchase/update`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllPurchasePRN() {
    return this.apiService.get('/purchase/get/all/prns').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getSinglePurchasePRN(purchaseReqNoteId) {
    return this.apiService
      .get(`/purchase/get/single/prnDetails?PrnId=${purchaseReqNoteId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deletePurchasePRN(purchaseReqNoteId) {
    return this.apiService
      .delete(`/purchase/prn-delete?purchaseReqNoteId=${purchaseReqNoteId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  updatePurchasePRN(body): Observable<any> {
    return this.apiService
      .post(`/purchase/add/update/purchaseRequisitionNote`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getPrnApprovals(): Observable<any> {
    return this.apiService.get(`/purchase/get/all/prn/awaitingAprovals`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getPrnDetails(id: number): Observable<any> {
    return this.apiService
      .get(`/purchase/get/single/prnDetails?PrnId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  // approve prn
  approvePRN(payload: any): Observable<any> {
    return this.apiService
      .post(`/purchase/staff/approval/purchaseRequisitionNote`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  // get lpos
  getAllLpos(): Observable<any> {
    return this.apiService.get(`/purchase/get/all/lpos`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // get all bids
  getAllBidsForApproval(): Observable<any> {
    return this.apiService.get(`/purchase/get/all/bidandtender`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getBidAndtender(id: number): Observable<any> {
    return this.apiService
      .get(`/purchase/get/single/bidandtender?BidandtenderId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  // send bid for approval
  sendBidForApproval(id: any): Observable<any> {
    return this.apiService
      .post(`/purchase/send/supplierBid/toApprovals`, { bidAndTenderId: id })
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getBidsAwaitingApprovals(): Observable<any> {
    return this.apiService
      .get(`/purchase/get/all/bidandtender/awaitingAprovals`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  sendBidApproval(payload): Observable<any> {
    return this.apiService
      .post(`/purchase/staff/approval/supplierBidandtenders`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  // get lpo list
  getLpoList(): Observable<any> {
    return this.apiService.get(`/purchase/get/all/lpos`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // update payment terms
  updateTerms(payload: any): Observable<any> {
    return this.apiService
      .post(`/purchase/update/paymentTerms`, payload)
      .pipe((data) => {
        return data;
      });
  }

  // get lpo for approvals
  getLpoApprovals(): Observable<any> {
    return this.apiService.get(`/purchase/staff/lpo/awaitingApproval`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // lpo approval
  submitLPOApproval(payload: any): Observable<any> {
    return this.apiService.post(`/purchase/staff/approval/lpo`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // get invoice list
  getInvoiceLists(): Observable<any> {
    return this.apiService.get(`/purchase/get/all/invoice`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getInvoiceDetail(id: string): Observable<any> {
    return this.apiService
      .get(`/purchase/get/single/invoiceDetail?InvoiceId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  sendPrntoApprovals(purchaseReqNoteId: number): Observable<any> {
    return this.apiService
      .post(`/purchase/send/prn/toApprovals`, { purchaseReqNoteId })
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  processPayment(payload: FormGroup): Observable<any> {
    return this.apiService
      .post(`/payment/send/invoice/forpayment`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getPaymentApprovals() {
    return this.apiService
      .get(`/purchase/staff/payment/awaitingapprovals`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  sendPaymentApproval(payload): Observable<any> {
    return this.apiService
      .post(`/purchase/staff/payment/approval`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  // update payment terms
  updatePaymentTerms(payload): Observable<any> {
    return this.apiService
      .post(`/purchase/save/update/paymentterms`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  requestPayment(payload: any): Observable<any> {
    return this.apiService.post(`/purchase/request/payment`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getSingleLpo(id: number): Observable<any> {
    return this.apiService.get(`/purchase/get/single/lpo?LPOId=${id}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  sendLpotoApproval(id: any): Observable<any> {
    return this.apiService.post(`/purchase/send/lpo/toapproval`, id).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  updateLpo(payload: any): Observable<any> {
    return this.apiService.post(`/purchase/update/lpo`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  // requestPayment(payload: any): Observable<any> {
  //   return this.apiService.post(`/purchase/request/payment`, payload).pipe(
  //     tap(data => {
  //       return;
  //     })
  //   );
  // }

  updateProjectPhase(file: File, payload: any): Promise<any> {
    return this.apiService.uploadPaymentPhase(file, payload).then((data) => {
      return data;
    });
  }

  sendPhaseForApproval(payload: any): Observable<any> {
    return this.apiService
      .post(`/purchase/send/proposal/phase/toapproval`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  updatePpeLpo(): Observable<any> {
    return this.apiService.post(`/purchase/updateppe/lpo`, {}).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // get lpo report
  getLpoReport(id: number): Observable<any> {
    return this.apiService.get(`/report/get/lpo/report?LPOId=${id}`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  // submit bid
  submitBid(payload: any): Observable<any> {
    return this.apiService.post(`/purchase/avertbid/bystaff`, payload).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // get approved prns
  getApprovedPrns(): Observable<any> {
    return this.apiService.get(`/purchase/get/all/approved/prns`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // delete payment terms
  deletePaymentTerms(payload: any): Observable<any> {
    return this.apiService
      .post(`/purchase/delete/payment/proposal`, payload)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  // download proposal
  downloadProposal(id: number): Observable<any> {
    return this.apiService
      .get(`/purchase/download/supplier/proposal?BidAndTenderId=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  // upload proposal
  uploadProposal(file: File, body: any): Promise<any> {
    return this.apiService.uploadBid(file, body).then((data) => {
      return data;
    });
  }

  getAgingAnalysisReport(fromDate, toDate): Observable<any> {
    return this.apiService
      .get(
        `/report/get/aginganalysis/table/report?FromDate=${fromDate}&ToDate=${toDate}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getUnbiddedBids(): Observable<any> {
    return this.apiService.get(`/purchase/get/all/notbidden/adverts`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getCounts() {
    return this.apiService.get(`/report/get/dashboard/Counts`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getProjectStatus() {
    return this.apiService.get(`/report/get/projectstatus`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAgingAnalysis() {
    return this.apiService.get(`/report/get/aginganalysis`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getPayableDaysCount() {
    return this.apiService.get(`/report/get/payabledays/Counts`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getPurchDaysAnalysis() {
    return this.apiService.get(`/report/get/purchases/trendanalysis`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getPayableTrendAnalysis() {
    return this.apiService.get(`/report/get/payabledays/trendanalysis`).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  // download certificate
  downloadCertificate(id: number): Observable<any> {
    return this.apiService
      .get(`/purchase/download/certificate?paymenttermid=${id}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  getPurchaseReport(startDate, endDate): Observable<any> {
    return this.apiService
      .get(
        `/report/purchases/and/payables/report?FromDate=${startDate}&ToDate=${endDate}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  modifyPrn(payload): Observable<any> {
    return this.apiService.post(`/purchase/modify/prn_details`, payload).pipe(
      tap(),
      map((res) => {
        return res;
      })
    );
  }
  modifyBid(payload): Observable<any> {
    return this.apiService.post(`/purchase/modify/bids`, payload).pipe(
      tap(),
      map((res) => {
        return res;
      })
    );
  }
}
