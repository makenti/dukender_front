import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ToolbarService } from '../../services/index';

@Component({
  moduleId: module.id,
  selector: 'app-resetsuccess',
  templateUrl: 'reset_success.html',
  styleUrls: ['auth.css']
})
export class ResetSuccessComponent {
  constructor(
    public auth: AuthService,
    public router: Router,
    public toolbarService: ToolbarService) {
    this.toolbarService.setToolbarTitle('Восстановление пароля.');
  }
}
