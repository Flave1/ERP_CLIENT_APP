import { SupplierService } from "./../../services/supplier.service";
import { CustomerService } from "./../../services/customer.service";
import swal from "sweetalert2";
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { LoadingService } from "../../services/loading.service";
import { Router } from "@angular/router";
import {LoanCustomerService} from '../../services/loancustomer.service';
import {CurrencyService} from '../../services/currency.service';
import {DepositAccountOpeningService} from '../../services/depositaccountopening.service';
import { saveAs } from 'file-saver';

@Component({
    selector: "app-customer-list",
    templateUrl: "./customer-list.component.html"
})
export class CustomerListComponent implements OnInit {
  activeIndex = 0;
  loanCustomerInformation: any[] = [];
  selectedLoanCustomerInformation: any[];
  displaySearchModal = false;
  cols: any[];
  searchResults: any[];
  filteredSearchResults: any[];
  viewHeight: any = "600px";
  private fileToUpload: File;
  operatingAccount: any;
  @ViewChild('fileInput')  fileInput: ElementRef;
  constructor(
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService,
    private currencyService: CurrencyService,
    private CustomerService: DepositAccountOpeningService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "customerTypeName", header: "customerTypeName" },
      { field: "firstName", header: "firstName" },
      { field: "email", header: "email" },
      { field: "phoneNo", header: "phoneNo" }
    ];
    this.getAllLoanCustomer();
    this.getAllCustomer();
    this.getOperatingAccount();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }
  showAddNew() {
    this.router.navigate(["/customer/customer-info"]);
  }

  openSearchBox() {
    this.displaySearchModal = true;
  }
  pickSearchedData(row) {
    this.router.navigate(["/credit/loancustomer-info"], {
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
l
  getAllCustomer() {
    this.loadingService.show();
    this.CustomerService.getAllCustomerLite().subscribe(data => {
     if (data) {
       this.loadingService.hide();
       this.searchResults = data.customerLites;
       this.filteredSearchResults = this.searchResults;
     }
    }, err => {
      this.loadingService.hide();
    });
  }

  getOperatingAccount(){
    this.loadingService.show();
    this.currencyService.getOperatingAccount().subscribe(data => {
      this.loadingService.hide();
      this.operatingAccount = data["result"].inUse;

    },  err => {
      this.loadingService.hide()
    })
  }

  getAllLoanCustomer() {
    this.loadingService.show();
    this.loanCustomerService.getAllLoanCustomerLite().subscribe(data => {
      if (data) {
        this.loadingService.hide();
        this.loanCustomerInformation = data.customerLites;
      }
    }, err => {
      this.loadingService.hide()
    });
  }
  editLoanCustomer(row) {
    this.router.navigate(["/credit/loancustomer-info"], {
      queryParams: { id: row.customerId }
    });
  }
  editCustomerFromDeposit(row) {
    this.router.navigate(["/credit/loancustomer-info"], {
      queryParams: { editloanCustomerFromDeposit: row.customerId }
    });
  }
  deleteLoanCustomer(row) {
    const __this = this;
    swal.fire({
      title: "Are you sure you want to delete record?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!"
    }).then(result => {
      if (result.value) {
        __this.loadingService.show();

        __this.loanCustomerService
          .deleteLoanCustomer(row.customerId)
          .subscribe(data => {
            __this.loadingService.hide();
            if (data["result"] == true) {
              swal.fire(
                "GOS FINANCIAL",
                "User deleted successful.",
                "success"
              );
              __this.getAllLoanCustomer();
            } else {
              swal.fire(
                "GOS FINANCIAL",
                "Record not deleted",
                "error"
              );
            }
          });
      } else {
        swal.fire("GOS FINANCIAL", "Cancelled", "error");
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
    this.router.navigate(["/credit/loancustomer-info"], {
      queryParams: { editloanCustomerinfo: event.data.customerId }
    });
  }
  exportLoanCustomer() {
    this.loadingService.show();
    this.loanCustomerService.exportLoanCustomer().subscribe(response => {
      this.loadingService.hide();
      const data = response.export;
      if (data != undefined) {
        const byteString = atob(data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const bb = new Blob([ab]);
        try {
          const file = new File([bb], 'Loan Customers.xlsx', {
            type: 'application/vnd.ms-excel'
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Loan Customers.xlsx');
        }
      } else {
        swal.fire(`GOS FINANCIAL`, 'Unable to download', 'error')
      }
    }, err => {
      this.loadingService.hide();
    });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadLoanCustomers() {
    if (this.fileToUpload == null) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
      return;
    }
    if (this.fileToUpload.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      return swal.fire(
        "GOS FINANCIAL",
        "Only excel files allowed",
        "error"
      )
    }
    this.loanCustomerService.uploadLoanCustomer(this.fileToUpload).then(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          this.getAllLoanCustomer();
          swal.fire('GOS FINANCIAL', message, 'success')
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire('GOS FINANCIAL', message, 'error')
        }
      }
    ).catch(err => {
      this.loadingService.hide();
      this.fileInput.nativeElement.value = "";
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error')
    });
  }
  submitMultipleDelete(formObj) {
    this.loadingService.show();
    let body = { ids: formObj };
    this.loanCustomerService.deleteMultipleLoanCustomer(
      body
    ).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.deleted) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getAllLoanCustomer();
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
  multipleDelete() {
    if (this.selectedLoanCustomerInformation.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedLoanCustomerInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        targetIds.push(el.customerId);
      });
    }
    const __this = this;
    swal.fire({
      title: "Are you sure you want to delete record?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!"
    }).then(result => {
      if (result.value) {
        this.submitMultipleDelete(targetIds)
      } else {
        return swal.fire("GOS FINANCIAL", "Cancelled", "error");
      }
    });
  }
}
