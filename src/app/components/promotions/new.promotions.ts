import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  CategoryService,
  CompanyProfileService,
  ProductService,
  ErrorService,
	PromotionService } from '../../services/index';

import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-promnew',
  templateUrl: 'new.promotions.html',
  styleUrls: ['promotions.component.css']
})
export class PromotionProductsComponent implements OnInit {

  allSelected: boolean = false;
  loading: boolean = false;
  public searchQuery: string = '';

	public errorMessage: string;
	public categories = new Array();
  public companyCategories = new Array();
  public products = new Array();
  public selectedCategory: any = null;
  public selectedProducts: any[] = [];

  constructor(
    public categoryService: CategoryService,
    public companyService: CompanyProfileService,
    public productService: ProductService,
    public promotionService: PromotionService,
    public auth: AuthService,
    public router: Router,
    public errorService: ErrorService,
    public toastyService: ToastyService) {}

  ngOnInit() {
    // this.getCategories();
    this.getCategoryProducts();
    this.getCompanyCategories();
    this.promotionService.selectedProducts = [];
  }

  getCategories() {
    this.categoryService.getCategories()
        .subscribe(
          categories => this.categories = categories,
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }

  getCompanyCategories() {
    this.companyService.getCompanyCategories()
        .subscribe(
          data => {
            this.companyCategories = data;
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }

  onSelectCategory(newCategory: any) {
    this.selectedCategory = newCategory;
    this.getCategoryProducts();
  }

  onSearchProduct() {
    this.getCategoryProducts();
  }

  getCategoryProducts() {
    this.loading = true;
  	let data = {
  		category_id: (this.selectedCategory !== null) ? this.selectedCategory : '',
      limit: 2000,
      search_word: this.searchQuery
  	};
  	this.productService.getCategoryProducts(data)
        .subscribe(
        	resp => {
            this.loading = false;
            if(resp === null) {
              this.toastyService.warning('По Вашему запросу ничего не найдено');
            }else {
            	if(resp.code === 0) {
            		this.products = resp.price_list;
                this.products.map(p => {
                  p.checked = false;
                  return p;
                });
            	}
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }

  getSelectedProducts() {
    this.selectedProducts = [];
    this.products.map(p => {
      if(p.checked) {
        this.selectedProducts.push(p);
      }
    });
  }

  createPromotion(type: any) {
    this.getSelectedProducts();
    if(this.selectedProducts.length === 0) {
      this.toastyService.warning('Вы не выбрали товар');
    }else {
      this.promotionService.selectedProducts = this.selectedProducts;
      this.router.navigate(['/promotion-create', type]);
    }

  }

  selectAllProducts() {
    this.allSelected = true;
    this.products.forEach(i => i.checked = true);
  }

  unSelectAllProducts() {
    this.allSelected = false;
    this.products.forEach(i => i.checked = false);
  }

}
