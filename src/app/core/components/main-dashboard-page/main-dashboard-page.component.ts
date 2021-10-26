import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { LoadingService } from '../../services/loading.service';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-main-dashboard-page',
  templateUrl: './main-dashboard-page.component.html',
  styleUrls: ['./main-dashboard-page.component.css'],
})
export class MainDashboardPageComponent implements OnInit {
  @Input() modules: any[] = [];
  moduleName: any[] = [];
  constructor(
    private router: Router,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.moduleName = this.jwtService.getModules();
  }
}
