import { JwtService } from './../../core/services/jwt.service';
import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services/common.service';

@Injectable({
  providedIn: 'root',
})
export class RoleMenuService {
  moduleName: any[] = [];
  constructor(
    private jwtService: JwtService,
    private commonService: CommonService
  ) {}

  hideOrShow(activities: any[], moduleName?: string): boolean {
    const userActivities = this.jwtService.getUserActivities();
    const modules = this.jwtService.getModules();
    // let superAdmin = ["super admin"];
    if (moduleName) {
      return (
        this.checkActivities(activities, userActivities) &&
        modules.includes(moduleName)
      );
    } else {
      return this.checkActivities(activities, userActivities);
    }
  }

  checkActivities(acceptedArr, incomingArr: string[]): boolean {
    if (acceptedArr.length == 0) return true;
    return (
      incomingArr.some((v) => acceptedArr.indexOf(v) >= 0) ||
      incomingArr.indexOf('super admin') > -1
    );
  }
}
