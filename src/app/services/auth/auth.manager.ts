import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthManager implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let authKey = window.localStorage.getItem('auth_key');
    if(authKey !== null) {
      if(this.checkRegisterStep()) {
        if(next.url[0].path === 'landing' && authKey !== null) {
          this.router.navigate(['/home']);
          return true;
        }
        return true;
      }
      return true;
    }
    else if(next.url[0].path !== 'landing'){
      this.router.navigate(['/landing']);
      return true;
    }else{
      return true;
    }
  }

  checkRegisterStep() {
    let fillStatus = this.auth.checkRegister();
    // console.log(fillStatus);
    if(fillStatus === undefined || fillStatus === null) {
      this.router.navigate(['/register-1']);
    }else if(fillStatus === 0) {
      this.router.navigate(['/register-2']);
    }else if(fillStatus === 1) {
      this.router.navigate(['/register-2']);
    }else if(fillStatus === 2) {
      return true;
    }
    return true;
  }

}
