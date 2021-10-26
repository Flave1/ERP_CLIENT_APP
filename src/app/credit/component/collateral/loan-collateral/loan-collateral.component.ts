import { Component, OnInit, Input } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { CollateralService } from "src/app/core/services/collateral.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoanApplicationService } from "src/app/core/services/loanapplication.service";
import { CustomerCollateralComponent } from "../customer-collateral/customer-collateral.component";

@Component({
  selector: "app-loan-collateral",
  templateUrl: "./loan-collateral.component.html"
})
export class LoanCollateralComponent implements OnInit {
  loanCollaterals: any[] = [];
  selectedLoanCollateral: any[];
  cols: any[];
  customerCollaterals: any[] = [];
  allowableCollateralTypes: any[] = [];
  customerCollateralsVerified: any[] = [];
  selectedLoanApplication: {};
  _loanApplicationId: any;
  customerId: any;
  requiredTotalCollateralAmount: number;
  showIfNotFromCollateralManager: boolean = false;
  get loanApplicationId(): number {
    return this._loanApplicationId;
  }
  @Input() set loanApplicationId(value: number) {
    this._loanApplicationId = value;
    if (value > 0) {
      // this.getAllCustomerCollateral(value);
      this.getAllCustomerCollateralVerificationStatusTrue(value, false);
      this.getAllLoanCollateral(value);

      this.collateralService
        .getRequireLoanCollateralAmount(this.loanApplicationId)
        .subscribe(data => {
          this.requiredTotalCollateralAmount = data.amount;
        }), err => {
        this.loadingService.hide()
      };
    }
  }
  displayModalForm: boolean = false;
  disableForm: boolean = false;
  form: FormGroup;
  formTitle: string = "Map Collaterals Loan";
  displayAddCollateral: boolean = false;
  viewHeight: any = "600px";
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private collateralService: CollateralService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loanApplicationService: LoanApplicationService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.loanApplicationId = params["loanapp"];
      this.customerId = params["obligor"];
      this._loanApplicationId = params["loanapp"];
      if (
        this.loanApplicationId != null ||
        this.loanApplicationId != undefined
      ) {
        // this.getAllCustomerCollateral(this.loanApplicationId);
        this.getAllCustomerCollateralVerificationStatusTrue(
          this.loanApplicationId,
          false
        );
        this.getAllLoanCollateral(this.loanApplicationId);
        // this.getAllCollateralConsumptions(this.loanApplicationId);
      }
    });
    this.cols = [
      { field: "collateralCode", header: "collateralCode" },
      { field: "collateralTypeName", header: "collateralTypeName" },
      {
        field: "collateralValue",
        header: "collateralValue"
      },
      { field: "actualCollateralValue", header: "actualCollateralValue" }
    ];

    this.initializeControl();
    this.checkRoutingComponent();
  }

  ProceedToApprovalFromCollateralManagement() {
    swal.fire('GOS FINANCIAL', 'Record saved successfully', 'success').then(() => {
      this.router.navigateByUrl('/loan-management/collateral')
    })
    // const __this = this;
    // swal
    //   .fire({
    //     title: "Are you sure you want to proceed to approval?",
    //     text: "You won't be able to revert this",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonText: "Yes!"
    //   })
    //   .then(result => {
    //     if (result.value) {
    //       __this.loadingService.show();
    //       __this.loanApplicationService
    //         .SubmitForApproval(__this.loanApplicationId)
    //         .subscribe(data => {
    //           __this.loadingService.hide();
    //           if (data["result"] == 1) {
    //             __this.router.navigate(["/loan-management/collateral"]);
    //             swal.fire("GOS FINANCIAL", data["message"], "success");
    //           } else {
    //             swal.fire("GOS FINANCIAL", data["message"], "error");
    //           }
    //         });
    //     } else {
    //     }
    //   });
  }

  checkRoutingComponent() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      let loanman = queryParams["loanman"];
      if (loanman == `+`) {
        this.showIfNotFromCollateralManager = true;
      }
    });
  }

  checkValueToDisable(dataObject) {
    if (
      dataObject.value.collateralCurrentAmount <
      dataObject.value.actualCollateralValue
    ) {
      if (dataObject.valid) {
        this.disableForm = true;
      }
    } else {
      this.disableForm = false;
    }
  }

  // getAllCollateralConsumptions(loanApplicationId : number){
  //     this.loadingService.show();
  //     this.collateralService
  //         .getAllCollateralByLoanApplicationId(loanApplicationId)
  //         .subscribe(data => {
  //             this.loadingService.hide();
  //             this.allLoanApplicationCollateral = data["result"];
  //         });
  // }

  initializeControl() {
    this.form = this.fb.group({
      collateralCustomerConsumptionId: [0],
      loanApplicationCollateralId: [0],
      collateralCustomerId: ["", Validators.required],
      loanApplicationId: [""],
      customerId: this.customerId,
      actualCollateralValue: [0, Validators.required],
      collateralCurrentAmount: [
        { disabled: true, value: "" },
        Validators.required
      ],
      amount: [0, Validators.required]
    });
  }
  onChangeOfCustomerCollateral($event) {
    this.getAllCustomerCollateralVerificationStatusTrue(
      this.loanApplicationId,
      false
    );
  }

  showAddNew() {
    this.initializeControl();
    this.displayModalForm = true;
  }

  showAddCollateral() {
    this.displayAddCollateral = true;
  }

  // getAllCustomerCollateral(loanApplicationId) {
  //     this.loadingService.show();
  //     this.collateralService
  //         .getCustomerCollateral(loanApplicationId, false)
  //         .subscribe(data => {
  //             this.loadingService.hide();
  //             this.customerCollaterals = data["result"];
  //         });
  // }

  onChangeCustomerCollateral(value, form) {
    this.loadingService.show();
    this.collateralService
      .getCollateralMappingViewLoanApplicationId(
        this.loanApplicationId,
        value,
        form.value.collateralCustomerConsumptionId
      )
      .subscribe(data => {
        this.loadingService.hide();
        let newFormState = data.collateralCustomerConsumption;
        this.form = this.fb.group({
          collateralCustomerConsumptionId: [
            newFormState.collateralCustomerConsumptionId
          ],
          loanApplicationCollateralId: [
            newFormState.loanApplicationCollateralId
          ],
          collateralCustomerId: [
            newFormState.collateralCustomerId,
            Validators.required
          ],
          loanApplicationId: [newFormState.loanApplicationId],
          customerId: [newFormState.customerId],
          actualCollateralValue: [
            newFormState.actualCollateralValue,
            Validators.required
          ],
          collateralCurrentAmount: [newFormState.collateralCurrentAmount],
          amount: [newFormState.amount]
        });
      }, err => {
        this.loadingService.hide()
      });
  }
  getAllCustomerCollateralVerificationStatusTrue(
    loanApplicationId,
    includeNotAllowSharing: boolean
  ) {
    this.loadingService.show();
    this.collateralService
      .getCustomerCollateral(loanApplicationId, true, includeNotAllowSharing)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.customerCollateralsVerified = data.collateralCustomers;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }

  getAllLoanCollateral(loanApplicationId) {
    this.loadingService.show();
    this.collateralService.getLoanCollateral(loanApplicationId).subscribe(
      data => {
        this.loadingService.hide();
        this.loanCollaterals = data.loanApplicationCollaterals;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  editLoanCollateral(row) {
    this.formTitle = "Edit Loan Collateral";
    let collateralCustomerId = row.collateralCustomerId;
    this.loadingService.show();
    this.collateralService
      .getCollateralMappingViewLoanApplicationId(
        this.loanApplicationId,
        collateralCustomerId,
        row.collateralCustomerConsumptionId
      )
      .subscribe(data => {
        this.getAllCustomerCollateralVerificationStatusTrue(
          this.loanApplicationId,
          true
        );
        this.loadingService.hide();
        let newFormState = data["result"];
        this.form = this.fb.group({
          collateralCustomerConsumptionId: [
            newFormState.collateralCustomerConsumptionId
          ],
          loanApplicationCollateralId: [
            newFormState.loanApplicationCollateralId
          ],
          collateralCustomerId: [
            newFormState.collateralCustomerId,
            Validators.required
          ],
          loanApplicationId: [newFormState.loanApplicationId],
          customerId: [newFormState.customerId],
          actualCollateralValue: [
            newFormState.actualCollateralValue,
            Validators.required
          ],
          collateralCurrentAmount: [newFormState.collateralCurrentAmount],
          amount: [newFormState.amount]
        });
      }, err => {
        this.loadingService.hide()
      });

    // this.form = this.fb.group({
    //     loanApplicationCollateralId: [row.loanApplicationCollateralId],
    //     collateralCustomerId: [row.collateralCustomerId,Validators.required],
    //     loanApplicationId: [row.loanApplicationId],
    //     actualCollateralValue: [row.actualCollateralValue,Validators.required],
    //     collateralCurrentAmount: [row.collateralCurrentAmount],
    //     amount: [row.amount],
    // });
    this.displayModalForm = false;
  }

  onRowSelect($event) {
    this.editLoanCollateral($event);
  }

  rowClicked(row: any): void {
    this.editLoanCollateral(row);
  }

  deleteLoanCollateral(row) {
    const __this = this;
    const __collateralCustomerConsumptionId = row.collateralCustomerConsumptionId;
    let body = {
      collateralCustomerConsumptionIds: [row.collateralCustomerConsumptionId]
    };
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.collateralService
            .deleteLoanConsumptionCollateral(body)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data.status.isSuccessful) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllLoanCollateral(this._loanApplicationId);
                this.getAllCustomerCollateralVerificationStatusTrue(
                  this.loanApplicationId,
                  false
                );
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            }, err => {
              this.loadingService.hide()
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  submitLoanCollateral(formObj) {
    this.loadingService.show();
    let body = {
      loanApplicationCollateralId: formObj.value.loanApplicationCollateralId,
      collateralCustomerConsumptionId:
      parseInt(formObj.value.collateralCustomerConsumptionId),
      collateralCustomerId: parseInt(formObj.value.collateralCustomerId),
      loanApplicationId: parseInt(this._loanApplicationId),
      actualCollateralValue: parseInt(formObj.value.actualCollateralValue),
      customerId: parseInt(this.customerId),
      loanApplicationRefNo: 0,
      collateralCurrentAmount: parseInt(formObj.value.collateralCurrentAmount),
      amount: parseInt(formObj.value.amount)
    };
    this.collateralService
      .addUpdateCustomerLoanCollateralConsumption(body)
      .subscribe(
        data => {
          this.loadingService.hide();
          if (data.status.isSuccessful == true) {
            this.getAllLoanCollateral(this._loanApplicationId);
            swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "success");
            this.displayModalForm = false;
          } else {
            swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
          }

          this.getAllCustomerCollateralVerificationStatusTrue(
            this.loanApplicationId,
            false
          );
        },
        err => {
          this.loadingService.hide();
          swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
        }
      );
  }

  ProceedToApproval() {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to proceed to approval?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();
          __this.loanApplicationService
            .SubmitForApproval(__this.loanApplicationId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data.responseId == 1) {
                __this.router.navigate(["/credit/application-list"]);
                swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "success");
              } else {
                swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
              }
            }, err => {
              this.loadingService.hide()
            });
        } else {
        }
      });
  }


}
