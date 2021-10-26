import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CollateralService } from 'src/app/core/services/collateral.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanApplicationService } from 'src/app/core/services/loanapplication.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-collateral-management',
  templateUrl: './collateral-management.component.html',
})
export class CollateralManagementComponent implements OnInit {
  allProcessingLoanApplication: any[] = [];
  displayModalForm = false;
  cols: any[] = [];
  selectedLoanApplication: any[] = [];
  allCollateralConsumption: any[] = [];
  customerCollateralsVerified: any[] = [];
  loanApplicationId: number;
  form: FormGroup;
  formTitle = '';
  viewHeight = '600px';
  @ViewChild('fileInput') fileInput: ElementRef;
  fileToUpload: File;
  operatingAccount: boolean;
  filteredArray: any[] = [];
  type: any;
  customerType: any;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private collateralService: CollateralService,
    private route: ActivatedRoute,
    private router: Router,
    private loanApplicationService: LoanApplicationService
  ) {}

  ngOnInit() {
    this.getAllProcessingLoanApplication();
    this.cols = [
      // { field: "loanApplicationId", header: "loanApplicationId" },
      { field: 'loanApplicationRefNo', header: 'loanApplicationRefNo' },
      { field: 'expectedCollateralValue', header: 'expectedCollateralValue' },
      { field: 'totalCollateralValue', header: 'totalCollateralValue' },
      { field: 'loanApplicationRefNo', header: 'loanApplicationRefNo' },
      {
        field: 'customerName',
        header: 'customerName',
      },
      {
        field: 'loanRefNo',
        header: 'loanRefNo',
      },
    ];
  }

  getAllCollateralForLoanApplication(loanApplication) {
    this.loadingService.show();
    this.collateralService
      .getAllowableCollateralTypesByLoanApplicationId(loanApplication)
      .subscribe((data) => {
        this.allCollateralConsumption = data.collateralTypes;
        this.loadingService.show();
      });
  }

  getAllProcessingLoanApplication(): void {
    this.collateralService
      .getAllCollateralManagementResource()
      .subscribe((data) => {
        this.allProcessingLoanApplication = data.collateralManagement;
      });
  }

  rowClicked(row) {
    this.loadingService.show();
    this.router.navigate(['/credit/loan-collateral'], {
      queryParams: {
        loanapp: row.loanApplicationId,
        obligor: row.customerId,
        loanman: `+`,
      },
    });
    this.loadingService.hide();
  }

  uploadCollateralTypes() {
    if (!this.fileToUpload) {
      return swal.fire('GOS FINANCIAL', 'Select file to upload', 'error');
    }

    this.loadingService.show();
    return this.collateralService
      .uploadCollateralTypes(this.fileToUpload)
      .then((res) => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.fileInput.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  uploadCollaterals() {
    // if (!this.fileToUpload) {
    //   return swal.fire('GOS FINANCIAL', 'Select file to upload', 'error')
    // }

    this.loadingService.show();
    return this.collateralService.uploadCollaterals().subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        const message = err.status.message.friendlyMessage;
        return swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  openSearchBox() {}

  getCustomerType(value: any) {}

  getDropdownType(value: any) {}

  downloadCollaterals() {
    this.loadingService.show();
    return this.collateralService.downloadCollaterals().subscribe(
      (response) => {
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
            const file = new File([bb], 'Collaterals.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(textFileAsBlob, 'Collaterals.xlsx');
          }
        } else {
          return swal.fire('GOS FINANCIAL', 'An error occurred', 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
}
