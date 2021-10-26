import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingService} from '../../../core/services/loading.service';
import {TrialBalanceService} from '../../../core/services/trialbalance.service';
import {CompanyService} from '../../../core/services/company.service';
import {Router} from '@angular/router';
import {FinancalYearService} from '../../../core/services/financal-year.service';
import swal from "sweetalert2";
import { saveAs} from "file-saver"
import {ReportService} from '../../../core/services/report.service';
import {DomSanitizer} from '@angular/platform-browser';
import {JwtService} from '../../../core/services/jwt.service';
import { GLTransactionService } from 'src/app/core/services/gltransaction.service';

@Component({
  selector: 'app-excel-report',
  templateUrl: './excel-report.component.html',
  styleUrls: ['./excel-report.component.css']
})
export class ExcelReportComponent implements OnInit {

  cols: any[];
  fileToUpload: File;
  viewHeight: any = '600px';
  trialBalanceInformation: any[] = [];
  companyInformation: any[] = [];
  selectedtrialBalanceInformation: any[];
  displayProcessReport = false;
  form: FormGroup;
  rDate: any;
  cDate: any;
  tDate: any;
  companyId: any = '0';
  reportFormat: any;
  sub: any;
  financialYear: any[] = [];
  reportMode: any = 0;
  displayTestReport: boolean;
  reportSrc: any;
  staffId: number;
  constructor(
      public fb: FormBuilder,
      private loadingService: LoadingService,
      private companyService: CompanyService,
      private reportService: GLTransactionService,
      private sanitizer: DomSanitizer,
      private jwtService: JwtService,
  ) {
      this.form = this.fb.group({
          trialBalanceId: [0],
          companyId: ["", Validators.required],
          companyCode: ["", Validators.required],
          runDate: ["", Validators.required],
      });
  }

  ngOnInit() {
    this.staffId = this.jwtService.getUserDetails().staffId;
      // this.getAllTrialBalance();
      this.getAllCompany();
  }

  processReport(){
      this.getAllCompany();
      this.displayProcessReport = true;
  }


  getAllCompany() {
      this.loadingService.show();
      this.companyService.getAllCompanyStructure().subscribe(data => {
          this.loadingService.hide();
          this.companyInformation = data.companyStructures;
      }, err => {
        this.loadingService.hide();
      });
  }


  processData() {
      if (!this.companyId) {
          swal.fire("GOS FINANCIAL", "Please select Company", "error");
          return;
      }
      if (!this.rDate) {
          swal.fire("GOS FINANCIAL", "Please select Report Date", "error");
          return;
      }
      if (!this.cDate) {
          swal.fire("GOS FINANCIAL", "Please select Comparative Date", "error");
          return;
      }
      if (!this.tDate) {
        swal.fire("GOS FINANCIAL", "Please select Transistion Date", "error");
        return;
    }

      const body = {
          comp: parseInt(this.companyId),
          rDate: this.formatDate(this.rDate),
          cDate: this.formatDate(this.cDate),
          tDate: this.formatDate(this.tDate),
          reportFormat: parseInt(this.reportFormat),
          reportMode: parseInt(this.reportMode)
      };
      let path: string = "";
      this.loadingService.show();
      this.reportService.fsTemplateReport(body).subscribe(
        response => {
              this.loadingService.hide();
              if (response.status.isSuccessful) {
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
                      var file = new File([bb], "fsTemplate.xlsx", {
                        type: "application/vnd.ms-excel"
                      });
                      saveAs(file);
                    } catch (err) {
                      var textFileAsBlob = new Blob([bb], {
                        type: "application/vnd.ms-excel"
                      });
                      window.navigator.msSaveBlob(textFileAsBlob, "fsTemplate.xlsx");
                    }
                  }
              } else {
                this.loadingService.hide();
                  swal.fire("GOS FINANCIAL", response.status.message.friendlyMessage, "error");
              }
          },
          err => {
              this.loadingService.hide();
              swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
          }
      );
  }

  formatDate(date) {
    let dateObj = new Date(date),
      month = '' + (dateObj.getMonth() + 1),
      day = '' + dateObj.getDate(),
      year = '' + dateObj.getFullYear();

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }

}
