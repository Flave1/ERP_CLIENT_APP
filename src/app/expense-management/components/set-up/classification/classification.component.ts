import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubGLService } from '../../../../core/services/subgl.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.css'],
})
export class ClassificationComponent implements OnInit {
  formTitle: string = 'Classfication Set up';
  form: FormGroup;
  glArr: Array<[]> = [];
  constructor(
    private fb: FormBuilder,
    private subGlService: SubGLService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private expenseMgtService: ExpenseManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      classificationsetupId: [0],
      name: [''],
      description: [''],
      expenseGL: [''],
      payablesGL: [''],
    });
    this.route.queryParams.subscribe((param) => {
      const id: number = param.id;
      if (id !== undefined) {
        this.getClassification(id);
      }
    });
    this.getGls();
  }

  getGls(): Subscription {
    this.loadingService.show();
    return this.subGlService.getAllSubGL().subscribe(
      (data) => {
        this.loadingService.hide();
        this.glArr = data.subGls.map((item) => ({
          label: `${item.subGLName} | ${item.subGLCode}`,
          value: item.subGLId,
        }));
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getClassification(id) {
    this.formTitle = 'Edit Classification';
    this.loadingService.show();
    this.expenseMgtService.getClassification(id).subscribe(
      (res) => {
        this.loadingService.hide();
        const classification = res;
        this.form.patchValue({
          classificationsetupId: classification.classificationsetupId,
          name: classification.name,
          description: classification.description,
          expenseGL: classification.expenseGL,
          payablesGL: classification.payablesGL,
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  submitInfo(form) {
    const payload = form.value;
    console.log(payload);
    this.loadingService.show();
    return this.expenseMgtService.addClassification(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res['message'].friendlyMessage;
        if (res['isSuccessful']) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.router.navigateByUrl(
              '//expense-management/classification-setup-list'
            );
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

  goBack() {
    this.router.navigateByUrl('/expense-management/classification-setup-list');
  }
}
