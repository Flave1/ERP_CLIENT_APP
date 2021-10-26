import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { DepositAccountService } from '../../../core/services/depositaccount.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import swal from "sweetalert2";
import { CompanyService } from '../../../core/services/company.service';

@Component({
  selector: 'app-transfer-setup',
  templateUrl: './transfer-setup.component.html',
  styleUrls: ['./transfer-setup.component.css']
})
export class TransferSetupComponent implements OnInit {
  accountSetUpProduct: any[] = []
  form: FormGroup;
  transferSetupId: number;
  companyId: number;
  formTitle: string = 'Transfer Setup';
  accountType: any[] = [];
  product: any;
  staffId: number;
  companyStructure: any[] = [];
  chargesApplicable: boolean;
  chargesType: string;
  constructor(
    private loadingService: LoadingService,
    private depositService: DepositAccountService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
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
      this.transferSetupId = param.transferSetupId;
      if (this.transferSetupId != undefined) {
        this.formTitle = "Edit Account Activation Setup";
        this.getTransferSetup(this.transferSetupId);
      }
    });
    this.form = this.fb.group({
      transferSetupId: [0],
      structure: [""],
      product: [""],
      productName: [""],
      chargesApplicable: [false],
      charges: [""],
      percentage: [""],
      presetChart: [false],
      dailyWithdrawalLimit: [""],
      accountType: [""],
      chargesType: [""]
    });
    this.getAccountSetUp();
    this.getAccountType();
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
  getAccountType() {
    this.loadingService.show();
    return this.depositService.getAllAccountType().subscribe(
      data => {
        this.loadingService.hide();
        this.accountType = data.accountTypes;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getTransferSetup(transferSetupId: number) {
    return this.depositService.getTransferSetup(transferSetupId).subscribe(data => {
      this.loadingService.hide();
      const row = data.transferSetups[0];
      this.form = this.fb.group({
        transferSetupId: [row.transferSetupId],
        structure: row.structure,
        product: [row.product],
        productName: [row.productName],
        chargesApplicable: [row.chargesApplicable],
        charges: [row.charges],
        percentage: [row.percentage],
        presetChart: [row.presetChart],
        dailyWithdrawalLimit: [row.dailyWithdrawalLimit],
        accountType: [row.accountType],
        chargeType: [row.chargeType]
      });
      this.loadingService.show();
      this.product = row.product;
      this.chargesType = row.chargeType;
      this.chargesApplicable = row.chargesApplicable
    }, err => {
      this.loadingService.hide();
    })
  }

  submitDetails(form: FormGroup) {
    const payload = form.value;


    payload.structure = parseInt(payload.structure);
    payload.accountType = parseInt(payload.accountType);

    this.loadingService.show();
    return this.depositService.updateTransferSetup(payload).subscribe(
      res => {
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          this.loadingService.hide();
          swal.fire("GOS FINANCIALS", message, "success");
          this.router.navigateByUrl("/deposit/transfer-setup-list");
        } else {
          this.loadingService.hide();
          swal.fire("GOS FINANCIALS", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIALS", message, "error");
      }
    );
  }

  goBack() {
    this.location.back();
  }

  getDetails(val) {
    const item = this.accountSetUpProduct.find(item => item.depositAccountId == val);
    this.form.patchValue({
      product: item.depositAccountId,
      accountType: item.accountTypeId
    })
  }

  getChargesType(value: any) {
    this.chargesType = value
  }

  getValue() {
    this.chargesApplicable = this.form.get('chargesApplicable').value;
    if (!this.chargesApplicable) {
      this.form.patchValue({
        charge: '',
        chargesType: ''
      })
    }
    this.chargesType = ''
  }
}
