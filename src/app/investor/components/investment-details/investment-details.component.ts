import { Component, Input, OnInit } from "@angular/core";
import { LoanApplicationService } from "../../../core/services/loanapplication.service";
import { ProductService } from "../../../core/services/product.service";
import { LoadingService } from "../../../core/services/loading.service";
import swal from "sweetalert2";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import {CommonService} from "../../../core/services/common.service";

@Component({
  selector: "app-investment-details",
  templateUrl: "./investment-details.component.html",
  styleUrls: ["./investment-details.component.css"]
})
export class InvestmentDetailsComponent implements OnInit {
  activeIndex: number = 0;
  fv_value: any;
  loanApplicationDetail: any = {};
  proposedDetails: any[] = [];
  _investmentId: number;
  approvedDetails: any[] = [];
  productList: any[] = [];
  products: any[] = [];
  editingMode: boolean = false;
  @Input() caneditPrivilege: boolean = false;
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
      this.getInvestment(value);
      this.getRecommendations(value);
    }
  }
  clonedObject: { [s: string]: any } = {};
  currencyRate: number
  constructor(
    private loanApplicationService: LoanApplicationService,
    private productService: ProductService,
    private loadingService: LoadingService,
    private investorFundService: InvestorFundService,
    private commonService: CommonService
  ) {}

  ngOnInit() {

    this.getProductLite();
    if (this.investmentId != undefined) {
      this.getInvestment(this.investmentId);
    }
  }
  getInvestment(investmentId) {
    this.investorFundService.getInvestment(investmentId).subscribe(data => {
      this.approvedDetails = [];
      this.proposedDetails = [];
      this.loanApplicationDetail = data.investorFunds[0];
      this.fv_value = (
        this.loanApplicationDetail.approvedAmount * Math.pow((1 + (this.loanApplicationDetail.approvedRate / 100)), this.loanApplicationDetail.approvedTenor)
      ).toFixed(2);
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
        investmentId: this.loanApplicationDetail.investmentId,
        productId: this.loanApplicationDetail.approvedProductId,
        product: this.loanApplicationDetail.approvedProductName,
        amount: this.loanApplicationDetail.approvedAmount,
        tenor: this.loanApplicationDetail.approvedTenor,
        rate: this.loanApplicationDetail.approvedRate
      };
      this.approvedDetails.push(approved);
      this.getExchangeRate(this.loanApplicationDetail.currencyId)
    });
  }
  getRecommendations(investmentId) {
    this.investorFundService
      .getRecommendationLog(investmentId)
      .subscribe(data => {
        this.recommendations = data["result"];
      });
  }
  getProductLite() {
    this.investorFundService.getProducts().subscribe(data => {
      this.products = data.infProducts;
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
  getExchangeRate(id) {
    return this.commonService.getCurrencyRate(id).subscribe(data => {
      this.currencyRate = data.commonLookups[0].sellingRate
    })
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
    this.clonedObject[formObj.investmentId] = { ...formObj };
  }

  onRowEditSave(formObj: any) {
    this.loadingService.show();
    let body = {
      investorFundId: this.investmentId,
      approvedProductId: parseInt(formObj.productId),
      approvedTenor: parseInt(formObj.tenor),
      approvedRate: parseInt(formObj.rate),
      approvedAmount: parseInt(formObj.amount)
    };
    this.investorFundService.investmentRecommendation(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.getInvestment(this.investmentId);
          this.getRecommendations(this.investmentId);
          this.onRowEditCancel(formObj, 0);
          swal.fire("GOS FINANCIAL", message, "success");
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

  onRowEditCancel(formObj: any, index: number) {
    this.editingMode = false;

    this.approvedDetails[index] = this.clonedObject[formObj.investmentId];
    delete this.clonedObject[formObj.investmentId];
  }
}
