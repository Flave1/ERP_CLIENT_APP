import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PpeService} from "../../services/ppe.service";
import {LoadingService} from "../../../core/services/loading.service";
import swal from 'sweetalert2'
import {Location} from "@angular/common";
@Component({
  selector: 'app-reevaluate-cost',
  templateUrl: './reevaluate-cost.component.html',
  styleUrls: ['./reevaluate-cost.component.css']
})
export class ReevaluateCostComponent implements OnInit {
  formTitle: string = 'Reevaluate Cost';
  form: FormGroup;
  assetClassifications: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ppeService: PpeService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      let id = param.id;
      if (id) {
        this.getRegister(id);
      }
    });
    this.form = this.fb.group({
      registerId: [0],
      assetNumber: [''],
      lpoNumber: [''],
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
      remainingUsefulLife: [''],
      proposedUsefulLife: [''],
      reEvaluatedCost: ['']
    });
    this.getAssetClassification()
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
  getRegister(id: number) {
    this.loadingService.show();
    return this.ppeService.getRegister(id).subscribe(
      res => {
        this.loadingService.hide();
        const data = res.registers[0];
        this.form = this.fb.group({
          registerId: [data.registerId],
          assetNumber: data.assetNumber,
          lpoNumber: data.lpoNumber,
          assetClassificationId: data.assetClassificationId,
          description: data.description,
          cost: data.cost,
          dateOfPurchaase: new Date(data.dateOfPurchaase),
          quantity: data.quantity,
          depreciationStartDate: new Date(data.depreciationStartDate),
          usefulLife: data.usefulLife,
          residualValue: data.residualValue,
          location: data.location,
          depreciationForThePeriod: data.depreciationForThePeriod,
          accumulatedDepreciation: data.accumulatedDepreciation,
          netBookValue: data.netBookValue,
          remainingUsefulLife: data.remainingUsefulLife,
          proposedUsefulLife: data.proposedUsefulLife,
          reEvaluatedCost: data.reEvaluatedCost
        })
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  submitInfo(form: FormGroup) {
    const payload = form.value;
    payload.reEvaluatedCost = +payload.reEvaluatedCost;
    this.loadingService.show();
    return this.ppeService.updateReevaluation(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire('GOS FINANCIAL', message, 'success');
        this.router.navigateByUrl('/ppe/reevaluation-list')
      } else {
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error');
    })
  }

  goBack() {
    this.location.back()
  }
}
