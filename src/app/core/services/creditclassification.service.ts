import { Injectable } from "@angular/core";
import {map, tap} from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class CreditClassificationService {
    constructor(private apiService: ApiService) {}

    getAllCreditClassification(): Observable<any>{
        return this.apiService.get("/creditclassification/get/all").pipe(
            tap(data => {
              return data
            })
        );
    }

    updateCreditClassification(formdata: any): Observable<any>{
        return this.apiService.post("/creditclassification/add/update", formdata).pipe(
          map(data => {
            return data;
        })
    )}

    deleteCreditClassification(id: number){
        return this.apiService.delete(`/creditclassification/delete/${id}`).pipe(
        map(data => {
            return data;
        })
    )}

    deleteListOfCreditClassification(creditClassificationIds: Array<number>){
        return this.apiService.post(`/creditclassification/delete`, {creditClassificationIds}).pipe(
            map(data => {
                return data;
            })
        )
    }

    getCreditClassificationById(id: number): Observable<any>{
    return this.apiService.get(`/creditclassification/get/creditclassificationById?CreditClassificationId=${id}`).pipe(
        map(data => {
            return data;
        })
    )}
}
