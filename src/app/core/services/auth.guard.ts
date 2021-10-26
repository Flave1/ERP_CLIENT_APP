import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

constructor( private router: Router,
  private authService: AuthService) { }

  canActivate( route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.loggedIn()) {

      return true;
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}

