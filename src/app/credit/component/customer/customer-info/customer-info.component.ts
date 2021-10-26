import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonService } from '../../../../core/services/common.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { UserAccountService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
})
export class CustomerInfoComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() displayIndividualCustomer: boolean;
  @Input() displayCorperatCustomer: boolean;
  employerTypeList: any[] = [];
  countryInformation: any[] = [];
  martialStatusList: any[] = [];
  genderList: any[] = [];
  staffList: any[] = [];
  @Input() nameDate: string;
  @Input() name: string;
  @Output() customerTypeChange = new EventEmitter();
  titleList: any[] = [];
  constructor(
    private commonService: CommonService,
    private loadingService: LoadingService,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit(): void {
    this.getTitles();
    this.loadDropDown();
    this.getStaffList();
  }
  onCustomerTypeChange(value) {
    this.customerTypeChange.emit(value);
  }
  loadDropDown() {
    this.commonService.getAllGender().subscribe((data) => {
      this.genderList = data['commonLookups'];
    });
    this.commonService.getAllMaritalStatus().subscribe((data) => {
      this.martialStatusList = data['commonLookups'];
    });

    this.commonService.getAllEmployerType().subscribe((data) => {
      this.employerTypeList = data['commonLookups'];
    });
    this.commonService.getAllCity().subscribe((data) => {
      // this.cityList = data['commonLookups'];
    });
    this.commonService.getAllCountry().subscribe((data) => {
      this.countryInformation = data['commonLookups'];
    });
    // this.commonService.getAllDirectorType().subscribe(data => {
    //   // this.directorTypeList = data["commonLookups"];
    // });
  }
  getTitles() {
    this.commonService.getAllTitle().subscribe((data) => {
      this.titleList = data['commonLookups'];
    });
  }
  getStaffList() {
    this.loadingService.show();
    this.userAccountService.getStaffList().subscribe(
      (data) => {
        this.loadingService.hide();
        if (data.staff != null) {
          this.staffList = data.staff;
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
}
