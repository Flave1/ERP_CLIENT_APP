import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { Claim, SearchColumn } from '../../../../models/models';
import swal from 'sweetalert2';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css'],
})
export class ClaimsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  cols: SearchColumn[] = [];
  claims: Claim[] = [];
  selectedItem: any[] = [];
  viewHeight: any;
  fileToUpload: File;
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private expenseManagementService: ExpenseManagementService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getClaims();
  }
  getClaims() {
    this.loadingService.show();
    return this.expenseManagementService.getClaims().subscribe(
      (data) => {
        this.loadingService.hide();
        this.claims = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  exportItems() {
    this.loadingService.show();
    return this.expenseManagementService.downloadNoReqClaims().subscribe(
      (data) => {
        this.loadingService.hide();
        this.dataService.convertToFile('Claims', data);
      },
      (err) => {
        this.loadingService.hide();
        if (err.status) {
          const message = err.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        } else {
          const message = err.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      }
    );
  }

  showAddNew() {
    this.router.navigateByUrl('/expense-management/claim');
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadItems() {
    if (!this.fileToUpload) {
      return swal.fire('GOS FINANCIAL', 'Select file to upload', 'error');
    }
    // if (
    //   this.fileToUpload.type !==
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    // ) {
    //   return swal.fire(`GOS FINANCIAL`, 'Only excel file is allowed', 'error');
    // }
    this.loadingService.show();
    return this.expenseManagementService
      .uploadNoReqClaims(this.fileToUpload)
      .then((res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire(`GOS FINANCIAL`, message, 'success').then(() => {
            this.fileInput.nativeElement.value = '';
            this.getClaims();
          });
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  editItem(newClaimID: number) {
    this.router.navigate(['/expense-management/claim'], {
      queryParams: {
        id: newClaimID,
      },
    });
  }
}
