import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, PromotionService } from '../../services/index';

import * as moment from 'moment';
import 'moment/min/locales';
moment.locale('ru-ru');

/**
 * This class represents the lazy loaded promotionsComponent.
 */
@Component({
  selector: 'app-promshow',
  templateUrl: 'show.promotion.html',
  styleUrls: ['promotions.component.css'],
})
export class ShowPromotionComponent implements OnInit {

	errorMessage = new Array();
	promotion: any = null;
  promID: any = null;
  promTitle: string = '';
  promotionType: any = null;

  private bonusItem: any = null;

  constructor(
  	private auth: AuthService,
  	private router: Router,
  	private route: ActivatedRoute,
  	private promotionService: PromotionService
    ) {
    // console.log("init show promotion");
  }

  ngOnInit() {
    this.promID = +this.route.snapshot.params['id'];
    this.getPromotion();
  }

  getPromotion() {
    let data = {
      news_id: this.promID
    };
    this.promotionService.getSinglePromotion(data)
        .subscribe(
          resp => {
            if(resp.code === 0) {
              this.promotion = resp.news;
              this.composePromotion();
              
              if(this.promotion.action_type === 2){
                this.bonusItem = this.promotion.item;
                if(this.promotion.bonus_item !== null)
                  this.bonusItem = this.promotion.bonus_item;
              }            
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  composePromotion() {
    this.promotionType = this.promotion.action_type;
    if(this.promotionType === 0) {
      this.promTitle = '«Новинка»';
    }else if(this.promotionType === 1) {
      this.promTitle = '«Скидка»';
    }else if(this.promotionType === 2) {
      this.promTitle = '«Товарный бонус»';
    }else if(this.promotionType === 3) {
      this.promTitle = '«Денежный бонус»';
    }
  }

  onPrintPromotion() {
    let printContents: any, popupWin: any;
    printContents = document.getElementById('promotionPrintContent').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
            body {
              font-size: 16px;
              font-family: 'Open Sans', sans-serif;
              font-weight: normal;
              font-style: normal;
              font-stretch: normal;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .no-print{display:none}
            .show-print{display:block}
            table{
              border: 1px solid #111;
              border-collapse: collapse;
            }
            table th, table td {padding: 4px 10px;border: 1px solid black;}
            .sign-place{height: 40px; width: 300px; border-bottom: 1px solid #111;}
          </style>
        </head>
        <body onload="window.print();window.close()">
          ${printContents}
          <div>
            <label>Утверждаю уполномоченное лицо</label>
            <div class="sign-place"></div>
          </div>
        </body>
      </html>`
    );
    //
    popupWin.document.close();
  }

}
