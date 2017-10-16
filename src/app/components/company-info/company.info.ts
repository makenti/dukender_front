import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  CompanyRegionsService,
  CompanyProfileService
} from '../../services/index';

import { ToastyService } from 'ng2-toasty';
import { serverURL } from '../../common/config/server';

@Component({
  selector: 'app-company-info',
  templateUrl: './company.info.html',
  styleUrls: ['./company.info.css'],
  providers: [
    AuthService,
    CompanyRegionsService,
    CompanyProfileService
  ]
})
export class CompanyInfoComponent implements OnInit {

  public phoneMask = ['+7 (', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/];
  public tinMask = [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/];

	private errorMessage: string;
  private regions: string[];
  private districts: any[];
  private selectedRegion: any;
  private selectedDistrict: any;
  private companyProfile = {
    tin: '',
    name: '',
    short_name: '',
    region: '',
    district: '',
    official_address: '',
    mobile_phone: '',
    work_phone: '',
    email: '',
    first_name: '',
    middle_name: '',
    second_name: '',
    additional_info: ''
  };
  private companyPreview: any;
  private adminFullName = '';
  private isAdmin = false;

  private register: boolean = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastyService: ToastyService,
    private regionService: CompanyRegionsService,
    private companyService: CompanyProfileService,
  ) { }

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(null, null);
    this.getRegions();
    this.getCompanyProfile();
    this.getAdmin();
    if(window.location.pathname === "/company_info"){
      this.register = false;
    }
  }

  getRegions() {
    this.regionService.getRegions()
        .subscribe(
          regions => this.regions = regions,
          error =>  this.errorMessage = <any>error
        );
  }

  getCompanyProfile() {
    this.companyService.getCompanyProfile()
        .subscribe(
          data => {
            this.companyProfile = data;
            this.companyProfile.region = data.district.region.id;
            this.onSelectRegion(data.district.region.id);
            this.companyProfile.district = data.district.id;
            if(data.image !== null) {
              this.companyPreview = serverURL + data.image;
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  getAdmin() {
    let user = this.auth.getUser();
    if(user !== null) {
      this.adminFullName = user.first_name + ' ' + user.second_name + ' ' + user.middle_name;
      if(user.entry !== null && user.entry.profile_type === 1) {
        this.isAdmin = true;
      }
    }
  }

  onSelectRegion(newRegion: any) {
    this.selectedRegion = newRegion;
    if(this.selectedRegion !== undefined && this.selectedRegion !== '') {
      this.getDistricts();
    }
  }

  onSelectPhoto(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.companyPreview = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }

    let data = {
      files: event.target.files
    };
    this.companyService.uploadCompanyPhoto(data)
        .subscribe(
          res => {
            if(res) {
              this.toastyService.success('Фото успешно загружено');
            }
          },
          error =>  {
            this.toastyService.warning(error.message);
            this.errorMessage = <any>error;
          }
        );
  }

  getDistricts() {
    let data = {
      region_id: this.selectedRegion
    };
    this.regionService.getRegionDistricts(data)
        .subscribe(
          districts => {
            this.districts = districts;
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onSelectDistrict(newDistrict: any) {
    this.selectedDistrict = newDistrict;
  }

  parseFullName() {
    let fullNameArray = this.adminFullName.split(' ');
    this.companyProfile.first_name = fullNameArray[0];
    this.companyProfile.second_name = fullNameArray[1];
    this.companyProfile.middle_name = (fullNameArray[2] !== undefined)?fullNameArray[2]:'';
  }

  checkProfileForm() {

    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(this.companyProfile.email)) {
      this.toastyService.warning('Вы ввели некорректный email. Проверьте и повторите попытку');
      return false;
    }else if(this.companyProfile.name === '') {
      this.toastyService.warning('Пожалуйста, укажите название компании');
      return false;
    }else if(this.companyProfile.short_name === '') {
      this.toastyService.warning('Пожалуйста, укажите сокращенное наименование компании');
      return false;
    }else if(this.companyProfile.region === '') {
      this.toastyService.warning('Пожалуйста, выберите область');
      return false;
    }else if(this.companyProfile.district === '') {
      this.toastyService.warning('Пожалуйста, выберите город или район');
      return false;
    }else if(this.companyProfile.official_address === '') {
      this.toastyService.warning('Пожалуйста, укажите адрес');
      return false;
    }else if(this.companyProfile.mobile_phone === '') {
      this.toastyService.warning('Пожалуйста, укажите мобильный телефон');
      return false;
    }else if(this.companyProfile.work_phone === '') {
      this.toastyService.warning('Пожалуйста, укажите рабочий телефон');
      return false;
    }else if(this.companyProfile.email === '') {
      this.toastyService.warning('Пожалуйста, укажите e-mail');
      return false;
    }else if(this.adminFullName === '') {
      this.toastyService.warning('Пожалуйста, укажите ФИО администратора');
      return false;
    }
    return true;
  }

  updateCompanyProfile() {
    this.parseFullName();
    if(this.checkProfileForm()) {
      this.companyService.updateCompanyProfile(this.companyProfile)
          .subscribe(
            resp => {
              if(resp) {
                this.toastyService.success('Вы успешно изменили данные');
              }else {
                this.toastyService.error('Ошибка при обновлении профиля компании');
              }
            },
            error => this.errorMessage = <any>error
          );
    }
  }

}
