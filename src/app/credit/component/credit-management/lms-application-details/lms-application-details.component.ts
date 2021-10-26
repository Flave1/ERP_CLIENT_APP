import { DataService } from '../../../../core/services/data.service';
import { LmsService } from './../../../../core/services/lms.service';
import { Component, OnInit, Input } from '@angular/core';
import { LoanApplicationService } from 'src/app/core/services/loanapplication.service';
import { ProductService } from 'src/app/core/services/product.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import swal from 'sweetalert2';
import { LoanScheduleService } from 'src/app/core/services/loanschedule';
import { LoanService } from 'src/app/core/services/loan.service';

@Component({
  selector: 'app-lms-application-details',
  templateUrl: './lms-application-details.component.html',
})
export class LmsApplicationDetailsComponent implements OnInit {
  activeIndex: number = 0;
  loanReviewApplicationDetail: any = {};
  proposedDetails: any[] = [];
  _loanReviewApplicationId: number;
  _loanId: any;
  approvedDetails: any[] = [];
  frequencyList: any[] = [];
  frequencyList1: any[] = [];
  products: any[] = [];
  frequencies: any[];
  frequencies1: any[];
  tenor: any = localStorage.getItem('Tenor');
  totalP: any = localStorage.getItem('TotalP');
  editingMode: boolean = false;
  @Input() caneditPrivilege: boolean = false;
  @Input() pOperation: boolean = false;
  recommendations: any[] = [];
  selectedLoan: any = {};
  get loanReviewApplicationId(): number {
    return this._loanReviewApplicationId;
  }
  get loanId(): number {
    return this._loanId;
  }
  @Input() set loanId(value: number) {
    this._loanId = value;
    if (value > 0) {
      //this.loanId = value;
      this.getLoanDetailInformation(value);
    }
  }
  @Input() set loanReviewApplicationId(value: number) {
    this._loanReviewApplicationId = value;
    if (value > 0) {
      // this.getSingleLoanReviewApplicationDetail(value);
      this.getRecommendations(value);
    }
  }
  clonedObject: { [s: string]: any } = {};
  constructor(
    private loanApplicationService: LoanApplicationService,
    private productService: ProductService,
    private loadingService: LoadingService,
    private lmsService: LmsService,
    private loanScheduleService: LoanScheduleService,
    private dataService: DataService,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    this.getFrequencyTypes();
    this.getFrequencyTypes1();
    this.getLoanDetailInformation(this.loanId);
  }

  getLoanDetailInformation(loanId) {
    this.loadingService.show();
    this.loanService.getLoanDetailInformation(loanId).subscribe(
      (data) => {
        this.loadingService.hide();
        this.selectedLoan = data.loanDetail;
        var mDate: any = new Date(this.selectedLoan.maturityDate).getTime();
        var today: any = new Date().getTime();
        var newdate = mDate - today;
        this.tenor = Math.round(newdate / (1000 * 3600 * 24));
        this.totalP = Math.abs(
          this.selectedLoan.outstandingPrincipal +
            this.selectedLoan.outstandingInterest
        ).toFixed(2);
        localStorage.setItem('Tenor', this.tenor);
        localStorage.setItem('TotalP', this.totalP);
      },
      (err) => {
        this.loadingService.hide();
      },
      () => {
        this.getSingleLoanReviewApplicationDetail(
          this._loanReviewApplicationId
        );
      }
    );
  }

