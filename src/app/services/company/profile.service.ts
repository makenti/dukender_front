import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { serverURL } from '../../common/config/server';
import { transformRequest } from '../../common/config/transformRequest';
import { handleError } from '../../common/config/errorHandler';

import { AuthService } from '../auth/index';

@Injectable()
export class CompanyProfileService {

  progress$: any;
  progress: any;
  progressObserver: any;

  constructor(
    public http: Http,
    public auth: AuthService,
    public router: Router
  ) { }

  registerFirstStep(body: Object): Observable<any> {
    let bodyString = transformRequest(body);

    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(serverURL + '/sellers/company/create/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      return resp;
                    })
                    .catch(handleError);
  }

  updateCompanyRegions(body: Object): Observable<Object> {
    let bodyString = 'sell_regions=' + JSON.stringify(body);

    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(serverURL + '/sellers/company/profile/second_page/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if(resp.code === 0) {
                        return true;
                      }
                      return false;
                    })
                    .catch(handleError);
  }

  updateCompanyCategories(body: Object): Observable<Object> {
    let bodyString = transformRequest(body);
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(serverURL + '/sellers/company/profile/third_page/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if(resp.code === 0) {
                        return true;
                      }
                      return false;
                    })
                    .catch(handleError);
  }

  getCompanyProfile(): Observable<any> {
    let headers = new Headers({'Auth-Token': this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(serverURL + '/sellers/company/profile/get/', options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.company;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }
  getCompanyRegions(): Observable<any> {
    let headers = new Headers({'Auth-Token': this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(serverURL + '/sellers/company/profile/sell_regions/get/', options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.sell_regions;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  getCompanyCategories(): Observable<any> {
    let headers = new Headers({'Auth-Token': this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(serverURL + '/sellers/company/profile/categories/get/', options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.categories;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  checkCompanyCategory(body: Object): Observable<any> {

    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options    = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(body);

    return this.http.post(serverURL + '/sellers/company/profile/check_items_in_category/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.result;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  updateCompanyProfile(body: Object): Observable<any> {
    let bodyString = transformRequest(body);

    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(serverURL + '/sellers/company/profile/first_page/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if(resp.code === 0) {
                        return true;
                      }
                      return false;
                    })
                    .catch(handleError);
  }
  readNotifications(data: Object): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);
    return this.http.post(serverURL + '/moderators/inform/mark_read/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      return resp;
                    })
                    .catch(handleError);
  }
  uploadCompanyPhoto(data: any): Observable<any> {
    return Observable.create((observer: any) => {

      let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.open('POST', serverURL + '/sellers/company/profile/upload_photo/', true);
      xhr.setRequestHeader('Auth-Token', this.auth.getToken());
      formData.append('image', data.files[0]);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let resp = JSON.parse(xhr.response);
            if(resp.code === 0) {
              observer.next(resp);
              observer.complete();
            }else {
              observer.error(resp);
            }
          } else {
            observer.error(xhr.response);
          }
        }
      };

      xhr.onload = () => {
        return true;
      };

      xhr.upload.onprogress = (event) => {
        this.progress = Math.round(event.loaded / event.total * 100);
        // observer.next(this.progress);
      };

      xhr.send(formData);

    });
  }

}
