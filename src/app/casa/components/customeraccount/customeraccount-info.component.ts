import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CustomerAccountService } from "src/app/core/services/customeraccount.service";
import { LoanCustomerService } from "src/app/core/services/loancustomer.service";
import { CompanyService } from "src/app/core/services/company.service";
import { CurrencyService } from "src/app/core/services/currency.service";
import { BranchService } from "src/app/core/services/branch.service";
import { ProductService } from "src/app/core/services/product.service";

@Component({
    selector: "app-customeraccount-info",
    templateUrl: "./customeraccount-info.component.html"
})
export class CustomerAccountInfoComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Create New CustomerAccount";
    searchResults: any[];
    filteredSearchResults: any[] = [];
    companyInformation: any[] = [];
    currencyInformation: any[] = [];
    branchInformation: any[] = [];
    productInformation: any[] = [];
    displaySearchModal: boolean = false;
    hasLien: boolean = false;
    isCurrentAccount : boolean = false;
    AccountName: any;
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private customeraccountInfoService: CustomerAccountService,
        private loanCustomerService: LoanCustomerService,
        private currencyService: CurrencyService,
        private companyService: CompanyService,
        private branchService: BranchService,
        private productService: ProductService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            casaAccountId: [0],
            productAccountName: [""],
            productAccountNumber: [""],
            availableBalance: [0, Validators.required],
            branchId: [""],
            companyId: ["", Validators.required],
            currencyId: [""],
            customerId: [""],
            customerName: [""],
            hasLien: [false],
            hasOverdraft: [false],
            effectiveDate: [""],
            interestRate: [0, Validators.required],
            isCurrentAccount: [false],
            ledgerBalance: [0],
            lienAmount: [0],
            overdraftAmount:[0],
            overdraftExpiryDate: [""],
            overdraftInterestRate: [0],
            productId: ["", Validators.required],
            relationshipManagerId: [""],
            relationshipOfficerId: [""],
            teamMiscode: [""],
            tenor:[0],
            terminalDate: [""],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let casaAccountId = params["editcustomeraccountinfo"];
            if (casaAccountId != null || casaAccountId != undefined) {
                this.editCustomerAccount(casaAccountId);
            }
        });
        this.getCustomer();
        this.getAllCurrency();
        this.getAllCompany();
        this.getAllBranch();
        this.getAllProduct();
    }

    getCustomer() {
        this.loadingService.show();
        this.loanCustomerService.getAllLoanCustomer().subscribe(data => {
            this.loadingService.hide();
            if (data != null) {
                this.searchResults = data["result"];
                this.filteredSearchResults = this.searchResults;
            }
        });
    }


    getAllCurrency() {
        this.loadingService.show();
        this.currencyService.getAllCurrency().subscribe(data => {
            this.loadingService.hide();
                this.currencyInformation = data["result"];
        });
    }

    getAllCompany() {
        this.loadingService.show();
        this.companyService.getAllCompanyStructure().subscribe(data => {
            this.loadingService.hide();
            this.companyInformation = data.companyStructures;
        }, err => {
          this.loadingService.hide();
        });
    }


    getAllBranch() {
        this.loadingService.show();
        this.branchService.getAllBranch().subscribe(data => {
            this.loadingService.hide();
            this.branchInformation = data["result"];
        });
    }


    getAllProduct() {
        this.loadingService.show();
        this.productService.getAllProduct().subscribe(data => {
            this.loadingService.hide();
            this.productInformation = data.products;
        });
    }


    editCustomerAccount(casaAccountId) {
        this.formTitle = "Edit CustomerAccount Information";
        this.loadingService.show();
        this.customeraccountInfoService.getCustomerAccount(casaAccountId).subscribe(data => {
            this.loadingService.hide();
            let row = data["result"];
            this.form = this.fb.group({
                casaAccountId: row.casaAccountId,
                productAccountName: row.productAccountName,
                productAccountNumber: row.productAccountNumber,
                availableBalance: row.availableBalance,
                branchId: row.branchId,
                companyId: row.companyId,
                currencyId: row.currencyId,
                customerId: row.customerId,
                hasLien: row.hasLien,
                hasOverdraft: row.hasOverdraft,
                effectiveDate:new Date(row.effectiveDate),
                interestRate: row.interestRate,
                isCurrentAccount: row.isCurrentAccount,
                ledgerBalance:row.ledgerBalance,
                lienAmount: row.lienAmount,
                overdraftAmount:row.overdraftAmount,
                overdraftExpiryDate: row.overdraftExpiryDate,
                overdraftInterestRate: row.overdraftInterestRate,
                productId: row.productId,
                relationshipManagerId: row.relationshipManagerId,
                relationshipOfficerId: row.relationshipOfficerId,
                teamMiscode: row.teamMiscode,
                tenor:row.tenor,
                terminalDate: new Date(row.terminalDate),
            });
        });
    }


    openSearchBox() {
        this.displaySearchModal = true;
    }
    pickSearchedData(data) {
        this.form.controls["customerName"].setValue(data.firstName);
        this.form.controls["productAccountName"].setValue(data.firstName);
        this.form.controls["customerId"].setValue(data.customerId);

        this.displaySearchModal = false;
    }

    searchDB(searchString) {
        searchString.preventDefault;
        let filterBy = searchString ? searchString.toLocaleLowerCase() : null;
        this.filteredSearchResults = this.searchResults.filter(
            (item: any) =>
                item.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1
        );
    }


    goBack() {
        this.router.navigate(["/casa/customeraccount-info-list"]);
    }
    submitCustomerAccountInfo(formObj) {
        this.loadingService.show();
        this.customeraccountInfoService.addUpdateCasa(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
                if (data["success"] == true) {
                    this.AccountName = data["result"].productAccountName;
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigate(["/casa/customeraccount-info-list"]);
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
}
