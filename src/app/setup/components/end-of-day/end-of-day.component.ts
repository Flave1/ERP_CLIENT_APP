import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import swal from 'sweetalert2';
import { EndOfDayService } from 'src/app/core/services/end-of-day.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CountryService } from 'src/app/core/services/country.service';
import { DatePipe } from '@angular/common';
import { WorkflowService } from '../../../core/services/workflow.service';
import { saveAs } from 'file-saver';
import { TrialBalanceService } from 'src/app/core/services/trialbalance.service';
@Component({
  selector: 'app-end-of-day',
  templateUrl: './end-of-day.component.html',
})
export class EndOfDayComponent implements OnInit {
  fileToUpload: File;
  @ViewChild('fileInput') fileInput: any;
  publicHolidays: any[];
  endOfDay: any[];
  impairmentData: any[];
  selectedId: number = null;
  viewHeight: any = '600px';
  formTitle = 'New Public Holiday';
  holidayForm: FormGroup;
  eodForm: FormGroup;
  nextCurrentDate: Date;
  myFormattedDate: any;
  // pipe:any;
  displayAddModal = false;

  countries: any[];
  currentDate: Date = new Date();
  show = false;
  message: any;
  title: any;
  cssClass: any;
  EndOfDayData: any[];
  activeIndex = 0;
  notSelected = true;
  selected: any = {};
  id: any;
  endofPeriod: any[];
  financialYearId: any;
  applicationDate: Date;
  constructor(
    public fb: FormBuilder,
    private loanService: LoanService,
    private loadingService: LoadingService,
    private endOfDayService: EndOfDayService,
    private trialBalance: TrialBalanceService,
    private countryService: CountryService,
    private pipe: DatePipe,
    private workflowService: WorkflowService
  ) {
    this.holidayForm = this.fb.group({
      publicHolidayId: [0],
      holidayDate: [new Date(), Validators.required],
      description: ['', Validators.required],
      countryId: ['', Validators.required],
    });
    this.eodForm = this.fb.group({});
  }

  ngOnInit() {
    this.getnextApplicationDate();
    this.getAllPublicHoliday();
    this.getAllEOP();
    // this.getEndOfDay();
    this.getCountries();
    this.getApplicationDate();
    // this. getImpairment();
  }
  getApplicationDate() {
    return this.endOfDayService.getApplicationDate().subscribe((data) => {
      this.applicationDate = data;
    });
  }
  clearControls() {
    //   this.selectedId = null;
    this.holidayForm = this.fb.group({
      publicHolidayId: [''],
      holidayDate: [new Date(), Validators.required],
      description: ['', Validators.required],
      countryId: ['', Validators.required],
    });

    this.eodForm = this.fb.group({
      eodDate: [new Date(), Validators.required],
    });
  }

  getCountries() {
    this.countryService.getAllCountry().subscribe((data) => {
      this.countries = data['result'];
    });
  }

