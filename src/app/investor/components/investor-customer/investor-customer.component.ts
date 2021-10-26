import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "../../../core/services/loading.service";
import { CommonService } from "../../../core/services/common.service";
import { LoanCustomerService } from "../../../core/services/loancustomer.service";
import { IdentificationService } from "../../../core/services/identification.service";
import { DepositAccountOpeningService } from "../../../core/services/depositaccountopening.service";
import { UserAccountService } from "../../../core/services/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ValidationService } from "../../../core/services/validation.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import {Location} from '@angular/common';

@Component({
    selector: "app-investor-customer",
    templateUrl: "./investor-customer.component.html",
    styleUrls: ["./investor-customer.component.css"]
})
export class InvestorCustomerComponent implements OnInit {
  documentName: string = null;
  physicalLocation: string = null;
  documentTypeId: number = null;
  files: FileList;
  file: File;
  @ViewChild("fileInput") fileInput: any;
  signature: string;
  form: FormGroup;
  directorForm: FormGroup;
  identityDetailsForm: FormGroup;
  nextOfKinForm: FormGroup;
  bankDetailsForm: FormGroup;
  directorShareHolderForm: FormGroup;
  formTitle: string = "Create New Customer";
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
  customerDirectorId: number = 0;
  name: string = "Name";
  nameDate: string = "Date";
  displayCorperatCustomer: boolean = false;
  displayIndividualCustomer: boolean = false;
  selectPoliticallyPosition: boolean;
  selectPoliticallyExposed: boolean;
  selectRelativePoliticallyPosition: boolean;
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
  depositCustomerId: any;
  staffList: any[];
  selectedDate: any;
  date: any;
  displayOutput: boolean;
  percentageShare: number = 0;
  profileStatus: number;
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
      titleId: [""],
      firstName: ["", Validators.required],
      lastName: [""],
      middleName: [""],
      genderId: [""],
      dob: [null, Validators.required],
      address: ["", Validators.required],
      postalAddress: [""],
      city: [""],
      occupation: [""],
      employmentType: [""],
      politicallyExposed: [false],
      companyName: [""],
      companyWebsite: [""],
      registrationNo: [""],
      countryId: [1],
      industry: [""],
      incorporationCountry: [""],
      annualTurnover: [""],
      maritalStatusId: [""],
      relationshipOfficerId: [0],
      shareholderFund: [""],
      phoneNo: [
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
      ],
      accountNumber: ['']
    });
    this.directorForm = this.fb.group({
      customerDirectorId: [0],
      directorTypeId: [0, Validators.required],
      directorType: [""],
      customerId: 0,
      position: ["", Validators.required],
      name: ["", Validators.required],
      address: ["", Validators.required],
      politicallyPosition: ["", Validators.required],
      relativePoliticallyPosition: ["", Validators.required],
      // dob: [new Date()],
      phoneNo: [
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
      ],
      signature: [""],
      percentageShare: [0]
    });
    this.identityDetailsForm = this.fb.group({
      customerIdentityDetailsId: 0,
      customerId: 0,
      number: ["", Validators.required],
      identificationId: ["", Validators.required],
      issuer: ["", Validators.required]
    });
    this.nextOfKinForm = this.fb.group({
      customerNextOfKinId: [0],
      customerId: 0,
      name: ["", Validators.required],
      address: ["", Validators.required],
      relationship: ["", Validators.required],
      phoneNo: [
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
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.customerId = params["id"];
      // this.depositCustomerId = params["editloanCustomerFromDeposit"];
      if (this.customerId != null || this.customerId != undefined) {
        this.editLoanCustomer(this.customerId);
        this.getLoanCustomerDirectorByLoanCustomer(this.customerId);
        this.getLoanCustomerIdentityDetailsByLoanCustomer(this.customerId);
        this.getLoanCustomerNextOfKinByLoanCustomer(this.customerId);
        this.getLoanCustomerBankDetailsByLoanCustomer(this.customerId);
        this.getLoanCustomerDirectorShareHolderByLoanCustomer(this.customerId);
        this.getLoanCustoemrDocumentUpload(this.customerId);
        this.getStaffList();
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
    this.loadDropDown();
    this.getAllIdentification();
    this.onCustomerTypeChange(1);
    this.getStaffList();
  }
  loadDropDown() {
    this.commonService.getAllGender().subscribe(data => {
      this.genderList = data["commonLookups"];
    });
    this.commonService.getAllMaritalStatus().subscribe(data => {
      this.martialStatusList = data["commonLookups"];
    });
    this.commonService.getAllTitle().subscribe(data => {
      this.titleList = data["commonLookups"];
    });
    this.commonService.getAllEmployerType().subscribe(data => {
      this.employerTypeList = data["commonLookups"];
    });
    this.commonService.getAllCity().subscribe(data => {
      this.cityList = data["commonLookups"];
    });
    this.commonService.getAllCountry().subscribe(data => {
      this.countryInformation = data.commonLookups;
    });
    this.commonService.getAllDirectorType().subscribe(data => {
      this.directorTypeList = data["commonLookups"];
    });
    this.commonService.getAllDocumentType().subscribe(data => {
      this.documentTypeList = data["commonLookups"];
    });
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
      data => {
        this.loadingService.hide();
        this.staffList = data.staff;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getLoanCustomerDirectorByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerDirectorByLoanCustomer(customerId)
      .subscribe(
        data => {
          this.loanCustomerDirectors = data.customerDirectors;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }

  onCustomerTypeChange(customerTypeId) {
    if (customerTypeId == 1) {
      this.name = "FirstName";
      this.nameDate = "Date of Birth";
      this.displayCorperatCustomer = false;
      this.displayIndividualCustomer = true;
    } else {
      this.name = "CompanyName";
      this.nameDate = "Date of Incorporation";
      this.displayCorperatCustomer = true;
      this.displayIndividualCustomer = false;
    }
  }

  getAllIdentification() {
    this.identificationService.getAllIdentification().subscribe(data => {
      this.identificationInformation = data.commonLookups;
    });
  }
  getLoanCustomerIdentityDetailsByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerIdentityDetailsByLoanCustomer(customerId)
      .subscribe(data => {
        this.loanCustomerIdentityDetails = data.customerIdentity;
      });
  }
  getLoanCustomerNextOfKinByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerNextOfKinByLoanCustomer(customerId)
      .subscribe(data => {
        this.loanCustomerNextOfKins = data.customerNextOfKin;
      });
  }
  getLoanCustomerBankDetailsByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerBankDetailsByLoanCustomer(customerId)
      .subscribe(data => {
        this.loanCustomerBankDetails = data.customerBankDetails;
      });
  }

  getLoanCustomerDirectorShareHolderByLoanCustomer(customerId) {
    this.loanCustomerService
      .getLoanCustomerDirectorShareHolderByLoanCustomer(customerId)
      .subscribe(data => {
        this.loanCustomerDirectorShareHolder = data.directorShareHolder;
      });
  }

  editLoanCustomer(customerId) {
    this.formTitle = "Edit Customer Information";
    this.loadingService.show();
    this.loanCustomerService.getLoanCustomer(customerId).subscribe(
      data => {
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
          accountNumber: row.casaAccountNumber
        });
        this.onCustomerTypeChange(row.customerTypeId);
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  editDepositCustomer(customerId) {
    this.formTitle = "Add Loan Customer Information";
    this.loadingService.show();
    this.CustomerService.getCustomer(customerId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data["result"];
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
          dob: new Date(row.dob),
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
          relationshipOfficerId: row.relationshipOfficerId
        });
        this.onCustomerTypeChange(row.customerTypeId);
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this._location.back()
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
        this.profileStatus = 20
      }
      if (params.shareholderFund) {
        this.profileStatus = 20
      }
      if (params.dob) {
        this.profileStatus = 20
      }
      if (params.address) {
        this.profileStatus = 20
      }
      if (params.industry) {
        this.profileStatus = 20
      }
      if (params.annualTurnover && params.shareholderFund) {
        this.profileStatus = 40
      }
      if (params.annualTurnover && params.dob) {
        this.profileStatus = 40
      }
      if (params.annualTurnover && params.address) {
        this.profileStatus = 40
      }
      if (params.annualTurnover && params.industry) {
        this.profileStatus = 40
      }
      if (params.shareholderFund && params.dob) {
        this.profileStatus = 40
      }
      if(params.shareholderFund && params.address) {
        this.profileStatus = 40
      }
      if (params.shareholderFund && params.industry) {
        this.profileStatus = 40
      }
      if (params.address && params.dob) {
        this.profileStatus = 40
      }
      if (params.address && params. industry) {
        this.profileStatus = 40
      }
      if (params.dob && params.industry) {
        this.profileStatus = 40
      }
      if (params.annualTurnover && params.shareholderFund && params.dob) {
        this.profileStatus = 60
      }
      if (params.annualTurnover && params.shareholderFund && params.address) {
        this.profileStatus = 60
      }
      if (params.annualTurnover && params.dob && params.address) {
        this.profileStatus = 60
      }
      if (params.annualTurnover && params.shareholderFund && params.industry) {
        this.profileStatus = 60
      }
      if (params.annualTurnover && params.dob && params.industry) {
        this.profileStatus = 60
      }
      if (params.annualTurnover && params.address && params.industry) {
        this.profileStatus = 60
      }
      if (params.shareholderFund && params.dob && params.industry) {
        this.profileStatus = 60
      }
      if (params.shareholderFund && params.address && params.industry) {
        this.profileStatus = 60
      }
      if (params.shareholderFund && params.dob && params.address) {
        this.profileStatus = 60
      }
      if (params.dob && params.address && params.industry) {
        this.profileStatus = 60
      }
      if (params.annualTurnover && params.shareholderFund && params.dob && params.address) {
        this.profileStatus = 80
      }
      if (params.annualTurnover && params.shareholderFund && params.dob && params.industry) {
        this.profileStatus = 80
      }
      if (params.annualTurnover && params.dob && params.address && params.industry) {
        this.profileStatus = 80
      }
      if (params.shareholderFund && params.dob && params.address && params.industry) {
        this.profileStatus = 80
      }
      if (params.annualTurnover && params.shareholderFund && params.address && params.dob && params.industry) {
        this.profileStatus = 100;
      }
    }
    return this.profileStatus;
  }
  submitLoanCustomerInfo(formObj) {
    let payload = formObj.value;
    this.getProfileStatus(payload.customerTypeId,{
      genderId: payload.genderId,
      address: payload.address,
      dob: payload.dob,
      employmentType: payload.employmentType,
      maritalStatusId: payload.maritalStatusId,
      annualTurnover: payload.annualTurnover,
      shareholderFund: payload.shareholderFund,
      industry: payload.industry
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
    payload.profileStatus = this.profileStatus;
    this.loadingService.show();
    this.loanCustomerService
      .addLoanCustomerInformation(payload)
      .subscribe(
        data => {
          this.loadingService.hide();
          if (data.status.isSuccessful) {
            this.customerId = data.customerId;
            this.editLoanCustomer(this.customerId);
            this.otherTabDisabled = false;
            this.openAllTabs();
            // swal.fire("GOS FINANCIAL", data["message"], "success");
            this.activeIndex = 1;
          } else {
            swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
          }
        },
        err => {
          this.loadingService.hide();
          swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
        }
      );
  }
  onSavedButtonPressed() {
    swal.fire(
      "GOS FINANCIAL",
      "Record Saved Successfully and it being sent for approval",
      "success"
    );
    this.router.navigate(["/credit/loancustomer-list"]);
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
    this.activeIndex = this.activeIndex === 5 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 5 : this.activeIndex - 1;
  }
  showAddNewDirectors() {
    this.displayDirectors = true;
    this.directorForm.reset();
  }
  onDateSelect(event) {
    let d = new Date(Date.parse(event));
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
        phoneNo: [
          row.phoneNo,
          [
            Validators.required,
            Validators.pattern(/^0|[0-9]\d*$/),
            Validators.minLength(9)
          ]
        ],
        email: [
          row.email,
          Validators.compose([Validators.required, ValidationService.isEmail])
        ],
        signature: [row.signature],
        // dob: new Date(row.dob),
        position: row.position,
        politicallyPosition: [row.politicallyPosition],
        relativePoliticallyPosition: [row.relativePoliticallyPosition],
        percentageShare: [row.percentageShare]
      }));
    this.selectPoliticallyPosition = row.politicallyPosition;
    this.selectRelativePoliticallyPosition = row.relativePoliticallyPosition;
    this.displayDirectors = true;
    this.selectedDate = new Date(row.dob);
    let d = new Date(Date.parse(this.selectedDate));
    this.date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  deleteDirectors(row) {
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

          __this.loanCustomerService
            .deleteLoanCustomerDirector(row.customerDirectorId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getLoanCustomerDirectorByLoanCustomer(this.customerId);
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  submitLoanCustomerDirectors(formObj) {
    // this.signature = this.file.name;
    let body = formObj.value;
    body.customerId = this.customerId;
    body.customerDirectorId = this.customerDirectorId;
    if (body.percentageShare == null) {
      body.percentageShare = this.percentageShare;
    }
    body.dob = this.date;
    if (!this.file) {
      return swal.fire("GOS FINANCIALS", "Select a file", "error");
    }
    if (
      this.file.type != "image/png" &&
      this.file.type !== "image/jpg" &&
      this.file.type != "image/jpeg" &&
      this.file.type != "image/gif"
    ) {
      return swal.fire(
        "GOS FINANCIALS",
        "Only images of type PNG, JPG, JPEG and GIF allowed"
      );
    }
    this.loadingService.show();
    this.loanCustomerService
      .addLoanCustomerDirector(this.file, body)
      .then(
        data => {
          this.loadingService.hide();
          const message = data.status.message.friendlyMessage;
          if (data.status.isSuccessful) {
            swal.fire("GOS FINANCIAL", message, "success");
            this.displayDirectors = false;
            this.fileInput.nativeElement.value = "";
            this.getLoanCustomerDirectorByLoanCustomer(this.customerId);
            this.directorForm.reset();
          } else {
            swal.fire("GOS FINANCIAL", message, "error");
          }
        }
        // err => {
        //     this.loadingService.hide();
        //     swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
        // }
      )
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  showAddNewIdentityDetails() {
    this.displayIdentityDetails = true;
    this.identityDetailsForm.reset()
  }
  editIdentityDetails(row) {
    this.identityDetailsForm = this.fb.group({
      customerIdentityDetailsId: row.customerIdentityDetailsId,
      customerId: row.customerId,
      identificationId: row.identificationId,
      number: row.number,
      issuer: row.issuer
    });
    this.displayIdentityDetails = true;
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

          __this.loanCustomerService
            .deleteLoanCustomerIdentityDetails(row.customerIdentityDetailsId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getLoanCustomerIdentityDetailsByLoanCustomer(
                  this.customerId
                );
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  submitLoanCustomerIdentityDetails(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    if(body.customerIdentityDetailsId == null){
      body.customerIdentityDetailsId = 0;
    }
    body.customerId = parseInt(this.customerId);
    body.identificationId = parseInt(body.identificationId);
    body.customerIdentityDetailsId = parseInt(body.customerIdentityDetailsId);
    this.loanCustomerService.addLoanCustomerIdentityDetails(body).subscribe(
      data => {
        this.loadingService.hide();
        if (data.status.isSuccessful == true) {
          swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "success");
          this.getLoanCustomerIdentityDetailsByLoanCustomer(this.customerId);
          this.displayIdentityDetails = false;
        } else {
          swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
      }
    );
  }

  showAddNewNextOfKins() {
    this.displayNextOfKins = true;
    this.nextOfKinForm.reset()
  }
  editNextOfKins(row) {
    this.nextOfKinForm = this.fb.group({
      customerNextOfKinId: row.customerNextOfKinId,
      customerId: row.customerId,
      name: row.name,
      address: row.address,
      relationship: row.relationship,
      phoneNo: row.phoneNo,
      email: row.email
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
        title: "Are you sure you want to delete user?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomerNextOfKin(row.customerNextOfKinId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getLoanCustomerNextOfKinByLoanCustomer(this.customerId);
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  submitLoanCustomerNextOfKins(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.customerId = parseInt(this.customerId);
    if(body.customerNextOfKinId == null) {
      body.customerNextOfKinId = 0;
    }
    body.customerNextOfKinId = parseInt(body.customerNextOfKinId);
    this.loanCustomerService.addLoanCustomerNextOfKin(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getLoanCustomerNextOfKinByLoanCustomer(this.customerId);
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

  showAddNewBankDetails() {
    this.displayBankDetails = true;
    this.bankDetailsForm.reset();
  }
  editBankDetails(row) {
    this.bankDetailsForm = this.fb.group({
      customerId: row.customerId,
      customerBankDetailsId: row.customerBankDetailsId,
      bvn: row.bvn,
      account: row.account,
      bank: row.bank
    });
    this.displayBankDetails = true;
  }
  deleteBankDetails(row) {
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

          __this.loanCustomerService
            .deleteLoanCustomerBankDetails(row.customerBankDetailsId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getLoanCustomerBankDetailsByLoanCustomer(
                  this.customerId
                );
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  submitLoanCustomerBankDetails(formObj) {
    let body = formObj.value;
    body.customerId = parseInt(this.customerId);
    if(body.customerBankDetailsId == null){
      body.customerBankDetailsId = 0;
    }
    body.customerBankDetailsId = parseInt(body.customerBankDetailsId)
    if (!body.bank) {
      return swal.fire("GOS FINANCIALS", "Bank name is required", "error");
    }
    if (!body.account) {
      return swal.fire("GOS FINANCIALS", "Account number is required", "error");
    }
    if (isNaN(body.account)) {
      return swal.fire(
        "GOS FINANCIALS",
        "Only numbers allowed for account number",
        "error"
      );
    }
    if (body.account.length < 10 || body.account.length > 10) {
      return swal.fire(
        "GOS FINANCIALS",
        "Account number must be 10 digits",
        "error"
      );
    }
    if (isNaN(body.bvn)) {
      return swal.fire(
        "GOS FINANCIALS",
        "Only numbers allowed for bvn",
        "error"
      );
    }
    if (body.bvn.length < 11 || body.bvn.length > 11) {
      return swal.fire("GOS FINANCIALS", "BVN must be 11 digits", "error");
    }
    this.loadingService.show();
    this.loanCustomerService.addLoanCustomerBankDetails(body).subscribe(
      data => {
        this.loadingService.hide();
        if (data.status.isSuccessful == true) {
          swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "success");
          this.getLoanCustomerBankDetailsByLoanCustomer(this.customerId);
          this.displayBankDetails = false;
          formObj.reset()
        } else {
          swal.fire("GOS FINANCIAL", data.status.message.friendlyMessage, "error");
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
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
      percentageHolder: row.percentageHolder
    });
    this.displayDirectorShareHolders = true;
  }
  deleteDirectorShareHolders(row) {
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

          __this.loanCustomerService
            .deleteLoanCustomerDirectorShareHolder(row.directorShareHolderId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getLoanCustomerDirectorShareHolderByLoanCustomer(
                  this.customerId
                );
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  submitLoanCustomerDirectorShareHolders(formObj) {
    let body = formObj.value;
    body.customerId = parseInt(this.customerId);
    body.percentageHolder = parseInt(body.percentageHolder);
    this.loadingService.show();
    this.loanCustomerService.addLoanCustomerDirectorShareHolder(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getLoanCustomerDirectorShareHolderByLoanCustomer(
            this.customerId
          );
          this.displayDirectorShareHolders = false;
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

  onDirectorTypeChange(value) {
    if (value == 1) {
      this.isDirectorOnly = true;
    } else {
      this.isDirectorOnly = false;
    }
  }

  // file upload
  showAddNewDocument() {
    this.displayDocumentUpload = true;

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
        customerId: parseInt(this.customerId),
        documentName: this.documentName,
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
        physicalLocation: this.physicalLocation,
        documentTypeId: this.documentTypeId
      };
      this.loadingService.show();
      this.loanCustomerService
        .uploadFile(this.file, body)
        .then((data: any) => {
          this.loadingService.hide();
          const message = data.status.message.friendlyMessage;
          if (data.status.isSuccessful) {
            this.documentName = null;
            this.documentTypeId = null;
            this.fileInput.nativeElement.value = "";
            this.getLoanCustoemrDocumentUpload(this.customerId);
            this.displayDocumentUpload = false;
            swal.fire(`GOS FINANCIAL`, message, "success");
          } else {
            swal.fire(`GOS FINANCIAL`, message, "error");
          }
        })
        .catch(err => {
          this.loadingService.hide(1000);
          const message = err.status.message.friendlyMessage;
          this.documentName = null;
          this.documentTypeId = null;
          this.fileInput.nativeElement.value = "";
          this.getLoanCustoemrDocumentUpload(this.customerId);
          this.displayDocumentUpload = false;
          swal.fire(`GOS FINANCIAL`, message, "error");
        });
    }
  }

  getLoanCustoemrDocumentUpload(customerId) {
    this.loanCustomerService
      .getLoanCustomerDocumentByLoanCustomer(customerId)
      .subscribe(data => {
        this.loanCustomerDocuments = data.customerDocuments;
      });
  }
  deleteLoanCustoemrDocument(row) {
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

          __this.loanCustomerService
            .deleteLoanCustomerDocument(row.customerDocumentId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getLoanCustoemrDocumentUpload(this.customerId);
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
    this.loanCustomerService.getLoanCustomerDocument(id).subscribe(data => {
      this.loadingService.hide();
      let doc = data.customerDocuments[0];
      if (doc != undefined) {
        this.binaryFile = doc.documentFile;
        this.selectedDocument = doc.documentName;
        this.displayOutput = true;
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

  viewSignature(customerDocumentId: any) {
    this.loadingService.show();
    this.loanCustomerService
      .viewSignature(customerDocumentId, this.customerId)
      .subscribe(
        data => {
          this.loadingService.hide();
          let doc = data.customerDirectors;
          if (doc != undefined) {
            this.binaryFile = doc.signature;
            this.selectedDocument = doc.documentTitle;
            this.displayOutput = true;
          }
        },
        err => {
          this.loadingService.hide();
        }
      );
  }
}
