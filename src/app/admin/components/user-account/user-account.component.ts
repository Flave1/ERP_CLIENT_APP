import { UserAccountService } from "./../../../core/services/user.service";
import { LoadingService } from "./../../../core/services/loading.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { Router, ActivatedRoute } from "@angular/router";
import { UserroleactivityService } from "src/app/core/services/userroleactivity.service";

@Component({
    selector: "app-user-account",
    templateUrl: "./user-account.component.html"
})
export class UserAccountComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Create New User";
    staffList: any[];
    activeIndex: number = 0;
    allActivities: any[];
    userRoles: any[];
    selectedActs: any[] = [];
    selectedUserRole: any[] = [];
    selectedActivities: any[] = [];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private userAccountService: UserAccountService,
        private userRoleService: UserroleactivityService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            userAccountId: [0],
            userName: [""],
            staffId: [""],
            email: [""],
            phoneNumber: [""],
            securityQuestion: [""],
            securityAnswer: [""]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let userAccountId = params["edituseraccount"];
            if (userAccountId != null || userAccountId != undefined) {
                this.edituser(userAccountId);
            }
        });
        this.getStaffList();
        this.getAllRoles();
        this.getParentChildActivities();
    }
    getStaffList() {
        this.loadingService.show();
        this.userAccountService.getStaffList().subscribe(data => {
            this.loadingService.hide();
            this.staffList = data["result"];
        }, err => {
          this.loadingService.hide()
        });
    }
    getAllRoles() {
        this.loadingService.show();
        this.userRoleService.getAllUserRole().subscribe(res => {
            this.userRoles = res.roles;
        }, err => {
          this.loadingService.hide()
        });
    }

    getParentChildActivities() {
        this.userRoleService.getActivityParentAndChild().subscribe(response => {
            this.allActivities = response.activityParents;
            this.loadingService.hide();
        }, err => {
          this.loadingService.hide()
        });
    }

    edituser(userAccountId) {
        this.loadingService.show();
        this.userAccountService
            .getSingleUserAccount(userAccountId)
            .subscribe(data => {
                this.loadingService.hide();
                let row = data["result"];
                this.formTitle = "Edit User";
                this.form = this.fb.group({
                    userAccountId: row.userAccountId,
                    userName: row.userName,
                    staffId: row.staffId,
                    email: row.email,
                    phoneNumber: row.phoneNumber,
                    securityQuestion: row.securityQuestion,
                    securityAnswer: row.securityAnswer
                });
            });
    }

    goBack() {
        this.router.navigate(["/admin/user-account-list"]);
    }
    submitUserAccount(formObj) {
        this.loadingService.show();
        let userRole = [];
        let activities = [];
        this.selectedUserRole.forEach(data => {
            let role = {
                userRoleId: data,
                groupKey: "",
                groupId: 0
            };
            userRole.push(role);
        });
        this.selectedActivities.forEach(data => {
            let activ = {
                userRoleId: 0,
                activityId: data,
                activityName: ""
            };
            activities.push(activ);
        });

        let obj = formObj.value;
        let body = {
            userAccountId: obj.userAccountId,
            userName: obj.userName,
            staffId: obj.staffId,
            email: obj.email,
            phoneNumber: obj.phoneNumber,
            securityQuestion: obj.securityQuestion,
            securityAnswer: obj.securityAnswer,
            userRole: userRole,
            activities: activities
        };
        this.userAccountService.addUserAccount(body).subscribe(data => {
            this.loadingService.hide();
            if (data["result"] == true) {
                swal.fire("GOS FINANCIAL", data["message"], "success");
                this.router.navigate(["/admin/user-account-list"]);
            } else {
                swal.fire("GOS FINANCIAL", data["message"], "error");
            }
        });
    }

    onTabChange(e) {
        this.activeIndex = e.index;
    }
    openNext() {
        this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex + 1;
    }
    openPrev() {
        this.activeIndex = this.activeIndex === 2 ? 0 : this.activeIndex - 1;
    }
    addActivity(row, event) {
        var index = this.selectedActivities.indexOf(row);
        if (event.target.checked) {
            if (index === -1) {
                this.selectedActivities.push(row);
            }
        } else {
            if (index !== -1) {
                this.selectedActivities.splice(index, 1);
            }
        }
    }
    addUserRole(row, event) {
      const index = this.selectedUserRole.indexOf(row);
      if (event.target.checked) {
            if (index === -1) {
                this.selectedUserRole.push(row);
            }
        } else {
            if (index !== -1) {
                this.selectedUserRole.splice(index, 1);
            }
        }
    }
}
