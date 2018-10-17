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
export class UploadService {

  progress$: any;
  progress: any;
  progressObserver: any;

  constructor(
    public http: Http,
    public auth: AuthService
  ) {
    // this.progress$ = Observable.create((observer: any) => {
    //     this.progressObserver = observer
    // }).share();
  }

  importProductFile(data: any): Observable<any> {
    return Observable.create((observer: any) => {

      let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.open('POST', serverURL + '/products/upload_price/', true);
      xhr.setRequestHeader('Auth-Token', this.auth.getToken());
      xhr.setRequestHeader('Entry-ID', this.auth.currentEntry.id);
      
      let priceFile = data.files[0];
      formData.append('price', priceFile);
      formData.append('category_id', data.category_id);

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
