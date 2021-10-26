import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { PpeService } from "../../services/ppe.service";
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";
@Component({
  selector: "app-disposal",
  templateUrl: "./disposal.component.html",
  styleUrls: ["./disposal.component.css"]
})
export class DisposalComponent implements OnInit {
  disposalForm: FormGroup;
  assetClassifications: any[];
  formTitle: string = 'Disposal Form';
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private ppeService: PpeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      let id: number = param.id;
      if (id) {
        this.getDisposal(id)
      }
    });
    this.disposalForm = this.fb.group({
      disposalId: [0],
      assetNumber: [''],
      assetClassificationId: [''],
      description: [''],
      cost: [''],
      dateOfPurchaase: [''],
      quantity: [''],
      depreciationStartDate: [''],
      usefulLife: [''],
      residualValue: [''],
      location: [''],
      depreciationForThePeriod: [''],
      accumulatedDepreciation: [''],
      netBookValue: [''],
      proceedFromDisposal: [''],
      reasonForDisposal: [''],
      requestDate: [''],
      proposedDisposalDate: ['']
    });
    this.getAssetClassification()
  }

  getDisposal(id: number) {
    this.loadingService.show();
    return this.ppeService.getDisposal(id).subscribe(res => {
      this.loadingService.hide();
      const data = res.disposals[0];

      this.disposalForm = this.fb.group({
        disposalId: [data.disposalId, {disabled: true}],
        assetNumber: [data.assetNumber, {disabled: true}],
        assetClassificationId: [data.assetClassificationId],
        description: [data.description],
        cost: [data.cost],
        dateOfPurchaase: [new Date(data.dateOfPurchaase)],
        quantity: [data.quantity],
        depreciationStartDate: [new Date(data.depreciationStartDate)],
        usefulLife: [data.usefulLife],
        residualValue: [data.residualValue],
        location: [data.location],
        depreciationForThePeriod: [data.depreciationForThePeriod],
        accumulatedDepreciation: [data.accumulatedDepreciation],
        netBookValue: [data.netBookValue],
        proceedFromDisposal: [data.proceedFromDisposal],
        reasonForDisposal: [data.reasonForDisposal],
        requestDate: [new Date(data.requestDate)],
        proposedDisposalDate: ['']
      })
    }, err => {
      this.loadingService.hide()
    })
  }
  getAssetClassification() {
    this.loadingService.show();
    return this.ppeService.getAssetClassifications().subscribe(data => {
      this.loadingService.hide();
      this.assetClassifications = data.assetClassifications;
    },err => {
      this.loadingService.hide();
    })
  }
  submitInfo(disposalForm: FormGroup) {
    const payload = disposalForm.value;
    payload.assetClassificationId = +payload.assetClassificationId
    this.loadingService.show();
    return this.ppeService.updateDisposal(payload).subscribe(data => {
      this.loadingService.hide()
      const message = data.status.message.friendlyMessage;
      if (data.status.isSuccessful) {
        swal.fire('GOS FINANCIAL', message, 'success');
        this.router.navigate(['/ppe/disposal-list'])
      } else {
        swal.fire('GOS FINANCIAL', message, 'error')
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error')
    })
  }

  goBack() {
    this.router.navigate(['/ppe/disposal-list'])
  }
}
