import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../core/services/loading.service';
import { GLService } from '../../../../core/services/gl.service';
import { CompanyService } from '../../../../core/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { JournalService } from '../../../../core/services/journal.service';
import { DataService } from '../../../../core/services/data.service';
import { SubGLService } from '../../../../core/services/subgl.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-journal-form',
  templateUrl: './journal-form.component.html',
  styleUrls: ['./journal-form.component.css'],
})
export class JournalFormComponent implements OnInit {
  companyInformation: any[] = [];
  @ViewChild('fileInput') fileInput: any;
  form: FormGroup;
  formTitle: string = 'Journal Form';
  glInformation: any;
  journals: any[] = [];
  journalDate: any;
  companyId: any = 0;
  transactionType: any = '';
  journalType: any = '';
  glId: any;
  glName: any;
  amount: any;
  narration: any;
  glCode: any;
  glDetails: any = '';
  selectedJournalInformation: any[];
  totalCredit: number = 0;
  totalDebit: number = 0;
  disableFields: boolean;
  journalEntryId: number = 0;
  transactionReference: any;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private glService: GLService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private journalService: JournalService,
    private dataService: DataService,
    private subGLService: SubGLService
  ) {
    this.form = this.fb.group({
      companyId: [0],
      transReference: [''],
      transDate: ['', Validators.required],
      transType: ['', Validators.required],
      journalType: ['', Validators.required],
      glName: ['', Validators.required],
      glCode: ['', Validators.required],
      amount: ['', Validators.required],
      narration: ['', Validators.required],
    });
    this.dataService.reloadJournals.subscribe(() => {
      this.getAllJournals();
    });
  }
  generateRefNumber(length) {
    let result = '';
    let characters = '1234567890';
    let charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }
  ngOnInit() {
    this.getAllCompany();
    this.getAllJournals();
    this.getAllSubGL();
    if (this.journals == null) {
      return (this.journals = []);
    }
    this.generateRefNumber(10);
  }

  getAllCompany() {
    this.loadingService.show();
    this.companyService.getAllCompanyStructure().subscribe(
      (data) => {
        this.loadingService.hide();
        this.companyInformation = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getAllSubGL() {
    this.loadingService.show();
    this.subGLService.getAllSubGL().subscribe((data) => {
      this.loadingService.hide();
      this.glInformation = data.subGls;
    });
  }
  getAllJournals() {
    this.loadingService.show();
    this.journalService.getAllJournals().subscribe((data) => {
      this.loadingService.hide();
      if (data.totalJournal == null) {
        this.journals = [];
        this.totalDebit = 0;
        this.totalCredit = 0;
      } else {
        this.journals = data.totalJournal.journal;
        this.totalCredit = data.totalJournal.totalCredit;
        this.totalDebit = data.totalJournal.totalDebit;
      }
    });
  }
  editJournal(row) {
    this.formTitle = 'Edit Journal Information';
    this.journalEntryId = row.journalEntryId;
    this.companyId = row.companyId;
    this.journalDate = new Date(row.journalDate);
    this.transactionType = row.transactionType;
    this.journalType = row.journalType;
    this.glId = row.glId;
    this.glName = row.glName;
    this.amount = row.amount;
    this.narration = row.narration;
  }

  // goBack() {
  //     this.router.navigate(["/finance/gl-list"]);
  // }
  getGlCodeName(event: any) {
    this.glId = event.subGLId;
    this.glCode = event.subGLCode;
    this.glName = event.glName;
  }
  submitJournal() {
    const payload = {
      transactionReference: this.transactionReference,
      companyId: parseInt(this.companyId),
      journalDate: this.formatDate(this.journalDate),
      transactionType: parseInt(this.transactionType),
      journalType: this.journalType,
      glId: parseInt(this.glId),
      glName: this.glName,
      amount: parseFloat(this.amount),
      narration: this.narration,
    };
    if (!payload.companyId) {
      return swal.fire('GOS FINANCIAL', 'Select company', 'error');
    }
    if (!payload.journalDate) {
      return swal.fire('GOS FINANCIAL', 'Select Date', 'error');
    }
    if (!payload.transactionType) {
      return swal.fire('GOS FINANCIAL', 'Select transaction type', 'error');
    }
    if (!payload.journalType) {
      return swal.fire('GOS FINANCIAL', 'Select journal type', 'error');
    }
    if (!this.glDetails) {
      return swal.fire('GOS FINANCIAL', 'Select GL', 'error');
    }
    if (!payload.amount) {
      return swal.fire('GOS FINANCIAL', 'Enter amount', 'error');
    }
    if (payload.amount == 0) {
      return swal.fire(
        'GOS FINANCIAL',
        'Amount must be greater than 0',
        'error'
      );
    }
    if (isNaN(payload.amount)) {
      return swal.fire('GOS FINANCIAL', 'Only numbers allowed', 'error');
    }
    if (!payload.narration) {
      return swal.fire('GOS FINANCIAL', 'Enter transaction narration', 'error');
    }
    this.loadingService.show();
    this.journalService.updateJournal(payload).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.isSuccessful;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.disableFields = true;
          this.getAllJournals();
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.isSuccessful;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }
  getGLByCompany(companyId) {
    this.loadingService.show();
    this.glService.getGLByCompany(companyId).subscribe((data) => {
      this.loadingService.hide();
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
        targetIds.push(el.journalEntryId);
      });
    }
    const body = {
      ids: targetIds,
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
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                this.getAllJournals();
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  passEntries() {
    const __this = this;
    if (this.totalCredit !== this.totalDebit) {
      return swal.fire(
        'GOS FINANCIAL',
        'The total credit and debit transactions must balance',
        'error'
      );
    }
    swal
      .fire({
        title: 'Are you sure you want to pass the records?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.journalService.passJournalEntries().subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                this.getAllJournals();
                this.generateRefNumber(10);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              const message = err.status.message.friendlyMessage;
              this.loadingService.hide();
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  clearEntries() {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to clear the records?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.journalService.clearEntries().subscribe(
            (data) => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                this.getAllJournals();
                this.generateRefNumber(10);
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  exportJournals() {
    this.loadingService.show();
    this.journalService.exportJournals().subscribe((response) => {
      this.loadingService.hide();
      const data = response.export;
      if (data != undefined) {
        const byteString = atob(data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const bb = new Blob([ab]);
        try {
          const file = new File([bb], 'Journals.xlsx', {
            type: 'application/vnd.ms-excel',
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel',
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'Journals.xlsx');
        }
      }
    });
  }

  formatDate(date) {
    let dateObj = new Date(date),
      month = '' + (dateObj.getMonth() + 1),
      day = '' + dateObj.getDate(),
      year = '' + dateObj.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
