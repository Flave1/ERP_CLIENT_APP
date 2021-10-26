import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonService } from '../../../core/services/common.service';
import { LoanCustomerService } from '../../../core/services/loancustomer.service';
import { IdentificationService } from '../../../core/services/identification.service';
import { DepositAccountOpeningService } from '../../../core/services/depositaccountopening.service';
import { UserAccountService } from '../../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestorFundService } from '../../../core/services/investor-fund.service';
import { ValidationService } from '../../../core/services/validation.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { TreasuryService } from '../../../core/services/treasury.service';

@Component({
  selector: 'app-issuer-info',
  templateUrl: './issuer-info.component.html',
  styleUrls: ['./issuer-info.component.css']
})
export class IssuerInfoComponent implements OnInit {
  documentName: string = null;
  physicalLocation: string = null;
  documentTypeId: number = null;
  files: FileList;
  file: File;
  @ViewChild('fileInput') fileInput: any;
  form: FormGroup;
  contactForm: FormGroup;
  directorForm: FormGroup;
  identityDetailsForm: FormGroup;
  nextOfKinForm: FormGroup;
  bankDetailsForm: FormGroup;
  directorShareHolderForm: FormGroup;
  formTitle = 'Issuer Information';
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
  issuerRegistrationId: any;
  name = 'Name';
  nameDate = 'Date';
  displayCorperatCustomer = false;
  displayIndividualCustomer = false;
  selectPoliticallyPosition = false;
  selectPoliticallyExposed = false;
  selectRelativePoliticallyPosition = false;
  loanCustomerDirectors: any[] = [];
  loanCustomerIdentityDetails: any[] = [];
  loanCustomerNextOfKins: any[] = [];
  loanCustomerBankDetails: any[] = [];
  loanCustomerDirectorShareHolder: any[] = [];
  contactInfoTabDisabled: boolean;
  identityTabDisabled: boolean;
  bankTabDisabled: boolean;
  directorTabDisabled: boolean;
  uploadTabDisabled: boolean;
  genderList: any[] = [];
  martialStatusList: any[] = [];
  titleList: any[] = [];
  cityList: any[] = [];
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
  @Input() customerId;
  states: any[] = [];
  firstObj: any = {};
  moveNext: boolean;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private treasuryService: TreasuryService
  ) {
    this.form = this.fb.group({
      issuerRegistrationId: [0],
      customerTypeId: [0],
      issuerName: [''],
      businessType: ['', ],
      businessCommencementDate: [''],
      industry: [''],
      incorporationDate: [''],
      incorporationNumber: [''],
      politicallyExposed: [false],
      otherComments: [''],
      size: [''],
      institutionTypeName: [''],
      productType: ['']
    });
    this.contactForm = this.fb.group({
      issuerRegistrationId: this.issuerRegistrationId,
      contactInformationId: [0],
      nameOfContact: [''],
      phoneNumber: ['', ],
      email: [''],
      address: [''],
      cityId: [0],
      stateId: ['', ],
      postalAddress: [''],
      countryId: [0]
    });
    // this.directorForm = this.fb.group({
    //   customerDirectorId: 0,
    //   directorTypeId: ["", ],
    //   directorType: [""],
    //   issuerRegistrationId: this.issuerRegistrationId,
    //   position: ["", ],
    //   name: ["", ],
    //   incorporationNumber: ["", ],
    //   politicallyPosition: ["", ],
    //   relativePoliticallyPosition: ["", ],
    //   dob: [new Date()],
    //   phoneNo: [
    //     "",
    //     [
    //       ,
    //       Validators.pattern(/^0|[0-9]\d*$/),
    //       Validators.minLength(9)
    //     ]
    //   ],
    //   email: [
    //     "",
    //     Validators.compose([, ValidationService.isEmail])
    //   ],
    //   signature: [""],
    //   percentageShare: [""]
    // });
    // this.identityDetailsForm = this.fb.group({
    //   identityDetailsId: 0,
    //   issuerRegistrationId: this.issuerRegistrationId,
    //   number: ["", ],
    //   identity: ["", ],
    //   issuer: ["", ]
    // });
    // this.nextOfKinForm = this.fb.group({
    //   nextOfKinId: 0,
    //   issuerRegistrationId: this.issuerRegistrationId,
    //   name: ["", ],
    //   incorporationNumber: ["", ],
    //   relationship: ["", ],
    //   phoneNumber: [
    //     "",
    //     [
    //       ,
    //       Validators.pattern(/^0|[0-9]\d*$/),
    //       Validators.minLength(9)
    //     ]
    //   ],
    //   email: [
    //     "",
    //     Validators.compose([, ValidationService.isEmail])
    //   ]
    // });
    // this.bankDetailsForm = this.fb.group({
    //   bankDetailsId: 0,
    //   issuerRegistrationId: this.issuerRegistrationId,
    //   bVN: ["", ],
    //   accountNumber: ["", ],
    //   bankName: ["", ]
    // });

    this.directorShareHolderForm = this.fb.group({
      issuerRegistrationId: this.issuerRegistrationId,
      directorShareHolderId: 0,
      otherComments: ['', ],
      percentageHolder: ['', ]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.issuerRegistrationId = params['issuerRegistrationId'];
      if (
        this.issuerRegistrationId != null ||
        this.issuerRegistrationId != undefined
      ) {
        this.editLoanCustomer(this.issuerRegistrationId);
        // this.getLoanCustomerDirectorByLoanCustomer(this.issuerRegistrationId);
        // this.getIdentityDetails(this.issuerRegistrationId);
        // this.getInvestorNextOfKinDetails(this.issuerRegistrationId);
        // this.getBankDetails(this.issuerRegistrationId);
        // this.getLoanCustomerDirectorShareHolderByLoanCustomer(
        //   this.issuerRegistrationId
        // );
        this.getIssuerDocuments(this.issuerRegistrationId);
        this.openAllTabs();
      } else {
        this.resetTabs();
      }
    });
    this.loadDropDown();
  }
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  loadDropDown() {
    // this.getCountries();
    // this.commonService.getAllGender().subscribe(data => {
    //   this.genderList = data["commonLookups"];
    // });
    // this.commonService.getAllMaritalStatus().subscribe(data => {
    //   this.martialStatusList = data["commonLookups"];
    // });
    // this.commonService.getAllTitle().subscribe(data => {
    //   this.titleList = data["commonLookups"];
    // });
    // this.commonService.getAllEmployerType().subscribe(data => {
    //   this.employerTypeList = data["commonLookups"];
    // });
    // this.commonService.getAllCity().subscribe(data => {
    //
    // });
    // this.commonService.getAllState().subscribe(data => {
    //
    // });
    this.commonService.getAllCountry().subscribe(data => {
      this.countryInformation = data['commonLookups'];
    });
    // this.commonService.getAllDirectorType().subscribe(data => {
    //   this.directorTypeList = data["commonLookups"];
    // });
    this.commonService.getAllDocumentType().subscribe(data => {
      this.documentTypeList = data['commonLookups'];
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
  resetTabs() {
    this.contactInfoTabDisabled = true;
    this.identityTabDisabled = true;
    this.bankTabDisabled = true;
    this.directorTabDisabled = true;
    this.uploadTabDisabled = true;
  }

  openAllTabs() {
    this.contactInfoTabDisabled = false;
    this.identityTabDisabled = false;
    this.bankTabDisabled = false;
    this.directorTabDisabled = false;
    this.uploadTabDisabled = false;
  }

  getIdentityDetails(issuerRegistrationId) {
    this.treasuryService
      .getIdentityDetails(issuerRegistrationId)
      .subscribe(data => {
        this.loanCustomerIdentityDetails = data.identityDetails;
      });
  }
  getBankDetails(issuerRegistrationId) {
    this.treasuryService
      .getBankDetails(issuerRegistrationId)
      .subscribe(data => {
        this.loanCustomerBankDetails = data.bankDetails;
      });
  }

  editLoanCustomer(issuerRegistrationId) {
    this.formTitle = 'Edit Issuer Information';
    this.loadingService.show();
    this.treasuryService.getIssuer(issuerRegistrationId).subscribe(
      data => {
        this.loadingService.hide();
        const row = data.issuerRegistrations[0];
        this.selectedLoanCustomerInformation = row;
        if (row != undefined) {
          this.otherTabDisabled = false;
        }

        this.form = this.fb.group({
          issuerRegistrationId: row.issuerRegistrationId,
          issuerName: row.issuerName,
          businessType: row.businessType,
          businessCommencementDate: this.formatDate(row.businessCommencementDate),
          industry: row.industry,
          incorporationNumber: row.incorporationNumber,
          incorporationDate: this.formatDate(row.incorporationDate),
          politicallyExposed: [row.politicallyExposed],
          otherComments: [row.otherComments],
          size: [row.size],
          productType: [row.productType]
        });
        this.contactForm = this.fb.group({
          issuerRegistrationId: this.issuerRegistrationId,
          contactInformationId: [0],
          nameOfContact: [row.nameOfContact],
          phoneNumber: [row.phoneNumber],
          email: [row.email],
          address: [row.address],
          cityId: [row.cityId],
          stateId: [row.stateId],
          postalAddress: [row.postalAddress],
          countryId: [row.countryId]
        });
        this.getStates(row.countryId);
        this.getCities(row.stateId);
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(['/treasury/issuer-list']);
  }
  submitIssuerInfo(formObj) {
    this.firstObj = formObj.value;
    if (!this.firstObj.businessType) {
      return swal.fire('GOS FINANCIALS', 'Business type is required', 'error');
    }
    if (!this.firstObj.issuerName) {
      return swal.fire('GOS FINANCIALS', 'Issuer name is required', 'error');
    }
    if (!this.firstObj.businessCommencementDate) {
      return swal.fire(
        'GOS FINANCIALS',
        'Business commencement is required',
        'error'
      );
    }
    if (!this.firstObj.industry) {
      return swal.fire(
        'GOS FINANCIALS',
        'Business industry is required',
        'error'
      );
    }
    if (!this.firstObj.incorporationDate) {
      return swal.fire(
        'GOS FINANCIALS',
        'Incorporation date is required',
        'error'
      );
    }
    if (!this.firstObj.incorporationNumber) {
      return swal.fire(
        'GOS FINANCIALS',
        'Incorporation number is required',
        'error'
      );
    }
    this.otherTabDisabled = false;
    this.activeIndex = 1;
    this.openAllTabs();
    // return;
    // this.loadingService.show();
    // this.treasuryService.updateIssuerRegistration(formObj.value).subscribe(
    //     data => {
    //         this.loadingService.hide();
    //         if (data["result"] > 0) {
    //             this.issuerRegistrationId = data["result"];
    //             this.editLoanCustomer(this.issuerRegistrationId);
    //
    //             swal.fire("GOS FINANCIAL", data["message"], "success");
    //
    //         } else {
    //             swal.fire("GOS FINANCIAL", data["message"], "error");
    //         }
    //     },
    //     err => {
    //         this.loadingService.hide();
    //         swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
    //     }
    // );
  }
  onSavedButtonPressed() {
    swal.fire('GOS FINANCIAL', 'Record Saved Successfully', 'success');
    this.router.navigate(['/treasury/issuer-list']);
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
  saveContactInfo(formData) {
    const data = formData.value;
    if (!data.nameOfContact) {
      return swal.fire('GOS FINANCIALS', 'Contact name is required', 'error');
    }
    if (!data.phoneNumber) {
      return swal.fire('GOS FINANCIALS', 'Phone number is required', 'error');
    }
    if (!data.email) {
      return swal.fire('GOS FINANCIALS', 'Email is required', 'error');
    }
    if (!data.cityId) {
      return swal.fire('GOS FINANCIALS', 'City is required', 'error');
    }
    if (!data.countryId) {
      return swal.fire('GOS FINANCIALS', 'Country is required', 'error');
    }
    if (!data.stateId) {
      return swal.fire('GOS FINANCIALS', 'State is required', 'error');
    }
    if (!data.postalAddress) {
      return swal.fire('GOS FINANCIALS', 'Postal address is required', 'error');
    }
    const payload = { ...data, ...this.firstObj };
    // payload.size = +payload.size;
    payload.currentBalance = +payload.currentBalance;
    payload.cityId = +payload.cityId;
    payload.stateId = +payload.stateId;
    payload.countryId = +payload.countryId;
    // return;
    // payload.issuerRegistrationId = this.issuerRegistrationId;
    this.loadingService.show();
    return this.treasuryService.updateContactInfo(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.issuerRegistrationId = data.issuerRegistrationId;
          this.editLoanCustomer(this.issuerRegistrationId);
          this.moveNext = true;
          this.openNext();
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }
  openNext() {
    this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 3 : this.activeIndex - 1;
  }
  showAddNewDirectors() {
    this.displayDirectors = true;
  }

  showAddNewIdentityDetails() {
    this.displayIdentityDetails = true;
  }
  editIdentityDetails(row) {
    this.identityDetailsForm = this.fb.group({
      identityDetailsId: row.identityDetailsId,
      issuerRegistrationId: row.issuerRegistrationId,
      identity: row.identity,
      number: row.number,
      issuer: row.issuer
    });
    this.displayIdentityDetails = true;
  }
  deleteIdentityDetails(row) {
    const data = [];
    data.push(row.identityDetailsId);
    const payload = {
      itemIds: data
    };
    const __this = this;
    swal
      .fire({
        text: 'Delete this Item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!'
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.treasuryService.deleteIdentityDetails(payload).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getIdentityDetails(this.issuerRegistrationId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            err => {
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
  saveIdentityDetails(formObj) {
    const body = formObj.value;
    if (!body.identity) {
      return swal.fire('GOS FINANCIAL', 'Identity Name is required', 'error');
    }
    if (!body.number) {
      return swal.fire('GOS FINANCIAL', 'Identity number is required', 'error');
    }
    if (!body.issuer) {
      return swal.fire('GOS FINANCIAL', 'Issuer is required', 'error');
    }
    body.issuerRegistrationId = +this.issuerRegistrationId;
    this.loadingService.show();
    this.treasuryService.saveIdentityDetails(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getIdentityDetails(this.issuerRegistrationId);
          this.displayIdentityDetails = false;
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  showAddNewNextOfKins() {
    this.displayNextOfKins = true;
  }
  editNextOfKins(row) {
    this.nextOfKinForm = this.fb.group({
      nextOfKinId: row.nextOfKinId,
      issuerRegistrationId: row.issuerRegistrationId,
      name: row.name,
      incorporationNumber: row.incorporationNumber,
      relationship: row.relationship,
      phoneNumber: row.phoneNumber,
      email: row.email
      // phoneNo: [
      //     row.phoneNo,
      //     [
      //         ,
      //         Validators.pattern(/^0|[0-9]\d*$/),
      //         Validators.minLength(9)
      //     ]
      // ],
      // email: [
      //     row.email,
      //     Validators.compose([
      //         ,
      //         ValidationService.isEmail
      //     ])
      // ],
    });
    this.displayNextOfKins = true;
  }

  showAddNewBankDetails() {
    this.displayBankDetails = true;
  }
  editBankDetails(row) {
    this.bankDetailsForm = this.fb.group({
      issuerRegistrationId: row.issuerRegistrationId,
      bankDetailsId: row.bankDetailsId,
      bVN: row.bVN,
      accountNumber: row.accountNumber,
      bankName: row.bankName
    });
    this.displayBankDetails = true;
  }
  deleteBankDetails(row) {
    const data = [];
    data.push(row.bankDetailsId);
    const payload = {
      itemIds: data
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.treasuryService.deleteBankDetails(payload).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getBankDetails(this.issuerRegistrationId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            err => {
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
  saveBankDetails(formObj) {
    const body = formObj.value;
    if (!body.bankName) {
      return swal.fire('GOS FINANCIAL', 'Bank name is required', 'error');
    }
    if (!body.accountNumber) {
      return swal.fire('GOS FINANCIAL', 'Account Number is required', 'error');
    }
    if (isNaN(body.accountNumber)) {
      return swal.fire(
        'GOS FINANCIAL',
        'Hey! Account Number should be numbers',
        'error'
      );
    }
    if (body.accountNumber.length != 10) {
      return swal.fire(
        'GOS FINANCIAL',
        'Hey! Account Number should be 10 digits',
        'error'
      );
    }
    if (!body.bVN) {
      return swal.fire('GOS FINANCIAL', 'BVN is required', 'error');
    }
    if (isNaN(body.bVN)) {
      return swal.fire('GOS FINANCIAL', 'Hey! BVN should be numbers', 'error');
    }
    if (body.bVN.length != 11) {
      return swal.fire('GOS FINANCIAL', 'Hey! BVN should be 11 digits', 'error');
    }
    this.loadingService.show();
    body.issuerRegistrationId = +this.issuerRegistrationId;
    this.treasuryService.saveBankDetails(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getBankDetails(this.issuerRegistrationId);
          this.displayBankDetails = false;
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }
  showAddNewDocument() {
    this.displayDocumentUpload = true;
  }

  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
  }

  fileExtention(name: string) {
    const regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }

  uploadFile() {
    if (this.file != undefined || this.documentName != null) {
      const body = {
        issuerRegistrationId: +this.issuerRegistrationId,
        documentName: this.documentName,
        uploadDocument: this.file.name,
        documentType: this.fileExtention(this.file.name),
        physicalLocation: this.physicalLocation,
        documentTypeId: +this.documentTypeId
      };
      this.loadingService.show();
      this.treasuryService
        .uploadTreasuryFile(this.file, body)
        .then((val: any) => {
          this.loadingService.hide();
          const message = val.status.message.friendlyMessage;
          if (val.status.isSuccessful) {
            this.documentName = null;
            this.documentTypeId = null;
            this.fileInput.nativeElement.value = '';
            this.getIssuerDocuments(this.issuerRegistrationId);
            this.displayDocumentUpload = false;
            swal.fire('GOS FINANCIAL', message, 'success');
          } else {
            return swal.fire('GOS FINANCIAL', message, 'error');
          }
        })
        .catch(err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          return swal.fire('GOS FINANCIAL', message, 'error');
        });
    }
  }
  getIssuerDocuments(issuerRegistrationId) {
    this.treasuryService
      .getIssuerDocuments(issuerRegistrationId)
      .subscribe(data => {
        if (data.documents[0] !== null) {
          this.loanCustomerDocuments = data.documents;
        } else {
          this.loanCustomerDocuments = [];
        }

        // if (data.result != null) {
        //
        // } else {
        //   this.loanCustomerDocuments = [];
        // }
      });
  }
  deleteLoanCustoemrDocument(row) {
    const ids = [];
    ids.push(row.documentsId);
    const payload = {
      itemsId: ids
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete document?',
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.treasuryService
            .deleteIssuerDocument(payload)
            .subscribe(data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getIssuerDocuments(this.issuerRegistrationId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            }, err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
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
  getCountries() {
    return this.commonService
      .getCountries()
      .then(data => {
      })
      .catch(err => {

      });
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
      return swal.fire('GOS FINANCIAL', 'An error occurred', 'error');
    }
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }
}
