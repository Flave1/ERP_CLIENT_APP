import { Component, OnInit } from '@angular/core';
import {LoadingService} from "../../../core/services/loading.service";
import {PpeService} from "../../services/ppe.service";
import {Router} from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: 'app-reevaluation-list',
  templateUrl: './reevaluation-list.component.html',
  styleUrls: ['./reevaluation-list.component.css']
})
export class ReevaluationListComponent implements OnInit {
  registerList: any[];
  cols: any;
  selectedItem: any[] = [];
  viewHeight: string = "600px";
  displayCostModal: boolean;
  reevaluateList: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private ppeService: PpeService,
    private router: Router
  ) { }

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
    this.getRegisterList()
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
    this.displayCostModal = true
  }

  saveCost(selectedItem: any[]) {
    const payload = [];
    selectedItem.forEach(item => {
      const data = {
        registerId: item.registerId,
        proposedCost: +item.proposedCost
      }
      payload.push(data)
    });
    swal
      .fire({
        title: "Are you sure you want to revalue this item(s)?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      }).then(res => {
      if (res.value) {
          this.loadingService.show();
          return this.ppeService.mulitiReevaluate(payload).subscribe(res => {
            this.loadingService.hide();
            const message = res.status.message.friendlyMessage;
            if (res.status.isSuccessful) {
              swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                this.closeCostModal()
              });
            } else {
              swal.fire('GOS FINANCIAL', message, 'error')
            }
          }, err => {
            this.loadingService.hide();
            const message = err.status.message.friendlyMessage;
            swal.fire('GOS FINANCIAL', message, 'error')
          })
      }
    })
  }

  closeCostModal() {
    this.selectedItem = [];
    this.displayCostModal = false;
  }
}
