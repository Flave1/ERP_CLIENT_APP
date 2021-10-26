import { CurrencyService } from "./../../../core/services/currency.service";
import { saveAs } from "file-saver";
import { CommonService } from "./../../../core/services/common.service";
import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingService } from "src/app/core/services/loading.service";
import { LoanCustomerService } from "src/app/core/services/loancustomer.service";
import { ValidationService } from "src/app/core/services/validation.service";
import { IdentificationService } from "src/app/core/services/identification.service";
import { CountryService } from "src/app/core/services/country.service";
import { DepositAccountOpeningService } from "../../../core/services/depositaccountopening.service";
import { DepositAccountService } from "../../../core/services/depositaccount.service";

@Component({
    selector: "app-accountopening-directors",
    templateUrl: "./accountopening-directors.component.html"
})
export class AccountopeningDirectorsComponent implements OnInit {
    selectedResidentOfCountry: boolean = false;
    form: FormGroup;
    genderList: any[];
    martialStatusList: any[];
    titleList: any[];
    employerTypeList: any[];
    cityList: any[];
    stateList: any[];
    currency: any[];
    countryInformation: any[];
    directorTypeList: any[];
    documentTypeList: any[];
    customerId: any;
    othersTabDisabled: boolean;
    directorId: any;
    formTitle: string = "Add Director";
    DirectorInformation: any[];
    identificationInformation: any[] = [];
    activeIndex: number = 0;
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private commonService: CommonService,
        private currencyService: CurrencyService,
        private loanCustomerService: LoanCustomerService,
        private identificationService: IdentificationService,
        private CustomerService: DepositAccountOpeningService,
        private DepositAccountService: DepositAccountService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
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
        this.route.queryParams.subscribe(params => {
            this.customerId = params["param2"];
            this.directorId = params["param1"];
            if (this.directorId != null || this.directorId != undefined) {
                this.editDirector(this.directorId);
                this.openAllTabs();
            } else {
                this.resetTabs();
            }
        });
        this.loadDropDown();
        this.getAllIdentification();
    }

    onTabChange(e) {
        this.activeIndex = e.index;
    }

    getAllIdentification() {
        this.identificationService.getAllIdentification().subscribe(data => {
            this.identificationInformation = data["result"];
        });
    }

    loadDropDown() {
        this.commonService.getAllGender().subscribe(data => {
            this.genderList = data["result"];
        });
        this.commonService.getAllMaritalStatus().subscribe(data => {
            this.martialStatusList = data["result"];
        });
        this.commonService.getAllTitle().subscribe(data => {
            this.titleList = data["result"];
        });
        this.commonService.getAllEmployerType().subscribe(data => {
            this.employerTypeList = data["result"];
        });
        this.commonService.getAllCity().subscribe(data => {
            this.cityList = data["result"];
        });
        this.commonService.getAllState().subscribe(data => {
            this.stateList = data["result"];
        });
        this.currencyService.getAllCurrency().subscribe(data => {
            this.currency = data["result"];
        });
        this.commonService.getAllCountry().subscribe(data => {
            this.countryInformation = data["result"];
        });
        this.commonService.getAllDirectorType().subscribe(data => {
            this.directorTypeList = data["result"];
        });
        this.commonService.getAllDocumentType().subscribe(data => {
            this.documentTypeList = data["result"];
        });
    }

    editDirector(directorId) {
        this.formTitle = "Edit Director Information";
        this.loadingService.show();
        this.CustomerService.getDirector(directorId).subscribe(data => {
            this.loadingService.hide();
            let row = data["result"];
            this.DirectorInformation = row;

            this.form = this.fb.group({
                directorId: row.directorId,
                customerId: row.customerId,
                titleId: row.titleId,
                genderId: row.genderId,
                surname: row.surname,
                firstname: row.firstname,
                othername: row.othername,
                identificationType: row.identificationType,
                identificationNumber: row.identificationNumber,
                telephone: row.telephone,
                mobile: row.mobile,
                email: row.email,
                signatureUpload: row.signatureUpload,
                date: row.date,
                doB: new Date(row.doB),
                placeOfBirth: row.placeOfBirth,
                maritalStatusId: row.maritalStatusId,
                maidenName: row.maidenName,
                nextofKin: row.nextofKin,
                lga: row.lga,
                stateOfOrigin: row.stateOfOrigin,
                taxIDNumber: row.taxIDNumber,
                bvn: row.bvn,
                meansOfID: row.meansOfID,
                idExpiryDate: new Date(row.idExpiryDate),
                idIssueDate: new Date(row.idIssueDate),
                occupation: row.occupation,
                jobTitle: row.jobTitle,
                position: row.position,
                nationality: row.nationality,
                residentOfCountry: row.residentOfCountry,
                residentPermit: row.residentPermit,
                permitIssueDate: new Date(row.permitIssueDate),
                permitExpiryDate: new Date(row.permitExpiryDate),
                socialSecurityNumber: row.socialSecurityNumber,
                address1: row.address1,
                city1: row.city1,
                state1: row.state1,
                country1: row.country1,
                address2: row.address2,
                city2: row.city2,
                state2: row.state2,
                country2: row.country2
            });
        });
    }

    submitDirector(formObj) {
        this.loadingService.show();
        let body = formObj.value;
        body.customerId = parseInt(this.customerId);
        this.CustomerService.addCustomerDirector(body).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    this.directorId = data["result"];
                    this.editDirector(this.directorId);
                    this.openAllTabs();
                    this.activeIndex = 1;
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

    submitDirectorDetails(formObj) {
        this.loadingService.show();
        let body = formObj.value;
        body.customerId = this.customerId;
        this.CustomerService.addCustomerDirector(body).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] != 0) {
                    this.directorId = data["result"];
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigate(["/deposit/accountopening"], {
                        queryParams: { editCustomer: this.customerId }
                    });
                } else {
                    swal.fire("GOS FINANCIAL", data["message"], "error");
                }
            },
            err => {
                this.loadingService.hide();
                swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
            }
        );
    }

    Signaturefiles: FileList;
    Signaturefile: File;
    @ViewChild("SignaturefileInput") SignaturefileInput: any;

    onDirectorImgFileChange(event) {
        this.Signaturefiles = event.target.files;
        this.Signaturefile = this.Signaturefiles[0];
    }

    DirectorSignatureUpload() {
        if (this.Signaturefile != undefined) {
            let body = {
                customerId: this.customerId,
                directorId: this.directorId,
                fileName: this.Signaturefile.name
            };
            this.loadingService.show();
            this.CustomerService.uploadDirectorSignature(
                this.Signaturefile,
                body
            ).then(
                (val: any) => {
                    this.SignaturefileInput.nativeElement.value = "";
                    swal.fire(
                        "GOS FINANCIAL",
                        "Image Successfully Uploaded",
                        "success"
                    );
                },
                error => {
                    this.loadingService.hide();
                    this.SignaturefileInput.nativeElement.value = "";
                    swal.fire(
                        "GOS FINANCIAL",
                        "Image Successfully Uploaded",
                        "success"
                    );

                }
            );
        } else {
            swal.fire("GOS FINANCIAL", "Select a document to Upload", "error");
        }
    }

    resetTabs() {
        this.othersTabDisabled = true;
    }

    openAllTabs() {
        this.othersTabDisabled = false;
    }

    goBack() {
        this.router.navigate(["/deposit/accountopening"], {
            queryParams: { editCustomer: this.customerId }
        });
    }
}
