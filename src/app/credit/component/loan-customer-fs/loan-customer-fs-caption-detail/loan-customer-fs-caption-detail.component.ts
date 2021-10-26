import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/core/services/loading.service';
import { CustomerFsService } from 'src/app/core/services/customer-fs.service';
import swal from 'sweetalert2';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-loan-customer-fs-caption-detail',
  templateUrl: './loan-customer-fs-caption-detail.component.html',
})
export class LoanCustomerFsCaptionDetailComponent implements OnInit {
  @Output() showSection = new EventEmitter<any>();
  fsCaptionGroups: any = null;
  fsRatioValueTableCols: any[];
  fsRatiosTableCols: any[];
  fsRatioValueData: any[] = [];
  fsCaptionRatios: any[] = [];
  mappedFSCaptionDetailTableData: any;
  custGrpTableData: any[] = [];
  customerTableCols: any[];
  custGrpTableCols: any[];
  customerModel: any;
  custGrpModel: any;
  customerFsCaptionGroups: any[];
  unMappedFsCaptionsTableData: any[] = [];
  unMappedFsCaptionsTableCols: any[];
  mappedFSCaptionTableData: any[] = [];
  mappedFSCaptionTableCols: any[];
  selectedUnmappedFsCaption: any;
  selectedMappedFsCaption: any;
  multiple?: number;
  searchQuery: string;
  selectedDate: Date;
  selectedCaptionGroup: any;
  selectedUnmappedFsCaptionIndex: number;
  selectedFsCaptionId: number;

  displayCreateEditModal = false;
  displayCustomerResults = false;
  displayUnmappedCustomerFsCaption = false;
  displayfsCaptionDetailModal = false;
  displayMappedCaptions = false;
  hideCaptionDetails = false;

  setCaptionAmountsForm: FormGroup;
  unMappedCaptionsForm: FormGroup;

  activeIndex = 0;
  rowGroupMetadata: any;
  searchFormObj: any;
  captionGrpId = 0;
  _customerId: any;
  @Input() displayFinancialStatement: boolean = false;
  @Input('canDoFinancialStatementEntry') canDoFinancialEntry: boolean = false;
  @Input() viewCustomerFinancialStatement: boolean = false;

