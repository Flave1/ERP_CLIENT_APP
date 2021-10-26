import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { LoanCustomerService } from '../../../core/services/loancustomer.service';
import { DepositAccountOpeningService } from '../../../core/services/depositaccountopening.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { InvestorFundService } from '../../../core/services/investor-fund.service';
import { saveAs } from 'file-saver';
import { CurrencyService } from '../../../core/services/currency.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-investor-customer-list',
  templateUrl: './investor-customer-list.component.html',
  styleUrls: ['./investor-customer-list.component.css'],
})
export class InvestorCustomerListComponent implements OnInit {
  activeIndex = 0;
  loanCustomerInformation: any[] = [];
  selectedLoanCustomerInformation: any[];
  displaySearchModal = false;
  cols: any[];
  searchResults: any[];
  filteredSearchResults: any[];
  viewHeight: any = '600px';
  private fileToUpload: File;
  operatingAccount: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  searchUser: FormGroup;
  customerType: string = '1';
  dropdownType: any[] = [];
  downloadTip: string;
  uploadTip: string;
  filteredArray: any[] = [];
  type: string = '1';
  hideButton: boolean = false;
  constructor(
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService,
    private currencyService: CurrencyService,
    private CustomerService: DepositAccountOpeningService,
    private router: Router,
    private investorService: InvestorFundService,
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.searchUser = this.fb.group({
      fullName: [''],
      email: [''],
      accountNumber: [''],
    });
    this.cols = [
      { field: 'customerTypeName', header: 'customerTypeName' },
      { field: 'firstName', header: 'firstName' },
      { field: 'email', header: 'email' },
      { field: 'phoneNo', header: 'phoneNo' },
    ];
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
    // this.getAllInvestorCustomer();
    // this.getAllCustomer();
    // this.getOperatingAccount();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }
  showAddNew() {
    this.router.navigate(['/investor/investor-customer']);
  }

  getDropdownType(value: any) {
    this.filteredArray = this.dropdownType.filter((item) => {
      return item.id == value;
    });
    if (value === '2') {
      this.downloadTip = 'Download Corporate Customers';
    }
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
  getAllCustomer() {
    this.loadingService.show();
    this.investorService.getAllInvestors().subscribe((data) => {
      this.loadingService.hide();
      this.searchResults = data['result'];
      this.filteredSearchResults = this.searchResults;
    });
  }

  getOperatingAccount() {
    this.loadingService.show();
    this.currencyService.getOperatingAccount().subscribe((data) => {
      this.loadingService.hide();
      this.operatingAccount = data['result'].inUse;
    });
  }

  getAllInvestorCustomer() {
    this.loadingService.show();
    this.investorService.getAllInvestorCustomer().subscribe(
      (data) => {
        this.loadingService.hide();
        this.loanCustomerInformation = data.investorLists;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  editLoanCustomer(row) {
    this.router.navigate(['/investor/investor-customer'], {
      queryParams: { id: row.investorFundCustomerId },
    });
  }
  editCustomerFromDeposit(row) {
    this.router.navigate(['/credit/loancustomer-info'], {
      queryParams: { editloanCustomerFromDeposit: row.customerId },
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
  exportCustomer() {
    this.loadingService.show();
    this.loanCustomerService.exportLoanCustomer().subscribe((response) => {
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
    });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadCustomers() {
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
          this.getAllInvestorCustomer();
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
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
    let body = { setup: formObj };
    this.loanCustomerService.deleteMultipleLoanCustomer(body).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data['result'] == true) {
          swal.fire('GOS FINANCIAL', data['message'], 'success');
          this.getAllInvestorCustomer();
        } else {
          swal.fire('GOS FINANCIAL', data['message'], 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', JSON.stringify(err), 'error');
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
        let data = {
          setupId: el.customerId,
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

  invest(x) {
    this.router.navigate(['/investor/investor-list-info'], {
      queryParams: {
        investorId: x.investorFundCustomerId,
      },
    });
  }
  downloadFile() {
    if (this.type === '1') {
      return this.downloadIndividual();
    }
    if (this.type === '2') {
      return this.downloadCorporate();
    }
  }
  uploadInvestorCustomer() {}

  exportInvestorCustomer() {}

  searchCustomers(userDetails) {
    const { fullName, email, accountNumber } = userDetails.value;
    this.loadingService.show();
    return this.investorService
      .searchInvestorCustomers(fullName, email, accountNumber)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.loanCustomerInformation = data.investorLists;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }

  downloadIndividual() {
    this.loadingService.show();
    return this.loanCustomerService.downloadIndividual().subscribe(
      (response) => {
        this.loadingService.hide();
        const data = response.export;
        this.dataService.convertToFile('Individual Customers', data);
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
        const data = response.export;
        this.dataService.convertToFile('Corporate Customers', data);
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        return swal.fire('Error', message, 'error');
      }
    );
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
          this.getAllInvestorCustomer();
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          // this.getAllLoanCustomer();
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
          this.getAllInvestorCustomer();
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          // this.getAllLoanCustomer();
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.fileInput.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
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
}
