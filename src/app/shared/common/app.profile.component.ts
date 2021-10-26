import { JwtService } from "./../../core/services/jwt.service";
import { MainLayoutComponent } from "./../layout/main-layout.component";
import { AppComponent } from "../../app.component";
import { Component, OnInit } from "@angular/core";
import {
    trigger,
    state,
    transition,
    style,
    animate
} from "@angular/animations";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
    selector: "app-inline-profile",
    template: `
        <div class="profile" [ngClass]="{ 'profile-expanded': active }">
            <a href="#" (click)="onClick($event)">
                <img
                    *ngIf="photoUrl"
                    class="profile-image"
                    [src]="'data:image/jpg;base64,' + photoUrl"
                />
                <span class="profile-name">{{ userName }}</span>
                <i class="material-icons">keyboard_arrow_down</i>
            </a>
        </div>

        <ul
            class="ultima-menu profile-menu"
            [@menu]="active ? 'visible' : 'hidden'"
        >
            <li role="menuitem">
                <a
                    href="#"
                    class="ripplelink"
                    [attr.tabindex]="!active ? '-1' : null"
                >
                    <i class="material-icons">person</i>
                    <span>Profile</span>
                </a>
            </li>
            <li role="menuitem">
                <a
                    href="#"
                    class="ripplelink"
                    [attr.tabindex]="!active ? '-1' : null"
                >
                    <i class="material-icons">security</i>
                    <span>Privacy</span>
                </a>
            </li>
            <li role="menuitem">
                <a
                    href="#"
                    class="ripplelink"
                    [attr.tabindex]="!active ? '-1' : null"
                >
                    <i class="material-icons">settings_application</i>
                    <span>Settings</span>
                </a>
            </li>
            <li role="menuitem">
                <a
                    href="#"
                    class="ripplelink"
                    [attr.tabindex]="!active ? '-1' : null"
                >
                    <i class="material-icons">power_settings_new</i>
                    <span>Logout</span>
                </a>
            </li>
        </ul>
    `,
    animations: [
        trigger("menu", [
            state(
                "hidden",
                style({
                    height: "0px"
                })
            ),
            state(
                "visible",
                style({
                    height: "*"
                })
            ),
            transition(
                "visible => hidden",
                animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
            ),
            transition(
                "hidden => visible",
                animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
            )
        ])
    ]
})
export class AppInlineProfileComponent {
    active: boolean;
    photoUrl: any;
    userName: string = "";
    constructor(
        public app: MainLayoutComponent
    ) // private jwtService: JwtService,
    // private authService: AuthService
    {}
    // ngOnInit() {
    //     let res = this.jwtService.getUserDetails();
    //     if (res != null || res != undefined) {
    //         let user = JSON.parse(res);
    //         if (user != null) {
    //             this.authService.changeProfilePhoto(user.photo);
    //             this.authService.changeProfileName(user.userName);
    //         }
    //         this.authService.currentPhotoUrl.subscribe(
    //             photoUrl => (this.photoUrl = photoUrl)
    //         );
    //         this.authService.currentUserName.subscribe(
    //             username => (this.userName = username)
    //         );
    //     }
    // }

    onClick(event) {
        this.active = !this.active;
        setTimeout(() => {
            this.app.layoutMenuScrollerViewChild.moveBar();
        }, 450);
        event.preventDefault();
    }
}
