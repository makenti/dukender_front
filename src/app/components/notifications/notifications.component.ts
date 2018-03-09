import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, CompanyProfileService } from '../../services/index';

@Component({
  moduleId: module.id,
  selector: 'app-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.css']
})
export class NotificationComponent implements OnInit{

  title = 'Уведомления';
  errorMessage = new Array();
  public notifications: any;

  constructor(
    private auth: AuthService, 
    private router: Router,
    private profile: CompanyProfileService
  ) {}
  ngOnInit(){
    this.notifications = this.auth.getUser().informations;
    this.updateUser();
  }
  onViewNotification(){
    this.notifications.map(n=>{
        this.profile.readNotifications({id: n.id})
            .subscribe(
              resp => {
                if(resp.code === 0) {
                }else {
                }
              },
              error =>  {
              }
            );
    });
  }
  arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
        if(a[i] === a[j])
          a.splice(j--, 1);
      }
    }
    return a;
  }
  updateUser(){
    this.auth.updateUser().subscribe(
        resp=>{
          if(resp.code == 0){
            this.notifications = this.arrayUnique(this.notifications.concat(resp.user.informations));
            this.onViewNotification();
          }else{}
        },
        error=>{

        }
    );
  }
}
