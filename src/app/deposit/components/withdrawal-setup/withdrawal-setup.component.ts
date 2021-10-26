import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { Location } from "@angular/common";
import swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { CompanyService } from "../../../core/services/company.service";

@Component({
  selector: "app-withdrawal-setup",
  templateUrl: "./withdrawal-setup.component.html",
  styleUrls: ["./withdrawal-setup.component.css"]
})
export class WithdrawalSetupComponent implements OnInit {
  formTitle: string = "Withdrawal Set up";
  form: FormGroup;
  accountType: any[] = [];
  accountSetUpProduct: any[] = [];
  companyId: any;
  withdrawalSetupId: number;
  product: any = 0;
  staffId: number;
  companyStructure: any[] = [];
  chargesType: string;
  chargesApplicable: boolean;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private depositService: DepositAccountService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      this.withdrawalSetupId = param.withdrawalSetupId;
      if (this.withdrawalSetupId != undefined) {
        this.getWithdrawalSetup(this.withdrawalSetupId);
        this.formTitle = "Edit Withdrawal Setup";
      }
    });
    const emp = JSON.parse(localStorage.getItem("userDetails"));
    this.companyId = emp.companyId;
    this.staffId = emp.staffId;
    this.form = this.fb.group({
      withdrawalSetupId: [0],
      product: [""],
      presetChart: [false],
      accountType: [""],
      dailyWithdrawalLimit: [""],
      withdrawalCharges: [false],
      charge: [""],
      percentage: [0],
      structure: ['']
    });
    this.getAccountSetUp();
    this.getAccountType();
    this.getCompanyStructure()
  }
  getCompanyStructure() {
    this.loadingService.show();
    if (this.staffId == 0) {
      this.staffId = 1136;
    }
    return this.companyService.getCompanyStructureByStatffId(this.staffId).subscribe(data => {
      this.companyStructure = data.companyStructures;
      this.loadingService.hide();
    }, err => {
      this.loadingService.hide()
    })
  }
  getAccountSetUp() {
    this.loadingService.show();
    return this.depositService.getAllAccountSetup().subscribe(
      data => {
        this.loadingService.hide();
        this.accountSetUpProduct = data.depositAccounts;
      },
      err => {
        this.loadingService.hide();
      },
      () => { }
    );
  }
  getAccountType() {
    this.loadingService.show();
    return this.depositService.getAllAccountType().subscribe(
      data => {
        this.accountType = data.accountTypes;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  submitDetails(form: FormGroup) {
    let payload = form.value;
    payload.structure = parseInt(payload.structure);
    payload.product = parseInt(payload.product);
    payload.accountType = parseInt(payload.accountType);
    payload.dailyWithdrawalLimit = parseFloat(payload.dailyWithdrawalLimit);
    payload.amount = parseFloat(payload.amount);
    payload.presetChart = parseInt(payload.presetChart);
    this.loadingService.show();
    this.depositService.updateWithdrawalSetup(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          form.reset();
          this.router.navigateByUrl(`/deposit/withdrawal-setup-list`);
        } else {
          swal.fire(`GOS FINANCIAL`, message, 'error')
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, 'error')
      }
    );
  }

  goBack() {
    this.location.back();
  }

  getWithdrawalSetup(withdrawalSetupId: number) {
    this.loadingService.show();
    return this.depositService.getWithdrawalSetup(withdrawalSetupId).subscribe(
      data => {
        const row = data.withdrawalSetups[0];
        this.form = this.fb.group({
          withdrawalSetupId: [row.withdrawalSetupId],
          product: [row.product],
          presetChart: [row.presetChart],
          accountType: [row.accountType],
          dailyWithdrawalLimit: [row.dailyWithdrawalLimit],
          withdrawalCharges: [row.withdrawalCharges],
          charge: [row.charge],
          percentage: [row.percentage],
          structure: row.structure
        });
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
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
    this.chargesApplicable = this.form.get('withdrawalCharges').value;
    if (!this.chargesApplicable) {
      this.form.patchValue({
        chargesType: '',
        charge: ''
      })
    }
    this.chargesType = ''
  }
}
