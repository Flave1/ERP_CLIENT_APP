import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../../core/services/country.service';
import { LoadingService } from '../../../core/services/loading.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositAccountService } from '../../../core/services/depositaccount.service';
import swal from "sweetalert2";
import { Location } from '@angular/common';
import { CompanyService } from '../../../core/services/company.service';

@Component({
  selector: 'app-transaction-correction-setup',
  templateUrl: './transaction-correction-setup.component.html',
  styleUrls: []
})
export class TransactionCorrectionSetupComponent implements OnInit {
  jobTitleList: any[] = [];
  companyId: number;
  formTitle: string = "Transaction Correction Setup";
  form: FormGroup;
  transactionCorrectionSetupId: number;
  jobTitle: any;
  staffId: number;
  companyStructure: any[] = [];
  constructor(
    private countryService: CountryService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private depositService: DepositAccountService,
    private router: Router,
    private location: Location,
    private companyService: CompanyService
  ) {

  }

  ngOnInit() {
    this.getAllJobTitle();
    this.route.queryParams.subscribe(param => {
      this.transactionCorrectionSetupId = param.id;
      if (this.transactionCorrectionSetupId != undefined) {
        this.formTitle = 'Edit Transaction Correction Setup';
        this.getTransactionCorrectionSetup(this.transactionCorrectionSetupId);
      }
    });
    const emp = JSON.parse(localStorage.getItem("userDetails"));
    this.companyId = emp.companyId;
    this.staffId = emp.staffId;
    if (this.staffId == 0) {
      this.staffId = 1136;
    }
    this.form = this.fb.group({
      transactionCorrectionSetupId: [0],
      structure: [""],
      presetChart: [false],
      jobTitleId: [""],
      jobTitle: [""],
      lookupName: [""]
      // tellerTillIdPrefix: [""]
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
  getAllJobTitle() {
    this.loadingService.show();
    this.countryService.getAllJobTitle().subscribe(data => {
      this.loadingService.hide();
      this.jobTitleList = data.commonLookups;
    }, err => {
      this.loadingService.hide()
    });
  }

  submitDetails(form: FormGroup) {
    const payload = form.value;
    payload.structure = parseInt(payload.structure);
    payload.jobTitleId = parseInt(payload.jobTitleId);
    // return;
    this.loadingService.show();
    return this.depositService.updateTransactionCorrectionSetup(payload).subscribe(res => {
      var message = res.status.message.friendlyMessage;
      if (res.status.isSuccessful) {
        swal.fire('GOS FINANCIALS', message, 'success');
        this.loadingService.hide();
        this.router.navigateByUrl('/deposit/transaction-correction-setup-list')
      } else {
        swal.fire('GOS FINANCIALS', message, 'error')
      }
    }, err => {
      var message = err.status.message.friendlyMessage;
      this.loadingService.hide();
      swal.fire('GOS FINANCIALS', message, 'error')
    })
  }

  getTransactionCorrectionSetup(id: number) {
    this.loadingService.show();
    return this.depositService.getTransactionCorrectionSetup(id).subscribe(data => {
      const row = data.transactionCorrectionSetups[0];

      this.form.patchValue({
        transactionCorrectionSetupId: row.transactionCorrectionSetupId,
        structure: row.structure,
        presetChart: row.presetChart,
        jobTitleId: row.jobTitleId,
      })
      this.loadingService.hide();
    })
  }

  getDetails(event) {
    this.form.patchValue({
      jobTitleId: event.jobTitleId,
      jobTitle: event.name
    })
  }

  goBack() {
    this.location.back()
  }
}
