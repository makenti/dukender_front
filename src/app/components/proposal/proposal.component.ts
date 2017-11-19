import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastyService } from 'ng2-toasty';

import * as moment from 'moment';

import {
			AuthService,
		  ProposalService,
      CustomersService } from '../../services/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  selector: 'app-proposal',
  templateUrl: 'proposal.component.html',
  styleUrls: ['proposal.component.css']

})

export class ProposalComponent implements OnInit  {

  deliveryChanged: boolean = false;
  countChanged: boolean = false;
  changedItems: any[] = [];
  changedClientItems: any[] = [];
  itemsTotalSum: number = 0;
  locale: string = 'ru';
  myDatePickerOptions = {
    todayBtnTxt: 'Сегодня',
    dateFormat: 'dd.mm.yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    height: '25px',
    width: '160px',
    inline: false,
    disableUntil: new Date(),
    selectionTxtFontSize: '13px'
  };

  Math: any;

  @ViewChild('modalEnterEmail')
  modalEnterEmail: ModalDirective;

  @ViewChild('modalBanCustomer')
  modalBanCustomer: ModalDirective;

  @ViewChild('modalPrevData')
  modalPrevData: ModalDirective;

  @ViewChild('modalChanges')
  modalChanges: ModalDirective;

  @ViewChild('modalDeleteProposal')
  modalDeleteProposal: ModalDirective;

  private searchQuery: string = '';
	private errorMessage = new Array();
	private proposal: any = null;
  private proposalItems = new Array();
  private proposalItemsToSend = new Array();
	private mode: string = 'read';
	private emailToSend: string = '';
  private id: number;
  private deliveryDate: any = '';
  private deliveryDateText: any = '';
  private selDate: Object = {year: 0, month: 0, day: 0};

  private proposalDate: any = '';
  private newComment: string;
  private currUser: any;
  // private accessToEdit: boolean = true;
  private accessToExec: boolean = true;
  private editMode: boolean = true;
  private delete: boolean = false;
  private isEditableProposal: boolean = false;

  // private proposalBeforeEdit:any = '';
  private proposalBefore: string = '';
  private deliveryBefore: string = '';
  private itemToShow: any = null;
  private customerAddress: string = '';
  private proposalBodyClass: string = 'h';
  private id_1c: number;
  private id_1c_changed: boolean = false;
  private name_1c: string = "";
  private info: string = "";
  constructor(
  	private auth: AuthService,
  	private router: Router,
  	private route: ActivatedRoute,
    private proposalService: ProposalService,
  	private customerService: CustomersService,
    private toastyService: ToastyService) {}

  ngOnInit() {
    this.Math = Math;
    this.auth.updateUserInfo().subscribe(null, null);
    this.currUser = this.auth.getUser();
  	this.route.params.subscribe(params => {
      this.id = parseInt(params['id'], 10);
      this.getProposal();
    });
    this.deliveryChanged = false;
    this.countChanged = false;
  }

  getProposal() {
    let data = {
     request_id: this.id
    };
    this.proposalService.getProposal(data)
       .subscribe(
         resp => {
           if(resp === null) {
             console.log('no request');
           }else {
             this.proposal = resp;
             this.proposalItems = [];
						 console.log(this.proposal.status);
             if((this.proposal.status === 1 || this.proposal.status === 5) &&
                 this.proposal.editor === this.currUser.username) {
               this.mode = 'edit';
             }
            //  for(var i=0; i < this.currUser.permissions.length; i++){
            //    if(this.currUser.permissions[i].permission_type === 0 && this.proposal.status !== 3)
            //      this.mode = 'edit'; //TODO: eshe nuzhno uchest' kompaniu i sotrudnika?
            //  }
             if(this.proposal.status === 2){
               this.editMode = false;
             }
             if(resp.create_time !== '')
               this.proposalDate = moment(parseInt(resp.create_time, 10)/1000).format('DD.MM.YYYY');

             if(resp.customer !== '')
               this.customerAddress =  resp.customer.district.region.name + ' ' +
                                       resp.customer.district.name + ' ' +
                                       resp.customer.address;

             if(resp.delivery_time !== '') {
               this.deliveryDate = moment(parseInt(resp.delivery_time, 10)).toDate();
               this.selDate = {year: this.deliveryDate.getFullYear(),
                               month: this.deliveryDate.getMonth() + 1,
                               day: this.deliveryDate.getDate()};

               this.deliveryDateText = moment(this.deliveryDate).format('DD.MM.YYYY');
               this.deliveryBefore = moment(parseInt(resp.delivery_time, 10)).format('DD.MM.YYYY');
             }
             if(this.proposal.status === 2){
               if(moment().diff(this.deliveryDate, 'days') > 5){
                 this.delete = true;
               }
             }
             for( let item of resp.items) {
               let pr = parseInt((item.action_discount_active)?item.new_price:item.price, 10);
               let p = {
                 item_id: item.id,
                 count: item.count,
                 price: pr,
                 name: item.name,
                 nomenclature: item.nomenclature,
                 action_news_active: item.action_news_active,
                 action_discount_active: item.action_discount_active,
                 action_bonus_item_active: item.action_bonus_item_active,
                 action_bonus_money_active: item.action_bonus_money_active,
                 removed: item.deleted,
                 item_info: item,
                 bonus_item: item.bonus_item
               };
               if(!(p.removed && this.proposal.status !== 1 && this.proposal.status !== 5)) {
                 this.proposalItems.push(p);
                 this.proposalBefore += p.item_id+':'+p.count+',' +p.removed+',';
               }
             }
             this.itemsTotalSum = resp.total_price;
             if(this.proposal.status !== 2 && this.proposal.status !== 3 && this.proposal.status !== 6)
               this.checkChangesInPriceList();

            //if tovarnyi bonus:
            for(let i = 0; i < this.proposalItems.length; i++) {
              let item = this.proposalItems[i];
              if(item.bonus_item !== null &&
                item.bonus_item !== undefined){
                item.bonus_item.price = 0;
                item.bonus_item.is_bonus = true;
                item.bonus_item.count = this.Math.trunc(item.count / item.item_info.for_count * item.item_info.bonus_count);
                this.proposalItems.splice(i+1, 0, item.bonus_item);
              }
            }
            this.proposalBodyClass = "h"+this.proposalItems.length;
           }
         },
         error =>  this.errorMessage = <any>error
       );
   }

