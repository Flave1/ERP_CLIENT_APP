import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { CommonService } from "./../../../core/services/common.service";
import { UserroleactivityService } from "./../../../core/services/userroleactivity.service";
import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { JwtService } from "../../../core/services/jwt.service";
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: "app-userrole.activity",
  templateUrl: "./userrole.activity.component.html",
  styleUrls: ["./userrole.activity.component.scss"]
})
export class UserroleActivityComponent implements OnInit {
  userRoleActivities: any[] = [];
  filteredUserRoleActivities: any[] = [];
  roleName: string;
  formTitlte: string = "Add New User Role";
  modules: any[];
  selecteduserRoleActivity: any[] = [];
  selectedRole: any[] = [];
  userRoleId: string = "";
  viewHeight: any = "600px";
  viewAll: boolean;
  createAll: boolean;
  updateAll: boolean;
  deleteAll: boolean;
  approveAll: boolean;
  arr: any[] = [];
  userId: string;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private userRoleService: UserroleactivityService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.jwtService.getUserDetails().userId;
    this.getAllModules();
    this.route.queryParams.subscribe(params => {
      let userRoleId = params["edituserrole"];
      if (userRoleId != null || userRoleId != undefined) {
        this.userRoleId = userRoleId;
        this.getNewUserRoles(userRoleId);
      } else {
        this.getNewUserRoles(0);
      }
    });
  }

  getAllModules() {
    this.loadingService.show();
    this.commonService.getAllModules().subscribe(
      response => {
        if (response) {
          this.loadingService.hide();
          this.modules = response.commonLookups;
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  getNewUserRoles(userRoleId) {
    this.loadingService.show();
    this.userRoleService.getNewUserRoles(userRoleId).subscribe(
      response => {
        if (response) {
          this.userRoleActivities = response.activities;
          if (this.userRoleActivities != undefined) {
            this.filteredUserRoleActivities = this.userRoleActivities;
            this.roleName = this.userRoleActivities[0].roleName;
            if (this.userRoleId != "") {
              this.selectedRole = this.userRoleActivities.filter(
                x => x.roleId == this.userRoleId
              );
            }
            this.loadingService.hide();
          }
        } else {
          this.loadingService.hide();
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  onSelectedModuleChanged(value) {
    if (value != "") {
      this.filteredUserRoleActivities = this.userRoleActivities.filter(
        x => x.activityParentId == value
      );
    } else {
      this.filteredUserRoleActivities = this.userRoleActivities;
    }
  }

  SubmitUserRole() {
    if (this.selectedRole.length === 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select at least one page",
        "error"
      );
      return;
    }
  const selectedActivities = this.selectedRole.map(item => {
    return this.filteredUserRoleActivities.find(el => el.activityId === item.activityId)
  });
    const body = {
      roleId: this.userRoleId,
      roleName: this.roleName,
      activities: selectedActivities,
      userId: this.userId
    };

    this.loadingService.show();
    this.userRoleService.addUserRoleAndActivity(body).subscribe(
      data => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "success").then(() => {
          this.getUserDetails();
          this.router.navigate(["/admin/user-role"]);
        });
        // if (data["result"] === true) {
        //     this.router.navigate(["/admin/user-role"]);
        //     swal.fire("GOS FINANCIAL", data["message"], "success");
        // } else {
        //     swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
      },
      err => {
        this.loadingService.hide();
        let error = err.status.message;
        swal.fire("GOS FINANCIAL", error.friendlyMessage, "error");
      }
    );
  }
  goBack() {
    this.router.navigate(["/admin/user-role"]);
  }
  getValue(value: any) {
    let data = {
      viewAll: value
    };
    this.arr.push(data);

  }

  checkViewAll(event) {
    this.filteredUserRoleActivities = this.filteredUserRoleActivities.map(item => {
      return {...item, canView: event.target.checked}
    })
    // this.viewAll = !this.viewAll;
  }

  checkCreateAll(event) {
    this.filteredUserRoleActivities = this.filteredUserRoleActivities.map(item => {
      return {...item, canAdd: event.target.checked}
    })
  }

  checkUpdateAll(event) {
    this.filteredUserRoleActivities = this.filteredUserRoleActivities.map(item => {
      return {...item, canEdit: event.target.checked}
    })
    // this.updateAll = !this.updateAll;
  }

  checkDeleteAll(event) {
    this.filteredUserRoleActivities = this.filteredUserRoleActivities.map(item => {
      return {...item, canDelete: event.target.checked}
    })
    // this.deleteAll = !this.deleteAll;
  }

  checkApproveAll(event) {
    this.filteredUserRoleActivities = this.filteredUserRoleActivities.map(item => {
      return {...item, canApprove: event.target.checked}
    })
    // this.approveAll = !this.approveAll;
  }
  getUserDetails() {
    this.loadingService.show();
    return this.authService.getProfile().subscribe(
      data => {
        this.loadingService.hide();
        if (data != null) {
          this.jwtService.saveUserDetails(data);
          let activities;
          if (data.activities != null) {
            activities = data.activities.map(item => {
              return item.toLocaleLowerCase();
            });
            this.jwtService.saveUserActivities(activities).then(() => {
            });
          }
        }
      },
      error => {

      }
    );
  }
}
