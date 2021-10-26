import { Component, OnInit } from '@angular/core';
import {PurchaseService} from "../../../core/services/purchase.service";
import {LoadingService} from "../../../core/services/loading.service";
import swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.css']
})
export class BidsComponent implements OnInit {
  bids: any[] = [];
  displayApproval: boolean;
  viewHeight: string = '600px';
  activeIndex: number = 0;
  selectedTab: boolean;
  bidAndTenderId: number;
  supplierId: number;
  cols: any[] = [];
  constructor(
    private purchaseService: PurchaseService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cols = [
      {
        header: 'supplierName',
        field: 'supplierName',
      },
      {
        header: 'lpOnumber',
        field: 'lpOnumber'
      },
      {
        header: 'requestingDepartmentName',
        field: 'requestingDepartmentName'
      },
      {
        header: 'descriptionOfRequest',
        field: 'descriptionOfRequest'
      },
      {
        header: 'requestDate',
        field: 'requestDate'
      }
      ,
      {
        header: 'statusName',
        field: 'statusName'
      }
    ]
    this.getBidsForApproval()
  }

  getBidsForApproval() {
    this.loadingService.show();
    return this.purchaseService.getAllBidsForApproval().subscribe(data => {
      this.bids = data.bidAndTenders;
      this.loadingService.hide()
    }, err => {
      this.loadingService.hide()
    })
  }

  sendForApproval(id) {
    if (id) {
      swal.fire({
        title: "Are you sure you want to send this for approval?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      }).then(res => {
        if (res.value) {
          this.loadingService.show();
          return this.purchaseService.sendBidForApproval(id).subscribe(res => {
            this.loadingService.hide();
            const message = res.status.message.friendlyMessage;
            if (res.status.isSuccessful) {
              swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                this.getBidsForApproval()
              })
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
  }

  viewDetail(item: any) {
    this.bidAndTenderId = item.bidAndTenderId;
    this.supplierId = item.supplierId
    this.activeIndex = 1
    this.selectedTab = true;

    this.router.navigate(['/purchases-and-supplier/bid'], {
      queryParams: {
        id: item.bidAndTenderId,
        supplierId: item.supplierId
      }
    })
  }

  addBid() {
    this.router.navigateByUrl('/purchases-and-supplier/bid-tender')
  }

  tabChange(event: any) {
    this.activeIndex = event.index
  }
}
