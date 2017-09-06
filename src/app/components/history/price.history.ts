import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

import { AuthService, HistoryService } from '../../services/index';

@Component({
  selector: 'app-pricehistory',
  templateUrl: 'price.history.html',
  styleUrls: ['history.component.css'],
  providers: [ AuthService, HistoryService ]
})
export class PriceHistoryComponent implements OnInit {

  private errorMessage: any[] = [];
  private history: any[] = [];
  private loading: boolean = false;

  constructor(
  	private auth: AuthService,
  	private router: Router,
    private toastyService: ToastyService,
  	private historyService: HistoryService) {}

  ngOnInit() {
  	this.getHistory();
  }

  getHistory() {
  	let data = {
  		history_type: 0
  	};
    this.loading = true;
  	this.historyService.getHistory(data)
        .subscribe(
          resp => {
            if(resp === null) {
              this.toastyService.warning('нет данных по изменеиям в прайс-листе');
            }else {
          		this.history = resp;
            }
            this.loading = false;
          },
          error =>  this.errorMessage = <any>error
        );
  }
}
