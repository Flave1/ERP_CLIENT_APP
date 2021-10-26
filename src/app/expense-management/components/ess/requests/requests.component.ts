import { Component, OnInit } from '@angular/core';
import { Requisition, SearchColumn } from '../../../../models/models';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { LoadingService } from '../../../../core/services/loading.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {
  viewHeight = '600px';
  selectedItem: any[] = [];
  cols: SearchColumn[] = [];
  filteredResults: Requisition[] = [];
  requisitionList: Requisition[] = [];

  constructor(
    private expenseManagementService: ExpenseManagementService,
    private loadingService: LoadingService
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
    return this.expenseManagementService.getDeptRequistions().subscribe(
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

  sendForApproval(requisitionId: any) {
    swal
      .fire({
        title: 'Do you want to send this request for approval?',
        text: `You won't be able to reverse this`,
        confirmButtonText: `Yes`,
        showCancelButton: true,
        cancelButtonText: 'No',
        cancelButtonColor: '#ff6347',
        icon: 'question',
      })
      .then((res) => {
        if (res.isConfirmed) {
          this.loadingService.show();
          return this.expenseManagementService
            .sendRequestForApproval(requisitionId)
            .subscribe(
              (response) => {
                this.loadingService.hide();
                const message = response.status.message.friendlyMessage;
                if (response.status.isSuccessful) {
                  swal.fire(`GOS FINANCIAL`, message, 'success').then(() => {
                    this.getRequisitionList();
                  });
                } else {
                  swal.fire(`GOS FINANCIAL`, message, 'error');
                }
              },
              (err) => {
                this.loadingService.hide();
                const message = err.status.message.friendlyMessage;
                swal.fire(`GOS FINANCIAL`, message, 'success');
              }
            );
        }
      });
  }
}
