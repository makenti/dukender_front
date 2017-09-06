import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/index';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService]
})
export class NavbarComponent implements OnInit {

  authorized:boolean = false;
  user: any = null;

  permissions: any[] = [];

	constructor(
    private auth: AuthService) {
  }

  ngOnInit() {
    let user = this.auth.getUser();
    this.auth.setPermissions(user);
  }

}
