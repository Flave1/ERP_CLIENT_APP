import { JwtService } from "./../../core/services/jwt.service";
import { AuthService } from "./../../core/services/auth.service";
import { MainLayoutComponent } from "./../layout/main-layout.component";
import {Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild} from '@angular/core';
import { AppComponent } from "../../app.component";
import { NotificationService } from "../../core/services/notification.service";
import {Router} from '@angular/router';

@Component({
  selector: "app-topbar",
  templateUrl: "./app.topbar.component.html",
  styleUrls: ["./app.topbar.component.css"]
})
export class AppTopbarComponent implements OnInit, OnDestroy {
  @ViewChild('messages')  messages: ElementRef;
  @ViewChild('profile')  profile: ElementRef;
  loggedInUserName: string;
  loggedInUserBranch: string;
  loggedInUserCompany: string;
  applicationDate: Date;
  lastLoginDate: string;
  staffName: string;
  staffId: number;
  message_alerts: any[] = [];
  counts: number;
  showCounts: boolean;
  constructor(
    public app: MainLayoutComponent,
    private authService: AuthService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    const userInfo = this.jwtService.getUserDetails();
    this.loggedInUserName = userInfo.userName;
    this.loggedInUserBranch = userInfo.branchName;
    this.loggedInUserCompany = userInfo.companyName;
    this.applicationDate = userInfo.applicationDate;
    this.lastLoginDate = userInfo.lastLoginDate;
    this.staffName = userInfo.userName;
    this.staffId = userInfo.staffId;
    this.getStaffNotifications();
    // this.getNotificationCount()
  }
  getStaffNotifications() {
    return this.notificationService.getStaffNotifications().subscribe(data => {
     this.message_alerts = data.emails;
     this.counts = data.emailCount;
     this.showCounts = true
    }, err => {
    })
  }
  ngOnDestroy(): void {}
  getNotification(id) {
    this.router.navigate(['/notification'], {queryParams: {id}}).then(() => {
      this.getStaffNotifications()
    })
  }
  getNotificationCount() {
    return this.notificationService.getNotificationCount(this.staffId).subscribe(data => {
      if(data.success) {
        if (data.result != null) {
          this.counts = data.result
        }
      }
    }, err => {
    })
  }
  markAsRead(id) {
    return this.notificationService.markAsRead(this.staffId, id).subscribe(data => {
      if (data.result) {
        // this.getNotificationCount();
        this.getStaffNotifications()
      }
    }, err => {

    })
  }
  logOut() {
    this.authService.purgeAuth();
  }

  viewAll() {
    this.router.navigateByUrl('/notifications')
  }
  showItem(item) {
    if (item == 'messages') {
      this.renderer.setStyle(this.messages.nativeElement, 'display', 'block');
      this.renderer.setStyle(this.profile.nativeElement, 'display', 'none');
    }
    if (item == 'profile') {
      this.renderer.setStyle(this.messages.nativeElement, 'display', 'none');
      this.renderer.setStyle(this.profile.nativeElement, 'display', 'block');
    }
  }
}
