import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

import { AuthService, CustomersService } from '../../services/index';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  selector: 'app-blacklist',
  templateUrl: 'black_list.component.html',
  styleUrls: ['customers.component.css'],
  providers: [AuthService, CustomersService]
})
export class BlackListComponent implements OnInit {

	private errorMessage: any[] = [];
	private bannedCustomers: any[] = [];
	private selectedCustomers: any[] = [];
  private loading: boolean = false;

  constructor(
  		private auth: AuthService,
  		private router: Router,
  		private customerService: CustomersService,
      private toastyService: ToastyService) {}

  ngOnInit() {
  	this.getBannedCustomers();
  }

  getBannedCustomers() {
    this.loading = true;
  	this.customerService.getBannedCustomers()
        .subscribe(
          resp => {
            if(resp.length === 0) {
              this.toastyService.warning('черный список пуст');
            }else {
          		this.bannedCustomers = resp;
            }
            this.loading = false;
          },
          error => this.errorMessage = <any>error
        );
  }

  onSelectCustomer(item: any) {
    let ind = this.selectedCustomers.map(function(e) { console.log(e); return e; }).indexOf(item.shop.id);
    if(ind > -1) {
      this.selectedCustomers.splice(ind, 1);
    }else {
      this.selectedCustomers.push(item.shop.id);
    }
  }

  unBanCustomer() {
  	let data = {
  		shop_ids: this.selectedCustomers
  	};
  	this.customerService.unBanCustomer(data)
        .subscribe(
          resp => {
            if(resp) {
              this.getBannedCustomers();
              this.selectedCustomers = [];
              this.toastyService.success('Вы успешно убрали');
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  getCategory(catNum: any) {
    let catCode: string = '';
    switch (catNum) {
      case 0:
        catCode = 'A';
        break;
      case 1:
        catCode = 'B';
        break;
      case 2:
        catCode = 'C';
        break;
      case 3:
        catCode = 'O';
        break;
      case 4:
        catCode = 'H';
        break;
      case 5:
        catCode = 'P';
        break;
      default:
        catCode = '';
        break;
    }
    return catCode;
  }
}
