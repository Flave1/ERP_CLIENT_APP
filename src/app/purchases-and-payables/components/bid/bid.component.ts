import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import { PurchaseService } from "../../../core/services/purchase.service";
import { LoadingService } from "../../../core/services/loading.service";
import {ActivatedRoute, Router} from "@angular/router";
import { SupplierService } from "../../../core/services/supplier.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import swal from "sweetalert2";
import { saveAs } from "file-saver";

@Component({
  selector: "app-bid",
  templateUrl: "./bid.component.html",
  styleUrls: ["./bid.component.css"]
})
export class BidComponent implements OnInit, OnDestroy {
  id: number;
  supplierDetails: any = {};
  prnDetail: any[] = [];
  viewHeight: string = "600px";
  bidDetails: any = {};
  paymentTerms: any[] = [];
  proposedPaymentTerms: any[] = [];
  checked: boolean;
  showDialog: boolean;
  paymentTermsForm: FormGroup;
  index: number = null;
  sum: any;
  proposedAmt: number;
  phases: any[] = [];
  totalAmt: number
  allPhases = [
    { id: "1", name: "Phase 1" },
    { id: "2", name: "Phase 2" },
    { id: "3", name: "Phase 3" },
    { id: "4", name: "Phase 4" },
    { id: "5", name: "Phase 5" },
    { id: "6", name: "Phase 6" },
    { id: "7", name: "Phase 7" },
    { id: "8", name: "Phase 8" },
    { id: "9", name: "Phase 9" },
    { id: "10", name: "Phase 10" },
    { id: "11", name: "Above 10" }
  ];
  _bidId: number;
  totalAmount: number;
  _supplierId: number;
  get bidId(): number {
    return this._bidId
  }
  @Input() set bidId(value: number) {
    this._bidId = value
    if (value) {
      this.getBid(value);
    }
  };

