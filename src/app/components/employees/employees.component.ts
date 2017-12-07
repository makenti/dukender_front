import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthService, EmployeeService, ErrorService } from '../../services/index';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [ AuthService, EmployeeService, ErrorService ]
})
export class EmployeesComponent implements OnInit {

  @ViewChild('modalAddUser')
  modalAddUser: ModalDirective;

  @ViewChild('modalEditUser')
  modalEditUser: ModalDirective;

  @ViewChild('modalDeleteUser')
  modalDeleteUser: ModalDirective;

  @ViewChild('modalDelegateUser')
  modalDelegateUser: ModalDirective;

  public errorMessage: string;
  public staff: any[];
  public formChecked: boolean = false;
  public loading: boolean = false;

  public newEmployee = {
    first_name: '',
    second_name: '',
    middle_name: '',
    email: '',
    profile_type: '',
    permissions: new Array()
  };

  public selectedEmployee = {
    first_name: '',
    second_name: '',
    middle_name: '',
    email: '',
    entry_id: '',
    profile_type: '',
    permissions: new Array()
  };
  public selectedProfileType: any;
  public selectedUsers = new Array();
  public selectedEmployees = new Array();
  public selectedRoleName = 'Выберите роль';
  public profileTypes = [
    { id: 1, name: 'Администратор' },
    { id: 2, name: 'Оператор прайс-листа' },
    { id: 3, name: 'Оператор заявок' },
    { id: 4, name: 'Оператор акций'}
  ];

  public permissionsList = [
    { id: 0, name: 'Заявки', selected: false },
    { id: 1, name: 'Акции и скидки', selected: false },
    { id: 2, name: 'Компания', selected: false },
    { id: 3, name: 'Прайс-листы', selected: false },
    { id: 4, name: 'Сотрудники', selected: false },
    { id: 5, name: 'Настройки', selected: false }
    // { id: 3, name: 'Взаимоотношения с заказчиками', selected: false },
  ];

  public employeeToDelegate:any = null;

