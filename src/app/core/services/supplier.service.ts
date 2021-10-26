import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SupplierService {
  constructor(private apiService: ApiService) { }
  userData: any = {};

  getAllSupplier() {
    return this.apiService.get("/supplier/get/all/supplers").pipe(
      tap(data => {
        return data;
      })
    );
  }
  getPendingSuppliers(): Observable<any> {
    return this.apiService.get(`/supplier/get/all/pendingsupplers`).pipe(tap(data => {
      return data
    }))
  }

  // export supplier information
  exportSupplier(): Observable<any> {
    return this.apiService
      .getExcel(`/supplier/generate/excel/supplierinformation`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // upload supplier information
  uploadSupplierInfo(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/supplier/upload/excel/supplierinformation`, file)
      .then(data => {
        return data;
      });
  }
  // delete supplier
  deleteSupplierInfo(req: any): Observable<any> {
    return this.apiService
      .post(`/supplier/delete/supplier/targetIds `, req)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getApprovedSuppliers(): Observable<any> {
    return this.apiService.get(`/supplier/get/all/approved/suppliers`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getAllSupplierAuthorization(id: number) {
    return this.apiService
      .get(`/supplier/get/all/authorizations/supplierId?SupplierId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllSupplierBusinessOwner(id: number) {
    return this.apiService
      .get(`/supplier/get/all/businessOwners/supplierId?SupplierId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllSupplierDocument(id: number) {
    return this.apiService
      .get(`/supplier/get/all/documents/supplierId?SupplierId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllSupplierTopClient(id: number) {
    return this.apiService
      .get(`/supplier/get/all/topClients/supplierId?SupplierId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllSupplierTopSupplier(id: number) {
    return this.apiService
      .get(`/supplier/get/all/topSuppliers/supplierId?SupplierId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSupplierByCountry(countryId) {
    return this.apiService
      .get(`/supplier/supplierbycountry?countryId=${countryId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSupplier(supplierId) {
    return this.apiService
      .get(`/supplier/get/single/supplerId?SupplierId=${supplierId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getSupplierIdentification(id: number): Observable<any> {
    return this.apiService
      .get(`/supplier/get/all/identification/supplierId?SupplierId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getSupplierAuthorization(supplierAuthorizationId) {
    return this.apiService
      .get(
        `/supplier/supplierauthorization?supplierAuthorizationId=${supplierAuthorizationId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSupplierBusinessOwner(supplierBusinessOwnerId) {
    return this.apiService
      .get(
        `/supplier/supplierbusinessowner?supplierBusinessOwnerId=${supplierBusinessOwnerId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSupplierDocument(supplierDocumentId) {
    return this.apiService
      .get(
        `/supplier/supplierdocument?supplierDocumentId=${supplierDocumentId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSupplierTopClient(supplierTopClientId) {
    return this.apiService
      .get(
        `/supplier/suppliertopclient?supplierTopClientId=${supplierTopClientId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSupplierTopSupplier(supplierTopSupplierId) {
    return this.apiService
      .get(
        `/supplier/suppliertopsupplier?supplierTopSupplierId=${supplierTopSupplierId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteSupplier(supplierId) {
    return this.apiService
      .delete(`/supplier/delete?supplierId=${supplierId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteSupplierAuthorization(payload: any) {
    return this.apiService
      .post(`/supplier/delete/authorization/targetIds`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteSupplierBusinessOwner(payload: any) {
    return this.apiService
      .post(`/supplier/delete/businessOwner/targetIds`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteSupplierDocument(supplierDocumentId) {
    return this.apiService
      .delete(
        `/supplier/deletedocument?supplierDocumentId=${supplierDocumentId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteSupplierTopClient(payload: any) {
    return this.apiService
      .post(`/supplier/delete/topClient/targetIds`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteSupplierTopSupplier(req) {
    return this.apiService
      .post(`/supplier/delete/topSupplier/targetIds`, req)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addSupplierInformation(body): Observable<any> {
    return this.apiService.post(`/supplier/add/update/supplier`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }
  addSupplierAuthorization(file: File, body): Promise<any> {
    return this.apiService
      .uploadSupplierAuthorization(file, body)
      .then(data => {
        return data;
      });
  }
  addSupplierBusinessOwner(file: File, body): Promise<any> {
    return this.apiService
      .uploadSupplierBusinessOwners(file, body)
      .then(data => {
        return data;
      });
  }
  addSupplierDocument(file: File, body): Promise<any> {
    return this.apiService.uploadSupplierDocument(file, body).then(data => {
      return data;
    });
  }

  // get supplier documents
  getSupplierDocuments(id: number): Observable<any> {
    return this.apiService
      .get(`/supplier/get/all/documents/supplierId?SupplierId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  addSupplierTopClient(body): Observable<any> {
    return this.apiService.post(`/supplier/update/topClient`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }
  addSupplierTopSupplier(body): Observable<any> {
    return this.apiService.post(`/supplier/update/topSupplier`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }
  addSupplierIdentification(payload: Object): Observable<any> {
    return this.apiService
      .post(`/supplier/add/update/identification`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getSupplierAwaitingApproval(): Observable<any> {
    return this.apiService.get("/supplier/gel/all/awaitingAprovals").pipe(
      tap(data => {
        return data;
      })
    );
  }

  goForApproval(body): Observable<any> {
    return this.apiService
      .post(`/supplier/approval/currentStaffApprovalRequest`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateSupplierType(payload: Object): Observable<any> {
    return this.apiService
      .post(`/supplier/add/update/supplierType`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get supplier type list
  getSupplierTypes(): Observable<any> {
    return this.apiService.get(`/supplier/get/all/supplierType`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // delete supplier type
  deleteSupplierTypes(payload: any): Observable<any> {
    return this.apiService
      .post(`/supplier/delete/suppliertype/targetIds`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get supplier type
  getSupplierType(id: number): Observable<any> {
    return this.apiService
      .get(
        `/supplier/single/all/supplierType/supplierTypeId?SupplierTypeId=${id}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // export supplier type
  exportSupplierType(): Observable<any> {
    return this.apiService
      .getExcel(`/supplier/generate/excel/suppliertype`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // upload supplier type
  uploadSupplierType(file): Promise<any> {
    return this.apiService
      .uploadExcel(`/supplier/upload/excel/suppliertype`, file)
      .then(data => {
        return data;
      });
  }
  // update service term
  updateServiceTerm(payload: Object): Observable<any> {
    return this.apiService
      .post(`/supplier/add/update/serviceTerm`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  // get service terms
  getServiceTerms(): Observable<any> {
    return this.apiService.get(`/supplier/get/all/serviceTerm`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  getServiceTerm(id: number): Observable<any> {
    return this.apiService
      .get(`/supplier/get/single/serviceTerm/serviceTermId?ServiceTermId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // upload service terms
  uploadServiceTerms(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/supplier/upload/excel/serviceterm`, file)
      .then(data => {
        return data;
      });
  }

  // export service terms
  exportServiceTerms(): Observable<any> {
    return this.apiService
      .getExcel(`/supplier/generate/excel/serviceterm`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // delete service terms
  deleteServiceTerms(req: any): Observable<any> {
    return this.apiService
      .post(`/supplier/delete/serviceterms/targetIds`, req)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  // tax set up
  updateTaxSetup(payload: Object): Observable<any> {
    return this.apiService.post(`/supplier/add/update/taxSetup`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // delete tax set up
  deleteTaxSetups(req: any): Observable<any> {
    return this.apiService
      .post(`/supplier/delete/taxsetup/targetIds`, req)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get tax setups
  getTaxSetups(): Observable<any> {
    return this.apiService.get(`/supplier/get/all/taxSetup`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get tax setup
  getTaxSetup(id: number): Observable<any> {
    return this.apiService
      .get(`/supplier/get/single/taxSetup/TaxSetupId?TaxSetupId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // export tax set up
  exportTaxSetup(): Observable<any> {
    return this.apiService.getExcel(`/supplier/generate/excel/taxsetup`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // upload tax set up
  uploadTaxSetup(file: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/supplier/upload/excel/taxsetup`, file)
      .then(data => {
        return data;
      });
  }
  getCustomerAwaitingApproval() {
    return this.apiService.get("/supplier/gel/all/awaitingAprovals").pipe(
      tap(data => {
        return data;
      })
    );
  }

  // add bank details
  addSupplierBankDetails(payload: Object): Observable<any> {
    return this.apiService
      .post(`/supplier/add/update/bankdetails`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // GET SUPPLIER BANK DETAILS
  getSupplierBankDetails(id: number) {
    return this.apiService
      .get(`/supplier/get/all/bankdetails/supplierId?SupplierId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // update financial details
  updateFinancialDetails(payload: Object): Observable<any> {
    return this.apiService
      .post(`/supplier/add/update/financialdetails`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get financial details
  getFinancialDetails(id: number): Observable<any> {
    return this.apiService
      .get(`/supplier/get/all/financialDetails/supplierId?SupplierId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // delete financial details
  deleteFinancialDetails(id): Observable<any> {
    const payLoad = {
      financialDetailId: id
    }
    return this.apiService
      .post(`/supplier/delete/financialdetails/targetIds`, payLoad)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // delete identification
  deleteIdentification(id: any): Observable<any> {
    return this.apiService
      .post(`/supplier/delete/identifications/targetIds`, id)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  //delete document
  deleteDocument(financialDetailId: any): Observable<any> {
    return this.apiService.post(`/supplier/delete/document/targetIds`, financialDetailId).pipe(tap(data => {
      return data;
    }))
  }
  //delete bank Details
  deleteBankDetails(id: any): Observable<any> {
    return this.apiService
      .post(`/supplier/delete/bankdetails/targetIds`, id)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  sendForApproval(supplierId: number): Observable<any> {
    return this.apiService
      .post(`/supplier/go/through/approval`, { supplierId })
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getApprovalDetails(id: number, token: string): Observable<any> {
    return this.apiService
      .get(
        `/supplier/get/currentTarget/approvaldetails?TargetId=${id}&WorkflowToken=${token}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  multiApproveSupplier(payload: any): Observable<any> {
    return this.apiService.post(`/supplier/multiple/approve`, payload).pipe(tap(data => {
      return data;
    }))
  }
}
