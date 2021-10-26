import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class StaffInfoService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  getAllStaff() {
    return this.apiService.get('/admin/get/all/staff').pipe(
      map((data) => {
        return data;
      })
    );
  }
  getStaffByCompanyId(id: number): Observable<any> {
    return this.apiService
      .get(`/admin/get/staff/bycompany?ComapanyId=${id}`)
      .pipe(
        tap(),
        map((res) => {
          return res.staffLite;
        }),
        catchError(this.handleError)
      );
  }
  getSingleStaff(staffId) {
    return this.apiService
      .get(`/admin/get/single/staff/staffId?StaffId=${staffId}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  deleteStaff(staffId) {
    return this.apiService
      .delete(`/admin/delete-staff?staffId=${staffId}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  deleteMultipleStaff(body) {
    return this.apiService.post(`/admin/delete/staff/targetIds`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  exportStaff() {
    return this.apiService.getExcel('/admin/generate/excel/staff').pipe(
      map((data) => {
        return data;
      })
    );
  }

  // uploadStaff(formData: FormData) {
  //     return this.apiService
  //         .postUpload("/admin/upload-staff", formData)
  //         .pipe(
  //             map(data => {
  //                 return data;
  //             })
  //         );
  // }
  uploadStaff(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel('/admin/upload/excel/staff', imageFile)
      .then((data) => {
        return data;
      });
  }

  addStaffInfo(body): Observable<any> {
    return this.apiService.post(`/admin/add/update/staff`, body).pipe(
      map((data) => {
        return data;
      })
    );
  }

  resetProfile(userId: string): Observable<any> {
    return this.apiService.post(`/admin/reset/profile`, { userId }).pipe(
      tap((data) => {
        return data;
      })
    );
  }
}
