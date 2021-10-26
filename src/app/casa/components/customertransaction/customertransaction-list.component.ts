import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { LoanCustomerService } from "src/app/core/services/loancustomer.service";
import { Router } from "@angular/router";
import { GLTransactionService } from "src/app/core/services/gltransaction.service";

@Component({
  selector: 'app-customertransaction-list',
  templateUrl: './customertransaction-list.component.html'
})
export class CustomertransactionListComponent implements OnInit {

  glTransactionList: any[] = [];
  glTransactionSelected: any[] = [];
   selectedGLTransaction: any = {};
  displayInfo = false;
    viewHeight: any = '600px';
    dateFrom: any;
    dateTo: any;
    cols: any[];
    searchString: any;
  constructor(
      private loadingService: LoadingService,
      private glTransactionService: GLTransactionService,
      private router: Router
  ) {}

  ngOnInit() {
      this.cols = [
          { field: "transCode", header: "transCode" },
          { field: "description", header: "description" },
          { field: "transactionDate", header: "transactionDate"},
          { field: "valueDate", header: "valueDate"},
          { field: "valueDate", header: "valueDate"},
          { field: "amount", header: "amount"},
          { field: "transType", header: "transType"},
          { field: "beneficiary", header: "beneficiary"},
          { field: "firstName", header: "firstName"},
          { field: "secondName", header: "secondName"},
      ];
      // this.getAllGLCustomerTransaction();
  }

  getAllGLCustomerTransaction() {
      this.loadingService.show();
      this.glTransactionService.getAllGLCustomerTransaction().subscribe(data => {
          this.loadingService.hide();
          this.glTransactionList = data["result"];
      });
  }


  getGLCustomerTransaction(transactionId) {
      this.loadingService.show();
      this.glTransactionService.getGLCustomerTransaction(transactionId).subscribe(data => {
          this.loadingService.hide();
          this.glTransactionSelected = data["result"];
      });
  }
  getDepositTransaction() {
      const payload = {
          date1: this.dateFrom,
          date2: this.dateTo,
          searchString: this.searchString
      }
      this.loadingService.show()
      return this.glTransactionService.getDepositTransaction(payload).subscribe(data => {
          this.glTransactionList = data.result;
          this.loadingService.hide()
      }, err => {
          this.loadingService.hide()
      }, () => {})
  }

  onRowSelect(event) {
      if (event.data.transactionId != null) {
          // this.router.navigate([
          //     "/credit/eligibility-check",
          //     event.data.glTransactionId
          // ]);

          this.router.navigate(["/finance/gltransaction-info"], {
              queryParams: { editgltransaction: event.data.transactionId  }
          });

      }
  }
}
