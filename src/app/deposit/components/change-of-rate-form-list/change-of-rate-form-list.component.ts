import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { DepositAccountOpeningService } from '../../../core/services/depositaccountopening.service';
import { Router } from '@angular/router';
import swal from "sweetalert2";
import { DepositAccountService } from '../../../core/services/depositaccount.service';

@Component({
  selector: 'app-change-of-rate-form-list',
  templateUrl: './change-of-rate-form-list.component.html',
  styleUrls: ['./change-of-rate-form-list.component.css']
})
export class ChangeOfRateFormListComponent implements OnInit {
  depositForm: any[] = [];
  selectedDepositForm: any[];
  DepositForm: any;
  viewHeight: any = "600px";
  constructor(
    private loadingService: LoadingService,
    private DepositFormService: DepositAccountOpeningService,
    private depositService: DepositAccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getChangeOfrate();
  }

  showAddNew() {
    this.router.navigateByUrl("/deposit/changeofrateform");
  }

  getChangeOfrate() {
    this.loadingService.show();
    this.depositService.getChangeOfrates().subscribe(data => {
      this.loadingService.hide();
      this.depositForm = data.changeOfRates;

    }, err => {
      this.loadingService.hide()
    });
  }


  editChangeOfRate(row) {
    this.router.navigate(["/deposit/changeofrateform"], {
      queryParams: { ChangeOfRateId: row.changeOfRateId }
    });
  }

  deleteDetails(formObj) {
    this.loadingService.show();
    let body = { itemIds: formObj };

    this.depositService.deleteDepositRateChange(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.deleted) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getChangeOfrate();
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }

  multipleDelete() {
    let tempData = this.selectedDepositForm;
    const selectedItems: Array<any> = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        selectedItems.push(el.changeOfRateId);
      });
      swal.fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      }).then(result => {
        if (result.value) {
          this.loadingService.show();
          this.deleteDetails(selectedItems);
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
    }
  }
}
