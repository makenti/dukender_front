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
export class AccountService {

  constructor(
    public http: Http,
    public auth: AuthService
  ) { }

  getAccounts(data: any): Observable<any> {

    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/account/v2/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

}
