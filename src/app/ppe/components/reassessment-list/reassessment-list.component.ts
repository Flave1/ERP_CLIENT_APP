import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../../../core/services/loading.service";
import { PpeService } from "../../services/ppe.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-reassessment-list",
  templateUrl: "./reassessment-list.component.html",
  styleUrls: ["./reassessment-list.component.css"]
})
export class ReassessmentListComponent implements OnInit {
  registerList: any[];
  cols: any;
  selectedItem: any[] = [];
  viewHeight: string = "600px";
  displayReassessment: boolean;
  reassessmentList: any[] = [];
  reassessmentResidualList: any[] = [];
  displayReassessResidual: any;
  displayCostModal: boolean;
  reevaluateList: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private ppeService: PpeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: "assetNumber",
        field: "assetNumber"
      },
      {
        header: "description",
        field: "description"
      },
      {
        header: "cost",
        field: "cost"
      },
      {
        header: "netBookValue",
        field: "netBookValue"
      }
    ];
    this.getRegisterList();
  }

  getRegisterList() {
    this.loadingService.show();
    return this.ppeService.getRegisterList().subscribe(
      data => {
        this.loadingService.hide();
        this.registerList = data.registers;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  ReassessUsefulLife() {
    if (this.selectedItem.length === 0) {
      return swal.fire("GOS FINANCIAL", "Please select items to reassess", "error");
    }
    this.displayReassessment = true;
    this.reassessmentList = this.selectedItem;
  }

  ReassessResidualValue() {
    if (this.selectedItem.length === 0) {
      return swal.fire("GOS FINANCIAL", "Please select items to reassess", "error");
    }
    this.displayReassessResidual = true;
    this.reassessmentResidualList = this.selectedItem;
  }

  editItem(x) {}

  reassessUsefulLife(x) {
    this.router.navigate(["/ppe/reassess-useful-life"], {
      queryParams: {
        id: x.registerId
      }
    });
  }

  reassessResidualValue(x) {
    this.router.navigate(["/ppe/reassess-residual-value"], {
      queryParams: {
        id: x.registerId
      }
    });
  }

  closeReassessUsefulLife() {
    this.displayReassessment = false;
    this.selectedItem = [];
  }

  saveUsefulLife(selectedItem) {
    const payload = [];
    selectedItem.forEach(item => {
      const data = {
        registerId: item.registerId,
        proposedUsefulLife: +item.proposedUsefulLife
      };
      payload.push(data);
    });
          this.loadingService.show();
          return this.ppeService.multiReassessUsefulLife(payload).subscribe(
            res => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.selectedItem = [];
                this.displayReassessment = false;
                this.getRegisterList();
              } else {
                swal.fire(`GOS FINANCIAL`, message, "error");
              }
            },
            err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire(`GOS FINANCIAL`, message, "error");
            }
          );
  }

  saveResidual(selectedItem: any[]) {
    const payload = [];
    selectedItem.forEach(item => {
      const data = {
        registerId: item.registerId,
        proposedResidualValue: +item.proposedResidualValue
      };
      payload.push(data);
    });
          this.loadingService.show();
          return this.ppeService.multiReassessResidualValue(payload).subscribe(
            res => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.getRegisterList();
                this.selectedItem = [];
                this.displayReassessResidual = false;
              } else {
                swal.fire(`GOS FINANCIAL`, message, "error");
              }
            },
            err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire(`GOS FINANCIAL`, message, "error");
            }
          );
  }

  closeReassessResidual() {
    this.selectedItem = [];
    this.displayReassessResidual = false;
  }

  reevaluateCost(x) {
    this.router.navigate(["/ppe/reevalute-cost"], {
      queryParams: {
        id: x.registerId
      }
    });
  }

  multiReevaluateCost() {
    if (this.selectedItem.length === 0) {
      return swal.fire("GOS FINANCIAL", "Please select items to reevaluate", "error");
    }
    this.reevaluateList = this.selectedItem;
    this.displayCostModal = true;
  }

  saveCost(selectedItem: any[]) {
    const payload = [];
    selectedItem.forEach(item => {
      const data = {
        reassessmentId: item.registerId,
        proposedCost: +item.proposedCost
      };
      payload.push(data);
    });
    swal
      .fire({
        title: "Are you sure you want to reassess this item(s)?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(res => {
        if (res.value) {
        }
      });
  }

  closeCostModal() {
    this.selectedItem = [];
    this.displayCostModal = false;
  }

  validateInput(value: any, row: any, index: number) {
    if (value > row.cost) {
      return swal.fire(
        "GOS FINANCIAL",
        "Proposed cost cannot be greater than item cost",
        "error"
      );
    }
  }
}
