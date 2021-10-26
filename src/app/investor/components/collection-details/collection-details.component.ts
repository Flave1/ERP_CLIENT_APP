import {Component, Input, OnInit} from '@angular/core';
import {LoanApplicationService} from '../../../core/services/loanapplication.service';
import {ProductService} from '../../../core/services/product.service';
import {LoadingService} from '../../../core/services/loading.service';
import {InvestorFundService} from '../../../core/services/investor-fund.service';
import swal from "sweetalert2";
import {InvestorProducts} from '../../../../models/models';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.css']
})
export class CollectionDetailsComponent implements OnInit {

    activeIndex: number = 0;
    loanApplicationDetail: any = {};
    proposedDetails: any[] = [];
    _investmentId: number;
    _collectionId: number;
    approvedDetails: any[] = [];
    productList: any[] = [];
    products: InvestorProducts[] = [];
    editingMode: boolean = false;
    @Input() caneditPrivilege: boolean = false;
    recommendations: any[] = [];
    freq: any;
    period: any;
    investmentDetails: any;
    // @Input() investmentId: any
    get investmentId(): number {
        return this._investmentId;
    }
    // @Input('collectionId') collectionId:number;
    @Input() set investmentId(value: number) {
        this._investmentId = value;
        if (value > 0) {
            this.getCollection(value);
            this.getRecommendations(value);
        }
    }
  get collectionId(): number {
    return this._collectionId;
  }
  @Input() set collectionId(value: number) {
    this._collectionId = value;
    if (value > 0) {
      this.getData(value)
      // this.getCollection(value);
      // this.getRecommendations(value);
    }
  }
    clonedObject: { [s: string]: any } = {};
    constructor(
        private loanApplicationService: LoanApplicationService,
        private productService: ProductService,
        private loadingService: LoadingService,
        private investorFundService: InvestorFundService
    ) {}

    ngOnInit() {
        this.getProductLite();
        if (this.investmentId != undefined) {
            this.getCollection(this.investmentId)
        }
        if (this.collectionId != undefined) {
            this.getData(this.collectionId)
        }
    }
    getData(id: number) {
      return this.investorFundService.getCollection(id).subscribe(data => {
        this.investmentDetails = data.collections[0];
      }, err => {

      })
    }
    getCollection(collectionId) {
        this.investorFundService
            .getInvestment(collectionId)
            .subscribe(data => {
                this.approvedDetails = [];
                this.proposedDetails = [];
                this.loanApplicationDetail = data.investorFunds[0];
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
                    investmentId: this.loanApplicationDetail
                        .investmentId,
                    productId: this.loanApplicationDetail.approvedProductId,
                    product: this.loanApplicationDetail.approvedProductName,
                    amount: this.loanApplicationDetail.approvedAmount,
                    tenor: this.loanApplicationDetail.approvedTenor,
                    rate: this.loanApplicationDetail.approvedRate
                };
                this.approvedDetails.push(approved);
            });
    }
    getRecommendations(investmentId) {
        this.investorFundService
            .getCollectionRecommendationLogs(investmentId)
            .subscribe(data => {
                this.recommendations = data["result"];
            });
    }
    getProductLite() {
      this.loadingService.show();
        this.investorFundService.getProducts().subscribe(data => {
          this.loadingService.hide()
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
        }, err => {
          this.loadingService.hide()
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
        this.investorFundService.collectionRecommendation(body).subscribe(
            data => {
                this.loadingService.hide();
                if (data["success"] == true) {
                    this.getCollection(this.investmentId);
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

}
