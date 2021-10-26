import { Component, OnInit } from "@angular/core";
import { PurchaseService } from "../../../core/services/purchase.service";
import { LoadingService } from "../../../core/services/loading.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-invoice-list",
  templateUrl: "./invoice-list.component.html",
  styleUrls: ["./invoice-list.component.css"]
})
export class InvoiceListComponent implements OnInit {
  invoiceList: any[] = [];
  viewHeight: string = "600px";
  cols: any[] = [];
  constructor(
    private purchasesService: PurchaseService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: "supplier",
        field: "supplier"
      },
      {
        header: "lpoNumber",
        field: "lpoNumber"
      },
      {
        header: "invoiceNumber",
        field: "invoiceNumber"
      },
      {
        header: "location",
        field: "location"
      },
      {
        header: "expectedDeliveryDate",
        field: "expectedDeliveryDate"
      },
      {
        header: "descriptionOfRequest",
        field: "descriptionOfRequest"
      },
      {
        header: "amountPayable",
        field: "amountPayable"
      },
      {
        header: "amount",
        field: "amount"
      },
      {
        header: "amountPaid",
        field: "amountPaid"
      }
    ];
    this.getInvoiceList();
  }

  // get invoice lists
  getInvoiceList() {
    this.loadingService.show();
    return this.purchasesService.getInvoiceLists().subscribe(
      data => {
        this.loadingService.hide();
        this.invoiceList = data.invoices;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  viewDetail(invoiceId: any) {
    this.router.navigate(["/purchases-and-supplier/invoice-detail"], {
      queryParams: {
        id: invoiceId
      }
    });
  }
}
