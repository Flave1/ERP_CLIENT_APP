import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { LoanCustomerService } from 'src/app/core/services/loancustomer.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { IdentificationService } from 'src/app/core/services/identification.service';
import { CountryService } from 'src/app/core/services/country.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserAccountService } from '../../../core/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-startloanapplication',
  templateUrl: './startloanapplication.component.html',
})
export class StartLoanApplicationComponent implements OnInit {
  documentName: string = null;
  physicalLocation: string = null;
  documentTypeId: number = null;
  files: FileList;
  file: File;
  @ViewChild('fileInput') fileInput: any;
  form: FormGroup;
  directorForm: FormGroup;
  identityDetailsForm: FormGroup;
  nextOfKinForm: FormGroup;
  bankDetailsForm: FormGroup;
  directorShareHolderForm: FormGroup;
  formTitle: string = 'Create New Customer';
  activeIndex: number = 0;
  loanCustomerInformation: any[] = [];
  identificationInformation: any[] = [];
  countryInformation: any[] = [];
  selectedLoanCustomerInformation: any = {};
  displayDirectors: boolean = false;
  displayIdentityDetails: boolean = false;
  displayNextOfKins: boolean = false;
  displayBankDetails: boolean = false;
  displayDirectorShareHolders: boolean = false;
  otherTabDisabled: boolean = true;
  customerId: any;
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
  identityTabDisabled: boolean;
  nextOfKinTabDisabled: boolean;
  bankTabDisabled: boolean;
  directorTabDisabled: boolean;
  uploadTabDisabled: boolean;
  cardDetailsForm: FormGroup;
  genderList: any[] = [];
  martialStatusList: any[] = [];
  titleList: any[] = [];
  cityList: any[] = [];
  employerTypeList: any[] = [];
  directorTypeList: any[] = [];
  documentTypeList: any[] = [];
  isDirectorOnly: boolean = false;
  id: number;
  displayDocumentUpload: boolean = false;
  displayDocument: boolean = false;
  selectedDocument: string;
  binaryFile: string;
  loanCustomerDocuments: any[] = [];
  staffList: any[];
  customerDirectorId = 0;
  percentageShare = 0;
  selectedDate: any;
  date: any;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private loanCustomerService: LoanCustomerService,
    private identificationService: IdentificationService,
    private router: Router,
    private route: ActivatedRoute,
    private userAccountService: UserAccountService,
    private location: Location
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
      countryId: [''],
      industry: [''],
      incorporationCountry: [''],
      annualTurnover: [''],
      maritalStatusId: [''],
      shareholderFund: [''],
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
      relationshipOfficerId: [''],
      accountNumber: [''],
    });
    this.directorForm = this.fb.group({
      customerDirectorId: 0,
      directorTypeId: ['', Validators.required],
      directorType: [''],
      customerId: 0,
      position: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      politicallyPosition: ['', Validators.required],
      relativePoliticallyPosition: ['', Validators.required],
      dob: [new Date()],
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
      signature: [''],
      percentageShare: [''],
    });
    this.identityDetailsForm = this.fb.group({
      customerIdentityDetailsId: 0,
      customerId: 0,
      number: ['', Validators.required],
      identificationId: ['', Validators.required],
      issuer: ['', Validators.required],
    });
    this.nextOfKinForm = this.fb.group({
      customerNextOfKinId: 0,
      customerId: 0,
      name: ['', Validators.required],
      address: ['', Validators.required],
      relationship: ['', Validators.required],
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
    this.bankDetailsForm = this.fb.group({
      customerId: 0,
      customerBankDetailsId: 0,
      bvn: ['', Validators.required],
      account: ['', Validators.required],
      bank: ['', Validators.required],
    });

    this.directorShareHolderForm = this.fb.group({
      customerId: 0,
      directorShareHolderId: 0,
      companyName: ['', Validators.required],
      percentageHolder: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.customerId = params['editloanCustomerinfo'];
      this.id = params.id;
      if (this.customerId != null || this.customerId != undefined) {
        this.editLoanCustomer(this.customerId);
        // this.getLoanCustomerDirectorByLoanCustomer(this.customerId);
        // this.getLoanCustomerIdentityDetailsByLoanCustomer(this.customerId);
        // this.getLoanCustomerNextOfKinByLoanCustomer(this.customerId);
        // this.getLoanCustomerBankDetailsByLoanCustomer(this.customerId);
        this.getLoanCustomerDirectorShareHolderByLoanCustomer(this.customerId);
        // this.getLoanCustoemrDocumentUpload(this.customerId);
        this.openAllTabs();
      } else {
        this.resetTabs();
      }
    });
    this.getStaffList();
    this.loadDropDown();
    this.getAllIdentification();
    this.onCustomerTypeChange(1);
  }

  getGenders() {
    this.loadingService.show();
    this.commonService.getAllGender().subscribe(
      (data) => {
        this.loadingService.hide().then(() => {
          this.genderList = data.commonLookups;
        });
      },
      (err) => {
        this.loadingService.hide().then(() => {});
      }
    );
  }
  getMaritalStatus() {
    this.loadingService.show();
    this.commonService.getAllMaritalStatus().subscribe(
      (data) => {
        this.loadingService.hide().then(() => {
          this.martialStatusList = data.commonLookups;
        });
      },
      (err) => {
        this.loadingService.hide().then(() => {});
      }
    );
  }
  // get titles
  getTitles() {
    this.loadingService.show();
    this.commonService.getAllTitle().subscribe(
      (data) => {
        this.loadingService.hide().then(() => {
          this.titleList = data.commonLookups;
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getEmployerTypes() {
    this.loadingService.show();
    this.commonService.getAllEmployerType().subscribe(
      (data) => {
        this.loadingService.hide().then(() => {
          this.employerTypeList = data.commonLookups;
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // get cities
  getCities() {
    this.loadingService.show();
    this.commonService.getAllCity().subscribe(
      (data) => {
        this.loadingService.hide().then(() => {
          this.cityList = data.commonLookups;
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // get countries
  getCountries() {
    this.loadingService.show();
    this.commonService.getAllCountry().subscribe(
      (data) => {
        this.loadingService.hide().then(() => {
          this.countryInformation = data.commonLookups;
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // get director types
  getDirectorTypes() {
    this.loadingService.show();
    this.commonService.getAllDirectorType().subscribe(
      (data) => {
        this.loadingService.hide().then(() => {
          this.directorTypeList = data.commonLookups;
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  //
  getDocumentTypes() {
    this.loadingService.show();
    this.commonService.getAllDocumentType().subscribe(
      (data) => {
        this.loadingService.hide().then(() => {
          this.documentTypeList = data.commonLookups;
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  loadDropDown() {
    this.getGenders();
    this.getMaritalStatus();
    this.getTitles();
    this.getEmployerTypes();
    this.getCities();
    this.getCountries();
    this.getDocumentTypes();
  }
  resetTabs() {
    this.identityTabDisabled = true;
    this.nextOfKinTabDisabled = true;
    this.bankTabDisabled = true;
    this.directorTabDisabled = true;
    this.uploadTabDisabled = true;
  }

  openAllTabs() {
    this.identityTabDisabled = false;
    this.nextOfKinTabDisabled = false;
    this.bankTabDisabled = false;
    this.directorTabDisabled = false;
    this.uploadTabDisabled = false;
  }
  getStaffList() {
    this.loadingService.show();
    this.userAccountService.getStaffList().subscribe(
      (data) => {
        this.loadingService.hide();
        this.staffList = data.staff;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getLoanCustomerDirectorByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerDirectorByLoanCustomer(customerId)
      .subscribe((data) => {
        this.loanCustomerDirectors = data.customerDirectors;
      });
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
        this.loanCustomerIdentityDetails = data.customerIdentity;
      });
  }
  getLoanCustomerNextOfKinByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerNextOfKinByLoanCustomer(customerId)
      .subscribe((data) => {
        this.loanCustomerNextOfKins = data.customerNextOfKin;
      });
  }
  getLoanCustomerBankDetailsByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerBankDetailsByLoanCustomer(customerId)
      .subscribe((data) => {
        this.loanCustomerBankDetails = data.customerBankDetails;
      });
  }

  getLoanCustomerDirectorShareHolderByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerDirectorShareHolderByLoanCustomer(customerId)
      .subscribe((data) => {
        this.loanCustomerDirectorShareHolder = data.directorShareHolder;
      });
  }

  editLoanCustomer(customerId) {
    this.formTitle = 'Edit Loan Customer Information';
    this.loadingService.show();
    this.loanCustomerService.getLoanCustomer(customerId).subscribe((data) => {
      this.loadingService.hide();
      let row = data.customers[0];
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
        accountNumber: row.casaAccountNumber,
      });

      this.onCustomerTypeChange(row.customerTypeId);
    });
  }

  goBack() {
    // this.router.navigate(["/credit/loancustomer-list"]);
    this.location.back();
  }
  submitLoanCustomerInfo(formObj) {
    const payload = formObj.value;
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
    this.loadingService.show();
    this.loanCustomerService.addLoanCustomerInformation(payload).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data.status.isSuccessful) {
          this.customerId = data.customerId;
          this.otherTabDisabled = false;
          this.openAllTabs();
          // swal.fire("GOS FINANCIAL", data["message"], "success");
          this.activeIndex = 1;
        } else {
          return swal.fire('GOS FINANCIAL', data['message'], 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', JSON.stringify(err), 'error');
      }
    );
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

    //Corporate Customer
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
  deleteDirectors(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete item?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomerDirector(row.customerDirectorId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'User deleted successful.',
                  'success'
                );
                __this.getLoanCustomerDirectorByLoanCustomer(this.customerId);
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  submitLoanCustomerDirectors(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.dob = this.formatDate(body.dob);
    body.customerId = this.customerId;
    this.loanCustomerService
      .addLoanCustomerDirector(this.file, body)
      .then(
        (data) => {
          this.loadingService.hide();
          const message = data.status.message.friendlyMessage;
          if (data.status.isSuccessful) {
            swal.fire('GOS FINANCIAL', message, 'success');
            this.displayDirectors = false;
            this.getLoanCustomerDirectorByLoanCustomer(this.customerId);
          } else {
            swal.fire('GOS FINANCIAL', message, 'error');
          }
        }
        // err => {
        //     this.loadingService.hide();
        //     swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
        // }
      )
      .catch((err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  showAddNewIdentityDetails(value) {
    this.displayIdentityDetails = value;
  }
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
  deleteIdentityDetails(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete item?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomerIdentityDetails(row.customerIdentityDetailsId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                __this.getLoanCustomerIdentityDetailsByLoanCustomer(
                  this.customerId
                );
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  submitLoanCustomerIdentityDetails(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.customerId = this.customerId;
    this.loanCustomerService.addLoanCustomerIdentityDetails(body).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data['result'] == true) {
          swal.fire('GOS FINANCIAL', data['message'], 'success');
          this.getLoanCustomerIdentityDetailsByLoanCustomer(this.customerId);
          this.displayIdentityDetails = false;
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

  showAddNewNextOfKins(value) {
    this.displayNextOfKins = value;
  }
  editNextOfKins(row) {
    this.nextOfKinForm = this.fb.group({
      customerNextOfKinId: row.customerNextOfKinId,
      customerId: row.customerId,
      name: row.name,
      address: row.address,
      relationship: row.relationship,
      phoneNo: row.phoneNo,
      email: row.email,
      // phoneNo: [
      //     row.phoneNo,
      //     [
      //         Validators.required,
      //         Validators.pattern(/^0|[0-9]\d*$/),
      //         Validators.minLength(9)
      //     ]
      // ],
      // email: [
      //     row.email,
      //     Validators.compose([
      //         Validators.required,
      //         ValidationService.isEmail
      //     ])
      // ],
    });
    this.displayNextOfKins = true;
  }
  deleteNextOfKins(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete item?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomerNextOfKin(row.customerNextOfKinId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                __this.getLoanCustomerNextOfKinByLoanCustomer(this.customerId);
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  submitLoanCustomerNextOfKins(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.customerId = this.customerId;
    this.loanCustomerService.addLoanCustomerNextOfKin(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getLoanCustomerNextOfKinByLoanCustomer(this.customerId);
          this.displayNextOfKins = false;
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

  showAddNewBankDetails(value) {
    this.displayBankDetails = value;
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
  deleteBankDetails(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete item?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomerBankDetails(row.customerBankDetailsId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                __this.getLoanCustomerBankDetailsByLoanCustomer(
                  this.customerId
                );
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  submitLoanCustomerBankDetails(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.customerId = this.customerId;
    this.loanCustomerService.addLoanCustomerBankDetails(body).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data['result'] == true) {
          swal.fire('GOS FINANCIAL', data['message'], 'success');
          this.getLoanCustomerBankDetailsByLoanCustomer(this.customerId);
          this.displayBankDetails = false;
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
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete user?',
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
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                __this.getLoanCustomerDirectorShareHolderByLoanCustomer(
                  this.customerId
                );
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  submitLoanCustomerDirectorShareHolders(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.customerId = this.customerId;
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
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }

  uploadFile() {
    if (this.file != undefined || this.documentName != null) {
      let body = {
        customerId: this.customerId,
        documentName: this.documentName,
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
        physicalLocation: this.physicalLocation,
        documentTypeId: this.documentTypeId,
      };
      this.loadingService.show();
      this.loanCustomerService.uploadFile(this.file, body).then(
        (val: any) => {
          this.documentName = null;
          this.documentTypeId = null;
          this.fileInput.nativeElement.value = '';
          this.loadingService.hide();
          this.getLoanCustoemrDocumentUpload(this.customerId);

          this.loadingService.hide();
          this.displayDocumentUpload = false;
        },
        (error) => {
          this.documentName = null;
          this.documentTypeId = null;
          this.fileInput.nativeElement.value = '';
          this.getLoanCustoemrDocumentUpload(this.customerId);
          this.displayDocumentUpload = false;
          this.loadingService.hide(1000);
        }
      );
    }
  }
  getLoanCustoemrDocumentUpload(customerId) {
    this.loanCustomerService
      .getLoanCustomerDocumentByLoanCustomer(customerId)
      .subscribe((data) => {
        this.loanCustomerDocuments = data.customerDocuments;
      });
  }
  deleteLoanCustoemrDocument(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete document?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomerDocument(row.customerDocumentId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                __this.getLoanCustoemrDocumentUpload(this.customerId);
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  viewDocument(id: number) {
    this.loadingService.show();
    this.loanCustomerService.getLoanCustomerDocument(id).subscribe((data) => {
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
    this.loanCustomerService.getLoanCustomerDocument(id).subscribe((data) => {
      this.loadingService.hide();
      let fileDocument = data['result'];
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
              type: 'image/jpg',
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'image/jpg',
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
              type: 'image/png',
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'image/png',
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
              type: 'application/pdf',
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'application/pdf',
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
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
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
              type: 'application/msword',
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: 'application/msword',
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
  onSavedButtonPressed(customerId) {
    this.router.navigate(['/credit/loanapplication-info'], {
      queryParams: { passloanapplication: customerId, id: this.id },
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
