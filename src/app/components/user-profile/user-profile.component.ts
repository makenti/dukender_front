import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng2-toasty';

import { AuthService } from '../../services/index';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [ AuthService, ToastyService ]
})
export class UserProfileComponent implements OnInit {

  profile: any = null;

  password = {
    oldPassword: '',
    newPassword: '',
    retryPassword: ''
  };

  constructor(
    private auth: AuthService,
    private toastyService: ToastyService
  ) { }

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(null, null);
  	if(this.auth.checkAuth()) {
      this.profile = this.auth.getUser();
      if(this.profile.entry === null) {
        this.profile.entry = '';
      }
  	}
  }

  saveNewPassword() {
    this.auth.changePassword(this.password)
              .subscribe((res) => {
                if(res.code === 0) {
                  this.toastyService.success(res.message);
                  this.password = {
                    oldPassword: '',
                    newPassword: '',
                    retryPassword: ''
                  };
                } else {
                  if(res.code === 1) {
                    this.toastyService.warning(res.message);
                  }else {
                    this.toastyService.warning('Ошибка не сервере');
                  }
                }
              });
  }

  getProfileName(type: any) {
    type = parseInt(type, 10);
    let name = '';
    switch (type) {
      case 1:
        name = 'Администратор';
        break;
      case 2:
        name = 'Оператор прайс-листа';
        break;
      case 3:
        name = 'Оператор заявок';
        break;
      case 4:
        name = 'Оператор акций';
        break;
      default:
        name = '';
        break;
    }
    return name;
  }

}
