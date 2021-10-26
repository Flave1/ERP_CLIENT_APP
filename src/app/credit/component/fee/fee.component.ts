import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Validator } from '@angular/forms';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FeeService } from 'src/app/core/services/fee.service';
import { SubGLService } from 'src/app/core/services/subgl.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: "app-fee",
  templateUrl: "./fee.component.html"
})
export class FeeComponent implements OnInit {
  repaymentTypeInformation: any[] = [];
  IndustryInformation: any[] = [];
  checkedIsTotalLine = false;
  form: FormGroup;
  formTitle = 'Add Fee Information';
  amountTitle = '';
  accountList: any[] = [];
  contentEditable = true;
  glArr: SelectItem[] = [];
  selectedGl: any;
  totalFeeGL: any;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private feeService: FeeService,
    private router: Router,
    private route: ActivatedRoute,
    private subGLService: SubGLService
  ) {
    this.form = this.fb.group({
      feeId: [0],
      feeName: ["", Validators.required],
      isIntegral: [false],
      totalFeeGL: [0],
      passEntryAtDisbursment: [false]
    });
    this.glArr = [];
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let feeId = params["editfee"];
      if (feeId != null || feeId != undefined) {
        this.editFee(feeId);
      }
    });
    this.getAllGLAccount();
  }

  getAllGLAccount() {
    this.subGLService.getAllSubGL().subscribe(
      data => {
        this.accountList = data.subGls;
        this.glArr = this.accountList.map(item => (
          {label: `${item.subGLName} | ${item.subGLCode}`, value: item.subGLId}
        ));
      },
      err => {
        this.loadingService.hide()
      }
    );
  }

  onFeeTypeChange(feeType) {
    if (feeType == 1) {
      this.amountTitle = "Fixed";
    } else {
      this.amountTitle = "Percentage";
    }
  }

  editFee(feeId) {
    this.formTitle = "Edit Fee Information";
    this.loadingService.show();
    this.feeService.getFee(feeId).subscribe(
      data => {
        this.loadingService.hide();
        const row = data.fees[0];
        const { feeId, feeName, isIntegral, totalFeeGL, passEntryAtDisbursment } = row;
        this.form.patchValue({
          feeId: feeId,
          feeName: feeName,
          isIntegral: isIntegral,
          passEntryAtDisbursment: passEntryAtDisbursment,
          totalFeeGL : totalFeeGL,
        });
        // this.form.get('feeId').setValue(feeId);
        // this.form.get('feeName').setValue(feeName);
        // this.form.get('isIntegral').setValue(isIntegral);
        // this.form.get('passEntryAtDisbursment').setValue(isIntegral);
        // this.form.get('totalFeeGL').setValue(totalFeeGL);
        // this.form = this.fb.group({
        //     feeId: row.feeId,
        //     feeName: [row.feeName, Validators.required],
        //     isIntegral: row.isIntegral,
        // });
        this.selectedGl = totalFeeGL;
        this.onFeeTypeChange(row.feeType);
        this.integralChecked(row.isIntegral);
      },
      err => {
        this.loadingService.hide();
      },
      () => {}
    );
  }

  integralChecked(row) {
    if (row == false) {
      this.contentEditable = true;
    } else {
      this.contentEditable = false;
    }
  }

  goBack() {
    this.router.navigate(["/credit/fee-list"]);
  }
  submitFeeInfo(formObj) {
    this.loadingService.show();

    this.feeService.updateFee(formObj.value).subscribe(
      data => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/credit/fee-list"]);
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        let message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
  toggleEditable(event) {
    if (event.target.checked == false) {
      this.contentEditable = true;
    } else {
      this.contentEditable = false;
    }
  }
}
