import { CurrencyService } from "./../../../core/services/currency.service";
import { saveAs } from "file-saver";
import { CommonService } from "./../../../core/services/common.service";
import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingService } from "src/app/core/services/loading.service";
import { ValidationService } from "src/app/core/services/validation.service";
import { IdentificationService } from "src/app/core/services/identification.service";
import { DepositAccountOpeningService } from "../../../core/services/depositaccountopening.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";
import { UserAccountService } from "src/app/core/services/user.service";

interface SelectedItem {
  label: string,
  value: number
}

@Component({
  selector: "app-accountopening",
  templateUrl: "./accountopening.component.html"
})
export class AccountopeningComponent implements OnInit {
  selectedItems: any[] = [];
  form: FormGroup;
  accountinformation: FormGroup;
  directorForm: FormGroup;
  identityDetailsForm: FormGroup;
  nextOfKinForm: FormGroup;
  bankDetailsForm: FormGroup;
  directorShareHolderForm: FormGroup;
  formTitle: string = "Create Customer";
  activeIndex: number = 0;
  CustomerInformation: any[] = [];
  identificationInformation: any[] = [];
  countryInformation: any[] = [];
  selectedCustomerInformation: any = {};
  displayDirectors: boolean = false;
  displayIdentityDetails: boolean = false;
  displayNextOfKins: boolean = false;
  displayBankDetails: boolean = false;
  displayDirectorShareHolders: boolean = false;
  otherTabDisabled: boolean = true;
  customerId: any;
  name: string = "Name";
  nameDate: string = "Date";
  displayCorperatCustomer: boolean = false;
  displayIndividualCustomer: boolean = false;
  selectPoliticallyPosition: boolean = false;
  selectPoliticallyExposed: boolean = false;
  selectRelativePoliticallyPosition: boolean = false;
  checkedisStockExchange: boolean = false;
  identityTabDisabled: boolean;
  nextOfKinTabDisabled: boolean;
  bankTabDisabled: boolean;
  directorTabDisabled: boolean;
  displayContactPersons: boolean;
  uploadTabDisabled: boolean;
  genderList: any[] = [];
  martialStatusList: any[] = [];
  titleList: any[] = [];
  cityList: any[] = [];
  employerTypeList: any[] = [];
  directorTypeList: any[] = [];
  documentTypeList: any[] = [];
  isDirectorOnly: boolean = false;

