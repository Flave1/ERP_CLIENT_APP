import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../core/services/loading.service';
import { EndOfDayService } from '../../../core/services/end-of-day.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-eod-setup',
  templateUrl: './eod-setup.component.html',
  styleUrls: ['./eod-setup.component.css'],
})
export class EodSetupComponent implements OnInit {
  formTitle: string = 'End of Day Set up';
  form: FormGroup;
  timeOfDay: any[] = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
    {
      id: 7,
    },
    {
      id: 8,
    },
    {
      id: 9,
    },
    {
      id: 10,
    },
    {
      id: 11,
    },
    {
      id: 12,
    },
  ];
  meridiem: any[] = [
    {
      value: 'am',
      label: 'AM',
    },
    {
      value: 'pm',
      label: 'PM',
    },
  ];
  runAutomatically: boolean;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private eodService: EndOfDayService
  ) {}

  ngOnInit() {
    this.initialiseForm();
    this.getEod();
  }
  initialiseForm() {
    this.form = this.fb.group({
      eodSetupId: [0],
      shouldRunAutomatically: [false],
      whenToRun: [0],
      meridiem: [''],
    });
  }

  // get eod
  getEod() {
    this.loadingService.show();
    return this.eodService.getEod().subscribe(
      (data) => {
        this.loadingService.hide();
        const row = data.eods[0];
        this.form.patchValue({
          eodSetupId: row.eodSetupId,
          shouldRunAutomatically: row.shouldRunAutomatically,
          whenToRun: row.whenToRun,
          meridiem: row.meridiem,
        });
        this.runAutomatically = row.shouldRunAutomatically;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getValue(event) {
    this.runAutomatically = event.target.checked;
  }

  submit(form: FormGroup) {
    const payload = form.value;
    payload.whenToRun = +payload.whenToRun;
    this.loadingService.show();
    return this.eodService.saveEodSetup(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            // this.initialiseForm();
          });
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
}
