import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { Router } from '@angular/router';
import { InvestorFundService } from '../../../core/services/investor-fund.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-investmentslists',
  templateUrl: './investmentslists.component.html',
  styleUrls: ['./investmentslists.component.css'],
})
export class InvestmentslistsComponent implements OnInit {
  @ViewChild('myInput') myInputVariable: ElementRef;
  fileToUpload: File;
  investmentsLists: any[] = [];
  selectedLoanApplication: any = {};
  viewHeight: string = '600px';
  topForm: FormGroup;
  displayTopUp: Boolean = false;
  cols: any[];
  investorFundId: any;
  name: string = "";
  refNumber: string = "";
  constructor(
    private loadingService: LoadingService,
    public fb: FormBuilder,
    private router: Router,
    private investorFundService: InvestorFundService
  ) {
    this.topForm = this.fb.group({
      investorFundId: 0,
      proposedAmount: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.cols = [
      { field: 'refNumber', header: 'Ref No' },
      { field: 'investorName', header: 'Customer Name' },
      { field: 'approvedAmount', header: 'Principal Amount' },
      { field: 'payout', header: 'Expected Payout' },
      { field: 'effectiveDate', header: 'Effective Date' },
    ];
    this.getInvestments();
  }

  getInvestments() {
    this.loadingService.show();
    this.investorFundService.getInvestments().subscribe(
      (data) => {
        this.loadingService.hide();
        this.investmentsLists = data.investorFunds;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getApplicationStatus(approvalStatus) {
    if (approvalStatus == 0)
      return '<span class="span-label label-info"> Pending </span>';
    if (approvalStatus == 1)
      return '<span class="span-label label-success">Running</span>';
    if (approvalStatus == 2)
      return '<span class="span-label label-info">Matured</span>';
    if (approvalStatus == 3)
      return '<span class="span-label label-danger">Liquidated</span>';
    if (approvalStatus == 4)
      return '<span class="span-label label-warning">Closed </span>';

    return '<span class="span-label label-warning">N/A </span>';
  }
  // onRowSelect(event) {
  //     if (event.data.loanApplicationStatusId == 1) {
  //         this.router.navigate([
  //             "/credit/eligibility-check",
  //             event.data.loanApplicationId
  //         ]);
  //     }
  // }

  addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }
  getMaturityDate() {
    this.investmentsLists.forEach((investment) => {
      return this.addDays(new Date(), investment.period);
    });
  }
  collection(row) {
    this.router.navigate(['/investor/collection'], {
      queryParams: {
        investorId: row.investorFundCustomerId,
        investmentId: row.investorFundId,
      },
    });
  }
  liquidate(row) {
    this.router.navigate(['/investor/liquidate'], {
      queryParams: {
        investorId: row.investorFundCustomerId,
        investmentId: row.investorFundId,
      },
    });
  }

  rollover(x) {
    this.router.navigate(['/investor/rollover'], {
      queryParams: {
        investorId: x.investorFundCustomerId,
        investmentId: x.investorFundId,
      },
    });
  }

  topup(x) {
    this.displayTopUp = true;
    this.investorFundId = x.investorFundId;
  }

  submitTopUp(formValue) {
    const payload = formValue.value;
    payload.proposedAmount = parseFloat(payload.proposedAmount);
    payload.investorFundId = parseInt(this.investorFundId);

    swal
      .fire({
        title: 'Are you sure you want to top up?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((res) => {
        if (res.value) {
          this.loadingService.show();
          this.investorFundService.updateTopUp(payload).subscribe(
            (data) => {
              this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                this.getInvestments();
                this.displayTopUp = false;
                swal.fire('GOS FINANCIAL', message, 'success');
              } else {
                this.displayTopUp = false;
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.displayTopUp = false;
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            },
            () => {}
          );
        } else {
          return swal.fire('GOS FINANCIALS', 'Cancelled', 'error');
        }
      });
  }

  filterResults(value: any) {
    if (value >= 0) {
      this.loadingService.show();
      return this.investorFundService.getInvestmentByStatus(value).subscribe(
        (data) => {
          this.loadingService.hide();
          this.investmentsLists = data.investorFunds;
        },
        () => {
          this.loadingService.hide();
        }
      );
    } else {
      return this.getInvestments();
    }
  }
  showAddNew() {
    this.router.navigate(['/investor/investor-list-info']);
  }
  FVMethod(pv, i, n) {}
  calculateFutureValue(pv, interest, period) {
    const _pValue = parseFloat(pv);
    const _interest = parseFloat(interest);
    const _period = parseInt(period);
    let x = 1 + _interest / 100;
    let FV = _pValue * Math.pow(x, _period);
    return FV.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  exportFile() {
    this.loadingService.show();
    this.investorFundService.exportInvestments().subscribe((response) => {
      this.loadingService.hide();
      let data = response.export;
      if (data != undefined) {
        var byteString = atob(data);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);
        try {
          var file = new File([bb], 'Investments.xlsx', {
            type: 'application/vnd.ms-excel',
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel',
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Investments.xlsx');
        }
      }
    });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  async uploadInvestments() {
    if (this.fileToUpload == null) {
      return swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
    }
    if (
      this.fileToUpload.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return swal.fire('GOS FINANCIAL', 'Only excel files allowed', 'error');
    }
    this.loadingService.show();
    await this.investorFundService
      .uploadInvestments(this.fileToUpload)
      .then((data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.myInputVariable.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getInvestments();
        } else {
          this.myInputVariable.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        this.myInputVariable.nativeElement.value = '';
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  searchInvestments() {
    this.loadingService.show();
    return this.investorFundService
      .searchInvestments(this.refNumber, this.name)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          // const message = data.status.message.friendlyMessage;
          this.investmentsLists = data.investorFunds;
          // if (data.status.isSuccessful) {
          //
          // } else {
          //   swal.fire('GOS FINANCIAL', message, 'error');
          // }
        },
        (err) => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      );
  }
}
