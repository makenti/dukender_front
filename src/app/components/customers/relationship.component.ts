import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/index';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  selector: 'app-relationship',
  templateUrl: 'relationship.component.html',
  styleUrls: ['customers.component.css'],
  providers: [AuthService]
})
export class RelationshipComponent {

	// private errorMessage: any[] = [];
  // private history = [
	 //  {
	 //  	date: '12.05.2016',
	 //  	desc: 'Просрочен товар по заявке № 45987',
	 //  	note: 'Товар заменили',
	 //  }
  // ];

  constructor(private auth: AuthService, private router: Router) {}
}
