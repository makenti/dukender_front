import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

import { AuthService, HistoryService, ErrorService } from '../../services/index';

@Component({
  selector: 'app-requesthistory',
  templateUrl: 'request.history.html',
  styleUrls: ['history.component.css'],
  providers: [ AuthService, HistoryService ]
})
export class RequestHistoryComponent implements OnInit {

  public errorMessage: any[] = [];
  public history: any[] = [];
  public loading: boolean = false;

  constructor(
  	public auth: AuthService,
  	public router: Router,
    public errorService: ErrorService,
    public toastyService: ToastyService,
  	public historyService: HistoryService) {}

  ngOnInit() {
  	this.getHistory();
  }

  getHistory() {
  	let data = {
  		history_type: 2
  	};
    this.loading = true;
  	this.historyService.getHistory(data)
        .subscribe(
          resp => {
          	if(resp === null) {
              this.toastyService.warning('нет данных по изменеиям в заявках');
            }else {
          		this.history = resp;
            }
            this.loading = false;
          },
          error => {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
}
