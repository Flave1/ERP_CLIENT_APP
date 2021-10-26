import { AuthService } from "src/app/core/services/auth.service";
import { Component, OnDestroy } from "@angular/core";
import { BreadcrumbService } from "./breadcrumb.service";
import { Subscription } from "rxjs";
import { MenuItem } from "primeng/api";

@Component({
    selector: "app-breadcrumb",
    templateUrl: "./app.breadcrumb.component.html"
})
export class AppBreadcrumbComponent implements OnDestroy {
    subscription: Subscription;

    items: MenuItem[];

    constructor(
        public breadcrumbService: BreadcrumbService,
        private authService: AuthService
    ) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(
            response => {
                this.items = response;
            }
        );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    logOut() {
        this.authService.purgeAuth();
    }
}
