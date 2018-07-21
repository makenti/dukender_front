import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService,
  CategoryService,
  ErrorService,
  CompanyProfileService } from '../../services/index';
import { ToastyService } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'app-comcategory',
  templateUrl: 'company.category.html',
  styleUrls: ['company.info.css']
})
export class CompanyCategoryComponent implements OnInit {
  
  @ViewChild('modalDeleteSubcategory')
  modalDeleteSubcategory: ModalDirective;

	public errorMessage: string;
	public categories: any[] = [];
  public companyCategories: any[] = [];
	public selectedCategories: any[] = [];
  public staticCategories: any[] = [];
  public loading: boolean = false;
  public register: boolean = true;
  public newCat = {
    name: '',
  }
  public currentCat = {
    group: null,
    cat: null
  };
  public columns = {
    first: 0,
    second: 0,
    thired: 0
  }
 	constructor (
    public categoryService: CategoryService,
    public companyService: CompanyProfileService,
    public auth: AuthService,
    public router: Router,
    public errorService: ErrorService,
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
              this.categories[i].collapsed = false;
              
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
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
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
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
    }
  }
  getCategories() {
    this.categoryService.getCategories()
        .subscribe(
          categories => {
            this.categories = categories;
            this.calculateColumns(this.categories.length);
            this.getCompanyCategories();
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
  calculateColumns(n){
    this.columns.first = Math.round(n/3);
    this.columns.second = this.columns.first*2;
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
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
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
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
  updateStorageUser() {
    let userCompany = this.auth.getUserCompany();
    userCompany.fill_status = 2;
    window.localStorage.setItem('user_company', JSON.stringify(userCompany));
  }

  // for subcategories:
  addCategory(group){
    let data = {
      category_id: group.id,
      subcategory_names: [this.newCat.name] 
    }
    this.categoryService.createCategory(data).
      subscribe(
        res=>{
          if(res.code == 0){
            let cat = this.categories.find(g=>g == group);
            cat.childs.push(res.subcategories[0]);
            this.newCat.name = "";
            this.toastyService.success("Категория добавлено");
            
          }else{

          }
        },
        error => this.toastyService.warning(this.errorService.getCodeMessage(error.code))
      )
  }
  deleteCategory(group, cat){
    this.currentCat.group = group;
    this.currentCat.cat = cat;
    this.modalDeleteSubcategory.show();
  }
  closeOtherCrateCats(group){
    this.categories.map(g=>{
      if(g.id != group.id){
        g.create = false;
      }
    })
  }
  confirmDeleteCategory(){
    let group = this.currentCat.group;
    let cat = this.currentCat.cat;
    this.categoryService.deleteSubcategory({ id: cat.id })
      .subscribe(
        res => {
          if(res.code == 0){
            this.categories.find(g=>g == group).childs = this.categories.find(g=>g == group).childs.filter(function(c){ return c != cat})
            this.modalDeleteSubcategory.hide();
            this.toastyService.success("Категория удалена");
            if(this.categories.find(g=>g == group).childs.length == 0){
              this.categories.find(g=>g == group).collapsed = false;
            }
          }else{
            if(res.message)
              this.toastyService.warning(res.message);
            else
              this.toastyService.warning("Ошибка сервера");
          }

        },
        error => this.toastyService.warning(this.errorService.getCodeMessage(error.code))
      );
  }
  editCategory(cat){
    this.categoryService.editSubcategory({ id: cat.id, name: cat.name })
      .subscribe(
        res => {
          if(res.code == 0){
            this.toastyService.success("Категория обновлена");
          }else{
            if(res.message)
              this.toastyService.warning(res.message);
            else
              this.toastyService.warning("Ошибка сервера");
          }

        },
        error => this.toastyService.warning(this.errorService.getCodeMessage(error.code))
      );
  }
}