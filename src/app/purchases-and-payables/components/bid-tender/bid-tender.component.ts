import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Location } from "@angular/common";
import { SupplierService } from "../../../core/services/supplier.service";
import { LoadingService } from "../../../core/services/loading.service";
import { PurchaseService } from "../../../core/services/purchase.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: 'app-bid-tender',
  templateUrl: './bid-tender.component.html',
  styleUrls: ['./bid-tender.component.css']
})
export class BidTenderComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  formTitle: string = "Bid Details Form";
  bidForm: FormGroup;
  selectedSuppliers: any[] = [];
  paymentTerms: any[] = [];
  supplierArr: any[] = [];
  prnArr: any[] = [];
  showDialog: boolean;
  paymentTermsForm: FormGroup;
  index: number = null;
  sum: number;
  suppliers: any[] = [];
  fileToUpload: File;
  prns: any[] = [];
  phases: any[] = [];
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
  proposedAmount: number;
  proposalBtn: boolean;
  bidAndTenderId: any;
  supplierId: number;
  lPONumber: any;
  totalAmount: number
  constructor(
    private fb: FormBuilder,
    private _location: Location,
    private _supplierService: SupplierService,
    private _loadingService: LoadingService,
    private _purchaseService: PurchaseService,
    private router: Router

  ) { }

  ngOnInit() {
    this.phases = this.allPhases;
    this.initialiseBidForm();
    this.initialisePaymentTermsForm()
    this.getSuppliers();
    this.getPrns()
  }
  initialisePaymentTermsForm() {
    this.paymentTermsForm = this.fb.group({
      ptId: [0],
      phase: [""],
      payment: [""],
      amount: [''],
      projectStatusDescription: [""],
      completion: [""],
      comment: [""]
    });
  }
  initialiseBidForm() {
    this.bidForm = this.fb.group({
      bidAndTenderId: [""],
      supplierId: [""],
      lpOnumber: [""],
      requestingDepartment: [""],
      requestDate: [""],
      suppliernumber: [""],
      supplierName: [""],
      location: [""],
      amountApproved: [""],
      proposedAmount: [""],
      dateSubmitted: [""],
      paymentterms: [""],
      expectedDeliveryDate: [""],
      total: [""],
      plpoId: [""],
      quantity: [""],
      decisionResult: [""],
      descriptionOfRequest: [""],
      purchaseReqNoteId: ['']
    });
  }
  getSuppliers() {
    this._loadingService.show();
    return this._supplierService.getAllSupplier().subscribe(data => {
      this._loadingService.hide()
      this.suppliers = data.suppliers;
      this.supplierArr = this.suppliers.map(item => ({
        label: item.name,
        value: item.supplierId
      }))
    }, err => {
      this._loadingService.hide()
    })
  }
  getPrns() {
    this._loadingService.show();
    return this._purchaseService.getUnbiddedBids().subscribe(data => {
      this._loadingService.hide();
      this.prns = data.bidAndTenders;
      this.prnArr = this.prns.map(item => (
        { label: `${item.lpOnumber} | ${item.descriptionOfRequest}`, value: item.lpOnumber }
      ))
    })
  }
  editDetail(x, i) {
    this.paymentTermsForm = this.fb.group({
      ptId: x.ptId,
      phase: [x.phase],
      payment: [x.payment],
      projectStatusDescription: [x.projectStatusDescription],
      completion: [x.completion],
      comment: [x.comment],
      amount: x.amount
    });
    this.index = i;
    this.filterPhase(this.paymentTerms, false)
    this.showDialog = true;
  }
  deleteDetail(el: any, i: number) {
    swal
      .fire({
        text: "Delete this Item?",
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
          this.paymentTerms.splice(i, 1);
          this.sum = this.paymentTerms.reduce(
            (total, item) => item.payment + total,
            0
          );
          this.filterPhase(this.paymentTerms)
        }
      })
      .catch(err => { });
  }
  deletePaymentTerms(payload: any) {
    // this.loadingService.show()
    return this._purchaseService.deletePaymentTerms(payload).subscribe(data => {
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
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  submitBid(bidForm: FormGroup) {
    const payload = bidForm.value;
    payload.paymentterms = this.paymentTerms;
    payload.supplierId = parseInt(payload.supplierId);
    payload.requestingDepartment = parseInt(payload.requestingDepartment);
    payload.amountApproved = parseFloat(payload.amountApproved);
    payload.proposedAmount = parseInt(payload.proposedAmount);
    payload.paymentterms = this.paymentTerms;
    payload.dateSubmitted = new Date();
    if (this.sum > 100) {
      return swal.fire(
        `GOS FINANCIAL`,
        "Payment breakdown cannot be greater than 100 percent",
        "error"
      );
    }
    this.totalAmount = this.paymentTerms.reduce(
      (total, item) => item.amount + total,
      0
    );
    if (this.proposedAmount != this.totalAmount) {
      return swal.fire('GOS FINANCIAL', 'Proposed amount must be equal to payment terms total amount', 'error')
    }
    swal.fire({
      title: "Are you sure you want to bid for this item?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!"
    }).then(res => {
      if (res.value) {
        this._loadingService.show()
        return this._purchaseService.submitBid(payload).subscribe(res => {
          this._loadingService.hide();
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire('GOS FINANCIAL', message, 'success').then(() => {
              this.initialiseBidForm();
              this.router.navigate(['/purchases-and-supplier/bids'])
            })

          } else {
            swal.fire('GOS FINANCIAL', message, 'error')
          }
        }, err => {
          this._loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error')
        })
      }
    })
  }

  goBack() {
    this._location.back()
  }

  getValue(value: any) {
    const item = this.suppliers.find(item => item.supplierId === value);
    this.supplierId = item.supplierId
    this.bidForm.patchValue({
      suppliernumber: item.supplierNumber,
      supplierName: item.name
      // location: item.address
    })

  }

  addPaymentTerms() {
    this.showDialog = true
  }

  AddPaymentTerms(paymentTermsForm: FormGroup) {
    const payload = paymentTermsForm.value;
    payload.phase = parseInt(payload.phase);
    payload.payment = parseFloat(payload.payment);
    payload.completion = parseInt(payload.completion);
    if (!payload.phase) {
      return swal.fire('GOS FINANCIAL', 'Select project phase', 'error')
    }
    if (!payload.payment) {
      return swal.fire('GOS FINANCIAL', 'Payment percentage is required', 'error')
    }
    if (!payload.completion) {
      return swal.fire('GOS FINANCIAL', 'Percentage completion is required', 'error')
    }
    if (payload.completion > 100) {
      return swal.fire('GOS FINANCIAL', 'Percentage completion cannot be greater than 100', 'error')
    }
    if (this.index !== null) {
      this.paymentTerms = this.paymentTerms.map((item, index) => {
        if (index == this.index) {
          return payload
        }
        return item
      })
    } else {
      this.paymentTerms.push(payload);
      this.filterPhase(this.paymentTerms)
    }
    this.index = null;
    this.sum = this.paymentTerms.reduce(
      (total, item) => item.payment + total,
      0
    );
    this.initialisePaymentTermsForm()
    this.showDialog = false;
  }

  closeDialog() {
    this.showDialog = false;
    this.initialisePaymentTermsForm()
  }

  getPRNValue(value: any) {
    const item = this.prns.find(el => el.lpOnumber === value);
    this.bidAndTenderId = item.bidAndTenderId
    this.lPONumber = item.lpOnumber
    this.bidForm.patchValue({
      bidAndTenderId: item.bidAndTenderId,
      lpOnumber: item.lpOnumber,
      requestingDepartment: item.requestingDepartment,
      requestDate: item.requestDate,
      amountApproved: item.amountApproved,
      expectedDeliveryDate: item.expectedDeliveryDate,
      total: item.total,
      plpoId: item.plpoId,
      quantity: item.quantity,
      decisionResult: item.decisionResult,
      descriptionOfRequest: item.descriptionOfRequest,
      location: item.location,
      purchaseReqNoteId: item.prnId

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
  calculateAmount(value: any) {
    const amount = (value / 100) * this.proposedAmount;
    this.paymentTermsForm.patchValue({
      amount: +amount
    });
  }

  getAmount(value: any) {
    this.proposedAmount = value
  }
  // upload tender proposal;
  uploadTenderProposal() {
    if (!this.fileToUpload) {
      return swal.fire('GOS FINANCIAL', 'Select file to upload', 'error')
    }
    if (!this.bidForm.get('supplierId').value) {
      return swal.fire('GOS FINANCIAL', 'Select a supplier', 'error')
    }
    const payload = {
      supplierId: this.supplierId,
      lPONumber: this.lPONumber
    }
    this.proposalBtn = true;
    return this._purchaseService.uploadProposal(this.fileToUpload, payload).then(res => {
      this.proposalBtn = false;
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire('GOS FINANCIAL', message, 'success')
        this.fileInput.nativeElement.value = ""
      } else {
        swal.fire('GOS FINANCIAL', message, 'error')
      }
    }).catch(err => {
      this.proposalBtn = false;
      const error = JSON.parse(err);
      const message = error.status.message.friendlyMessage
      swal.fire('GOS FINANCIAL', message, 'error')
    })
  }
}
