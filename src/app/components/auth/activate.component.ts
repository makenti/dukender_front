import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ToolbarService } from '../../services/index';

@Component({
  moduleId: module.id,
  selector: 'app-activate',
  templateUrl: 'activate.component.html',
  styleUrls: ['auth.css']
})
export class ActivateComponent {
  constructor(
    public auth: AuthService,
    public router: Router,
    public toolbarService: ToolbarService) {
    this.toolbarService.setToolbarTitle('Активация');
  }
}
