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
	public errorMessage: string;
	public categories: any[] = [];
  public companyCategories: any[] = [];
	public selectedCategories: any[] = [];
  public staticCategories: any[] = [];
  public loading: boolean = false;
  public register: boolean = true;

 	constructor (
    public categoryService: CategoryService,
    public companyService: CompanyProfileService,
    public auth: AuthService,
    public router: Router,
    public toastyService: ToastyService
   ) {
  }

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(null, null);
    this.getCategories();
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
            for(let i = 0; i < this.categories.length; i++){
                this.categories[i].selected = false;
            }    
            if(this.companyCategories !== null)
              this.companyCategories.map((x:any) => {
                this.selectedCategories.push(x.category.id);
                for(let i = 0; i < this.categories.length; i++){
                  if(x.category.id === this.categories[i].id){
                    this.categories[i].selected = true;
                  }
                }    
              });
            this.loading = false;
            this.getStaticCategories();
          },
          error =>  this.errorMessage = <any>error
        );
  }
  getStaticCategories(){
    for(let i = 0; i < this.categories.length; i++){
      this.loading = true;
      let index = this.categories[i];
      let data = {
        category_id: this.categories[i].id
      };
      this.companyService.checkCompanyCategory(data)
        .subscribe(
          resp => {
            if(resp !== null) {
              if(resp) {  
                this.categories[i].selected = true;
                this.categories[i].disabled = true;
                this.staticCategories.push(this.categories[i]);
              }
            }else {
              this.toastyService.error('Error');
            }
            this.loading = false;
          },
          error =>  this.errorMessage = <any>error
        );
    }
  }
  getCategories() {
    this.categoryService.getCategories()
        .subscribe(
          categories => {
            this.categories = categories;
            this.getCompanyCategories();
          },
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
    if(newCategory === 0){
      this.selectedCategories = [];
      for(let i = 0; i < this.categories.length; i++){
        this.categories[i].selected = event.target.checked;
        if(event.target.checked){
          this.selectedCategories.push(this.categories[i].id);
        }
      }
      if(!event.target.checked){
        for(let i = 0; i < this.staticCategories.length; i++){
          this.selectedCategories.push(this.staticCategories[i].id);
        }
      }
    }else if(event.target.checked) {
      this.selectedCategories.push(newCategory.id);
    }else if(!event.target.checked) {
      let index = this.selectedCategories.indexOf(newCategory.id);
      this.selectedCategories.splice(index, 1);
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
