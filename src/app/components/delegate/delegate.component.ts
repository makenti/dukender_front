import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import {
  AuthService,
  EmployeeService,
  } from '../../services/index';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  selector: 'app-delegate',
  templateUrl: 'delegate.component.html',
  styleUrls: ['delegate.component.css'],
  providers: [ AuthService, EmployeeService ]
})
export class DelegateComponent implements OnInit {

  private errorMessage: string;
  private staff: string[];
  private selectedUser: any;
  // private profileTypes = [
  //   { id: 1, name: 'Администратор' },
  //   { id: 2, name: 'Оператор прайс-листа' },
  //   { id: 3, name: 'Оператор заявок' },
  //   { id: 4, name: 'Оператор акций'}
  // ];

  constructor (
    private employeesService: EmployeeService,
    private auth: AuthService,
    private toastyService: ToastyService
   ) {
  }

  ngOnInit() {
    this.getStaff();
  }

  getStaff() {
    this.employeesService.getStaff()
        .subscribe(
          staff => this.staff = staff,
          error => this.errorMessage = <any>error
        );
  }

  onSelectUser(user: any) {
    console.log(user);
    this.selectedUser = user;
  }

  delegateAuthority() {
    let data = {
      entry_id: this.selectedUser.entry_id
    };
    this.employeesService.delegateAuthority(data)
        .subscribe(
          res => {
            if(res) {
              this.toastyService.success('Успешно переданы полномочия');
              this.getStaff();
            }
          },
          error => this.errorMessage = <any>error
        );
  }

}
