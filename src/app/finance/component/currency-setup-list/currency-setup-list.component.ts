import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {GLService} from '../../../core/services/gl.service';
import {Router} from '@angular/router';
import {FinancalYearService} from '../../../core/services/financal-year.service';
import swal from "sweetalert2";
import {CurrencyRateService} from '../../../core/services/currencyrate.service';

@Component({
  selector: 'app-currency-setup-list',
  templateUrl: './currency-setup-list.component.html',
  styleUrls: ['./currency-setup-list.component.css']
})
export class CurrencySetupListComponent implements OnInit {

    currencyInformation: any[] = [];
    @ViewChild('fileInput') fileInput: any;
    selectedcurrencyInformation: any[];
    private fileToUpload: File;
    viewHeight: any = '600px';
    currencyRates: any[] = [];
    constructor(
        private loadingService: LoadingService,
        private glService: GLService,
        private router: Router,
        private financialYearService: FinancalYearService,
        private currencyService: CurrencyRateService
    ) {}

    ngOnInit() {
        this.getAllFinancialYear();

    }

    showAddNew() {
        this.router.navigateByUrl("/finance/currency-setup");
    }

    getAllFinancialYear() {
        this.loadingService.show();
        this.financialYearService.getAllFinacialYear().subscribe(data => {
            this.loadingService.hide();
            this.currencyInformation = data.financialYear;

        }, err => {
            this.loadingService.hide()
        }, () => {});
    }
    getCurrencies() {
        this.currencyService.getAllCurrencyRate().subscribe(data => {
            this.currencyRates = data.result
        }, err => {
            return err
        })
    }
    editCurrency(row) {
        this.router.navigate(["/finance/currency-setup"], {
            queryParams: { editcurrency: row.financialYearId }
        });
    }

    rowClicked(row: any): void {

    }

    deleteGL(row) {
        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete user?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.glService
                    .deleteGL(row.glId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllFinancialYear();
                        } else {
                            swal.fire(
                                "GOS FINANCIAL",
                                "Record not deleted",
                                "error"
                            );
                        }
                    });
            } else {
                swal.fire("GOS FINANCIAL", "Cancelled", "error");
            }
        });
    }

    multipleDelete() {
        if (this.selectedcurrencyInformation.length === 0) {
            swal.fire(
                'GOS FINANCIAL',
                'Please select records you want to delete',
                'error'
            );
            return;
        }
        const tempData = this.selectedcurrencyInformation;
        const targetIds = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                const data = {
                    targetId: el.financialYearId
                };
                targetIds.push(data);
            });
        }
        const body = {
            targetIds: targetIds
        };
        const __this = this;
        swal.fire({
            title: 'Are you sure you want to delete record?',
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.financialYearService
                    .multipleDeleteMethod(body)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data['result'] == true) {
                            swal.fire(
                                'GOS FINANCIAL',
                                'Record deleted successful.',
                                'success'
                            );
                            __this.getAllFinancialYear();
                        } else {
                            swal.fire(
                                'GOS FINANCIAL',
                                'Record not deleted',
                                'error'
                            );
                        }
                    });
            } else {
                swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
            }
        });
    }

}
