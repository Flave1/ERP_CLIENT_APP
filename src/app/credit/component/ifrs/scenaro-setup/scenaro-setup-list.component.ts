import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { IfrsService } from "src/app/core/services/ifrs.service";

@Component({
  selector: 'app-scenaro-setup-list',
  templateUrl: './scenaro-setup-list.component.html'
})
export class ScenaroSetupListComponent implements OnInit {
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
          { field: "scenario", header: "Scenario" },
          { field: "likelihood", header: "Likelihood" }
      ];
      this.getAllSetupData();
  }

  showAddNew() {
      this.router.navigate(["/credit/scenario-setup-data"]);
  }

  getAllSetupData() {
      this.loadingService.show();
      this.ifrsService.getAllIFRSScenarioSetupData().subscribe(data => {
          this.loadingService.hide();
          this.setupDataList = data.ifrsScenarioSetup;
      }, err => {
        this.loadingService.hide();
      });
  }
  editSetupData(row) {
      this.router.navigate(["/credit/scenario-setup-data"], {
          queryParams: { editsetupdata: row.scenarioId }
      });
  }

  rowClicked(row: any): void {}

  deleteSetupData(row) {
      const __this = this;
      swal.fire({
          title: "Are you sure you want to delete this record?",
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      }).then(result => {
          if (result.value) {
              __this.loadingService.show();

              __this.ifrsService
                  .deleteIFRSScenarioSetupData(row.scenarioId)
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
