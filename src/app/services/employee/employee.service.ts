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
export class EmployeeService {

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }

  getStaff(): Observable<any> {
    let headers = new Headers({ 'Auth-Token': this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(serverURL + '/sellers/staff/', options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.staff;
                      }else {
                        return [];
                      }
                    })
                    .catch(handleError);
  }

  addEmployee(body: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(body);
    console.log(bodyString);
    return this.http.post(serverURL + '/sellers/staff/add/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      console.log(resp);
                      return resp;
                    })
                    .catch(handleError);
  }

  updateEmployee(body: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(body);
    console.log(bodyString);
    return this.http.post(serverURL + '/sellers/staff/update/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      console.log(resp);
                      return resp;
                    })
                    .catch(handleError);
  }

  deleteEmployee(body: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(body);
    return this.http.post(serverURL + '/sellers/staff/delete/', bodyString, options)
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

  delegateAuthority(user: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(user);
    return this.http.post(serverURL + '/sellers/company/profile/delegate_authority/', bodyString, options)
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

  inviteEmployee(body: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(body);
    // console.log(bodyString);
    return this.http.post(serverURL + '/sellers/staff/invite/v2/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      // console.log(resp);
                      if (resp.code === 0) {
                        return true;
                      }else {
                        return false;
                      }
                    })
                    .catch(handleError);
  }

}
