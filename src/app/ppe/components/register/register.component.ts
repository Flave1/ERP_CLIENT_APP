import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { PpeService } from "../../services/ppe.service";
import { LoadingService } from "../../../core/services/loading.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import swal from "sweetalert2";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerId: number;
  registerForm: FormGroup;
  formTitle: string = 'Register Form' ;
  assetClassifications: any;
  constructor(
    private route: ActivatedRoute,
    private ppeService: PpeService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      this.registerId = param.id;
      if (this.registerId) {
        this.getRegister(this.registerId);
      }
    });
    this.registerForm = this.fb.group({
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
      depreciationForThePeriod: [0],
      accumulatedDepreciation: [0],
      netBookValue: [0],
      depreciable: [false]
    });
    this.getAssetClassification();
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
        const data = res.registers[0]
        this.registerForm = this.fb.group({
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
          depreciable: data.depreciable
        })
      },
      err => {
        this.loadingService.hide();
      }
    );
  }


  submitInfo(registerForm: FormGroup) {
    const payload = registerForm.value;
    payload.assetClassificationId = parseInt(payload.assetClassificationId);
    payload.cost = parseFloat(payload.cost);
    payload.quantity = parseInt(payload.quantity);
    payload.usefulLife = parseInt(payload.usefulLife);
    payload.residualValue = parseInt(payload.residualValue);
    payload.depreciationForThePeriod = parseInt(payload.depreciationForThePeriod);
    payload.accumulatedDepreciation = parseInt(payload.accumulatedDepreciation);
    payload.netBookValue = parseFloat(payload.netBookValue)
    this.loadingService.show();
    return this.ppeService.updateRegister(payload).subscribe(res => {
      this.loadingService.hide();
      const message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire(`GOS FINANCIAL`, message, "success").then(() => {
          this.router.navigateByUrl("/ppe/register-list");
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
    this.router.navigateByUrl('/ppe/register-list')
  }
}
