import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositAccountService } from '../../../core/services/depositaccount.service';
import { LoadingService } from '../../../core/services/loading.service';
import swal from "sweetalert2";
import { CompanyService } from '../../../core/services/company.service';
import {StaffInfoService} from '../../../core/services/staff.service';

@Component({
  selector: 'app-callover-setup',
  templateUrl: './callover-setup.component.html',
  styleUrls: ['./callover-setup.component.css']
})
export class CalloverSetupComponent implements OnInit {
  formTitle: string = 'Callover Setup';
  form: FormGroup;
  accountSetUpProduct: any[] = [];
  companyId: number;
  depositCashierTellerSetupId: number;
  staffId: number;
  companyStructure: any[] = [];
  staffs: any[] = [];
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private depositService: DepositAccountService,
    private loadingService: LoadingService,
    private router: Router,
    private companyService: CompanyService,
    private staffService: StaffInfoService
  ) { }

  ngOnInit() {
    const emp = JSON.parse(localStorage.getItem("userDetails"));
    this.companyId = emp.companyId;
    this.staffId = emp.staffId;
   
    this.route.queryParams.subscribe(param => {
      this.depositCashierTellerSetupId = param.depositCashierTellerSetupId;
      if (this.depositCashierTellerSetupId != undefined) {
        this.formTitle = 'Edit Callover Setup';
        this.getCalloverSetup(this.depositCashierTellerSetupId);
      }
    });
    this.form = this.fb.group({
      depositCashierTellerSetupId: [0],
      structure: [""],
      productId: [""],
      productName: [""],
      presetChart: [false],
      sub_strructure: [''],
      employee_ID: [0]
    });
    this.getStaffs();
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
    this.loadingService.show();
    return this.depositService.getAllAccountSetup().subscribe(data => {
      this.loadingService.hide();
      this.accountSetUpProduct = data.depositAccounts;
    }, err => {
      this.loadingService.hide();

    }, () => { })
  }
  getCalloverSetup(id: number) {
    this.loadingService.show();
    return this.depositService.getCalloverSetup(id).subscribe(data => {
      this.loadingService.hide();
      const row = data.depositCashierTellerSetups[0];
      this.form = this.fb.group({
        depositCashierTellerSetupId: [row.depositCashierTellerSetupId],
        structure: row.structure,
        productId: [row.productId],
        productName: [row.productName],
        presetChart: [row.presetChart],
        sub_strructure: [row.cashier_numer],
        employee_ID: [row.employee_ID]
      })
    }, err => {
      this.loadingService.hide();
    })
  }
  submitDetails(form: FormGroup) {
    const payload = form.value;
    this.loadingService.show();
    payload.structure = parseInt(payload.structure);
    payload.productId = parseInt(payload.productId);
    payload.employee_ID = +payload.employee_ID
    return this.depositService.updateCalloverSetup(payload).subscribe(
      res => {
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          this.loadingService.hide();
          swal.fire('GOS FINANCIALS', message, 'success').then(() => {
            form.reset();
            this.router.navigate(['/deposit/callover-setup-list'])
          });
        } else {
          swal.fire('GOS FINANCIALS', message, 'error').then(() => {
            this.router.navigate(['/deposit/callover-setup-list'])
          });
        }

      }, err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIALS', message, 'error');
      })
  }
  getStaffs() {
    this.loadingService.show();
    return this.staffService.getAllStaff().subscribe(data => {
      this.staffs = data.staff;
      this.loadingService.hide()
    }, err => {
      this.loadingService.hide()
    })
  }
  goBack() {
    this.location.back()
  }
}
