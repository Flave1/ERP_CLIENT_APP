import { Injectable } from "@angular/core";
import {map, tap} from 'rxjs/operators';
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class StateService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllState() {
        return this.apiService.get("/state/allstate").pipe(
            map(data => {
                return data;
            })
        );
    }

    getState(stateId) {
        return this.apiService
            .get(`/state/state?stateId=${stateId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteState(stateId) {
        return this.apiService
            .delete(`/state/delete?stateId=${stateId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    updateState(body): Observable<any> {
        return this.apiService.post(`/state/update`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

    exportStatesList() {
        return this.apiService.getExcel("/common/download/states").pipe(
            map(data => {
                return data;
            })
        );
    }
    multiDeleteStates(payload: Object):Observable<any> {
      return this.apiService.post(`/common/delete/stateId`, payload).pipe(tap(data => {
        return data;
      }))
    }
}
