import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

import { AuthService, CustomersService, ErrorService } from '../../services/index';
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

  public customers: any[] = [];
	public errorMessage: any[] = [];

  constructor(
  		public auth: AuthService,
  		public router: Router,
      public errorService: ErrorService,
      public toastyService: ToastyService,
  		public customerService: CustomersService) {}

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
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
}
