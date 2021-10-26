import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConfigModel } from "./app.config.model";

@Injectable()
export class AppConfig {
    private _config: Object;

    constructor(private http: HttpClient) {
        this.load();
    }

    load() {
        // json files will be loaded here
        return this.http
            .get("assets/config/app.config.json")
            .toPromise()
            .then(res => <ConfigModel>res)
            .then(data => {
                this._config = data;
            });
    }

    get(key: any) {
        localStorage.setItem(key, this._config[key]);
        return this._config[key];
    }
}
