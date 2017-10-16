import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService,
  CategoryService,
  CompanyProfileService } from '../../services/index';
import { ToastyService } from 'ng2-toasty';

@Component({
  moduleId: module.id,
  selector: 'app-comcategory',
  templateUrl: 'company.category.html',
  styleUrls: ['company.info.css']
})
export class CompanyCategoryComponent implements OnInit {
	private errorMessage: string;
	private categories: any[] = [];
  private companyCategories: any[] = [];
	private selectedCategories: any[] = [];
  private loading: boolean = false;
  private register: boolean = true;

 	constructor (
    private categoryService: CategoryService,
    private companyService: CompanyProfileService,
    private auth: AuthService,
    private router: Router,
    private toastyService: ToastyService
   ) {
  }

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(null, null);
    this.getCategories();
    this.getCompanyCategories();
    if(window.location.pathname === "/company_category"){
    	this.register = false;
    }
  }
  
  onSave(){
    if(this.register){
      this.registerThirdStep();
    }else{
      this.updateCompanyCategories();
    }
  }

  getCompanyCategories() {
    this.loading = true;
    this.companyService.getCompanyCategories()
        .subscribe(
          data => {
            this.companyCategories = data;
            if(this.companyCategories !== null)
              this.companyCategories.map((x:any) => this.selectedCategories.push(x.category.id));
            this.loading = false;
          },
          error =>  this.errorMessage = <any>error
        );
  }

  getCategories() {
    this.categoryService.getCategories()
        .subscribe(
          categories => this.categories = categories,
          error =>  this.errorMessage = <any>error
        );
  }

  existCategory(cat: any): boolean {
    let exist = this.companyCategories.filter((x:any) => x.category.id === cat.id)[0];
    if(exist !== undefined) {
      return true;
    }
    return false;
  }

  onSelectCategory(newCategory: any, event:any) {
    if(event.target.checked) {
      this.selectedCategories.push(newCategory.id);
    }else {
      let index = this.selectedCategories.indexOf(newCategory.id);
      if(index !== -1) {
        let data = {
          category_id: newCategory.id
        };
        this.companyService.checkCompanyCategory(data)
            .subscribe(
              resp => {
                if(resp !== null) {
                  if(resp) {
                    event.target.checked = true;
                    this.toastyService.warning('вы не можете убрать');
                  }else {
                    this.selectedCategories.splice(index, 1);
                  }
                }else {
                  this.toastyService.error('Error');
                }
              },
              error =>  this.errorMessage = <any>error
            );
      }
    }
  }

  updateCompanyCategories() {
    let data = {
      categories: this.selectedCategories
    };

    this.companyService.updateCompanyCategories(data)
        .subscribe(
          resp => {
            if(resp) {
              this.toastyService.success('Данные успешно обновлены');
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }
  // for register:
  registerThirdStep() {
    console.log(this.selectedCategories);
    let data = {
      categories: this.selectedCategories
    };

    this.companyService.updateCompanyCategories(data)
        .subscribe(
          resp => {
            if(resp) {
              this.updateStorageUser();
              this.router.navigate(['/home']);
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }
  updateStorageUser() {
    let userCompany = this.auth.getUserCompany();
    userCompany.fill_status = 2;
    window.localStorage.setItem('user_company', JSON.stringify(userCompany));
  }
}
