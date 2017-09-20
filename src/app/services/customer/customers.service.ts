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
export class CustomersService {

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }

  getCustomers(): Observable<any> {
    let headers = new Headers({ 'Auth-Token': this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(serverURL + '/sellers/requests/matching_shops/', options)
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

  getBannedCustomers(): Observable<any> {
    let headers = new Headers({ 'Auth-Token': this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(serverURL + '/sellers/ban/get_banned_shops/', options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.banned_shops;
                      }else {
                        return [];
                      }
                    })
                    .catch(handleError);
  }

  banCustomer(body: any): Observable<any> {
    let bodyString = transformRequest(body);

    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(serverURL + '/sellers/ban/shops/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return true;
                      }else {
                        return false;
                      }
                    })
                    .catch(handleError);
  }

  unBanCustomer(body: any): Observable<any> {
    let bodyString = transformRequest(body);

    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(serverURL + '/sellers/ban/shops/unban/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return true;
                      }else {
                        return false;
                      }
                    })
                    .catch(handleError);
  }

  setCustomerStatus(body: any): Observable<any> {
    let bodyString = transformRequest(body);

    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(serverURL + '/sellers/requests/set_shop_relation/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      return resp;
                    })
                    .catch(handleError);
  }

}
