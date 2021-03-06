import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { map, distinctUntilChanged, tap, catchError } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { AppConfigService } from './app.config.service';
import { environment } from 'src/environments/environment';

// let AppConstant: any = {};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  photoUrl = new BehaviorSubject<string>(
    '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'
  );
  userName = new BehaviorSubject<string>('');
  currentPhotoUrl = this.photoUrl.asObservable();
  currentUserName = this.userName.asObservable();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    // private appConfigService: AppConfigService
  ) {
    // AppConstant = appConfigService;
  }

  private handleError(error: any) {
    return throwError(error);
  }
  changeProfilePhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }
  changeProfileName(userName: string) {
    this.userName.next(userName);
  }

  // createUser(body): Observable<CreateUserModel> {
  //     // Create users of the application
  //     return this.apiService.post("/auth/user", body).pipe(
  //         map(data => {
  //             return data;
  //         })
  //     );
  // }

  // ChangePassword(body): Observable<CreateUserModel> {
  //     return this.apiService.post("/auth/change-password", body).pipe(
  //         map(data => {
  //             return data;
  //         })
  //     );
  // }

  // ResetPassword(body): Observable<any> {
  //     return this.apiService.post("/auth/reset-password", body).pipe(
  //         map(data => {
  //             return data;
  //         })
  //     );
  // }

  // getUserDetails(userAccountId): Observable<UserModel> {
  //     // Create users of the application
  //     return this.apiService
  //         .get(`/auth/user?userAccountId=${userAccountId}`)
  //         .pipe(
  //             map(data => {
  //                 this.changeProfilePhoto(data["result"].photo);
  //                 this.changeProfileName(data["result"].userName);
  //                 return data;
  //             })
  //         );
  // }

  // forgetPassword(email): Observable<any> {
  //     return this.apiService.get(`/auth/forget-password?email=${email}`).pipe(
  //         map(data => {
  //             return data;
  //         })
  //     );
  // }

  // getActivateAccount(userAccountId): Observable<UserModel> {
  //     // Create users of the application
  //     return this.apiService
  //         .get(`/auth/activate-user?userAccountId=${userAccountId}`)
  //         .pipe(
  //             map(data => {
  //                 return data;
  //             })
  //         );
  // }

  setAuth(token) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(token);
  }

  setUser(user, activities) {
    // Save user sent from server in localstorage
    this.jwtService.saveUserDetails(user);

    this.jwtService.saveUserActivities(activities);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Remove User from localstorage
    this.jwtService.destroyUser();
    // Remove Activities from localstorage
    this.jwtService.destroyUserActivities();

    this.jwtService.destroyUserDetails();

    localStorage.clear();
    //localStorage.removeItem('Tenor');
    //localStorage.removeItem('TotalP');
    this.router.navigate(['/auth/login']);
  }
  // getAuthToken(username, password) {
  //     let body = `username=${username}&password=${password}&grant_type=password`;
  //     let reqHeaders = new HttpHeaders({
  //         "Content-Type": "x-www-form-urlencoded"
  //     });
  //     return this.http
  //         .post(environment.token_url, body, { headers: reqHeaders })
  //         .pipe(
  //             map(data => {
  //                 if (data["access_token"] != null) {
  //                     this.setAuth(data["access_token"]);
  //                 }
  //                 return data;
  //             })
  //         );
  // }
  getProfile(): Observable<any> {
    return this.apiService.get(`/identity/profile`).pipe(tap(data => {
    //return this.http.get(`http://107.180.93.38:5050/identity/profile`).pipe(tap(data => {
      return data;
    })
    );
  }
  userLogin(payload): Observable<any> {
    // let body = { userName: userName, password: password };
    let reqHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return (
      this.http
        //.post("http://107.180.93.38:5050/identity/login", JSON.stringify(payload), {
        .post(environment.api_url + "/identity/login", JSON.stringify(payload), {
          headers: reqHeaders
        })
        .pipe(
          map(data => {
            this.setUser(data['userFromRepo'], data['activities']);
            return data;
          })
        )
    );
  }

  loggedIn() {
    return this.jwtService.getToken() ? true : false;
  }
  confirmToken(otp: string, email: string): Observable<any> {
    return this.apiService
      .post(`/identity/otp/login?OTP=${otp}&Email=${email}`, {})
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  resetPassword(payload: Object): Observable<any> {
    return this.apiService.post(`/identity/newpassword`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  confirmOTP(payload: any): Observable<any> {
    return this.apiService.post(`/identity/confirmCode`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }
  forgotPassword(email: string): Observable<any> {
    return this.apiService
      .post(`/identity/recoverpassword/byemail`, email)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getQuestion(username: string): Observable<any> {
    return this.apiService
      .get(`/customer/get/answer/question?UserName=${username}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSingleQuestion(id: number): Observable<any> {
    return this.apiService
      .get(`/admin/get/single/questions?QuestionsId=${id}`)
      .pipe(tap(), catchError(this.handleError));
  }
  answerQuestion(payload: any): Observable<any> {
    return this.apiService.post(`/customer/answer/question`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getModules(): Observable<any> {
    return this.apiService.get(`/admin/get/all/modules`).pipe(tap(),
    //return this.http.get<any>(`http://107.180.93.38:5050/admin/get/all/modules`).pipe(tap(),
      map((res) => {
        return res.all_modules;
      })
    );
  }
}