  checkChangesFromClient() {
    this.proposal.items.map((p: any) => {
      let changedObj = {
        item: p.name,
        action_bonus_item: '',
        action_bonus_money: '',
        action_discount: '',
        action_news: '',
        price: ''
      };

      if(p.count !== p.prev_count) {
        this.countChanged = true;
      }
      if(p.delivery_time !== p.prev_delivery_time) {
        this.deliveryChanged = true;
      }
      this.changedClientItems.push(changedObj);
    });
  }

  checkChangesInPriceList() {
    this.proposal.items.map((p: any) => {
      let changedObj = {
        item: p.name,
        action_bonus_item: '',
        action_bonus_money: '',
        action_discount: '',
        action_news: '',
        price: ''
      };
      if(p.action_bonus_item_active !== p.item_info.action_bonus_item_active) {
        changedObj.action_bonus_item = 'Акция "Товарный бонус" ';
        if(p.item_info.action_bonus_item_active) {
          changedObj.action_bonus_item += 'добавлен. ';
        }else {
          changedObj.action_bonus_item += 'удален. ';
        }
      }else {
        if(p.for_count !== p.item_info.for_count) {
          changedObj.action_bonus_item += 'По акции "Товарный бонус"" изменилось кол. товара: ' + p.item_info.for_count;
        }
        if(p.bonus_count !== p.item_info.bonus_count) {
          changedObj.action_bonus_item += 'По акции "Товарный бонус" изменилось кол. бонуса: ' + p.item_info.bonus_count;
        }
      }
      if(p.action_bonus_money_active !== p.item_info.action_bonus_money_active) {
        changedObj.action_bonus_money = 'Акция "Денежный бонус" ';
        if(p.item_info.action_bonus_money_active) {
          changedObj.action_bonus_money += 'добавлен. ';
        }else {
          changedObj.action_bonus_money += 'удален. ';
        }
      }else {
        if(p.bonus_amount !== p.item_info.bonus_amount) {
          changedObj.action_bonus_money += 'По акции "Денежный бонус" изменилось кол. бонуса: ' + p.item_info.bonus_amount;
        }
      }
      if(p.action_discount_active !== p.item_info.action_discount_active) {
        changedObj.action_discount = 'Акция "Скидка" ';
        if(p.item_info.action_discount_active) {
          changedObj.action_discount += 'добавлен. ';
        }else {
          changedObj.action_discount += 'удален. ';
        }
      }
      if(p.action_news_active !== p.item_info.action_news_active) {
        changedObj.action_news = 'Акция "Новинка" ';
        if(p.item_info.action_news_active) {
          changedObj.action_news += 'добавлен. ';
        }else {
          changedObj.action_news += 'удален. ';
        }
      }
      if(p.price !== p.item_info.price) {
        changedObj.price = 'Изменилась цена товара. Новая цена ' + p.item_info.price;
      }
      if(changedObj.action_bonus_item !== '' ||
        changedObj.action_bonus_money !== '' ||
        changedObj.action_discount !== '' ||
        changedObj.action_news !== '' ||
        changedObj.price !== '')
        this.changedItems.push(changedObj);
    });

    if(this.changedItems.length > 0) {
      this.modalChanges.show();
    }
  }

