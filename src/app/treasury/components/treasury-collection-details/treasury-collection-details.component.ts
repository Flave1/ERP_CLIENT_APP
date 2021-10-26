import {Component, Input, OnInit} from '@angular/core';
import {LoanApplicationService} from '../../../core/services/loanapplication.service';
import {ProductService} from '../../../core/services/product.service';
import {LoadingService} from '../../../core/services/loading.service';
import {InvestorFundService} from '../../../core/services/investor-fund.service';
import swal from "sweetalert2";
import {TreasuryService} from '../../../core/services/treasury.service';

@Component({
  selector: 'app-treasury-collection-details',
  templateUrl: './treasury-collection-details.component.html',
  styleUrls: ['./treasury-collection-details.component.css']
})
export class TreasuryCollectionDetailsComponent implements OnInit {

    activeIndex: number = 0;
    investmentDetail: any = {};
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
    _collectionId: number;
    collectionDetails: any;
    // @Input() investmentId: any
    get investmentId(): number {
        return this._investmentId;
    }
    @Input() set investmentId(value: number) {
        this._investmentId = value;
        if (value > 0) {
            // this.getCollectionDetail(value);
            this.getRecommendations(value);
        }
    };
  get collectionId(): number {
    return this._investmentId;
  }
  @Input() set collectionId(value: number) {
    this._collectionId = value;
    if (value > 0) {
      this.getData(value)
      // this.getCollectionDetail(value);
      // this.getRecommendations(value);
    }
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
            this.getCollectionDetail(this.investmentId)
        }
    }
    getCollectionDetail(id) {
        this.treasuryService
            .getIssuerInvestment(id)
            .subscribe(data => {
                this.approvedDetails = [];
                this.proposedDetails = [];
                this.investmentDetail = data.issuerInvestments[0];
                this.freq = this.investmentDetail.frequencyName;
                this.period = this.investmentDetail.period;
                let proposed = {
                    product: this.investmentDetail.productName,
                    amount: this.investmentDetail.proposedAmount,
                    tenor: this.investmentDetail.proposedTenor,
                    rate: this.investmentDetail.proposedRate
                };
                this.proposedDetails.push(proposed);
                let approved = {
                    treasureIssuerInvestmentId: this.investmentDetail
                        .treasureIssuerInvestmentId,
                    productId: this.investmentDetail.approvedProductId,
                    productName: this.investmentDetail.productName,
                    amount: this.investmentDetail.approvedAmount,
                    tenor: this.investmentDetail.approvedTenor,
                    rate: this.investmentDetail.approvedRate
                };
                this.approvedDetails.push(approved);
            });
    }
    getRecommendations(investmentId) {
        this.treasuryService
            .getCollectionRecommendationLogs(investmentId)
            .subscribe(data => {
                this.recommendations = data["result"];
            });
    }
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
        this.clonedObject[formObj.investmentId] = { ...formObj };
    }

    onRowEditSave(formObj: any) {
        this.loadingService.show();
        let body = {
            invInvestorFundId: this.investmentId,
            approvedProductId: formObj.productId,
            approvedTenor: formObj.tenor,
            approvedRate: formObj.rate,
            approvedAmount: formObj.amount
        };
        this.treasuryService.submitCollectionApproval(body).subscribe(
            data => {
                this.loadingService.hide();
                if (data["success"] == true) {
                    this.getCollectionDetail(this.investmentId);
                    this.getRecommendations(this.investmentId);
                    this.onRowEditCancel(formObj, 0);
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                } else {
                    swal.fire("GOS FINANCIAL", data["message"], "error");
                }
            },
            err => {
                this.loadingService.hide();
                swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
            }
        );
    }

    onRowEditCancel(formObj: any, index: number) {
        this.editingMode = false;

        this.approvedDetails[index] = this.clonedObject[
            formObj.investmentId
            ];
        delete this.clonedObject[formObj.investmentId];
    }


  getData(value: number) {
    this.loadingService.show();
    return this.treasuryService.getCollection(value).subscribe(data => {
      this.loadingService.hide();
      this.collectionDetails = data.collections[0];
      let proposed = {
        product: this.collectionDetails.productName,
        amount: this.collectionDetails.proposedAmount,
        tenor: this.collectionDetails.proposedTenor,
        rate: this.collectionDetails.proposedRate
      };
      this.proposedDetails.push(proposed);
      let approved = {
        treasureIssuerInvestmentId: this.collectionDetails
          .treasureIssuerInvestmentId,
        productId: this.collectionDetails.approvedProductId,
        productName: this.collectionDetails.productName,
        amount: this.collectionDetails.approvedAmount,
        tenor: this.collectionDetails.approvedTenor,
        rate: this.collectionDetails.approvedRate
      };
      this.approvedDetails.push(approved);
    }, err => {
      this.loadingService.hide()
    })
  }
}
