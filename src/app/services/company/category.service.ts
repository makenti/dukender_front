import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { serverURL } from '../../common/config/server';
import { transformRequest } from '../../common/config/transformRequest';
import { handleError } from '../../common/config/errorHandler';

import { AuthService } from '../auth/index';

@Injectable()
export class CategoryService {

  constructor(
    public http: Http,
    public auth: AuthService
  ) { }

  getCategories(): Observable<any[]> {
    let headers = new Headers({ 'Auth-Token': this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(serverURL + '/products/get_categories/', options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.categories;
                      }else {
                        return [];
                      }
                    })
                    .catch(handleError);
  }

}
