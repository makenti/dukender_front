import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  CategoryService,
  CompanyProfileService,
  ProductService,
	PromotionService } from '../../services/index';

import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-promnew',
  templateUrl: 'new.promotions.html',
  styleUrls: ['promotions.component.css'],
  providers: [
    AuthService,
    CategoryService,
    CompanyProfileService,
    ProductService,
  	PromotionService
  ]
})
export class PromotionProductsComponent implements OnInit {

  allSelected: boolean = false;
  loading: boolean = false;
  public searchQuery: string = '';

	private errorMessage: string;
	private categories = new Array();
  private companyCategories = new Array();
  private products = new Array();
  private selectedCategory: any = null;
  private selectedProducts: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private companyService: CompanyProfileService,
    private productService: ProductService,
    private promotionService: PromotionService,
    private auth: AuthService,
    private router: Router,
    private toastyService: ToastyService) {}

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
          error =>  this.errorMessage = <any>error
        );
  }

  getCompanyCategories() {
    this.companyService.getCompanyCategories()
        .subscribe(
          data => {
            // console.log(data);
            this.companyCategories = data;
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onSelectCategory(newCategory: any) {
    // console.log(newCategory);
    this.selectedCategory = newCategory;
    this.getCategoryProducts();
  }

  onSearchProduct() {
    this.getCategoryProducts();
  }

  getCategoryProducts() {
    // console.log(this.selectedCategory);
    this.loading = true;
  	let data = {
  		category_id: (this.selectedCategory !== null) ? this.selectedCategory : '',
      limit: 500,
      search_word: this.searchQuery
  	};
  	this.productService.getCategoryProducts(data)
        .subscribe(
        	resp => {
          	// console.log(resp);
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
          error =>  this.errorMessage = <any>error
        );
  }

  getSelectedProducts() {
    // console.log(product);
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
