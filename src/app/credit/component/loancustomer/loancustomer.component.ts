import { saveAs } from 'file-saver';
import { CommonService } from './../../../core/services/common.service';
import swal from 'sweetalert2';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { IdentificationService } from 'src/app/core/services/identification.service';
import { CountryService } from 'src/app/core/services/country.service';
import { DepositAccountOpeningService } from 'src/app/core/services/depositaccountopening.service';
import { UserAccountService } from 'src/app/core/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-loancustomer',
  templateUrl: './loancustomer.component.html',
})
export class LoanCustomerComponent implements OnInit {
  @ViewChild('myFile') myFile: ElementRef;
  documentName: string = null;
  physicalLocation: string = null;
  documentTypeId: number = null;
  files: FileList;
  file: File;
  @ViewChild('fileInput') fileInput: any;
  signature: string;
  form: FormGroup;
  directorForm: FormGroup;
  identityDetailsForm: FormGroup;
  nextOfKinForm: FormGroup;
  bankDetailsForm: FormGroup;
  cardDetailsForm: FormGroup;
  directorShareHolderForm: FormGroup;
  formTitle = 'Create New Customer';
  activeIndex = 0;
  loanCustomerInformation: any[] = [];
  identificationInformation: any[] = [];
  countryInformation: any[] = [];
  selectedLoanCustomerInformation: any = {};
  displayDirectors = false;
  displayIdentityDetails = false;
  displayNextOfKins = false;
  displayBankDetails = false;
  displayDirectorShareHolders = false;
  otherTabDisabled = true;
  customerId: any;
  customerDirectorId = 0;
  name = 'Name';
  nameDate = 'Date';
  displayCorperatCustomer = false;
  displayIndividualCustomer = false;
  selectPoliticallyPosition: boolean;
  selectPoliticallyExposed: boolean;
  selectRelativePoliticallyPosition: boolean;
  loanCustomerDirectors: any[] = [];
  loanCustomerIdentityDetails: any[] = [];
  loanCustomerNextOfKins: any[] = [];
  loanCustomerBankDetails: any[] = [];
  loanCustomerCardDetails: any[] = [];
  loanCustomerDirectorShareHolder: any[] = [];
  identityTabDisabled: boolean;
  nextOfKinTabDisabled: boolean;
  bankTabDisabled: boolean;
  cardTabDisabled: boolean;
  directorTabDisabled: boolean;
  uploadTabDisabled: boolean;
  genderList: any[] = [];
  martialStatusList: any[] = [];
  titleList: any[] = [];
  cityList: any[] = [];
  currencyInformation: any[] = [];
  employerTypeList: any[] = [];
  directorTypeList: any[] = [];
  documentTypeList: any[] = [];
  isDirectorOnly = false;
  displayDocumentUpload = false;
  displayDocument = false;
  selectedDocument: string;
  binaryFile: string;
  loanCustomerDocuments: any[] = [];
  depositCustomerId: any;
  staffList: any[];
  selectedDate: any;
  date: any;
  displayOutput: boolean;
  percentageShare = 0;
  profileStatus: number;
  fileToUpload: File;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private loanCustomerService: LoanCustomerService,
    private identificationService: IdentificationService,
    private CustomerService: DepositAccountOpeningService,
    private userAccountService: UserAccountService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) {
    this.form = this.fb.group({
      customerId: [0],
      customerTypeId: [0],
      titleId: [''],
      firstName: ['', Validators.required],
      lastName: [''],
      middleName: [''],
      genderId: [''],
      dob: [null, Validators.required],
      address: ['', Validators.required],
      postalAddress: [''],
      city: [''],
      occupation: [''],
      employmentType: [''],
      politicallyExposed: [false],
      companyName: [''],
      companyWebsite: [''],
      registrationNo: [''],
      countryId: [1],
      industry: [''],
      incorporationCountry: [''],
      annualTurnover: [''],
      maritalStatusId: [''],
      relationshipOfficerId: [0],
      shareholderFund: [''],
      accountNumber: [''],
      phoneNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^0|[0-9]\d*$/),
          Validators.minLength(9),
        ],
      ],
      email: [
        '',
        Validators.compose([Validators.required, ValidationService.isEmail]),
      ],
    });

    this.directorShareHolderForm = this.fb.group({
      customerId: 0,
      directorShareHolderId: [0],
      companyName: ['', Validators.required],
      percentageHolder: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.customerId = params.id;
      this.depositCustomerId = params['editloanCustomerFromDeposit'];
      if (this.customerId != null || this.customerId != undefined) {
        this.editLoanCustomer(this.customerId);
        this.editCardkDetails(this.customerId);
        // this.getLoanCustomerDirectorByLoanCustomer(this.customerId);
        // this.getLoanCustomerIdentityDetailsByLoanCustomer(this.customerId);
        // this.getLoanCustomerNextOfKinByLoanCustomer(this.customerId);
        // this.getLoanCustomerBankDetailsByLoanCustomer(this.customerId);
        this.getLoanCustomerCardDetails(this.customerId);
        this.getLoanCustomerDirectorShareHolderByLoanCustomer(this.customerId);
        // this.getLoanCustoemrDocumentUpload(this.customerId);
        // this.getStaffList();
        this.openAllTabs();
      } else {
        if (
          this.depositCustomerId != null ||
          this.depositCustomerId != undefined
        ) {
          this.editDepositCustomer(this.depositCustomerId);
        }
        this.resetTabs();
      }
    });
    // this.loadDropDown();
    this.getAllIdentification();
    this.onCustomerTypeChange(1);
    // this.getStaffList();
    this.getAllCurrency();
  }

  resetTabs() {
    this.identityTabDisabled = true;
    this.nextOfKinTabDisabled = true;
    this.bankTabDisabled = true;
    this.cardTabDisabled = true;
    this.directorTabDisabled = true;
    this.uploadTabDisabled = true;
  }

  openAllTabs() {
    this.identityTabDisabled = false;
    this.nextOfKinTabDisabled = false;
    this.bankTabDisabled = false;
    this.cardTabDisabled = false;
    this.directorTabDisabled = false;
    this.uploadTabDisabled = false;
  }

  getAllCurrency() {
    this.loadingService.show();
    this.commonService.getAllCurrency().subscribe(
      (data) => {
        this.loadingService.hide();
        this.currencyInformation = data.commonLookups;
      },
      (err) => {
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

  getAllIdentification() {
    this.commonService.getAllIdentification().subscribe((data) => {
      this.identificationInformation = data.commonLookups;
    });
  }
  getLoanCustomerIdentityDetailsByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerIdentityDetailsByLoanCustomer(customerId)
      .subscribe((data) => {
        if (data.customerIdentity != null) {
          this.loanCustomerIdentityDetails = data.customerIdentity;
        }
      });
  }

  getLoanCustomerCardDetails(customerId) {
    this.loanCustomerService.getLoanCustomerCardDetails(customerId).subscribe(
      (data) => {
        if (data.customerBankDetails != null) {
          this.loanCustomerCardDetails = data.CustomerCardDetails;
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getLoanCustomerDirectorShareHolderByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerDirectorShareHolderByLoanCustomer(customerId)
      .subscribe((data) => {
        if (data.directorShareHolder != null) {
          this.loanCustomerDirectorShareHolder = data.directorShareHolder;
        }
      });
  }

  editLoanCustomer(customerId) {
    this.formTitle = 'Edit Loan Customer Information';
    this.loadingService.show();
    this.loanCustomerService.getLoanCustomer(customerId).subscribe(
      (data) => {
        this.loadingService.hide();
        const row = data.customers[0];
        this.selectedLoanCustomerInformation = row;
        if (row != undefined) {
          this.otherTabDisabled = false;
        }

        this.form = this.fb.group({
          customerId: row.customerId,
          customerTypeId: row.customerTypeId,
          titleId: row.titleId,
          firstName: row.firstName,
          lastName: row.lastName,
          middleName: row.middleName,
          genderId: row.genderId,
          dob: new Date(row.dob),
          address: row.address,
          postalAddress: row.postalAddress,
          city: row.city,
          occupation: row.occupation,
          employmentType: row.employmentType,
          politicallyExposed: row.politicallyExposed,
          companyName: row.companyName,
          companyWebsite: row.companyWebsite,
          industry: row.industry,
          incorporationCountry: row.incorporationCountry,
          annualTurnover: row.annualTurnover,
          shareholderFund: row.shareholderFund,
          phoneNo: row.phoneNo,
          email: row.email,
          passport: row.passport,
          registrationNo: row.registrationNo,
          countryId: row.countryId,
          maritalStatusId: row.maritalStatusId,
          relationshipOfficerId: row.relationshipOfficerId,
          casaAccountNumber: row.casaAccountNumber,
          accountNumber: row.casaAccountNumber,
        });
        this.onCustomerTypeChange(row.customerTypeId);
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  editDepositCustomer(customerId) {
    this.formTitle = 'Add Loan Customer Information';
    this.loadingService.show();
    this.CustomerService.getCustomer(customerId).subscribe(
      (data) => {
        this.loadingService.hide();
        const row = data['result'];
        this.selectedLoanCustomerInformation = row;
        if (row != undefined) {
          this.otherTabDisabled = false;
        }

        this.form = this.fb.group({
          customerId: 0,
          customerTypeId: row.customerTypeId,
          titleId: row.title,
          firstName: row.firstname,
          lastName: row.surname,
          middleName: row.othername,
          genderId: 1,
          dob: this.formatDate(row.dob),
          address: row.address1,
          postalAddress: row.address2,
          city: row.city,
          occupation: row.occupation,
          employmentType: 1,
          politicallyExposed: row.politicallyExposed,
          companyName: row.employerName,
          companyWebsite: row.website,
          industry: row.industry,
          incorporationCountry: row.incorporationCountry,
          annualTurnover: row.annualRevenue,
          shareholderFund: row.shareholderFund,
          phoneNo: row.mobileNumber,
          email: row.email,
          passport: row.passport,
          registrationNo: row.registrationNo,
          countryId: 1,
          maritalStatusId: 1,
          cASAAccountNumber: row.accountNumber,
          relationshipOfficerId: row.relationshipOfficerId,
        });
        this.onCustomerTypeChange(row.customerTypeId);
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this._location.back();
  }
  getProfileStatus(type, params: any) {
    if (type == 1) {
      if (params.maritalStatusId) {
        this.profileStatus = 20;
      }
      if (params.genderId) {
        this.profileStatus = 20;
      }
      if (params.employmentType) {
        this.profileStatus = 20;
      }
      if (params.dob) {
        this.profileStatus = 20;
      }
      if (params.address) {
        this.profileStatus = 20;
      }
      if (params.maritalStatusId && params.genderId) {
        this.profileStatus = 40;
      }
      if (params.maritalStatusId && params.address) {
        this.profileStatus = 40;
      }
      if (params.maritalStatusId && params.dob) {
        this.profileStatus = 40;
      }
      if (params.address && params.dob) {
        this.profileStatus = 40;
      }
      if (params.maritalStatusId && params.employmentType) {
        this.profileStatus = 40;
      }
      if (params.address && params.employmentType) {
        this.profileStatus = 40;
      }
      if (params.genderId && params.employmentType) {
        this.profileStatus = 40;
      }
      if (params.genderId && params.address) {
        this.profileStatus = 40;
      }
      if (params.genderId && params.dob) {
        this.profileStatus = 40;
      }
      if (params.dob && params.employmentType) {
        this.profileStatus = 40;
      }
      if (params.maritalStatusId && params.genderId && params.employmentType) {
        this.profileStatus = 60;
      }
      if (params.maritalStatusId && params.genderId && params.address) {
        this.profileStatus = 60;
      }
      if (params.maritalStatusId && params.employmentType && params.address) {
        this.profileStatus = 60;
      }
      if (params.genderId && params.employmentType && params.address) {
        this.profileStatus = 60;
      }
      if (params.maritalStatusId && params.genderId && params.dob) {
        this.profileStatus = 60;
      }
      if (params.maritalStatusId && params.employmentType && params.dob) {
        this.profileStatus = 60;
      }
      if (params.genderId && params.employmentType && params.dob) {
        this.profileStatus = 60;
      }
      if (params.address && params.employmentType && params.dob) {
        this.profileStatus = 60;
      }
      if (params.address && params.genderId && params.dob) {
        this.profileStatus = 60;
      }
      if (params.address && params.maritalStatusId && params.dob) {
        this.profileStatus = 60;
      }
      if (
        params.maritalStatusId &&
        params.genderId &&
        params.employmentType &&
        params.dob
      ) {
        this.profileStatus = 80;
      }
      if (
        params.address &&
        params.genderId &&
        params.employmentType &&
        params.dob
      ) {
        this.profileStatus = 80;
      }
      // if (
      //   params.address &&
      //   params.maritalStatusId &&
      //   params.employmentType &&
      //   params.dob
      // ) {
      //   this.profileStatus = 80;
      // }

      if (
        params.address &&
        params.maritalStatusId &&
        params.employmentType &&
        params.dob
      ) {
        this.profileStatus = 80;
      }
      if (
        params.address &&
        params.maritalStatusId &&
        params.employmentType &&
        params.dob &&
        params.genderId
      ) {
        this.profileStatus = 100;
      }
    }
    if (type == 2) {
      if (params.annualTurnover) {
        this.profileStatus = 20;
      }
      if (params.shareholderFund) {
        this.profileStatus = 20;
      }
      if (params.dob) {
        this.profileStatus = 20;
      }
      if (params.address) {
        this.profileStatus = 20;
      }
      if (params.industry) {
        this.profileStatus = 20;
      }
      if (params.annualTurnover && params.shareholderFund) {
        this.profileStatus = 40;
      }
      if (params.annualTurnover && params.dob) {
        this.profileStatus = 40;
      }
      if (params.annualTurnover && params.address) {
        this.profileStatus = 40;
      }
      if (params.annualTurnover && params.industry) {
        this.profileStatus = 40;
      }
      if (params.shareholderFund && params.dob) {
        this.profileStatus = 40;
      }
      if (params.shareholderFund && params.address) {
        this.profileStatus = 40;
      }
      if (params.shareholderFund && params.industry) {
        this.profileStatus = 40;
      }
      if (params.address && params.dob) {
        this.profileStatus = 40;
      }
      if (params.address && params.industry) {
        this.profileStatus = 40;
      }
      if (params.dob && params.industry) {
        this.profileStatus = 40;
      }
      if (params.annualTurnover && params.shareholderFund && params.dob) {
        this.profileStatus = 60;
      }
      if (params.annualTurnover && params.shareholderFund && params.address) {
        this.profileStatus = 60;
      }
      if (params.annualTurnover && params.dob && params.address) {
        this.profileStatus = 60;
      }
      if (params.annualTurnover && params.shareholderFund && params.industry) {
        this.profileStatus = 60;
      }
      if (params.annualTurnover && params.dob && params.industry) {
        this.profileStatus = 60;
      }
      if (params.annualTurnover && params.address && params.industry) {
        this.profileStatus = 60;
      }
      if (params.shareholderFund && params.dob && params.industry) {
        this.profileStatus = 60;
      }
      if (params.shareholderFund && params.address && params.industry) {
        this.profileStatus = 60;
      }
      if (params.shareholderFund && params.dob && params.address) {
        this.profileStatus = 60;
      }
      if (params.dob && params.address && params.industry) {
        this.profileStatus = 60;
      }
      if (
        params.annualTurnover &&
        params.shareholderFund &&
        params.dob &&
        params.address
      ) {
        this.profileStatus = 80;
      }
      if (
        params.annualTurnover &&
        params.shareholderFund &&
        params.dob &&
        params.industry
      ) {
        this.profileStatus = 80;
      }
      if (
        params.annualTurnover &&
        params.dob &&
        params.address &&
        params.industry
      ) {
        this.profileStatus = 80;
      }
      if (
        params.shareholderFund &&
        params.dob &&
        params.address &&
        params.industry
      ) {
        this.profileStatus = 80;
      }
      if (
        params.annualTurnover &&
        params.shareholderFund &&
        params.address &&
        params.dob &&
        params.industry
      ) {
        this.profileStatus = 100;
      }
    }
    return this.profileStatus;
  }
  submitLoanCustomerInfo(formObj) {
    const payload = formObj.value;
    this.getProfileStatus(payload.customerTypeId, {
      genderId: payload.genderId,
      address: payload.address,
      dob: payload.dob,
      employmentType: payload.employmentType,
      maritalStatusId: payload.maritalStatusId,
      annualTurnover: payload.annualTurnover,
      shareholderFund: payload.shareholderFund,
      industry: payload.industry,
    });
    payload.customerTypeId = parseInt(payload.customerTypeId);
    payload.titleId = parseInt(payload.titleId);
    payload.genderId = parseInt(payload.genderId);
    // payload.city = parseInt(payload.city);
    payload.employmentType = parseInt(payload.employmentType);
    payload.countryId = parseInt(payload.countryId);
    payload.annualTurnover = parseFloat(payload.annualTurnover);
    payload.shareholderFund = parseFloat(payload.shareholderFund);
    payload.relationshipOfficerId = parseInt(payload.relationshipOfficerId);
    payload.maritalStatusId = parseInt(payload.maritalStatusId);
    payload.dob = this.formatDate(payload.dob);
    payload.profileStatus = this.profileStatus;
    this.loadingService.show();
    this.loanCustomerService.addLoanCustomerInformation(payload).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.customerId = data.customerId;
          this.editLoanCustomer(this.customerId);
          this.otherTabDisabled = false;
          this.openAllTabs();
          swal.fire('GOS FINANCIAL', message, 'success');
          this.activeIndex = 1;
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', JSON.stringify(err), 'error');
      }
    );
  }
  onSavedButtonPressed() {
    swal.fire(
      'GOS FINANCIAL',
      'Record Saved Successfully and it being sent for approval',
      'success'
    );
    this.router.navigate(['/credit/loancustomer-list']);
  }
  onTabChange(e) {
    this.activeIndex = e.index;

    // Individual Customer
    if (
      this.activeIndex === 1 &&
      this.selectedLoanCustomerInformation.customerTypeId != 1
    ) {
      if (this.loanCustomerDirectors.length > 0) {
        this.directorTabDisabled = false;
      }
    }

    // Corporate Customer
    // if (
    //     this.activeIndex === 1 &&
    //     this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE
    // ) {
    //     this.ShowSaveCompanyButton = true;
    //     if (this.customerCompanyInfomation != null) {
    //         this.contactTabDisabled = false;
    //     }
    // }
  }

  openNext() {
    this.activeIndex = this.activeIndex === 6 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 6 : this.activeIndex - 1;
  }
  showAddNewDirectors(value) {
    this.displayDirectors = value;
    this.directorForm.reset();
  }
  onDateSelect(event) {
    const d = new Date(Date.parse(event));
    this.date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  editDirectors(row) {
    (this.customerDirectorId = row.customerDirectorId),
      (this.percentageShare = row.percentageShare),
      (this.directorForm = this.fb.group({
        customerDirectorId: row.customerDirectorId,
        directorTypeId: row.directorTypeId,
        customerId: row.customerId,
        address: [row.address],
        name: [row.name],
        phoneNo: [row.phoneNo],
        email: [row.email],
        signature: [row.signature],
        dob: this.formatDate(row.dob),
        position: row.position,
        politicallyPosition: [row.politicallyPosition],
        relativePoliticallyPosition: [row.relativePoliticallyPosition],
        percentageShare: [row.percentageShare],
      }));
    this.selectPoliticallyPosition = row.politicallyPosition;
    this.selectRelativePoliticallyPosition = row.relativePoliticallyPosition;
    this.displayDirectors = true;
    this.selectedDate = new Date(row.dob);
    const d = new Date(Date.parse(this.selectedDate));
    this.date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  showAddNewIdentityDetails(value) {
    this.displayIdentityDetails = value;
    this.identityDetailsForm.reset();
  }
  // submitLoanCustomerIdentityDetails(formObj) {
  //   const body = formObj.value;
  //   body.customerId = parseInt(this.customerId);
  //   body.identificationId = parseInt(body.identificationId);
  //   if (body.customerIdentityDetailsId == null) {
  //     body.customerIdentityDetailsId = 0;
  //   }
  //
  //   // return;
  //   this.loadingService.show();
  //   this.loanCustomerService.addLoanCustomerIdentityDetails(body).subscribe(
  //     (data) => {
  //       this.loadingService.hide();
  //       const message = data.status.message.friendlyMessage;
  //       if (data.status.isSuccessful) {
  //         swal.fire('GOS FINANCIAL', message, 'success');
  //         this.getLoanCustomerIdentityDetailsByLoanCustomer(this.customerId);
  //         this.displayIdentityDetails = false;
  //       } else {
  //         swal.fire('GOS FINANCIAL', message, 'error');
  //       }
  //     },
  //     (err) => {
  //       this.loadingService.hide();
  //       const message = err.status.message.friendlyMessage;
  //       swal.fire('GOS FINANCIAL', message, 'error');
  //     }
  //   );
  // }

  editIdentityDetails(row) {
    this.identityDetailsForm = this.fb.group({
      customerIdentityDetailsId: row.customerIdentityDetailsId,
      customerId: row.customerId,
      identificationId: row.identificationId,
      number: row.number,
      issuer: row.issuer,
    });
    this.displayIdentityDetails = true;
  }
  // deleteIdentityDetails(row) {
  //   const ids = [];
  //   ids.push(row.customerIdentityDetailsId);
  //   const __this = this;
  //   swal
  //     .fire({
  //       title: 'Are you sure you want to delete record?',
  //       text: "You won't be able to revert this",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes!',
  //     })
  //     .then((result) => {
  //       if (result.value) {
  //         __this.loadingService.show();
  //
  //         __this.loanCustomerService
  //           .deleteLoanCustomerIdentityDetails({ ids })
  //           .subscribe(
  //             (data) => {
  //               __this.loadingService.hide();
  //               const message = data.status.message.friendlyMessage;
  //               if (data.deleted) {
  //                 swal.fire('GOS FINANCIAL', message, 'success');
  //                 __this.getLoanCustomerIdentityDetailsByLoanCustomer(
  //                   this.customerId
  //                 );
  //               } else {
  //                 swal.fire('GOS FINANCIAL', message, 'error');
  //               }
  //             },
  //             (err) => {
  //               this.loadingService.hide();
  //               const message = err.status.message.friendlyMessage;
  //               swal.fire('GOS FINANCIAL', message, 'error');
  //             }
  //           );
  //       } else {
  //         swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
  //       }
  //     });
  // }

  showAddNewNextOfKins(value) {
    this.displayNextOfKins = value;
    // this.nextOfKinForm.reset();
  }
  editNextOfKins(row) {
    console.log(row);
    this.nextOfKinForm = this.fb.group({
      customerNextOfKinId: row.customerNextOfKinId,
      customerId: row.customerId,
      name: row.name,
      address: row.address,
      relationship: row.relationship,
      phoneNo: row.phoneNo,
      email: row.email,
    });
    this.displayNextOfKins = true;
  }

  showAddNewBankDetails(value) {
    this.displayBankDetails = value;
    this.bankDetailsForm.reset();
  }
  editBankDetails(row) {
    this.bankDetailsForm = this.fb.group({
      customerId: row.customerId,
      customerBankDetailsId: row.customerBankDetailsId,
      bvn: row.bvn,
      account: row.account,
      bank: row.bank,
    });
    this.displayBankDetails = true;
  }

  editCardkDetails(customerId) {
    this.loanCustomerService
      .getLoanCustomerCardDetails(customerId)
      .subscribe((data) => {
        this.loadingService.hide();
        const row = data.customerCardDetails;
        this.selectedLoanCustomerInformation = row;
        if (row != undefined) {
          this.otherTabDisabled = false;
        }
        this.cardDetailsForm = this.fb.group({
          customerId: row.customerId,
          customerCardDetailsId: row.customerCardDetailsId,
          cardNumber: row.cardNumber,
          cvv: row.cvv,
          expiryMonth: row.expiryMonth,
          expiryYear: row.expiryYear,
          currencyCode: row.currencyCode,
          issuingBank: row.issuingBank,
        });
      });
  }

  showAddNewDirectorShareHolders() {
    this.displayDirectorShareHolders = true;
  }
  editDirectorShareHolders(row) {
    this.directorShareHolderForm = this.fb.group({
      customerId: row.customerId,
      directorShareHolderId: row.directorShareHolderId,
      companyName: row.companyName,
      percentageHolder: row.percentageHolder,
    });
    this.displayDirectorShareHolders = true;
  }
  deleteDirectorShareHolders(row) {
    const ids = [];
    ids.push(row.directorShareHolderId);
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
            .deleteLoanCustomerDirectorShareHolder(row.directorShareHolderId)
            .subscribe(
              (data) => {
                __this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.deleted) {
                  swal.fire('GOS FINANCIAL', message, 'success');
                  __this.getLoanCustomerDirectorShareHolderByLoanCustomer(
                    this.customerId
                  );
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
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  submitLoanCustomerDirectorShareHolders(formObj) {
    const body = formObj.value;
    body.customerId = parseInt(this.customerId);
    body.percentageHolder = parseInt(body.percentageHolder);
    this.loadingService.show();
    this.loanCustomerService.addLoanCustomerDirectorShareHolder(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getLoanCustomerDirectorShareHolderByLoanCustomer(
            this.customerId
          );
          this.displayDirectorShareHolders = false;
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

  onDirectorTypeChange(value) {
    if (value == 1) {
      this.isDirectorOnly = true;
    } else {
      this.isDirectorOnly = false;
    }
  }

  // file upload
  showAddNewDocument(value) {
    this.displayDocumentUpload = value;
  }

  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
  }

  fileExtention(name: string) {
    const regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }

  // uploadFile() {
  //   if (this.file != undefined || this.documentName != null) {
  //     const body = {
  //       customerId: parseInt(this.customerId),
  //       documentName: this.documentName,
  //       fileName: this.file.name,
  //       fileExtension: this.fileExtention(this.file.name),
  //       physicalLocation: this.physicalLocation,
  //       documentTypeId: this.documentTypeId,
  //     };
  //     this.loadingService.show();
  //     this.loanCustomerService
  //       .uploadFile(this.file, body)
  //       .then((data: any) => {
  //         this.loadingService.hide();
  //         const message = data.status.message.friendlyMessage;
  //         if (data.status.isSuccessful) {
  //           this.documentName = null;
  //           this.documentTypeId = null;
  //           this.fileInput.nativeElement.value = '';
  //           this.getLoanCustoemrDocumentUpload(this.customerId);
  //           this.displayDocumentUpload = false;
  //           swal.fire(`GOS FINANCIAL`, message, 'success');
  //         } else {
  //           swal.fire(`GOS FINANCIAL`, message, 'error');
  //         }
  //       })
  //       .catch((err) => {
  //         this.loadingService.hide(1000);
  //
  //         const message = err.status.message.friendlyMessage;
  //         this.documentName = null;
  //         this.documentTypeId = null;
  //         this.fileInput.nativeElement.value = '';
  //         this.getLoanCustoemrDocumentUpload(this.customerId);
  //         this.displayDocumentUpload = false;
  //         swal.fire(`GOS FINANCIAL`, message, 'error');
  //       });
  //   }
  // }
  //
  // deleteLoanCustoemrDocument(row) {
  //   if (row.documentTypeId == 1007) {
  //     return swal.fire('GOS FINANCIAL', 'Signature cannot be deleted', 'error');
  //   }
  //   const __this = this;
  //   swal
  //     .fire({
  //       title: 'Are you sure you want to delete document?',
  //       text: "You won't be able to revert this",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes!',
  //     })
  //     .then((result) => {
  //       if (result.value) {
  //         __this.loadingService.show();
  //
  //         __this.loanCustomerService
  //           .deleteLoanCustomerDocument(row.customerDocumentId)
  //           .subscribe((data) => {
  //             __this.loadingService.hide();
  //             if (data.deleted) {
  //               swal.fire(
  //                 'GOS FINANCIAL',
  //                 'User deleted successful.',
  //                 'success'
  //               );
  //               __this.getLoanCustoemrDocumentUpload(this.customerId);
  //             } else {
  //               swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
  //             }
  //           });
  //       } else {
  //         swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
  //       }
  //     });
  // }
  // viewDocument(id: number) {
  //   this.loadingService.show();
  //   this.loanCustomerService.getLoanCustomerDocument(id).subscribe(
  //     (data) => {
  //       this.loadingService.hide();
  //       const doc = data.customerDocuments[0];
  //
  //       if (doc != undefined) {
  //         this.binaryFile = doc.documentFile;
  //         this.selectedDocument = doc.documentName;
  //         this.displayOutput = true;
  //       }
  //     },
  //     (err) => {
  //       this.loadingService.hide();
  //     }
  //   );
  // }
  // DownloadDocument(id: number) {
  //   this.loadingService.show();
  //   this.loanCustomerService.getLoanCustomerDocument(id).subscribe((data) => {
  //     this.loadingService.hide();
  //     const fileDocument = data.customerDocuments[0];
  //     if (fileDocument != undefined) {
  //       this.binaryFile = fileDocument.documentFile;
  //       this.selectedDocument = fileDocument.documentName;
  //       const myDocExtention = fileDocument.documentExtension;
  //       const byteString = atob(this.binaryFile);
  //       const ab = new ArrayBuffer(byteString.length);
  //       const ia = new Uint8Array(ab);
  //       for (let i = 0; i < byteString.length; i++) {
  //         ia[i] = byteString.charCodeAt(i);
  //       }
  //       const bb = new Blob([ab]);
  //
  //       if (myDocExtention == '.jpg' || myDocExtention == '.jpeg') {
  //         try {
  //           const file = new File([bb], this.selectedDocument + '.jpg', {
  //             type: 'image/jpg',
  //           });
  //           saveAs(file);
  //         } catch (err) {
  //           const saveFileAsBlob = new Blob([bb], {
  //             type: 'image/jpg',
  //           });
  //           window.navigator.msSaveBlob(
  //             saveFileAsBlob,
  //             this.selectedDocument + '.jpg'
  //           );
  //         }
  //       }
  //       if (myDocExtention == '.png' || myDocExtention == '.png') {
  //         try {
  //           const file = new File([bb], this.selectedDocument + '.png', {
  //             type: 'image/png',
  //           });
  //           saveAs(file);
  //         } catch (err) {
  //           const saveFileAsBlob = new Blob([bb], {
  //             type: 'image/png',
  //           });
  //           window.navigator.msSaveBlob(
  //             saveFileAsBlob,
  //             this.selectedDocument + '.png'
  //           );
  //         }
  //       }
  //       if (myDocExtention == '.pdf' || myDocExtention == '.pdf') {
  //         try {
  //           const file = new File([bb], this.selectedDocument + '.pdf', {
  //             type: 'application/pdf',
  //           });
  //           saveAs(file);
  //         } catch (err) {
  //           const saveFileAsBlob = new Blob([bb], {
  //             type: 'application/pdf',
  //           });
  //           window.navigator.msSaveBlob(
  //             saveFileAsBlob,
  //             this.selectedDocument + '.pdf'
  //           );
  //         }
  //       }
  //       if (myDocExtention == '.xls' || myDocExtention == '.xlsx') {
  //         try {
  //           const file = new File([bb], this.selectedDocument + '.xlsx', {
  //             type: 'application/vnd.ms-excel',
  //           });
  //           saveAs(file);
  //         } catch (err) {
  //           const saveFileAsBlob = new Blob([bb], {
  //             type: 'application/vnd.ms-excel',
  //           });
  //           window.navigator.msSaveBlob(
  //             saveFileAsBlob,
  //             this.selectedDocument + '.xlsx'
  //           );
  //         }
  //       }
  //       if (myDocExtention == '.doc' || myDocExtention == '.docx') {
  //         try {
  //           const file = new File([bb], this.selectedDocument + '.doc', {
  //             type: 'application/msword',
  //           });
  //           saveAs(file);
  //         } catch (err) {
  //           const saveFileAsBlob = new Blob([bb], {
  //             type: 'application/msword',
  //           });
  //           window.navigator.msSaveBlob(
  //             saveFileAsBlob,
  //             this.selectedDocument + '.doc'
  //           );
  //         }
  //       }
  //     }
  //   });
  // }

  uploadDirectors() {
    if (!this.fileToUpload) {
      return swal.fire('GOS FINANCIAL', 'Choose a file to upload', 'error');
    }
    this.loadingService.show();
    return this.loanCustomerService
      .uploadDirectors(this.fileToUpload)
      .then((res) => {
        this.loadingService.hide();
        this.myFile.nativeElement.value = '';
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.myFile.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
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
        this.myFile.nativeElement.value = '';
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.myFile.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  closeDocumentModal(event) {
    this.displayDocumentUpload = event;
  }
  closeBankModal(event) {
    this.displayBankDetails = event;
  }

  closeNextOfKinModal(event: any) {
    this.displayNextOfKins = event;
  }

  closeIdentityModal(event: any) {
    this.displayIdentityDetails = event;
  }
  closeDirectorModal(event) {
    this.displayDirectors = event;
  }
  closeShareholderModal(event) {
    this.displayDirectorShareHolders = event;
  }
}
