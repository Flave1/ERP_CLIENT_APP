import { Component, OnInit, OnDestroy } from "@angular/core";
import { LoadingService } from "../../../core/services/loading.service";
import { SupplierService } from "../../../core/services/supplier.service";
import { Subscription } from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: "app-pending-suppliers",
  templateUrl: "./pending-suppliers.component.html",
  styleUrls: ["./pending-suppliers.component.css"]
})
export class PendingSuppliersComponent implements OnInit, OnDestroy {
  suppliers: any[] = [];
  viewHeight: string = "600px";
  cols: any[] = [];
  selectedSupplierInformation: any;
  pendingSuppliers: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'supplierTypeName',
        field: 'supplierTypeName'
      },
      {
        header: 'name',
        field: 'name'
      },
      {
        header: 'supplierNumber',
        field: 'supplierNumber'
      },
      {
        header: 'createdOn',
        field: 'createdOn'
      },
      {
        header: 'email',
        field: 'email'
      },
      {
        header: 'phoneNo',
        field: 'phoneNo'
      },
      {
        header: 'statusName',
        field: 'statusName'
      },
    ];
    this.getPendingSuppliers();
  }
  getPendingSuppliers(): Subscription {
    this.loadingService.show();
    return this.supplierService.getPendingSuppliers().subscribe(
      data => {
        this.loadingService.hide();
        this.suppliers = data.suppliers;
        this.pendingSuppliers = this.suppliers.filter(item => {
          return item.approvalStatusId == 0
        })
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  ngOnDestroy(): void {
    // this.getPendingSuppliers().unsubscribe();
  }

  editSupplier(item) {
    this.router.navigate(["/purchases-and-supplier/supplier-info"], {
      queryParams: { id: item.supplierId }
    });
  }

  sendForApproval(supplierId: number) {}
}
