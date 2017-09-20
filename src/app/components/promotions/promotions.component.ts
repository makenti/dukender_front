import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastyService } from 'ng2-toasty';
import { AuthService, PromotionService } from '../../services/index';

import * as globalVars from '../../common/config/globalVars';

@Component({
  selector: 'app-promotions',
  templateUrl: 'promotions.component.html',
  styleUrls: ['promotions.component.css'],
  providers: [AuthService, PromotionService]
})
export class PromotionsComponent implements OnInit {

  @ViewChild('modalDeletePromotions')
  public modalDeletePromotions:ModalDirective;

	errorMessage:any[] = [];
  promotionTypes = [
    { name: 'Акция-новинка'},
    { name: 'Акция-скидка'},
    { name: 'Акция-товарный бонус'},
    { name: 'Акция-денежный бонус'}
  ];
  promotions: any[] = [];
  selectedPromotions: any[] = [];
  loading: boolean = false;

  public searchQuery: string = '';
  private sortField:string = "id";
  private sortOrder:string = "asc";

  private selectedFilter = '';
  private timestamp: any = '';
  private limit: number = 500;

  constructor(
  	private auth: AuthService,
  	private router: Router,
  	private promotionService: PromotionService,
    private toastyService: ToastyService) {}

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(null, null);
  	this.getPromotions(globalVars.selected_promotion); // for getting selected promotion
  }

  onSearchPromotion() {
    this.getPromotions(globalVars.selected_promotion);
  }
  handleSortField(field: string){
    if(field === this.sortField){
      this.sortOrder = this.sortOrder === "asc"?"desc":"asc";
    }
    else{
      this.sortField = field;
      this.sortOrder = "asc";
    }
  }
  onScroll (e: any) {
    if(e.target.scrollHeight <= e.target.scrollTop + e.srcElement.clientHeight){
      console.log("scrolled");
      this.getPromotionsMore(globalVars.selected_promotion);
    }
  }
  getPromotions(filter: any) {
    this.limit = 500;
    this.selectedFilter = filter;
    this.promotions = [];
    this.loading = true;
    let data = {
      status: filter,
      timestamp: '',
      search_word: this.searchQuery,
      limit: this.limit
    };
  	this.promotionService.getPromotions(data)
        .subscribe(
          resp => {
            this.loading = false;
            if(resp === null) {
              this.toastyService.info('Нет активных акции');
            }else {
          		this.promotions = resp;
              this.timestamp = resp[0].timestamp; //there some problem, back give it in desc order
              console.log(this.timestamp);

            }
          },
          error =>  this.errorMessage = <any>error
        );
        // globalVars.selected_promotion = filter; // saves selected promotion
  }
  getPromotionsMore(filter: any) {
    if(this.limit === 0)
      return;
    this.selectedFilter = filter;
    let data = {
      status: filter,
      timestamp: this.timestamp,
      search_word: this.searchQuery,
      limit: this.limit
    };
    this.promotionService.getPromotions(data)
        .subscribe(
          resp => {
            if(resp.length < this.limit){
              this.limit = 0;
            }
            this.timestamp = resp[0].timestamp;
            for(var p of resp){
              this.promotions.push(p);
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onClickPromotion(prom: any) {
    this.router.navigate(['/promotion', prom.id]);
  }

  onSelectPromotion(prom: any) {
    console.log(prom);
    let ind = this.selectedPromotions.map((x: any) => {
      console.log(x);
      return x;
    }).indexOf(prom.id);
    if(ind > -1) {
      this.selectedPromotions.splice(ind, 1);
    }else {
      this.selectedPromotions.push(prom.id);
    }
  }

  clickDeleteBtn() {
    // console.log(this.selectedPromotions, this.selectedPromotions == []);
    if(this.selectedPromotions.length > 0) {
      this.modalDeletePromotions.show();
    }else {
      this.toastyService.warning('Вы не выбрали акции');
    }
  }

  deletePromotions() {
    let data = {
      news_ids: this.selectedPromotions
    };
    this.promotionService.deletePromotions(data)
        .subscribe(
          resp => {
            if(resp) {
              this.toastyService.success('Акция успешно удалена. Вы всегда можете добавить новую.');
              this.modalDeletePromotions.hide();
              this.getPromotions(this.selectedFilter);
            }else {
              this.modalDeletePromotions.hide();
              this.toastyService.success('Ошибка при удалении');
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  getStatus(status: any) {
    status = parseInt(status, 10);
    let statusText = '';
    switch (status) {
      case 0:
        statusText = 'действующая';
        break;
      case 1:
        statusText = 'будущая';
        break;
      case 2:
        statusText = 'законченная';
        break;
      case 3:
        statusText = 'удаленная';
        break;
      default:
        statusText = '';
        break;
    }

    return statusText;
  }

}
