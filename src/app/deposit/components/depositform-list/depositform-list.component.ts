import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FeeService } from "src/app/core/services/fee.service";

@Component({
    selector: "app-depositform-list",
    templateUrl: "./depositform-list.component.html"
})
export class DepositformListComponent implements OnInit {
    DepositForm: any[] = [];
    selectedDepositForm: any[];
    viewHeight: any = "600px";
    formTitle: string;
    url: string;
    cols: any[];
    constructor(
        private loadingService: LoadingService,
        private feeService: FeeService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.url = this.router.url;
        if (this.url.includes("/loan-management/loan-repayment")) {
            this.formTitle = "Loan Repayment List";
        } else {
            this.formTitle = "Deposit Form List";
        }
        this.getAllDepositForm();
        this.cols = [
            { field: "acountName", header: "Account Name" },
            { field: "accountNumber", header: "Account Number" },
            { field: "amount", header: "Amount Deposited" },
            { field: "transactionDate", header: "Transaction Date" }
        ];
    }

    showAddNew() {
        if (this.url.includes("/loan-management/loan-repayment")) {
            this.router.navigate(["/loan-management/add-loan-repayment"]);
        } else {
            this.router.navigate(["/deposit/depositform"]);
        }
    }

    getAllDepositForm() {
        this.loadingService.show();
        this.feeService.getAllDepositForm().subscribe(data => {
            this.loadingService.hide();
            this.DepositForm = data.depositForm;
        }, err => {
          this.loadingService.hide()
        });
    }
    editDepositForm(row) {
        this.router.navigate(["/deposit/depositform"], {
            queryParams: { editDepositForm: row.depositFormId }
        });
    }

    // submitDepositForm(formObj) {
    //     this.loadingService.show();
    //     let body = {itemIds: formObj};
    //     this.DepositFormService.deleteMultipleDepositForm(body).subscribe(
    //         data => {
    //             this.loadingService.hide();
    //             if (data.status.isSuccessful == true) {
    //                 swal.fire("GOSFINANCIAL", data.status.message.friendlyMessage, "success");
    //                 this.getAllDepositForm();
    //             } else {
    //                 swal.fire("GOSFINANCIAL", data.status.message.friendlyMessage, "error");
    //             }
    //         },
    //         err => {
    //             this.loadingService.hide();
    //             swal.fire("GOSFINANCIAL", JSON.stringify(err), "error");
    //         }
    //     );
    // }

    multipleDelete() {
        let tempData = this.selectedDepositForm;
       const selectedItems = [];
        if (tempData !== undefined) {
            tempData.forEach(el => {
                let data = el.depositFormId;
                selectedItems.push(data);
            });
            //this.submitDepositForm(selectedItems);
        }
    }
}
