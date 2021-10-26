import { Component, OnInit } from "@angular/core";

@Component({
    template: `
        <router-outlet></router-outlet>
    `
})
export class AuthLayoutComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
