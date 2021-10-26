import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { ActivatedRoute, Router } from "@angular/router";
import swal from "sweetalert2";
import { CompanyService } from "src/app/core/services/company.service";

@Component({
  selector: "app-bank-closure-setup",
  templateUrl: "./bank-closure-setup.component.html",
  styleUrls: ["./bank-closure-setup.component.css"]
})
export class BankClosureSetupComponent implements OnInit {
  formTitle: string = "Bank Closure Set up";
  form: FormGroup;
  bankClosureSetupId: number;
  accountSetUpProduct: any[] = [];
  bankClosureSetups: any[] = [];
  companyStructures: any[] = [];
  companyId: any;
  staffId: any;
  isfixed: boolean = false;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private depositService: DepositAccountService,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    const emp = JSON.parse(localStorage.getItem("userDetails"));
    this.companyId = emp.companyId;
    this.staffId = emp.staffId;
    if (this.staffId == 0) {
      this.staffId = 1136;
    }
    this.form = this.fb.group({
      bankClosureSetupId: [0],
      structure: [""],
      productId: [""],
      closureChargeApplicable: [false],
      charge: [""],
      percentage: [0],
      settlementBalance: [false],
      presetChart: [false]
    });
    this.route.queryParams.subscribe(param => {
      this.bankClosureSetupId = param.bankClosureSetupId;
      if (this.bankClosureSetupId != undefined) {
        this.formTitle = "Edit Bank Closure Setup";
        this.getBankClosureSetup(this.bankClosureSetupId);
      }
    });
    this.getAccountSetUp();
    this.getCompanies();
  }

  onChargeChange(val) {
    if (val == 'fixed') {
      this.isfixed = true;
      return;
    }
    this.isfixed = false;
    return;
  }
  goBack() {
    this.router.navigateByUrl("/deposit/bankclosure-setup-list");
  }

  getCompanies() {
    return this.companyService.getCompanyStructureByStatffId(this.staffId).subscribe(data => {
      this.loadingService.hide();
      this.companyStructures = data.companyStructures;
    }, err => {
      this.loadingService.hide();
    })
  }
  getClosureSetUp() {
    return this.depositService.getBankClosureSetups().subscribe(
      data => {
        this.bankClosureSetups = data.bankClosureSetups;
      },
      err => {

      },
      () => { }
    );
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
  getBankClosureSetup(id: number) {
    this.loadingService.show();
    return this.depositService.getBankClosureSetup(id).subscribe(
      data => {
        this.loadingService.hide();
        const row = data.bankClosureSetups[0];
        this.form = this.fb.group({
          bankClosureSetupId: [row.bankClosureSetupId],
          structure: [row.structure],
          productId: [row.productId],
          closureChargeApplicable: [row.closureChargeApplicable],
          charge: [row.charge],
          percentage: [row.percentage],
          settlementBalance: [row.settlementBalance],
          presetChart: [row.presetChart]
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }




  submitDetails(form: FormGroup) {
    const payload = form.value;
    payload.percentage = parseInt(payload.percentage);
    payload.productId = parseInt(payload.productId);
    payload.structure = parseInt(payload.structure);
    this.loadingService.show();
    return this.depositService.updateBankClosureSetup(payload).subscribe(
      res => {
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIALS", message, "success");
          this.router.navigateByUrl("/deposit/bankclosure-setup-list");
          this.getAccountSetUp();
          this.loadingService.hide();
        } else {
          this.loadingService.hide();
          swal.fire("GOS FINANCIALS", message, "error");
        }
      },
      err => {
        const message = err.status.message.friendlyMessage;
        this.loadingService.hide();
        swal.fire("GOS FINANCIALS", message, "error");
      }
    );
  }
}
