import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { CustomerFsService } from "src/app/core/services/customer-fs.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-loan-customer-fs-ratio-detail",
  templateUrl: "./loan-customer-fs-ratio-detail.component.html"
})
export class LoanCustomerFsRatioDetailComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add FS Ratio Detail";
  fSCaptionGroupList: any[];
  fsCaptionList: any[];
  valueTypeList: any[];
  divisorTypeList: any[];

  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private customerFsService: CustomerFsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      ratioDetailId: [0],
      ratioName: ["", Validators.required],
      description: [""]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let ratioDetailId = params["editratiodetail"];
      if (ratioDetailId != null || ratioDetailId != undefined) {
        this.editFSRatioDetail(ratioDetailId);
      }
    });
    // this.getAllCustomerFSRatioCaption();
    this.getAllCustomerFSCaptionGroup();
    // this.getAllValueTypes();
    // this.getAllDivisorTypes();
  }

  getAllCustomerFSCaptionGroup() {
    this.loadingService.show();
    this.customerFsService.getAllCustomerFSCaptionGroupWithoutRatio().subscribe(
      data => {
        this.loadingService.hide();
        this.fSCaptionGroupList = data.loanCustomerFSGroup;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  onChangeCaptionGroupId(fsCaptionGroupId: number) {
    this.getFSCaptionByCaptionGroupId(fsCaptionGroupId);
  }

  clear(value) {
    let description = "";
    this.loadingService.show();
    this.form = this.fb.group({
      ratioDetailId: [value.ratioDetailId],
      description: [description],
      ratioName: [value.ratioName, Validators.required]
    });

    this.loadingService.hide();
  }

  operationsSign(sign, value) {
    let description = value.description + " " + sign;
    this.loadingService.show();
    this.form = this.fb.group({
      ratioDetailId: [value.ratioDetailId],
      description: [description],
      ratioName: [value.ratioName, Validators.required]
    });

    this.loadingService.hide();
  }

  onChangeCaptionId(value, targetId) {
    let description =
      value.description +
      " " +
      "[" +
      this.fsCaptionList.find(x => x.fsCaptionId == targetId).fsCaptionName +
      "]";
    this.loadingService.show();
    this.form = this.fb.group({
      ratioDetailId: [value.ratioDetailId],
      description: [description],
      ratioName: [value.ratioName, Validators.required]
    });

    this.loadingService.hide();
  }

  getFSCaptionByCaptionGroupId(id: number) {
    if (id == 0 || id == null) {
      this.fsCaptionList = [];
      return;
    }
    this.loadingService.show();
    this.customerFsService.getAllCustomerFSCaptionByCaptionGroup(id).subscribe(
      data => {
        this.loadingService.hide();
        this.fsCaptionList = data.loanCustomerFSCaption;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getAllCustomerFSRatioCaption() {
    this.loadingService.show();
    this.customerFsService.getAllCustomerFSRatioCaption().subscribe(
      data => {
        this.loadingService.hide();
        this.fSCaptionGroupList = data.loanCustomerFSRatioDetail;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getAllValueTypes() {
    this.loadingService.show();
    this.customerFsService.getAllValueTypes().subscribe(data => {
      this.loadingService.hide();
      this.valueTypeList = data.result;
    });
  }

  getAllDivisorTypes() {
    this.loadingService.show();
    this.customerFsService.getAllDivisorTypes().subscribe(data => {
      this.loadingService.hide();
      this.divisorTypeList = data.result;
    });
  }

  editFSRatioDetail(ratioDetailId) {
    this.formTitle = "Edit FS Ratio Detail";
    this.loadingService.show();
    this.customerFsService
      .getSingleFSCaptionRatioDetail(ratioDetailId)
      .subscribe(data => {
        this.loadingService.hide();
        let row = data.loanCustomerFSRatioDetail[0];
        this.form = this.fb.group({
          ratioDetailId: [row.ratioDetailId],
          description: [row.description],
          ratioName: [row.ratioName, Validators.required]
        });
      });
  }

  goBack() {
    this.router.navigate(["/credit/loan-customer-fscaption-ratio-detail-list"]);
  }

  //Work on this method
  submitFSCaptionRatioDetail(formObj) {
    const payload = formObj.value;
    this.loadingService.show();
    this.customerFsService
      .addUpdateFSCaptionRatioDetail(payload)
      .subscribe(
        data => {
          this.loadingService.hide();
          const message = data.status.message.friendlyMessage;
          if (data.status.isSuccessful) {
            swal.fire("GOS FINANCIAL", message, "success");
            this.router.navigate([
              "/credit/loan-customer-fscaption-ratio-detail-list"
            ]);
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
}
