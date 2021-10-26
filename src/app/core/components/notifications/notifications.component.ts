import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../../services/notification.service";
import { LoadingService } from "../../services/loading.service";
import { Router } from "@angular/router";
import { JwtService } from "../../services/jwt.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"]
})
export class NotificationsComponent implements OnInit {
  staffId: number;
  notifications: any[] = [];
  selectedNotification: any;
  viewHeight: string = "600px";
  cols: any[];
  counts: any[];
  constructor(
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private router: Router,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    this.staffId = this.jwtService.getUserDetails().staffId;
    this.getNotifications();
    this.cols = [
      {
        field: "refid",
        header: "refid"
      },
      {
        field: "category",
        header: "category"
      },
      {
        field: "subject",
        header: "subject"
      },
      {
        field: "daterecevied",
        header: "daterecevied"
      }
    ];
  }
  getNotifications() {
    this.loadingService.show();
    return this.notificationService
      .getStaffNotifications()
      .subscribe(
        data => {
          this.loadingService.hide();
          this.notifications = data.emails;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }
  getNotificationCount() {
    return this.notificationService.getNotificationCount(this.staffId).subscribe(data => {
      if(data.success) {
        this.counts = data.result
      }
    }, err => {
          })
  }
  markAsRead(id) {
    return this.notificationService.markAsRead(this.staffId, id).subscribe(data => {
      if (data.result) {
        this.getNotificationCount();
        this.getNotifications()
      }
    }, err => {

    })
  }
  getNotification(id) {
    this.router.navigate(["/notification"], { queryParams: { id } }).then(() => {
      this.getNotifications()
      // this.markAsRead(id)
    });
  }
}
