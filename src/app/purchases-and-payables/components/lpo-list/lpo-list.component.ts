import { Component, OnInit } from "@angular/core";
import { PurchaseService } from "../../../core/services/purchase.service";
import { LoadingService } from "../../../core/services/loading.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-lpo-list",
  templateUrl: "./lpo-list.component.html",
  styleUrls: ["./lpo-list.component.css"]
})
export class LpoListComponent implements OnInit {
  viewHeight: string = "600px";
  lpos: any[] = [];
  showDialog: boolean;
  paymentTerms: any[] = [];
  checked: any;
  paymentTermsForm: FormGroup;
  bidandTenderId: number;
  cols: any[] = [];
  reportSrc: any;
  displayTestReport: boolean;
  displayReport: boolean = false;
  constructor(
    private purchaseService: PurchaseService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.paymentTermsForm = this.fb.group({
      paymentTermId: [0],
      phase: [''],
      payment: [''],
      projectStatusDescription: [''],
      completion: [''],
      comment: [''],
      bidAndTenderId: [''],
      grossAmount: [''],
      netAmount: [''],
      paymentStatus: [],
      status: ['']
    })
  }

  ngOnInit() {
    this.cols = [
      {
        header: 'lpoNumber',
        field: 'lpoNumber'
      },
      {
        header: 'description',
        field: 'description'
      },
      {
        header: 'requestDate',
        field: 'requestDate'
      },
      {
        header: 'deliveryDate',
        field: 'deliveryDate'
      },
      {
        header: 'grossAmount',
        field: 'grossAmount'
      },
      {
        header: 'amountPayable',
        field: 'amountPayable'
      },
      {
        header: 'jobStatusName',
        field: 'jobStatusName'
      },
    ];
    this.getLpoList();
  }

  // get lpo list
  getLpoList() {
    this.loadingService.show();
    return this.purchaseService.getLpoList().subscribe(
      data => {
        this.loadingService.hide();
        this.lpos = data.lpOs;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  viewDetails(row) {

    this.paymentTerms = row.paymentTerms;
    this.bidandTenderId = parseInt(row.bidAndTenderId);
    this.showDialog = true;
  }

  updatePaymentTerms(paymentTermsForm: FormGroup) {
    const payload = paymentTermsForm.value;
    payload.bidAndTenderId = this.bidandTenderId;
    payload.phase = parseInt(payload.phase);
    payload.payment = parseFloat(payload.payment);
    payload.completion = parseInt(payload.completion);
    payload.status = parseInt(payload.status);
    payload.grossAmount = parseFloat(payload.grossAmount);
    payload.netAmount = parseFloat(payload.netAmount);
    payload.paymentStatus = parseInt(payload.paymentStatus);
    this.loadingService.show();
    return this.purchaseService.updateTerms(payload).subscribe(data => {
      this.loadingService.hide();
      const message = data.status.message.friendlyMessage;
      if (data.status.isSuccessful) {
        swal.fire(`GOS FINANCIAL`, message, 'success').then(() => {
          this.getLpoList();
          paymentTermsForm.reset();
          this.checked = false;
          this.showDialog = false
        });
        this.paymentTerms.push(payload);
      } else {
        swal.fire(`GOS FINANCIAL`, message, 'error')
      }

    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire(`GOS FINANCIAL`, message, 'error')
    })
  }

  viewLpo(plpoId: number) {
    this.router.navigate(['/purchases-and-supplier/lpo'], {
      queryParams: {
        id: plpoId
      }
    })
  }

  sendToApproval(plpoId: any) {
    const payload = {
      lpoId: plpoId
    }
    swal
      .fire({
        title: "Are you sure you want to approve this item?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          this.loadingService.show();
          return this.purchaseService.sendLpotoApproval(payload).subscribe(res => {
            this.loadingService.hide();
            const message = res.status.message.friendlyMessage;
            if (res.status.isSuccessful) {
              swal.fire('GOS FINANCIAL', message, 'success');
              this.getLpoList();
            } else {
              swal.fire(`GOS FINANCIAL`, message, 'error');
            }
          }, err => {
            this.loadingService.hide();
            const message = err.status.message.friendlyMessage;
            swal.fire(`GOS FINANCIAL`, message, 'error')
          })
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  // getLpoReport(id: number) {
  //   // this.loadingService.show();
  //   let path: string = `${environment.report_url}/gos/Reporter/LPO?LPOId=${id}`;
  //   this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
  //     path
  //   );
  //   this.displayTestReport = true;
  // }

  PreviewLPO(lpoid: any) {
    let path: string = "";
    if (!lpoid) {

      this.displayTestReport = false;
      this.displayReport = false;
      swal.fire('GOS FINANCIAL', "Invalid LPO Selected", 'error')
    }
    this.displayTestReport = true;
    this.displayReport = true;
    path = `${environment.report_url}/Reporter/LPO?LPOId=${lpoid}`;
    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    return;
  }
}
