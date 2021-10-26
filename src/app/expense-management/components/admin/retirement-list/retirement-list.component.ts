import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';

@Component({
  selector: 'app-retirement-list',
  templateUrl: './retirement-list.component.html',
  styleUrls: ['./retirement-list.component.css'],
})
export class RetirementListComponent implements OnInit {
  cols: any[] = [];
  retirements: any;
  selectedItem: any[] = [];
  viewHeight: string = '600px';

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private expenseManagementService: ExpenseManagementService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: 'ernNumber',
        field: 'ernNumber',
      },
      {
        header: 'totalAmountApproved',
        field: 'totalAmountApproved',
      },
      {
        header: 'requisitionDate',
        field: 'requisitionDate',
      },
      {
        header: 'retirementDate',
        field: 'retirementDate',
      },
      {
        header: 'description',
        field: 'description',
      },
      {
        header: 'amountUsed',
        field: 'amountUsed',
      },
      {
        header: 'balance',
        field: 'balance',
      },
      {
        header: 'status',
        field: 'status',
      },
    ];
    this.getRetirements();
  }

  getRetirements() {
    this.loadingService.show();
    return this.expenseManagementService.getRetirements().subscribe(
      (data) => {
        this.loadingService.hide();
        this.retirements = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  multipleDelete() {}

  showAddNew() {
    this.router.navigateByUrl('/expense-management/retirement');
  }

  exportItems() {}

  handleFileInput(files: FileList) {}

  editItem(item) {
    this.router.navigate(['/expense-management/retirement'], {
      queryParams: {
        id: item.requisitionPaymentId,
      },
    });
  }
}
