import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { serverURL } from '../../common/config/server';
import { transformRequest } from '../../common/config/transformRequest';
import { handleError } from '../../common/config/errorHandler';
import * as FileSaver from 'file-saver';

import { AuthService } from '../auth/index';
declare var saveAs:any;

@Injectable()
export class ProposalService {

  public filter = {
    selected: '',
    fields: 
    [ { field: '', order: '', scroll: 0, limit: 0},    
      { field: '', order: '', scroll: 0, limit: 0},    
      { field: '', order: '', scroll: 0, limit: 0},    
      { field: '', order: '', scroll: 0, limit: 0},    
      { field: '', order: '', scroll: 0, limit: 0},    
      { field: '', order: '', scroll: 0, limit: 0},    
      { field: '', order: '', scroll: 0, limit: 0},    
      { field: '', order: '', scroll: 0, limit: 0},],
  };
  public refresh:boolean = true;
  public proposals;

  constructor(
    public http: Http,
    public auth: AuthService
  ) {
    let filter = JSON.parse(window.localStorage.getItem('filter'));
    if(filter) 
      this.setFilter(filter);
  }

  getProposals(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/get_requests/', bodyString, options)
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

  getProposal(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/get/', bodyString, options)
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

  getProposalByKey(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = {};
    return this.http.post(serverURL + '/sellers/requests/get/' + data.key + '/', bodyString, options)
                    .map((res: Response) => {
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
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = 'request=' + JSON.stringify(data);

    return this.http.post(serverURL + '/sellers/requests/edit_request/', bodyString, options)
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

  addProposalComment(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/products/create_request_comment/', bodyString, options)
                    .map((res: Response) => {
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
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
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
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/set_status/', bodyString, options)
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

  sendProposalToEmail(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/send_request_by_email_v2/', bodyString, options)
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

  exportProposal(data: any) {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/vnd.ms-excel',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    let bodyString = "request_id="+data.request_id;

    return this.http.post(serverURL + '/sellers/requests/export_to_excel/', bodyString,{
        headers: headers,
        responseType: ResponseContentType.Blob
    }).map((res: any) => {
      let blob = new Blob([res._body], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
          });
      FileSaver.saveAs(blob, "proposal"+data.request_id+"_"+data.customer+"_"+data.date+".xls");
      return true;
    });
  }

  revokeProposals(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/cancel/', bodyString, options)
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
  performProposal(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);

    return this.http.post(serverURL + '/sellers/requests/accept/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      return resp;
                    })
                    .catch(handleError);
  }
  setFilter(filter: any){
    this.filter = filter;
    window.localStorage.setItem('filter', JSON.stringify(filter));
  }
  setSortFilter(filterId, fieldId, order){
    filterId = filterId ==='' ? 7:filterId;
    this.filter.fields[filterId].field = fieldId;
    this.filter.fields[filterId].order = order;
    this.setFilter(this.filter);
  }
  setScrollPositionAndLimit(filterId, scroll, limit){
    filterId = filterId ==='' ? 7:filterId;
    this.filter.fields[filterId].scroll = scroll;
    this.filter.fields[filterId].limit = limit;
    this.setFilter(this.filter);
  }
  setSelectedFilter(id: any){
    this.filter.selected = id;
    this.setFilter(this.filter);
  }

  getFilter(){
    let filter = JSON.parse(window.localStorage.getItem('filter'));
    // console.log(filter);
    if(filter)
      return filter;
    return null;
  }

  downloadExcel(data: any) {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/vnd.ms-excel',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    let bodyString = "status="+data.status;

    return this.http.post(serverURL + '/sellers/requests/export_to_excel/all/', bodyString,{
        headers: headers,
        responseType: ResponseContentType.Blob
    }).map((res: any) => {
      let blob = new Blob([res._body], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
      });
      FileSaver.saveAs(blob, "Отчет_по_заявкам-" + data.status_name + ".xls");
      return true;
    });
  }
  downloadExcelItem(data: any) {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/vnd.ms-excel',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    let bodyString = "status="+data.status;

    return this.http.post(serverURL + '/sellers/requests/export_to_excel/all/v2/', bodyString,{
        headers: headers,
        responseType: ResponseContentType.Blob
    }).map((res: any) => {
      let blob = new Blob([res._body], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
      });
      FileSaver.saveAs(blob, "Отчет_по_товарам-" + data.status_name + ".xls");
      return true;
    });
  }
}
