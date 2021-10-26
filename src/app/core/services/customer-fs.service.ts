import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import {tap} from 'rxjs/operators';
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class CustomerFsService {
    constructor(private apiService: ApiService) {}

    getAllCustomerFSCaptionGroup() {
        return this.apiService.get("/loancustomerfs/get/all/fscaption/group").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getAllCustomerFsCaptionRatioByCaptionId(fsCaptionId: number){
        return this.apiService
        .get(
            `/customer/fs-all-captions-ratio-by-captionid?fsCaptionId=${fsCaptionId}`
        )
        .pipe(
            tap(data => {
                return data;
            })
        );
    }

    getAllCustomerFSCaptionByCaptionGroup(id: Number){
        return this.apiService
        .get(
            `/loancustomerfs/get/fscaption/group/bygroupId?FSCaptionGroupId=${id}`
        )
        .pipe(
            tap(data => {
                return data;
            })
        );
    }

    getSingleFSCaptionGroup(fsCaptionGroupId) {
        return this.apiService
            .get(
                `/loancustomerfs/get/fscaption/group/bygroupId?FSCaptionGroupId=${fsCaptionGroupId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getFSCaptionGroupWithoutRatio() {
        return this.apiService
            .get(`/customer/fs-caption-group-without-ratio`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteFSCaptionGroup(fsCaptionGroupId) {
        return this.apiService
            .delete(
                `/customer/fs-caption-group?fsCaptionGroupId=${fsCaptionGroupId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteMultipleFsGroup(ids: number[]){
        return this.apiService.post(`/loancustomerfs/delete/fscaption/group`, {ids}).pipe(
            tap(data => {
                return data;
            })
        );
    }

    addUpdateFSCaptionGroup(body): Observable<any> {
        return this.apiService.post(`/loancustomerfs/add/update/fscaption/group`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }
    getAllCustomerFSCaption() {
        return this.apiService.get("/loancustomerfs/get/all/fscaption").pipe(
            tap(data => {
                return data;
            })
        );
    }
    getSingleFSCaption(fSCaptionId) {
        return this.apiService
            .get(`/loancustomerfs/get/fscaptionbyId?FSCaptionId=${fSCaptionId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteFSCaption(fsCaptionId) {
        return this.apiService
            .delete(`/customer/fs-caption?fsCaptionId=${fsCaptionId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteMultipleFsCaptions(ids: number[]){
        return this.apiService.post(`/loancustomerfs/delete/fscaption`, {ids}).pipe(
            tap(data => {
                return data;
            })
        );
    }

    addUpdateFSCaption(body): Observable<any> {
        return this.apiService.post(`/loancustomerfs/add/update/fscaption`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }

    getAllCustomerFSRatioCaption() {
        return this.apiService.get("/loancustomerfs/get/all/fsratio/detail").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getAllCustomerFSCaptionRatioDetail(ratioCaptionId, fsCaptionGroupId) {
        return this.apiService
            .get(
                `/customer/fs-ratio-detail?ratioCaptionId=${ratioCaptionId}&&fsCaptionGroupId=${fsCaptionGroupId}`
            )
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    getSingleFSCaptionRatioDetail(ratioDetailId) {
        return this.apiService
            .get(`/loancustomerfs/get/single/fsratio?RatioDetailId=${ratioDetailId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteFSCaptionRatioDetail(ratioDetailId) {
        return this.apiService
            .delete(`/customer/fs-ratio-detail?ratioDetailId=${ratioDetailId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    addUpdateFSCaptionRatioDetail(body): Observable<any> {
        return this.apiService.post(`/loancustomerfs/add/update/fsratio/detail`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }

    getAllValueTypes() {
        return this.apiService.get("/customer/value-types").pipe(
            tap(data => {
                return data;
            })
        );
    }
    getAllDivisorTypes() {
        return this.apiService.get("/customer/divisor-types").pipe(
            tap(data => {
                return data;
            })
        );
    }
    getCustomerFSRatioValue(customerId) {
        return this.apiService
            .get(`/loancustomerfs/get/fsratio/values?CustomerId=${customerId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getCustomerFSRatioCalculations(customerId: number){
        return this.apiService
        .get(`/loancustomerfs/get/fsratio/calculations?CustomerId=${customerId}`)
        .pipe(
            tap(data => {
                return data;
            })
        );
    }

    getAllCustomerFSCaptionGroupWithoutRatio() {
        return this.apiService
            .get(`/loancustomerfs/fscaption/all/caption/group`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    getFSCaptionDetailByCustomerId(customerId) {
        return this.apiService
            .get(`/loancustomerfs/get/fscaption/detail/mappeds?CustomerId=${customerId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    getFSCaptionDetailByCustomer(params) {
        return this.apiService
            .post(`/loancustomerfs/get/fscaption/detail/mapped`, params)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    getUnmappedCustomerFSCaption(params) {
        return this.apiService
            .post(`/loancustomerfs/get/fscaption/unmapped`, params)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    addUpdateFSCaptionDetail(body): Observable<any> {
        return this.apiService.post(`/loancustomerfs/add/update/fscaption/detail`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }
    deleteCustomerFSCaptionDetail(fsDetailId) {
        return this.apiService
            .post(`/loancustomerfs/delete/fscaption/detail?fSDetailId=${fsDetailId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }
    deleteMultipleFsRatioDetail(ids: any):Observable<any> {
      return this.apiService.post(`/loancustomerfs/delete/fsratio/detail`, {ids}).pipe(tap(data => {
        return data;
      }))
    }
    exportFSCaption() {

    }
    uploadFSCaption(payload) {

    }
    deleteMultipleUsers(payload) {

    }
}
