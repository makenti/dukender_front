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
    // console.log("can activate");
    let authKey = window.localStorage.getItem('auth_key');
    // console.log("1");
    if(authKey !== null) {
      // console.log("2");
      if(this.checkRegisterStep()) {
        // console.log("2.5");
        // this.router.navigate(['/home']);
        if(next.url[0].path === 'landing' && authKey !== null) {
          this.router.navigate(['/home']);
          return true;
        }
        return true;
      }
      return true;
    }else {
      // console.log("4");
      this.router.navigate(['/landing']);
      return true;
    }
    // this.router.navigate(['/home']);
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
