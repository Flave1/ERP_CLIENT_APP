import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DepositAccountOpeningService } from "../../../core/services/depositaccountopening.service";
import swal from "sweetalert2";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { CompanyService } from "src/app/core/services/company.service";

@Component({
  selector: "app-change-of-rate-form",
  templateUrl: "./change-of-rate-form.component.html",
  styleUrls: ["./change-of-rate-form.component.css"]
})
export class ChangeOfRateFormComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Change of Rate";
  searchResults: any[];
  AccountName: any;
  companyId: Number;
  filteredSearchResults: any[];
  displaySearchModal: boolean = false;
  accountSetUpProduct: any[] = [];
  companyStructure: any[] = [];
  selectedProdVal: number = 0;
  staffId: number = 0;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private DepositFormService: DepositAccountOpeningService,
    private route: ActivatedRoute,
    private CustomerService: DepositAccountOpeningService,
    private depositAccountService: DepositAccountService,
    private companyService: CompanyService
  ) {
    this.form = this.fb.group({
      changeOfRateId: [0],
      structure: [0],
      product: [""],
      currentRate: [""],
      proposedRate: [""],
      reasons: [""],
      approverComment: [""],
      approverName: [""]
    });
  }

  ngOnInit() {
    const emp = JSON.parse(localStorage.getItem("userDetails"));
    this.companyId = emp.companyId;
    this.staffId = emp.staffId;
    if (this.staffId == 0) {
      this.staffId = 1136;
    }
    this.route.queryParams.subscribe(params => {
      let ChangeOfRateId = params["ChangeOfRateId"];
      if (ChangeOfRateId != null || ChangeOfRateId != undefined) {
        this.editChangeOfRate(ChangeOfRateId);
      }
    });
    this.getAccountSetUp();
    this.getCompanyStructure();

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
  onProductChange(val) {

    const item = this.accountSetUpProduct.find(item => item.depositAccountId == val);
    this.form.patchValue({
      product: item.depositAccountId,
      currentRate: item.interestRate
    })
  }

  getAccountSetUp() {
    return this.depositAccountService.getAllAccountSetup().subscribe(
      data => {
        this.accountSetUpProduct = data.depositAccounts;
      },
      err => {
      },
      () => { }
    );
  }

  editChangeOfRate(changeOfRateId) {
    this.formTitle = "Edit Deposit Form";
    this.loadingService.show();
    this.depositAccountService.getChangeOfrate(changeOfRateId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.changeOfRates[0];
        this.selectedProdVal = row.product;
        this.form = this.fb.group({
          changeOfRateId: [row.changeOfRateId],
          structure: [row.structure],
          product: [row.product],
          currentRate: [row.currentRate],
          proposedRate: [row.proposedRate],
          reasons: [row.reasons],
          approverComment: [row.approverComment],
          approverName: [row.approverName]
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(["/deposit/changeofrateform-list"]);
  }

  submitChangeOfRate(formObj) {
    const payload = formObj.value;
    payload.structure = parseInt(payload.structure);
    payload.product = parseInt(payload.product);
    payload.currentRate = parseInt(payload.currentRate);
    payload.proposedRate = parseInt(payload.proposedRate);
    if (!payload.product) {
      return swal.fire("GOS FINANCIAL", "Select a product", "error");
    }
    if (!payload.currentRate) {
      return swal.fire("GOS FINANCIAL", "Enter current rate", "error");
    }
    if (isNaN(payload.currentRate)) {
      return swal.fire("GOS FINANCIAL", "Enter a valid number", "error");
    }
    if (!payload.proposedRate) {
      return swal.fire("GOS FINANCIAL", "Enter proposed rate", "error");
    }
    if (isNaN(payload.proposedRate)) {
      return swal.fire("GOS FINANCIAL", "Enter a valid number", "error");
    }
    if (!payload.reasons) {
      return swal.fire("GOS FINANCIAL", "Enter reason for change", "error");
    }
    payload.structure = this.companyId;
    this.loadingService.show();
    payload.structure = this.companyId;
    this.depositAccountService.updateDepositRateChange(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/deposit/changeofrateform-list"]);
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


  searchDB(value: any) {

  }
}
