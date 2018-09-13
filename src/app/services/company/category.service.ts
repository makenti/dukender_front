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
    let headers = new Headers({ 
      'Auth-Token': this.auth.getToken(),
      'Entry-ID': this.auth.currentEntry.id
     });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(serverURL + '/products/get_categories_v2/', options)
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
  deleteSubcategory(data): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options    = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);
  
    return this.http.post(serverURL + '/products/subcategory/delete/',bodyString ,options)
                    .map((res: Response) => {
                      return res.json();
                    })
                    .catch(handleError);
  }
  editSubcategory(data): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options    = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);
  
    return this.http.post(serverURL + '/products/subcategory/update/',bodyString ,options)
                    .map((res: Response) => {
                      return res.json();
                    })
                    .catch(handleError);
  }
  createCategory(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);
    return this.http.post(serverURL + '/products/subcategory/create/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      return resp;
                    })
                    .catch(handleError);
  }
}
