import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { transformRequest } from '../../common/config/transformRequest';

import { AuthService } from '../auth/index';

@Injectable()
export class ToolbarService {

  toolbarTitle: string = 'Добро пожаловать в Dukender.';

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }

  setToolbarTitle(newTitle: string) {
    this.toolbarTitle = newTitle;
  }

  getToolbarTitle() {
    return this.toolbarTitle;
  }

}
