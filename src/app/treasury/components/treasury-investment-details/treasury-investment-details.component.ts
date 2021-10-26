import { Component, Input, OnInit } from '@angular/core';
import { LoanApplicationService } from '../../../core/services/loanapplication.service';
import { ProductService } from '../../../core/services/product.service';
import { LoadingService } from '../../../core/services/loading.service';
import swal from 'sweetalert2';
import { TreasuryService } from '../../../core/services/treasury.service';

@Component({
  selector: 'app-treasury-investment-details',
  templateUrl: './treasury-investment-details.component.html',
  styleUrls: ['./treasury-investment-details.component.css']
})
export class TreasuryInvestmentDetailsComponent implements OnInit {
  activeIndex: number = 0;
  loanApplicationDetail: any = {};
  proposedDetails: any[] = [];
  _investmentId: number;
  approvedDetails: any[] = [];
  productList: any[] = [];
  products: any[] = [];
  editingMode: boolean = false;
  // @Input('caneditPrivilege') caneditPrivilege: boolean = true;
  caneditPrivilege: boolean = true;
  recommendations: any[] = [];
  freq: any;
  period: any;
  // @Input() investmentId: any
  get investmentId(): number {
    return this._investmentId;
  }
  @Input() set investmentId(value: number) {
    this._investmentId = value;
    if (value > 0) {
      this.getSingleLoanApplicationDetail(value);
      // this.getRecommendations(value);
    }
  }
  @Input() set privilege(val) {
    this.caneditPrivilege = val;
  }
  get privilege() {
    return this.caneditPrivilege;
  }
  clonedObject: { [s: string]: any } = {};
  constructor(
    private loanApplicationService: LoanApplicationService,
    private productService: ProductService,
    private loadingService: LoadingService,
    private treasuryService: TreasuryService
  ) {}

  ngOnInit() {
    this.getProductLite();
    if (this.investmentId != undefined) {
      this.getSingleLoanApplicationDetail(this.investmentId);
    }
  }
  getSingleLoanApplicationDetail(loanAppId) {
    this.treasuryService.getIssuerInvestment(loanAppId).subscribe(data => {
      this.approvedDetails = [];
      this.proposedDetails = [];
      this.loanApplicationDetail = data.issuerInvestments[0];
      this.freq = this.loanApplicationDetail.frequencyName;
      this.period = this.loanApplicationDetail.period;
      let proposed = {
        product: this.loanApplicationDetail.productName,
        amount: this.loanApplicationDetail.proposedAmount,
        tenor: this.loanApplicationDetail.proposedTenor,
        rate: this.loanApplicationDetail.proposedRate
      };
      this.proposedDetails.push(proposed);
      let approved = {
        treasureIssuerInvestmentId: this.loanApplicationDetail
          .treasureIssuerInvestmentId,
        productId: this.loanApplicationDetail.approvedProductId,
        product: this.loanApplicationDetail.productName,
        amount: this.loanApplicationDetail.approvedAmount,
        tenor: this.loanApplicationDetail.approvedTenor,
        rate: this.loanApplicationDetail.approvedRate
      };
      this.approvedDetails.push(approved);
    });
  }
  // getRecommendations(investmentId) {
  //     this.treasuryService
  //         .getRecommendationLog(investmentId)
  //         .subscribe(data => {
  //             this.recommendations = data["result"];
  //         });
  // }
  getProductLite() {
    this.treasuryService.getAllProducts().subscribe(data => {
      this.products = data.products;
      if (this.products != null || this.products != undefined) {
        this.productList = [];
        this.products.forEach(el => {
          let info = {
            label: el.productName,
            value: el.productId
          };
          this.productList.push(info);
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
    this.clonedObject[formObj.treasureIssuerInvestmentId] = { ...formObj };
  }

  onRowEditSave(formObj: any) {
    this.loadingService.show();
    let body = {
      treasureIssuerInvestmentId: +this.investmentId,
      approvedProductId: +formObj.productId,
      approvedTenor: +formObj.tenor,
      approvedRate: +formObj.rate,
      approvedAmount: +formObj.amount
    };
    this.treasuryService.investmentRecommendation(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.getSingleLoanApplicationDetail(this.investmentId);
          this.getRecommendations(this.investmentId);
          this.onRowEditCancel(formObj, 0);
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  onRowEditCancel(formObj: any, index: number) {
    this.editingMode = false;

    this.approvedDetails[index] = this.clonedObject[
      formObj.treasureIssuerInvestmentId
    ];
    delete this.clonedObject[formObj.treasureIssuerInvestmentId];
  }

  getRecommendations(investmentId: number) {
    this.loadingService.show();
    return this.treasuryService.getInvestmentRecommendations(investmentId).subscribe(data => {
      this.loadingService.hide();
      this.recommendations = data.investmentRecommendationLogs
    }, err => {
      this.loadingService.hide()
    })
  }
}
