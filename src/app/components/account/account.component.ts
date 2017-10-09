import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { ToastyService } from 'ng2-toasty';
import { AuthService, AccountService } from '../../services/index';

@Component({
  moduleId: module.id,
  selector: 'app-account',
  templateUrl: 'account.component.html',
  styleUrls: ['account.component.css']
})
export class AccountComponent implements OnInit {

  private errorMessage: any[] = [];
  private accountsData: any[] = [];
  private startSaldo: number;
  private endSaldo: number;
  private turnover: number;
  private posTurnover: number;
  private years: any[] = [];
  private selectedYear: number = 2017;
  private selectedMonth: number = moment().month() + 1;
  private userCompany: any = null;
  private loading: boolean = false;
  private currentDate: any = moment().format('DD MMMM YYYY');

  private allCredits: number = 0;

  private selectedDates = {
    month: moment().month(),
    year: moment().year()
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastyService: ToastyService,
    private accountsService: AccountService) {
    this.years = [2016, 2017, 2018];
    console.log(moment().month() + 1);
  }

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(null, null);
    this.getAccounts();
    this.userCompany = this.auth.getUserCompany();
  }

  onChangeDate(event:any) {
    if(parseInt(event, 10) > 12) {
      this.selectedYear = event;
      this.selectedDates.year = event;
    }else {
      this.selectedMonth = event;
      this.selectedDates.month = event;
    }
    this.getAccounts();
  }

  getAccounts() {
    let data = {
      month: this.selectedMonth,
      year: this.selectedYear
    };
    this.loading = true;
    this.accountsService.getAccounts(data)
        .subscribe(
          resp => {
            this.accountsData = [];
            this.startSaldo = 0;
            if(resp === null || resp === undefined) {
              this.toastyService.warning('нет данных по данному периоду');
            }else {
              this.startSaldo = resp.start_saldo;
              let s = resp.start_saldo;
              this.allCredits = 0;
              resp.accounts.map((item: any) => {
                let credit = 0;
                let debet = 0;
                if(item.account_type === 0) {
                  s = s - parseFloat(item.total_credit);
                  credit = item.total_credit;
                }else {
                  s = s + parseFloat(item.debet);
                  debet = item.debet;
                }
                this.allCredits += credit;
                let data = {
                  date: moment(item.timestamp / 1000).format('DD-MM-YYYY'),
                  requestID: (item.request !== null) ? item.request.request_id: '',
                  totalPrice: (item.request !== null) ? item.request.total_price: 0,
                  debet: debet,
                  credit: credit,
                  bonusItem: item.action_bonus_item_total,
                  bonusMoney: item.action_bonus_money_total,
                  discount: item.action_discount_total,
                  news: item.action_news_total,
                  reqMoney: item.request_total,
                  customerBonus: item.customer_bonus_money_total,
                  saldo: s,
                };
                this.accountsData.push(data);
              });
              this.endSaldo = s;
              this.turnover = this.endSaldo - this.startSaldo;
              this.posTurnover = (this.turnover < 0) ? -(this.turnover): this.turnover;
            }
            this.loading = false;
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onPrintAccounts() {
    let printContents: any, popupWin: any;
    printContents = document.getElementById('accountsPrintContent').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Лицевой счет</title>
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
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  onPrintPayment() {
    let printContents: any, popupWin: any;
    printContents = document.getElementById('paymentPrintContent').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Счет на оплату</title>
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
            p{margin: 0px;}
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}