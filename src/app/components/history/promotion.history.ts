import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { AuthService, HistoryService } from '../../services/index';

@Component({
  selector: 'app-promotionhistory',
  templateUrl: 'promotion.history.html',
  styleUrls: ['history.component.css'],
  providers: [ AuthService, HistoryService ]
})
export class PromotionHistoryComponent implements OnInit {

  public errorMessage: any[] = [];
  public history: any[] = [];
  public loading: boolean = false;

 	constructor(
  	public auth: AuthService,
  	public router: Router,
    public toastyService: ToastyService,
  	public historyService: HistoryService) {}

  ngOnInit() {
  	this.getHistory();
  }

  getHistory() {
		let data = {
  		history_type: 1
  	};
    this.loading = true;
  	this.historyService.getHistory(data)
        .subscribe(
          resp => {
            if(resp === null) {
              this.toastyService.warning('нет данных по изменеиям в акциях');
            }else {
          		this.history = resp;
            }
            this.loading = false;
          },
          error => this.errorMessage = <any>error
        );
  }
}
