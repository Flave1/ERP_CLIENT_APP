import { Component, OnInit } from '@angular/core';
import { Requisition, SearchColumn } from '../../../../models/models';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ess-requisitions',
  templateUrl: './ess-requisitions.component.html',
  styleUrls: ['./ess-requisitions.component.css'],
})
export class EssRequisitionsComponent implements OnInit {
  cols: SearchColumn[];
  filteredResults: Requisition[];
  requisitions: Requisition[];
  selectedItem: Requisition[];
  viewHeight = '600px';
  selectedId: number[] = [];

  constructor(
    private expenseManagementService: ExpenseManagementService,
    private loadingService: LoadingService,
    private router: Router
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
    this.getRequisitions();
  }
  getRequisitions() {
    this.loadingService.show();
    return this.expenseManagementService.getRequisitionList().subscribe(
      (data) => {
        this.loadingService.hide();
        this.requisitions = data;
        this.filteredResults = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  deleteMultiple() {
    console.log(this.selectedId);
  }
  multipleDelete() {
    // let ids: number[] = [];
    // this.selectedItem.map((item) => ids.push(item.requisitionId));
    if (this.selectedId.length === 0) {
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
            .multiDeleteRequistion(this.selectedId)
            .subscribe(
              (response) => {
                this.loadingService.hide();
                const message = response['status'].message.friendlyMessage;
                if (response['status'].isSuccessful) {
                  this.selectedId = [];
                  swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                    this.getRequisitions();
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
        } else {
          this.selectedId = [];
        }
      });
  }

  showAddNew() {
    this.router.navigateByUrl('/expense-management/requisition');
  }

  exportItems() {}

  editItem(row: any) {
    this.router.navigate(['/expense-management/requisition'], {
      queryParams: {
        id: row.requisitionId,
      },
    });
  }

  filterByStatus(status: string) {
    if (+status === 10) {
      this.filteredResults = this.requisitions;
    } else {
      return this.expenseManagementService
        .filterEssErn(status)
        .subscribe((data) => {
          this.filteredResults = data;
        });
    }
  }
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.filteredResults.map((item) => {
        return item.requisitionId;
      });
    } else {
      event.target.checked = false;
      this.selectedId = [];
    }
  }

  checkItem(event, requisitionId: number) {
    if (event.target.checked) {
      if (!this.selectedId.includes(requisitionId)) {
        this.selectedId.push(requisitionId);
      }
    } else {
      this.selectedId = this.selectedId.filter((_id) => {
        return _id !== requisitionId;
      });
    }
  }

  searchItems(searchQuery: string) {
    this.filteredResults = this.requisitions.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
}
