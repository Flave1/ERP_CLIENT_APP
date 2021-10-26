import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LoanFee } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  handleError(error) {
    return throwError(error);
  }
  getAllProduct() {
    return this.apiService.get('/product/get/all').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getProductLite() {
    return this.apiService.get('/product/product-lite').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getAllProductFee() {
    return this.apiService.get('/product/allproductFee').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getProduct(productId) {
    return this.apiService
      .get(`/product/get/productById?ProductId=${productId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getProductFee(productFeeId) {
    return this.apiService
      .get(`/product/productFee?productFeeId=${productFeeId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  getProductFeeByProduct(productId) {
    return this.apiService
      .get(`/product/get/productFeeByProductId?ProductId=${productId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  deleteProduct(productId) {
    return this.apiService
      .delete(`/product/delete?productId=${productId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  deleteProductFee(productFeeId) {
    return this.apiService
      .delete(`/product/deleteproductFee?productFeeId=${productFeeId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  addProduct(body): Observable<any> {
    return this.apiService.post(`/product/add/update`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  addProductFee(body): Observable<any> {
    return this.apiService.post(`/product/add/update/productfee`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  exportProductFee(productId) {
    return this.apiService
      .getExcel(`/product/download/productfee?ProductId=${productId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }

  uploadProductFee(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel('/product/upload/productfee', imageFile)
      .then((data) => {
        return data;
      });
  }
  deleteMultipleProductFee(body) {
    return this.apiService.post(`/product/delete/productfee`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  getProductAwaitingApproval() {
    return this.apiService.get('/product/products-awaiting-approval').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  goForApproval(body): Observable<any> {
    return this.apiService.post(`/product/approval`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }

  addUpdateProductType(body): Observable<any> {
    return this.apiService.post(`/product/add/update/producttype`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getAllProductType() {
    return this.apiService.get('/product/get/all/producttype').pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getProductType(productTypeId: any): Observable<any> {
    return this.apiService
      .get(`/product/get/producttypeById?ProductTypeId=${productTypeId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  deleteProductType(productTypeId) {
    return this.apiService
      .delete(`/product/delete-product-type?productTypeId=${productTypeId}`)
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  exportProductType() {
    return this.apiService.getExcel('/product/download/producttype').pipe(
      tap((data) => {
        return data;
      })
    );
  }

  uploadProductType(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel('/product/upload/producttype', imageFile)
      .then((data) => {
        return data;
      });
  }
  deleteMultipleProductType(body) {
    return this.apiService.post(`/product/delete/producttype`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  deleteMultipleProduct(body) {
    return this.apiService.post(`/product/delete`, body).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  getproductFeeByLoanApplicationId(loanapplicationId: any): Observable<any> {
    return this.apiService
      .get(
        `/product/get/productFeeByLoanApplicationId?LoanApplicationId=${loanapplicationId}`
      )
      .pipe(
        tap((data) => {
          return data;
        })
      );
  }
  exportProducts(): Observable<any> {
    return this.apiService.get(`/product/download`).pipe(
      tap((data) => {
        return data;
      })
    );
  }
  uploadProducts(file: File): Promise<any> {
    return this.apiService.uploadExcel(`/product/upload`, file).then((data) => {
      return data;
    });
  }

  addFeeRecommendation(payload): Observable<LoanFee> {
    return this.apiService
      .post(`/loanapplication/add/fee/recommendation`, payload)
      .pipe(tap(), catchError(this.handleError));
  }

  getLoanFeeRecommendation(id: number): Observable<LoanFee[]> {
    return this.apiService
      .get(`/loanapplication/get/recommendation/fee?LoanApplicationId=${id}`)
      .pipe(
        tap(),
        map((data) => {
          return data.loanRecommendationFeeLogs;
        }),
        catchError(this.handleError)
      );
  }
}
