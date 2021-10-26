import {Component, ChangeDetectorRef, HostListener, EventEmitter, ViewChild, OnInit} from "@angular/core";
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterEvent, ActivatedRoute
} from "@angular/router";
// import { DeviceDetectorService } from "ngx-device-detector";


import {AppService} from "./core/services/app.service";
import {JwtService} from "./core/services/jwt.service";
import {Title} from "@angular/platform-browser";
import {filter, map} from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit{

  // @HostListener('mouseenter', ['$event'])
  loading: boolean;
  domIsReady: boolean;
  deviceInfo = null;
  // private mouseEnter = new EventEmitter<MouseEvent>();
  // private mousemove = new EventEmitter<MouseEvent>();
  // @HostListener('mousemove', ['$event'])
  // onMousemove(event: MouseEvent) { this.mousemove.emit(event); }
  constructor(
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private jwtService: JwtService,
    private titleService: Title
    // private deviceService: DeviceDetectorService


  ) {
    router.events.subscribe((routerEvent: RouterEvent) => {
      this.checkRouterEvent(routerEvent);
    });

  }
ngOnInit(): void {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
      })
    }
  const appTitle = this.titleService.getTitle();
  this.router
    .events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => {
      const child = this.activatedRoute.firstChild;
      if (child.snapshot.data['title']) {
        return child.snapshot.data['title'];
      }
      return appTitle;
    })
  ).subscribe((ttl: string) => {
    this.titleService.setTitle(ttl);
  });
}

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart && this.domIsReady) {
      this.loading = true;
    }

    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.loading = false;
    }
  }
}
