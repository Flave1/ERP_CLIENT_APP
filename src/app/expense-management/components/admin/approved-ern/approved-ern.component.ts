import { Component, OnInit } from '@angular/core';
import { Requisition } from '../../../../models/models';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { profilingEnabled } from '@angular-devkit/build-angular/src/utils/environment-options';
import { CompanyService } from '../../../../core/services/company.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-approved-ern',
  templateUrl: './approved-ern.component.html',
  styleUrls: ['./approved-ern.component.css'],
})
export class ApprovedErnComponent implements OnInit {
  requisitionList: Requisition[] = [];
  selectedItem: Requisition[] = [];
  cols: any[] = [];
  viewHeight: string = '600px';
  filteredResults: Requisition[] = [];
  departments: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private expenseManagementService: ExpenseManagementService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: 'ernNumber',
        field: 'ernNumber',
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
        header: 'requisitionDate',
        field: 'requisitionDate',
      },
      {
        header: 'totalAmount',
        field: 'totalAmount',
      },
      {
        header: 'expectedDeliveryDate',
        field: 'expectedDeliveryDate',
      },
    ];
    this.getApprovedErn();
    this.getCompanyStructures();
  }
  getCompanyStructures() {
    this.loadingService.show();
    return this.companyService.getAllCompanyStructure().subscribe(
      (data) => {
        this.loadingService.hide();
        this.departments = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getApprovedErn() {
    this.loadingService.show();
    return this.expenseManagementService.getAppovedERN().subscribe(
      (data) => {
        this.loadingService.hide();
        console.log(data);
        this.requisitionList = data;
        this.filteredResults = this.requisitionList;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  handleFileInput(files: FileList) {}

  uploadItems() {}

  exportItems() {}

  filterByStatus(value: any) {
    this.filteredResults = this.requisitionList.filter(
      (item) => item.statusId === +value
    );
    if (+value === 0) {
      this.filteredResults = this.requisitionList;
    }
  }

  filterByStructure(value: any) {
    this.filteredResults = this.requisitionList.filter(
      (item) => item.departmentId === +value
    );
    if (+value === 0) {
      this.filteredResults = this.requisitionList;
    }
  }

  requestForPayment(requisitionId: number) {
    this.loadingService.show();
    return this.expenseManagementService
      .requestForPayment(requisitionId)
      .subscribe(
        (res) => {
          this.loadingService.hide();
          const message = res['status'].message.friendlyMessage;
          if (res['status'].isSuccessful) {
            swal.fire('GOS FINANCIAL', message, 'success').then(() => {
              this.getApprovedErn();
            });
          } else {
            swal.fire('GOS FINANCIAL', message, 'error');
          }
        },
        (err) => {
          this.loadingService.hide();
          const message = err['status'].message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      );
  }
}
