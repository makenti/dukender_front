import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap';
import { ToastyService } from 'ng2-toasty';

import { AuthService, ErrorService, ToolbarService } from '../../services/index';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [ AuthService, ToolbarService, ErrorService]
})
export class LandingComponent implements OnInit {

  @ViewChild('modalRegister')
  modal: ModalDirective;

  public localUser = {
    username: '',
    password: ''
  };
  public newUser = {
    email: '',
    password: '',
    checkOffer: false
  };

  public showLogin = true;
  public showRegister = false;
  public rememberMe = false;
  public loginErrorMessage = new Array();
  public registerErrorMessage = new Array();

  constructor(
    public auth: AuthService,
    public errorService: ErrorService,
    public toolbarSrv: ToolbarService,
    public toastyService: ToastyService,
    public router: Router) {
  }

  ngOnInit() {
    this.toolbarSrv.setToolbarTitle('Добро пожаловать в Dukender.');
    var metaTag = document.getElementById('viewport');
    metaTag.parentNode.removeChild(metaTag);

    var meta = document.createElement('meta');
    meta.name = "viewport";
    meta.id = "viewport";
    meta.content = "width=device-width, initial-scale=1.0";
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  toggle() {
    this.showLogin = !this.showLogin;
    this.showRegister = !this.showRegister;
    this.newUser = {
      email: '',
      password: '',
      checkOffer: false
    };
  }

  checkRegisterStep() {
    let fillStatus = this.auth.checkRegister();
    switch (fillStatus) {
      case null:
        this.router.navigate(['/register-1']);
        break;
      case 0:
        this.router.navigate(['/register-2']);
        break;
      case 1:
        this.router.navigate(['/register-2']);
        break;
      case 2:
        this.router.navigate(['/home']);
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }

  onLoginForm() {
    this.loginErrorMessage = [];
    if(this.localUser.username === '' && this.localUser.password === '') {
      this.loginErrorMessage.push('Пожалуйста, заполните поля «имя пользователя» и «пароль»');
    }else if(this.localUser.username === '') {
      this.loginErrorMessage.push('Пожалуйста, введите «имя пользователя»');
    }else if(this.localUser.password === '') {
      this.loginErrorMessage.push('Пожалуйста, введите «пароль»');
    }else {
      this.login();
    }
    return true;
  }

  onLoginEnter(event:any) {
    if(event.keyCode === 13) {
      this.onLoginForm();
    }
  }

  login() {
    this.auth.authenticate(this.localUser)
        .subscribe(
          res => {
            if(res.code === 0) {
              this.checkRegisterStep();
              this.connectPushService();
            } else {
              let errorMessage = this.errorService.getCodeMessage(res.code);
              this.loginErrorMessage.push(errorMessage);
            }
          },
          error => {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            console.log(<any>error)
          }
        );
  }

  connectPushService() {
    // this.pushService.connectToServer()
    //     .subscribe(
    //         resp => {
    //           console.log(resp);
    //         },
    //         error =>  console.log(error)
    //       );
  }

  onRegisterForm() {
    this.registerErrorMessage = [];
    if(this.newUser.email === '' && this.newUser.password === '') {
      this.registerErrorMessage.push('Пожалуйста, укажите e-mail (логин) и пароль');
    }else if(this.newUser.email === '') {
      this.registerErrorMessage.push('Пожалуйста, введите емайл');
    }else if(this.newUser.password === '') {
      this.registerErrorMessage.push('Пожалуйста, введите пароль ');
    }else if(!this.newUser.checkOffer) {
      this.registerErrorMessage.push('Пожалуйста, подпишите договор');
    }else {
      this.register();
    }
  }

  onRegisterEnter(event:any) {
    if(event.keyCode === 13) {
      this.onRegisterForm();
    }
  }

  onRegisterComplete() {
    this.toggle();
    this.modal.hide();
  }

  register() {
    this.auth.register(this.newUser)
        .subscribe(
          res => {
            if(res.code === 0) {
              this.modal.show();
              this.connectPushService();
            } else {
              let errorMessage = this.errorService.getCodeMessage(res.code);
              this.registerErrorMessage.push(errorMessage);
            }
          },
          error => {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            console.log(<any>error)
          }
        );
  }

}
