import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { IfrsService } from "src/app/core/services/ifrs.service";

@Component({
    selector: "app-setup-data-list",
    templateUrl: "./setup-data-list.component.html"
})
export class SetupDataListComponent implements OnInit {
    cols: any[];
    setupDataList: any[] = [];
    selectedSetup: any[];
    viewHeight: any = '600px';

    constructor(
        private loadingService: LoadingService,
        private ifrsService: IfrsService,
        private router: Router
    ) {}

    ngOnInit() {
        this.cols = [
            { field: "runDate", header: "Run Date" },
            { field: "threshold", header: "Threshold" },
            { field: "groupBased", header: "Group Based" },
            { field: "pdBasis", header: "PD Basis" }
        ];
        this.getAllSetupData();
    }

    showAddNew() {
        this.router.navigate(["/credit/setup-data"]);
    }

    getAllSetupData() {
        this.loadingService.show();
        this.ifrsService.getAllIFRSSetupData().subscribe(data => {
            this.loadingService.hide();
            this.setupDataList = data.setUpData;
        }, err => {
          this.loadingService.hide()
        });
    }
    editSetupData(row) {
        this.router.navigate(["/credit/setup-data"], {
            queryParams: { editsetupdata: row.setUpId }
        });
    }

    rowClicked(row: any): void {}

    deleteSetupData(row) {
        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete this record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.ifrsService
                    .deleteIFRSSetupData(row.setUpId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "Record deleted successful.",
                                "success"
                            );
                            __this.getAllSetupData();
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
