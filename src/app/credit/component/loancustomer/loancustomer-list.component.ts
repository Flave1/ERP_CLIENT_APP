import swal from 'sweetalert2';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import { DepositAccountOpeningService } from 'src/app/core/services/depositaccountopening.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { saveAs } from 'file-saver';
import { LazyLoadEvent } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-loancustomer-list',
  templateUrl: './loancustomer-list.component.html',
})
export class LoanCustomerListComponent implements OnInit {
  activeIndex = 0;
  loanCustomerInformation: any[] = [];
  selectedLoanCustomerInformation: any[];
  displaySearchModal = false;
  cols: any[];
  searchResults: any[];
  filteredSearchResults: any[];
  viewHeight: string = '600px';
  private fileToUpload: File;
  operatingAccount: boolean;
  @ViewChild('fileInput') fileInput: ElementRef;
  type: string = '1';
  tip: string;
  downloadTip: string;
  uploadTip: string;
  hideButton: boolean = false;
  customerType: string = '1';
  dropdownType: any[] = [];
  filteredArray: any[] = [];
  searchUser: FormGroup;
  constructor(
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService,
    private currencyService: CurrencyService,
    private CustomerService: DepositAccountOpeningService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.searchUser = this.fb.group({
      fullName: [''],
      email: [''],
      accountNumber: [''],
    });
    this.dropdownType = [
      {
        label: 'Individual Customers',
        id: 1,
        value: 1,
      },
      {
        label: 'Corporate Customers',
        id: 2,
        value: 2,
      },
      {
        label: 'Bank Details',
        id: 1,
        value: 3,
      },
      {
        label: 'Bank Details',
        id: 2,
        value: 3,
      },
      {
        label: 'Identity Details',
        id: 1,
        value: 4,
      },
      {
        label: 'Next of Kin Details',
        id: 1,
        value: 5,
      },
      {
        label: 'Director Details',
        id: 2,
        value: 6,
      },
      {
        label: 'Card Details',
        id: 1,
        value: 7,
      },
      {
        label: 'Card Details',
        id: 2,
        value: 7,
      },
    ];
    this.downloadTip = 'Download Individual Customers';
    this.uploadTip =
      'Excel file for Individual: Email, CustomerTypeName, Title, FirstName, MiddleName, LastName, Gender, Address, Dob, Employment, City,  Occupation, PoliticallyExposed (True/False), Country, PhoneNo, MaritalStatus';

    this.cols = [
      { field: 'customerTypeName', header: 'customerTypeName' },
      { field: 'firstName', header: 'firstName' },
      { field: 'email', header: 'email' },
      { field: 'phoneNo', header: 'phoneNo' },
    ];
    // this.getAllLoanCustomer();
    this.getAllCustomer();
    this.getOperatingAccount();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }
  showAddNew() {
    this.router.navigate(['/credit/loancustomer-info']);
  }

  openSearchBox() {
    this.displaySearchModal = true;
  }
  pickSearchedData(row) {
    this.router.navigate(['/credit/loancustomer-info'], {
      queryParams: { editloanCustomerFromDeposit: row.customerId },
    });

    this.displaySearchModal = false;
  }

  searchDB(searchString) {
    // searchString.preventDefault();
    const filterBy = searchString ? searchString.toLocaleLowerCase() : null;
    this.filteredSearchResults = this.searchResults.filter((item: any) => {
      if (item.name !== null) {
        return item.name.toLocaleLowerCase().indexOf(filterBy) !== -1;
      }
    });
    if (!searchString) {
      this.filteredSearchResults = this.searchResults;
    }
  }

