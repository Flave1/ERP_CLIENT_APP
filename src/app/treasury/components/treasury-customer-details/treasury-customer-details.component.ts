import { Component, Input, OnInit } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { LoanCustomerService } from '../../../core/services/loancustomer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestorFundService } from '../../../core/services/investor-fund.service';
import { saveAs } from 'file-saver';
import { TreasuryService } from '../../../core/services/treasury.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../core/services/common.service';
import swal from "sweetalert2";

@Component({
  selector: 'app-treasury-customer-details',
  templateUrl: './treasury-customer-details.component.html',
  styleUrls: ['./treasury-customer-details.component.css']
})
export class TreasuryCustomerDetailsComponent implements OnInit {
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
  contactForm: FormGroup;
  issuerRegistrationId: any;
  cityList: any[] = [];
  states: any[] = [];
  cityId: any;
  get customerId(): number {
    return this._customerId;
  }
  @Input() set customerId(value: number) {
    this._customerId = value;
    if (value > 0) {
      this.getCustomer(value);
      // this.getCustomerDirectorByLoanCustomer(value);
      // this.getCustomerIdentityDetailsByLoanCustomer(value);
      // // this.getCustomerNextOfKinByLoanCustomer(value);
      // this.getCustomerBankDetailsByLoanCustomer(value);
      // this.getCustomerDirectorShareHolderByLoanCustomer(value);
      this.getLoanCustoemrDocumentUpload(value);
    }
  }
  constructor(
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private treasuryService: TreasuryService,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {
    this.contactForm = this.fb.group({
      issuerRegistrationId: this.issuerRegistrationId,
      contactInformationId: [0],
      nameOfContact: [''],
      phoneNumber: ['', Validators.required],
      email: [''],
      address: [''],
      cityId: [0],
      stateId: ['', Validators.required],
      postalAddress: [''],
      countryId: [0]
    });
  }

  ngOnInit() {
    this.loadDropDown();
    this.getCountries();
  }
  loadDropDown() {
    // this.getCountries();
    // this.commonService.getAllCity().subscribe(data => {
    //   this.cityList = data.commonLookups;
    // });
    // this.commonService.getAllState().subscribe(data => {
    //   this.states = data.commonLookups;
    // });
  }
  getCustomerDirectorByLoanCustomer(customerId) {
    this.treasuryService.getIssuer(customerId).subscribe(data => {
      this.loanCustomerDirectors = data.issuerRegistrations[0];
    });
  }
  getCountries() {
    this.commonService.getAllCountry().subscribe(data => {
      this.countryInformation = data.commonLookups;
    });
  }
  getStates(id) {
    this.loadingService.show();
    return this.commonService.getStateByCountry(id).subscribe(
      data => {
        this.loadingService.hide();
        this.states = data.commonLookups;

      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getCities(id) {
    this.loadingService.show();
    return this.commonService.getCityByStateId(id).subscribe(
      data => {
        this.loadingService.hide();
        this.cityList = data['commonLookups'];
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

  getCustomerIdentityDetailsByLoanCustomer(customerId) {
    this.treasuryService.getIdentityDetails(customerId).subscribe(data => {
      this.loanCustomerIdentityDetails = data.identityDetails;
    });
  }
  // getCustomerNextOfKinByLoanCustomer(customerId) {
  //     this.treasuryService
  //         .get(customerId)
  //         .subscribe(data => {
  //             this.loanCustomerNextOfKins = data["result"];
  //
  //         });
  // }

  getCustomer(customerId) {
    this.loadingService.show();
    this.treasuryService.getIssuer(customerId).subscribe(
      data => {
        this.loadingService.hide();
        this.loanCustomerInformation = data.issuerRegistrations[0];
        let row = data.issuerRegistrations[0];
        this.contactForm = this.fb.group({
          issuerRegistrationId: row.issuerRegistrationId,
          contactInformationId: [row.contactInformationId],
          nameOfContact: [row.nameOfContact],
          phoneNumber: [row.phoneNumber],
          email: [row.email],
          address: [row.address],
          cityId: [row.cityId],
          stateId: [row.stateId],
          postalAddress: [row.postalAddress],
          countryId: [row.countryId]
        });
        this.cityId = row.cityId;
        this.getStates(row.countryId);
        this.getCities(row.stateId);
        this.onCustomerTypeChange(this.loanCustomerInformation.customerTypeId);
      },
      err => {}
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
    this.treasuryService.getIssuerDocuments(customerId).subscribe(data => {
      this.loanCustomerDocuments = data.documents;
    });
  }
  viewDocument(document) {
    this.binaryFile = document.documentFile;
    this.selectedDocument = document.documentName;
    this.displayDocument = true;

    // this.loadingService.show();
    // this.treasuryService.getDocument(id).subscribe(
    //   data => {
    //     this.loadingService.hide();
    //     let doc = data["result"];
    //     if (doc != undefined) {
    //       this.binaryFile = doc.uploadDocument;
    //       this.selectedDocument = doc.documentTitle;
    //       this.displayDocument = true;
    //     }
    //   },
    //   err => {
    //     this.loadingService.hide();
    //   }
    // );
  }
  DownloadDocument(document) {
    this.downloadFile(document);
    // this.loadingService.show();
    // this.treasuryService.getDocument(id).subscribe(
    //   data => {
    //     this.loadingService.hide();
    //     let fileDocument = data["result"];
    //
    //     if (fileDocument != undefined) {
    //       this.binaryFile = fileDocument.uploadDocument;
    //       this.selectedDocument = fileDocument.documentTitle;
    //       let myDocExtention = fileDocument.documentType;
    //       var byteString = atob(this.binaryFile);
    //       var ab = new ArrayBuffer(byteString.length);
    //       var ia = new Uint8Array(ab);
    //       for (var i = 0; i < byteString.length; i++) {
    //         ia[i] = byteString.charCodeAt(i);
    //       }
    //       var bb = new Blob([ab]);
    //
    //       if (myDocExtention == "jpg" || myDocExtention == "jpeg") {
    //         try {
    //           var file = new File([bb], this.selectedDocument + ".jpg", {
    //             type: "image/jpg"
    //           });
    //           saveAs(file);
    //         } catch (err) {
    //           var saveFileAsBlob = new Blob([bb], {
    //             type: "image/jpg"
    //           });
    //           window.navigator.msSaveBlob(
    //             saveFileAsBlob,
    //             this.selectedDocument + ".jpg"
    //           );
    //         }
    //       }
    //       if (myDocExtention == ".png" || myDocExtention == "png") {
    //         try {
    //           var file = new File([bb], this.selectedDocument + ".png", {
    //             type: "image/png"
    //           });
    //           saveAs(file);
    //         } catch (err) {
    //           var saveFileAsBlob = new Blob([bb], {
    //             type: "image/png"
    //           });
    //           window.navigator.msSaveBlob(
    //             saveFileAsBlob,
    //             this.selectedDocument + ".png"
    //           );
    //         }
    //       }
    //       if (myDocExtention == "pdf" || myDocExtention == "pdf") {
    //         try {
    //           var file = new File([bb], this.selectedDocument + ".pdf", {
    //             type: "application/pdf"
    //           });
    //           saveAs(file);
    //         } catch (err) {
    //           var saveFileAsBlob = new Blob([bb], {
    //             type: "application/pdf"
    //           });
    //           window.navigator.msSaveBlob(
    //             saveFileAsBlob,
    //             this.selectedDocument + ".pdf"
    //           );
    //         }
    //       }
    //       if (myDocExtention == "xls" || myDocExtention == "xlsx") {
    //         try {
    //           var file = new File([bb], this.selectedDocument + ".xlsx", {
    //             type: "application/vnd.ms-excel"
    //           });
    //           saveAs(file);
    //         } catch (err) {
    //           var saveFileAsBlob = new Blob([bb], {
    //             type: "application/vnd.ms-excel"
    //           });
    //           window.navigator.msSaveBlob(
    //             saveFileAsBlob,
    //             this.selectedDocument + ".xlsx"
    //           );
    //         }
    //       }
    //       if (myDocExtention == "doc" || myDocExtention == "docx") {
    //         try {
    //           var file = new File([bb], this.selectedDocument + ".doc", {
    //             type: "application/msword"
    //           });
    //           saveAs(file);
    //         } catch (err) {
    //           var saveFileAsBlob = new Blob([bb], {
    //             type: "application/msword"
    //           });
    //           window.navigator.msSaveBlob(
    //             saveFileAsBlob,
    //             this.selectedDocument + ".doc"
    //           );
    //         }
    //       }
    //     }
    //   },
    //   err => {
    //     this.loadingService.hide();
    //   }
    // );
  }
  downloadFile(data) {
    if (data != undefined) {
      const byteString = atob(data.documentFile);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const bb = new Blob([ab]);
      try {
        const file = new File([bb], `${data.documentName}.${data.documentExtension}`, {
          type: `${data.documentExtension}`
        });
        saveAs(file);
      } catch (err) {
        const textFileAsBlob = new Blob([bb], {
          type: `${data.documentExtension}`
        });
        window.navigator.msSaveBlob(textFileAsBlob, `${data.documentName}.${data.documentExtension}`);
      }
    } else {
      return swal.fire('Error', 'An error occurred', 'error');
    }
  }
}
