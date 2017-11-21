import { Component, OnInit } from '@angular/core';
import { AuthService, ToolbarService } from '../../services/index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ AuthService, ToolbarService ]
})
export class HeaderComponent implements OnInit {

  lang: string;
	dropds: boolean;

  constructor(
    public auth: AuthService,
    public toolbarService: ToolbarService
  ) { }

  ngOnInit() {
    this.lang = localStorage.getItem('lang') || 'ru';
  }

  selectLanguage = (lang: string) => {
	 localStorage.setItem('lang', lang);
	 window.location.href = '/';
	}

	logout() {
		this.auth.logout();
  }

}
