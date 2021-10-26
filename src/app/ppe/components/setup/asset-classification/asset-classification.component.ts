import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {LoadingService} from "../../../../core/services/loading.service";
import {PpeService} from "../../../services/ppe.service";
import swal from 'sweetalert2'
import {SubGLService} from "../../../../core/services/subgl.service";

@Component({
  selector: 'app-asset-classification',
  templateUrl: './asset-classification.component.html',
  styleUrls: ['./asset-classification.component.css']
})
export class AssetClassificationComponent implements OnInit {
  formTitle: string = 'Asset Classification';
  form: FormGroup;
  glArr: any[] = [];
  showDepreciationMethod: boolean;
  id: number;
  glList: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private loadingService: LoadingService,
    private ppeService: PpeService,
    private router: Router,
    private subGlService: SubGLService
  ) { }

  ngOnInit() {
    this.getSubGls()
    this.form = this.fb.group({
      asetClassificationId: [0],
      classificationName: [""],
      usefulLifeMin: [""],
      usefulLifeMax: [""],
      residualValue: [""],
      depreciable: [false],
      depreciationMethod: [""],
      subGlAddition: [""],
      subGlDepreciation: [""],
      subGlAccumulatedDepreciation: [""],
      subGlDisposal: [""],
      subGlRevaluation: [""]
      });
    this.route.queryParams.subscribe(param => {
      this.id = param.id;
      if (this.id != undefined) {
        this.getAssetClassification(this.id)
      }
    });

  }
  getSubGls() {
    this.loadingService.show();
    return this.subGlService.getAllSubGL().subscribe(data => {
      this.loadingService.hide()
      this.glList = data.subGls;
      this.glArr = this.glList.map(item => ({
        label: `${item.subGLName} | ${item.subGLCode}`,
        value: item.subGLId
      }));
    }, err => {
      this.loadingService.hide()
    })
  }
  submitInfo(form: FormGroup) {
      const payload = form.value;
      if (!payload.classificationName) {
        return swal.fire(`GOS FINANCIAL`, 'Classification Name is required', 'error')
      }
      if (payload.residualValue > 100) {
        return swal.fire(`GOS FINANCIAL`, 'Residual value cannot be greater than 100%', 'error')
      }
      payload.usefulLifeMin = parseInt(payload.usefulLifeMin);
      payload.usefulLifeMax = parseInt(payload.usefulLifeMax);
      payload.residualValue = parseFloat(payload.residualValue);
      payload.subGlAddition = parseInt(payload.subGlAddition);
      payload.subGlDepreciation = parseInt(payload.subGlDepreciation);
      payload.subGlAccumulatedDepreciation = parseInt(payload.subGlAccumulatedDepreciation);
      payload.subGlDisposal = parseInt(payload.subGlDisposal);
      payload.subGlRevaluation = parseInt(payload.subGlRevaluation);

      this.loadingService.show();
      return this.ppeService.updateAssetClassification(payload).subscribe(res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, 'success');
          this.router.navigate(['/ppe/asset-classification-list'])
        } else {
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      }, err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, 'error');
      })
  }
  getAssetClassification(id) {
    this.loadingService.show();
    return this.ppeService.getAssetClassification(id).subscribe(res => {
      this.loadingService.hide();
      const data = res.assetClassifications[0];
      this.form = this.fb.group({
        asetClassificationId: [data.asetClassificationId],
        classificationName: [data.classificationName],
        usefulLifeMin: [data.usefulLifeMin],
        usefulLifeMax: [data.usefulLifeMax],
        residualValue: [data.residualValue],
        depreciable: [data.depreciable],
        depreciationMethod: [data.depreciationMethod],
        subGlAddition: [data.subGlAddition],
        subGlDepreciation: [data.subGlDepreciation],
        subGlAccumulatedDepreciation: [data.subGlAccumulatedDepreciation],
        subGlDisposal: [data.subGlDisposal],
        subGlRevaluation: [data.subGlRevaluation]
      });
    }, err => {
      this.loadingService.hide()
    })
  }
  goBack() {
    this.location.back()
  }

  onChecked(event: any) {
  this.showDepreciationMethod =  this.form.get('depreciable').value
    // this.showDepreciationMethod = value;
  }
}
