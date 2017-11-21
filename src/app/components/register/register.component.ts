import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  CompanyRegionsService,
  CompanyProfileService,
  ErrorService } from '../../services/index';

import { ToastyService } from 'ng2-toasty';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnInit {
	public errorMessage: string;
  public regions: string[];
  public countries: string[];
  public districts: any[];
  public selectedRegion: any;
  public selectedDistrict: any;
  public selectedCountry: any;

  public newCompany = {
    tin: '',
    name: '',
    short_name: '',
    country: '',
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
  public adminFullName = '';
  public isAdmin = false;

  constructor (
    public regionService: CompanyRegionsService,
    public companyService: CompanyProfileService,
    public auth: AuthService,
    public router: Router,
    public toastyService: ToastyService,
    public errorService: ErrorService,
   ) {
  }

  ngOnInit() {
    this.getCountries();
    // this.getRegions(); 
    // console.log(this.auth.checkRegister());
    if(this.auth.checkRegister() !== null) {
      this.getCompanyProfile();
      this.getAdmin();
    }
  }

  getCountries() {
    this.regionService.getCountries()
        .subscribe(
          countries => this.countries = countries,
          error =>  this.errorMessage = <any>error
        );
  }

  onSelectCountry(newCountry: any) {
    this.selectedCountry = newCountry;
    if(this.selectedCountry !== undefined && this.selectedCountry !== '') {
      this.getRegionsByCountry();
    }
  }

  getRegionsByCountry() {
    let data = {
      country_id: this.selectedCountry
    };
    this.regionService.getRegionsByCountry(data)
        .subscribe(
          regions => this.regions = regions,
          error =>  this.errorMessage = <any>error
        );
  }

  getCompanyProfile() {
    this.companyService.getCompanyProfile()
        .subscribe(
          data => {
            if(data !== null) {
              this.newCompany = data;
              this.newCompany.region = data.district.region.id;
              this.onSelectRegion(data.district.region.id);
              this.newCompany.district = data.district.id;
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  getRegions() {
    this.regionService.getRegions()
        .subscribe(
          regions => this.regions = regions,
          error =>  this.errorMessage = <any>error
        );
  }

  getAdmin() {
    let user = this.auth.getUser();
    console.log(user);
    if(user !== null) {
      this.adminFullName = user.first_name + ' ' + user.second_name + ' ' + user.middle_name;
      if(user.entry !== undefined && user.entry !== null) {
        if(user.entry.profile_type === 1)
          this.isAdmin = true;
      }
    }
  }

  onSelectRegion(newRegion: any) {
    this.selectedRegion = newRegion;
    console.log(newRegion);
    if(this.selectedRegion !== undefined && this.selectedRegion !== '') {
      this.getDistricts();
    }
  }

  getDistricts() {
    let data = {
      region_id: this.selectedRegion
    };
    this.regionService.getRegionDistricts(data)
        .subscribe(
          districts => this.districts = districts,
          error =>  this.errorMessage = <any>error
        );
  }

  onSelectDistrict(newDistrict: any) {
    this.selectedDistrict = newDistrict;
  }

  parseFullName() {
    let fullNameArray = this.adminFullName.split(' ');
    this.newCompany.first_name = fullNameArray[0];
    this.newCompany.second_name = fullNameArray[1];
    this.newCompany.middle_name = (fullNameArray[2] !== undefined)?fullNameArray[2]:'';
  }

  checkBinForChar() {
    let companyTin = this.newCompany.tin;
    if(companyTin !== '') {
      for(let i = 0; i < companyTin.length; i++) {
        // console.log(companyTin[i].charCodeAt(0));
        if(companyTin[i].charCodeAt(0) < 48 || companyTin[i].charCodeAt(0) > 57) {
          console.log('SYMBOL');
          return false;
        }
      }
    }
    return true;
  }

  checkEmailFormat() {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    console.log(EMAIL_REGEXP.test(this.newCompany.email));
    if (!EMAIL_REGEXP.test(this.newCompany.email)) {
      return false;
    }
    return true;
  }

  checkFirstStepForm() {
    if(this.newCompany.tin === '') {
      this.toastyService.warning('Пожалуйста, укажите БИН');
      return false;
    }else if(this.newCompany.tin.length < 12) {
      this.toastyService.warning('БИН компании не может быть меньше 12 цифр');
      return false;
    }else if(!this.checkBinForChar()) {
      this.newCompany.tin = '';
      this.toastyService.warning('БИН компании не может содержать символы');
      return false;
    }else if(this.newCompany.name === '') {
      this.toastyService.warning('Пожалуйста, укажите название компании');
      return false;
    }else if(this.newCompany.short_name === '') {
      this.toastyService.warning('Пожалуйста, укажите сокращенное наименование компании');
      return false;
    }else if(this.newCompany.country === '') {
      this.toastyService.warning('Пожалуйста, выберите страну');
      return false;
    }else if(this.newCompany.region === '') {
      this.toastyService.warning('Пожалуйста, выберите область');
      return false;
    }else if(this.newCompany.district === '') {
      this.toastyService.warning('Пожалуйста, выберите город или район');
      return false;
    }else if(this.newCompany.official_address === '') {
      this.toastyService.warning('Пожалуйста, укажите адрес');
      return false;
    }else if(this.newCompany.mobile_phone === '') {
      this.toastyService.warning('Пожалуйста, укажите мобильный телефон');
      return false;
    }else if(this.newCompany.work_phone === '') {
      this.toastyService.warning('Пожалуйста, укажите рабочий телефон');
      return false;
    }else if(this.newCompany.email === '') {
      this.toastyService.warning('Пожалуйста, укажите e-mail');
      return false;
    }else if(!this.checkEmailFormat()) {
      this.toastyService.warning('Вы ввели некорректный email. Проверьте и повторите попытку');
      return false;
    }else if(this.adminFullName === '') {
      this.toastyService.warning('Пожалуйста, укажите ФИО администратора');
      return false;
    }
    return true;
  }

  onClickNextBtn() {
    if(this.checkFirstStepForm()) {
      console.log(this.auth.checkRegister());
      if(this.auth.checkRegister() === undefined || this.auth.checkRegister() === null) {
        this.registerFirstStep();
      }
    }
  }

  registerFirstStep() {
    this.parseFullName();
    this.companyService.registerFirstStep(this.newCompany)
        .subscribe(
          resp => {
            if(resp.code === 0) {
              this.updateStorageUserCompany(resp.company);
              this.router.navigate(['/register-2']);
            }else {
              this.toastyService.warning(this.errorService.getCodeMessage(resp.code));
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  updateStorageUserCompany(company: any) {
    let userCompany = this.auth.getUserCompany();
    if(userCompany === null) {
      userCompany = company;
      window.localStorage.setItem('user_company', JSON.stringify(userCompany));
    }
  }

  onSelectPhoto(event: any) {
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
}
