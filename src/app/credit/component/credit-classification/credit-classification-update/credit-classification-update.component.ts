import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, Validator } from "@angular/forms";
import swal from "sweetalert2";
import { LoadingService } from "src/app/core/services/loading.service";
import { CreditClassificationService } from "../../../../core/services/creditclassification.service";

@Component({
  selector: 'app-credit-classification-update',
  templateUrl: './credit-classification-update.component.html',
})
export class CreditClassificationUpdateComponent implements OnInit {
  formTitle: string = "Add New Credit Classification";
  id: number = 0;
  form: FormGroup;
  nameOfCreditClassification = "";
  creditClassification: any = {};
  creditclassificationId: number;
  constructor(
    private creditClassificationService: CreditClassificationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private router: Router,

  ) {
    this.form = this.fb.group({
      creditClassificationId: [0],
      description:["", Validators.required],
      upperLimit: [0, Validators.required],
      lowerLimit: [0, Validators.required],
      provisioningRequirement: [0, [Validators.min(1), Validators.required]],
  });
}

saveCreditClassification(form: any): void {
    const payload = form.value;
    this.loadingService.show();
    this.creditClassificationService.updateCreditClassification(payload).subscribe(res =>{
      this.loadingService.hide();
      let message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("CREDIT CLASSIFICATION", message, "success");
          this.router.navigate(["/credit/credit-classification"]);
        } else {
          swal.fire("CREDIT CLASSIFICATION", message, "error");
        }

    },err => {
      this.loadingService.hide();
      let message = err.status.message.friendlyMessage;
      swal.fire("CREDIT CLASSIFICATION", message, "error");
  })
}
editItem(id: number){
      this.loadingService.show();
        this.creditClassificationService.getCreditClassificationById(id).subscribe(res =>{
          let row: any = res.creditClassification[0];
          this.form = this.fb.group({
            creditClassificationId: row.creditClassificationId,
            description: row.description,
            upperLimit: row.upperLimit,
            lowerLimit: row.lowerLimit,
            provisioningRequirement: row.provisioningRequirement,
          });

          this.loadingService.hide();

        }, err => {
          this.loadingService.hide();
          swal.fire("CREDIT CLASSTFICATION", "Could not fetch credit classifation", "error");
        })
        // get the credit classification from the system

  }

  getCreditClassificationId(){

  }

  goBack() {
    this.router.navigate(["/credit/credit-classification"]);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.creditclassificationId = params["id"];
      if (this.creditclassificationId != undefined) {
        this.editItem(this.creditclassificationId);
        this.formTitle = `Edit Credit Classification`;
      }
      // this.id = creditclassificationId;
    });


  }
}
