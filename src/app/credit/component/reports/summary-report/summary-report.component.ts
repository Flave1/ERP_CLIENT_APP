import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { LoadingService } from '../../../../core/services/loading.service';
import { CompanyService } from '../../../../core/services/company.service';
import { ReportService } from '../../../../core/services/report.service';
import { Router } from '@angular/router';
import { FinancalYearService } from '../../../../core/services/financal-year.service';
import swal from 'sweetalert2';

interface Column {
  name: string;
  id: number;
}

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.css'],
})
export class SummaryReportComponent implements OnInit {
  cols: any[];
  fileToUpload: File;
  viewHeight: any = '600px';
  trialBalanceInformation: any[] = [];
  companyInformation: any[] = [];
  displayProcessReport = false;
  form: FormGroup;
  dateTo: any;
  dateFrom: any;
  companyId: any = '0';
  period: any;
  sub: any;
  financialYear: any[] = [];
  column1: any[];
  column2: any[];
  column3: any[];
  column4: any[];
  groupingColumn: SelectItem[];
  selectedGroup: Column;
  column: any;
  selectedColumn: Column;
  reportTitle: any = 0;
  loanId: any;
  customerType: number = 0;
  columns: Column[] = [];
  customerTypes: Column[];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private ReportService: ReportService,
    private companyService: CompanyService,
    private router: Router,
    private financialYearService: FinancalYearService
  ) {
    this.form = this.fb.group({
      trialBalanceId: [0],
      companyId: ['', Validators.required],
      companyCode: ['', Validators.required],
      runDate: ['', Validators.required],
    });
    this.column1 = [
      { id: 1, name: 'FullName' },
      { id: 2, name: 'Gender' },
      { id: 3, name: 'Dob' },
      { id: 4, name: 'Email' },
      { id: 5, name: 'Employment Status' },
      { id: 6, name: 'City' },
      { id: 7, name: 'Country' },
      { id: 8, name: 'Occupation' },
      { id: 9, name: 'Politically Exposed' },
      { id: 10, name: 'Phone' },
      { id: 11, name: 'MaritalStatus' },
      { id: 12, name: 'BVN' },
      { id: 13, name: 'AccountNumber' },
      { id: 14, name: 'BankName' },
      { id: 15, name: 'ID Issuer' },
      { id: 16, name: 'ID Number' },
      { id: 17, name: 'Next Of Kin Name' },
      { id: 18, name: 'Next Of Kin Relationship' },
      { id: 19, name: 'Next Of Kin Email' },
      { id: 20, name: 'Next Of Kin PhoneNo' },
      { id: 21, name: 'Next Of Kin Address' },
    ];

    this.column2 = [
      { id: 1, name: 'CompanyName' },
      { id: 2, name: 'Email' },
      { id: 3, name: 'Reg Number' },
      { id: 4, name: 'Date of Incorporation' },
      { id: 5, name: 'Phone No' },
      { id: 6, name: 'Address' },
      { id: 7, name: 'Postal Address' },
      { id: 8, name: 'Industry' },
      { id: 9, name: 'Incorporation Country' },
      { id: 10, name: 'City' },
      { id: 11, name: 'Annual Turnaover' },
      { id: 12, name: 'Shareholder Fund' },
      { id: 13, name: 'Company Website' },
      { id: 14, name: 'BVN' },
      { id: 15, name: 'Account Number' },
      { id: 16, name: 'Bank Name' },
      { id: 17, name: 'Director Name' },
      { id: 18, name: 'Director Position' },
      { id: 19, name: 'Director Email' },
      { id: 20, name: 'Director DOB' },
      { id: 21, name: 'Director Phone' },
      { id: 22, name: 'Director Percentage Share' },
      { id: 23, name: 'Director Type' },
      { id: 24, name: 'Director Polically Exposed' },
    ];

    this.column3 = [
      { id: 1, name: 'Loan No' },
      { id: 2, name: 'Product Name' },
      { id: 3, name: 'Account Number' },
      { id: 4, name: 'Account Name' },
      { id: 5, name: 'Industry' },
      { id: 6, name: 'Disbursement Date' },
      { id: 7, name: 'Maturity' },
      { id: 8, name: 'Application Amount' },
      { id: 9, name: 'Disbursement Amount' },
      { id: 10, name: 'Tenor' },
      { id: 11, name: 'Rate' },
      { id: 12, name: 'Total Interest' },
      { id: 13, name: 'Days In Overdue' },
      { id: 14, name: 'Loan Application Ref' },
      { id: 15, name: 'Fee' },
      { id: 16, name: 'Amortized Balance' },
      { id: 17, name: 'Loan Balance' },
      { id: 18, name: 'Late Repayment Charge' },
      { id: 19, name: 'Interest Recievable' },
      { id: 20, name: 'PD' },
      { id: 21, name: 'Credit Score' },
      { id: 22, name: 'Outstanding Tenor' },
      { id: 23, name: 'EIR' },
      { id: 24, name: 'Collateral(Yes/No)' },
      { id: 25, name: 'Collateral percentage' },
      { id: 26, name: 'Restructured' },
    ];
  }

  ngOnInit() {
    this.getAllCompany();
    this.getFinancialYear();
    this.customerTypes = [
      {
        id: 1,
        name: 'Individual',
      },
      {
        id: 2,
        name: 'Corporate',
      },
    ];
  }

  processReport() {
    this.getAllCompany();
    this.displayProcessReport = true;
  }

  getAllCompany() {
    this.loadingService.show();
    this.companyService.getAllCompanyStructure().subscribe(
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
    return this.financialYearService.getAllFinacialYearByStatus().subscribe(
      (data) => {
        this.financialYear = data.financialYear;
      },
      (err) => {
        return this.loadingService.hide();
      },
      () => {}
    );
  }

  processData(form) {
    if (!this.companyId) {
      swal.fire('GOS FINANCIAL', 'Please select Company', 'error');
      return;
    }
    if (this.reportTitle == 1 || this.reportTitle == 2) {
      if (!this.dateFrom || !this.dateTo) {
        swal.fire('GOS FINANCIAL', 'Please select date range', 'error');
        return;
      }
    }
    const body = {
      companyId: +this.companyId,
      reportTitle: +this.reportTitle,
      customerType: +this.customerType,
      selectedColumn: this.selectedColumn,
      date1: this.formatDate(this.dateFrom),
      date2: this.formatDate(this.dateTo),
      loanId: this.loanId,
    };
    this.loadingService.show();
    this.ReportService.getSummaryloanReport(body).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data != null) {
          if (data.status.isSuccessful) {
            let exceldata = data.export;
            if (exceldata != undefined) {
              let byteString = atob(exceldata);
              let ab = new ArrayBuffer(byteString.length);
              let ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              let bb = new Blob([ab]);
              try {
                let file = new File([bb], 'data.xlsx', {
                  type: 'application/vnd.ms-excel',
                });
                saveAs(file);
              } catch (err) {
                let textFileAsBlob = new Blob([bb], {
                  type: 'application/vnd.ms-excel',
                });
                window.navigator.msSaveBlob(textFileAsBlob, 'data.xlsx');
              }
            }
            swal.fire(
              'GOS FINANCIAL',
              data.status.message.friendlyMessage,
              'success'
            );
          } else {
            swal.fire(
              'GOS FINANCIAL',
              data.status.message.friendlyMessage,
              'error'
            );
          }
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

  getColumnValue(value: any) {
    // if (value == 1) {
    //   this.columns = this.column1
    // }
    if (+value === 2) {
      this.columns = this.column3;
    }
  }

  setCustomerColumn(value: any) {
    if (+this.reportTitle === 1 && +value === 1) {
      this.columns = this.column1;
    }
    if (+this.reportTitle === 1 && +value === 2) {
      this.columns = this.column2;
    }
  }
  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
