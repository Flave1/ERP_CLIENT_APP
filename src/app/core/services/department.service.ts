import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class DepartmentService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllDepartment() {
        return this.apiService.get("/department/alldepartment").pipe(
            map(data => {
                return data;
            })
        );
    }

    getDepartment(departmentId) {
        return this.apiService
            .get(`/department/department?departmentId=${departmentId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteDepartment(departmentId) {
        return this.apiService
            .delete(`/department/delete?departmentId=${departmentId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    updateDepartment(body): Observable<any> {
        return this.apiService.post(`/department/update`, body).pipe(
            map(data => {
                return data;
            })
        );
    }
}
