import { Component, Input, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { CommonService } from '../../services/common.service';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css'],
})
export class MainDashboardComponent implements OnInit {
  modules: any[] = [];
  moduleName: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private commonService: CommonService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.moduleName = this.jwtService.getModules();
  }
}
