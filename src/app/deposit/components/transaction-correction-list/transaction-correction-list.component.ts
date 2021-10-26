import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { Router } from '@angular/router';
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import swal from "sweetalert2";

@Component({
    selector: 'app-transaction-correction-list',
    templateUrl: './transaction-correction-list.component.html',
    styleUrls: ['./transaction-correction-list.component.css']
})
export class TransactionCorrectionListComponent implements OnInit {

    transactionsDetails: any[] = [];
    selectedtransactionsDetails: any[];
    viewHeight: any = '600px';
    cols: any[];
    constructor(
        private loadingService: LoadingService,
        private DepositAccountService: DepositAccountService,
        private router: Router
    ) { }

    ngOnInit() {

        this.getTransactionDetails();
        this.cols = [
            { field: "name", header: "name" },
            { field: "fixedOrPercentage", header: "fixedOrPercentage" },
            { field: "amount_Percentage", header: "amount_Percentage" },
            { field: "description", header: "description" },
        ];
    }

    showAddNew() {
        this.router.navigate(["/deposit/transactioncorrection"]);
    }

    getTransactionDetails() {
        this.loadingService.show();
        this.DepositAccountService.getTransactionCorrections().subscribe(data => {
            this.loadingService.hide();
            this.transactionsDetails = data["result"];
        }, err => {
            this.loadingService.hide()
        });
    }
    editTransactionsDetails(row) {
        this.router.navigate(["/deposit/transactioncorrection"], {
            queryParams: { id: row.transactionCorrectionId }
        });
    }

    submittransactionsDetails(formObj) {
        this.loadingService.show();
        let body = { setup: formObj };
        this.DepositAccountService.deleteTransactionCorrection(
            body
        ).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] == true) {
                    swal.fire("GOSFINANCIAL", data["message"], "success");
                    this.getTransactionDetails();
                } else {
                    swal.fire("GOSFINANCIAL", data["message"], "error");
                }
            },
            err => {
                this.loadingService.hide();
                swal.fire("GOSFINANCIAL", JSON.stringify(err), "error");
            }
        );
    }

    multipleDelete() {
        if (this.selectedtransactionsDetails.length == 0) {
            return swal.fire(
                "GOS FINANCIAL",
                "Please select records you want to delete",
                "error"
            );
        }
        let tempData = this.selectedtransactionsDetails;
        const selectedItems = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                let data = {
                    setupId: el.transactionCorrectionId
                };
                selectedItems.push(data);
            });
            const __this = this;
            swal.fire({
                title: "Are you sure you want to delete record?",
              text: "You won't be able to revert this",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes!"
            }).then(result => {
                if (result.value) {
                    this.submittransactionsDetails(selectedItems);
                } else {
                    swal.fire("GOS FINANCIAL", "Cancelled", "error");
                }
            });
            // this.submittransactionsDetails(this.transactionsDetails);
        }
    }

}
