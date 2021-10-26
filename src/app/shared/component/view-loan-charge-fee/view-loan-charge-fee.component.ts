import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { LoadingService } from '../../../core/services/loading.service';
import { LoanFee } from '../../../models/models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-view-loan-charge-fee',
  templateUrl: './view-loan-charge-fee.component.html',
})
export class ViewLoanChargeFeeComponent implements OnInit {
  _loanApplicationId: number;
  get loanApplicationId(): number {
    return this._loanApplicationId;
  }
  @Input() productName: string;
  @Input() set loanApplicationId(value: number) {
    this._loanApplicationId = value;
    if (value !== undefined) {
      this.getProductFee(value);
      this.getFeeRecommendation(value);
    }
  }
  productFees: any[] = [];
  _productId: number;
  get productId(): number {
    return this._productId;
  }
  @Input() set productId(value: number) {
    this._productId = value;
    // if (value > 0) this.getProductFee(value);
  }
  @Input() canEditPrivilege: boolean;
  editingMode: Array<[]> = [];
  feeRecommendations: Array<LoanFee> = [];
  constructor(
    private productService: ProductService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  getProductFee(loanApplicationId) {
    this.loadingService.show();
    this.productService
      .getproductFeeByLoanApplicationId(loanApplicationId)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.productFees = data.productFee;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }

  onRowEditInit(x, index) {
    // this.editingMode = true;
    this.editingMode.push(x.productFeeId);
  }

  onRowEditSave(x) {
    const payload = {
      productAmount: +x.productAmount,
      loanApplicationFeeId: x.productFeeId,
      loanApplicationId: this._loanApplicationId,
    };

    this.loadingService.show();
    return this.productService.addFeeRecommendation(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res['status'].message.friendlyMessage;
        if (res['status'].isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.getFeeRecommendation(this._loanApplicationId);
          });
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (error) => {
        this.loadingService.hide();
        const message = error.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  onRowEditCancel(x, i) {
    const index = this.editingMode.indexOf(x.productFeeId);
    if (index > -1) {
      this.editingMode.splice(index, 1);
    }
  }

  getFeeRecommendation(id: number) {
    this.loadingService.show();
    return this.productService.getLoanFeeRecommendation(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.feeRecommendations = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
}
