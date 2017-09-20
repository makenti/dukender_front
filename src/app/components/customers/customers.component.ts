import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, CustomersService } from '../../services/index';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  selector: 'app-customers',
  templateUrl: 'customers.component.html',
  styleUrls: ['customers.component.css'],
  providers: [AuthService, CustomersService]
})
export class CustomersComponent implements OnInit {

  private customers: any[] = [];
	private errorMessage: any[] = [];

  constructor(
  		private auth: AuthService,
  		private router: Router,
  		private customerService: CustomersService) {}

  ngOnInit() {
  	this.getCustomers();
  }

  getCustomers() {
  	// this.selectedFilter = filter;
  	// let data = {
  	// 	status: '',
			// timestamp: '',
			// customer_id: ''
  	// };
  	this.customerService.getCustomers()
        .subscribe(
          resp => {
            if(resp === null) {

            }else {
            	if(resp.code === 0) {
            		this.customers = resp.shops;
            	}
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }
}
