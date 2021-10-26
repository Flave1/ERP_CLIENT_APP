import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingService} from '../../../core/services/loading.service';
import {GLService} from '../../../core/services/gl.service';
import {CompanyService} from '../../../core/services/company.service';
import {ActivatedRoute, Router} from '@angular/router';
import swal from "sweetalert2";
import {FinancalYearService} from '../../../core/services/financal-year.service';

@Component({
  selector: 'app-financial-year-setup',
  templateUrl: './financial-year-setup.component.html',
  styleUrls: ['./financial-year-setup.component.css']
})
export class FinancialYearSetupComponent implements OnInit {

    companyInformation: any[] = [];
    form: FormGroup;
    date1: string;
    date2: string;
    formTitle: string = "Add Financial Year Information";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private glService: GLService,
        private companyService: CompanyService,
        private router: Router,
        private route: ActivatedRoute,
        private financialYearService: FinancalYearService
    ) {
        this.form = this.fb.group({
            financialYearId: [0],
            name: ["", Validators.required],
            startDate: ["", Validators.required],
            endDate: ["", Validators.required],
            status: ["", Validators.required]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let glId = params["editfinancialyear"];
            if (glId != null || glId != undefined) {
                this.editFinancialYear(glId);
            }
        });
    }

    getAllCompany() {
        this.loadingService.show();
        this.companyService.getAllCompanyStructure().subscribe(data => {
            this.loadingService.hide();
            this.companyInformation = data.companyStructures;
        }, err => {
            this.loadingService.hide()
        });
    }

    editFinancialYear(financialYearId) {
        this.formTitle = "Edit Financial Year Information";
        this.loadingService.show();
        this.financialYearService.getFinancialYear(financialYearId).subscribe(data => {
            this.loadingService.hide();
            let row = data.financialYear[0];
            this.form = this.fb.group({
                financialYearId: row.financialYearId,
                name: row.name,
                startDate: new Date(row.startDate),
                endDate: new Date(row.endDate),
                status:row.status,
            });
        }, err => {
            this.loadingService.hide();
        });
    }

    onDateSelect(date, type) {
        if (date != null) {
          let d = new Date(Date.parse(date));
          if (type === 1) {
            this.date1 = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            return this.date1;
          }
          if (type === 2) {
            this.date2 = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            return this.date2;
          }
        }
      }

    goBack() {
        this.router.navigate(["/finance/financial-year-list"]);
    }
    submitFinancialYear(formObj) {
        const payload = formObj.value;
        if (!payload.name) {
            return swal.fire("GOS FINANCIAL", 'Name is required', "error");
        }
        if (!payload.startDate) {
            return swal.fire("GOS FINANCIAL", 'Start date is required', "error");
        }
        if (!payload.endDate) {
            return swal.fire("GOS FINANCIAL", 'End date is required', "error");
        }
        if (!payload.status) {
            return swal.fire("GOS FINANCIAL", 'Status is required', "error");
        }
        payload.status = parseInt(payload.status);
        payload.startDate = this.formatDate(payload.startDate);
        payload.endDate = this.formatDate(payload.endDate);
        this.loadingService.show();
        this.financialYearService.updateFinancialYear(payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigateByUrl("/finance/financial-year-list");
                } else {
                    swal.fire("GOS FINANCIAL", message, "error");
                }
            },
            err => {
                this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", message, "error");
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
