import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { CostCentre, SearchColumn } from '../../../../models/models';
import swal from 'sweetalert2';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-cost-centre-list',
  templateUrl: './cost-centre-list.component.html',
  styleUrls: ['./cost-centre-list.component.css'],
})
export class CostCentreListComponent implements OnInit {
  setUpLists: CostCentre[] = [];
  @ViewChild('fileInput') fileInput: ElementRef;
  selectedItem: CostCentre[] = [];
  cols: SearchColumn[] = [];
  viewHeight: any;
  file: File;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private expenseManagementService: ExpenseManagementService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getCostCentreList();
    this.cols = [
      {
        header: 'name',
        field: 'name',
      },
      {
        header: 'description',
        field: 'description',
      },
      {
        header: 'structureNames',
        field: 'structureNames',
      },
    ];
  }

  getCostCentreList() {
    this.loadingService.show();
    this.expenseManagementService.getCostCentreList().subscribe(
      (data) => {
        this.loadingService.hide();
        this.setUpLists = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  showAddNew() {
    this.router.navigate(['/expense-management/cost-centre']);
  }

  exportItems() {
    this.loadingService.show();
    this.expenseManagementService.exportCostcentreSetup().subscribe(
      (response) => {
        this.loadingService.hide();
        const data = response;

        return this.dataService.convertToFile('Cost centre Setup', data);
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
      .uploadCostCentreSetup(this.file)
      .then((res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        this.fileInput.nativeElement.value = '';
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.getCostCentreList();
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

  multipleDelete() {
    const payload = [];
    this.selectedItem.map((item) => payload.push(item.costCenterId));
    if (payload.length === 0) {
      return swal.fire(`GOS FINANCIAL`, `Select item to delete`, 'error');
    } else {
      return swal
        .fire({
          title: `Do you want to delete this item`,
          text: `You won't be able to reverse this`,
          confirmButtonText: `Yes`,
          showCancelButton: true,
          icon: 'warning',
        })
        .then((response) => {
          if (response.isConfirmed) {
            this.loadingService.show();
            return this.expenseManagementService
              .deleteCostCentre(payload)
              .subscribe(
                (response) => {
                  this.loadingService.hide();
                  const message = response['status'].message.friendlyMessage;
                  if (response['status'].isSuccessful) {
                    swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                      this.selectedItem = [];
                      this.getCostCentreList();
                    });
                  } else {
                    swal.fire(`GOS FINANCIAL`, message, 'error');
                  }
                },
                (error) => {
                  this.loadingService.hide();
                  const message = error['status'].message.friendlyMessage;
                  swal.fire(`GOS FINANCIAL`, message, 'error');
                }
              );
          }
        });
    }
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
  editItem(x) {
    this.router.navigate(['/expense-management/cost-centre'], {
      queryParams: {
        id: x.costCenterId,
      },
    });
  }
}
