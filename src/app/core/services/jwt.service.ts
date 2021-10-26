import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private appService: AppService) {}
  getToken() {
    return window.localStorage.getItem('jwtToken');
  }

  async saveToken(token: any) {
    await window.localStorage.setItem('jwtToken', token);
    // return new Promise((resolve, reject) => {
    //
    //   resolve()
    // })
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

  getUser() {
    return window.localStorage.getItem('user');
  }

  saveUser(id: any) {
    window.localStorage.setItem('user', id);
  }
  destroyUser() {
    window.localStorage.removeItem('user');
  }

  getAccountType() {
    return window.localStorage.getItem('accountType');
  }

  saveAccountType(id: any) {
    window.localStorage.setItem('accountType', id);
  }
  destroyAccountType() {
    window.localStorage.removeItem('accountType');
  }

  getUserDetails() {
    return JSON.parse(window.localStorage.getItem('userDetails'));
  }

  saveUserDetails(user) {
    window.localStorage.setItem('userDetails', JSON.stringify(user));
  }
  destroyUserDetails() {
    window.localStorage.removeItem('userDetails');
  }

  async saveUserActivities(activities) {
    await window.localStorage.setItem(
      'userActivities',
      JSON.stringify(activities)
    );
  }

  getUserActivities() {
    return JSON.parse(window.localStorage.getItem('userActivities'));
  }

  destroyUserActivities() {
    window.localStorage.removeItem('userActivities');
  }

  async removeToken() {
    await window.localStorage.removeItem('token');
  }

  async removeUser() {
    await window.localStorage.removeItem('user');
    this.appService.setUserLoggedIn(false);
  }

  saveModules(modules) {
    return window.localStorage.setItem('modules', JSON.stringify(modules));
  }
  getModules() {
    return JSON.parse(window.localStorage.getItem('modules'));
  }
}
