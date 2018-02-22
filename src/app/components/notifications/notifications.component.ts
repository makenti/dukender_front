import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/index';

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

  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(){
    this.notifications = this.auth.getUser().informations;
  }
}
