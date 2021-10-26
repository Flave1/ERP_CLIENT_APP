import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PpeService} from "../../services/ppe.service";
import {LoadingService} from "../../../core/services/loading.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import swal from "sweetalert2";

@Component({
  selector: 'app-reassessment',
  templateUrl: './reassessment.component.html',
  styleUrls: ['./reassessment.component.css']
})
export class ReassessmentComponent implements OnInit {

  reassesForm: FormGroup;
  formTitle: string = 'Reassess Useful Life';
  assetClassifications: any[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ppeService: PpeService,
    private loadingService: LoadingService,
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      let id = param.id;
      if (id) {
        this.getRegister(id);
      }
    });
    this.reassesForm = this.fb.group({
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
      proposedUsefulLife: ['']
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
        this.reassesForm = this.fb.group({
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
          proposedUsefulLife: data.proposedUsefulLife
        })
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  submitInfo(formObj: FormGroup) {
    const payload = formObj.value;
    // payload.remainingUsefulLife = 10;
    payload.assetClassificationId = parseInt(payload.assetClassificationId);
    payload.cost = parseFloat(payload.cost);
    payload.quantity = parseInt(payload.quantity);
    payload.usefulLife = parseInt(payload.usefulLife);
    payload.residualValue = parseInt(payload.residualValue);
    payload.depreciationForThePeriod = parseInt(payload.depreciationForThePeriod);
    payload.accumulatedDepreciation = parseInt(payload.accumulatedDepreciation);
    payload.netBookValue = parseFloat(payload.netBookValue);
    payload.remainingUsefulLife = parseInt(payload.remainingUsefulLife);
    payload.proposedUsefulLife = parseInt(payload.proposedUsefulLife);
    this.loadingService.show();
    return this.ppeService.updateReassessment(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire(`GOS FINANCIAL`, message, "success").then(() => {
          this.router.navigateByUrl("/ppe/reassessment-list");
        });
      } else {
        swal.fire(`GOS FINANCIAL`, message, "error")
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire(`GOS FINANCIAL`, message, "error")
    })
  }

  goBack() {
    this.router.navigateByUrl('/ppe/reassessment-list')
  }
}