  checkEditted() {
    let newProposalStr = '';
    this.itemsTotalSum = 0;

    if(this.proposalItems.length === 0)
      return false;

    for(let pr of this.proposalItems) {
      newProposalStr += pr.item_id+':'+pr.count+','+pr.removed+',';
      if(!pr.removed)
        this.itemsTotalSum += parseInt(pr.count, 10) * parseInt(pr.price, 10);
    }
    // console.log(this.proposalBefore, newProposalStr);
    if(this.proposalBefore !== newProposalStr) {
      return false;
    }
    if(this.deliveryBefore !== moment(this.deliveryDate).format('DD.MM.YYYY')) {
      return false;
    }
    return true;
  }

  checkForm() {
    this.collectProposalItems();
    if(this.deliveryDate === '') {
      this.toastyService.warning('Не указана дата доставки');
      return false;
    }
    if(moment().diff(moment(this.deliveryDate), 'days') > 0){
      this.toastyService.warning('Время доставки должно быть после сегодняшней даты');
      return false;
    }
    if(moment().diff(this.deliveryDate, 'days') + 15 < 0) {
      this.toastyService.warning('Время доставки не должно быть позже 15 дней');
      return false;
    }
    return true;
  }

  // "delivery_time": "", "delivery_time_saved": "", "request_id": 7, "ready": 1,
  // "items": [{ "item_id": 1, "count": 100, "saved_count": 100 }]

  collectProposalItems() {
    this.proposalItemsToSend = [];
    this.proposalItems.map((p: any) => {
      if(!p.removed && p.is_bonus !== true) {
        let proposal = {
          item_id: p.item_id,
          count: p.count,
          saved_count: p.item_info.saved_count
        }
        this.proposalItemsToSend.push(proposal);
      }
    });
  }

  onSaveProposal(type: boolean) {
    if(this.checkForm()) {
      let date = moment(this.deliveryDate);
      let data = {
        ready: type,
        request_id: this.proposal.request_id,
        delivery_time: moment(date).valueOf(),
        items: this.proposalItemsToSend
      };

      this.proposalService.editProposal(data)
          .subscribe(
            resp => {
              if(resp !== null && resp.code === 0) {
                if(resp.status === 4) {
                  this.toastyService.info('Ваша заявка отправлена заказчику');
                  this.mode = 'read';
                }else if(resp.status === 7) {
                  this.toastyService.success('Вы успешно сохранили');
                }
                this.proposal = resp;
              }else {
                this.toastyService.error('Ошибка на сервере');
              }
            },
            error =>  this.errorMessage = <any>error
          );
    }
  }

  onChangeProposal() {
    if(this.proposal.status === 0) {
      let data = {
        request_id: this.proposal.request_id,
        status: 1
      };
      this.proposalService.setProposalStatus(data)
          .subscribe(
            resp => {
              if(resp !== null) {
                this.getProposal();
                this.mode = 'edit';
              }else {
                this.toastyService.warning('Error');
              }
            },
            error =>  this.errorMessage = <any>error
          );
    }else if(this.proposal.status !== 4 && this.proposal.editor === this.currUser.username) {
      this.mode = 'edit';
    }else {
      this.toastyService.error('Нет доступа');
    }
  }

  onChange(e: any, item: any) {
    if(parseInt(e, 10) < 0) {
      item.count = 1;
    }else {
      this.proposalItems.map((p) => {
        if(p.item_id === item.item_id) {
          p = item;
        }
        return p;
      });

      if(!this.checkEditted()) {
        this.editMode = false;
        this.accessToExec = true;
      }else {
        this.editMode = true;
        this.accessToExec = false;
      }
    }
  }

  removeProposalItem(item: any) {
    item.removed = true;
    if(!this.checkEditted()) {
      this.editMode = false;
      this.accessToExec = true;
    }else {
      this.editMode = true;
      this.accessToExec = false;
    }
  }

  returnProposalItem(item: any) {
    item.removed = false;

    if(!this.checkEditted()) {
      this.editMode = false;
      this.accessToExec = true;
    }else {
      this.editMode = true;
      this.accessToExec = false;
    }
  }

  onExecuteProposal() {
    if(this.checkForm()) {
      console.log('exec proposal');
      let data = {
        request_id: this.proposal.request_id,
        status: 2,
        delivery_time: moment(this.deliveryDate).valueOf(),
      };


      this.proposalService.setProposalStatus(data)
          .subscribe(
            resp => {
              console.log(resp);
              if(resp !== null && resp.code === 0) {
                this.toastyService.success('Заявка отправлена в доставку');
                this.proposal = resp.result;
                this.mode = 'read';
              }else {
                this.toastyService.error('Ошибка при отправке');
              }
            },
            error =>  this.errorMessage = <any>error
          );
    }
  }

  openSendModal() {
    this.modalEnterEmail.show();
  }

