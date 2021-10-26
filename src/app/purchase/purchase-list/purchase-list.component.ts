import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PurchaseService } from "src/app/core/services/purchase.service";
import { LoadingService } from "src/app/core/services/loading.service";

@Component({
    selector: "app-purchase-list",
    templateUrl: "./purchase-list.component.html"
})
export class PurchaseListComponent implements OnInit {
    purchaseInformation: any[];
    selectedPurchaseInformation: any = {};
    constructor(
        private purchaseService: PurchaseService,
        private loadingService: LoadingService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getAllPurchase();
    }
    getAllPurchase() {
        this.loadingService.show();
        this.purchaseService.getAllPurchase().subscribe(data => {
            this.loadingService.hide();
            this.purchaseInformation = data["result"];
        });
    }
    showAddNew() {
        this.router.navigate(["/purchase/purchase-info"]);
    }

    deletePurchase() {}

    editPurchase(row) {

        this.router.navigate(["/purchase/purchase-info"], {
            queryParams: { editpurchaseinfo: row.plpoid }
        });
    }
    deleteSupplier(row) {
        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.purchaseService
                    .deletePurchase(row.plpoId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllPurchase();
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
}
