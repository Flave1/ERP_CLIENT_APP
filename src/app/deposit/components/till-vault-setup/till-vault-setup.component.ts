import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Location } from "@angular/common";
import { LoadingService } from "../../../core/services/loading.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { ActivatedRoute, Router } from '@angular/router';
import swal from "sweetalert2";
import { CompanyService } from '../../../core/services/company.service';

@Component({
  selector: "app-till-vault-setup",
  templateUrl: "./till-vault-setup.component.html",
  styleUrls: ["./till-vault-setup.component.css"]
})
export class TillVaultSetupComponent implements OnInit {
  formTitle: string = "Till and Vault Setup";
  form: FormGroup;
  companyId: number;
  tillVaultSetupId: number;
  staffId: number;
  companyStructure: any[] = [];
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private depositService: DepositAccountService,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      this.tillVaultSetupId = param.id;
      if (this.tillVaultSetupId != undefined) {
        this.formTitle = 'Edit Till and Vault Setup';
        this.getTillVaultSetup(this.tillVaultSetupId);
      }
    });
    const emp = JSON.parse(localStorage.getItem("userDetails"));
    this.companyId = emp.companyId;
    this.staffId = emp.staffId;
    if (this.staffId == 0) {
      this.staffId = 1136;
    }
    this.form = this.fb.group({
      tillVaultSetupId: [0],
      structure: [""],
      presetChart: [false],
      structureTillIdPrefix: [""],
      tellerTillIdPrefix: [""]
    });
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
  getTillVaultSetup(id: number) {
    this.loadingService.show();
    return this.depositService.getTillVaultSetup(id).subscribe(data => {
      const row = data.tillVaultSetups[0];
      this.form = this.fb.group({
        tillVaultSetupId: row.tillVaultSetupId,
        structure: row.structure,
        presetChart: [row.presetChart],
        structureTillIdPrefix: [row.structureTillIdPrefix],
        tellerTillIdPrefix: [row.tellerTillIdPrefix]
      });
      this.loadingService.hide();
    });
  }
  submitDetails(form: FormGroup) {
    const payload = form.value;
    payload.structure = parseInt(payload.structure);
    if (!payload.structureTillIdPrefix) {
      return swal.fire('GOS FINANCIALS', 'Structure Till ID Prefix is required', 'error')
    }
    if (!payload.tellerTillIdPrefix) {
      return swal.fire('GOS FINANCIALS', 'Teller Till ID Prefix is required', 'error')
    }
    this.loadingService.show();
    return this.depositService.updateTillVaultSetup(payload).subscribe(res => {
      var message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire('GOS FINANCIALS', message, 'success');
        form.reset();
        this.loadingService.hide();
        this.router.navigate(['/deposit/till-vault-setup-list'])
      } else {
        swal.fire('GOS FINANCIALS', message, 'error')

      }
    }, err => {
      this.loadingService.hide();
      var message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIALS', message, 'error')
    })
  }

  goBack() {
    this.location.back()
  }
}
