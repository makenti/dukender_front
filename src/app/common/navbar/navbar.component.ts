import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/index';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})

export class NavbarComponent implements OnInit {

  constructor(
    public auth: AuthService) {
  }

  ngOnInit() {
    this.setPermissions();
  }

  ngDoCheck(){
    this.setPermissions();
  }

  setPermissions(){
    let user = this.auth.getUser();
    this.auth.setPermissions(user);
  }
}
