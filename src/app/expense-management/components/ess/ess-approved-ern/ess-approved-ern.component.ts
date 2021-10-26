import { Component, OnInit } from '@angular/core';
import { Requisition, SearchColumn } from '../../../../models/models';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { CompanyService } from '../../../../core/services/company.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ess-approved-ern',
  templateUrl: './ess-approved-ern.component.html',
  styleUrls: ['./ess-approved-ern.component.css'],
})
export class EssApprovedErnComponent implements OnInit {
  requisitionList: Requisition[] = [];
  selectedItem: Requisition[] = [];
  cols: SearchColumn[] = [];
  viewHeight: string = '600px';
  filteredResults: Requisition[] = [];
  departments: any[] = [];

  constructor(
    private loadingService: LoadingService,
    private expenseManagementService: ExpenseManagementService,
    private router: Router
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
  }
  getApprovedErn() {
    this.loadingService.show();
    return this.expenseManagementService.getApprovedEssErn().subscribe(
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
  filterByStatus(value: any) {
    this.filteredResults = this.requisitionList.filter(
      (item) => item.statusId === +value
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
          
          debugger;
         
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.getApprovedErn();
          });
          } else {
            swal.fire('GOS FINANCIAL', message, 'error');
          }
        },
        (err) => {
          debugger;
          this.loadingService.hide();
          console.log(err);
          // const error = JSON.parse(err);
          const message = err.error.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      );
      
      
      
      
      // .subscribe(
      //   (res) => {
      //     this.loadingService.hide();
      //     const message = res.status.message.friendlyMessage;
      //     if (res.status.isSuccessful) {
      //       swal.fire('GOS FINANCIAL', message, 'success').then(() => {
      //         this.getApprovedErn();
      //       });
      //     } else {
      //       swal.fire('GOS FINANCIAL', message, 'error');
      //     }
      //   },
      //   (err) => {
      //     this.loadingService.hide();
      //     const message = err.status.message.friendlyMessage;
      //     swal.fire('GOS FINANCIAL', message, 'error');
      //   }
      // );
  }

  goToRetirement(requisitionId: any) {
    const thisPageUrl = encodeURI(this.router.url);
    console.log("url :" +thisPageUrl);
    this.router.navigate(['/expense-management/ess-retirement'], {
      queryParams: {
        id: requisitionId,
        sourceUrl : thisPageUrl
      },
    });
  }
}
