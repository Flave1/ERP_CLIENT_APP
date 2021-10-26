import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router } from '@angular/router';
import { GLTransactionService } from 'src/app/core/services/gltransaction.service';
import { CompanyService } from '../../../core/services/company.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { FinancalYearService } from '../../../core/services/financal-year.service';
import { saveAs } from 'file-saver';
import { JwtService } from '../../../core/services/jwt.service';
@Component({
  selector: 'app-gltransaction-list',
  templateUrl: './gltransaction-list.component.html',
})
export class GLTransactionListComponent implements OnInit {
  glTransactionList: any[] = [];
  glTransactionSelected: any[] = [];
  selectedGLTransaction: any = {};
  displayInfo = false;
  cols: any[];
  viewHeight: any = '600px';
  companyId: any;
  companyInformation: any;
  dateFrom: any;
  dateTo: any;
  finacialYear: any = [];
  searchForm: FormGroup;
  payload: any;
  staffId: number;
  constructor(
    private loadingService: LoadingService,
    private glTransactionService: GLTransactionService,
    private router: Router,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private financeYearService: FinancalYearService,
    private jwtService: JwtService
  ) {
    this.searchForm = this.fb.group({
      comp: [0],
      date1: [''],
      date2: [''],
      period: [0],
      sub: false,
    });
  }

  ngOnInit() {
    this.staffId = this.jwtService.getUserDetails().staffId;
    this.cols = [
      { field: 'sourceReferenceNumber', header: 'sourceReferenceNumber' },
      { field: 'subGLCode', header: 'subGLCode' },
      { field: 'description', header: 'description' },
      { field: 'valueDate', header: 'valueDate' },
      { field: 'subGLname', header: 'subGLname' },
      { field: 'debitAmount', header: 'debitAmount' },
      { field: 'creditAmount', header: 'creditAmount' },
    ];
    // this.getAllGLTransaction();
    this.getAllCompany();
    this.getFinancialYear();
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
  getFinancialYear() {
    return this.financeYearService.getAllFinacialYearByStatus().subscribe(
      (data) => {
        this.finacialYear = data.financialYear;
      },
      (err) => {
        return this.loadingService.hide();
      },
      () => {}
    );
  }
  getAllGLTransaction() {
    this.loadingService.show();
    this.glTransactionService.getAllGLTransaction().subscribe((data) => {
      this.loadingService.hide();
      this.glTransactionList = data['result'];
    });
  }

  getGLTransaction(transactionId) {
    this.loadingService.show();
    this.glTransactionService
      .getGLTransaction(transactionId)
      .subscribe((data) => {
        this.loadingService.hide();
        this.glTransactionSelected = data['result'];
      });
  }

  onRowSelect(event) {
    if (event.data.transactionId != null) {
      // this.router.navigate([
      //     "/credit/eligibility-check",
      //     event.data.glTransactionId
      // ]);

      this.router.navigate(['/finance/gltransaction-info'], {
        queryParams: { editgltransaction: event.data.transactionId },
      });
    }
  }

  processData(formObj) {
    this.payload = formObj.value;
    this.payload.comp = parseInt(this.payload.comp);
    if (!this.payload.comp) {
      return swal.fire('GOS FINANCIAL', 'Select Company', 'error');
    }
    if (!this.payload.date1) {
      return swal.fire('GOS FINANCIAL', 'Select start date', 'error');
    }
    if (!this.payload.date2) {
      return swal.fire('GOS FINANCIAL', 'Select end date', 'error');
    }
    this.loadingService.show();
    return this.glTransactionService
      .glTransactionSearch(this.payload)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.glTransactionList = data.gLtransaction;
        },
        (err) => {
          this.loadingService.hide();
        },
        () => {}
      );
  }

  refreshData() {}
  exportGlTransaction() {
    this.loadingService.show();
    this.glTransactionService
      .exportGlTransactions(this.payload)
      .subscribe((response) => {
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
            var file = new File([bb], 'GL Transactions.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(textFileAsBlob, 'GL Transactions.xlsx');
          }
        }
      });
  }
}
