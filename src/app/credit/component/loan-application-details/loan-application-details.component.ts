import { LoadingService } from 'src/app/core/services/loading.service';
import { Component, OnInit, Input } from '@angular/core';
import { LoanApplicationService } from 'src/app/core/services/loanapplication.service';
import { ProductService } from 'src/app/core/services/product.service';
import { MessageService } from 'primeng/api';
import swal from 'sweetalert2';

@Component({
  selector: 'app-loan-application-details',
  templateUrl: './loan-application-details.component.html',
  styles: [
    `
      :host ::ng-deep button {
        margin-right: 0.25em;
      }

      :host ::ng-deep .custom-toast .ui-toast-message {
        color: #ffffff;
        background: #fc466b;
        background: -webkit-linear-gradient(to right, #3f5efb, #fc466b);
        background: linear-gradient(to right, #3f5efb, #fc466b);
      }

      :host ::ng-deep .custom-toast .ui-toast-close-icon {
        color: #ffffff;
      }
    `,
  ],
  providers: [MessageService],
})
export class LoanApplicationDetailsComponent implements OnInit {
  activeIndex: number = 0;
  loanApplicationDetail: any = {};
  proposedDetails: any[] = [];
  _loanApplicationId: number;
  approvedDetails: any[] = [];
  productList: any[] = [];
  products: any[] = [];
  editingMode: boolean = false;
  @Input() caneditPrivilege: boolean;
  recommendations: any[] = [];
  freq: any;
  period: any;
  get loanApplicationId(): number {
    return this._loanApplicationId;
  }
  @Input() set loanApplicationId(value: number) {
    this._loanApplicationId = value;
    if (value > 0) {
      this.getSingleLoanApplicationDetail(value);
      this.getRecommendations(value);
    }
  }
  clonedObject: { [s: string]: any } = {};
  constructor(
    private loanApplicationService: LoanApplicationService,
    private productService: ProductService,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getProductLite();
  }
  getSingleLoanApplicationDetail(loanAppId) {
    this.loanApplicationService
      .getLoanApplication(loanAppId)
      .subscribe((data) => {
        this.approvedDetails = [];
        this.proposedDetails = [];
        this.loanApplicationDetail = data.loanApplications[0];
        this.freq = this.loanApplicationDetail.productFrequency;
        this.period = this.loanApplicationDetail.productTenor;
        let proposed = {
          product: this.loanApplicationDetail.proposedProductName,
          amount: this.loanApplicationDetail.proposedAmount,
          tenor: this.loanApplicationDetail.proposedTenor,
          rate: this.loanApplicationDetail.proposedRate,
        };
        this.proposedDetails.push(proposed);
        let approved = {
          loanApplicationId: this.loanApplicationDetail.loanApplicationId,
          productId: this.loanApplicationDetail.approvedProductId,
          product: this.loanApplicationDetail.approvedProductName,
          amount: this.loanApplicationDetail.approvedAmount,
          tenor: this.loanApplicationDetail.approvedTenor,
          rate: this.loanApplicationDetail.approvedRate,
        };
        this.approvedDetails.push(approved);
      });
  }
  getRecommendations(loanApplicationId) {
    this.loanApplicationService
      .getRecommendations(loanApplicationId)
      .subscribe((data) => {
        if (data.loanRecommendationLogs != null) {
          this.recommendations = data.loanRecommendationLogs;
        }
      });
  }
  getProductLite() {
    this.productService.getAllProduct().subscribe((data) => {
      this.products = data.products;
      if (this.products != null || this.products != undefined) {
        this.productList = [];
        this.products.forEach((el) => {
          let info = {
            label: el.productName,
            value: el.productId,
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
    this.clonedObject[formObj.loanApplicationId] = { ...formObj };
  }

  onRowEditSave(formObj: any) {
    this.loadingService.show();
    let body = {
      loanApplicationId: this.loanApplicationId,
      approvedProductId: parseInt(formObj.productId),
      approvedTenor: parseInt(formObj.tenor),
      approvedRate: parseInt(formObj.rate),
      approvedAmount: parseInt(formObj.amount),
    };
    this.loanApplicationService.updateLoanRecommendation(body).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data.status.isSuccessful == true) {
          this.getSingleLoanApplicationDetail(this.loanApplicationId);
          this.getRecommendations(this.loanApplicationId);
          this.onRowEditCancel(formObj, 0);
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

    this.approvedDetails[index] = this.clonedObject[formObj.loanApplicationId];
    delete this.clonedObject[formObj.loanApplicationId];
  }
}
