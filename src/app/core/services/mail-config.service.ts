import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MailConfigService {

  constructor(private apiService: ApiService) { }
  getMailConfigs():Observable<any> {
    return this.apiService.get(`/email/get/all/emailconfig`).pipe(tap(data => {
      return data;
    }))
  }
  updateMailConfig(payload: Object):Observable<any> {
    return this.apiService.post(`/email/add/update/emailconfig`, payload).pipe(tap(data => {
      return data
    }))
  }
  getMailConfig(id: number):Observable<any> {
    return this.apiService.get(`/email/get/single/emailconfig?EmailConfigId=${id}`).pipe(tap(data => {
      return data;
    }))
  }
  deleteMailConfig(id: any):Observable<any> {
    return this.apiService.post(`/email/delete/emailconfig/targetIds`, id).pipe(tap(data => {
      return data;
    }))
  }
}
