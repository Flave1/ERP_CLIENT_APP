import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { Router } from "@angular/router";

@Component({
    selector: "app-credit-risk-category-list",
    templateUrl: "./credit-risk-category-list.component.html"
})
export class CreditRiskCategoryListComponent implements OnInit {
    categories: any[] = [];
    selectedCategories: any[];
    cols: any[];
    viewHeight: any = '600px';
    constructor(
        private loadingService: LoadingService,
        private creditService: CreditRiskScoreCardService,
        private router: Router
    ) {}

    ngOnInit() {
        this.cols = [
            { field: "categoryName", header: "categoryName" },
            { field: "description", header: "description" }
        ];
        this.getAllCategory();
    }

    showAddNew() {
        this.router.navigate(["/credit/category"]);
    }

    getAllCategory() {
        this.loadingService.show();
        this.creditService.getAllCreditRiskCategory().subscribe(data => {
            this.loadingService.hide();
            this.categories = data.creditRiskCategory;
        }, err => {
          this.loadingService.hide()
        });
    }
    editCategory(row) {
        this.router.navigate(["/credit/category"], {
            queryParams: { id: row.categoryId }
        });
    }
    onRowSelect(event) {
        this.router.navigate(["/credit/category"], {
            queryParams: { id: event.data.categoryId }
        });
    }

    deleteCategory(row) {
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

                __this.creditService
                    .deleteCreditRiskCategory(row.categoryId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllCategory();
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
