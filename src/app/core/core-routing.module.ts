import { DashboardComponent } from "./dashboard/dashboard.component";
import { MainLayoutComponent } from "./../shared/layout/main-layout.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    {
        path: "",
        //  component: MainLayoutComponent,
        children: [
            {
                path: "dashboard",
                component: DashboardComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule {}

export const routedComponents = [DashboardComponent];