  displayDocumentUpload: boolean = false;
  displayDocument: boolean = false;
  selectedDocument: string;
  binaryFile: string;
  loanCustomerDocuments: any[] = [];
  displayKYC: boolean;
  accountCategory: any[];
  accountype: any[];
  currency: any[];
  currencyArray: any[];
  stateList: any[];
  selectedResidentOfCountry: boolean = false;
  checkedinternetBanking: boolean = false;
  checkedEmailStatement: boolean = false;
  checkedCard: boolean = false;
  checkedSmsAlert: boolean = false;
  checkedemailAlert: boolean = false;
  checkedtoken: boolean = false;
  displayEmployerDetails: boolean = false;
  displaySelfEmployedDetails: boolean = false;
  selectfinanciallydisadvantaged: boolean = false;
  selecttieredKycrequirement: boolean = false;
  selectpoliticallyExposedPerson: boolean = false;
  selectutilityBillSubmitted: boolean = false;
  selectaccountOpeningCompleted: boolean = false;
  selectrecentPassportPhoto: boolean = false;
  selectedcompletionStatus: boolean = false;
  kycForm: FormGroup;
  KYCDetails: any[];
  kycTabDisabled: boolean;
  SignatoryTabDisabled: boolean;
  othersTabDisabled: boolean;
  CustomerIdentityDetails: any[];
  displaySigatory: boolean = false;
  signatoryForm: FormGroup;
  CustomerSignatory: any[];
  CustomerNextOfKins: any[];
  CustomerDirectors: any[];
  signatoryId: any;
  CustomerDocuments: any[];
  displaySignature: boolean = false;
  directorId: [0];
  cutomerType: number;
  CustomerDirector: any[] = [];
  CustomerContactPersons: any[];
  ContactPersonForm: FormGroup;
  signatoryMandate: FormGroup;
  AccountSetup: any[];
  staffList: any[];
  isCorporate: boolean = false;
  inStockExchange: boolean = false;
  IfEmployedOrSelfEmployed: boolean = false;
  employed: boolean = false;
  selfemployed: boolean = false;
  employmentTypeIsOthers: boolean = false;
  employmentType: number;
  soleSignatoryChange: boolean = true;
  DirectorsInformation: FormGroup;
  displayDirectorsForm: boolean = false;
  // fileUrl: "";
  dropdownSettings: any = {};
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private currencyService: CurrencyService,
    private identificationService: IdentificationService,
    private CustomerService: DepositAccountOpeningService,
    private DepositAccountService: DepositAccountService,
    private userAccountService: UserAccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.form = this.fb.group({
      customerId: [0],
      customerTypeId: [this.cutomerType],
      accountTypeId: [0],
      title: [0],
      accountNumber: [""],
      firstname: ["", Validators.required],
      surname: [""],
      othername: [""],
      maritalStatusId: [0],
      genderId: [0],
      dob: [null, Validators.required],
      motherMaidenName: [""],
      taxIDNumber: [""],
      bvn: [""],
      residentPermitNumber: [""],
      permitIssueDate: [new Date()],
      socialSecurityNumber: [""],
      stateOfOrigin: [0],
      nationality: [0],
      phoneNumber: [""],
      stateId: [0],
      relationshipOfficerId: [0],
      residentAddress2: [""],
      residentAddress1: [""],
      residentCountryId: [0],
      residentOfCountry: [false],
      email: [
        "",
        Validators.compose([Validators.required, ValidationService.isEmail])
      ],
      mailingAddress: [""],
      mobileNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^0|[0-9]\d*$/),
          Validators.minLength(9)
        ]
      ],
      PhoneNumber: [""],
      permitExpiryDate: [new Date()],
      certOfIncorporationNumber: [""],
      dateOfIncorporation: [new Date()],
      jurisdictionOfincorporatoin: [""],
      natureOfBusiness: [""],
      sectorOrIndustry: [""],
      operatingAdress1: [""],
      operatingAdress2: [""],
      localGovernment: [""],
      website: [""],
      scuml: [""],
      companyName: [""],
      estimatedAnnualRevenue: [""],
      isYourCompanyQuotedOnTheStockExchange: [false],
      stockExchange: [""],

      //Residential
      residentialState: [0],
      residentialCity: [0],
      residentialLGA: [""],
      regAddifDifffromopAdd: [""],

      //Employment details
      employmentType: [""],
      businessName: [""],
      businessAddress: [""],
      businessState: [""],
      jobTitle: [""],
      other: [""],
      otherComment: [""],
    });

    this.accountinformation = this.fb.group({

      accountdetailId: [0],
      internetBanking: [false],
      emailStatement: [false],
      card: [false],
      smsAlert: [false],
      emailAlert: [false],
      token: [false],
      //
      accountCategoryId: [0],
      accountTypeId: [0],
      currencies: [[],],
      isYourCompanyQuotedOnTheStockExchange: [false]
    });

    this.identityDetailsForm = this.fb.group({
      identificationId: [0],
      customerId: [this.customerId],
      identification: [0],
      identificationNumber: [""],
      dateIssued: [new Date()],
      expiryDate: [new Date(),],

      //next of kin
      // nextOfKinTitle: [""],
      // nextOfKinSurname: [""],
      // nextOfKinFirstName: [""],
      // nextOfKinOtherNames: [""],
      // nextOfKinDateOfBirth: [""],
      // nextOfKinGender: [""],
      // nextOfKinRelationship: [""],
      // nextOfKinMobileNumber: [""],
      // nextOfKinEmailAddress: [""],
      // nextOfKinAddress: [""],
      // nextOfKinCity: [""],
      // nextOfKinState: [""],
    });

    this.kycForm = this.fb.group({
      kycId: [0],
      customerId: this.customerId,
      financiallydisadvantaged: false,
      otherDocumentsObtained: [""],
      doesTheCustomerEnjoyTieredKYC: false,
      riskCategory: [""],
      isCustomerPoliticalyExposed: false,
      politicalyExposedDetails: [""],
      addressVisited: [""],
      commentOnLocation: [""],
      location_ColorOfbuilding: [""],
      location_DescriptionOfBuilding: [""],
      fullNameOfVisitingStaff: [""],
      dateOfVisitation: [new Date()],
      isUtilityBillSubmitted: [false],
      dulyCompletedAccountOpenningForm: [false],
      recentPassportPhotograph: [false],
      confirmed: ["1" ? true : false],
      confirmaiotnname: [""],
      confirmationDate: [new Date()],
      deferralFullName: [""],
      deferralDate: [new Date()],
      deferralApproved: [""],
    });

    this.directorForm = this.fb.group({
      customerId: [0],
      directorsId: [0],
      firstName: [''],
      surname: [''],
      otherNames: [''],
      gender: [''],
      maritalStatus: [''],
      dob: [""],
      pob: [""],
      motherMaidienName: [''],
      nameOfNextOfKin: [''],
      lga: [""],
      state: [''],
      taxIdentitfication: [''],
      meansOfIdentification: [0],
      identificationNumber: [""],
      idIssuedate: [""],
      occupation: [""],
      jobTitle: [""],
      position: [""],
      nationality: [""],
      residentPermitNumber: [""],
      permitIssueDate: [""],
      permitExpiryDate: [""],
      socialSecurityNumber: [""],
      residentialLGA: [""],
      residentialCity: [""],
      residentialState: [""],
      mailingAddressSameWithResidentialAddress: [false],
      mailingLGA: [""],
      mailingCity: [""],
      mailingState: [""],
      mobileNumber: [""],
      phoneNumber: [""],
      emailAddress: [""],
      signatureName: [''],
      signatureFile: ['']
    });

    this.nextOfKinForm = this.fb.group({
      nextOfKinId: [0],
      customerId: [0],
      nextOfKinTitle: [""],//
      nextOfKinSurname: ["", Validators.required],//
      nextOfKinFirstName: ["", Validators.required],//
      nextOfKinOtherNames: [""],//
      nextOfKinDateOfBirth: [new Date()],//
      nextOfKinGender: [0],//
      nextOfKinAddress: ["", Validators.required],//
      nextOfKinCity: [""],//
      nextOfKinState: [""],//
      nextOfKinRelationship: ["", Validators.required],//
      nextOfKinMobileNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^0|[0-9]\d*$/),
          Validators.minLength(9)
        ]
      ],//
      nextOfKinEmailAddress: [
        "",
        Validators.compose([Validators.required, ValidationService.isEmail])
      ],//

      //Employment details

      employmentType: [0],
      businessName: [""],
      businessAddress: [""],
      businessState: [""],
      jobTitle: [""],
      other: [""],
      otherComment: [""]

    });

    this.signatoryForm = this.fb.group({
      signatoriesId: 0,
      customerId: [this.customerId],
      title: [0],
      surname: ["", Validators.required],
      firstname: ["", Validators.required],
      classofSignatory: [""],
      identificationType: [0],
      identificationNumber: [""],
      telephone: [""],
      signatureUpload: [""],
      otherNames: [""],
      signatureFile: [""],
      isDeclaration: [false]
    });

    this.bankDetailsForm = this.fb.group({
      customerId: 0,
      customerBankDetailsId: 0,
      bvn: ["", Validators.required],
      account: ["", Validators.required],
      bank: ["", Validators.required]
    });

    this.directorShareHolderForm = this.fb.group({
      customerId: 0,
      directorShareHolderId: 0,
      companyName: ["", Validators.required],
      percentageHolder: ["", Validators.required]
    });
    this.signatoryMandate = this.fb.group({
      number_of_to_sign: [0],
      isDeclaration: [true],
      soleSignatory: [true],
      customerId: [this.customerId],
      declarationName: [""],
      declarationChecked: [false]
    });

    this.ContactPersonForm = this.fb.group({
      keyContactPersonId: 0,
      customerId: [this.customerId],
      fullName: ["", Validators.required],
      jobTitle: ["", Validators.required],
      email: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      officeAddress: ["", Validators.required],
      genderId: ["", Validators.required],
      address: ["", Validators.required],
    });

    this.DirectorsInformation = this.fb.group({
      directorId: [0],
      customerId: [0],
      titleId: [0],
      genderId: [0],
      surname: "",
      firstname: "",
      othername: "",
      identificationType: "",
      identificationNumber: "",
      telephone: "",
      mobile: [
        "",
        [
          Validators.required,
          Validators.pattern(/^0|[0-9]\d*$/),
          Validators.minLength(9)
        ]
      ],
      email: [
        "",
        Validators.compose([
          Validators.required,
          ValidationService.isEmail
        ])
      ],
      signatureUpload: "",
      date: "",
      doB: "",
      placeOfBirth: "",
      maritalStatusId: [0],
      maidenName: "",
      nextofKin: "",
      lga: "",
      stateOfOrigin: [0],
      taxIDNumber: "",
      bvn: "",
      meansOfID: [0],
      idExpiryDate: "",
      idIssueDate: "",
      occupation: "",
      jobTitle: "",
      position: "",
      nationality: "",
      residentOfCountry: [false],
      residentPermit: "",
      permitIssueDate: "",
      permitExpiryDate: "",
      socialSecurityNumber: "",
      address1: "",
      city1: "",
      state1: "",
      country1: "",
      address2: "",
      city2: "",
      state2: "",
      country2: ""
    });


  }


  ngOnInit() {
    this.getCurrencyList();
    this.route.queryParams.subscribe(params => {
      this.customerId = params["editCustomer"];

      if (params.type == 2) {
        this.isCorporate = true;
      }
      if (params.type == 1) {
        this.isCorporate = false;
      }
      // this.onCustomerTypeChange(params.type);
      if (this.customerId != null || this.customerId != undefined) {
        this.editCustomer(this.customerId);
        // this.editKYCDetails(this.customerId);
        this.getCustomerIdentityDetailsByCustomer(this.customerId);
        // this.getCustomerNextOfKinByCustomer(this.customerId);
        this.getCustomerContactPersonsByCustomer(this.customerId);
        this.getSignatoryByCustomer(this.customerId);
        this.getDirectorsByCustomer(this.customerId);
        // this.getKYC(this.customerId);
        // this.getDirectorsByCustomer(this.customerId);
        // this.getCustoemrDocumentUpload(this.customerId);
        this.openAllTabs();
      } else {
        this.resetTabs();
      }
    });
    this.getCategory();
    this.getAccounttype();
    this.loadDropDown();
    this.getAllIdentification();
    // this.onCustomerTypeChange(this.cutomerType);
    this.onEmploymentTypeChange(1);
    this.getAllAccountSetup();
    this.getStaffList();
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Currencies",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      primaryKey: 'id',
      labelKey: 'itemName',
      classes: "myclass custom-class"
    };
  }

  isInStockExchangeChange(event) {

    if (event.target.checked) {
      this.inStockExchange = true;
      return;
    }
    if (event.target.unChecked) {
      this.inStockExchange = false;
      return;
    }
    this.inStockExchange = false;
    return;
  }

  submitAccountinformation(formObj) {
    let body = formObj.value;
    // this.accountinformation.patchValue({
    //     //   currencies: this.selectedItems
    //     // })
    body.customerId = parseInt(this.customerId);
    body.accountTypeId = parseInt(body.accountTypeId);
    body.accountCategoryId = parseInt(body.accountCategoryId);

    this.loadingService.show();
    this.CustomerService.addCustomerAccountInfo(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getCustomerIdentityDetailsByCustomer(this.customerId);
          this.displayIdentityDetails = false;
          this.identityDetailsForm.reset();
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

  submitCustomerIdentificationDetail(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.customerId = parseInt(this.customerId);
    body.identification = parseInt(body.identification);
    body.identificationId = parseInt(body.identificationId);
    this.CustomerService.addCustomerIdentityDetails(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getCustomerIdentityDetailsByCustomer(this.customerId);
          this.displayIdentityDetails = false;
          this.identityDetailsForm.reset();
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

  submitCustomerNextOfKins(formObj) {
    let body = formObj.value;
    body.customerId = parseInt(this.customerId);
    body.genderId = parseInt(body.genderId);
    body.employmentType = parseInt(body.employmentType);
    this.loadingService.show();
    this.CustomerService.addCustomerNextOfKin(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.displayNextOfKins = false;
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

  submitCustomerKYC(formObj) {
    let body = formObj.value;
    body.customerId = parseInt(this.customerId);
    body.confirmed = body.confirmed.toLowerCase() == 'true';
    body.riskCategoryId = parseInt(body.riskCategoryId)
    this.loadingService.show();
    this.CustomerService.addupdateCustomerKYc(body).subscribe(
      data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getKYC(this.customerId);
          // this.displayBankDetails = false;

          this.loadingService.hide();
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

  editIdentityDetails(row) {
    this.identityDetailsForm = this.fb.group({
      identificationId: row.identificationId,
      customerId: row.customerId,
      identification: row.identification,
      identificationNumber: row.identificationNumber,
      dateIssued: new Date(row.dateIssued),
      expiryDate: new Date(row.expiryDate),

    });
    this.displayIdentityDetails = true;
  }

  date1: string;
  selectedDate: string;


  editSignatory(row) {
    this.signatoryForm = this.fb.group({
      signatoriesId: [row.signatoriesId],
      customerId: [this.customerId],
      title: [row.title],
      surname: [row.surname, Validators.required],
      firstname: [row.firstName, Validators.required],
      othername: [row.othername],
      classofSignatory: [row.classOfSignatory],
      identificationType: [row.identificationType],
      identificationNumber: [row.identificationNumber],
      telephone: [row.telephone],
      signatureUpload: [row.signatureUpload],
      otherNames: [row.otherNames]
    });
    this.displaySigatory = true;
  }

  submitCustomerSigatory(formObj: FormGroup) {
    let body = formObj.value;

    if (!this.signatureFile) {
      return swal.fire("GOS FINANCIAL", "Please select a file", "error");
    }
    body.customerId = parseInt(this.customerId);
    body.document = this.signatureFile.name;
    body.titleId = parseInt(body.titleId);
    body.genderId = parseInt(body.genderId);
    body.maritalStatusId = parseInt(body.maritalStatusId);
    body.lga = parseInt(body.lga);
    body.stateOfOrigin = parseInt(body.stateOfOrigin);
    body.nationality = parseInt(body.nationality);
    body.classofSignatory = parseInt(body.classofSignatory);
    this.loadingService.show();
    body.identificationType = parseInt(body.identificationType);
    this.CustomerService.uploadSignatorySignature(this.signatureFile, body).then(
      data => {

        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.SignaturefileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
          this.getSignatoryByCustomer(this.customerId);
          this.displaySigatory = false;
          this.loadingService.hide();
          //this.signatoryId = data["result"];
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
    ).catch(err => {
      this.loadingService.hide();
      const error = JSON.parse(err);
      const message = error.status.message.friendlyMessage;
      swal.fire("GOS FINANCIAL", message, "error");
    })
  }


  submitMandate(formObj: FormGroup) {
    let body = formObj.value;

    body.customerId = parseInt(this.customerId);
    body.number_of_to_sign = parseInt(body.number_of_to_sign);
    debugger;
    body.identificationType = 0;
    this.loadingService.show();
    this.CustomerService.uploadSignatorySignature(this.signatureFile, body).then(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.SignaturefileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
          this.getSignatoryByCustomer(this.customerId);
          this.displaySigatory = false;
          this.signatoryId = data["result"];
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },

    ).catch(err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire("GOS FINANCIAL", message, "error");
    })

  }


  onSoleSignatoryChange(event) {
    this.soleSignatoryChange = event.target.value;
    this.signatoryMandate.patchValue({
      soleSignatory: event.target.value.toLowerCase() == 'true'
    });
    return;
  }

  onSelfEmplyedOrEmplyedChange(event) {
    if (event.target.value == 1) {
      this.IfEmployedOrSelfEmployed = true;
      this.employed = true;
      this.selfemployed = false;
      this.employmentTypeIsOthers = false;
      return;
    }


    if (event.target.value == 2) {
      this.IfEmployedOrSelfEmployed = true;
      this.employed = false;
      this.selfemployed = true;
      this.employmentTypeIsOthers = false;
      return;
    }

    if (event.target.value == 3) {
      this.IfEmployedOrSelfEmployed = false;
      this.employed = false;
      this.selfemployed = false;
      this.employmentTypeIsOthers = false;
      return;
    }
    if (event.target.value == 6) {
      this.IfEmployedOrSelfEmployed = false;
      this.employed = false;
      this.selfemployed = false;
      this.employmentTypeIsOthers = true;
      return;
    }
    this.IfEmployedOrSelfEmployed = false;
    this.employed = false;
    this.selfemployed = false;
    this.employmentTypeIsOthers = false;
    return;
  }

  loadDropDown() {
    this.loadingService.show();
    this.commonService.getAllGender().subscribe(data => {
      this.genderList = data.commonLookups;
      this.loadingService.hide();
    });
    this.commonService.getAllMaritalStatus().subscribe(data => {
      this.martialStatusList = data.commonLookups;
    });
    this.commonService.getAllTitle().subscribe(data => {

      this.titleList = data.commonLookups;
      this.loadingService.hide();
    });
    this.commonService.getAllEmployerType().subscribe(data => {
      this.employerTypeList = data.commonLookups;
      this.loadingService.hide();
    });
    this.commonService.getAllCity().subscribe(data => {
      this.cityList = data.commonLookups;
      this.loadingService.hide();
    });
    this.commonService.getAllState().subscribe(data => {
      this.stateList = data.commonLookups;
      this.loadingService.hide();
    });
    // this.commonService.getAllCurrency().subscribe(data => {
    //   this.currency = data.commonLookups;
    //   this.loadingService.hide();
    // });
    this.commonService.getAllCountry().subscribe(data => {
      this.countryInformation = data.commonLookups;
      this.loadingService.hide();
    });
    // this.commonService.getAllDirectorType().subscribe(data => {
    //   this.directorTypeList = data.commonLookups;
    // });
    this.commonService.getAllDocumentType().subscribe(data => {
      this.documentTypeList = data.commonLookups;
      this.loadingService.hide();
    });
  }

  resetTabs() {
    // this.identityTabDisabled = false;
    // this.nextOfKinTabDisabled = true;
    // this.kycTabDisabled = true;
    // this.uploadTabDisabled = true;
    // this.SignatoryTabDisabled = true;
    // this.othersTabDisabled = true;
    // this.bankTabDisabled = true;
    // this.directorTabDisabled = true;
    // this.displayContactPersons = true;
  }

  openAllTabs() {
    this.identityTabDisabled = false;
    this.nextOfKinTabDisabled = false;
    this.kycTabDisabled = false;
    this.uploadTabDisabled = false;
    this.SignatoryTabDisabled = false;
    this.othersTabDisabled = false;
    this.bankTabDisabled = false;
    this.directorTabDisabled = false;
  }

  getCategory() {
    this.loadingService.show();
    this.DepositAccountService.getAllcategory().subscribe(data => {
      this.loadingService.hide();
      if (data != null) {
        this.accountCategory = data.categories;
      }
    });
  }

  getAccounttype() {
    this.loadingService.show();
    this.DepositAccountService.getAllAccountType().subscribe(data => {
      this.loadingService.hide();
      this.accountype = data.accountTypes;
    });
  }

  getAllAccountSetup() {
    this.loadingService.show();
    this.DepositAccountService.getAllAccountSetup().subscribe(data => {
      this.loadingService.hide();
      this.AccountSetup = data.depositAccounts;
    });
  }

  onCustomerTypeChange(customerTypeId) {
    if (customerTypeId == 2) {
      this.isCorporate = true;
    }
    if (customerTypeId == 1) {
      this.isCorporate = false;
    }
    this.cutomerType = parseInt(customerTypeId);
  }

  onEmploymentTypeChange(empType) {
    if (empType == 1) {
      this.displayEmployerDetails = true;
      this.displaySelfEmployedDetails = false;
    } else if (empType == 2) {
      this.displaySelfEmployedDetails = true;
      this.displayEmployerDetails = false;
    } else {
      this.displaySelfEmployedDetails = false;
      this.displayEmployerDetails = false;
    }
  }

  getAllIdentification() {
    this.commonService.getAllIdentification().subscribe(data => {
      this.identificationInformation = data.commonLookups;
    });
  }


  getCustomerIdentityDetailsByCustomer(customerId) {
    this.CustomerService.getCustomerIdentityDetailsByCustomer(
      customerId
    ).subscribe(data => {
      this.CustomerIdentityDetails = data.identification;
    });
  }

  getCustomerContactPersonsByCustomer(customerId) {
    this.loadingService.show();
    this.CustomerService.getCustomerContactPersons(customerId).subscribe(
      data => {
        this.CustomerContactPersons = data.keyContactPersons;
        this.loadingService.hide();
      }
    );
  }

  getSignatoryByCustomer(customerId) {
    this.CustomerService.getSignatory(customerId).subscribe(data => {
      this.CustomerSignatory = data.signatories;
    });
  }

  getDirectorsByCustomer(customerId) {
    this.CustomerService.getDirectorbyCID(customerId).subscribe(data => {
      this.CustomerDirector = data.directors;
    });
  }

  getKYC(customerId) {
    this.CustomerService.getKYC(customerId).subscribe(data => {
      this.KYCDetails = data.kyCustomers;
    });
  }

  editCustomer(customerId) {
    this.formTitle = "Edit Customer Information";
    this.loadingService.show();
    this.CustomerService.getCustomer(customerId).subscribe(
      data => {
        let row = data.customerAccountDetails[0];
        let id = data.identification[0];
        let kyc = data.kyc[0];
        let dir = data.directors[0];
        let nxt = data.nextOfKins[0];
        let actInfor = data.accountInformations[0];
        this.cutomerType = row.customerTypeId;
        this.isCorporate = row.customerTypeId == 1 ? false : true;

        if (row != undefined) {
          this.otherTabDisabled = false;
        }

        this.employmentType = row.employmentType;

        this.form = this.fb.group({
          customerId: [row.customerId],
          customerTypeId: [row.customerTypeId],
          accountTypeId: [row.accountTypeId],
          accountCategoryId: [row.accountCategoryId],
          currencyId: [row.currencyId],
          title: [row.title],
          accountNumber: [row.accountNumber],
          firstname: [row.firstname, Validators.required],
          surname: [row.firstname],
          othername: [row.othername],
          maritalStatusId: [row.maritalStatusId],
          genderId: [row.genderId],
          dob: [new Date(row.dob), Validators.required],
          motherMaidenName: [row.motherMaidenName],
          taxIDNumber: [row.taxIDNumber],
          bvn: [row.bvn],
          residentPermitNumber: [row.residentPermitNumber],
          permitIssueDate: [new Date(row.permitIssueDate)],
          socialSecurityNumber: [row.socialSecurityNumber],
          stateOfOrigin: [row.stateOfOrigin],
          nationality: [row.nationality],
          phoneNumber: [row.phoneNumber],
          city: [row.city],
          stateId: [row.stateId],
          relationshipOfficerId: [row.relationshipOfficerId],
          residentAddress1: [row.residentAddress1],
          residentAddress2: [row.residentAddress2],
          residentCountryId: [row.residentCountryId],
          residentOfCountry: [row.residentOfCountry],
          email: [
            row.email,
            Validators.compose([Validators.required, ValidationService.isEmail])
          ],
          mailingAddress: [row.mailingAddress],
          mobileNumber: [
            row.mobileNumber,
            [
              Validators.required,
              Validators.pattern(/^0|[0-9]\d*$/),
              Validators.minLength(9)
            ]
          ],

          regAddifDifffromopAdd: [row.regAddifDifffromopAdd],
          internetBanking: [row.internetBanking],
          emailStatement: [row.emailStatement],
          card: [row.card],
          smsAlert: [row.smsAlert],
          emailAlert: [row.emailAlert],
          token: [row.token],

          residentialState: [row.residentialState],
          residentialCity: [row.residentialCity],
          residentialLGA: [row.residentialLGA],


          certOfIncorporationNumber: [row.certOfIncorporationNumber],
          dateOfIncorporation: [new Date(row.dateOfIncorporation)],
          jurisdictionOfincorporatoin: [row.jurisdictionOfincorporatoin],
          natureOfBusiness: [row.natureOfBusiness],
          sectorOrIndustry: [row.sectorOrIndustry],
          operatingAdress1: [row.operatingAdress1],
          operatingAdress2: [row.operatingAdress2],
          localGovernment: [row.localGovernment],
          website: [row.website],
          scuml: [row.scuml],
          companyName: [row.companyName],
          permitExpiryDate: [new Date(row.permitExpiryDate)],
          estimatedAnnualRevenue: [row.estimatedAnnualRevenue],
          isYourCompanyQuotedOnTheStockExchange: [row.isYourCompanyQuotedOnTheStockExchange],
          stockExchange: [row.stockExchange],


          //Employment details
          employmentType: [row.employmentType],
          businessName: [row.businessName],
          businessAddress: [row.businessAddress],
          businessState: [row.businessState],
          jobTitle: [row.jobTitle],
          other: [row.othe],
          otherComment: [row.otherComment],

        });

        if (dir != undefined) {
          this.directorForm = this.fb.group({
            directorsId: [dir.directorsId],
            directorTypeId: [dir.directorTypeId, Validators.required],
            directorType: [dir.directorType],
            customerId: [dir.customerId],
            position: [dir.position, Validators.required],
            name: [dir.name, Validators.required],
            address: [dir.address, Validators.required],
            politicallyPosition: [dir.politicallyPosition, Validators.required],
            relativePoliticallyPosition: ["", Validators.required],
            dob: [dir.dob],
            phoneNo: [
              dir.phoneNo,
              [
                Validators.required,
                Validators.pattern(/^0|[0-9]\d*$/),
                Validators.minLength(9)
              ]
            ],
            email: [
              dir.email,
              Validators.compose([Validators.required, ValidationService.isEmail])
            ],
            signature: [dir.signature],
            percentageShare: [dir.percentageShare]
          });

        }

        if (nxt != undefined) {

          this.nextOfKinForm = this.fb.group({
            nextOfKinId: [nxt.nextOfKinId],
            customerId: [nxt.customerId],
            nextOfKinTitle: [nxt.nextOfKinTitle],//
            nextOfKinSurname: [nxt.nextOfKinSurname, Validators.required],//
            nextOfKinFirstName: [nxt.nextOfKinFirstName, Validators.required],//
            nextOfKinOtherNames: [nxt.nextOfKinOtherNames],//
            dnextOfKinDateOfBirthob: [nxt.dnextOfKinDateOfBirthob],//
            nextOfKinGender: [nxt.nextOfKinGender],//
            nextOfKinAddress: [nxt.nextOfKinAddress, Validators.required],//
            nextOfKinCity: [nxt.nextOfKinCity],//
            nextOfKinState: [nxt.nextOfKinState],//
            nextOfKinRelationship: [nxt.nextOfKinRelationship, Validators.required],//
            nextOfKinMobileNumber: [
              nxt.nextOfKinMobileNumber,
              [
                Validators.required,
                Validators.pattern(/^0|[0-9]\d*$/),
                Validators.minLength(9)
              ]
            ],//
            nextOfKinEmailAddress: [
              nxt.nextOfKinEmailAddress,
              Validators.compose([Validators.required, ValidationService.isEmail])
            ],//

            //Employment details

            employmentType: [nxt.employmentType],
            businessName: [nxt.businessName],
            businessAddress: [nxt.businessAddress],
            businessState: [nxt.businessState],
            jobTitle: [nxt.jobTitle],
            other: [nxt.other],
            otherComment: [nxt.otherComment]

          });

        }


        if (kyc != undefined) {
          this.kycForm = this.fb.group({
            kycId: [kyc.kycId],
            customerId: [kyc.customerId],
            financiallydisadvantaged: [kyc.sociallyOrFinanciallyDisadvantaged],
            otherDocumentsObtained: [kyc.otherDocumentsObtained],
            doesTheCustomerEnjoyTieredKYC: [kyc.doesTheCustomerEnjoyTieredKYC],
            riskCategory: [kyc.riskCategory],
            isCustomerPoliticalyExposed: [kyc.isCustomerPoliticalyExposed],
            politicalyExposedDetails: [kyc.politicalyExposedDetails],
            addressVisited: [kyc.addressVisited],
            commentOnLocation: [kyc.commentOnLocation],
            location_ColorOfbuilding: [kyc.location_ColorOfbuilding],
            location_DescriptionOfBuilding: [kyc.location_DescriptionOfBuilding],
            fullNameOfVisitingStaff: [kyc.fullNameOfVisitingStaff],
            dateOfVisitation: [new Date(kyc.dateOfVisitation)],
            isUtilityBillSubmitted: [kyc.isUtilityBillSubmitted],
            dulyCompletedAccountOpenningForm: [kyc.dulyCompletedAccountOpenningForm],
            recentPassportPhotograph: [kyc.recentPassportPhotograph],
            confirmaiotnname: [kyc.confirmaiotnname],
            confirmationDate: [new Date(kyc.confirmationDate)],
            deferralFullName: [kyc.deferralFullName],
            deferralDate: [new Date(kyc.deferralDate)],
            confirmed: [kyc.confirmed ? "1" : "0"],
          });
        }

        if (actInfor != undefined) {
          this.accountinformation = this.fb.group({
            accountdetailId: [actInfor.accountdetailId],
            internetBanking: [actInfor.internetBanking],
            emailStatement: [actInfor.emailStatement],
            card: [actInfor.card],
            smsAlert: [actInfor.smsAlert],
            emailAlert: [actInfor.emailAlert],
            token: [actInfor.token],
            //
            accountCategoryId: [actInfor.accountCategoryId],
            accountTypeId: [actInfor.accountTypeId],
            currencies: [actInfor.CurrencyArray],
            isYourCompanyQuotedOnTheStockExchange: [actInfor.isYourCompanyQuotedOnTheStockExchange]
          });
        }

        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getStaffList() {
    this.loadingService.show();
    this.userAccountService.getStaffList().subscribe(data => {
      this.loadingService.hide();
      this.staffList = data.staff;
    });
  }

  goBack() {
    this.router.navigate(["/deposit/accountopening-list"]);
  }

  submitCustomerInfo(formObj) {
    this.loadingService.show();
    var payload = formObj.value;
    payload.accountTypeId = parseInt(payload.accountTypeId);
    payload.countryId = parseInt(payload.countryId);
    payload.currencyId = parseInt(payload.currencyId);
    payload.customerId = parseInt(payload.customerId);
    payload.customerTypeId = this.cutomerType;
    payload.genderId = parseInt(payload.genderId);
    payload.maritalStatusId = parseInt(payload.maritalStatusId);
    payload.stateId = parseInt(payload.stateId);
    payload.title = parseInt(payload.title);
    payload.relationshipOfficerId = parseInt(payload.relationshipOfficerId);
    payload.birthCountryId = parseInt(payload.birthCountryId);
    payload.nationality = parseInt(payload.nationality);
    payload.stateOfOrigin = parseInt(payload.stateOfOrigin);
    payload.soleSignatory = parseInt(payload.soleSignatory);
    payload.maxNoOfSignatory = parseInt(payload.maxNoOfSignatory);
    payload.residentCountryId = parseInt(payload.residentCountryId);
    payload.employmentType = parseInt(payload.employmentType);
    payload.residentialState = parseInt(payload.residentialState);
    payload.residentialCity = parseInt(payload.residentialCity);
    payload.mobileNumber = "" + payload.mobileNumber + "";
    payload.customerTypeId = this.cutomerType;
    if (this.cutomerType == 2) {
      payload.localGovernment = payload.localGovernment
    }

    this.CustomerService.addUpdateCustomer(payload).subscribe(
      data => {
        var message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.customerId = data.customerId;
          this.editCustomer(this.customerId);
          this.otherTabDisabled = false;
          this.openAllTabs();
          // swal.fire("GOS FINANCIAL", data["message"], "success");
          this.activeIndex = 1;
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
        var message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }

  submitCustomerDetails(formObj) {
    this.loadingService.show();
    this.CustomerService.addUpdateCustomer(formObj.value).subscribe(
      data => {
        this.loadingService.hide();
        if (data.status.isSuccessful == true) {
          this.customerId = data.responseId;
          this.editCustomer(this.customerId);
          swal.fire(
            "GOS FINANCIAL",
            data.status.message.friendlyMessage,
            "success"
          );
        } else {
          swal.fire(
            "GOS FINANCIAL",
            data.status.message.friendlyMessage,
            "error"
          );
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
      }
    );
  }

  getCurrencyList() {
    this.loadingService.show();
    return this.commonService.getAllCurrency().subscribe(
      data => {
        this.loadingService.hide();
        this.currencyArray = [];
        this.currency = data.commonLookups;
        if (this.currency != null) {
          this.currency.forEach(el => {
            this.currencyArray.push({ itemName: el.lookupName, id: +el.lookupId });
          });
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  onSavedButtonPressed() {
    swal.fire(
      "GOS FINANCIAL",
      "Record Saved Successfully and it being sent for approval",
      "success"
    ).then(() => {
      this.router.navigate(["/deposit/accountopening-list"]);
    });
  }

  onTabChange(e) {
    this.activeIndex = e.index;
    // Individual Customer
    if (
      this.activeIndex === 1 &&
      this.selectedCustomerInformation.customerTypeId != 1
    ) {
      if (this.CustomerDirector.length > 0) {
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
    this.activeIndex = this.activeIndex === 5 ? 0 : this.activeIndex + 1;

  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 5 : this.activeIndex - 1;

  }

  showAddNewIdentityDetails() {
    this.displayIdentityDetails = true;
    this.identityDetailsForm = this.fb.group({
      identificationId: [0],
      customerId: [0],
      identification: [0],
      identificationNumber: [""],
      dateIssued: [new Date()],
      expiryDate: [new Date(),],



      // employmentType: [""],
      // businessName: [""],
      // businessAddress: [""],
      // businessState: [""],
      // jobTitle: [""],
      // other: [""],
      // otherComment: [""],

      //next of kin
      // nextOfKinTitle: [""],
      // nextOfKinSurname: [""],
      // nextOfKinFirstName: [""],
      // nextOfKinOtherNames: [""],
      // nextOfKinDateOfBirth: [""],
      // nextOfKinGender: [""],
      // nextOfKinRelationship: [""],
      // nextOfKinMobileNumber: [""],
      // nextOfKinEmailAddress: [""],
      // nextOfKinAddress: [""],
      // nextOfKinCity: [""],
      // nextOfKinState: [""],
    });
  }

  deleteIdentityDetails(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete user?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.CustomerService.deleteCustomerIdentityDetails(
            row.customerIdentityId
          ).subscribe(data => {
            __this.loadingService.hide();
            if (data["result"] == true) {
              swal.fire("GOS FINANCIAL", "User deleted successful.", "success");
              __this.getCustomerIdentityDetailsByCustomer(this.customerId);
            } else {
              swal.fire("GOS FINANCIAL", "Record not deleted", "error");
            }
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  showAddNewNextOfKins() {
    this.displayNextOfKins = true;
    this.nextOfKinForm = this.fb.group({
      nextOfKinId: 0,
      customerId: this.customerId,
      title: [""],
      surname: ["", Validators.required],
      firstName: ["", Validators.required],
      otherName: [""],
      dob: [""],
      genderId: [0],
      address: ["", Validators.required],
      city: [""],
      state: [""],
      relationship: ["", Validators.required],
      mobileNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^0|[0-9]\d*$/),
          Validators.minLength(9)
        ]
      ],
      email: [
        "",
        Validators.compose([Validators.required, ValidationService.isEmail])
      ]
    });
  }

  editNextOfKins(row) {
    this.nextOfKinForm = this.fb.group({
      nextOfKinId: row.nextOfKinId,
      customerId: row.customerId,
      title: row.title,
      surname: row.surname,
      firstName: row.firstName,
      otherName: row.otherName,
      dob: new Date(row.dob),
      genderId: row.genderId,
      relationship: row.relationship,
      address: row.address,
      city: row.city,
      mobileNumber: row.mobileNumber,
      email: row.email,
      state: row.state
    });
    this.displayNextOfKins = true;
  }



  //Contact Persons
  showAddNewContactPersons() {
    this.displayContactPersons = true;
  }

  editContactPersons(row) {
    this.ContactPersonForm = this.fb.group({
      keyContactPersonId: row.keyContactPersonId,
      customerId: [this.customerId],
      fullName: [row.fullName, Validators.required],
      jobTitle: [row.jobTitle, Validators.required],
      email: [row.email, Validators.required],
      phoneNumber: [row.phoneNumber, Validators.required],
      officeAddress: [row.officeAddress, Validators.required],
      genderId: [row.genderId, Validators.required],
      address: [row.address, Validators.required],
    });
    this.displayContactPersons = true;
  }

  deleteCustomerKeyContactDetails(row) {
    var payload = {
      keyContactPersonId: row.keyContactPersonId
    }
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete user?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.CustomerService.deleteCustomerContactPersons(
            payload
          ).subscribe(data => {
            var message = data.status.friendlyMessage;
            if (data.deleted) {
              swal.fire("GOS FINANCIAL", message, "success");
              __this.getCustomerIdentityDetailsByCustomer(this.customerId);
              __this.loadingService.hide();
            } else {
              __this.loadingService.hide();
              swal.fire("GOS FINANCIAL", message, "error");
            }
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  submitCustomerContactPersons(formObj) {
    let body = formObj.value;
    this.loadingService.show();
    body.customerId = parseInt(this.customerId);

    this.CustomerService.addCustomerContactPerson(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getCustomerContactPersonsByCustomer(this.customerId);
          this.displayContactPersons = false;
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

  //Directors
  showAddNewDirectors() {
    this.displayDirectorsForm = true;
  }

  submitDirectors(formObj) {
    let body = formObj.value;
    body.customerId = parseInt(this.customerId);
    this.loadingService.show();
    this.CustomerService.addCustomerDirector(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getDirectorsByCustomer(this.customerId);
          this.displayDirectorsForm = false;

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


  editDirector(row) {
    this.directorForm = this.fb.group({
      customerId: [row.customerId],
      directorsId: [row.directorsId],
      firstName: [row.firstName],
      surname: [row.surname],
      otherNames: [row.otherNames],
      gender: [row.gender],
      maritalStatus: [row.maritalStatus],
      dob: [row.dob],
      pob: [row.pob],
      motherMaidienName: [row.motherMaidienName],
      nameOfNextOfKin: [row.nameOfNextOfKin],
      lga: [row.lga],
      state: [row.state],
      taxIdentitfication: [row.taxIdentitfication],
      meansOfIdentification: [row.meansOfIdentification],
      identificationNumber: [row.identificationNumber],
      idIssuedate: [row.idIssuedate],
      occupation: [row.occupation],
      jobTitle: [row.jobTitle],
      position: [row.position],
      nationality: [row.nationality],
      residentPermitNumber: [row.residentPermitNumber],
      permitIssueDate: [row.permitIssueDate],
      permitExpiryDate: [row.permitExpiryDate],
      socialSecurityNumber: [row.socialSecurityNumber],
      residentialLGA: [row.residentialLGA],
      residentialCity: [row.residentialCity],
      residentialState: [row.residentialState],
      mailingAddressSameWithResidentialAddress: [row.mailingAddressSameWithResidentialAddress],
      mailingLGA: [row.mailingLGA],
      mailingCity: [row.mailingCity],
      mailingState: [row.mailingState],
      mobileNumber: [row.mobileNumber],
      phoneNumber: [row.phoneNumber],
      emailAddress: [row.emailAddress],
      signatureName: [row.signatureName],
      signatureFile: [row.signatureFile]
    });
    this.displayDirectorsForm = true
    // this.router.navigate(["/deposit/accountopening-directors"], {
    //   queryParams: {
    //     param1: row.directorId,
    //     param2: this.customerId
    //   }
    // });
  }

  viewDirectorSignature(id: number) {
    this.loadingService.show();
    this.CustomerService.getDirector(id).subscribe(data => {
      this.loadingService.hide();
      let doc = data["result"];
      if (doc != undefined) {
        this.binaryFile = doc.signatureUpload;
        this.selectedDocument = doc.firstname + " " + doc.surname;
        this.displaySignature = true;
      }
    });
  }

  deleteDirector(row) {
    const __this = this;
    let ids = [];
    ids.push(row.directorsId);
    const payload = {
      itemIds: ids
    }
    swal
      .fire({
        title: "Are you sure you want to delete item?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.CustomerService.deleteCustomerDirector(
            payload
          ).subscribe(data => {
            __this.loadingService.hide();
            const message = data.status.message.friendlyMessage;
            if (data.status.isSuccessful) {
              swal.fire(
                "GOS FINANCIAL",
                message,
                "success"
              );
              __this.getDirectorsByCustomer(this.customerId);
            } else {
              swal.fire("GOS FINANCIAL", message, "error");
            }
          }, err => {
            this.loadingService.hide();
            const message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }


  //Signatory
  Signaturefiles: FileList;
  signatureFile: File;
  @ViewChild("SignaturefileInput") SignaturefileInput: any;

  onSignatoryImgFileChange(event) {
    this.signatureFile = event.target.files[0];
    // this.signatureFile = this.Signaturefiles[0];
  }

  SignatoryImgUpload() {
    if (this.signatureFile != undefined) {
      let body = {
        customerId: this.customerId,
        signatoryId: this.signatoryId,
        fileName: this.signatureFile.name,
        fileExtension: this.fileExtention(this.signatureFile.name)
      };
      this.loadingService.show();
      this.CustomerService.uploadSignatorySignature(
        this.signatureFile,
        body
      ).then(
        (val: any) => {
          this.SignaturefileInput.nativeElement.value = "";
          this.getSignatoryByCustomer(this.customerId);
          this.loadingService.hide();

          this.displaySigatory = false;
        },
        error => {
          this.loadingService.hide(1000);
          this.SignaturefileInput.nativeElement.value = "";
          this.displaySigatory = false;
          this.getSignatoryByCustomer(this.customerId);
          swal.fire("GOS FINANCIAL", "Image Successfully Uploaded", "success");
        }
      );
    } else {
      swal.fire("GOS FINANCIAL", "Select a document to Upload", "error");
    }
  }
  viewSignature(id: number) {
    this.loadingService.show();
    this.CustomerService.getSignature(id).subscribe(data => {
      this.loadingService.hide();
      let doc = data;
      if (doc != undefined) {
        this.binaryFile = doc.file;
        this.selectedDocument = doc.fileName;
        this.displaySignature = true;
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('GOS FINANCIAL', message, 'error')
    });
  }

  showAddCorporateSigatory() {
    this.router.navigate(["/deposit/accountopening-signatories"], {
      queryParams: {
        param1: this.signatoryId,
        param2: this.customerId
      }
    });
  }
  EditCorporateSigatory(row) {
    this.router.navigate(["/deposit/accountopening-signatories"], {
      queryParams: {
        param1: row.signatoryId,
        param2: this.customerId
      }
    });
  }

  showAddNewSigatory() {
    this.signatoryForm = this.fb.group({
      signatoryId: 0,
      customerId: this.customerId,
      title: [0],
      surname: ["", Validators.required],
      firstname: ["", Validators.required],
      othername: [""],
      classofSignatory: [0],
      identificationType: [0],
      identificationNumber: [""],
      telephone: [""],
      signatureUpload: [""],
      //date: [new Date()]
    });
    this.displaySigatory = true;
  }

  editSigatory(row) {
    this.signatoryId = row.signatoryId;
    this.signatoryForm = this.fb.group({
      signatoryId: row.signatoryId,
      customerId: row.customerId,
      title: row.title,
      surname: row.surname,
      firstname: row.firstname,
      othername: row.othername,
      classofSignatory: row.classofSignatory,
      identificationType: row.identificationType,
      identificationNumber: row.identificationNumber,
      telephone: row.telephone,
      signatureUpload: row.signatureUpload,
      //date: new Date(row.date),
      signatureType: [1]
    });
    this.displaySigatory = true;
  }
  deleteSignatory(row) {
    // let id = [];

    let body = {
      signatoriesId: row.signatoriesId
    };
    // id.push(id);
    // let payload = {
    //   req: id
    // };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.CustomerService.deleteCustomerSignatory(body).subscribe(
            data => {
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getSignatoryByCustomer(this.customerId);
              } else {
                swal.fire("GOS FINANCIAL", message, "error");
              }
              __this.loadingService.hide();
            },
            err => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, "error");
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, "error");
              }
            }
          );
        } else {
          swal.fire("Info", "Cancelled", "error");
        }
      });
  }



  showAddNewBankDetails() {
    this.displayBankDetails = true;
  }
  showAddNewKYC() {
    this.displayKYC = true;
  }
  editKYCDetails(customerId) {
    this.loadingService.show();
    this.CustomerService.getKYC(customerId).subscribe(data => {
      let row = data.kyCustomers[0];
      this.KYCDetails = row;
      if (row != undefined) {
        this.otherTabDisabled = false;
      }
      this.kycForm = this.fb.group({
        kycId: row.kycId,
        customerId: row.customerId,
        sociallyOrFinanciallyDisadvantaged: [row.sociallyOrFinanciallyDisadvantaged],
        bankpolicydocuments: row.bankpolicydocuments,
        tieredKycrequirement: row.tieredKycrequirement,
        riskCategoryId: row.riskCategoryId,
        politicallyExposedPerson: row.politicallyExposedPerson,
        details: row.details,
        addressVisited: row.addressVisited,
        commentOnLocation: row.commentOnLocation,
        locationColor: row.locationColor,
        locationDescription: row.locationDescription,
        nameOfVisitingStaff: row.nameOfVisitingStaff,
        dateOfVisitation: new Date(row.dateOfVisitation),
        utilityBillSubmitted: row.utilityBillSubmitted,
        accountOpeningCompleted: row.accountOpeningCompleted,
        recentPassportPhoto: row.recentPassportPhoto,
        confirmationName: row.confirmationName,
        confirmationDate: new Date(row.confirmationDate),
        documentUploadId: row.documentUploadId,
        deferralFullName: row.deferralFullName,
        deferralDate: new Date(row.deferralDate),
        deferralApproved: row.deferralApproved
      });
      this.displayIndividualCustomer = true;
    });
  }

  // file upload
  showAddNewDocument() {
    this.displayDocumentUpload = true;
  }
  documentName: string = null;
  physicalLocation: string = null;
  documentTypeId: number = null;
  files: FileList;
  file: File;
  @ViewChild("fileInput") fileInput: any;
  isUtilityBillSubmitted: boolean;

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
        documentTypeId: this.documentTypeId
      };
      this.loadingService.show();
      this.CustomerService.uploadFile(this.file, body).then(
        (val: any) => {
          this.documentName = null;
          this.documentTypeId = null;
          this.fileInput.nativeElement.value = "";
          this.loadingService.hide();
          this.getCustoemrDocumentUpload(this.customerId);
          swal.fire(
            "GOS FINANCIAL",
            "Document Uploaded Successfully",
            "success"
          );
          this.loadingService.hide();
          this.displayDocumentUpload = false;
        },
        error => {
          this.documentName = null;
          this.documentTypeId = null;
          this.fileInput.nativeElement.value = "";
          this.loadingService.hide();
          this.getCustoemrDocumentUpload(this.customerId);
          swal.fire(
            "GOS FINANCIAL",
            "Document Uploaded Successfully",
            "success"
          );
          this.loadingService.hide();
          this.displayDocumentUpload = false;
        }
      );
    }
  }
  getCustoemrDocumentUpload(customerId) {
    this.CustomerService.getCustomerDocumentByCustomer(customerId).subscribe(
      data => {
        this.CustomerDocuments = data["result"];
      }
    );
  }
  deleteCustoemrDocument(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete document?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.CustomerService.deleteCustomerDocument(
            row.documentId
          ).subscribe(data => {
            __this.loadingService.hide();
            if (data["result"] == true) {
              swal.fire(
                "GOS FINANCIAL",
                "Record deleted successful.",
                "success"
              );
              __this.getCustoemrDocumentUpload(this.customerId);
            } else {
              swal.fire("GOS FINANCIAL", "Record not deleted", "error");
            }
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  viewDocument(id: number) {
    this.loadingService.show();
    this.CustomerService.getCustomerDocument(id).subscribe(data => {
      this.loadingService.hide();
      let doc = data["result"];
      if (doc != undefined) {
        this.binaryFile = doc.documentUpload;
        this.selectedDocument = doc.documentName;
        this.displayDocument = true;
      }
    });
  }
  DownloadDocument(id: number) {
    this.loadingService.show();
    this.CustomerService.getCustomerDocument(id).subscribe(data => {
      this.loadingService.hide();
      let fileDocument = data["result"];
      if (fileDocument != undefined) {
        this.binaryFile = fileDocument.documentUpload;
        this.selectedDocument = fileDocument.documentName;
        let myDocExtention = fileDocument.fileExtension;
        var byteString = atob(this.binaryFile);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);

        if (myDocExtention == ".jpg" || myDocExtention == ".jpeg") {
          try {
            var file = new File([bb], this.selectedDocument + ".jpg", {
              type: "image/jpg"
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: "image/jpg"
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + ".jpg"
            );
          }
        }
        if (myDocExtention == ".png" || myDocExtention == ".png") {
          try {
            var file = new File([bb], this.selectedDocument + ".png", {
              type: "image/png"
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: "image/png"
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + ".png"
            );
          }
        }
        if (myDocExtention == ".pdf" || myDocExtention == ".pdf") {
          try {
            var file = new File([bb], this.selectedDocument + ".pdf", {
              type: "application/pdf"
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: "application/pdf"
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + ".pdf"
            );
          }
        }
        if (myDocExtention == ".xls" || myDocExtention == ".xlsx") {
          try {
            var file = new File([bb], this.selectedDocument + ".xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + ".xlsx"
            );
          }
        }
        if (myDocExtention == ".doc" || myDocExtention == ".docx") {
          try {
            var file = new File([bb], this.selectedDocument + ".doc", {
              type: "application/msword"
            });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], {
              type: "application/msword"
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + ".doc"
            );
          }
        }
      }
    });
  }

  getState(id: any) {
    this.loadingService.show();
    return this.commonService.getStateByCountry(id).subscribe(
      data => {
        this.loadingService.hide();
        this.stateList = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getResidentialState(id: any) {
    this.loadingService.show();
    return this.commonService.getStateByCountry(id).subscribe(
      data => {
        this.loadingService.hide();
        this.stateList = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }


  getResidentialCity(id: any) {
    this.loadingService.show();
    return this.commonService.getCityByStateId(id).subscribe(
      data => {
        this.loadingService.hide();
        this.cityList = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  async onItemSelect(item: any) {

    await this.selectedItems.push(item)
  }
  async OnItemDeSelect(item: any) {


  }
  onSelectAll(items: any) {

  }
  onDeSelectAll(items: any) {

  }
}
