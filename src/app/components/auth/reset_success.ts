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
    private auth: AuthService,
    private router: Router,
    private toolbarService: ToolbarService) {
    this.toolbarService.setToolbarTitle('Восстановление пароля.');
  }
}
