import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class UserroleactivityService {
    constructor(private apiService: ApiService) {}
    getAllUserRole() {
        return this.apiService.get("/admin/get/all/role").pipe(
            map(data => {
                return data;
            })
        );
    }

    deleteUserRole(userRoleId) {
        return this.apiService
            .delete(`/admin/delete-user-role?userRoleId=${userRoleId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteMultipleUserRole(body): Observable<any> {
        return this.apiService.post(`/admin/delete/role/targetIds`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    addUpdateUserRole(body): Observable<any> {
        return this.apiService.post(`/admin/user-role`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    getActivityParentAndChild() {
        return this.apiService.get("/admin/get/all/activityParents").pipe(
            map(data => {
                return data;
            })
        );
    }

    getNewUserRoles(userRoleId) {
        return this.apiService.get(`/admin/get/all/roleActivities/roleId?RoleId=${userRoleId}`).pipe(
            map(data => {
                return data;
            })
        );
    }

    getActivities() {
        return this.apiService.get("/admin/all-activities").pipe(
            map(data => {
                return data;
            })
        );
    }

    getRolesAndActivities() {
        return this.apiService.get("/admin/all-role-activities").pipe(
            map(data => {
                return data;
            })
        );
    }

    getActivitiesByRoleId(userRoleId) {
        return this.apiService
            .get(`/admin/role-activities?userRoleId=${userRoleId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    assignAccessRight(body): Observable<any> {
        return this.apiService.post(`/admin/manage-access`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    addUserRoleActivity(body): Observable<any> {
        return this.apiService.post(`/admin/user-role-activities`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    addUserRoleAndActivity(body): Observable<any> {
        return this.apiService.post(`/admin/add/update/roleActivity`, body).pipe(
            map(data => {
                return data;
            })
        );
    }
}
