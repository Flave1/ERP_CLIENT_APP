import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { take, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  constructor(private apiService: ApiService, private http: HttpClient) {}
  getStaffNotifications(): Observable<any> {
    return this.apiService
      .get(`/email/get/all/useremails?Module=1`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getNotification(id: number): Observable<any> {
    return this.apiService
      .get(`/email/get/single/email?EmailId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getNotificationCount(staffId: number): Observable<any> {
    return this.apiService
      .get(`/notification/get-notifications-count-staff?staffId=${staffId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  markAsRead(userId: number, mailId: number): Observable<any> {
    return this.apiService
      .post(
        `/notification/mark-notification-as-read?userId=${userId}&mailId=${mailId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
}
