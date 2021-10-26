import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { Location } from '@angular/common';
import { CompanyService } from '../../../core/services/company.service';

@Component({
  selector: "app-account-activation-setup",
  templateUrl: "./account-activation-setup.component.html",
  styleUrls: ["./account-activation-setup.component.css"]
})
export class AccountActivationSetupComponent implements OnInit {
  formTitle: string = "Account Activation Setup";
  form: FormGroup;
  reactivationSetupId: number;
  companyId: number;
  accountSetUpProduct: any[] = [];
  staffId: number;
  companyStructure: any[] = [];
  chargesApplicable: boolean;
  chargesType: string;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private depositService: DepositAccountService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    const emp = JSON.parse(localStorage.getItem("userDetails"));
    this.companyId = emp.companyId;
    this.staffId = emp.staffId;
    if (this.staffId == 0) {
      this.staffId = 1136;
    }
    this.route.queryParams.subscribe(param => {
      this.reactivationSetupId = param.reactivationSetupId;
      if (this.reactivationSetupId != undefined) {
        this.formTitle = "Edit Account Activation Setup";
        this.getReactivationSetup(this.reactivationSetupId);
      }
    });
    this.form = this.fb.group({
      reactivationSetupId: [0],
      structure: [""],
      product: [""],
      productName: [""],
      chargesApplicable: [false],
      charge: [""],
      percentage: [""],
      presetChart: [false],
      chargeType: [""]
    });
    this.getAccountSetUp();
    this.getCompanyStructure()
  }
  getCompanyStructure() {
    this.loadingService.show();
    return this.companyService.getCompanyStructureByStatffId(this.staffId).subscribe(data => {
      this.loadingService.hide();
      this.companyStructure = data.companyStructures;
    }, err => {
      this.loadingService.hide()
    })
  }
  getAccountSetUp() {
    return this.depositService.getAllAccountSetup().subscribe(
      data => {
        this.accountSetUpProduct = data.depositAccounts;
      },
      err => {
      },
      () => { }
    );
  }
  getReactivationSetup(id: number): Subscription {
    this.loadingService.show();
    return this.depositService.getReactivationSetup(id).subscribe(
      data => {
        const row = data.reactivationSetup[0];
        this.form = this.fb.group({
          reactivationSetupId: [row.reactivationSetupId],
          structure: [row.structure],
          product: [row.product],
          productId: [row.productName],
          productName: [row.productName],
          chargesApplicable: [row.chargesApplicable],
          charge: [row.charge],
          name: [row.companyName],
          percentage: [row.percentage],
          presetChart: [row.presetChart],
          chargeType: [row.chargeType]
        });
        this.chargesApplicable = row.chargesApplicable;
        this.chargesType = row.chargeType
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  submitDetails(form: FormGroup) {
    const payload = form.value;
    this.loadingService.show();
    payload.structure = parseInt(payload.structure);
    payload.product = parseInt(payload.product);
    return this.depositService.updateReactivationSetup(payload).subscribe(
      res => {
        var message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          this.loadingService.hide();
          swal.fire("GOS FINANCIALS", message, "success");
          this.router.navigateByUrl("/deposit/account-activation-list");
        } else {
          swal.fire("GOS FINANCIALS", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        var message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIALS", message, "error");
      }
    );
  }

  goBack() {
    this.location.back();
  }

  getValue() {
    this.chargesApplicable = this.form.get('chargesApplicable').value;
    if (!this.chargesApplicable) {
      this.form.patchValue({
        chargesType: '',
        charge: ''
      })
      this.chargesType = ''
    }
  }

  getChargesType(value: string) {
    this.chargesType = value
  }
}
