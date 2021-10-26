import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../../../core/services/loading.service";
import { PpeService } from "../../services/ppe.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-disposal-list",
  templateUrl: "./disposal-list.component.html",
  styleUrls: ["./disposal-list.component.css"]
})
export class DisposalListComponent implements OnInit {
  disposalList: any[] = [];
  viewHeight: string = "660px";
  selectedItem: any[] = [];
  cols: any[];
  displayDisposals: boolean;
  disposals: any[] = [];
  disposeForm: FormGroup;
  disposalItems: any;
  constructor(
    private loadingService: LoadingService,
    private ppeService: PpeService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initialiseForm();
    this.getDisposals();
  }
  initialiseForm() {
    this.disposeForm = this.fb.group({
      requestDate: [new Date()],
      proposedDisposalDate: [null],
      reasonForDisposal: [""],
      nbv: [0]
    });
  }
  getDisposals() {
    this.loadingService.show();
    return this.ppeService.getRegisterList().subscribe(
      data => {
        this.loadingService.hide();
        this.disposalList = data.registers;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  editItem(x) {}

  dispose(x) {
    const item = [];
    item.push(x);
    // const sum = this.disposals.reduce(
    //   (item, total) => item.netBookValue + total,
    //   0
    // );
    this.disposeForm.patchValue({
      nbv: x.netBookValue.toFixed(2)
    });
    this.disposals = item;
    this.selectedItem = this.disposals;
    this.displayDisposals = true;

  }

  multiDispose() {
    if (this.selectedItem.length === 0) {
      return swal.fire("GOS FINANCIAL", "Select Item(s) to dispose", "error");
    }
    const sum = this.selectedItem.reduce(
      (total, item) => item.netBookValue + total,
      0
    );
    this.disposeForm.patchValue({
      nbv: sum.toFixed(2)
    });
    this.disposals = this.selectedItem;
    this.displayDisposals = true;
  }

  saveDisposal(selectedItem: any[]) {
    const disposalItems = [];
    selectedItem.forEach(item => {
      const data = {
        registerId: item.registerId,
        proceedFromDisposal: +item.proceed,
        assetNumber: item.assetNumber,
        classificationName: item.classificationName,
        assetClassificationId: item.assetClassificationId,
        description: item.description,
        cost: +item.cost,
        accumulatedDepreciation: item.accumulatedDepreciation,
        netBookValue: +item.netBookValue
      };
      disposalItems.push(data);
    });
    const formValue = this.disposeForm.value;
    const payload = {
      disposalList: disposalItems,
      requestDate: formValue.requestDate,
      proposedDisposalDate: formValue.proposedDisposalDate,
      nbv: +formValue.nbv,
      reasonForDisposal: formValue.reasonForDisposal,

    };
    swal.fire({
      title: "Are you sure you want to dispose the item(s)?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!"
    }).then(res => {
      if (res.value) {
        this.loadingService.show();
        return this.ppeService.updateDisposal(payload).subscribe(res => {
          this.loadingService.hide();
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire('GOS FINANCIAL', message, 'success');
            this.selectedItem = [];
            this.displayDisposals = false;
            this.getDisposals()
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

  close() {
    this.displayDisposals = false;
    this.initialiseForm();
    this.selectedItem = [];
  }
}
