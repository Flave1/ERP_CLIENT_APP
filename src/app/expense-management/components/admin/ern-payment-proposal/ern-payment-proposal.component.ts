import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { CompanyService } from '../../../../core/services/company.service';
import { PaymentProposal } from '../../../../models/models';
import swal from 'sweetalert2';
import { SubGLService } from '../../../../core/services/subgl.service';

@Component({
  selector: 'app-ern-payment-proposal',
  templateUrl: './ern-payment-proposal.component.html',
  styleUrls: ['./ern-payment-proposal.component.css'],
})
export class ErnPaymentProposalComponent implements OnInit {
  departments: any[] = [];
  filteredResults: PaymentProposal[] = [];
  paymentProposals: PaymentProposal[] = [];
  cols: any;
  selectedItem: PaymentProposal[] = [];
  viewHeight: string = '600px';
  showDialog: boolean;
  showDetailDialog: boolean;
  paymentDetails: any[] = [];
  banGls: any[] = [];
  requisitionPaymentId: number[] = [];
  creditGLs: number[] = [];
  PDetail: any;
  totalAmount: number;
  availableBalance: number;
  allPaymentRequest: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private expenseManagementService: ExpenseManagementService,
    private companyService: CompanyService,
    private subGLService: SubGLService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: 'erNnumber',
        field: 'erNnumber',
      },
      {
        header: 'description',
        field: 'description',
      },
      {
        header: 'requestBy',
        field: 'requestBy',
      },
      {
        header: 'deparmentment',
        field: 'deparmentment',
      },
      {
        header: 'requestDate',
        field: 'requestDate',
      },
      {
        header: 'totalAmount',
        field: 'totalAmount',
      },
      {
        header: 'expectedDeleiveryDate',
        field: 'expectedDeleiveryDate',
      },
      {
        header: 'status',
        field: 'status',
      },
    ];
    this.getCompanyStructures();
    this.getPaymentProposals();
    this.getBankGls();
    this.getGlBalance();
  }

  getCompanyStructures() {
    this.loadingService.show();
    return this.companyService.getAllCompanyStructure().subscribe(
      (data) => {
        this.loadingService.hide();
        this.departments = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getBankGls() {
    return this.subGLService.getBankGls().subscribe((data) => {
      this.banGls = data.bank;
    });
  }

  getPaymentProposals() {
    this.loadingService.show();
    return this.expenseManagementService.getPaymentProposal().subscribe(
      (data) => {
        this.loadingService.hide();
        this.paymentProposals = data;
        this.filteredResults = this.paymentProposals;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  exportItems() {}

  uploadItems() {}

  handleFileInput(files: any) {}

  filterByStructure(value: any) {
    this.filteredResults = this.paymentProposals.filter(
      (item) => item.departmentId === +value
    );
    if (+value === 0) {
      this.filteredResults = this.paymentProposals;
    }
  }

  multiPay() {
    const payload = [];
    this.selectedItem.map((item) => {
      payload.push({ itemIds: item.requisitionPaymentId });
    });
    if (payload.length === 0) {
      return swal.fire(
        'GOS FINANCIAL',
        'Select item(s) to make payment',
        'error'
      );
    }
    swal
      .fire({
        title: 'Do you want to make payment for this item?',
        text: `You won't be able to revert this`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes!`,
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.paymentDetails = this.selectedItem;
          this.totalAmount = this.calculateTotalAmount(this.paymentDetails);
          this.showDialog = true;
        } else {
          this.selectedItem = [];
        }
      });
  }

  makePayment(x) {
    let payload = [];
    // payload.push({ itemIds: x.requisitionPaymentId });
    payload.push(x);
    swal
      .fire({
        title: 'Do you want to make payment for this item?',
        text: `You won't be able to revert this`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes!`,
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.paymentDetails = payload;
          this.showDialog = true;
          this.totalAmount = this.calculateTotalAmount(this.paymentDetails);
        } else {
          payload = [];
        }
      });
  }

  savePayment(row) {
    console.log(row);
  }

  closeModal() {
    this.showDialog = false;
    this.selectedItem = [];
  }

  selectGl(bankGlId: number, erNnumber: string) {
    const payload = {
      ern_claim_no: erNnumber,
      bankId: +bankGlId,
    };
    this.allPaymentRequest.push(payload);
    // this.creditGLs.push(+creditGLId);
    // this.requisitionPaymentId.push(requisitionPaymentId);
  }

  savePaymentDetails() {
    const payload = {
      allPaymentRequest: this.allPaymentRequest,
    };
    // console.log(payload);
    // return;
    this.loadingService.show();
    return this.expenseManagementService.savePaymentProposal(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res['status'].message.friendlyMessage;
        if (res['status'].isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.showDialog = false;
            this.selectedItem = [];
            this.creditGLs = [];
            this.requisitionPaymentId = [];
            this.getPaymentProposals();
          });
        } else {
          swal.fire('GOS FINANCIAL', message, 'error').then(() => {
            this.creditGLs = [];
            this.requisitionPaymentId = [];
            this.selectedItem = [];
            this.showDialog = false;
          });
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.error['status'].message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error').then(() => {
          this.creditGLs = [];
          this.requisitionPaymentId = [];
          this.selectedItem = [];
          this.showDialog = false;
        });
      }
    );
  }

  shoPaymentDetails(x) {
    this.PDetail = x;
    this.showDetailDialog = true;
  }

  calculateTotalAmount(arr): number {
    return arr.reduce((total, item) => {
      return item.totalAmount + total;
    }, 0);
  }
  getGlBalance() {
    return this.subGLService.getGlBalances().subscribe(
      (data) => {
        this.availableBalance = data.reduce((total, item) => {
          return item.subGlBalance + total;
        }, 0);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