  @Input() set customerId(value: number) {
    if (value > 0) {
      this._customerId = value;
      this.getCustomerDetails(value);
    }
  }

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private customerFsService: CustomerFsService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getAllFSCaptionGroups();
    this.getCustomerDetails(this._customerId);
  }

  initializeForm() {
    this.setCaptionAmountsForm = this.fb.group({
      customerId: [''],
      fsCaptionId: [''],
      fsDate: [''],
      amount: ['', [Validators.required]],
    });
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.fsRatioValueData) {
      for (let i = 0; i < this.fsRatioValueData.length; i++) {
        let rowData = this.fsRatioValueData[i];
        let fsGroupCaption = rowData.fsGroupCaption;
        if (i == 0) {
          this.rowGroupMetadata[fsGroupCaption] = {
            index: 0,
            size: 1,
          };
        } else {
          let previousRowData = this.fsRatioValueData[i - 1];
          let previousRowGroup = previousRowData.fsGroupCaption;
          if (fsGroupCaption === previousRowGroup)
            this.rowGroupMetadata[fsGroupCaption].size++;
          else
            this.rowGroupMetadata[fsGroupCaption] = {
              index: i,
              size: 1,
            };
        }
      }
    }
  }
  getAllFSCaptionGroups() {
    this.customerFsService
      .getAllCustomerFSCaptionGroupWithoutRatio()
      .subscribe((data) => {
        this.customerFsCaptionGroups = data.loanCustomerFSGroup;
      });
  }

  getMappedFsCaptionsDetails(customerId) {
    this.displayMappedCaptions = false;
    this.customerFsService
      .getFSCaptionDetailByCustomerId(customerId)
      .subscribe((data) => {
        this.mappedFSCaptionDetailTableData = data.result;
        this.displayMappedCaptions = true;
        this.loadingService.hide();
      });
  }

  getCustomerDetails(customerId) {
    this.loadingService.show();
    if (customerId != undefined) {
      this.getAllFSCaptionGroups();
      this.getMappedFsCaptionsDetails(customerId);
      this.getCustomerFSRatioValue(customerId);
      this.getCustomerRatioCalculation(customerId);
    }
    this.loadingService.hide();
  }

  getCustomerRatioCalculation(customerId) {
    this.fsCaptionRatios = [];
    this.customerFsService
      .getCustomerFSRatioCalculations(customerId)
      .subscribe((data) => {
        this.fsCaptionRatios = data.loanCustomerFSRatioCalculation;
        if (this.fsCaptionRatios.length > 0) {
          let fsDate1 =
            this.fsCaptionRatios[0].fsDate1 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsCaptionRatios[0].fsDate1).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';
          let fsDate2 =
            this.fsCaptionRatios[0].fsDate2 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsCaptionRatios[0].fsDate2).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';
          let fsDate3 =
            this.fsCaptionRatios[0].fsDate3 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsCaptionRatios[0].fsDate3).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';
          let fsDate4 =
            this.fsCaptionRatios[0].fsDate4 != '1900-01-01T00:00:00+01:00'
              ? new Date(this.fsCaptionRatios[0].fsDate4).toLocaleDateString(
                  'en-GB'
                )
              : 'N/A';

          this.fsRatiosTableCols = [
            { field: 'ratio1', header: fsDate1 },
            { field: 'ratio2', header: fsDate2 },
            { field: 'ratio3', header: fsDate3 },
            { field: 'ratio4', header: fsDate4 },
          ];
        }
      });
  }

  getCustomerFSRatioValue(customerId) {
    this.fsRatioValueData = [];
    this.customerFsService
      .getCustomerFSRatioValue(customerId)
      .subscribe((data) => {
        if (data.loanCustomerFSRatioCaptionReport != null) {
          this.fsRatioValueData = data.loanCustomerFSRatioCaptionReport;
          this.dataService.showSection.emit({ fsValue: this.fsRatioValueData });
          if (this.fsRatioValueData.length > 0) {
            let fsDate1 =
              this.fsRatioValueData[0].fsDate1 != '1900-01-01T00:00:00+01:00'
                ? new Date(this.fsRatioValueData[0].fsDate1).toLocaleDateString(
                    'en-GB'
                  )
                : 'N/A';
            let fsDate2 =
              this.fsRatioValueData[0].fsDate2 != '1900-01-01T00:00:00+01:00'
                ? new Date(this.fsRatioValueData[0].fsDate2).toLocaleDateString(
                    'en-GB'
                  )
                : 'N/A';
            let fsDate3 =
              this.fsRatioValueData[0].fsDate3 != '1900-01-01T00:00:00+01:00'
                ? new Date(this.fsRatioValueData[0].fsDate3).toLocaleDateString(
                    'en-GB'
                  )
                : 'N/A';
            let fsDate4 =
              this.fsRatioValueData[0].fsDate4 != '1900-01-01T00:00:00+01:00'
                ? new Date(this.fsRatioValueData[0].fsDate4).toLocaleDateString(
                    'en-GB'
                  )
                : 'N/A';

            this.fsRatioValueTableCols = [
              { field: 'ratioValue1', header: fsDate1 },
              { field: 'ratioValue2', header: fsDate2 },
              { field: 'ratioValue3', header: fsDate3 },
              { field: 'ratioValue4', header: fsDate4 },
            ];
          }
        } else {
          this.dataService.showSection.emit({ showValue: false });
        }
      });
    this.updateRowGroupMetaData();
  }
  showAddNewMapping() {}

  getMappedFsCaptions(formObj) {
    formObj.fsCaptionGroupId = parseInt(formObj.fsCaptionGroupId);
    formObj.customerId = parseInt(formObj.customerId);
    this.displayMappedCaptions = false;

    this.customerFsService.getFSCaptionDetailByCustomer(formObj).subscribe(
      (data) => {
        this.mappedFSCaptionTableData = data.loanCustomerFSCaptionDetail;
        this.displayMappedCaptions = true;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getUnmappedFsCaptions(formObj) {
    let unmapped = [];
    formObj.fsCaptionGroupId = parseInt(formObj.fsCaptionGroupId);
    formObj.customerId = parseInt(formObj.customerId);
    this.customerFsService
      .getUnmappedCustomerFSCaption(formObj)
      .subscribe((data) => {
        this.unMappedFsCaptionsTableData = data.loanCustomerFSCaption;
        this.loadingService.hide();
      });
  }
  createCustomerFsMap(index, evt) {
    evt.preventDefault();
    this.displayCreateEditModal = true;
    this.selectedUnmappedFsCaptionIndex = index;
    this.selectedUnmappedFsCaption = this.unMappedFsCaptionsTableData[index];
  }
  removeCustomerFsMap(index, evt) {
    evt.preventDefault();

    const selectedFsCaption = this.mappedFSCaptionTableData[index];
    this.selectedFsCaptionId = selectedFsCaption.fsDetailId;

    this.customerFsService
      .deleteCustomerFSCaptionDetail(this.selectedFsCaptionId)
      .subscribe((reponse) => {
        this.loadingService.hide();
        if (reponse.deleted) {
          this.getUnmappedFsCaptions(this.searchFormObj);
          this.mappedFSCaptionTableData.splice(index, 1);
          this.getMappedFsCaptionsDetails(this._customerId);
          this.getCustomerFSRatioValue(this._customerId);
        }
        this.initializeForm();
      });
  }
  onCaptionDateSelect(fsCaptionDate) {
    this.loadingService.show();
    var dateStr = new Date(fsCaptionDate);

    if (this.captionGrpId > 0) {
      this.searchFormObj = {
        fsCaptionGroupId: this.captionGrpId,
        customerId: this._customerId,
        fsDate: this.formatDate(fsCaptionDate),
      };

      this.getUnmappedFsCaptions(this.searchFormObj);
      this.getMappedFsCaptions(this.searchFormObj);
    }
    this.loadingService.hide();
  }
  onFSCaptionGroupSelect(fsCaptionGrpId) {
    this.loadingService.show();
    var dateStr = new Date(this.selectedDate);

    this.searchFormObj = {
      fsCaptionGroupId: fsCaptionGrpId,
      customerId: this._customerId,
      fsDate: this.formatDate(this.selectedDate),
    };
    this.fsCaptionGroups = fsCaptionGrpId;
    this.captionGrpId = this.searchFormObj.fsCaptionGroupId;

    this.getUnmappedFsCaptions(this.searchFormObj);
    this.getMappedFsCaptions(this.searchFormObj);
    this.loadingService.hide();
  }
  onTabChange(e) {
    this.activeIndex = e.index;
  }

  openNext() {
    this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
  }

  openPrev() {
    this.activeIndex = this.activeIndex === 0 ? 2 : this.activeIndex - 1;
  }
  submitForm(formObj) {
    var dateStr = new Date(this.selectedDate);
    const body = {
      fSDetailId: 0,
      customerId: parseInt(this._customerId),
      fSCaptionId: parseInt(this.selectedUnmappedFsCaption.fsCaptionId),
      fSDate: this.formatDate(this.selectedDate),
      amount: parseInt(formObj.value.amount),
    };

    const unmappedIndex = this.unMappedFsCaptionsTableData.findIndex(
      (item) => item.fSCaptionId === this.selectedUnmappedFsCaption.fSCaptionId
    );

    // return;
    this.loadingService.show();
    this.customerFsService.addUpdateFSCaptionDetail(body).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data.status.isSuccessful == true) {
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'success'
          );
          this.setCaptionAmountsForm.reset();
          this.getCustomerDetails(this._customerId);
          this.getMappedFsCaptionsDetails(this._customerId);
          this.getMappedFsCaptions(this.searchFormObj);
          this.unMappedFsCaptionsTableData.splice(unmappedIndex, 1);
          this.displayCreateEditModal = false;
        } else {
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'error'
          );
        }
      },
      (err) => {
        this.loadingService.hide();
        swal.fire('GOS FINANCIAL', JSON.stringify(err), 'error');
      }
    );
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
