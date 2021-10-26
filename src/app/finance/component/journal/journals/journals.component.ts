import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';
import { GLService } from '../../../../core/services/gl.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { JournalService } from '../../../../core/services/journal.service';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.css'],
})
export class JournalsComponent implements OnInit {
  @Input('journals') journals: any[] = [];
  // @Output() multipleDeleteJournals = new EventEmitter();
  financialYearInformation: any[] = [];
  private fileToUpload: File;
  viewHeight: any = '600px';
  selectedJournalInformation: any[];
  constructor(
    private loadingService: LoadingService,
    private glService: GLService,
    private router: Router,
    private journalService: JournalService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllJournals();
  }

  showAddNew() {
    this.router.navigate(['/finance/addjournals']);
  }

  editGL(row) {
    this.router.navigate(['/finance/gl-info'], {
      queryParams: { editgl: row.glId },
    });
  }

  rowClicked(row: any): void {}

  deleteGL(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete user?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.glService.deleteGL(row.glId).subscribe((data) => {
            __this.loadingService.hide();
            if (data['result'] == true) {
              swal.fire('GOS FINANCIAL', 'User deleted successful.', 'success');
              __this.getAllJournals();
            } else {
              swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
            }
          });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  exportJournal() {
    // this.loadingService.show();
    // this.userAccountService.exportUsers().subscribe(response => {
    //     this.loadingService.hide();
    //     const data = response.result;
    //     if (data != undefined) {
    //         const byteString = atob(data);
    //         const ab = new ArrayBuffer(byteString.length);
    //         const ia = new Uint8Array(ab);
    //         for (let i = 0; i < byteString.length; i++) {
    //             ia[i] = byteString.charCodeAt(i);
    //         }
    //         const bb = new Blob([ab]);
    //         try {
    //             const file = new File([bb], 'users.xlsx', {
    //                 type: 'application/vnd.ms-excel'
    //             });
    //             saveAs(file);
    //         } catch (err) {
    //             const textFileAsBlob = new Blob([bb], {
    //                 type: 'application/vnd.ms-excel'
    //             });
    //             window.navigator.msSaveBlob(textFileAsBlob, 'users.xlsx');
    //         }
    //     }
    // });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadJournal() {
    if (this.fileToUpload == null) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
      return;
    }
    if (
      this.fileToUpload.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return swal.fire('GOS FINANCIAL', 'Only excel files allowed', 'error');
    }
  }
  getAllJournals() {
    this.loadingService.show();
    this.journalService.getAllJournals().subscribe((data) => {
      this.loadingService.hide();
      this.journals = data.journalEntry;
    });
  }
  multipleDelete() {
    if (this.selectedJournalInformation.length === 0) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
      return;
    }
    const tempData = this.selectedJournalInformation;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        const data = {
          targetId: el.journalEntryId,
        };
        targetIds.push(data);
      });
    }
    const body = {
      targetIds: targetIds,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.journalService.multipleDelete(body).subscribe(
            (data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                this.getAllJournals();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  passEntries() {
    this.loadingService.show();
    return this.journalService.passJournalEntries().subscribe(
      (res) => {
        const message = res.status.message.friendlyMessage;
        this.loadingService.hide();
        if (res.status.isSuccessful) {
          this.getAllJournals();
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          return swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  clearEntries() {
    this.loadingService.show();
    return this.journalService.clearEntries().subscribe(
      (data) => {
        const message = data.status.message.friendlyMessage;
        this.loadingService.hide();
        if (data.status.isSuccessful) {
          // this.getAllJournals();
          this.dataService.reloadJournals.emit();
          return swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          swal.fire('GOS FINANCIAL', message, 'success');
        }
      },
      (err) => {
        const message = err.status.message.friendlyMessage;
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }
}
