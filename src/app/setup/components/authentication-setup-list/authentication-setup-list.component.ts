import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LoadingService} from "../../../core/services/loading.service";
import {CommonService} from "../../../core/services/common.service";

@Component({
  selector: 'app-authentication-setup-list',
  templateUrl: './authentication-setup-list.component.html',
  styleUrls: ['./authentication-setup-list.component.css']
})
export class AuthenticationSetupListComponent implements OnInit {
  viewHeight: string = '600px';
  setupList: any[] = [];
  selectedItem: any[] = [];

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getAllSetups()
  }

  showAddNew() {
    this.router.navigate(['/setup/authentication'])
  }

  editItem(authSettupId) {
    this.router.navigate(['/setup/authentication'], {
      queryParams: {
        id: authSettupId
      }
    })
  }
  getAllSetups() {
    this.loadingService.show();
    return this.commonService.getAuthSetups().subscribe(data => {
      this.loadingService.hide();
      this.setupList = data.authSettups
    }, err => {
      this.loadingService.hide()
    })
  }
}
