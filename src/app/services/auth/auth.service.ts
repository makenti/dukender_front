import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { serverURL } from '../../common/config/server';
import { transformRequest } from '../../common/config/transformRequest';
import { handleError } from '../../common/config/errorHandler';
import { Entry } from '../../common/models/Entry';

@Injectable()
export class AuthService {

  isAuthenticated: boolean = false;
  perms = {
    requests: false,
    discounts: false,
    pricelist: false,
    staff: false,
    company: false,
    settings: false,
    branches: false,// Филиалы
  };
  public currentEntry_: Entry = null;
  constructor(
    public http: Http,
    public router: Router,
    public toasty: ToastyService
  ) {}

  get currentEntry() {
    if(window.localStorage.getItem('current_entry')) {
      return JSON.parse(window.localStorage.getItem('current_entry'));
    }
    return this.currentEntry_;
  }
  set currentEntry(entry){
    console.log(entry)
    let e = new Entry();
    e.id = entry.entry_id;
    e.name = entry.company.name;
    this.currentEntry_ = e;
    window.localStorage.setItem('current_entry', JSON.stringify(e));
  }
  authenticate(data:any): Observable<any> {

    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });
    let reqString = transformRequest(data);

    return this.http
      .post(serverURL + '/auth/login/', reqString, options)
      .map((res: Response) => {
        var resj = res.json();
        if(resj.code === 0) {
          if(resj.token !== undefined) {
            window.localStorage.setItem('auth_key', res.json().token);
            window.localStorage.setItem('user', JSON.stringify(resj.user));
            if(this.currentEntry == null)
              this.currentEntry = resj.user.entries[0];
            this.setPermissions(resj.user);
            if(resj.user.entry === null) {
              window.localStorage.setItem('user_company', JSON.stringify(''));
            }else {
              window.localStorage.setItem('user_company', JSON.stringify(resj.user.entry.company));
            }
            this.isAuthenticated = true;
          }
        }

        return resj;
      })
      .catch(handleError);
  }

  register(usercreds:any): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var creds = 'email=' + usercreds.email + '&password=' + usercreds.password;
    return this.http
      .post(serverURL + '/auth/email_register/', creds, {headers: headers})
      .map(res => {
        return res.json();
      })
      .catch(handleError);
  }

  resetPassword(username:any): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var creds = 'email=' + username;
    return this.http
      .post(serverURL + '/auth/reset/', creds, {headers: headers})
      .map(res => {
        return res.json();
      })
      .catch(handleError);
  }

  getPermissions(): Observable<any[]> {
    let headers = new Headers({ 'Auth-Token': this.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(serverURL + '/sellers/users/get_permission/', options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        window.localStorage.setItem('perms', JSON.stringify(resp.permissions));
                      }
                      return resp;
                    })
                    .catch(handleError);
  }

  changePassword(password: any): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Auth-Token', this.getToken());
    var pass1 = 'old_password=' + password.oldPassword;
    var pass2 = 'new_password1=' + password.newPassword;
    var pass3 = 'new_password2=' + password.retryPassword;
    var creds = pass1 + '&' + pass2 + '&' + pass3;
    return this.http
      .post(serverURL + '/sellers/users/change_password/', creds, {headers: headers})
      .map(res => {
        return res.json();
      })
      .catch(handleError);
  }

  updateUserInfo(): Observable<any[]> {
    let headers = new Headers({ 'Auth-Token': this.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(serverURL + '/sellers/users/get_user/', options)
              .map((res: Response) => {
                let resp = res.json();
                if (resp.code === 0) {
                  window.localStorage.setItem('user', JSON.stringify(resp.user));
                  this.setPermissions(resp.user);
                  return true;
                }else if(resp.code === 2) {
                  this.toasty.warning('Под Вашим аккаунтом был осуществлен вход с другого устройства.' +
                    'В целях безопасности рекомендуем поменять пароль.');
                  this.logout();
                  return false;
                }
                return false;
              })
              .catch(handleError);
  }
  updateUser(): Observable<any>{
    let headers = new Headers({'Auth-Token': this.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(serverURL + '/auth/get_user/', {}, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      return resp;
                    })
                    .catch(handleError);
  }
  checkAuth() {
    if(window.localStorage.getItem('auth_key')) {
      return true;
    }
    return false;
  }

  checkRegister() {
    var user = JSON.parse(window.localStorage.getItem('user'));
    var userCompany = JSON.parse(window.localStorage.getItem('user_company'));
    if(!user.is_active)
      return null;
    if(userCompany) {
      return userCompany.fill_status;
    }
    return user.entry;
  }

  logout() {
    sessionStorage.removeItem("proposals");
    sessionStorage.removeItem("proposalStats");
    sessionStorage.removeItem("last_timestamp");
    window.localStorage.removeItem('auth_key');
    window.localStorage.removeItem('user');
    this.isAuthenticated = false;
    this.router.navigate(['/landing']);
    return true;
  }

  getUser() {
    let parsedUser = JSON.parse(window.localStorage.getItem('user'));
    if(parsedUser) {
      return parsedUser;
    }
    return null;
  }
  isAdmin(){
    let parsedUser = JSON.parse(window.localStorage.getItem('user'));
    
    if(parsedUser !== null) {
      if(parsedUser.entry !== null && 
        parsedUser.entry.profile_type === 1) {
        return true;
      }
    }
    return false;
  }

  getUserCompany() {
    let parsedUserCompany = JSON.parse(window.localStorage.getItem('user_company'));
    if(parsedUserCompany) {
      return parsedUserCompany;
    }
    return null;
  }

  getToken() {
    if(window.localStorage.getItem('auth_key')) {
      return window.localStorage.getItem('auth_key');
    }
    return null;
  }

  setPermissions(user: any) {
    this.perms = {
      requests: false,
      discounts: false,
      pricelist: false,
      staff: false,
      company: false,
      settings: false,
      branches: false,
    };
    if(user !== null && user.entry !== null) {
      //Access for branches list if user has no more 1 entries
      if(user.entries !== null)
        if(user.entries.length > 1)
          this.perms.branches = true;
      if(user.entry.profile_type === 1) {
        this.perms.requests = true;
        this.perms.discounts = true;
        this.perms.pricelist = true;
        this.perms.staff = true;
        this.perms.company = true;
        this.perms.settings = true;
      }else {
        user.permissions.map((p: any) => {
          if(p.permission_type === 0) {
            this.perms.requests = true;
          }else if(p.permission_type === 1) {
            this.perms.discounts = true;
          }else if(p.permission_type === 2) {
            this.perms.company = true;
          }else if(p.permission_type === 3) {
            this.perms.pricelist = true;
          }else if(p.permission_type === 4) {
            this.perms.staff = true;
          }else if(p.permission_type === 5) {
            this.perms.settings = true;
          }
        });
      }
    }
  }

}
