import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { Requisition, SearchColumn } from '../../../../models/models';
import swal from 'sweetalert2';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-admin-req-list',
  templateUrl: './admin-req-list.component.html',
  styleUrls: ['./admin-req-list.component.css'],
})
export class AdminReqListComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  cols: SearchColumn[];
  requisitionList: Requisition[] = [];
  selectedItem: Requisition[] = [];
  viewHeight: string = '600px';
  filteredResults: Requisition[] = [];
  file: File;
  constructor(
    private router: Router,
    private expenseManagementService: ExpenseManagementService,
    private loadingService: LoadingService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: 'erNnumber',
        field: 'erNnumber',
      },
      {
        header: 'description',
        field: 'description',
      },
      {
        header: 'requestBy',
        field: 'requestBy',
      },
      {
        header: 'department',
        field: 'department',
      },
      {
        header: 'requestDate',
        field: 'requestDate',
      },
      {
        header: 'totalAmount',
        field: 'totalAmount',
      },
      {
        header: 'expectedDeliveryDate',
        field: 'expectedDeliveryDate',
      },
      {
        header: 'requisitionStatusName',
        field: 'requisitionStatusName',
      },
    ];
    this.getRequisitionList();
  }

  getRequisitionList() {
    this.loadingService.show();
    return this.expenseManagementService.getRequisitions().subscribe(
      (data) => {
        this.loadingService.hide();
        this.requisitionList = data;
        this.filteredResults = this.requisitionList;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  multipleDelete() {
    let ids = [];
    this.selectedItem.map((item) => ids.push(item.requisitionId));
    if (ids.length === 0) {
      return swal.fire('GOS FINANCIAL', 'Select item(s) to delete', 'error');
    }
    swal
      .fire({
        title: 'Are you sure you want to delete items?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.loadingService.show();
          return this.expenseManagementService
            .multiDeleteRequistion(ids)
            .subscribe(
              (response) => {
                this.loadingService.hide();
                const message = response['status'].message.friendlyMessage;
                if (response['status'].isSuccessful) {
                  this.selectedItem = [];
                  swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                    this.getRequisitionList();
                  });
                } else {
                  swal.fire('GOS FINANCIAL', message, 'error');
                }
              },
              (error) => {
                this.loadingService.hide();
                const message = error['status'].message.friendlyMessage;
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            );
        }
      });
  }

  showAddNew() {
    this.router.navigateByUrl('/expense-management/admin-requisition');
  }

  exportItems() {
    this.loadingService.show();
    this.expenseManagementService.exportRequisitions().subscribe(
      (response) => {
        this.loadingService.hide();
        return this.dataService.convertToFile('Requisitions', response);
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

  uploadItems() {
    if (!this.file) {
      return swal.fire('GOS FINANCIAL', 'Select a file to upload', 'error');
    }
    this.loadingService.show();
    return this.expenseManagementService
      .uploadRequisitions(this.file)
      .then((res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        this.fileInput.nativeElement.value = '';
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.getRequisitionList();
          });
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.loadingService.hide();
        const error = JSON.parse(err);
        this.fileInput.nativeElement.value = '';
        if (error.status) {
          const message = error.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        } else {
          const message = error.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      });
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  editItem(x) {
    this.router.navigate(['/expense-management/admin-requisition'], {
      queryParams: {
        id: x.requisitionId,
      },
    });
  }

  filterByStatus(status: any) {
    if (+status === 10) {
      this.filteredResults = this.requisitionList;
    } else {
      return this.expenseManagementService
        .filterAdminErn(status)
        .subscribe((data) => {
          this.filteredResults = data;
        });
    }
  }
}