  getSingleLoanReviewApplicationDetail(loanReviewAppId) {
    // const tenor = localStorage.getItem('Tenor');
    // const totalP = localStorage.getItem('TotalP');
    this.lmsService
      .getSingleLoanReviewApplication(loanReviewAppId)
      .subscribe((data) => {
        this.approvedDetails = [];
        this.proposedDetails = [];
        this.loanReviewApplicationDetail = data.loanReviewApplication[0];
        let proposed = {
          amount: this.loanReviewApplicationDetail.proposedAmount,
          tenor: this.loanReviewApplicationDetail.proposedTenor,
          rate: this.loanReviewApplicationDetail.proposedRate,
          interestFrequency: this.loanReviewApplicationDetail.interestFrequency,
          firstInterestPaymentDate: new Date(
            this.loanReviewApplicationDetail.firstInterestPaymentDate
          ),
          principalFrequency: this.loanReviewApplicationDetail
            .principalFrequency,
          firstPrincipalPaymentDate: new Date(
            this.loanReviewApplicationDetail.firstPrincipalPaymentDate
          ),
          principalFrequencyName: this.loanReviewApplicationDetail
            .principalFrequencyName,
          interestFrequencyName: this.loanReviewApplicationDetail
            .interestFrequencyName,
        };
        this.proposedDetails.push(proposed);
        let approved = {
          loanReviewApplicationId: this.loanReviewApplicationDetail
            .loanReviewApplicationId,
          amount: this.totalP,
          new_amount: Math.abs(
            this.totalP - this.loanReviewApplicationDetail.prepayment
          ),
          tenor: this.tenor,
          prepayment: this.loanReviewApplicationDetail.prepayment,
          rate: this.loanReviewApplicationDetail.approvedRate,
          interestFrequency: this.loanReviewApplicationDetail.interestFrequency,
          firstInterestPaymentDate: this.formatDate(
            this.loanReviewApplicationDetail.firstInterestPaymentDate
          ),
          principalFrequency: this.loanReviewApplicationDetail
            .principalFrequency,
          firstPrincipalPaymentDate: this.formatDate(
            this.loanReviewApplicationDetail.firstPrincipalPaymentDate
          ),
          principalFrequencyName: this.loanReviewApplicationDetail
            .principalFrequencyName,
          interestFrequencyName: this.loanReviewApplicationDetail
            .interestFrequencyName,
        };
        this.approvedDetails.push(approved);
        console.log("app", approved)
        this.dataService.getRealData.emit(approved);
        //this.dataService.getScheduleData.emit(this.recommendations[0]);
      });
  }

  getRecommendations(loanReviewApplicationId) {
    this.lmsService
      .getLoanReviewLog(loanReviewApplicationId)
      .subscribe((data) => {
        this.recommendations = data.loanRecommendationLog;
        console.log("recommend", this.recommendations[0])
        this.dataService.getScheduleData.emit(this.recommendations[0]);
      });
  }

  getFrequencyTypes() {
    this.loanScheduleService.getAllFrequencyTypes().subscribe((res) => {
      this.frequencies = res.lookUp;
      if (this.frequencies != null || this.frequencies != undefined) {
        this.frequencyList = [];
        this.frequencies.forEach((el) => {
          let info = {
            label: el.lookupName,
            value: el.lookupId,
          };
          this.frequencyList.push(info);
        });
      }
    });
  }

  getFrequencyTypes1() {
    this.loanScheduleService.getAllFrequencyTypes().subscribe((res) => {
      this.frequencies1 = res.lookUp;
      if (this.frequencies1 != null || this.frequencies1 != undefined) {
        this.frequencyList1 = [];
        this.frequencies1.forEach((el) => {
          let info = {
            label: el.lookupName,
            value: el.lookupId,
          };
          this.frequencyList1.push(info);
        });
      }
    });
  }

  onTabChange(e) {
    this.activeIndex = e.index;
  }

  openNext() {
    this.activeIndex = this.activeIndex === 5 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 5 : this.activeIndex - 1;
  }

  onRowEditInit(formObj: any) {
    this.editingMode = true;
    this.clonedObject[formObj.loanReviewApplicationId] = { ...formObj };
  }

  onRowEditSave(formObj: any) {
    this.loadingService.show();
    let body = {
      loanApplicationId: this.loanReviewApplicationId,
      approvedProductId: formObj.productId,
      approvedTenor: parseInt(formObj.tenor),
      approvedRate: parseInt(formObj.rate),
      approvedAmount: parseInt(formObj.amount),
      interestFrequency: parseInt(formObj.interestFrequency),
      firstInterestPaymentDate: formObj.firstInterestPaymentDate,
      principalFrequency: parseInt(formObj.principalFrequency),
      firstPrincipalPaymentDate: formObj.firstPrincipalPaymentDate,
    };
    this.lmsService.addLoanReviewLog(body).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data.status.isSuccessful == true) {
          this.getRecommendations(this.loanReviewApplicationId);
          this.getSingleLoanReviewApplicationDetail(
            this.loanReviewApplicationId
          );
          this.onRowEditCancel(formObj, 0);
          this.dataService.getData.emit(body);
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'success'
          );
        } else {
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'error'
          );
        }
      },
      (err) => {
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', JSON.stringify(err), 'error');
      }
    );
  }

  onRowEditCancel(formObj: any, index: number) {
    this.editingMode = false;

    this.approvedDetails[index] = this.clonedObject[
      formObj.loanReviewApplicationId
    ];
    delete this.clonedObject[formObj.loanReviewApplicationId];
  }

  formatDate(date) {
    let dateObj = new Date(date),
      month = '' + (dateObj.getMonth() + 1),
      day = '' + dateObj.getDate(),
      year = '' + dateObj.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
