import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { serverURL } from '../../common/config/server';
import { transformRequest } from '../../common/config/transformRequest';
import { handleError } from '../../common/config/errorHandler';

import { AuthService } from '../auth/index';

@Injectable()
export class ProposalService {

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }

  getProposals(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/get_requests/', bodyString, options)
                    .map((res: Response) => {
                      // console.log(res);
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  getProposal(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/get/', bodyString, options)
                    .map((res: Response) => {
                      // console.log(res);
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.result;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  getProposalByKey(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = {};
    return this.http.post(serverURL + '/sellers/requests/get/' + data.key + '/', bodyString, options)
                    .map((res: Response) => {
                      // console.log(res);
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.request;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  editProposal(data: any): Observable<any> {

    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = 'request=' + JSON.stringify(data);

    return this.http.post(serverURL + '/sellers/requests/edit_request/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      console.log(resp);
                      if (resp.code === 0) {
                        return resp;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  addProposalComment(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/products/create_request_comment/', bodyString, options)
                    .map((res: Response) => {
                      // console.log(res);
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.item;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  updateComments(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/products/get_request_comments/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp.comments;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  setProposalStatus(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/set_status/', bodyString, options)
                    .map((res: Response) => {
                      // console.log(res);
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  sendProposalToEmail(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/send_request_by_email_v2/', bodyString, options)
                    .map((res: Response) => {
                      // console.log(res);
                      let resp = res.json();
                      if (resp.code === 0) {
                        return true;
                      }else {
                        return false;
                      }
                    })
                    .catch(handleError);
  }

  exportProposal(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/vnd.ms-excel'
    });

    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/export_to_excel/', bodyString, options)
                    .map((res: Response) => {
        //               var mediaType = 'application/pdf';
        // var blob = new Blob([response._body], {type: mediaType});
        // var filename = 'test.pdf';
        // saveAs(blob, filename);

                        // let blob: Blob = res.blob();
                        // saveAs(blob, 'test.xls');
                      // console.log(res);
                      // let resp = res.json();
                      // if (resp.code === 0) {
                      //   return true;
                      // }else {
                      //   return false;
                      // }
                    })
                    .catch(handleError);
  }

  revokeProposals(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/cancel/', bodyString, options)
                    .map((res: Response) => {
                      // console.log(res);
                      let resp = res.json();
                      if (resp.code === 0) {
                        return true;
                      }else {
                        return false;
                      }
                    })
                    .catch(handleError);
  }

}
