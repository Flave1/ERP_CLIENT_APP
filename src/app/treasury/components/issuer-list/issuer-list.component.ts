import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "../../../core/services/loading.service";
import { LoanCustomerService } from "../../../core/services/loancustomer.service";
import { DepositAccountOpeningService } from "../../../core/services/depositaccountopening.service";
import { Router } from "@angular/router";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";
import { TreasuryService } from "../../../core/services/treasury.service";

@Component({
  selector: "app-issuer-list",
  templateUrl: "./issuer-list.component.html",
  styleUrls: ["./issuer-list.component.css"]
})
export class IssuerListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  activeIndex = 0;
  loanCustomerInformation: any[] = [];
  selectedLoanCustomerInformation: any[];
  displaySearchModal = false;
  cols: any[];
  searchResults: any[];
  filteredSearchResults: any[];
  viewHeight: any = "600px";
  private fileToUpload: File;
  constructor(
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService,
    private CustomerService: DepositAccountOpeningService,
    private router: Router,
    private treasuryService: TreasuryService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "customerTypeName", header: "customerTypeName" },
      { field: "firstName", header: "firstName" },
      { field: "email", header: "email" },
      { field: "phoneNo", header: "phoneNo" }
    ];
    this.getIssuers();
    // this.getAllCustomer();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }
  showAddNew() {
    this.router.navigate(["/treasury/issuer-info"]);
  }

  openSearchBox() {
    this.displaySearchModal = true;
  }
  pickSearchedData(row) {
    this.router.navigate(["/credit/loancustomer-info"], {
      queryParams: { editloanCustomerFromDeposit: row.customerId }
    });

    this.displaySearchModal = false;
  }

  searchDB(searchString) {
    // searchString.preventDefault();
    const filterBy = searchString ? searchString.toLocaleLowerCase() : null;
    this.filteredSearchResults = this.searchResults.filter((item: any) => {
      return (
        item.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        item.lastName.toLocaleLowerCase().indexOf(filterBy) !== -1
      );
    });
    if (!searchString) {
      this.filteredSearchResults = this.searchResults;
    }
  }

  // getAllCustomer() {
  //     this.loadingService.show();
  //     this.CustomerService.getAllCustomerLite().subscribe(data => {
  //         this.loadingService.hide();
  //         this.searchResults = data["result"];
  //         this.filteredSearchResults = this.searchResults;
  //     });
  // }

  getIssuers() {
    this.loadingService.show();
    this.treasuryService.getAllIssuer().subscribe(
      data => {
        this.loadingService.hide();
        this.loanCustomerInformation = data.issuerRegistrations;
      },
      error => {
        return this.loadingService.hide();
      }
    );
  }
  editLoanCustomer(row) {
    this.router.navigate(["/treasury/issuer-info"], {
      queryParams: { issuerRegistrationId: row.issuerRegistrationId }
    });
  }
  editCustomerFromDeposit(row) {
    this.router.navigate(["/credit/loancustomer-info"], {
      queryParams: { editloanCustomerFromDeposit: row.customerId }
    });
  }
  deleteLoanCustomer(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete user?",
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomer(row.customerId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getIssuers();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  openNext() {
    this.activeIndex = this.activeIndex === 5 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 5 : this.activeIndex - 1;
  }
  onRowSelect(event) {
    this.router.navigate(["/treasury/issuer-info"], {
      queryParams: { editloanCustomerId: event.data.customerId }
    });
  }
  exportFile() {
    this.loadingService.show();
    this.treasuryService.downloadIssuer().subscribe(response => {
      this.loadingService.hide();
      const data = response.export;
      if (data != undefined) {
        const byteString = atob(data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const bb = new Blob([ab]);
        try {
          const file = new File([bb], "Issuers.xlsx", {
            type: "application/vnd.ms-excel"
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: "application/vnd.ms-excel"
          });
          window.navigator.msSaveBlob(textFileAsBlob, "Issuers.xlsx");
        }
      }
    });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadFile() {
    if (this.fileToUpload == null) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
      return;
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show();
    this.treasuryService
      .uploadIssuers(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        this.fileInput.nativeElement.value = "";
        if (data.status.isSuccessful) {
          this.getIssuers();
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          // this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  submitMultipleDelete(formObj) {
    this.loadingService.show();
    let body = { itemIds: formObj };
    this.treasuryService.multipleDeleteIssuer(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.getIssuers();
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
  multipleDelete() {
    if (this.selectedLoanCustomerInformation.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedLoanCustomerInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        // let data = {
        //     targetId: el.issuerRegistrationId
        // };
        targetIds.push(el.issuerRegistrationId);
      });
    }
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          this.submitMultipleDelete(targetIds);
        } else {
          return swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  invest(row: any) {
    this.router.navigate(["/treasury/placement-info"], {
      queryParams: {
        investorId: row.issuerRegistrationId
      }
    });
  }
}
