import { saveAs } from 'file-saver';
import { Component, OnInit, Input } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import { IdentificationService } from 'src/app/core/services/identification.service';
import { CountryService } from 'src/app/core/services/country.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loan-customer-details',
  templateUrl: './loan-customer-details.component.html'
})
export class LoanCustomerDetailsComponent implements OnInit {
  activeIndex: number = 0;
  loanCustomerInformation: any = {};
  identificationInformation: any[] = [];
  countryInformation: any[] = [];

  name: string = 'Name';
  nameDate: string = 'Date';
  displayCorperatCustomer: boolean = false;
  displayIndividualCustomer: boolean = false;
  selectPoliticallyPosition: boolean = false;
  selectPoliticallyExposed: boolean = false;
  selectRelativePoliticallyPosition: boolean = false;
  loanCustomerDirectors: any[] = [];
  loanCustomerIdentityDetails: any[] = [];
  loanCustomerNextOfKins: any[] = [];
  loanCustomerBankDetails: any[] = [];
  loanCustomerDirectorShareHolder: any[] = [];
  _customerId: number;
  loanCustomerDocuments: any[] = [];
  displayDocument: boolean = false;
  selectedDocument: string;
  binaryFile: string;

  get customerId(): number {
    return this._customerId;
  }
  @Input() set customerId(value: number) {
    this._customerId = value;
    if (value > 0) {
      this.getLoanCustomer(value);
      this.getLoanCustomerDirectorByLoanCustomer(value);
      this.getLoanCustomerIdentityDetailsByLoanCustomer(value);
      this.getLoanCustomerNextOfKinByLoanCustomer(value);
      this.getLoanCustomerBankDetailsByLoanCustomer(value);
      this.getLoanCustomerDirectorShareHolderByLoanCustomer(value);
      this.getLoanCustoemrDocumentUpload(value);
    }
  }
  constructor(
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}
  getLoanCustomerDirectorByLoanCustomer(customerId) {
    this.loadingService.show();
    this.loanCustomerService
      .getLoanCustomerDirectorByLoanCustomer(customerId)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.loanCustomerDirectors = data.customerDirectors;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }

  onCustomerTypeChange(customerTypeId) {
    if (customerTypeId == 1) {
      this.name = 'FirstName';
      this.nameDate = 'Date of Birth';
      this.displayCorperatCustomer = false;
      this.displayIndividualCustomer = true;
    } else {
      this.name = 'CompanyName';
      this.nameDate = 'Date of Incorporation';
      this.displayCorperatCustomer = true;
      this.displayIndividualCustomer = false;
    }
  }

  getLoanCustomerIdentityDetailsByLoanCustomer(customerId) {
    this.loadingService.show();
    this.loanCustomerService
      .getLoanCustomerIdentityDetailsByLoanCustomer(customerId)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.loanCustomerIdentityDetails = data.customerIdentity;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }
  getLoanCustomerNextOfKinByLoanCustomer(customerId) {
    this.loadingService.show();
    this.loanCustomerService
      .getLoanCustomerNextOfKinByLoanCustomer(customerId)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.loanCustomerNextOfKins = data.customerNextOfKin;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }
  getLoanCustomerBankDetailsByLoanCustomer(customerId) {
    this.loadingService.show();
    this.loanCustomerService
      .getLoanCustomerBankDetailsByLoanCustomer(customerId)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.loanCustomerBankDetails = data.customerBankDetails;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }

  getLoanCustomerDirectorShareHolderByLoanCustomer(customerId) {
    this.loadingService.show();
    this.loanCustomerService
      .getLoanCustomerDirectorShareHolderByLoanCustomer(customerId)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.loanCustomerDirectorShareHolder = data.directorShareHolder;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }

  getLoanCustomer(customerId) {
    this.loadingService.show();
    this.loanCustomerService.getLoanCustomer(customerId).subscribe(
      data => {
        this.loadingService.hide();
        this.loanCustomerInformation = data.customers[0];
        this.onCustomerTypeChange(this.loanCustomerInformation.customerTypeId);
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(['/credit/loancustomer-list']);
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

  getLoanCustoemrDocumentUpload(customerId) {
    this.loanCustomerService
      .getLoanCustomerDocumentByLoanCustomer(customerId)
      .subscribe(data => {
        this.loanCustomerDocuments = data.customerDocuments;
      });
  }
  viewDocument(id: number) {
    this.loadingService.show();
    this.loanCustomerService.getLoanCustomerDocument(id).subscribe(data => {
      this.loadingService.hide();
      let doc = data.customerDocuments[0];
      if (doc != undefined) {
        this.binaryFile = doc.documentFile;
        this.selectedDocument = doc.documentName;
        this.displayDocument = true;
      }
    });
  }
  DownloadDocument(id: number) {
    this.loadingService.show();
    this.loanCustomerService.getLoanCustomerDocument(id).subscribe(data => {
      this.loadingService.hide();
      let fileDocument = data.customerDocuments[0];
      if (fileDocument != undefined) {
        this.binaryFile = fileDocument.documentFile;
        this.selectedDocument = fileDocument.documentName;
        let myDocExtention = fileDocument.documentExtension;
        var byteString = atob(this.binaryFile);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);

        if (myDocExtention == '.jpg' || myDocExtention == '.jpeg') {
          try {
            var file = new File([bb], this.selectedDocument + '.jpg', {
              type: 'image/jpg'
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'image/jpg'
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.jpg'
            );
          }
        }
        if (myDocExtention == '.png' || myDocExtention == '.png') {
          try {
            var file = new File([bb], this.selectedDocument + '.png', {
              type: 'image/png'
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'image/png'
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.png'
            );
          }
        }
        if (myDocExtention == '.pdf' || myDocExtention == '.pdf') {
          try {
            var file = new File([bb], this.selectedDocument + '.pdf', {
              type: 'application/pdf'
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'application/pdf'
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.pdf'
            );
          }
        }
        if (myDocExtention == '.xls' || myDocExtention == '.xlsx') {
          try {
            var file = new File([bb], this.selectedDocument + '.xlsx', {
              type: 'application/vnd.ms-excel'
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel'
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.xlsx'
            );
          }
        }
        if (myDocExtention == '.doc' || myDocExtention == '.docx') {
          try {
            var file = new File([bb], this.selectedDocument + '.doc', {
              type: 'application/msword'
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'application/msword'
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.doc'
            );
          }
        }
      }
    });
  }
}
