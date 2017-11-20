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
export class PromotionService {

  selectedProducts:any;

  constructor(
    public http: Http,
    public auth: AuthService
  ) { }

  getPromotions(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);
    // let params = new URLSearchParams();
    // if(data.status !== ''){
    //   params.set('statuses[]', data.status);
    // }
    // params.set('timestamp', data.timestamp);
    // params.set('limit', data.limit);

    return this.http.post(serverURL + '/sellers/get_news/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.news;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  getSinglePromotion(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/get_single_news/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      return resp;
                    })
                    .catch(handleError);
  }

  createPromotion(prom: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = 'news='+JSON.stringify(prom);//transformRequest(prom);

    return this.http.post(serverURL + '/sellers/news/create/v2/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp;
                      }else {
                        return resp;
                      }
                    })
                    .catch(handleError);
  }

  deletePromotions(body: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(body);

    return this.http.post(serverURL + '/sellers/news/delete/', bodyString, options)
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

  setPromotionPercents(data: any) {
    window.localStorage.setItem('prom_percents', JSON.stringify(data));
  }

  getPromotionPercents() {
    let promPercents = JSON.parse(window.localStorage.getItem('prom_percents'));
    if(promPercents) {
      return promPercents;
    }
    return null;
  }

}
