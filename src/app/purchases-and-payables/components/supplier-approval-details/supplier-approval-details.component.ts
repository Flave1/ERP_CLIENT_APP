import { Component, Input, OnInit } from "@angular/core";
import { SupplierService } from "../../../core/services/supplier.service";
import { LoadingService } from "../../../core/services/loading.service";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidationService } from "../../../core/services/validation.service";
import { CommonService } from "../../../core/services/common.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";

@Component({
  selector: "app-supplier-approval-details",
  templateUrl: "./supplier-approval-details.component.html",
  styleUrls: ["./supplier-approval-details.component.css"]
})
export class SupplierApprovalDetailsComponent implements OnInit {
  _supplierId: any;
  supplierDetails: any;
  supplierIdentifications: any[] = [];
  identificationForm: FormGroup;
  businessSize: string;
  supplierDocuments: any[] = [];
  get supplierId(): any {
    return this._supplierId;
  }
  @Input() set supplierId(value: any) {
    this._supplierId = value;
    if (value != undefined) {
      this.getSupplierDetails(value);
      this.getFinacialDetails(value);
      this.getSupplierAuthorization(value);
      this.getSupplierAuthorization(value);
      this.getSupplierBankDetails(value);
      this.getSupplierBusinessOwner(value);
      this.getSupplierTopClient(value);
      this.getSupplierTopSupplier(value);
      this.getSupplierIdentifications(value);
      this.getSupplierDocuments(value)
    }
  }
  form: FormGroup;
  authorizationForm: FormGroup;
  businessOwnerForm: FormGroup;
  topClientForm: FormGroup;
  topSupplierForm: FormGroup;
  formTitle: string = "Create New Supplier";
  activeIndex: number = 0;
  supplierInformation: any[] = [];
  selectedSupplierInformation: any[];
  displayAuthorization: boolean = false;
  displayBusinessOwners: boolean = false;
  displayTopClients: boolean = false;
  displayTopSuppliers: boolean = false;
  otherTabDisabled: boolean = true;
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
  displayDocuments: boolean;
  documentsForm: FormGroup;
  type: string;
  particular: string;
  showIdentity: boolean;
  binaryFile: string;
  displayAuthorizerSignature: boolean;
  businessOwnerSignature: string;
  displayBusinessOwnerSignature: boolean;
  supplierDoc: string;
  displaySupplierDocument: boolean;
  constructor(
    private supplierService: SupplierService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private location: Location,
    private router: Router
  ) {
    this.authorizationForm = this.fb.group({
      supplierAuthorizationId: 0,
      supplierId: 0,
      address: [""],
      name: ["", Validators.required],
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
      signature: [""]
    });
    this.businessOwnerForm = this.fb.group({
      supplierBusinessOwnerId: 0,
      supplierId: 0,
      address: [""],
      name: ["", Validators.required],
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
      dateOfBirth: [null],
      signature: [""]
    });
    this.topClientForm = this.fb.group({
      topClientId: 0,
      supplierId: 0,
      name: [""],
      address: [""],
      contactPerson: [""],
      phoneNo: [""],
      email: [""],
      noOfStaff: 0
    });
    this.topSupplierForm = this.fb.group({
      supplierId: 0,
      topSupplierId: 0,
      name: [""],
      address: [""],
      contactPerson: [""],
      phoneNo: [""],
      email: [""],
      noOfStaff: 0
    });
    this.bankDetailsForm = this.fb.group({
      bankAccountDetailId: [0],
      supplierId: [0],
      accountName: [""],
      accountNumber: [""],
      bvn: [""]
    });
    this.financialDetailsForm = this.fb.group({
      financialdetailId: [0],
      businessSize: [""],
      year1: [""],
      value1: [""],
      year2: [""],
      value2: [""],
      year3: [""],
      value3: [""],
      supplierId: [0]
    });
    this.documentsForm = this.fb.group({
      supplierId: [0],
      name: [""],
      document: [""]
    });
  }

