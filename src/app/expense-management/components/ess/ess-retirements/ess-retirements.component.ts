import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';

@Component({
  selector: 'app-ess-retirements',
  templateUrl: './ess-retirements.component.html',
  styleUrls: ['./ess-retirements.component.css'],
})
export class EssRetirementsComponent implements OnInit {
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
        header: 'account',
        field: 'balance',
      },
    ];
    this.getRetirements();
  }
  getRetirements() {
    this.loadingService.show();
    return this.expenseManagementService.getEssRetirements().subscribe(
      (data) => {
        this.loadingService.hide();
        this.retirements = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  editItem(item) {
    this.router.navigate(['/expense-management/ess-retirement'], {
      queryParams: {
        id: item.requisitionPaymentId,
      },
    });
  }
}
