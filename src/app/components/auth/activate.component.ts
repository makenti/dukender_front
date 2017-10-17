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
    private auth: AuthService,
    private router: Router,
    private toolbarService: ToolbarService) {
    this.toolbarService.setToolbarTitle('Активация');
  }
}
