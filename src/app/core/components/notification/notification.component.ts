import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router';
import { LoadingService } from "../../services/loading.service";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"]
})
export class NotificationComponent implements OnInit {
  notificationId: number;
  notification: any = {};
  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      this.notificationId = param.id;
      if (this.notificationId != undefined || this.notificationId != null) {
        this.getNotification(this.notificationId)
      }
    })
  }
  getNotifications() {
    this.loadingService.show();
    return this.notificationService
      .getStaffNotifications()
      .subscribe(
        data => {
          this.loadingService.hide();
          this.notification = data.emails;
        },
        err => {
          this.loadingService.hide();
        }
      );
  }
  getNotification(id) {
    this.loadingService.show();
    return this.notificationService.getNotification(id).subscribe(data => {
      this.loadingService.hide();

        this.notification = data.emails[0];

    }, err => {
      this.loadingService.hide();
    })
  }

  goToLink(link: ((url: string) => string) | HTMLLinkElement | any) {
    this.router.navigate([`../../${link}`])
  }

  goBack() {
    this.router.navigateByUrl('/notifications')
  }
}
