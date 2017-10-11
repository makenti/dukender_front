import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { AuthService } from './auth.service';

@Injectable()
export class RoleService {

  isAuthenticated: boolean = false;

  constructor(
    private auth: AuthService) {}

  getPermissions() {
    let currUser = this.auth.getUser();
    return currUser.permissions;
  }
}
