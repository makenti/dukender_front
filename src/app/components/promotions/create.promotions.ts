import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

import { AuthService, PromotionService } from '../../services/index';

import * as moment from 'moment';
import 'moment/min/locales';
moment.locale('ru-ru');

import { ToastyService } from 'ng2-toasty';
// import { DaterangepickerConfig } from 'ng2-daterangepicker';

/**
 * This class represents the lazy loaded promotionsComponent.
 */
@Component({
  selector: 'app-promcreate',
  templateUrl: 'create.promotions.html',
  styleUrls: ['promotions.component.css'],
  providers: [AuthService, PromotionService]
})
export class CreatePromotionsComponent implements OnInit {

	errorMessage = new Array();
	promotionType: any;
  promotionProducts: any[] = [];
	promotionPercents: any[] = [];
  promotionsData: any[] =  [];
  promotion_name: string = '';
  promotion_percent: any = 0;
  newPromotion: any = {
    action_type: 0,
    date_start: moment().unix().toString(),
    date_end: moment().unix().toString(),
    news: []
  };
  companyProfile: any = null;
  daterange: any = {};

  @ViewChild('modalShowInfo')
  modalShowInfo:ModalDirective;

  constructor(
  	private auth: AuthService,
  	private router: Router,
  	private route: ActivatedRoute,
  	private promotionService: PromotionService,
    private toastyService: ToastyService,
    // private daterangepickerOptions: DaterangepickerConfig
    ) {
    // this.daterangepickerOptions.settings = {
    //   locale: {
    //     format: 'DD.MM.YYYY',
    //     cancelLabel: 'Отмена',
    //     applyLabel: 'Ок',
    //   },
    //   minDate: moment(),
    //   alwaysShowCalendars: false,
    // };
  }

  ngOnInit() {
  	this.newPromotion.action_type = +this.route.snapshot.params['type'];
    this.promotionType = +this.route.snapshot.params['type'];
  	this.promotionProducts = this.promotionService.selectedProducts;
    this.promotionPercents = this.promotionService.getPromotionPercents();
    this.companyProfile = this.auth.getUserCompany();
    if(this.promotionProducts === undefined) {
      this.router.navigate(['/promotion-products']);
    }

    // let prom: any = null;
    this.promotionsData = [];
    for(let item in this.promotionProducts) {
      let prod = this.promotionProducts[item];
      console.log(prod);
      let prom = {
        item_id: prod.id,
        new_price: 0,
        for_count: 0,
        bonus_count: 0,
        bonus_amount: 0,
        bonus_item_id: prod.id,
        removed: false
      };

      this.promotionsData[prod.id] = prom;
    }
    // console.log(this.promotionsData);

    if(this.promotionType === 0) {
      this.promotion_name = '«Новинка»';
    }else if(this.promotionType === 1) {
      this.promotion_name = '«Скидка»';
    }else if(this.promotionType === 2) {
      this.promotion_name = '«Товарный бонус»';
    }else if(this.promotionType === 3) {
      this.promotion_name = '«Денежный бонус»';
    }

    this.modalShowInfo.config = {
      backdrop: 'static'
    };
    if(this.promotionProducts !== undefined) {
      this.checkPromotion();
    }
  }

  // "request_percent":1,
  // "action_news_percent":3,
  // "left_balance":188321.05,
  // "action_discount_percent":2,
  // "action_bonus_item_percent":3,
  // "action_bonus_money_percent":2

  checkPromotion() {
    console.log(this.promotionPercents);
    if(this.promotionPercents !== undefined && this.promotionPercents !== null) {
      let settings: any = this.promotionPercents;
      if(this.promotionType === 0) {
        this.promotion_percent = settings.action_news_percent;
      }else if(this.promotionType === 1) {
        this.promotion_percent = settings.action_discount_percent;
      }else if(this.promotionType === 2) {
        this.promotion_percent = settings.action_bonus_item_percent;
      }else if(this.promotionType === 3) {
        this.promotion_percent = settings.action_bonus_money_percent;
      }
      this.modalShowInfo.show();
    }
  }

  discardCreate() {
    this.router.navigate(['/promotion-products']);
  }

  onDateRangeChanged(event:any) {

    let formattedStart = moment(event.start).unix();
    let formattedEnd = moment(event.end).unix();

    this.newPromotion.date_start = formattedStart.toString();
    this.newPromotion.date_end = formattedEnd.toString();
  }

  onChangePrice(e: any, item: any) {
    console.log(e, item);
    if(parseInt(e, 10) < 0) {
      item.count = 1;
    }
  }

  onChangeBonus(event: any, product: any) {
    let bonusAmount  = parseInt(event.target.value, 10);

    if(bonusAmount > product.price) {
      this.toastyService.warning('Денежный бонус не может быть больше цены товара');
      event.target.value = 0;
    }
  }

  checkForInteger(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      this.toastyService.warning('Здесь должны быть только целые числа');
      event.preventDefault();
    }
  }

  checkPromotionsData() {
    // if(this.promotionType === 0) {
    //   console.log('«Новинка»');
    // }else if(this.promotionType === 1) {
    //   console.log('«Скидка»');
    // }else if(this.promotionType === 2) {
    //   console.log('«Товарный бонус»');
    // }else if(this.promotionType === 3) {
    //   console.log('«Денежный бонус»');
    //   this.promotionsData.map((item, index) => {
    //     if(item)
    //   })
    // }
  }

  removePromItem(item: any) {
    item.removed = true;
  }

  returnPromItem(item: any) {
    item.removed = false;
  }

  createPromotion() {

    this.checkPromotionsData();
    this.newPromotion.news = [];
    this.promotionsData.map((item, index) => {
      console.log(item);
      if(!item.removed) {
        this.newPromotion.news.push(item);
      }
    });

    // console.log(this.newPromotion);

    this.promotionService.createPromotion(this.newPromotion)
        .subscribe(
          resp => {
            if(resp.code === 0) {
              this.toastyService.success('Акция успешно создана!');
              this.router.navigate(['/promotions']);
              this.promotionService.selectedProducts = [];
            }else {
              this.toastyService.error(resp.message);
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  selectedDate(value: any) {
    console.log(value);
    this.daterange.start = value.start;
    this.daterange.end = value.end;
  }
}
