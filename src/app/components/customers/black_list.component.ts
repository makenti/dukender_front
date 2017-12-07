import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

import { AuthService, CustomersService, ErrorService } from '../../services/index';
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

	public errorMessage: any[] = [];
	public bannedCustomers: any[] = [];
	public selectedCustomers: any[] = [];
  public loading: boolean = false;

  constructor(
  		public auth: AuthService,
  		public router: Router,
  		public customerService: CustomersService,
      public errorService: ErrorService,
      public toastyService: ToastyService) {}

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
              this.bannedCustomers = [];
            }else {
          		this.bannedCustomers = resp;
            }
            this.loading = false;
          },
          error => {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }

  onSelectCustomer(item: any) {
    let ind = this.selectedCustomers.map(function(e) { return e; }).indexOf(item.shop.id);
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
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
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
