import { SupplierService } from '../../../../core/services/supplier.service';
import swal from 'sweetalert2';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../core/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationService } from '../../../../core/services/validation.service';
import { CommonService } from '../../../../core/services/common.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver';
import { SubGLService } from '../../../../core/services/subgl.service';

@Component({
  selector: 'app-supplier-registration',
  templateUrl: './supplier-registration.component.html',
})
export class SupplierRegistrationComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('supplierDocument') supplierDocument: any;
  @ViewChild('bsFile') bsFile: any;
  form: FormGroup;
  authorizationForm: FormGroup;
  businessOwnerForm: FormGroup;
  topClientForm: FormGroup;
  topSupplierForm: FormGroup;
  formTitle: string = 'Create New Supplier';
  activeIndex: number = 0;
  supplierInformation: any[] = [];
  selectedSupplierInformation: any[];
  displayAuthorization: boolean = false;
  displayBusinessOwners: boolean = false;
  displayTopClients: boolean = false;
  displayTopSuppliers: boolean = false;
  otherTabDisabled: boolean = true;
  supplierId: any;
  supplierAuthorizations: any[] = [];
  supplierBusinessOwners: any[] = [];
  supplierTopClients: any[] = [];
  supplierTopSuppliers: any[] = [];
  countries: any[] = [];
  supplierTypes: any[] = [];
  displayBankDetails: boolean;
  bankDetails: any[] = [];
  bankDetailsForm: FormGroup;
  showFinancialDetails: boolean;
  financialDetailsForm: FormGroup;
  financialDetails: any[] = [];
  files: FileList;
  file: File;
  fileToUpload: File;
  showIdentity: boolean;
  supplierIdentifications: any[] = [];
  identificationForm: FormGroup;
  type: string;
  particular: any;
  displayDocuments: boolean;
  documentsForm: FormGroup;
  supplierDocuments: any[];
  binaryFile: string;
  displayAuthorizerSignature: boolean;
  businessOwnerSignature: string;
  displayBusinessOwnerSignature: boolean;
  documentTypes: any[] = [];
  supplierDoc: string;
  displaySupplierDocument: boolean;
  businessSize: string;
  banks: any[];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private location: Location,
    private subGlService: SubGLService
  ) {
    this.form = this.fb.group({
      supplierId: [0],
      supplierTypeId: [''],
      address: [''],
      name: [''],
      phoneNo: [''],
      email: [''],
      passport: [''],
      registrationNo: [''],
      countryId: [''],
      website: [''],
      taxIDorVATID: [''],
      postalAddress: [''],
      approvalStatusId: [0],
      particulars: [''],
      supplierNumber: [''],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.supplierId = params.id;
      if (this.supplierId != null || this.supplierId != undefined) {
        this.editSupplier(this.supplierId);
        this.getSupplierAuthorization(this.supplierId);
        this.getSupplierBusinessOwner(this.supplierId);
        this.getSupplierTopClient(this.supplierId);
        this.getSupplierTopSupplier(this.supplierId);
        this.getSupplierBankDetails(this.supplierId);
        this.getFinacialDetails(this.supplierId);
        this.getSupplierIdentifications(this.supplierId);
        this.getSupplierDocuments(this.supplierId);
      }
    });
    this.initializeidentityControl();
    this.initializeBusinessownerControl();
    this.initializeAuthorizerControl();
    this.initializeTopClientForm();
    this.initializeTopSupplierForm();
    this.initializeBankDetailsForm();
    this.initializeFinancialDetailsForm();
    this.initializeDocumentForm();
    this.getCountries();
    this.getSupplierType();
    this.getDocumentTypes();
    this.getOtherBanks();
  }
  getBanks() {
    this.loadingService.show();
    return this.subGlService.getBankGls().subscribe(
      (data) => {
        this.loadingService.hide();
        this.banks = data.bank;
        // this.banksArr = banks.map(item => ({
        //   label: item.bankName,
        //   value: item.bankGlId
        // }))
        // this.showDialog = true;
        //  this.isChecked = false;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getDocumentTypes() {
    this.loadingService.show();
    return this.commonService.getAllDocumentType().subscribe(
      (data) => {
        this.loadingService.hide();
        this.documentTypes = data.commonLookups;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  initializeidentityControl() {
    this.identificationForm = this.fb.group({
      supplierId: [0],
      isCorporate: [false],
      registrationNumber: [''],
      incorporationDate: [null],
      businessType: [0],
      otherBusinessType: [''],
      identification: [0],
      identification_Number: [''],
      expiry_Date: [null],
      nationality: [0],
      haveWorkPermit: [false],
    });
  }
  initializeBusinessownerControl() {
    this.businessOwnerForm = this.fb.group({
      supplierBusinessOwnerId: 0,
      supplierId: 0,
      address: [''],
      name: [''],
      phoneNo: [''],
      email: [''],
      dateOfBirth: [null],
      signature: [''],
    });
  }
  initializeAuthorizerControl() {
    this.authorizationForm = this.fb.group({
      supplierAuthorizationId: 0,
      supplierId: 0,
      address: [''],
      name: [''],
      phoneNo: [''],
      email: [''],
      signature: [''],
    });
  }
  initializeTopClientForm() {
    this.topClientForm = this.fb.group({
      topClientId: 0,
      supplierId: 0,
      name: [''],
      address: [''],
      contactPerson: [''],
      phoneNo: [''],
      email: [''],
      noOfStaff: 0,
      countryId: [''],
      incorporationDate: [null],
    });
  }
  initializeTopSupplierForm() {
    this.topSupplierForm = this.fb.group({
      supplierId: 0,
      topSupplierId: 0,
      name: [''],
      address: [''],
      contactPerson: [''],
      phoneNo: [''],
      email: [''],
      noOfStaff: 0,
      countryId: [''],
      incorporationDate: [null],
    });
  }
  initializeBankDetailsForm() {
    this.bankDetailsForm = this.fb.group({
      bankAccountDetailId: [0],
      supplierId: [0],
      accountName: [''],
      accountNumber: [''],
      bvn: [''],
      bank: [''],
    });
  }

  initializeFinancialDetailsForm() {
    this.financialDetailsForm = this.fb.group({
      financialdetailId: [0],
      businessSize: [''],
      year: [''],
      value: [''],
    });
  }

  initializeDocumentForm() {
    this.documentsForm = this.fb.group({
      supplierId: [0],
      name: [''],
      document: [''],
      referenceNumber: [''],
      description: [''],
      supplierDocumentId: [0],
      documentId: [0],
    });
  }
  //get supplier type
  getSupplierType(): Subscription {
    this.loadingService.show();
    return this.supplierService.getSupplierTypes().subscribe(
      (data) => {
        this.loadingService.hide();
        this.supplierTypes = data.suppliertypes;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getCountries() {
    this.loadingService.show();
    return this.commonService.getAllCountry().subscribe(
      (data) => {
        this.loadingService.hide();
        this.countries = data.commonLookups;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  async getSupplierAuthorization(id: number) {
    await this.supplierService
      .getAllSupplierAuthorization(id)
      .subscribe((data) => {
        this.supplierAuthorizations = data.supplierAuthorizations;
      });
  }
  async getSupplierBusinessOwner(id: number) {
    await this.supplierService
      .getAllSupplierBusinessOwner(id)
      .subscribe((data) => {
        this.supplierBusinessOwners = data.supplierBuisnessOwners;
      });
  }
  async getSupplierTopClient(id: number) {
    await this.supplierService.getAllSupplierTopClient(id).subscribe((data) => {
      this.supplierTopClients = data.supplierTopClients;
    });
  }
  async getSupplierTopSupplier(id: number) {
    await this.supplierService
      .getAllSupplierTopSupplier(id)
      .subscribe((data) => {
        this.supplierTopSuppliers = data.topSuppliers;
      });
  }
  editSupplier(supplierId) {
    this.formTitle = 'Edit Supplier Information';
    this.loadingService.show();
    this.supplierService.getSupplier(supplierId).subscribe((data) => {
      this.loadingService.hide();
      let row = data.suppliers[0];
      if (row != undefined) {
        this.otherTabDisabled = false;
      }

      this.form = this.fb.group({
        supplierId: row.supplierId,
        supplierTypeId: row.supplierTypeId,
        address: row.address,
        name: row.name,
        phoneNo: row.phoneNo,
        email: row.email,
        passport: row.passport,
        registrationNo: row.registrationNo,
        countryId: row.countryId,
        website: row.website,
        taxIDorVATID: row.taxIDorVATID,
        postalAddress: row.postalAddress,
        approvalStatusId: row.approvalStatusId,
        particulars: row.particulars,
        supplierNumber: row.supplierNumber,
      });
      this.onParticularsChange(row.particulars);
    });
  }

  goBack() {
    this.location.back();
  }
  submitSupplierInfo(formObj) {
    const payload = formObj.value;
    payload.particulars = parseInt(payload.particulars);
    this.loadingService.show();
    this.supplierService.addSupplierInformation(payload).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.activeIndex = this.activeIndex + 1;
          this.supplierId = data.supplierId;
          this.otherTabDisabled = false;
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
        // this.loadingService.hide();
        // if (data["success"] == true) {
        //     this.supplierId = data["result"].supplierId;
        //     swal.fire("GOS FINANCIAL", data["message"], "success");
        //     this.activeIndex = this.activeIndex + 1;
        //
        // } else {
        //     swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
        // if (!data.isSuccessful) {
        //   const msg = data.message.friendlyMessage;
        //
        // }
      },
      (err) => {
        this.loadingService.hide();
        if (err.status) {
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        } else {
          const message = err.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      }
    );
  }
  onSavedButtonPressed() {
    this.loadingService.show();
    return this.supplierService.sendForApproval(+this.supplierId).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.router.navigate(['/purchases-and-supplier/supplier-list']);
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        if (err.status) {
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        } else {
          const message = err.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      }
    );
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }

  openNext() {
    this.activeIndex = this.activeIndex === 8 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 8 : this.activeIndex - 1;
  }
  showAddNewAuthorization() {
    this.displayAuthorization = true;
  }
  editAuthorization(row) {
    this.authorizationForm = this.fb.group({
      supplierAuthorizationId: row.supplierAuthorizationId,
      supplierId: row.supplierId,
      address: [row.address],
      name: [row.name],
      phoneNo: [row.phoneNo],
      email: [row.email],
      signature: [''],
    });
    this.displayAuthorization = true;
  }

  submitSupplierAuthorization(formObj) {
    const body = formObj.value;
    body.supplierId = +this.supplierId;
    if (!this.file) {
      return swal.fire('GOS FINANCIAL', 'Please select a file', 'error');
    }
    let fileType = ['.jpg', '.png', '.jpeg'];
    // if (this.file) {
    //   if (this.file.type != '.png' || this.file.type != '.jpg') {
    //
    //   }
    // }
    this.loadingService.show();
    this.supplierService
      .addSupplierAuthorization(this.file, body)
      .then((data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.displayAuthorization = false;
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getSupplierAuthorization(this.supplierId).then(() => {
            this.fileInput.nativeElement.value = '';
            this.initializeAuthorizerControl();
          });
        } else {
          this.displayAuthorization = false;
          swal.fire('GOS FINANCIAL', message, 'error');
          this.fileInput.nativeElement.value = '';
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        let error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        this.displayAuthorization = false;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  showAddNewBusinessOwners() {
    this.displayBusinessOwners = true;
  }
  editBusinessOwners(row) {
    this.businessOwnerForm = this.fb.group({
      supplierBusinessOwnerId: row.supplierBusinessOwnerId,
      supplierId: row.supplierId,
      address: [row.address],
      name: [row.name],
      phoneNo: [row.phoneNo],
      email: [row.email],
      dateOfBirth: [this.formatDate(row.dateOfBirth)],
      signature: [''],
    });
    this.displayBusinessOwners = true;
  }

  submitSupplierBusinessOwners(formObj) {
    let body = formObj.value;
    // return;
    let d = new Date(Date.parse(body.dateOfBirth));
    body.dateOfBirth = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    body.supplierId = parseInt(this.supplierId);
    // if (!this.file) {
    //   return swal.fire("GOS FINANCIAL", "Please select a file", "error");
    // }
    // return;
    this.loadingService.show();
    this.supplierService
      .addSupplierBusinessOwner(this.file, body)
      .then((data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.displayBusinessOwners = false;
          this.bsFile.nativeElement.value = '';
          this.initializeBusinessownerControl();
          this.file = null;
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.getSupplierBusinessOwner(this.supplierId).then(() => {});
          });
        } else {
          this.displayBusinessOwners = false;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        let error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        this.displayBusinessOwners = false;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  showAddNewTopClients() {
    this.displayTopClients = true;
  }
  editTopClients(row) {
    this.topClientForm = this.fb.group({
      topClientId: [row.topClientId],
      supplierId: [row.supplierId],
      name: [row.name],
      address: [row.address],
      contactPerson: [row.contactPerson],
      phoneNo: [row.phoneNo],
      email: [row.email],
      noOfStaff: [row.noOfStaff],
      countryId: [row.countryId],
      incorporationDate: [new Date(row.incorporationDate)],
    });
    this.displayTopClients = true;
  }

  submitSupplierTopClients(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.supplierId = parseInt(this.supplierId);
    body.noOfStaff = parseInt(body.noOfStaff);
    body.countryId = +body.countryId;
    this.supplierService.addSupplierTopClient(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getSupplierTopClient(this.supplierId).then(() => {
            this.displayTopClients = false;
            this.initializeTopClientForm();
          });
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        if (err.status) {
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        } else {
          const message = err.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      }
    );
  }

  showAddNewTopSuppliers() {
    this.displayTopSuppliers = true;
  }
  editTopSuppliers(row) {
    this.topSupplierForm = this.fb.group({
      topSupplierId: [row.topSupplierId],
      supplierId: [row.supplierId],
      name: [row.name],
      address: [row.address],
      contactPerson: [row.contactPerson],
      phoneNo: [row.phoneNo],
      email: [row.email],
      noOfStaff: [row.noOfStaff],
      countryId: [row.countryId],
      incorporationDate: [new Date(row.incorporationDate)],
    });
    this.displayTopSuppliers = true;
  }

  submitSupplierTopSuppliers(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.supplierId = parseInt(this.supplierId);
    body.noOfStaff = parseInt(body.noOfStaff);
    body.countryId = +body.countryId;
    this.supplierService.addSupplierTopSupplier(body).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getSupplierTopSupplier(this.supplierId).then(() => {
            this.displayTopSuppliers = false;
            this.initializeTopSupplierForm();
          });
        } else {
          this.displayTopSuppliers = false;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        if (err.status) {
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        } else {
          const message = err.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      }
    );
  }

  parseValueToInt(value: string, type: number) {
    let parsedValue;
    if (type == 1) {
      parsedValue = parseInt(value);
      this.form.patchValue({
        supplierTypeId: parsedValue,
      });
    }
    if (type == 2) {
      parsedValue = parseInt(value);
      this.form.patchValue({
        countryId: parsedValue,
      });
    }
  }

  addSupplierBankDetails() {
    this.displayBankDetails = true;
  }

  editBankDetails(x) {
    this.bankDetailsForm = this.fb.group({
      bankAccountDetailId: [x.bankAccountDetailId],
      supplierId: [x.supplierId],
      accountName: [x.accountName],
      accountNumber: [x.accountNumber],
      bvn: [x.bvn],
      bank: [x.bank],
    });
    this.displayBankDetails = true;
  }

  // get supplier bank details
  async getSupplierBankDetails(id: number) {
    this.loadingService.show();
    await this.supplierService.getSupplierBankDetails(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.bankDetails = data.supplierAccountBankDetails;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  submitBankDetails(bankDetailsForm: FormGroup) {
    const payload = bankDetailsForm.value;
    payload.supplierId = parseInt(this.supplierId); 
    const { accountName, accountNumber, bvn } = payload;
    if (!accountName) {
      return swal.fire('GOS FINANCIAL', 'Account name is required', 'error');
    }
    if (!accountNumber) {
      return swal.fire('GOS FINANCIAL', 'Account number is required', 'error');
    }
    if (isNaN(accountNumber)) {
      return swal.fire(
        'GOS FINANCIAL',
        'Account number must be numbers only',
        'error'
      );
    }
    if (accountNumber.length < 10 || accountNumber.length > 10) {
      return swal.fire(
        'GOS FINANCIAL',
        'Account number must be 10 digits',
        'error'
      );
    }
    if (!bvn) {
      return swal.fire('GOS FINANCIAL', 'BVN is required', 'error');
    }
    if (isNaN(bvn)) {
      return swal.fire('GOS FINANCIAL', 'BVN must be number', 'error');
    }
    if (bvn.length < 11 || bvn.length > 11) {
      return swal.fire('GOS FINANCIAL', 'BVN must be 11 digits', 'error');
    }
    this.loadingService.show();
    return this.supplierService.addSupplierBankDetails(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getSupplierBankDetails(this.supplierId).then(() => {
            this.displayBankDetails = false;
            this.initializeBankDetailsForm();
          });
        } else {
          this.displayBankDetails = false;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        if (err.status) {
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        } else {
          const message = err.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      }
    );
  }

  addSupplierFinancialDetails() {
    this.showFinancialDetails = true;
    this.financialDetailsForm.patchValue({
      businessSize: this.businessSize,
    });
  }

  editFinancialDetails(x) {
    this.financialDetailsForm = this.fb.group({
      financialdetailId: [x.financialdetailId],
      businessSize: [x.businessSize],
      year: [x.year],
      value: [x.value],
      supplierId: [x.supplierId],
    });
    this.showFinancialDetails = true;
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  onAuthFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
  }
  fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }

  // get financial details
  async getFinacialDetails(id: number) {
    this.loadingService.show();
    await this.supplierService.getFinancialDetails(id).subscribe(
      (data) => {
        this.loadingService.hide().then(() => {
          this.financialDetails = data.supplierFinancialDetals;
          if (this.financialDetails.length > 0) {
            this.businessSize = this.financialDetails[0].businessSize;
          }
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  submitFinancialDetails(financialDetailsForm: FormGroup) {
    const payload = financialDetailsForm.value;
    payload.supplierId = parseInt(this.supplierId);
    this.loadingService.show();
    return this.supplierService.updateFinancialDetails(payload).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, 'success');
          this.getFinacialDetails(this.supplierId).then(() => {
            this.showFinancialDetails = false;
            this.initializeFinancialDetailsForm();
          });
        }
      },
      (err) => {
        this.loadingService.hide();
        this.showFinancialDetails = false;
        if (err.status) {
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        } else {
          const message = err.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      }
    );
  }

  onParticularsChange(value: any) {
    this.particular = value;
    if (this.particular == '2') {
      this.identificationForm.reset();
      this.initializeidentityControl();
      this.identificationForm.patchValue({
        isCorporate: true,
      });
    } else {
      this.identificationForm.reset();
      this.initializeidentityControl();
      this.identificationForm.patchValue({
        isCorporate: false,
      });
    }
  }

  showAddIdentity() {
    this.showIdentity = true;
  }

  OnTypeSelect(value: any) {
    this.type = value;
  }

  saveIdentification(identificationForm: FormGroup) {
    const payload = identificationForm.value;
    payload.supplierId = parseInt(this.supplierId);
    let now = new Date();
    let incoDate = new Date(payload.incorporationDate);
    // return;
    if (payload.businessType != null && !isNaN(payload.businessType)) {
      payload.businessType = parseInt(payload.businessType);
    }
    if (payload.identification != null && !isNaN(payload.identification)) {
      payload.identification = parseInt(payload.identification);
    }
    // payload.identification = parseInt(payload.identification);
    if (payload.nationality != null && !isNaN(payload.nationality)) {
      payload.nationality = parseInt(payload.nationality);
    }
    if (incoDate > now) {
      return swal.fire(
        'GOS FINANCIAL',
        'Incorporation date cannot be in the future',
        'error'
      );
    }
    this.loadingService.show();
    return this.supplierService.addSupplierIdentification(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, 'success');
          this.getSupplierIdentifications(this.supplierId).then(() => {
            this.showIdentity = false;
            this.initializeidentityControl();
          });
        } else {
          this.showIdentity = false;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        this.showIdentity = false;
        if (err.status) {
          const message = err.status.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        } else {
          const message = err.message.friendlyMessage;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        }
      }
    );
  }

  async getSupplierIdentifications(id: number) {
    this.loadingService.show();
    await this.supplierService.getSupplierIdentification(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.supplierIdentifications = data.indentifications;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  editIdentification(row) {
    this.identificationForm = this.fb.group({
      supplierId: row.supplierId,
      isCorporate: row.isCorporate,
      registrationNumber: row.registrationnumber,
      incorporationDate: this.formatDate(row.incorporationDate),
      businessType: row.businessType,
      otherBusinessType: row.otherBusinessType,
      identification: row.identification,
      identification_Number: row.identificationNumber,
      expiry_Date: new Date(row.expiryDate),
      nationality: row.nationality,
      haveWorkPermit: row.haveWorkPermit,
      identificationId: row.identificationId,
    });
    this.showIdentity = true;
  }

  // uploadSupplierDocument(: FormGroup) {}

  addDocuments() {
    this.displayDocuments = true;
  }

  view(row) {}

  deleteDocument(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.supplierDocumentId,
    };
    id.push(data);
    let payload = {
      req: id,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteDocument(payload).subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getSupplierDocuments(this.supplierId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            }
          );
        } else {
          swal.fire('Info', 'Cancelled', 'error');
        }
      });
  }
  deleteIdentification(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.identificationId,
    };
    id.push(data);
    let payload = {
      req: id,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteIdentification(payload).subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getSupplierIdentifications(this.supplierId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            }
          );
        } else {
          swal.fire('Info', 'Cancelled', 'error');
        }
      });
  }
  deleteFinancialDetails(id) {
    const intId = parseInt(id.financialdetailId);
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteFinancialDetails(intId).subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getFinacialDetails(this.supplierId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            }
          );
        } else {
          swal.fire('Info', 'Cancelled', 'error');
        }
      });
  }
  deleteBankDetails(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.bankAccountDetailId,
    };
    id.push(data);
    let payload = {
      req: id,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteBankDetails(payload).subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getSupplierBankDetails(this.supplierId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            }
          );
        } else {
          swal.fire('Info', 'Cancelled', 'error');
        }
      });
  }
  deleteTopSuppliers(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.topSupplierId,
    };
    id.push(data);
    let payload = {
      req: id,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteSupplierTopSupplier(payload).subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getSupplierTopSupplier(this.supplierId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            }
          );
        } else {
          swal.fire('Info', 'Cancelled', 'error');
        }
      });
  }
  deleteTopClients(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.topClientId,
    };
    id.push(data);
    let payload = {
      req: id,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteSupplierTopClient(payload).subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getSupplierTopClient(this.supplierId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  deleteBusinessOwners(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.supplierBusinessOwnerId,
    };
    id.push(data);
    let payload = {
      req: id,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteSupplierBusinessOwner(payload).subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getSupplierBusinessOwner(this.supplierId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  deleteAuthorization(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.supplierAuthorizationId,
    };
    id.push(data);
    let payload = {
      req: id,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete tis record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteSupplierAuthorization(payload).subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getSupplierAuthorization(this.supplierId);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              if (err.status) {
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              } else {
                const message = err.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'error');
              }
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  uploadSupplierDocument(documentsForm: FormGroup) {
    if (!this.file) {
      return swal.fire('GOS FINANCIAL', 'Please select a file', 'error');
    }
    let body = documentsForm.value;
    body.document = this.file.name;
    body.documentId = +body.documentId;
    // return;

    body.supplierId = parseInt(this.supplierId);
    // return;
    this.loadingService.show();
    this.supplierService
      .addSupplierDocument(this.file, body)
      .then((data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getSupplierDocuments(this.supplierId).then(() => {
            this.displayDocuments = false;
            this.supplierDocument.nativeElement.value = '';
            this.initializeDocumentForm();
          });
        } else {
          this.displayDocuments = false;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        let error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        this.displayDocuments = false;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  async getSupplierDocuments(supplierId: any) {
    this.loadingService.show();
    await this.supplierService.getSupplierDocuments(supplierId).subscribe(
      (data) => {
        this.loadingService.hide();
        this.supplierDocuments = data.supplierDocument;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  closeIdentity(): void {
    this.showIdentity = false;
    this.identificationForm.reset();
    this.initializeidentityControl();
  }

  closeAuthorizer() {
    this.displayAuthorization = false;
    this.initializeAuthorizerControl();
  }

  viewAuthorizerSinature(signature: any) {
    this.binaryFile = signature;
    this.displayAuthorizerSignature = true;
  }

  viewBusinessOwnerSignature(signature: any) {
    this.businessOwnerSignature = signature;
    this.displayBusinessOwnerSignature = true;
  }

  closeBusinessOwner() {
    this.displayBusinessOwners = false;
    this.initializeBusinessownerControl();
  }

  closeTopClient() {
    this.displayTopClients = false;
    this.initializeTopClientForm();
  }

  closeTopSupplier() {
    this.displayTopSuppliers = false;
    this.initializeTopSupplierForm();
  }

  closeDocumentForm() {
    this.displayDocuments = false;
    this.initializeDocumentForm();
  }

  closeBankDetails() {
    this.displayBankDetails = false;
    this.initializeBankDetailsForm();
  }

  closeFinancialDetails() {
    this.showFinancialDetails = false;
    this.initializeFinancialDetailsForm();
  }

  editDocument(x) {
    this.documentsForm = this.fb.group({
      supplierDocumentId: [x.supplierDocumentId],
      supplierId: [x.supplierId],
      name: [x.name],
      document: [''],
      referenceNumber: [x.referenceNumber],
      description: [x.description],
      documentId: x.documentId,
    });
    this.displayDocuments = true;
  }
  viewSupplierDocument(data) {
    // this.supplierDoc = data;
    this.downloadFile(data);
  }
  downloadFile(data) {
    if (data != undefined) {
      var byteString = atob(data.document);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var bb = new Blob([ab]);
      try {
        var file = new File([bb], `${data.name}.${data.extension}`, {
          type: `${data.fileType}`,
        });
        saveAs(file);
      } catch (err) {
        var textFileAsBlob = new Blob([bb], {
          type: `${data.fileType}`,
        });
        window.navigator.msSaveBlob(
          textFileAsBlob,
          `${data.name}.${data.extension}`
        );
      }
    } else {
      return swal.fire('GOS FINANCIAL', 'An error occurred', 'error');
    }
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  getOtherBanks() {
    this.loadingService.show();
    return this.subGlService.getOtherBankGls().subscribe(
      (data) => {
        this.loadingService.hide();
        this.banks = data.otherBanks;
      },
      (err) => {
        this.loadingService.hide();
        console.log(err);
      }
    );
  }
}
