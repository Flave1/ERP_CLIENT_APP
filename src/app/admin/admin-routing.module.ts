import { Routes, RouterModule } from "@angular/router";
import { MainLayoutComponent } from "../shared/layout/main-layout.component";
import { UserAccountComponent } from "./components/user-account/user-account.component";
import { AuthGuard } from "../core/services/auth.guard";
import { UserAccountListComponent } from "./components/user-account/user-account-list.component";
import { StaffInfoComponent } from "./components/staff-info/staff-info.component";
import { StaffInfoListComponent } from "./components/staff-info/staff-info-list.component";
import { UserroleComponent } from "./components/userrole/userrole.component";
import { UserroleActivityComponent } from "./components/userrole/userrole.activity.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: "",
        component: MainLayoutComponent,
        children: [
            {
                path: "create-user",
                component: UserAccountComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "user-account-list",
                component: UserAccountListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "staff-info",
                component: StaffInfoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "staff-info-list",
                component: StaffInfoListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "user-role",
                component: UserroleComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "user-role-activity",
                component: UserroleActivityComponent,
                canActivate: [AuthGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutesModule {}
