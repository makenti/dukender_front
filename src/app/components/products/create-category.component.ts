import { Component, OnInit, ViewChild, HostListener, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import {
  AuthService,
  CategoryService,
  CompanyProfileService,
  ProductService,
  UploadService,
  PromotionService,
  ErrorService } from '../../services/index';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'create-category',
  templateUrl: './create-category.component.html',
  styles: [`
  /*dropdown:*/
  .navbar-d-btn {
    height: 34px;
    background-color: #fff;
    /*box-shadow: inset 0 1px 3px 0 #fff;*/
    /*border: solid 1px #eee;*/
    border: none;
    border-radius: 34px;
    padding: 0 15px;
  
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    color: #4a4a4a;
    /*margin-left: 20px;*/
  }
  .navbar-d-btn:disabled,
  .navbar-d-btn-disabled {
    opacity: 0.5;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .navbar-d-btn i{
    margin-left: 10px;
  }
  
  .navbar-d-menu{
    margin-top: -40px;
    min-width: 220px;
    padding: 0;
    border-radius: 17px;
    background-color: #ffffff;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
    border: 0 none;
    overflow: hidden;
  }
  .navbar-d-menu .dropdown-header{
    text-transform: uppercase;
    color: #4a4a4a;
    font-size: 11px;
    height: 40px;
    display: flex;
    align-items: center;
    font-weight: 600;
  }
  .navbar-d-menu>li>button.list-group-item {
    border: none;
    border-bottom: 1px solid #ddd;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .navbar-d-menu>li>a {
    font-size: 13px;
    height: 40px;
    display: flex;
    align-items:center;
  }
  .navbar-d-menu>li>a:hover{
    color: #237ee8;
    background: #f5f5f5;
  }
  .cats-added{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
    .cats-added .cat{
        position: relative;
        width: calc(50% - 10px);
        min-height: 34px;
        margin: 5px;  
        padding: 0 35px;
        border-radius: 34px;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .cats-added .cat span{
        overflow: hidden;
    }
    .cats-added .cat i{
        position: absolute;
        right: 10px;
    } 
  `],
  providers: [
    AuthService,
    CategoryService,
    CompanyProfileService,
    ProductService,
    UploadService,
    ErrorService,
    PromotionService
  ]
})
export class CreateCategoryComponent implements OnInit {

    @ViewChild('modalCreateCategory')
    modalCreateCategory: ModalDirective;

    @Input() show:boolean;
    @Input() companyCategories: any[] = [];
    @Output() handle = new EventEmitter<any>();
    public temp = {
        name: ''
    }
    public categories = [];
    public group = null;
    constructor (
        public categoryService: CategoryService,
        public companyService: CompanyProfileService,
        public productService: ProductService,
        public uploadService: UploadService,
        public auth: AuthService,
        public toastyService: ToastyService,
        public errorService: ErrorService,
    ) {}

    ngOnInit() {
        console.log(this.categories)
    }   
    ngAfterViewInit(){
    }
    close(){
        this.handle.emit(false);
    }
    ngOnChanges(changes: SimpleChanges) {
        if(changes.show)
            if(changes.show.currentValue){
                this.modalCreateCategory.show();
                this.categories = [];
                this.group = null;
            }
            else
                this.modalCreateCategory.hide();
    }
    selectGroup(g){
        this.group = g;
    }
    addNewCat(){
        if(!this.group){
            this.toastyService.warning("Выберите товарную группу");
            return;
        }
        if(this.temp.name.replace(/ /g,'') !== ""){
            this.categories.push(Object.assign({}, this.temp));
            this.temp.name = "";
        }
    }
    removeCat(index){
        this.categories.splice(index, 1);
    }
    createCategory(){
        if(!this.group){
            this.toastyService.warning("Выберите товарную группу");
            return;
        }
        if(this.categories.length == 0){
            this.toastyService.warning("Добавьте категорию");
            return;
        }
        let cats = [];
        this.categories.map(c=>{
            if(c.name.replace(/ /g, '') !== "")
                cats.push(c.name)
        });
        let data = {
            category_id: this.group.id,
            subcategory_names: cats
        };
        this.productService.createCategory(data)
            .subscribe(
                res => {
                    if(res.code === 0){
                        this.toastyService.success("Новая категория добавлена");
                        this.handle.emit(true);
                        this.categories = [""];
                    }else{
                        if(res.message)
                            this.toastyService.warning(res.message);                 
                        else 
                            this.toastyService.warning("Ошибка сервера");                 
                    }
                },
                error =>  {
                    this.toastyService.error(this.errorService.getCodeMessage(error.code));
                }
            );
    }
}