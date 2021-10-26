import { Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class PpeService {
  constructor(private apiService: ApiService) {}

  // add asset classification
  updateAssetClassification(payload: Object): Observable<any> {
    return this.apiService
      .post(`/assetclassification/add/update/assetclassification`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get all asset classification;
  getAssetClassifications(): Observable<any> {
    return this.apiService
      .get(`/assetclassification/get/all/assetclassification`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get asset classification by id
  getAssetClassification(id: number): Observable<any> {
    return this.apiService
      .get(`/assetclassification/get/assetclassificationbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // multi delete asset classification
  deleteAssetClassification(ids: any): Observable<any> {
    return this.apiService
      .post(`/assetclassification/delete/assetclassification`, ids)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // export asset classification
  exportAssetClassification(): Observable<any> {
    return this.apiService
      .getExcel(`/assetclassification/download/assetclassification`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadAssetClassification(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/assetclassification/upload/assetclassification`, imageFile)
      .then(data => {
        return data;
      });
  }

  // update addition
  updateAddition(payload: Object): Observable<any> {
    return this.apiService.post(`/addition/add/update/addition`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get lpo lists
  getLpos(): Observable<any> {
    return this.apiService.get(`/addition/get/all/lponumbers`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get additions
  getAdditions(): Observable<any> {
    return this.apiService.get(`/addition/get/all/addition`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAdditionsLPO(): Observable<any> {
    return this.apiService.get(`/addition/get/all/lponumbers`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get addition by id
  getAddition(id: number): Observable<any> {
    return this.apiService
      .get(`/addition/get/additionbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteAdditions(ids: any): Observable<any> {
    return this.apiService.post(`/addition/delete/addition`, ids).pipe(
      tap(data => {
        return data;
      })
    );
  }

  uploadAdditions(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/addition/upload/addition`, imageFile)
      .then(data => {
        return data;
      });
  }
  exportAdditions(): Observable<any> {
    return this.apiService.getExcel(`/addition/download/addition`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get awaiting approvals
  getAwaitingApprovals(): Observable<any> {
    return this.apiService
      .get(`/addition/get/all/staff/awaiting/approvals`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  submitApproval(payload: any): Observable<any> {
    return this.apiService
      .post(`/addition/staff/approval/request`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getRegisterList(): Observable<any> {
    return this.apiService.get(`/register/get/all/register`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get register by id
  getRegister(id: number): Observable<any> {
    return this.apiService
      .get(`/register/get/registerbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // update register
  updateRegister(payload: any): Observable<any> {
    return this.apiService.post(`/register/add/update/register`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  //upload register
  uploadRegister(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/register/upload/register`, file)
      .then(data => {
        return data;
      });
  }

  // export register
  exportRegister(): Observable<any> {
    return this.apiService.getExcel(`/register/download/register`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  exportDepreciationReport(): Observable<any> {
    return this.apiService.getExcel(`/register/download/asset/depreciation/report`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getReassessmentList(): Observable<any> {
    return this.apiService.get(`/reassessment/get/all/reassessment`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get reassessment
  getReassessment(id: number): Observable<any> {
    return this.apiService
      .get(`/reassessment/get/reassessmentbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  updateReassessment(payload): Observable<any> {
    return this.apiService.post(`/register/update/reassessment`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get reassessment appraisals
  getReassessmentAppraisals(): Observable<any> {
    return this.apiService
      .get(`/register/get/all/staff/reassessment/awaiting/approvals`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  submitReassessmentApproval(payload: any): Observable<any> {
    return this.apiService
      .post(`/register/staff/reassessment/approval/request`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getDisposals(): Observable<any> {
    return this.apiService.get(`/disposal/get/all/disposal`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getDisposal(id: number): Observable<any> {
    return this.apiService
      .get(`/disposal/get/disposalbyid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // update disposal
  updateDisposal(payload: any): Observable<any> {
    return this.apiService.post(`/register/update/disposal`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getDisposalAppraisals(): Observable<any> {
    return this.apiService
      .get(`/register/get/all/staff/disposal/awaiting/approvals`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  submitDisposalApproval(payload: any): Observable<any> {
    return this.apiService
      .post(`/register/staff/disposal/approval/request`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  multiReassessUsefulLife(payload: any[]): Observable<any> {
    return this.apiService
      .post(`/register/update/multiple/proposedusefullife`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  multiReassessResidualValue(payload: any[]): Observable<any> {
    return this.apiService
      .post(`/register/update/multiple/proposedresidualvalue`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAdditionComments(id: number, token: string) {
    return this.apiService
      .get(
        `/addition/get/approval/comments?TargetId=${id}&WorkflowToken=${token}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateReevaluation(payload): Observable<any> {
    return this.apiService.post(`/register/update/reevaluation`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }
  mulitiReevaluate(payload): Observable<any> {
    return this.apiService
      .post(`/register/update/multiple/reevaluation`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getReevaluationApprovals() {
    return this.apiService
      .get(`/register/get/all/staff/reevaluation/awaiting/approvals`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  submitReevaluationApproval(payload): Observable<any> {
    return this.apiService
      .post(`/register/staff/reevaluation/approval/request`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getApprovalComments(id: number, token: string):Observable<any> {
    return this.apiService.get(`/addition/get/approval/comments?TargetId=${id}&WorkflowToken=${token}`).pipe(tap (data => {
      return data;
    }))
  }
  multiApproveAddition(payload: any): Observable<any> {
    return this.apiService.post(`/addition/staff/multiapproval/request`, payload).pipe(tap(data => {
      return data;
    }))
  }

  multiApproveReassessment(payload: any):Observable<any> {
    return this.apiService.post(`/register/staff/reassessment/multi/approval/request`, payload).pipe(tap(data => {
      return data;
    }))
  }

  multiApproveDisposal(payload: any):Observable<any> {
    return this.apiService.post(`/register/staff/disposal/multi/approval/request`, payload).pipe(tap(data => {
      return data;
    }))
  }
  multiApproveRevaluation(payload: any):Observable<any> {
    return this.apiService.post(`/register/staff/reevaluation/multi/approval/request`, payload).pipe(tap(data => {
      return data;
    }))
  }
}