  onSendToEmail() {
    let data = {
      request_id: this.id,
      email: this.emailToSend
    };
    this.proposalService.sendProposalToEmail(data)
        .subscribe(
          resp => {

            if(resp) {
              this.toastyService.success('Заявка успешно отправлена на емайл');
            }else {
              this.toastyService.error('Ошибка при отправке');
            }
            this.modalEnterEmail.hide();
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onExportProposal() {
  	let data = {
  		request_id: this.id,
			customer: this.proposal.customer.name,
			date: this.proposalDate
  	};
  	this.proposalService.exportProposal(data)
        .subscribe(
          resp => {
          	if(resp) {
          		this.toastyService.success('Успешно экспортирован');
          	}else {
          		this.toastyService.error('Ошибка на сервере');
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onRevokeProposal() {
    let data = {
      request_ids: [this.proposal.request_id]
    };
    this.proposalService.revokeProposals(data)
        .subscribe(
          resp => {

            if(resp) {
              this.toastyService.info('Ваша заявка удалена');
              this.router.navigate(['/proposals']);
            }else {
              this.toastyService.error('Ошибка на сервере');
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onCommentEnter(event: any) {
    if(event.keyCode === 13) {
      this.addComment();
    }
  }

  addComment() {
    if(this.newComment !== '') {
      let data = {
        request_id: this.id,
        comment: this.newComment
      };
      this.proposalService.addProposalComment(data)
          .subscribe(
            resp => {

              if(resp !== null) {
                this.proposal.comments.push(resp);
                this.newComment = '';
              }else {
                this.toastyService.error('Ошибка на сервере');
              }
            },
            error =>  this.errorMessage = <any>error
          );
    }
  }

  updateComments() {
    let data = {
      request_id: this.id
    };
    this.proposalService.updateComments(data)
        .subscribe(
          resp => {

            if(resp !== null) {
              this.proposal.comments = resp;
            }else {
              this.toastyService.error('Ошибка на сервере');
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onDateChanged(event: any) {
    if(moment().diff(event.jsdate, 'days') > 0){
      this.toastyService.warning('Время доставки должно быть после сегодняшней даты');
      // this.deliveryDate = moment();
    }else if(moment().diff(event.jsdate, 'days') + 15 < 0) {
      this.toastyService.warning('Время доставки не должно быть позже 15 дней');
      // this.deliveryDate = moment();
    }else {
      this.deliveryDate = event.jsdate;
      this.deliveryDateText = moment(this.deliveryDate).format('DD.MM.YYYY');
    }

    // if(!this.checkEditted()) {
      // this.editMode = false;
      // this.accessToExec = true;

    // }else {
      // this.editMode = true;
      // this.accessToExec = false;
    // }
    if(this.checkEditted()){
      this.editMode = true;
      this.accessToExec = false;
    }
  }

  banCustomer() {
    let data = {
      shop_ids: [this.proposal.customer.id]
    };
    this.customerService.banCustomer(data)
        .subscribe(
          resp => {

            if(resp) {
              this.toastyService.warning('Поставщик '+ this.proposal.customer.name +
                ' добавлен в черный список, для восстановления из чёрного '+
                'списка пройдите по закладке компания чёрный список');
              this.modalBanCustomer.hide();
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onShowItemOldData(item: any) {

    if(item.item_info.count !== item.item_info.prev_count) {
      this.countChanged = true;
    }
    if(item.delivery_time !== item.prev_delivery_time) {
      this.deliveryChanged = true;
    }
    this.itemToShow = item;
    this.modalPrevData.show();
  }

  onSetCustomerStatus() {
    let data = {
      shop_id: this.proposal.customer.id,
      relation: (parseInt(this.proposal.relation, 10) + 1) % 2
    };
    this.customerService.setCustomerStatus(data)
        .subscribe(
          resp => {

            if (resp.code === 0)
              this.proposal.relation = (parseInt(this.proposal.relation, 10) + 1) % 2;
          },
          error =>  this.errorMessage = <any>error
        );
  }

  getRelationText(rel: any) {
    if(parseInt(rel, 10) === 0) {
      return 'Новичок';
    }else {
      return 'Надежный';
    }
  }

  onSwitchRead() {
  	this.mode = 'read';
  }

  onPrintProposal() {
    let printContents: any, popupWin: any;
    printContents = document.getElementById('proposalPrintContent').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Заявка</title>
          <style>
            @media print {
              .no-print {
                display: none;
              }
              .only-print {
                display: inline-block;
              }
            }
          </style>
        </head>
        <body onload='window.print();window.close()'>
          <div style="display:flex; width: 100%; justify-content: center;">
            <img src="../../assets/images/logo.png" alt="dukender.kz"/>
          </div>
          ${printContents}
        </body>
      </html>`
    );
    popupWin.document.close();
  }
}
