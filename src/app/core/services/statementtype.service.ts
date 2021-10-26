import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class StatementTypeService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllStatementType() {
        return this.apiService.get("/statementtype/get/all").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getStatementType(statementTypeId) {
        return this.apiService
            .get(`/statementtype/get/single/statementtypeId?StatementTypeId=${statementTypeId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteStatementType(statementTypeId) {
        return this.apiService
            .delete(`/statementType/delete?statementTypeId=${statementTypeId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    updateStatementType(body): Observable<any> {
        return this.apiService.post(`/statementtype/add/update`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }
    exportStatementType() {
        return this.apiService.getExcel('/statementtype/get/download').pipe(tap(data => {
            return data;
        }))
    };
    uploadStatementType(imageFile: File): Promise<any> {
        return this.apiService.uploadExcel('/statementtype/post/upload', imageFile).then(data => {
            return data;
        })
    };
    multipleDeleteStatementType(payload) {
        return this.apiService.post('/statementtype/delete/targetIds', payload).pipe(tap(data => {
            return data;
        }))
    }
}
