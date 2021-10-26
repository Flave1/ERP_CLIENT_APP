import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { PpeService } from "../../services/ppe.service";
import { ActivatedRoute, Router } from "@angular/router";
import swal from "sweetalert2";
import { Location } from "@angular/common";
import { PurchaseService } from "../../../core/services/purchase.service";
import { SubGLService } from "../../../core/services/subgl.service";

@Component({
  selector: "app-addition",
  templateUrl: "./addition.component.html",
  styleUrls: ["./addition.component.css"]
})
export class AdditionComponent implements OnInit {
  formTitle: string = "Addition Form";
  form: FormGroup;
  glList: any[];
  glArr: any[];
  id: number;
  lpos: any[] = [];
  assetClassifications: any[] = [];
  lpoArr: any[] = [];
  assetClassificationsArr: any[] = [];
  lpoNumber: any;
  customer: any;
  item: any;
  cost: any;
  res_value: any;
  constructor(
    private loadingService: LoadingService,
    private ppeService: PpeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private purchaseService: PurchaseService,
    private subGlService: SubGLService
  ) { }

  ngOnInit() {
    this.updateLpoList();
    // this.lpos = [
    //   {
    //     lpo: '234561'
    //   },
    //   {
    //     lpo: '234591'
    //   },
    //   {
    //     lpo: '934591'
    //   }
    // ]

    this.form = this.fb.group({
      additionFormId: [0],
      lpoNumber: [""],
      dateOfPurchase: [""],
      description: [""],
      quantity: [""],
      cost: [""],
      assetClassificationId: [""],
      subGlAddition: [""],
      usefulLife: [""],
      residualValue: [""],
      location: [""]
    });
    this.getSubGls();
    this.getLpos();
    this.route.queryParams.subscribe(param => {
      this.id = param.id;
      if (this.id != undefined) {
        this.getAddition(this.id);
      }
    });
    this.getAssetClassification();
  }
  getSubGls() {
    this.loadingService.show();
    return this.subGlService.getAllSubGL().subscribe(
      data => {
        this.loadingService.hide();
        this.glList = data.subGls;
        this.glArr = this.glList.map(item => ({
          label: `${item.subGLName} | ${item.subGLCode}`,
          value: item.subGLId
        }));
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getLpos() {
    this.loadingService.show();
    return this.ppeService.getLpos().subscribe(
      data => {
        if (data) {
          this.lpos = data.lpos;
          this.lpoArr = this.lpos.map(item => ({
            label: `${item.lpoNumber} | ${item.description}`,
            value: item.lpoNumber
          }));
          this.loadingService.hide();
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  // get asset classification
  getAssetClassification() {
    this.loadingService.show();
    return this.ppeService.getAssetClassifications().subscribe(
      data => {
        this.loadingService.hide().then(() => {
          this.assetClassifications = data.assetClassifications;
          this.assetClassificationsArr = this.assetClassifications.map(item => ({
            label: item.classificationName,
            value: item.asetClassificationId
          }))
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getAddition(id: number) {
    this.loadingService.show();
    return this.ppeService.getAddition(id).subscribe(
      res => {
        const data = res.additionForms[0];
        this.form = this.fb.group({
          additionFormId: [data.additionFormId],
          lpoNumber: [data.lpoNumber],
          dateOfPurchase: [new Date(data.dateOfPurchase)],
          description: [data.description],
          quantity: [data.quantity],
          cost: [data.cost],
          assetClassificationId: [data.assetClassificationId],
          subGlAddition: [data.subGlAddition],
          usefulLife: [data.usefulLife],
          residualValue: [data.residualValue],
          location: [data.location]
        });
        this.lpoNumber = data.lpoNumber;
        this.item = data.assetClassificationId;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  goBack() {
    this.location.back();
  }

  getValue(name: any) {
    const item = this.lpos.find(item => item.lpoNumber === name);
    // const data = item;
    // this.form.get('lpoNumber').setValue(item.lpoNumber);
    // this.form.get('dateOfPurchase').setValue(new Date(item.deliveryDate))
    this.form.patchValue({
      dateOfPurchase: new Date(item.deliveryDate),
      description: item.description,
      location: item.address,
      cost: item.amountPayable,
      quantity: item.quantity
    });
    this.cost = item.amountPayable;
  }
  updateLpoList() {
    this.loadingService.show()
    this.purchaseService.updatePpeLpo().subscribe(data => {
      this.loadingService.hide()
    }, err => {
      this.loadingService.hide()
    })
  }
  getItemValue(id: any) {
    const item = this.assetClassifications.find(item => item.asetClassificationId === +id);
    this.form.patchValue({
      subGlAddition: item.subGlAddition,
      assetClassificationId: item.asetClassificationId,
      usefulLife: item.usefulLifeMax,
      residualValue: (this.cost * item.residualValue) / 100
    });
  }
  submitInfo(form: FormGroup) {
    const payload = form.value;
    payload.quantity = parseInt(payload.quantity);
    payload.cost = parseFloat(payload.cost);
    payload.assetClassificationId = parseInt(payload.assetClassificationId);
    payload.subGlAddition = parseInt(payload.subGlAddition);
    payload.usefulLife = parseInt(payload.usefulLife);
    payload.residualValue = parseInt(payload.residualValue);
    payload.dateOfPurchase = this.formatDate(payload.dateOfPurchase);
    this.loadingService.show();
    return this.ppeService.updateAddition(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, "success").then(() => {
            this.router.navigateByUrl("/ppe/addition-list");
          });
          // this.updateLpoList().then(() => {
          //
          // })

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

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }
}
