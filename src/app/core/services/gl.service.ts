import { Injectable } from "@angular/core";
import {tap} from 'rxjs/operators';
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class GLService {
    constructor(private apiService: ApiService) {}
    userData: any = {};
    getAllGL() {
        return this.apiService.get("/gl/get/all").pipe(
            tap(data => {
                return data;
            })
        );
    }

    getGL(glId) {
        return this.apiService
            .get(`/gl/get/single/glId?GlId=${glId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }


    getGLByCompany(companyId) {
        return this.apiService
            .get(`/gl/glByCompany?companyId=${companyId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    deleteGL(glId) {
        return this.apiService
            .delete(`/gl/delete?glId=${glId}`)
            .pipe(
                tap(data => {
                    return data;
                })
            );
    }

    updateGL(body): Observable<any> {
        return this.apiService.post(`/gl/add/update`, body).pipe(
            tap(data => {
                return data;
            })
        );
    }
    exportGL() {
        return this.apiService.getExcel('/gl/get/download').pipe(tap(data => {
            return data;
        }))
    };
    uploadGL(imageFile: File):Promise<any> {
        return this.apiService.uploadExcel('/gl/post/upload', imageFile).then(data => {
            return data;
        })
    };
    multipleDeleteGL(payload) {
        return this.apiService.post('/gl/delete/targetIds ', payload).pipe(tap(data => {
            return data;
        }))
    }
    // getGLByCompany(companyId: any): Observable<any> {
    //   return this.apiService.get(`/gl/glByCompany?companyId=${companyId}`).pipe(tap(data => {
    //     return data;
    //   }))
    // }
}