  get supplierId(): number {
    return this._supplierId
  };
  @Input() set supplierId(val: number) {
    this._supplierId = val;
    if (val) {
      this.getSupplierDetails(val);
    }
  }
  @Input() activeIdex: number
  constructor(
    private purchasesService: PurchaseService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.phases = this.allPhases;
    this.initiatePaymentTerms()
    this.route.queryParams.subscribe(param => {
      this.id = +param.id;
      const supplierId = param.supplierId;
      if (this.id != undefined && supplierId != undefined) {
        this.getBid(this.id);
        this.getSupplierDetails(supplierId)
      }
    });
  }
  initiatePaymentTerms() {
    this.paymentTermsForm = this.fb.group({
      paymentTermId: [0],
      phase: [""],
      payment: [""],
      projectStatusDescription: [""],
      completion: [""],
      comment: [""],
      bidAndTenderId: [""],
      status: [""],
      amount: [""]
    });
  }
  getBid(id) {
    this.loadingService.show();
    return this.purchasesService.getBidAndtender(id).subscribe(
      data => {
        this.loadingService.hide();
        this.bidDetails = data.bidAndTenders[0];
        if (data.bidAndTenders[0].requisitionNotes !== null) {
          this.prnDetail = data.bidAndTenders[0].requisitionNotes
        } else {
          this.prnDetail = [];
        }

        const supplierId = this.bidDetails.supplierId;
        this.totalAmount = this.bidDetails.total;
        this.proposedAmt = this.bidDetails.proposedAmount
        // this.getSupplierDetails(supplierId);
        const paymentTerms = this.bidDetails.paymentTerms;
        this.proposedPaymentTerms = paymentTerms.filter(item => {
          return item.proposedBy === 1;
        });
        this.filterPhase(this.proposedPaymentTerms)
        this.paymentTerms = paymentTerms.filter(item => {
          return item.proposedBy === 2;
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  ngOnDestroy(): void {
    // this.getBid(this.id).unsubscribe()
  }
  getSupplierDetails(id: number) {
    this.supplierService.getSupplier(id).subscribe(
      data => {
        this.supplierDetails = data.suppliers[0];
      },
      err => {
      }
    );
  }

  addPaymentTerms(paymentTermsForm: FormGroup) {
    const payload = paymentTermsForm.value;
    payload.phase = +payload.phase;
    payload.payment = +payload.payment;
    payload.completion = +payload.completion;
    if (payload.completion > 100) {
      return swal.fire(
        "Error",
        "Percentage completion cannot be greater than 100",
        "error"
      );
    }
    if (this.index !== null) {
      this.proposedPaymentTerms = this.proposedPaymentTerms.map(
        (item, index) => {
          if (index == this.index) {
            return payload;
          }
          return item;
        }
      );
    } else {
      this.proposedPaymentTerms.push(payload);
      this.filterPhase(this.proposedPaymentTerms)
    }
    this.index = null;
    this.sum = this.proposedPaymentTerms.reduce(
      (total, item) => item.payment + total,
      0
    );
    // this.proposedPaymentTerms.push(payload);
    this.showDialog = false;
    this.initiatePaymentTerms()
  }
  sendForApproval(id: number) {
    this.loadingService.show()
    return this.purchasesService.sendBidForApproval(id).subscribe(res => {
      this.loadingService.hide()
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire('GOS FINANCIAL', message, 'success').then(() => {
          this.router.navigateByUrl('/purchases-and-supplier/bids')
        })
      } else {
        swal.fire('GOS FINANCIAL', message, 'error').then(() => {
          this.router.navigateByUrl('/purchases-and-supplier/bids')
        })
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error')
    })
  }
  savePaymentTerms() {
    if (this.sum > 100) {
      return swal.fire(
        "GOS FINANCIAL",
        "Payment Breakdown cannot be more than 100%",
        "error"
      );
    } else {
      this.totalAmt = this.proposedPaymentTerms.reduce(
        (total, item) => item.amount + total,
        0
      );
      if (this.totalAmount != this.totalAmt) {
        return swal.fire('GOS FINANCIAL', 'Proposed amount must be equal to payment terms total amount', 'error')
      }
      const payload = {
        bidAndTenderId: +this.id,
        totalAmount: +this.totalAmount,
        terms: this.proposedPaymentTerms
      };
      this.loadingService.show();
      return this.purchasesService.updatePaymentTerms(payload).subscribe(
        res => {
          this.loadingService.hide();
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOS FINANCIAL", message, "success").then(() => {
              this.sendForApproval(this.id)
            });

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
  }

  editItem(x: any, i) {
    this.index = i;
    this.paymentTermsForm = this.fb.group({
      paymentTermId: x.paymentTermId,
      phase: x.phase,
      payment: x.payment,
      projectStatusDescription: x.projectStatusDescription,
      completion: x.completion,
      comment: x.comment,
      bidAndTenderId: x.bidAndTenderId,
      status: x.status,
      amount: x.amount
    });
   this.filterPhase(this.proposedPaymentTerms, false)
    this.showDialog = true;
  }

  calculateAmount(value: any) {
    const amount = (value / 100) * this.totalAmount;
    this.paymentTermsForm.patchValue({
      amount: amount
    });
  }

  deleteItem(el, i) {
    swal
      .fire({
        title: 'Are you sure you want to delete this record?',
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          if (el.paymentTermId !== 0) {
            let row = [];
            row.push(el.paymentTermId);
            const payload = {
              targetIds: row
            }
            this.deletePaymentTerms(payload)
          }
          this.proposedPaymentTerms.splice(i, 1);
          this.sum = this.proposedPaymentTerms.reduce(
            (total, item) => item.payment + total,
            0
          );
          this.filterPhase(this.proposedPaymentTerms)
        }
      })
      .catch(err => {});
  }

  showPaymentTerms() {
    this.showDialog = true
  }

  downloadProposal() {
    this.loadingService.show();
    this.purchasesService.downloadProposal(this.id).subscribe(data => {
      this.loadingService.hide()
      if (data.status.isSuccessful) {
        var byteString = atob(data.fIle);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);
        try {
          var file = new File([bb], `${data.fileName}.${data.extension}`, {
            type: `${data.extension}`
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: `${data.extension}`
          });
          window.navigator.msSaveBlob(textFileAsBlob, `${data.fileName}.${data.extension}`);
        }
      } else {
        return swal.fire("GOS FINANCIAL", "No file found", "error");
      }
    }, err => {
      this.loadingService.hide()
    })

  }
  filterPhase(list: any[], filter: boolean = true) {
    this.phases = this.allPhases;
    if (filter) {
      list.forEach(element => {
        this.phases = this.phases.filter(x => x.id != element.phase);
      });
    }
  }

  deletePaymentTerms(payload: any) {
    // this.loadingService.show()
    return this.purchasesService.deletePaymentTerms(payload).subscribe(data => {
      // this.loadingService.hide();
      const message = data.status.message.friendlyMessage;
      if (data.status.isSuccessful) {
        swal.fire('GOS FINANCIAL', message, 'success')
      } else {
        swal.fire('GOS FINANCIAL', message, 'error')
      }
    }, err => {
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error')
    })
  }
}
