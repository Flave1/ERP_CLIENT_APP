import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import {
  Approval,
  Claim,
  ClassificationSetup,
  Collection,
  CostCentre,
  PaymentProposal,
  Requisition,
  RequisitionClaim,
  Retirement,
} from '../../models/models';
import { catchError, map, tap } from 'rxjs/operators';
import { data } from '../../expense-management/datafile';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseManagementService {
  baseUrl: string = environment.api_url;
  constructor(private apiService: ApiService, private http: HttpClient) {}
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  addClassification(
    payload: ClassificationSetup
  ): Observable<ClassificationSetup> {
    return this.http
      .post<ClassificationSetup>(
        `${this.baseUrl}/expmgr/add/update/classificationsetup`,
        payload
      )
      .pipe(
        tap(),
        map((response) => {
          return response['status'];
        }),
        catchError(this.handleError)
      );
  }
  getClassifications(): Observable<ClassificationSetup[]> {
    // return this.classifications;
    return this.http
      .get<ClassificationSetup[]>(
        `${this.baseUrl}/expmgr/get/all/classificationsetup`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }
  getClassification(id: number): Observable<ClassificationSetup> {
    return this.http
      .get<ClassificationSetup>(
        `${this.baseUrl}/expmgr/get/single/classificationsetup?Id=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'][0];
        }),
        catchError(this.handleError)
      );
  }
  deleteClassifications(ids): Observable<number[]> {
    return this.http
      .post<number[]>(`${this.baseUrl}/expmgr/delete/classificationsetup`, {
        ids,
      })
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  exportClassificationSetup(): Observable<any> {
    return this.apiService
      .getExcel(`/expmgr/download/classificationsetup`)
      .pipe(
        tap(),
        tap((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  uploadClassificationSetup(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/expmgr/upload/classificationsetup`, file)
      .then((response) => {
        return response;
      });
  }

  getCostCentreList(): Observable<CostCentre[]> {
    // return this.constCentreList;
    return this.http
      .get<CostCentre>(`${this.baseUrl}/expmgr/get/all/costcentres`)
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }

  getCostCentre(id: number): Observable<CostCentre> {
    return this.http
      .get<CostCentre>(`${this.baseUrl}/expmgr/get/single/costcentre?Id=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res['list'][0];
        })
      );
    // return this.constCentreList.find((item) => item.costCentreId === +id);
  }

  addCostCentre(payload: CostCentre): Observable<CostCentre> {
    return this.apiService.post(`/expmgr/add/update/costcentre`, payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
  deleteCostCentre(ids): Observable<number[]> {
    return this.http
      .post<number[]>(`${this.baseUrl}/expmgr/delete/costcentre`, {
        ids,
      })
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  exportCostcentreSetup(): Observable<any> {
    return this.apiService.getExcel(`/expmgr/download/costcentre`).pipe(
      tap(),
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }
  uploadCostCentreSetup(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/expmgr/upload/costcentre`, file)
      .then((response) => {
        return response;
      });
  }

  getRequisitionList(): Observable<Requisition[]> {
    // return this.requisitionList;
    return this.http
      .get<Requisition[]>(
        `${this.baseUrl}/expmgr/get/all/current_user_requisitions`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }
  getDeptRequistions(): Observable<Requisition[]> {
    return this.http
      .get<Requisition[]>(`${this.baseUrl}/expmgr/get/requisitions/by_company`)
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }
  sendRequestForApproval(id): Observable<any> {
    return this.apiService
      .post(`/expmgr/send/requisition/for_approval`, { id })
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getRequisition(id: number): Observable<Requisition> {
    // return this.requisitionList.find((item) => item.requisitionId === id);
    return this.http
      .get<Requisition>(
        `${this.baseUrl}/expmgr/get/single/requisition?Id=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'][0];
        }),
        catchError(this.handleError)
      );
  }
  addAdminRequisition(payload: Requisition): Observable<Requisition> {
    return this.http
      .post<Requisition>(
        `${this.baseUrl}/expmgr/add/update/admn/requisition`,
        payload
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  addRequisition(payload: Requisition): Observable<Requisition> {
    return this.http
      .post<Requisition>(
        `${this.baseUrl}/expmgr/add/update/requisition`,
        payload
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  multiDeleteRequistion(ids: number[]): Observable<number[]> {
    return this.http
      .post<number[]>(`${this.baseUrl}/expmgr/delete/Requisition`, { ids })
      .pipe(
        tap(),
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
  exportRequisitions(): Observable<any> {
    return this.apiService.getExcel(`/expmgr/requisition/download`).pipe(
      tap(),
      map((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }
  uploadRequisitions(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/expmgr/requisition/upload`, file)
      .then((response) => {
        return response;
      });
  }
  getRequisitionApprovalList(): Observable<Requisition[]> {
    // return this.requisitionList;
    return this.http
      .get<Requisition>(
        `${this.baseUrl}/expmgr/get/all/requisitions_awaiting_approval`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }
  getApprovedEssErn(): Observable<Requisition[]> {
    return this.http
      .get(`${this.baseUrl}/expmgr/get/all/ess/approved_requisition`)
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }
  getAppovedERN(): Observable<Requisition[]> {
    return this.http
      .get<Requisition>(
        `${this.baseUrl}/expmgr/get/admin/payments_for_approval`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }
  requestForPayment(id: number): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/expmgr/request/for/payment`, { id })
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getPaymentProposal(): Observable<PaymentProposal[]> {
    return this.http
      .get<PaymentProposal>(`${this.baseUrl}/expmgr/get/all/payment_proposals`)
      .pipe(
        tap(),
        map((response) => {
          return response['list'];
        }),
        catchError(this.handleError)
      );
  }
  savePaymentProposal(payload): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/expmgr/send/payment_proposals/for_approval`,
        payload
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getPaymentApprovals(): Observable<PaymentProposal[]> {
    return this.http
      .get<PaymentProposal[]>(
        `${this.baseUrl}/expmgr/get/payment_proposals/awaiting_approval`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }
  submitPaymentApproval(payload): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/expmgr/payment_proposals/staff/approvals`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getRetirements(): Observable<Retirement[]> {
    return this.http
      .get<Retirement>(`${this.baseUrl}/expmgr/get/all/admin/retirements`)
      .pipe(
        tap(),
        map((response) => {
          return response['list'];
        }),
        catchError(this.handleError)
      );
  }

  getRetirement(id: number): Observable<Retirement> {
    return this.http
      .get<Retirement>(
        `${this.baseUrl}/expmgr/get/single/retirement/by_requisition_paymentId?Id=${id}`
      )
      .pipe(
        tap(),
        map((response) => {
          return response['list'][0];
        })
      );
  }
  submitErnApproval(payload): Observable<Approval> {
    return this.http
      .post<Approval>(
        `${this.baseUrl}/expmgr/staff/requisition/approval`,
        payload
      )
      .pipe(
        tap(),
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
  saveClaims(payload): Observable<any> {
    return this.http.post(`${this.baseUrl}/expmgr/retire/claims`, payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
  getClaims(): Observable<Claim[]> {
    return this.http
      .get<Claim[]>(`${this.baseUrl}/expmgr/get/all/no_requisition_claims`)
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }
  getClaim(id: number): Observable<Claim> {
    return this.http
      .get<Claim>(
        `${this.baseUrl}/expmgr/get/single/no_requisition_claim/by_newclaimId?Id=${id}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'][0];
        }),
        catchError(this.handleError)
      );
  }
  addClaim(payload: Claim, file: File): Observable<any> {
    payload.evidence = 'test';
    return this.http
      .post(`${this.baseUrl}/expmgr/add/update/no_requisition_claim`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  uploadNoReqClaimEvidence(file: File, newClaimId: number): Promise<any> {
    return this.apiService
      .uploadClaimEvidence(
        `/expmgr/update/no_requisition_claim/evidence`,
        { newClaimId },
        file
      )
      .then((res) => {
        return res;
      });
  }
  uploadReqClaimEvidence(file: File, claimId: number): Promise<any> {
    return this.apiService
      .uploadClaimEvidence(`/expmgr/update/claim/evidence`, { claimId }, file)
      .then((res) => {
        return res;
      });
  }
  getNoReqClaimsApproval(): Observable<Claim[]> {
    return this.http
      .get<Claim[]>(
        `${this.baseUrl}/expmgr/get/all/no_requisition_claims/awaiting_approval`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }

  getReqClaimsApproval2(): Observable<RequisitionClaim[]> {
    return this.http
      .get<RequisitionClaim[]>(
        `${this.baseUrl}/expmgr/get/all/claims/awaiting_approval`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }

  // getReqClaimsApproval(): Observable<Claim[]> {
  //   return this.http
  //     .get<Claim[]>(`${this.baseUrl}/expmgr/get/all/claims/awaiting_approval`)
  //     .pipe(
  //       tap(),
  //       map((res) => {
  //         return res['list'];
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  getSingleClaimsApproval(id: any): Observable<Claim[]> {
    return this.http
      .get(`${this.baseUrl}/expmgr/get/single/claim/by_retirementId?Id=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }
  submitNoReqApproval(payload: Approval): Observable<Approval> {
    return this.http
      .post<Approval>(
        `${this.baseUrl}/expmgr/no_requisition_claim/staff/approval`,
        payload
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }
  // submitReqClaimApproval(payload: Approval): Observable<Approval> {
  //   return this.http
  //     .post<Approval>(`/expmgr/retirement/claims/staffapproval`, payload)
  //     .pipe(tap(), map((res) => {
  //         return res;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  submitReqClaimApproval(payload): Observable<any> {  
    var approvalUrl : string = '';
    if(payload.type == '1') approvalUrl = `/expmgr/retirement/claims/staffapproval`;
    if(payload.type == '2') approvalUrl = `/expmgr/no_requisition_claim/staff/approval`;
    return this.http
      .post(`${this.baseUrl}${approvalUrl}`, payload)
      .pipe(tap(),map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClaimById(claimId: number): Observable<Claim> {
    return this.http
      .get(`${this.baseUrl}/expmgr/get/single/claim/by_claimId?Id=${claimId}`)
      .pipe(
        tap(),
        map((res) => {
          return res['list'][0];
        }),
        catchError(this.handleError)
      );
  }
  updateRequisitionAmount(payload): Observable<any> {
    return this.http
      .post<any>(
        `${this.baseUrl}/expmgr/keep/requisition/approvers_history`,
        payload
      )
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateRefund(payload): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/expmgr/retire/collections`, payload)
      .pipe(
        tap(),
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRequisitions(): Observable<Requisition[]> {
    return this.http.get(`${this.baseUrl}/expmgr/get/all/requisition`).pipe(
      tap(),
      map((res) => {
        return res['list'];
      }),
      catchError(this.handleError)
    );
  }
  filterEssErn(status: string): Observable<Requisition[]> {
    return this.http
      .get(
        `${this.baseUrl}/expmgr/filter/ess/requisitions/bystsatus?Status=${status}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }
  filterAdminErn(status: string): Observable<Requisition[]> {
    return this.http
      .get(
        `${this.baseUrl}/expmgr/filter/admin/requisitions/bystatus?Status=${status}`
      )
      .pipe(
        tap(),
        map((res) => {
          return res['list'];
        }),
        catchError(this.handleError)
      );
  }

  getEssRetirements(): Observable<Retirement[]> {
    return this.http.get(`${this.baseUrl}/expmgr/get/all/ess/retirements`).pipe(
      tap(),
      map((res) => {
        return res['list'];
      }),
      catchError(this.handleError)
    );
  }

  // collections
  getCollections(): Observable<Collection[]> {
    return this.http.get(`${this.baseUrl}/expmgr/get/all/collections`).pipe(
      tap(),
      map((res) => {
        return res['list'];
      }),
      catchError(this.handleError)
    );
  }
  confirmRefund(payload): Observable<any> {
    return this.apiService.post(`/expmgr/confirm/collection`, payload).pipe(
      tap(),
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  generateErnNumber(): Observable<{}> {
    return this.http.get(`${this.baseUrl}/expmgr/generate/ern/number`).pipe(
      tap(),
      map((res) => {
        return res['responseValue'];
      }),
      catchError(this.handleError)
    );
  }
  generateClaimNumber(): Observable<{}> {
    return this.http.get(`${this.baseUrl}/expmgr/generate/claims/number`).pipe(
      tap(),
      map((res) => {
        return res['responseValue'];
      }),
      catchError(this.handleError)
    );
  }
  generateNoReqClaimNumber(): Observable<{}> {
    return this.http
      .get(`${this.baseUrl}/expmgr/generate/no_requisition/number`)
      .pipe(
        tap(),
        map((res) => {
          return res['responseValue'];
        }),
        catchError(this.handleError)
      );
  }

  uploadNoReqClaims(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/expmgr/upload/no_requisition/claims`, file)
      .then((data) => {
        return data;
      });
  }
  downloadNoReqClaims() {
    return this.apiService
      .getExcel(`/expmgr/downlaod/no_requisition/claims`)
      .pipe(
        tap(),
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }
}
