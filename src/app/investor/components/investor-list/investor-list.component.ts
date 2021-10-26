import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { LoanCustomerService } from '../../../core/services/loancustomer.service';
import { DepositAccountOpeningService } from '../../../core/services/depositaccountopening.service';
import { Router } from '@angular/router';
import { InvestorFundService } from '../../../core/services/investor-fund.service';
import swal from 'sweetalert2';
import {DataService} from '../../../core/services/data.service';

@Component({
  selector: 'app-investor-list',
  templateUrl: './investor-list.component.html',
  styleUrls: ['./investor-list.component.css']
})
export class InvestorListComponent implements OnInit {
  activeIndex = 0;
  loanCustomerInformation: any[] = [];
  selectedInvestment: any[];
  displaySearchModal = false;
  cols: any[];
  searchResults: any[];
  filteredSearchResults: any[];
  viewHeight: any = '600px';
  private fileToUpload: File;
  investments: any[] = [];
  type: string;
  constructor(
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService,
    private CustomerService: DepositAccountOpeningService,
    private router: Router,
    private investorFundService: InvestorFundService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'customerTypeName', header: 'customerTypeName' },
      { field: 'firstName', header: 'firstName' },
      { field: 'email', header: 'email' },
      { field: 'phoneNo', header: 'phoneNo' }
    ];
    // this.getAllLoanCustomer();
    // this.getAllCustomer();
    this.getAllInvestments();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }
  showAddNew() {
    this.router.navigate(['/investor/investor-list-info']);
  }

  openSearchBox() {
    this.displaySearchModal = true;
  }
  pickSearchedData(row) {
    this.router.navigate(['/credit/loancustomer-info'], {
      queryParams: { editloanCustomerFromDeposit: row.customerId }
    });

    this.displaySearchModal = false;
  }

  searchDB(searchString) {
    // searchString.preventDefault();
    const filterBy = searchString ? searchString.toLocaleLowerCase() : null;
    this.filteredSearchResults = this.searchResults.filter((item: any) => {
      return (
        item.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        item.lastName.toLocaleLowerCase().indexOf(filterBy) !== -1
      );
    });
    if (!searchString) {
      this.filteredSearchResults = this.searchResults;
    }
  }

  // getAllCustomer() {
  //     this.loadingService.show();
  //     this.CustomerService.getAllCustomerLite().subscribe(data => {
  //         this.loadingService.hide();
  //         this.searchResults = data["result"];
  //         this.filteredSearchResults = this.searchResults;
  //     });
  // }
  getAllInvestments() {
    this.loadingService.show();
    return this.investorFundService.getAllInvestorFund().subscribe(
      data => {
        this.loadingService.hide();
        this.investments = data.investorFunds;
      },
      err => {
        this.loadingService.hide();

      }
    );
  }
  getInvestment() {}
  getAllLoanCustomer() {
    this.loadingService.show();
    this.investorFundService.getAllInvestorCustomer().subscribe(
      data => {
        this.loadingService.hide();
        this.loanCustomerInformation = data['result'];
      },
      error => {
        return this.loadingService.hide();
      }
    );
  }
  editLoanCustomer(row) {
    this.router.navigate(['/investor/investor-customer'], {
      queryParams: { investorFundCustomerId: row.investorFundCustomerId }
    });
  }
  editCustomerFromDeposit(row) {
    this.router.navigate(['/credit/loancustomer-info'], {
      queryParams: { editloanCustomerFromDeposit: row.customerId }
    });
  }
  deleteLoanCustomer(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete user?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!'
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomer(row.customerId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'User deleted successful.',
                  'success'
                );
                __this.getAllLoanCustomer();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  openNext() {
    this.activeIndex = this.activeIndex === 5 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 5 : this.activeIndex - 1;
  }
  onRowSelect(event) {
    this.router.navigate(['/investor/investor-customer'], {
      queryParams: { editloanCustomerId: event.data.customerId }
    });
  }
  exportFSCaption() {
    this.loadingService.show();
    // this.customerFsService.exportFSCaption().subscribe(response => {
    //     this.loadingService.hide();
    //     const data = response.result;
    //     if (data != undefined) {
    //         const byteString = atob(data);
    //         const ab = new ArrayBuffer(byteString.length);
    //         const ia = new Uint8Array(ab);
    //         for (let i = 0; i < byteString.length; i++) {
    //             ia[i] = byteString.charCodeAt(i);
    //         }
    //         const bb = new Blob([ab]);
    //         try {
    //             const file = new File([bb], 'users.xlsx', {
    //                 type: 'application/vnd.ms-excel'
    //             });
    //             saveAs(file);
    //         } catch (err) {
    //             const textFileAsBlob = new Blob([bb], {
    //                 type: 'application/vnd.ms-excel'
    //             });
    //             window.navigator.msSaveBlob(textFileAsBlob, 'users.xlsx');
    //         }
    //     }
    // });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadFSCaption() {
    if (this.fileToUpload == null) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
      return;
    }
  }
  submitMultipleDelete(formObj) {
    this.loadingService.show();
    let body = { setup: formObj };
    this.loanCustomerService.deleteMultipleLoanCustomer(body).subscribe(
      data => {
        this.loadingService.hide();
        if (data['result'] == true) {
          swal.fire('GOSFINANCIAL', data['message'], 'success');
          this.getAllLoanCustomer();
        } else {
          swal.fire('GOSFINANCIAL', data['message'], 'error');
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire('GOSFINANCIAL', JSON.stringify(err), 'error');
      }
    );
  }
  multipleDelete() {
    if (this.selectedInvestment.length == 0) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
      return;
    }
    let tempData = this.selectedInvestment;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          setupId: el.customerId
        };
        targetIds.push(data);
      });
    }
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!'
      })
      .then(result => {
        if (result.value) {
          this.submitMultipleDelete(targetIds);
        } else {
          return swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  invest(row: any) {
    this.router.navigate(['/investor/investor-list-info'], {
      queryParams: {
        investorId: row.investorFundCustomerId
      }
    });
  }

  collection(row) {
    this.router.navigate(['/investor/collection'], {
      queryParams: {
        investorId: row.investorFundCustomerId,
        investmentId: row.invInvestorFundId
      }
    });
  }
  liquidate(row) {
    this.router.navigate(['/investor/liquidate'], {
      queryParams: {
        investorId: row.investorFundCustomerId,
        investmentId: row.invInvestorFundId
      }
    });
  }

}
