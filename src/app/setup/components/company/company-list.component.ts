import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { CompanyService } from "src/app/core/services/company.service";

@Component({
    selector: "app-company-list",
    templateUrl: "./company-list.component.html"
})
export class CompanyListComponent implements OnInit {
    companyInformation: any[] = [];
    selectedcompanyInformation: any[];
    constructor(
        private loadingService: LoadingService,
        private companyService: CompanyService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getAllCompany();
    }

    showAddNew() {
        this.router.navigate(["/setup/company"]);
    }

    getAllCompany() {
        this.loadingService.show();
        this.companyService.getAllCompany().subscribe(data => {
            this.loadingService.hide();
            this.companyInformation = data["result"];

        });
    }
    editCompany(row) {
        this.router.navigate(["/setup/company"], {
            queryParams: { id: row.companyId }
        });
    }
    deleteCompany(row) {
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

                __this.companyService
                    .deleteCompany(row.companyId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllCompany();
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