  ngOnInit() {
    this.initializeidentityControl()
  }
  initializeidentityControl() {
    this.identificationForm = this.fb.group({
      supplierId: [0],
      isCorporate: [""],
      registrationNumber: [""],
      incorporationDate: [""],
      businessType: [""],
      otherBusinessType: [""],
      identification: [""],
      identification_Number: [""],
      expiry_Date: [""],
      nationality: [""],
      haveWorkPermit: [false]
    });
  }
  getSupplierDetails(id: number) {
    this.loadingService.show();
    return this.supplierService.getSupplier(id).subscribe(
      data => {
        this.supplierDetails = data.suppliers[0];
        this.particular = this.supplierDetails.particulars;
        this.loadingService.hide();
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getSupplierType(): Subscription {
    this.loadingService.show();
    return this.supplierService.getSupplierTypes().subscribe(
      data => {
        this.loadingService.hide();
        this.supplierTypes = data.suppliertypes;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getCountries() {
    this.loadingService.show();
    return this.commonService.getAllCountry().subscribe(
      data => {
        this.loadingService.hide();
        this.countries = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  async getSupplierAuthorization(id: number) {
    await this.supplierService
      .getAllSupplierAuthorization(id)
      .subscribe(data => {
        this.supplierAuthorizations = data.supplierAuthorizations;
      });
  }
  async getSupplierBusinessOwner(id: number) {
    await this.supplierService
      .getAllSupplierBusinessOwner(id)
      .subscribe(data => {
        this.supplierBusinessOwners = data.supplierBuisnessOwners;
      });
  }
  async getSupplierTopClient(id: number) {
    await this.supplierService.getAllSupplierTopClient(id).subscribe(data => {
      this.supplierTopClients = data.supplierTopClients;
    });
  }
  async getSupplierTopSupplier(id: number) {
    await this.supplierService.getAllSupplierTopSupplier(id).subscribe(data => {
      this.supplierTopSuppliers = data.topSuppliers;
    });
  }
  async getSupplierDocuments(supplierId: any) {
    this.loadingService.show();
    await this.supplierService.getSupplierDocuments(supplierId).subscribe(
      data => {
        this.loadingService.hide();
        this.supplierDocuments = data.supplierDocument;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editSupplier(supplierId) {
    this.formTitle = "Edit Supplier Information";
    this.loadingService.show();
    this.supplierService.getSupplier(supplierId).subscribe(data => {
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
        approvalStatusId: row.approvalStatusId
      });
    });
  }

  goBack() {
    this.location.back();
  }
  submitSupplierInfo(formObj) {
    const payload = formObj.value;
    this.loadingService.show();
    this.supplierService.addSupplierInformation(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.activeIndex = this.activeIndex + 1;
          this.supplierId = data.supplierId;
          this.otherTabDisabled = false;
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
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
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
  onSavedButtonPressed() {
    swal.fire(
      "GOS FINANCIAL",
      "Record Saved Successfully and it being sent for approval",
      "success"
    );
    this.router.navigate(["/supplier/supplier-list"]);
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }

  openNext() {
    this.activeIndex = this.activeIndex === 7 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 7 : this.activeIndex - 1;
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
      signature: [row.signature]
    });
    this.displayAuthorization = true;
  }
  deleteAuthorization(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.supplierAuthorizationId
    };
    id.push(data);
    let payload = {
      req: id
    };
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

          __this.supplierService
            .deleteSupplierAuthorization(payload)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data.deleted) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getSupplierAuthorization(this.supplierId);
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  submitSupplierAuthorization(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.supplierId = parseInt(this.supplierId);
    this.supplierService
      .addSupplierAuthorization(this.file, body)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getSupplierAuthorization(this.supplierId).then(() => {
            this.displayAuthorization = false;
          });
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
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
      dateOfBirth: [new Date(row.dateOfBirth)],
      signature: [row.signature]
    });
    this.displayBusinessOwners = true;
  }
  deleteBusinessOwners(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.supplierBusinessOwnerId
    };
    id.push(data);
    let payload = {
      req: id
    };
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

          __this.supplierService.deleteSupplierBusinessOwner(payload).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getSupplierBusinessOwner(this.supplierId);
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
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  submitSupplierBusinessOwners(formObj) {
    let body = formObj.value;
    // return;

    body.supplierId = parseInt(this.supplierId);
    body.signature = this.fileToUpload;
    // return;
    this.loadingService.show();
    this.supplierService
      .addSupplierBusinessOwner(this.file, body)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getSupplierBusinessOwner(this.supplierId).then(() => {
            this.displayBusinessOwners = false;
          });
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  onAuthFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
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
      noOfStaff: [row.noOfStaff]
    });
    this.displayTopClients = true;
  }
  deleteTopClients(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.topClientId
    };
    id.push(data);
    let payload = {
      req: id
    };
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

          __this.supplierService.deleteSupplierTopClient(payload).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getSupplierTopClient(this.supplierId);
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
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  submitSupplierTopClients(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.supplierId = parseInt(this.supplierId);
    body.noOfStaff = parseInt(body.noOfStaff);
    this.supplierService.addSupplierTopClient(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getSupplierTopClient(this.supplierId).then(() => {
            this.displayTopClients = false;
          });
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
      noOfStaff: [row.noOfStaff]
    });
    this.displayTopSuppliers = true;
  }
  deleteTopSuppliers(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.topSupplierId
    };
    id.push(data);
    let payload = {
      req: id
    };
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

          __this.supplierService.deleteSupplierTopSupplier(payload).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getSupplierTopSupplier(this.supplierId);
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
        } else {
          swal.fire("Info", "Cancelled", "error");
        }
      });
  }
  submitSupplierTopSuppliers(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    body.supplierId = parseInt(this.supplierId);
    body.noOfStaff = parseInt(body.noOfStaff);
    this.supplierService.addSupplierTopSupplier(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getSupplierTopSupplier(this.supplierId).then(() => {
            this.displayTopSuppliers = false;
          });
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

  parseValueToInt(value: string, type: number) {
    let parsedValue;
    if (type == 1) {
      parsedValue = parseInt(value);
      this.form.patchValue({
        supplierTypeId: parsedValue
      });
    }
    if (type == 2) {
      parsedValue = parseInt(value);
      this.form.patchValue({
        countryId: parsedValue
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
      bvn: [x.bvn]
    });
    this.displayBankDetails = true;
  }

  deleteBankDetails(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.bankAccountDetailId
    };
    id.push(data);
    let payload = {
      req: id
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteBankDetails(payload).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getSupplierBankDetails(this.supplierId);
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
        } else {
          swal.fire("Info", "Cancelled", "error");
        }
      });
  }
  // get supplier bank details
  async getSupplierBankDetails(id: number) {
    this.loadingService.show();
    await this.supplierService.getSupplierBankDetails(id).subscribe(
      data => {
        this.loadingService.hide();
        this.bankDetails = data.supplierAccountBankDetails;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  submitBankDetails(bankDetailsForm: FormGroup) {
    const payload = bankDetailsForm.value;
    payload.supplierId = parseInt(this.supplierId);
    const { accountName, accountNumber, bvn } = payload;
    if (!accountName) {
      return swal.fire("GOS FINANCIAL", "Account name is required", "error");
    }
    if (!accountNumber) {
      return swal.fire("GOS FINANCIAL", "Account number is required", "error");
    }
    if (isNaN(accountNumber)) {
      return swal.fire("GOS FINANCIAL", "Account number must be numbers only", "error");
    }
    if (accountNumber.length < 10 || accountNumber.length > 10) {
      return swal.fire("GOS FINANCIAL", "Account number must be 10 digits");
    }
    if (!bvn) {
      return swal.fire("GOS FINANCIAL", "BVN is required", "error");
    }
    if (isNaN(bvn)) {
      return swal.fire("GOS FINANCIAL", "BVN must be number", "error");
    }
    if (bvn.length < 11 || bvn.length > 11) {
      return swal.fire("GOS FINANCIAL", "BVN must be 11 digits", "error");
    }
    this.loadingService.show();
    return this.supplierService.addSupplierBankDetails(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getSupplierBankDetails(this.supplierId).then(() => {
            this.displayBankDetails = false;
          });
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

  addSupplierFinancialDetails() {
    this.showFinancialDetails = true;
  }

  editFinancialDetails(x) {
    this.financialDetailsForm = this.fb.group({
      financialdetailId: [x.financialdetailId],
      businessSize: [x.businessSize],
      year1: [x.year1],
      value1: [x.value1],
      year2: [x.year2],
      value2: [x.value2],
      year3: [x.year3],
      value3: [x.value3],
      supplierId: [x.supplierId]
    });
    this.showFinancialDetails = true;
  }

  deleteFinancialDetails(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.financialdetailId
    };
    id.push(data);
    let payload = {
      req: id
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteFinancialDetails(payload).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getFinacialDetails(this.supplierId);
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
        } else {
          swal.fire("Info", "Cancelled", "error");
        }
      });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }

  // get financial details
  async getFinacialDetails(id: number) {
    this.loadingService.show();
    await this.supplierService.getFinancialDetails(id).subscribe(
      data => {
        this.loadingService.hide().then(() => {
          this.financialDetails = data.supplierFinancialDetals;
          this.businessSize = this.financialDetails[0].businessSize
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  submitFinancialDetails(financialDetailsForm: FormGroup) {
    const payload = financialDetailsForm.value;
    payload.supplierId = parseInt(this.supplierId);
    this.loadingService.show();
    return this.supplierService.updateFinancialDetails(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, "success");
          this.getFinacialDetails(this.supplierId).then(() => {
            this.showFinancialDetails = false;
          });
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  uploadSupplierDocument(topSupplierForm: FormGroup) {}

  addDocuments() {
    this.displayDocuments = true;
  }

  view(row) {}

  deleteDocument(row) {}
  onParticularsChange(value: any) {
    this.particular = value;
    if (this.particular == "2") {
      this.identificationForm.reset();
      this.initializeidentityControl();
      this.identificationForm.patchValue({
        isCorporate: true
      });
    } else {
      this.identificationForm.reset();
      this.initializeidentityControl();
      this.identificationForm.patchValue({
        isCorporate: false
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
    this.loadingService.show();
    return this.supplierService.addSupplierIdentification(payload).subscribe(
      res => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, "success");
        } else {
          swal.fire(`GOS FINANCIAL`, message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire(`GOS FINANCIAL`, message, "error");
      }
    );
  }

  async getSupplierIdentifications(id: number) {
    this.loadingService.show();
    await this.supplierService.getSupplierIdentification(id).subscribe(
      data => {
        this.loadingService.hide();
        this.supplierIdentifications = data.indentifications;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editIdentification(row) {
    this.identificationForm = this.fb.group({
      supplierId: row.supplierId,
      isCorporate: row.isCorporate,
      registrationNumber: row.registrationNumber,
      incorporationDate: new Date(row.incorporationDate),
      businessType: row.businessType,
      otherBusinessType: row.otherBusinessType,
      identification: row.identification,
      identification_Number: row.identificationNumber,
      expiry_Date: new Date(row.expiryDate),
      nationality: row.nationality,
      haveWorkPermit: row.haveWorkPermit,
      identificationId: row.identificationId
    });
    this.showIdentity = true;
  }

  deleteIdentification(row) {
    let id = [];
    // id.push(row.identificationId);
    let data = {
      targetId: row.identificationId
    };
    id.push(data);
    let payload = {
      req: id
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.supplierService.deleteIdentification(payload).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getSupplierIdentifications(this.supplierId);
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
        } else {
          swal.fire("Info", "Cancelled", "error");
        }
      });
  }
  viewAuthorizerSinature(signature: any) {
    this.binaryFile = signature;
    this.displayAuthorizerSignature = true;
  }

  viewBusinessOwnerSignature(signature: any) {
    this.businessOwnerSignature = signature;
    this.displayBusinessOwnerSignature = true;
  }
  viewSupplierDocument(file: string) {
    this.supplierDoc = file;
    this.displayBusinessOwnerSignature = true;
  }

  downloadDocument(data) {
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
          type: `${data.fileType}`
        });
        saveAs(file);
      } catch (err) {

        var textFileAsBlob = new Blob([bb], {
          type: `${data.fileType}`
        });
        window.navigator.msSaveBlob(textFileAsBlob, `${data.name}.${data.extension}`);
      }
    } else {
      return swal.fire("GOS FINANCIAL", "An error occurred", "error");
    }
  }
}
