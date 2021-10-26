import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { LoadingService } from '../../../core/services/loading.service';
import { EndOfDayService } from '../../../core/services/end-of-day.service';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IfrsService } from '../../../core/services/ifrs.service';

@Component({
  selector: 'app-run-impairments',
  templateUrl: './run-impairments.component.html',
  styleUrls: ['./run-impairments.component.css'],
})
export class RunImpairmentsComponent implements OnInit {
  displayImpairment = false;
  impairmentData: any;
  includePastDue: boolean = false;
  viewHeight: string = '600px';
  form: FormGroup;
  setupDataList: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private endOfDayService: EndOfDayService,
    private ifrsService: IfrsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      ccf: [''],
      classification_Type: [''],
      deteroriation_Level: [''],
      groupBased: [''],
      historical_PD_Year_Count: [''],
      ltpdapproach: [''],
      pdBasis: [''],
      runDate: [null],
      threshold: [''],
    });
    this.getAllSetupData();
    this.getImpairment(this.includePastDue);
  }
  getAllSetupData() {
    this.loadingService.show();
    this.ifrsService.getAllIFRSSetupData().subscribe(
      (data) => {
        this.loadingService.hide();
        const row = data.setUpData[0];
        this.form = this.fb.group({
          setUpId: [row.setUpId],
          ccf: [row.ccf],
          runDate: [new Date(row.runDate)],
          historical_PD_Year_Count: [row.historical_PD_Year_Count],
          classification_Type: [row.classification_Type],
          deteroriation_Level: [row.deteroriation_Level],
          groupBased: [row.groupBased],
          ltpdapproach: [row.ltpdapproach],
          pdBasis: [row.pdBasis],
          threshold: [row.threshold],
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getImpairment(pastDue): void {
    this.loadingService.show();
    this.endOfDayService.getImpairment(pastDue).subscribe(
      (data) => {
        this.displayImpairment = true;
        this.impairmentData = data.impairment;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  setValue(value: any) {
    console.log('value', value);
    this.includePastDue = value;
  }

  runImpairment() {
    // console.log(this.includePastDue);
    // return;
    const loading = this.loadingService;
    const srv = this.loadingService;
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to run Impairment?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.endOfDayService.runImpairment().subscribe(
            (data) => {
              __this.loadingService.hide();
              if (data.status.isSuccessful) {
                this.getImpairment(this.includePastDue);
                // swal.fire('GOS FINANCIAL', data.message, 'success');
                this.displayImpairment = true;
              } else {
                this.getImpairment(this.includePastDue);
                // swal.fire('GOS FINANCIAL', data.message, 'success');
                this.displayImpairment = true;
                //swal.fire('GOS FINANCIAL', data.status.message.friendlyMessage, 'error');
              }
            },
            (err) => {
              const message = err.status.message.friendlyMessage;
              this.loadingService.hide();
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          this.loadingService.hide();
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  exportData() {
    this.loadingService.show();
    this.endOfDayService.exportImpairment().subscribe(
      response => {
        this.loadingService.hide();
        let data = response.export;
        if (data != undefined) {
          let byteString = atob(data);
          let ab = new ArrayBuffer(byteString.length);
          let ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          let bb = new Blob([ab]);
          try {
            let file = new File([bb], "Impairments.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            let textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Impairments.xlsx");
          }
        }
      },
      err => {
        return this.loadingService.hide();
      }
    );
  }

  updateDate(value: any) {
    const payload = this.form.value;
    payload.runDate = this.formatDate(value);
    this.loadingService.show();
    this.ifrsService.updateIFRSSetupData(payload).subscribe(
      (data) => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
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
