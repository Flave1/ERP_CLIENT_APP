import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepositAccountService {
  constructor(private apiService: ApiService) {}
  userData: any = {};
  // Handling Errors
  private handleError(error: any) {
    return throwError(error);
  }
  submitStaffDepsoitChangeOfRateApproval(payload: Object): Observable<any> {
    return this.apiService.post(`/deposit/changeofrates/staff/approval`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  submitStaffDepsoitBankClosureApproval(payload: Object): Observable<any> {
    return this.apiService.post(`/deposit/bankclosure/staff/approval`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getApprovalDetails(id: number, token: string): Observable<any> {
    return this.apiService
      .get(
        `/deposit/bankclosure/credit/approval/details?TargetId=${id}&WorkflowToken=${token}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllChangeOfRatesAwaitingApprovals(): Observable<any> {
    return this.apiService.get('/deposit/changeofrates/get/awaitig/approval').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllAccountClosuresAwaitingApprovals(): Observable<any> {
    return this.apiService.get('/deposit/bankclosure/get/all/awaiting/approvals').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllAccountType() {
    return this.apiService.get('/deposit/acounttype/get/all/accountType').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllcategory() {
    return this.apiService.get('/deposit/depositcategory/get/all/depositcategory').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllAccountSetup() {
    return this.apiService.get('/deposit/accountsetup/get/all/accountsetup').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllbusinessCategory() {
    return this.apiService.get('/deposit/businesscategory/get/all').pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllTransactionCharge() {
    return this.apiService
      .get('/deposit/transactioncharge/get/all/transactioncharge')
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAllTransactionTax() {
    return this.apiService.get('/deposit/transactiontax/get/all/transactiontax').pipe(
      tap(data => {
        return data;
      })
    );
  }
  uploadTransactionCharge(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/transactioncharge/upload/transactioncharge`, imageFile)
      .then(data => {
        return data;
      });
  }
  exportTransactionCharge(): Observable<any> {
    return this.apiService
      .getExcel(`/deposit/transactioncharge/download/transactioncharge`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  uploadTransactionTaxCharge(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/transactiontax/upload/transactiontax`, imageFile)
      .then(data => {
        return data;
      });
  }

  exportTransactionTaxCharge(): Observable<any> {
    return this.apiService
      .getExcel(`/deposit/transactiontax/download/transactiontax`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteMultipleAccountType(body): Observable<any> {
    return this.apiService.post(`/deposit/accountType/delete/accountType`, body).pipe(
      tap(data => {
        return data;

      })
    );
  }

  deleteMultiplecategory(body): Observable<any> {
    return this.apiService
      .post(`/deposit/depositcategory/delete/depositcategory`, body)
      .pipe(
        tap(data => {
          return data;

        })
      );
  }

  deleteMultiplebusinessCategory(body): Observable<any> {
    return this.apiService.post(`/deposit/businesscategory/delete`, body).pipe(
      tap(data => {
        return data;

      })
    );
  }

  deleteMultipleTransactionCharge(body): Observable<any> {
    return this.apiService
      .post(`/deposit/transactioncharge/delete/transactioncharge`, body)
      .pipe(
        tap(data => {
          return data;

        })
      );
  }

  deleteMultipleAccountSetup(body): Observable<any> {
    return this.apiService.post(`/deposit/accountsetup/delete/accountsetup`, body).pipe(
      tap(data => {
        return data;

      })
    );
  }

  deleteMultipleTransactionTax(body): Observable<any> {
    return this.apiService
      .post(`/deposit/transactiontax/delete/transactiontax`, body)
      .pipe(
        tap(data => {
          return data;

        })
      );
  }

  getAccountType(setupId) {
    return this.apiService
      .get(`/deposit/acounttype/get/accountTypeById?AccountTypeId=${setupId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getTransactiontax(setupId) {
    return this.apiService
      .get(`/deposit/transactiontax/get/transactiontaxbyid?SearchId=${setupId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getAccountSetup(setupId) {
    return this.apiService
      .get(`/deposit/accountsetup/get/accountsetupbyid?SearchId=${setupId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getTransactionCharge(setupId) {
    return this.apiService
      .get(`/deposit/transactioncharge/get/transactionchargebyid?SearchId=${setupId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getCategory(setupId) {
    return this.apiService
      .get(`/deposit/depositcategory/get/depositcategoryid?SearchId=${setupId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getbusinesscategory(setupId) {
    return this.apiService
      .get(`/deposit/businesscategory/get/businesscategoryId?SearchId=${setupId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // upload business category
  uploadBusinessCategory(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/businesscategory/upload`, imageFile)
      .then(data => {
        return data;
      });
  }

  downloadBusinessCategory(): Observable<any> {
    return this.apiService.getExcel(`/deposit/businesscategory/download`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  updateAccountType(body): Observable<any> {
    return this.apiService
      .post(`/deposit/acounttype/add/update/accountType`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateAccountsetup(body): Observable<any> {
    return this.apiService
      .post(`/deposit/accountsetup/add/update/accountsetup`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateTransactionCharge(body): Observable<any> {
    return this.apiService
      .post(`/deposit/transactioncharge/add/update/transactioncharge`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateTransactiontax(body): Observable<any> {
    return this.apiService
      .post(`/deposit/transactiontax/add/update/transactiontax`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateCategory(body): Observable<any> {
    return this.apiService
      .post(`/deposit/depositcategory/add/update/depositcategory`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updatebusinesscategory(body): Observable<any> {
    return this.apiService.post(`/deposit/businesscategory/add/update`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  uploadActivationSetup(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/accountreactivation/upload/setup`, imageFile)
      .then(data => {
        return data;
      });
  }

  downloadActivationSetup(): Observable<any> {
    return this.apiService.getExcel(`/deposit/accountreactivation/download/setup`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  // activation reactivation set up
  activationSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/deposit3/account-reactivation-setup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // delete activation  set up
  deleteActivationSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/deposit3/delete-account-reactivation-setup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  //
  accountReactivation(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/customer_account_operation/reactivate/account`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteReactivation(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/deposit3/delete-account-reactivation`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  changeOfRateSetUp(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/changeofrates/add/update/changeofratessetup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getChangeOfRateSetupList() {
    return this.apiService
      .get(`/deposit/changeofrates/get/all/changeofratessetup`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  // change of rate setup
  uploadChangeOfRateSetup(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/changeofrates/upload/changeofratessetup`, imageFile)
      .then(data => {
        return data;
      });
  }

  // export change of rate
  exportChangeOfRateSetup(): Observable<any> {
    return this.apiService
      .getExcel(`/deposit/changeofrates/download/changeofratessetup`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getChangeOfRateSetup(id: number): Observable<any> {
    return this.apiService
      .get(`/deposit/changeofrates/get/changeofratessetupid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteChangeOfRateSetup(body: any) {
    return this.apiService
      .post(`/deposit/changeofrates/delete/changeofratessetup`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  updateDepositRateChange(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/changeofrates/add/update/changeofrates`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteDepositRateChange(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/changeofrates/delete/changeofrates`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get withdrawals set up
  getWithdrawalSetups(): Observable<any> {
    return this.apiService.get(`/deposit/withdrawal/get/all/withdrawalsetup`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  updateWithdrawalSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/withdrawal/add/update/withdrawalsetup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getWithdrawalSetup(id: number): Observable<any> {
    return this.apiService
      .get(`/deposit/withdrawal/get/withdrawalsetupid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  deleteWithdrawalSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/withdrawal/delete/withdrawalsetup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  updateWithdrawals(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/customer_account_operation/withdrawal`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get bank closure
  getBankClosureSetups(): Observable<any> {
    return this.apiService.get(`/deposit/bankclosure/get/all/bankClosureSetup`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // update bank closure set up
  updateBankClosureSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/bankclosure/add/update/bankClosureSetup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get bank closure set up by id
  getBankClosureSetup(id: number): Observable<any> {
    return this.apiService
      .get(`/deposit/bankclosure/get/single/bankClosureSetup?BankClosureSetupId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadBankClosureSetup(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/bankclosure/upload/bankClosureSetup`, imageFile)
      .then(data => {
        return data;
      });
  }

  downloadBankClosureSetup(): Observable<any> {
    return this.apiService
      .getExcel(`/deposit/bankclosure/download/bankClosureSetup`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  updateBankClosure(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/bankclosure/add/update/bankClosure`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  // delete bank closure set up
  deleteBankClosureSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/bankclosure/delete/bankClosure`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get reactivation set up
  getReactivationSetups(): Observable<any> {
    return this.apiService.get(`/deposit/accountreactivation/get/all/setup`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get account reactivation by id
  getReactivationSetup(id: number): Observable<any> {
    return this.apiService
      .get(`/deposit/accountreactivation/get/all/setup?ReactivationSetupId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  //update account reactivation
  updateReactivationSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/accountreactivation/addupdate/setup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // delete account reactivation set up
  deleteReactivationSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/accountreactivation/delete/setup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get all transfer set up
  getTransferSetups(): Observable<any> {
    return this.apiService.get(`/deposit/transfer/get/all/transfersetup`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get transfer set up by id
  getTransferSetup(id: number): Observable<any> {
    return this.apiService
      .get(`/deposit/transfer/get/transfersetupid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // update transfer set up
  updateTransferSetup(payload): Observable<any> {
    return this.apiService
      .post(`/deposit/transfer/add/update/transfersetup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // delete transfer set up
  deleteTransferSetup(payload: Object): Observable<any> {
    return this.apiService.post(`/deposit/transfer/delete/transfersetup`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  //update transfer form
  updateTransferForm(payload: Object): Observable<any> {
    return this.apiService.post(`/deposit/transfer/add/update/transfer`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }
  // cashier/teller setup

  //get Callover Setups
  getCalloverSetups(): Observable<any> {
    return this.apiService
      .get(`/deposit/cashierteller/get/all/cashiertellersetup`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get callover setup
  getCalloverSetup(id: number): Observable<any> {
    return this.apiService
      .get(`/deposit/cashierteller/get/cashiertellersetupid?SearchId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // update callover setup
  updateCalloverSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/cashierteller/add/update/cashiertellersetup`, payload)
      .pipe(
        tap(res => {
          return res;
        })
      );
  }
  // delete callover setup
  deleteCalloverSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/cashierteller/delete/cashiertellersetup`, payload)
      .pipe(
        tap(res => {
          return res;
        })
      );
  }

  getCallovers(): Promise<any> {
    return this.apiService
      .get(`/deposit/deposit8/deposit-cashier-teller`)
      .toPromise()
      .then(data => {
        return data;
      });
  }
  getCallover(id: number): Promise<any> {
    return this.apiService
      .get(`/deposit/deposit8/deposit-cashier-teller-id?id=${id}`)
      .toPromise()
      .then(data => {
        return data;
      });
  }
  updateCallover(payload: Object): Promise<any> {
    return this.apiService
      .post(`/deposit/customer_account_operation/add/ob/currency/amount`, payload)
      .toPromise()
      .then(res => {
        return res;
      });
  }

  // delete callover
  deleteCallover(payload: Object): Promise<any> {
    return this.apiService
      .post(`/deposit/deposit8/delete-deposit-cashier-teller`, payload)
      .toPromise()
      .then(res => {
        return res;
      });
  }

  uploadTillVaultSetup(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/tillvault/get/upload/tillVaultSetup`, imageFile)
      .then(data => {
        return data;
      });
  }

  downloadTillVaultSetup(): Observable<any> {
    return this.apiService.getExcel(`/deposit/tillvault/download/tillVaultSetup`).pipe(
      tap(data => {
        return data;
      })
    );
  }
  // get till and vault setups
  getTillVaultSetups(): Observable<any> {
    return this.apiService.get(`/deposit/tillvault/get/all/tillVaultSetup`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get till and vault by id
  getTillVaultSetup(id: number): Observable<any> {
    return this.apiService
      .get(`/deposit/tillvault/get/singel/tillVaultSetup?TillVaulSetuptId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // update till and vault set up
  updateTillVaultSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/tillvault/add/update/tillVaultSetup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // delete till and vault setup
  deleteTillVaultSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/tillvault/delete/tillVaultSetup`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get till and vault
  getTillVaults(): Observable<any> {
    return this.apiService.get(`/deposit/deposit9/deposit-tillvault`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get till and vault by id
  getTillVault(id: number): Observable<any> {
    return this.apiService.get(`/deposit/deposit9/deposit-tillvault-id?id=${id}`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // update till and vault
  updateTillVault(payload: Object): Observable<any> {
    return this.apiService.post(`/deposit/deposit9/deposittillvault`, payload).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // delete till and vault
  deleteTillVault(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/deposit9/delete-deposit-tillvault`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // update transaction correction setup
  updateTransactionCorrectionSetup(payload: Object): Observable<any> {
    return this.apiService
      .post(
        `/deposit/transactioncorrectionsetup/add/update/transactioncorrectionsetup`,
        payload
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadTransactionCorrectionSetup(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(
        `/deposit/transactioncorrectionsetup/upload/transactioncorrectionsetup`,
        imageFile
      )
      .then(data => {
        return data;
      });
  }

  downloadTransactionCorrectionSetup(): Observable<any> {
    return this.apiService
      .getExcel(
        `/deposit/transactioncorrectionsetup/download/transactioncorrectionsetup`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  // get transaction setups
  getTransactionCorrectionSetups(): Observable<any> {
    return this.apiService
      .get(`/deposit/transactioncorrectionsetup/get/all/transactioncorrectionsetup`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get transaction correction set up by id
  getTransactionCorrectionSetup(id: number): Observable<any> {
    return this.apiService
      .get(
        `/deposit/transactioncorrectionsetup/get/single/transactioncorrectionsetup?transactionCorrectionSetupId=${id}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // delete transaction correction set up
  deleteTransactionCorrectionSetups(payload: Object): Observable<any> {
    return this.apiService
      .post(
        `/deposit/transactioncorrectionsetup/delete/transactioncorrectionsetup`,
        payload
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // update transaction correction
  updateTransactionCorrection(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/deposit9/deposittransactioncorrection`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // get transaction correction
  getTransactionCorrections(): Observable<any> {
    return this.apiService.get(`/deposit/deposit9/deposit-transactioncorrection`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // get transaction correction by id
  getTransactionCorrection(id: number): Observable<any> {
    return this.apiService
      .get(`/deposit/deposit9/deposit-transactioncorrection-id?id=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // delete transaction correction
  deleteTransactionCorrection(payload: Object): Observable<any> {
    return this.apiService
      .post(`/deposit/deposit9/delete-deposit-transactioncorrection`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // export account type setup
  exportAccountTypeSetup(): Observable<any> {
    return this.apiService.getExcel(`/deposit/accountsetup/download/accountsetup`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // upload account type setup
  uploadAccountTypeSetup(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/accountsetup/upload/accountsetup`, imageFile)
      .then(data => {
        return data;
      });
  }

  uploadAccountType(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/accountType/upload/accountType`, imageFile)
      .then(data => {
        return data;
      });
  }

  exportAccountType(): Observable<any> {
    return this.apiService.getExcel(`/deposit/accountType/download/accountType`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // export callover setup
  exportCallOverSetup(): Observable<any> {
    return this.apiService
      .getExcel(`/deposit/cashierteller/download/cashiertellersetup`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // upload callover setup
  uploadCallOverSetup(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/cashierteller/upload/cashiertellersetup`, imageFile)
      .then(data => {
        return data;
      });
  }

  uploadCategory(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/depositcategory/upload/depositcategory`, imageFile)
      .then(data => {
        return data;
      });
  }
  exportCategory(): Observable<any> {
    return this.apiService
      .getExcel(`/deposit/depositcategory/download/depositcategory`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getChangeOfrates(): Observable<any> {
    return this.apiService.get(`/deposit/changeofrates/get/all/changeofrates`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getChangeOfrate(id: any): Observable<any> {
    return this.apiService
      .get(`/deposit/changeofrates/get/changeofratesid?ChangeOfRateId=${id}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // export transfer set up
  exportTransferSetup(): Observable<any> {
    return this.apiService.getExcel(`/deposit/transfer/download/transfersetup`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  // upload transfer setup
  uploadTransferSetup(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/transfer/upload/transfersetup`, imageFile)
      .then(data => {
        return data;
      });
  }

  // export withdrawal set up
  exportWithdrawalSetup(): Observable<any> {
    return this.apiService
      .getExcel(`/deposit/withdrawal/download/withdrawalsetup`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  // upload withdrawal set up
  uploadWithdrawalSetup(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel(`/deposit/withdrawal/upload/withdrawalsetup`, imageFile)
      .then(data => {
        return data;
      });
  }
  addDeposit(payload: any): Observable<any> {
    return this.apiService
      .post(`/deposit/accountsetup/add/update/depositform`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  getWithdrawals(): Observable<any> {
    return this.apiService
      .get(`/deposit/customer_account_operation/get/all/withdrawals`)
      .pipe(tap(), catchError(this.handleError));
  }
  getReactivationList(): Observable<any> {
    return this.apiService
      .get(`/deposit/customer_account_operation/get/all/reativations`)
      .pipe(tap(), catchError(this.handleError));
  }
  getReactivationApprovals(): Observable<any> {
    return this.apiService
      .get(`/deposit/customer_account_operation/get/reactivations/awaiting/approval`)
      .pipe(tap(), catchError(this.handleError));
  }
  approveReactivation(payload: any): Observable<any> {
    return this.apiService
      .post(`/deposit/customer_account_operation/reativation/satff/approval`, payload)
      .pipe(tap(), catchError(this.handleError));
  }

  // get cashier balancing
  getCashierBalancing() {
    return this.apiService
      .get(`/deposit/customer_account_operation/get/satff/call_over_transactions`)
      .pipe(tap(), catchError(this.handleError));
  }
}
