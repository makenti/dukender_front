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
export class CompanyRegionsService {

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }

  getCountries(): Observable<any[]> {
    let headers = new Headers({ 'Auth-Token': this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(serverURL + '/sellers/countries/', options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.countries;
                      }else {
                        return [];
                      }
                    })
                    .catch(handleError);
  }

  getRegionsByCountry(data: any): Observable<any[]> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = 'country_id=' + data.country_id;

    return this.http.post(serverURL + '/sellers/regions_by_country/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.regions;
                      }else {
                        return [];
                      }
                    })
                    .catch(handleError);
  }

  getRegions(): Observable<any[]> {
    let headers = new Headers({ 'Auth-Token': this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(serverURL + '/sellers/regions/', options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.regions;
                      }else {
                        return [];
                      }
                    })
                    .catch(handleError);
  }

  getRegionDistricts(body: any): Observable<Object[]> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = 'region_id=' + body.region_id;

    return this.http.post(serverURL + '/sellers/districts/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.districts;
                      }else {
                        return [];
                      }
                    })
                    .catch(handleError);
  }

}
