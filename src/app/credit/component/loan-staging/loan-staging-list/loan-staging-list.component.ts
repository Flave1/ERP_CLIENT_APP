import { Component, OnInit } from "@angular/core";
import { LoanstagingService } from "src/app/core/services/loanstaging.service";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-loan-staging-list",
  templateUrl: "./loan-staging-list.component.html"
})
export class LoanStagingListComponent implements OnInit {
  selectedLoanStaging: any[] = [];
  loanStagings: any[] = [];
  cols: any[];
  viewHeight: any = "600px";
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private loanStagingService: LoanstagingService
  ) {}
  ngOnInit() {
    this.cols = [
      { field: "probationPeriod", header: "probationPeriod" },
      { field: "from", header: "from" },
      { field: "to", header: "to" }
    ];
    this.getAllLoanStagings();
  }
  getAllLoanStagings() {
    this.loadingService.show();
    return this.loanStagingService.getAllLoanStaging().subscribe(
      data => {
        this.loadingService.hide();
        this.loanStagings = data.loanStagings;
      },
      err => {
        this.loadingService.hide();
        // swal.fire("GOS FINANCIAL", "Please connect to internet service", "error");
      }
    );
  }

  deleteListOfLoanStaging() {
    if (
      this.selectedLoanStaging == null ||
      this.selectedLoanStaging.length == 0
    ) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }

    let ids: number[] = [];
    this.selectedLoanStaging.forEach(element => {
      ids.push(element.loanStagingId);
    });
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          this.loadingService.show();
          let body = {loanStagingIds: ids};
          this.loanStagingService.deleteListLoanStaging(body).subscribe(
            data => {
              this.loadingService.hide();
              if (data.status.isSuccessful == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  `Loan Staging deleted successfully.`,
                  "success"
                );
                this.getAllLoanStagings();
              } else {
                swal.fire("GOS FINANCIAL", `Record not deleted`, "error");
              }
              this.selectedLoanStaging = [];
            },
            err => {
              this.loadingService.hide();
            }
          );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
        this.selectedLoanStaging == [];
      });
  }

  deleteLoanStaging(row: any) {
    let loanStagingProbationingPeriod: string = "";
    loanStagingProbationingPeriod = row.probationingPeriod;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          this.loadingService.show();
          this.loanStagingService
            .deleteLoanStaging(row.loanStagingId)
            .subscribe(data => {
              this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  `Loan Staging deleted successfully.`,
                  "success"
                );
                this.getAllLoanStagings();
              } else {
                swal.fire("LOAN STAGING", `Record not deleted`, "error");
              }
            });
        } else {
          swal.fire("LOAN STAGING", "Cancelled", "error");
        }
      });
  }

  rowClicked(row?: any) {}

  editLoanStaging(row?: any): void {
    this.router.navigate(["/credit/loan-staging-update"], {
      queryParams: { id: row.loanStagingId }
    });
  }

  addOrUpdateLoanStaging() {
    this.router.navigateByUrl("/credit/loan-staging-update");
  }
}
