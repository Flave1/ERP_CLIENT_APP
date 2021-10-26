import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { BranchService } from "src/app/core/services/branch.service";

@Component({
    selector: "app-branch-list",
    templateUrl: "./branch-list.component.html"
})
export class BranchListComponent implements OnInit {
    branchInformation: any[] = [];
    selectedbranchInformation: any[];
    constructor(
        private loadingService: LoadingService,
        private branchService: BranchService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getAllBranch();
    }

    showAddNew() {
        this.router.navigate(["/setup/branch"]);
    }

    getAllBranch() {
        this.loadingService.show();
        this.branchService.getAllBranch().subscribe(data => {
            this.loadingService.hide();
            this.branchInformation = data["result"];

        });
    }
    editBranch(row) {
        this.router.navigate(["/setup/branch"], {
            queryParams: { editbranch: row.branchId }
        });
    }
    deleteBranch(row) {
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

                __this.branchService
                    .deleteBranch(row.branchId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getAllBranch();
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