  getAllCustomer() {
    this.loadingService.show();
    this.CustomerService.getAllCustomerLite().subscribe(
      (data) => {
        this.loadingService.hide();
        //this.loanCustomerInformation = data.customerLite;
        this.searchResults = data.customerLiteAccountDetails;
        this.filteredSearchResults = this.searchResults;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getOperatingAccount() {
    this.loadingService.show();
    this.currencyService.getOperatingAccount().subscribe(
      (data) => {
        this.loadingService.hide();
        this.operatingAccount = data.operatingAccount.inUse;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getAllLoanCustomer() {
    this.loadingService.show();
    this.loanCustomerService.getAllLoanCustomer().subscribe(
      (data) => {
        this.loanCustomerInformation = data.customerLites;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  editLoanCustomer(row) {
    this.router.navigate(['/credit/loancustomer-info'], {
      queryParams: { id: row.customerId },
    });
  }
  editCustomerFromDeposit(row) {
    this.router.navigate(['/credit/loancustomer-info'], {
      queryParams: { editloanCustomerFromDeposit: row.customerId },
    });
  }
  deleteLoanCustomer(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomer(row.customerId)
            .subscribe((data) => {
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
    this.router.navigate(['/credit/loancustomer-info'], {
      queryParams: { editloanCustomerinfo: event.data.customerId },
    });
  }
  exportLoanCustomer() {
    this.loadingService.show();
    this.loanCustomerService.exportLoanCustomer().subscribe(
      (response) => {
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
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(textFileAsBlob, 'Loan Customers.xlsx');
          }
        } else {
          swal.fire(`GOS FINANCIAL`, `Unable to download data`, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadLoanCustomers() {
    if (this.fileToUpload == null) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
      return;
    }
    if (
      this.fileToUpload.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return swal.fire('GOS FINANCIAL', 'Only excel files allowed', 'error');
    }
    this.loanCustomerService
      .uploadLoanCustomer(this.fileToUpload)
      .then((data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          this.getAllLoanCustomer();
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }
  submitMultipleDelete(formObj) {
    this.loadingService.show();
    let body = { ids: formObj };
    this.loanCustomerService.deleteMultipleLoanCustomer(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.deleted) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getAllLoanCustomer();
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }
  multipleDelete() {
    if (this.selectedLoanCustomerInformation.length == 0) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
      return;
    }
    let tempData = this.selectedLoanCustomerInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        targetIds.push(el.customerId);
      });
    }
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          this.submitMultipleDelete(targetIds);
        } else {
          return swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  getCustomerType(value: any) {
    this.type = value;
    if (this.type == '1') {
      this.hideButton = false;
      this.downloadTip = 'Download Individual Customers';
      this.uploadTip =
        'Excel file for Individual: CustomerEmail, CustomerTypeName, Title, FirstName, MiddleName, LastName, Gender, Address, Dob, Employment, City,  Occupation, PoliticallyExposed (True/False), Country, PhoneNo, MaritalStatus';
    }
    if (this.type === '2') {
      this.hideButton = false;
      this.downloadTip = 'Download Corporate Customers';
      this.uploadTip =
        'Excel file for Corporate: CustomerEmail, CustomerTypeName, RegistrationNo, CompanyName, Date of Incorporation, PhoneNo, Address, PostalAddress, Industry, IncorporationCountry, City, AnnualTurnover, ShareholderFund, CompanyWebsite';
    }

    if (this.type === '3') {
      this.uploadTip =
        'Excel File for BankDetails: CustomerEmail, Bvn, AccountNumber, Bank, Bankcode';
      this.hideButton = true;
    }
    if (this.type === '4') {
      this.uploadTip =
        'Excel File for IdentityDetails: CustomerEmail, Issuer, ID Number';
      this.hideButton = true;
    }
    if (this.type === '5') {
      this.uploadTip =
        'Excel File for NextOfKin: CustomerEmail, Name, Relationship, NextOfKinEmail, PhoneNumber, Address';
      this.hideButton = true;
    }
    if (this.type === '6') {
      this.uploadTip =
        'Excel File for DirectorDetails: CustomerEmail, Name, Position, DirectorEmail, DateOfBirth, PhoneNumber, Address, PercentageShare, DirectorType, PoliticallyExposed';
      this.hideButton = true;
    }
    if (this.type === '7') {
      this.uploadTip =
        'Excel File for CardDetails: CustomerEmail, CardNumber, CVV, ExpiryYear, ExpiryMonth, CurrencyCode, IssuingBank, BankCode';
      this.hideButton = true;
    }
  }

  uploadCorporateCustomers() {
    if (!this.fileToUpload) {
      return swal.fire('GOS FINANCIAL', 'Choose a file to upload', 'error');
    }
    this.loadingService.show();
    return this.loanCustomerService
      .uploadCorporateCustomers(this.fileToUpload)
      .then((res) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          this.getAllLoanCustomer();
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.getAllLoanCustomer();
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.fileInput.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  uploadLoanIndividualCustomers() {
    if (!this.fileToUpload) {
      return swal.fire('GOS FINANCIAL', 'Choose a file to upload', 'error');
    }
    this.loadingService.show();
    return this.loanCustomerService
      .uploadIndividualCustomers(this.fileToUpload)
      .then((res) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          this.getAllLoanCustomer();
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.getAllLoanCustomer();
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.fileInput.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
  }
  downloadIndividual() {
    this.loadingService.show();
    return this.loanCustomerService.downloadIndividual().subscribe(
      (response) => {
        this.loadingService.hide();
        let data = response.export;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], 'Individual Customers.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              'Individual Customers.xlsx'
            );
          }
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        return swal.fire('Error', message, 'error');
      }
    );
  }

  downloadCorporate() {
    this.loadingService.show();
    return this.loanCustomerService.downloadCorporate().subscribe(
      (response) => {
        this.loadingService.hide();
        // const message = response.status.message.friendlyMessage;
        let data = response.export;
        if (data != undefined) {
          var byteString = atob(data);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
          try {
            var file = new File([bb], 'Corporate Customers.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            var textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              'Corporate Customers.xlsx'
            );
          }
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        return swal.fire('Error', message, 'error');
      }
    );
  }

  downloadFile() {
    if (this.type === '1') {
      return this.downloadIndividual();
    }
    if (this.type === '2') {
      return this.downloadCorporate();
    }
  }

  uploadIdentityDetails() {
    this.loadingService.show();
    return this.loanCustomerService
      .uploadIdentityDetails(this.fileToUpload)
      .then((res) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  uploadBankDetails() {
    this.loadingService.show();
    return this.loanCustomerService
      .uploadBankDetails(this.fileToUpload)
      .then((res) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  uploadNextOfKins() {
    if (!this.fileToUpload) {
      return swal.fire('GOS FINANCIAL', 'Choose a file to upload', 'error');
    }
    this.loadingService.show();
    return this.loanCustomerService
      .uploadNextOfKins(this.fileToUpload)
      .then((res) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.fileInput.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  uploadDirectors() {
    if (!this.fileToUpload) {
      return swal.fire('GOS FINANCIAL', 'Choose a file to upload', 'error');
    }
    this.loadingService.show();
    return this.loanCustomerService
      .uploadDirectors(this.fileToUpload)
      .then((res) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.fileInput.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  uploadCardDetails() {
    if (!this.fileToUpload) {
      return swal.fire('GOS FINANCIAL', 'Choose a file to upload', 'error');
    }
    this.loadingService.show();
    return this.loanCustomerService
      .uploadCardDetails(this.fileToUpload)
      .then((res) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.fileInput.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  uploadFile() {
    if (this.type === '1') {
      return this.uploadLoanIndividualCustomers();
    }
    if (this.type === '2') {
      return this.uploadCorporateCustomers();
    }
    if (this.type === '3') {
      return this.uploadBankDetails();
    }
    if (this.type === '4') {
      return this.uploadIdentityDetails();
    }
    if (this.type === '5') {
      return this.uploadNextOfKins();
    }
    if (this.type === '6') {
      return this.uploadDirectors();
    }
    if (this.type === '7') {
      return this.uploadCardDetails();
    }
  }

  getDropdownType(value: any) {
    this.filteredArray = this.dropdownType.filter((item) => {
      return item.id == value;
    });
    if (value === '2') {
      this.downloadTip = 'Download Corporate Customers';
    }
  }

  searchCustomers(userDetails) {
    const { fullName, email, accountNumber } = userDetails.value;
    this.loadingService.show();
    return this.loanCustomerService
      .searchCustomers(fullName, email, accountNumber)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.loanCustomerInformation = data.customerLites;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }
}
