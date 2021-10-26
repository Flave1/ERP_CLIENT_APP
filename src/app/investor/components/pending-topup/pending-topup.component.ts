import { Component, OnInit } from "@angular/core";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { Router } from "@angular/router";
import { LoadingService } from "../../../core/services/loading.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";

@Component({
  selector: 'app-pending-topup',
  templateUrl: './pending-topup.component.html',
  styleUrls: ['./pending-topup.component.css']
})
export class PendingTopupComponent implements OnInit {

  investments: any[] = [];
  cols: any[];
  selectedInvestment: any;
  viewHeight: string;
  displayTopUp: boolean = false;
  topForm: FormGroup;
  investorFundId: any;

  constructor(
    private investorFundService: InvestorFundService,
    private router: Router,
    private loadingService: LoadingService,
    public fb: FormBuilder,
  ) {
    this.topForm = this.fb.group({
      investorFundId: 0,
      proposedAmount: ["", Validators.required],
      investorFundIdWebsiteTopupId: 0
    });
  }

  ngOnInit() {
    this.getPendingTopUp();
  }
  getPendingTopUp() {
    this.loadingService.show();
    return this.investorFundService.getPendingCustomerTopUp().subscribe(
      data => {
        this.loadingService.hide();
        this.investments = data.topUp;
      },
      err => {
        this.loadingService.hide();

      }
    );
  }

  topup(x) {
    this.topForm.get("proposedAmount").setValue(x.topUpAmount);
    this.topForm.get("investorFundIdWebsiteTopupId").setValue(x.investorFundIdWebsiteTopupId);
    this.displayTopUp = true;
    this.investorFundId = x.investorFundId;
}

submitTopUp(formValue) {
    const payload = formValue.value;
    payload.proposedAmount = parseFloat(payload.proposedAmount);
    payload.investorFundId = parseInt(this.investorFundId);
    payload.investorFundIdWebsiteTopupId = parseInt(payload.investorFundIdWebsiteTopupId);

    swal
      .fire({
        title: "Are you sure you want to top up?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(res => {
        if (res.value) {
          this.loadingService.show();
          this.investorFundService.updateTopUp(payload).subscribe(
            data => {
              this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                  this.getPendingTopUp();
                this.displayTopUp = false;
                swal.fire("GOS FINANCIAL", message, "success");
              } else {
                this.displayTopUp = false;
                swal.fire("GOS FINANCIAL", message, "error");
              }
            },
            err => {
                this.displayTopUp = false;
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOS FINANCIAL", message, "error");
            },
            () => {}
          );
        } else {
          return swal.fire("GOS FINANCIALS", "Cancelled", "error");
        }
      });
}
}
