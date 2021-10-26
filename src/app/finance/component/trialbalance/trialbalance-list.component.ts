import swal from 'sweetalert2';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router } from '@angular/router';
import { TrialBalanceService } from 'src/app/core/services/trialbalance.service';
import { saveAs } from 'file-saver';
import { CompanyService } from 'src/app/core/services/company.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FinancalYearService } from '../../../core/services/financal-year.service';
import { JwtService } from '../../../core/services/jwt.service';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-trialBalance-list',
  templateUrl: './trialbalance-list.component.html',
  styleUrls: ['./trialbalance-list.component.scss'],
})
export class TrialBalanceListComponent implements OnInit {
  cols: any[];
  fileToUpload: File;
  viewHeight: any = '600px';
  trialBalanceInformation: any[] = [];
  companyInformation: any[] = [];
  selectedtrialBalanceInformation: any[];
  displayProcessReport = false;
  form: FormGroup;
  dateTo: any;
  dateFrom: any;
  companyId: any = '0';
  period: string = '';
  sub: any;
  financialYear: any[] = [];
  financialYearId: any;
  staffId: number;
  currencyInformation: any[] = [];
  currency: string = '';
  startDate: any;
  endDate: any;
  trialBalanceForm: FormGroup;
  @ViewChild('fileInput') fileInput: ElementRef;
  date: string;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private trialBalanceService: TrialBalanceService,
    private companyService: CompanyService,
    private router: Router,
    private financialYearService: FinancalYearService,
    private jwtService: JwtService,
    private currencyService: CurrencyService
  ) {
    this.form = this.fb.group({
      trialBalanceId: [0],
      currency: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.staffId = this.jwtService.getUserDetails().staffId;
    this.cols = [
      { field: 'glCode', header: 'glCode' },
      { field: 'glDescription', header: 'glDescription' },
      { field: 'currencyCode', header: 'currencyCode' },
      { field: 'companyCode', header: 'companyCode' },
    ];
    // this.getAllTrialBalance();
    this.getAllCompany();
    this.getFinancialYear();
    this.getCurrencies();
    this.trialBalanceForm = this.fb.group({
      comp: [''],
      date1: [''],
      date2: [''],
      period: [''],
    });
    //this.getAllTrialBalance();
  }

  processReport() {
    this.getAllCompany();
    this.displayProcessReport = true;
  }

  getAllCompany() {
    this.loadingService.show();
    this.companyService.getCompanyStructureByStatffId(this.staffId).subscribe(
      (data) => {
        this.loadingService.hide();
        this.companyInformation = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getCurrencies() {
    this.currencyService.getAllCurrency().subscribe(
      (data) => {
        this.currencyInformation = data.result;
      },
      (err) => {
        return err;
      }
    );
  }
  getFinancialYear() {
    return this.financialYearService.getAllFinacialYearByStatus().subscribe(
      (data) => {
        //const d = new Date(this.financialYear[0].startDate);
        // this.date =  `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
        this.financialYear = data.financialYear;
        console.log(this.financialYear);
        this.dateFrom = new Date(this.financialYear[0].startDate);
        this.period = this.financialYear[0].name;
        this.startDate = new Date(this.financialYear[0].startDate).getTime();
        this.endDate = new Date(this.financialYear[0].endDate).getTime();
        this.financialYearId = this.financialYear[0].financialYearId;
        this.trialBalanceForm.patchValue({
          date1: this.formatDate(this.financialYear[0].startDate),
        });
      },
      (err) => {
        return this.loadingService.hide();
      },
      () => {}
    );
  }

  // showAddNew() {
  //     this.router.navigate(["/finance/trialBalance-info"]);
  // }
  refreshData() {}
  getAllTrialBalance() {
    this.loadingService.show();
    this.trialBalanceService.getAllTrialBalance().subscribe((data) => {
      this.loadingService.hide();
      this.trialBalanceInformation = data['result'];
    });
  }
  editTrialBalance(row) {
    this.router.navigate(['/finance/trialBalance-info'], {
      queryParams: { edittrialBalance: row.trialBalanceId },
    });
  }

  rowClicked(row: any): void {}

  exportTrialBalance() {
    this.loadingService.show();
    this.trialBalanceService.exportEOP(this.period).subscribe((response) => {
      this.loadingService.hide();
      let data = response.export;
      if (data != undefined) {
        var byteString = atob(data);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);
        try {
          var file = new File([bb], 'TrialBalance.xlsx', {
            type: 'application/vnd.ms-excel',
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel',
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'trialbalance.xlsx');
        }
      }
    });
  }

  exportTBCurrency() {
    this.loadingService.show();
    if (!this.companyId) {
      swal.fire('GOS FINANCIAL', 'Please select Company', 'error');
      return;
    }
    if (!this.dateFrom) {
      swal.fire('GOS FINANCIAL', 'Please select Start Date', 'error');
      return;
    }
    if (!this.dateTo) {
      swal.fire('GOS FINANCIAL', 'Please select End Date', 'error');
      return;
    }
    if (!this.currency) {
      swal.fire('GOS FINANCIAL', 'Please select Currency', 'error');
      return;
    }
    if (
      new Date(this.dateFrom).getTime() < this.startDate ||
      new Date(this.dateTo).getTime() > this.endDate
    ) {
      return swal.fire(
        'GOS FINANCIALS',
        'Choose dates within the financial year',
        'error'
      );
    }
    const body = {
      comp: this.companyId,
      date1: this.dateFrom,
      date2: this.dateTo,
      period: this.period,
      currency: this.currency,
      finYearId: this.financialYearId,
    };
    this.trialBalanceService.exportTrialBalance(body).subscribe((response) => {
      this.loadingService.hide();
      let data = response.result;
      if (data != undefined) {
        var byteString = atob(data);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);
        try {
          var file = new File([bb], 'TrialBalance.xlsx', {
            type: 'application/vnd.ms-excel',
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel',
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'trialbalance.xlsx');
        }
      }
    });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  uploadTrialBalance() {
    if (this.fileToUpload == null) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
      return;
    }
    this.loadingService.show();
    this.trialBalanceService
      .uploadTrialBalance(this.fileToUpload)
      .then((data) => {
        if (data.status.isSuccessful) {
          this.loadingService.hide();
          this.trialBalanceInformation = data.trialBalance;
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire(
            'GOS FINANCIALS',
            data.status.message.friendlyMessage,
            'success'
          );
        } else {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire(
            'GOS FINANCIALS',
            data.status.message.friendlyMessage,
            'error'
          );
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        swal.fire('GOS FINANCIALS', err.message, 'error');
      });
  }

  processData(form: FormGroup) {
    const payload = form.value;
    if (!payload.comp) {
      swal.fire('GOS FINANCIAL', 'Please select Company', 'error');
      return;
    }
    if (!payload.date1) {
      swal.fire('GOS FINANCIAL', 'Please select Start Date', 'error');
      return;
    }
    if (!payload.date2) {
      swal.fire('GOS FINANCIAL', 'Please select End Date', 'error');
      return;
    }
    if (
      new Date(this.dateFrom).getTime() < this.startDate ||
      new Date(this.dateTo).getTime() > this.endDate
    ) {
      return swal.fire(
        'GOS FINANCIALS',
        'Choose dates within the financial year',
        'error'
      );
    }
    payload.comp = +payload.comp;
    payload.finYearId = this.financialYearId;
    payload.currency = this.currency;
    payload.period = +payload.period;
    const body = {
      comp: parseInt(this.companyId),
      date1: this.dateFrom,
      date2: this.dateTo,
      period: parseInt(this.period),
      currency: this.currency,
      finYearId: this.financialYearId,
    };
    this.loadingService.show();
    this.trialBalanceService.getTrialBalanceBysearch(payload).subscribe(
      (data) => {
        this.loadingService.hide();
        this.trialBalanceInformation = data.trialBalance;
        if (data.status.isSuccessful) {
          this.trialBalanceInformation = data.trialBalance;
          //this.displayProcessReport = false;
        } else {
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'error'
          );
        }
      },
      (err) => {
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', err.status.message.friendlyMessage, 'error');
      }
    );
  }

  deleteTrialBalance(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete user?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.trialBalanceService
            .deleteTrialBalance(row.trialBalanceId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'User deleted successful.',
                  'success'
                );
                __this.getAllTrialBalance();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  multipleDelete() {
    if (this.selectedtrialBalanceInformation.length === 0) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
      return;
    }
    const tempData = this.selectedtrialBalanceInformation;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        const data = {
          targetId: el.userAccountId,
        };
        targetIds.push(data);
      });
    }
    const body = {
      targetIds: targetIds,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        // if (result.value) {
        //     __this.loadingService.show();
        //
        //     __this.customerFsService
        //         .deleteMultipleUsers(body)
        //         .subscribe(data => {
        //             __this.loadingService.hide();
        //             if (data['result'] == true) {
        //                 swal.fire(
        //                     'GOS FINANCIAL',
        //                     'Record deleted successful.',
        //                     'success'
        //                 );
        //                 __this.getAllUser();
        //             } else {
        //                 swal.fire(
        //                     'GOS FINANCIAL',
        //                     'Record not deleted',
        //                     'error'
        //                 );
        //             }
        //         });
        // } else {
        //     swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        // }
      });
  }

  processTBInDifferentCurrency() {
    if (!this.companyId) {
      swal.fire('GOS FINANCIAL', 'Please select Company', 'error');
      return;
    }
    if (!this.dateFrom) {
      swal.fire('GOS FINANCIAL', 'Please select Start Date', 'error');
      return;
    }
    if (!this.dateTo) {
      swal.fire('GOS FINANCIAL', 'Please select End Date', 'error');
      return;
    }
    if (!this.currency) {
      swal.fire('GOS FINANCIAL', 'Please select Currency', 'error');
      return;
    }
    if (
      new Date(this.dateFrom).getTime() < this.startDate ||
      new Date(this.dateTo).getTime() > this.endDate
    ) {
      return swal.fire(
        'GOS FINANCIALS',
        'Choose dates within the financial year',
        'error'
      );
    }
    const body = {
      comp: parseInt(this.companyId),
      date1: this.dateFrom,
      date2: this.dateTo,
      period: parseInt(this.period),
      currency: this.currency,
      finYearId: this.financialYearId,
    };
    this.loadingService.show();
    this.trialBalanceService.getTrialBalanceBysearchCurrency(body).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data.TrialBalance != null) {
          this.trialBalanceInformation = data.trialBalance;
          this.displayProcessReport = false;
          swal.fire('GOS FINANCIAL', data['message'], 'success');
        } else {
          swal.fire('GOS FINANCIAL', data['message'], 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', JSON.stringify(err), 'error');
      }
    );
  }
  processTB() {
    this.displayProcessReport = true;
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }
}
