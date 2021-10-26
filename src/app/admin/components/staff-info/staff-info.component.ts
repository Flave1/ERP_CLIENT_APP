import { CountryService } from "src/app/core/services/country.service";

import { CommonService } from "./../../../core/services/common.service";
import { StaffInfoService } from "./../../../core/services/staff.service";
import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UserroleactivityService } from "src/app/core/services/userroleactivity.service";
import { CompanyService } from "src/app/core/services/company.service";
import { SelectItem } from "primeng/api";

@Component({
  selector: "app-staff-info",
  templateUrl: "./staff-info.component.html",
  styles: [
    `
      .multiselect-radius {
        border-radius: 4px !important;
      }
    `
  ]
})
export class StaffInfoComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Create New Staff";
  countries: any[];
  states: any[];
  jobTitles: any[];
  userRoleList: any[];
  accessList: any[];
  accessLevelList: any[];
  accessLevels: SelectItem[];
  userRoles: Array<object> = [];
  selectedAccessLevel: string[] = [];
  companyStructureList: any[] = [];
  dropdownSettings: any = {};
  selectedItems: Array<string> = [];
  constructor(
    public fb: FormBuilder,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private staffInfoService: StaffInfoService,
    private countryService: CountryService,
    private companyService: CompanyService,
    private userRoleService: UserroleactivityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      staffId: [0],
      staffCode: [""],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      middleName: [""],
      jobTitle: ["", Validators.required],
      phoneNumber: [""],
      email: ["", Validators.required],
      address: [""],
      dateOfBirth: [""],
      gender: ["", Validators.required],
      stateId: [""],
      countryId: [""],
      accessLevel: [""],
      staffOfficeId: [0],
      staffLimit: [0],
      username: ["", Validators.required],
      password: [""],
      userStatus: ["", Validators.required],
      userAccountId: [0],
      userRoleNames: [[], Validators.required],
      userAccessLevels: [[]],
      isHRAdmin: [false],
      ppeAdmin: [false],
      isPandPAdmin: [false],
      isCreditAdmin: [false],
      isInvestorFundAdmin: [false],
      isDepositAdmin: [false],
      isTreasuryAdmin: [false],
      isExpenseManagementAdmin: [false],
      isFinanceAdmin: [false]
    });
  }

  ngOnInit() {
    this.loadDropDowns();
    this.route.queryParams.subscribe(params => {
      let staffId = params["editstaffinfo"];
      if (staffId != null || staffId != undefined) {
        this.editStaff(staffId);
      }
    });
  }

  loadDropDowns() {
    this.commonService.getJobTitles().subscribe(
      data => {
        this.jobTitles = data["commonLookups"];
      },
      err => {
        this.loadingService.hide();
      }
    );

    this.commonService.getAllCountry().subscribe(
      data => {
        this.countries = data["commonLookups"];
      },
      err => {
        this.loadingService.hide();
      }
    );

    this.userRoleService.getAllUserRole().subscribe(data => {
      this.userRoleList = data["roles"];
      this.userRoles = [];
      if (this.userRoleList !== undefined) {
        this.userRoleList.forEach(el => {
          this.userRoles.push({ itemName: el.roleName, id: el.roleName });
        });
      }
    });

    this.companyService.getAllCompanyStructureDefinition().subscribe(
      data => {
        this.accessList = data["companyStructureDefinitions"];
      },
      err => {

      }
    );

    this.companyService.getAllCompanyStructure().subscribe(data => {
      this.companyStructureList = data["companyStructures"];

    });
  }

  onAccessLevelChanged(value, clear: boolean = false) {
    if (value != null) {
      this.loadingService.show();
      this.companyService.getCompanyStructureByAccessId(value).subscribe(
        data => {
          this.loadingService.hide();
          this.accessLevelList = data["companyStructures"];
          this.accessLevels = [];
          if (this.accessLevelList !== undefined) {
            this.accessLevelList.forEach(el => {
              this.accessLevels.push({
                label: el.name,
                value: el.companyStructureId
              });
            });
          }
        },
        err => {
          this.loadingService.hide();

        }
      );
      if (clear == true) {
        this.form.get("userAccessLevels").setValue([]);
      }
      this.parseValueToInt(value, 5);
    }
  }
  editStaff(staffId) {
    this.formTitle = "Edit Staff Information";
    this.loadingService.show();
    this.staffInfoService.getSingleStaff(staffId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.staff[0];
        this.form = this.fb.group({
          staffId: row.staffId,
          staffCode: row.staffCode,
          firstName: row.firstName,
          lastName: row.lastName,
          middleName: row.middleName,
          jobTitle: row.jobTitle,
          phoneNumber: row.phoneNumber,
          email: row.email,
          address: row.address,
          dateOfBirth: new Date(row.dateOfBirth),
          gender: row.gender,
          stateId: row.stateId,
          countryId: row.countryId,
          accessLevel: [row.accessLevel],
          staffOfficeId: [row.staffOfficeId],
          staffLimit: [row.staffLimit],
          username: [row.userName],
          password: [""],
          userStatus: [row.userStatus],
          userAccountId: [row.userAccountId],
          userRoleNames: [row.userRoleNames],
          userAccessLevels: [row.userAccessLevels],
          isHRAdmin: [row.isHRAdmin],
          ppeAdmin: [row.ppeAdmin],
          isPandPAdmin: [row.isPandPAdmin],
          isCreditAdmin: [row.isCreditAdmin],
          isInvestorFundAdmin: [row.isInvestorFundAdmin],
          isDepositAdmin: [row.isDepositAdmin],
          isTreasuryAdmin: [row.isTreasuryAdmin],
          isExpenseManagementAdmin: [row.isExpenseManagementAdmin],
          isFinanceAdmin: [row.isFinanceAdmin]
        });
        this.onAccessLevelChanged(row.accessLevel);
        this.getStateByCountry(row.countryId);
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(["/admin/staff-info-list"]);
  }
  submitStaffInfo(formObj) {
    const payload = formObj.value;
    payload.userStatus = payload.userStatus.toString();
    payload.dateOfBirth = this.formatDate(payload.dateOfBirth);
    this.loadingService.show();
    this.staffInfoService.addStaffInfo(payload).subscribe(
      data => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/admin/staff-info-list"]);
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
        // if (data["result"] == true) {
        //   swal.fire("GOS FINANCIAL", data["message"], "success");
        //   this.router.navigate(["/admin/staff-info-list"]);
        // } else {
        //   swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
      },
      err => {
        this.loadingService.hide();
        let message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
  parseValueToInt(value: string, num: number): void {
    let parsedValue = parseInt(value);
    if (num == 1) {
      this.form.patchValue({
        jobTitle: parsedValue
      });
    }
    if (num == 2) {
      this.form.patchValue({
        countryId: parsedValue
      });
    }
    if (num == 3) {
      this.form.patchValue({
        stateId: parsedValue
      });
    }
    if (num == 4) {
      this.form.patchValue({
        staffOfficeId: parsedValue
      });
    }
    if (num == 5) {
      this.form.patchValue({
        accessLevel: parsedValue
      });
    }
  }
  getStateByCountry(id: any) {
    this.loadingService.show();
    this.commonService.getStateByCountry(id).subscribe(
      data => {
        this.loadingService.hide();
        this.states = data["commonLookups"];
      },
      err => {
        this.loadingService.hide();
      }
    );
    this.parseValueToInt(id, 2);
  }

  onItemSelect(id: any) {
    this.selectedItems.push(id)
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }
}