  constructor(
    public employeeService: EmployeeService,
    public auth: AuthService,
    public errorService: ErrorService,
    public toastyService: ToastyService
  ) { }

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(null, null);
    this.getStaff();
  }

  getStaff() {
    this.loading = true;
    this.employeeService.getStaff()
        .subscribe(
          staff => {
            this.loading = false;
            this.staff = staff;
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }

  onSelectUser(user: any) {
    let ind = this.selectedUsers.map(function(e) { return e.entry_id; }).indexOf(user.entry_id);
    if(ind > -1) {
      this.selectedUsers.splice(ind, 1);
    }else {
      this.selectedUsers.push(user);
    }
  }

  onEditUser(user: any) {
    // let user = item.user;
    // if(user.entry !== null ) {
      this.matchUser(user);
      let type = this.profileTypes.filter(x => x.id === user.profile_type)[0];
      this.composeEditUserPerms(type);
      this.modalEditUser.show();
    // }else {
    // }
    // this.selectedEmployee = user;
  }

  matchUser(item: any) {
    let user = item.user;
    this.selectedEmployee = {
      first_name: user.first_name,
      second_name: user.second_name,
      middle_name: user.middle_name,
      email: user.username,
      entry_id: item.entry_id,
      profile_type: item.profile_type,
      permissions: user.permissions
    };
  }

  composeEditUserPerms(type: any) {
    this.selectedProfileType = type;
    this.selectedRoleName = type.name;
    if(type.id === 1) {
      this.permissionsList.map((e) => {
        e.selected = true;
      });
    }else {
      if(this.selectedEmployee.permissions !== null && this.selectedEmployee.permissions !== []) {
        this.permissionsList.map((e) => {
          e.selected = false;
          for(let p of this.selectedEmployee.permissions) {
            if (p.permission_type === e.id) {
              e.selected = true;
            }
          }
        });
      }
    }
  }

  onSelectProfileType(newType: any) {
    this.selectedProfileType = newType;
    this.newEmployee.profile_type = newType.id;
    this.selectedRoleName = newType.name;

    this.permissionsList.map((e) => {
      e.selected = false;
    });
    if(newType.id === 2) {
      this.permissionsList.map((e) => {
        if(e.id === 2) e.selected = true;
      });
    }else if(newType.id === 3) {
      this.permissionsList.map((e) => {
        if(e.id === 0) e.selected = true;
      });
    }else if(newType.id === 4) {
      this.permissionsList.map((e) => {
        if(e.id === 1) e.selected = true;
      });
    }else if(newType.id === 1) {
      this.permissionsList.map((e) => {
        e.selected = true;
      });
    }
  }

  checkEmail() {
    let regex  = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    return !regex.test(this.newEmployee.email);
  }

  checkForm() {
    if( this.newEmployee.first_name !== '' &&
        this.newEmployee.second_name !== '' &&
        this.newEmployee.middle_name !== '' &&
        this.newEmployee.email !== '' &&
        this.newEmployee.profile_type !== '')
          this.formChecked = true;
  }

  addEmployee() {
    this.checkForm();
  	this.updatePermissions();

    this.employeeService.addEmployee(this.newEmployee)
        .subscribe(
          resp => {
            if(resp.code === 0) {
              this.getStaff();
              this.toastyService.success('Поздравляем! Вы успешно добавили сотрудника. На указанную вами почту придет приглашение.');
              this.modalAddUser.hide();
            }else {
              if(resp.code === 1) {
                // this.modalAddUser.hide();
                this.toastyService.warning(resp.message);
              }else {
                // this.modalAddUser.hide();
                this.toastyService.warning(this.errorService.getCodeMessage(resp.code));
              }
            }

          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }

  saveEmployee() {
    // this.checkForm();
    this.updatePermissions();

    this.employeeService.updateEmployee(this.selectedEmployee)
        .subscribe(
          resp => {
            if(resp.code === 0) {
              this.getStaff();
              this.toastyService.success('Вы успешно обновили данные соотрудника');
              this.modalEditUser.hide();
            }else {
              if(resp.code === 1) {
                // this.modalAddUser.hide();
                this.toastyService.warning(resp.message);
              }else {
                // this.modalAddUser.hide();
                this.toastyService.warning(this.errorService.getCodeMessage(resp.code));
              }
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }

  clickDeleteBtn() {
    if(this.selectedUsers.length > 0) {
      this.modalDeleteUser.show();
    }else {
      this.toastyService.warning('Вы не выбрали соотрудника');
    }
  }

  deleteEmployee() {
    this.updateEmployees();
    let data = {
      entry_id: this.selectedEmployees
    };
    this.employeeService.deleteEmployee(data)
        .subscribe(
          res => {
            if(res) {
              this.getStaff();
              this.selectedEmployees = new Array();
              this.toastyService.success('Профиль успешно удален');
              this.modalDeleteUser.hide();
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }

  handleDelegateEmployee(employee){
    this.employeeToDelegate = employee;
    this.modalDelegateUser.show();
  }

  delegateAuthority() {
    let data = {
      entry_id: this.employeeToDelegate.entry_id
    };
    this.employeeService.delegateAuthority(data)
        .subscribe(
          res => {
            if(res) {
              this.toastyService.success('Успешно переданы полномочия');
              
              this.auth.logout();
            }
          },
          error => {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }

  inviteEmployee(employee: any) {
    // this.updateEmployees();
    let data = {
      entry_id: employee.entry_id
    };
    this.employeeService.inviteEmployee(data)
        .subscribe(
          res => {
            if(res) {
              this.getStaff();
              this.selectedEmployees = new Array();
              this.toastyService.success('Вы успешно пригласили');
            }else {
              this.toastyService.warning('Нельзя пригласить активных пользователей');
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }

	updatePermissions() {
		let newPermissions: any[] = [];

  	this.permissionsList.map((perm)=> {
  		if(perm.selected) {
  			newPermissions.push(perm.id);

  		}
  	});
    this.newEmployee.permissions = newPermissions;
  	this.selectedEmployee.permissions = newPermissions;
	}

  updateEmployees() {
    let newEmployees: any[] = [];
    this.selectedUsers.map((user)=> {
      newEmployees.push(user.entry_id);
    });

    this.selectedEmployees = newEmployees;
  }

}
