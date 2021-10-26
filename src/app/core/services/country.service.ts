import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class CountryService {
    constructor(private apiService: ApiService) { }
    userData: any = {};
    getAllCountry() {
        return this.apiService.get("/country/allcountry").pipe(
            map(data => {
                return data;
            })
        );
    }



    deleteCountry(countryId) {
        return this.apiService
            .delete(`/country/delete?countryId=${countryId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }




    updateCountry(body): Observable<any> {
        return this.apiService.post(`/country/update`, body).pipe(
            map(data => {
                return data;

            })
        );
    }



    getAllJobTitle() {
        return this.apiService.get("/common/jobTitles").pipe(
            map(data => {
                return data;
            })
        );
    }

    getJobTitle(jobTitleId) {
        return this.apiService
            .get(`/country/single-job-title?jobTitleId=${jobTitleId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    deleteJobTitle(jobTitleId) {
        return this.apiService
            .delete(`/country/job-title?jobTitleId=${jobTitleId}`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }


    exportJobTitle() {
        return this.apiService.getExcel("/common/download/jobtitle").pipe(
            map(data => {
                return data;
            })
        );
    }

    uploadJobTitle(imageFile: File): Promise<any> {
        return this.apiService
            .uploadExcel("/common/upload/jobtitle", imageFile)
            .then(
                data => {
                    return data;
                }
            );
    }

    addUpdateJobTitle(body): Observable<any> {
        return this.apiService.post(`/country/job-title`, body).pipe(
            map(data => {
                return data;
            })
        );
    }

}
