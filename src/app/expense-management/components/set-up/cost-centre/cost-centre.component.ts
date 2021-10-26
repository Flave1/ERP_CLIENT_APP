import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { CompanyService } from '../../../../core/services/company.service';

@Component({
  selector: 'app-cost-centre',
  templateUrl: './cost-centre.component.html',
  styleUrls: ['./cost-centre.component.css'],
})
export class CostCentreComponent implements OnInit {
  form: FormGroup;
  formTitle: string = 'Add Cost Centre';
  structures: Array<any> = [];
  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private expenseManagementService: ExpenseManagementService,
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      const id = +param.id;
      if (id) {
        this.getCostCentre(id);
      }
    });
    this.form = this.fb.group({
      costCenterId: [0],
      name: [''],
      description: [''],
      structures: [],
    });
    this.getCompanyStructures();
  }

  getCompanyStructures() {
    this.loadingService.show();
    return this.companyService.getAllCompanyStructure().subscribe(
      (data) => {
        this.loadingService.hide();
        this.structures = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getCostCentre(id: number) {
    this.formTitle = 'Edit Cost Centre';
    this.loadingService.show();
    return this.expenseManagementService.getCostCentre(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.form.patchValue({
          costCenterId: data.costCenterId,
          name: data.name,
          description: data.description,
          structures: data.structures,
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  submitInfo(form: FormGroup) {
    const payload = form.value;
    payload.structure = +payload.structure;
    this.loadingService.show();
    return this.expenseManagementService.addCostCentre(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res['status'].message.friendlyMessage;
        if (res['status'].isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.router.navigateByUrl('/expense-management/cost-centre-list');
          });
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err['status'].message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  goBack() {
    this.router.navigateByUrl('/expense-management/cost-centre-list');
  }
}
