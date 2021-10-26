import { Component, OnInit, ViewChild } from '@angular/core';
import { ClassificationSetup, SearchColumn } from '../../../../models/models';
import { Router } from '@angular/router';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { LoadingService } from '../../../../core/services/loading.service';
import swal from 'sweetalert2';
import { DataService } from 'src/app/core/services/data.service';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-classification-list',
  templateUrl: './classification-list.component.html',
  styleUrls: ['./classification-list.component.css'],
})
export class ClassificationListComponent implements OnInit {
  //@ViewChild('fileInput') fileInput: File;
  @ViewChild('fileInput') fileInput: ElementRef;
  setUpLists: ClassificationSetup[] = [];
  selectedItem: ClassificationSetup[] = [];
  cols: SearchColumn[] = [];
  file: File;
  viewHeight: string = '600px';

  constructor(
    private router: Router,
    private expenseMgtService: ExpenseManagementService,
    private loadingService: LoadingService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
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
        header: 'expenseGLName',
        field: 'expenseGLName',
      },
      {
        header: 'payablesGLName',
        field: 'payablesGLName',
      },
    ];
    this.getClassifications();
  }
  getClassifications() {
    this.loadingService.show();
    this.expenseMgtService.getClassifications().subscribe(
      (res) => {
        this.loadingService.hide();
        this.setUpLists = res;
      },
      (err) => {
        this.loadingService.hide();
        console.log(err);
      }
    );
  }
  multipleDelete() {
    const payload = [];
    this.selectedItem.map((item) => payload.push(item.classificationsetupId));
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
            return this.expenseMgtService
              .deleteClassifications(payload)
              .subscribe(
                (response) => {
                  this.loadingService.hide();
                  const message = response['status'].message.friendlyMessage;
                  if (response['status'].isSuccessful) {
                    swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                      this.selectedItem = [];
                      this.getClassifications();
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

  showAddNew() {
    this.router.navigateByUrl('/expense-management/classification-setup');
  }

  exportItems() {

    this.loadingService.show();
    this.expenseMgtService.exportClassificationSetup().subscribe(
      (response) => {
        this.loadingService.hide();
        const data = response;
        return this.dataService.convertToFile('Classification Setup', data);
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
    return this.expenseMgtService
      .uploadClassificationSetup(this.file)
      .then((res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        this.fileInput.nativeElement.value = '';
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.getClassifications();
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
    this.router.navigate(['/expense-management/classification-setup'], {
      queryParams: {
        id: x.classificationsetupId,
      },
    });
  }
}