  getAllPublicHoliday(): void {
    this.loadingService.show();
    this.endOfDayService.getAllPublicHoliday().subscribe(
      (data) => {
        this.publicHolidays = data['result'];
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  exportEoP(period) {
    this.loadingService.show();
    this.trialBalance.exportEOP(period).subscribe((response) => {
      this.loadingService.hide();
      let data = response.export;
      if (data != undefined) {
        var byteString = atob(data);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);
        try {
          var file = new File([bb], 'eop.xlsx', {
            type: 'application/vnd.ms-excel',
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel',
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'eop.xlsx');
        }
      }
    });
  }

  getAllEOP(): void {
    this.loadingService.show();
    this.trialBalance.getEop().subscribe(
      (data) => {
        this.endofPeriod = data.eop;
        this.financialYearId = data.eop.financialYearId;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  runEoP(period) {
    const __this = this;
    __this.loadingService.hide();
    swal
      .fire({
        title: 'Are you sure you want to this process?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        this.loadingService.show();
        if (result.value) {
          __this.trialBalance.runEop(period).subscribe((data) => {
            this.loadingService.hide();
            if (data.status.isSuccessful) {
              swal.fire(
                'GOS FINANCIAL',
                data.status.message.friendlyMessage,
                'success'
              );
              __this.notSelected = true;
              __this.activeIndex = 2;
              this.getAllEOP();
              // __this.selected = {};
            } else {
              swal.fire(
                'GOS FINANCIAL',
                data.status.message.friendlyMessage,
                'error'
              );
            }
          });
        } else {
          this.loadingService.hide();
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  getnextApplicationDate(): void {
    this.loadingService.show();
    this.endOfDayService.getnextApplicationDate().subscribe(
      (data) => {
        this.nextCurrentDate = data['result'];
        this.myFormattedDate = this.pipe.transform(
          this.nextCurrentDate,
          'dd-MM-yyyy'
        );
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getEndOfDay(): void {
    this.loadingService.show();
    this.endOfDayService.getEndOfDay().subscribe(
      (data) => {
        this.endOfDay = data['result'];
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  isProcessInStarted = false;

  // getAllLoanCollateral(loanApplicationId) {
  //     this.collateralService
  //         .getLoanCollateral(loanApplicationId)
  //         .subscribe(data => {
  //             this.loanCollaterals = data["result"];
  //         });
  // }
  onTabChange(e) {
    this.activeIndex = e.index;
    if (this.activeIndex == 1) {
      this.notSelected = true;
      this.selected = {};
    }
  }

  showAddModal() {
    this.clearControls();
    this.formTitle = 'New Public Holiday';
    this.displayAddModal = true;
  }

  openNext() {
    this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 2 : this.activeIndex - 1;
    if (this.activeIndex == 1) {
      this.notSelected = true;
    }
  }

  runEod() {
    const loading = this.loadingService;
    const srv = this.loadingService;
    const data = {
      date: new Date(),
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to run this process?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.endOfDayService.runEodOperation().subscribe((data) => {
            __this.loadingService.hide();
            if (data.status.isSuccessful) {
              swal.fire(
                'GOS FINANCIAL',
                data.status.message.friendlyMessage +
                  '\n' +
                  ' New Application date: ' +
                  data.applicationDate,
                'success'
              );
              __this.notSelected = true;
              __this.activeIndex = 0;
              // __this.selected = {};
            } else {
              swal.fire(
                'GOS FINANCIAL',
                data.status.message.friendlyMessage,
                'error'
              );
            }
          });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  isWeekendProcessStarted = false;
  loadWeekends() {
    const data = {
      holidayDate: new Date(),
    };

    this.loadingService.show();
    this.isWeekendProcessStarted = true;

    this.endOfDayService.loanYearWeekends(data).subscribe(
      (res) => {
        if (res.success == true) {
          this.loadingService.hide();
        } else {
          this.loadingService.hide();
        }
        this.isWeekendProcessStarted = false;
      },
      (err: any) => {
        this.loadingService.hide();
      }
    );
    this.isWeekendProcessStarted = false;
  }

  submitForm(formObj) {
    const body = {
      publicHolidayId: formObj.value.publicHolidayId,
      holidayDate: formObj.value.holidayDate,
      countryId: formObj.value.countryId,
      description: formObj.value.description,
    };

    this.loadingService.show();

    this.endOfDayService.save(body).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data['result'] == true) {
          swal.fire('GOS FINANCIAL', data['message'], 'success');
          this.getAllPublicHoliday();
          this.displayAddModal = false;
        } else {
          swal.fire('GOS FINANCIAL', data['message'], 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', JSON.stringify(err), 'error');
      }
    );
  }

  editHoliday(index) {
    // this.formTitle = "Edit Public Holiday";
    // var row = this.publicHolidays[index];
    // this.selectedId = index.publicHolidayId;
    //this.loadingService.show();
    // this.endOfDayService.getPublicHoliday(index.publicHolidayId).subscribe(data => {
    //     this.loadingService.hide();
    const row = index;

    this.holidayForm = this.fb.group({
      publicHolidayId: row.publicHolidayId,
      holidayDate: new Date(row.holidayDate),
      countryId: row.countryId,
      description: row.description,
    });
    // });
    this.displayAddModal = true;
  }

  deletePublicHoliday(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete item?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.endOfDayService
            .delete(row.publicHolidayId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                __this.getAllPublicHoliday();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  resetButton(value) {}
  exportWorkflowLevel() {
    // this.loadingService.show();
    // this.workflowService.exportWorkflowLevel().subscribe(response => {
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
    //             const file = new File([bb], 'WorkflowLevel.xlsx', {
    //                 type: 'application/vnd.ms-excel'
    //             });
    //             saveAs(file);
    //         } catch (err) {
    //             const textFileAsBlob = new Blob([bb], {
    //                 type: 'application/vnd.ms-excel'
    //             });
    //             window.navigator.msSaveBlob(
    //                 textFileAsBlob,
    //                 'WorkflowLevel.xlsx'
    //             );
    //         }
    //     }
    // });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  uploadWorkflowLevel() {
    // if (this.fileToUpload == null) {
    //     swal.fire(
    //         'GOS FINANCIAL',
    //         'Please select upload document to continue',
    //         'error'
    //     );
    //     return;
    // }
    // this.workflowService.uploadWorkflowLevel(this.fileToUpload).then(
    //     data =>
    //     error => {
    //
    //         this.fileToUpload == null;
    //         this.getAllWorkflowLevel();
    //         this.fileInput.nativeElement.value = '';
    //     }
    // );
  }
  multipleDelete() {
    if (this.selected.length == 0) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
      return;
    }
    const tempData = this.selected;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        targetIds.push(el.publicHolidayId);
      });
    }
    // const body = {
    //     targetIds: targetIds
    // };
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

          __this.endOfDayService
            .multipleHolidayDelete(targetIds)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                __this.getAllPublicHoliday();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
}
