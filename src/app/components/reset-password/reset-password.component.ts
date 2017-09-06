import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

import { AuthService, ToolbarService } from '../../services/index';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [ AuthService, ToolbarService ]
})
export class ResetPasswordComponent implements OnInit {

  @ViewChild('childModal')
  modal:ModalDirective;

  resetUser = {
    username: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private toolbarService: ToolbarService,
    private toastyService: ToastyService
  ) { }

  ngOnInit() {
    this.toolbarService.setToolbarTitle('Восстановление пароля.');
  }

  onResetEnter(event:any) {
    if(event.keyCode === 13) {
      this.reset();
    }
  }
  reset() {
    this.auth.resetPassword(this.resetUser.username)
        .subscribe((res) => {
          if(res.code === 0) {
            this.modal.show();
          }else {
            this.toastyService.warning('Такой емайл не найден');
          }
        });
  }

  onOkReset() {
    this.modal.hide();
    this.router.navigate(['/landing']);
  }

}
