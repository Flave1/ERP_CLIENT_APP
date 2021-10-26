import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import swal from "sweetalert2";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { CompanyService } from "src/app/core/services/company.service";

@Component({
  selector: "app-change-of-rate",
  templateUrl: "./change-of-rate.component.html",
  styleUrls: ["./change-of-rate.component.css"]
})
export class ChangeOfRateComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Change of Rate";
  accountSetUpProduct: any[] = [];
  companyId: any;
  changeOfRateSetupId: number;
  staffId:number;
  companyStructures : any[] = [];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private DepositAccountService: DepositAccountService,
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {
    this.form = this.fb.group({
      changeOfRateSetupId: [0],
      structure: this.companyId,
      canApply: [false],
      productId: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      this.changeOfRateSetupId = param.changeOfRateSetupId;
      if (this.changeOfRateSetupId != undefined) {
        this.getChangeOfRateSetup(this.changeOfRateSetupId);
      }
    });
    const emp = JSON.parse(localStorage.getItem("userDetails"));
    this.companyId = emp.companyId;
    this.companyId = emp.companyId; 
    this.getCompaniesByStaffid(emp.staffId);
    this.getAccountSetUp();
  }
  getAccountSetUp() {
    this.loadingService.show();
    return this.DepositAccountService.getAllAccountSetup().subscribe(
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

  getChangeOfRateSetup(setupId) {
    this.formTitle = "Edit Transaction Charge";
    this.loadingService.show();
    this.DepositAccountService.getChangeOfRateSetup(setupId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.changeOfRateSetups[0];
        this.form = this.fb.group({
          changeOfRateSetupId: [row.changeOfRateSetupId],
          structure: row.structure,
          canApply: [row.canApply],
          productId: [row.productId]
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(["/deposit/changeofrate-list"]);
  }




  submitChangeOfRate(formObj) {
    const payload = formObj.value;
    if (!payload.productId) {
      return swal.fire("GOS FINANCIAL", "Select a product", "error");
    }
    payload.structure = parseInt(payload.structure);
    payload.productId = parseInt(payload.productId);
    this.loadingService.show();
    this.DepositAccountService.changeOfRateSetUp(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOSFINANCIAL", message, "success");
          this.router.navigate(["/deposit/changeofrate-list"]);
        } else {
          swal.fire("GOSFINANCIAL", message, "error");
        }
        // if (data["result"] == true) {
        //   swal.fire("GOSFINANCIAL", data["message"], "success");
        //   this.router.navigate(["/deposit/category-list"]);
        // } else {
        //   swal.fire("GOSFINANCIAL", data["message"], "error");
        // }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSFINANCIAL", message, "error");
      }
    );
  }

  getCompaniesByStaffid(staffId) {
    return this.companyService.getCompanyStructureByStatffId(staffId).subscribe(data => {
      this.companyStructures = data.companyStructures; 
      this.loadingService.hide();
    }, err => {
      this.loadingService.hide();
    })
  }
}
