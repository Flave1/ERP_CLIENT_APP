import { Injectable } from "@angular/core";
import { AppConfig } from "src/app/shared/constant/app.config";

@Injectable()
export class AppConfigService {
    private baseApiUrl: string;
    private tokenUrl: string;
    private appTimeOut: number;

    constructor(private appConfig: AppConfig) {}

    public get API_BASE(): string {
        this.baseApiUrl = this.appConfig.get("baseApiUrl");

        return this.baseApiUrl;
    }

    public set API_BASE(val: string) {
        this.baseApiUrl = val;
    }

    public get TOKEN_URL(): string {
        this.tokenUrl = this.appConfig.get("tokenUrl");

        return this.tokenUrl;
    }

    public set TOKEN_URL(val: string) {
        this.tokenUrl = val;
    }

    public get APP_TIMEOUT(): number {
        this.appTimeOut = this.appConfig.get("appTimeOut");

        return this.appTimeOut;
    }
}
