import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  constructor(private apiService: ApiService) { }
  updateJournal(payload:Object):Observable<any> {
      return this.apiService.post(`/journalentry/add/update`, payload).pipe(map(data => {
          return data;
      }));
  }
  getAllJournals():Observable<any> {
      return this.apiService.get(`/journalentry/get/all`).pipe(map(data => {
          return data;
      }));
  }
  getAllSubmitJournals(transactionRef):Observable<any> {
    return this.apiService.get(`/journalentry/get/all/sumbitted?transactionFRef=${transactionRef}`).pipe(map(data => {
        return data;
    }));
}
  getJournalsAwaitingApproval():Observable<any> {
    return this.apiService.get(`/journalentry/approval/list`).pipe(map(data => {
                return data;
        }));
}
goForApproval(body): Observable<any> {
    return this.apiService.post(`/journalentry/go/for/approval`, body).pipe(
        map(data => {
            return data;
        })
    );
}
  multipleDelete(payload):Observable<any> {
      return this.apiService.post(`/journalentry/delete/targetIds`, payload).pipe(map(data => {
          return data;
      }))
  };
  passJournalEntries():Observable<any> {
      return this.apiService.post(`/journalentry/submit/entry`,{}).pipe(map(data => {
          return data;
      }))
  }
  clearEntries():Observable<any> {
      return this.apiService.post(`/journalentry/clear/entry`, {}).pipe(map(data => {
          return data;
      }))
  }
  exportJournals() {
      return this.apiService.getExcel(`/journalentry/get/download`).pipe(map(data => {
          return data;
      }))
  }
}
