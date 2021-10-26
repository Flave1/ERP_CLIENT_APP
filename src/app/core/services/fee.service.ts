import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class FeeService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  getAllFee() {
    return this.apiService.get("/fee/get/all").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllIntegralFee() {
    return this.apiService.get("/fee/all-integral-fee").pipe(
      tap(data => {
        return data;
      })
    );
  }

  GetAllFeeTemplate() {
    return this.apiService.get("/fee/allfeeTemplate").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getFee(feeId) {
    return this.apiService.get(`/fee/get/feeById?FeeId=${feeId}`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  deleteFee(feeId) {
    return this.apiService.delete(`/fee/delete?feeId=${feeId}`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  updateFee(body): Observable<any> {
    return this.apiService.post(`/fee/add/update`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  addDeposit(payload: any): Observable<any> {
    return this.apiService
      .post(`/fee/add/update/depositform`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateDepositForm(body): Observable<any> {
    return this.apiService
      .post(`/fee/add/update/depositform`, body)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getAllDepositForm() {
    return this.apiService.get('/fee/get/all/depositform').pipe(
      tap((data) => {
        return data;
      })
    );
  }


  getAllRepaymentType() {
    return this.apiService.get("/fee/get/allrepaymenttype").pipe(
      tap(data => {
        return data;
      })
    );
  }

  exportFee() {
    return this.apiService.getExcel("/fee/download").pipe(
      tap(data => {
        return data;
      })
    );
  }

  uploadFee(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel("/fee/upload", imageFile)
      .then(data => {
        return data;
      });
  }
  deleteMultipleFee(body) {
    return this.apiService.post(`/fee/delete`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }
}
