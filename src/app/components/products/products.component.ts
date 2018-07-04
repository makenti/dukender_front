import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import {
  AuthService,
  CategoryService,
  CompanyProfileService,
  ProductService,
  UploadService,
  PromotionService,
  ErrorService } from '../../services/index';
import { ToastyService } from 'ng2-toasty';
import { priceLimit } from '../../common/config/limits';
import { ProductModal } from './product-modal.component';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
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
export class ProductsComponent implements OnInit {

  @ViewChild('modalDeleteProduct')
  modalDeleteProduct: ModalDirective;

  @ViewChild('modalImportPrice')
  modalImportPrice: ModalDirective;

  @ViewChild(ProductModal)
  productModal: ProductModal;

  public searchQuery: string = '';
  public sortField:string = "";
  public sortOrder:string = "asc";
  public limit: number = priceLimit;
  public timestamp: any = '';

  public categories = new Array();
  public companyCategories = new Array();
  public products = new Array();
  public selectedCategory: any = null;
  public selectedProducts: any[] = [];
  public fileSelected: boolean = false;
  public allSelected: boolean = false;
  public selectedFile: any = null;
  public fileChooserInit: boolean = false;
  public loading: boolean = false;
  public loadingOnSave: boolean = false;
  public addLoading: boolean = false;
  public uploadCategory = '';

  constructor (
    public categoryService: CategoryService,
    public companyService: CompanyProfileService,
    public productService: ProductService,
    public uploadService: UploadService,
    public auth: AuthService,
    public router: Router,
    public toastyService: ToastyService,
    public errorService: ErrorService,
  ) {}

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(null, null);
    this.getCategories();
    this.getCategoryProducts();
    this.getCompanyCategories();
  }
  getCategories() {
    this.categoryService.getCategories()
      .subscribe(
        categories => this.categories = categories,
        error =>  {
          this.toastyService.warning(this.errorService.getCodeMessage(error.code));
        }
      );
  }
  getCompanyCategories() {
    this.companyService.getCompanyCategories()
        .subscribe(
          data => {
            this.companyCategories = data;
            // data.map((x:any) => this.selectedCategories.push(x.category.id));
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
          }
        );
  }
  onScroll (e: any) {
    if(e.target.scrollHeight <= e.target.scrollTop + e.srcElement.clientHeight){
      this.getCategoryProductsMore();
    }
  }
  onSelectCategory(newCategory: any) {
    this.selectedCategory = newCategory;
    this.limit = priceLimit;
    this.getCategoryProducts();
  }
  onSelectFileCategory(newCategory: any) {
    this.uploadCategory = newCategory;
    // this.getCategoryProducts();
  }
  onSearchProduct() {
    this.getCategoryProducts();
  }
  handleSortField(field: string){
    if(field === this.sortField){
      this.sortOrder = this.sortOrder === "asc"?"desc":"asc";
    }
    else{
      this.sortField = field;
      this.sortOrder = "asc";
    }
  }
  getCategoryProducts() {
    this.products = [];
    this.loading = true;
    let data = {
      category_id: (this.selectedCategory !== null) ? this.selectedCategory.category.id : '',
      limit: this.limit,
      search_word: this.searchQuery,
    };
    console.log(data)
    this.productService.getCategoryProducts(data)
        .subscribe(
          resp => {
            this.loading = false;
            // console.log(resp)
            if(resp === null) {
              // this.toastyService.warning('У Вас нет товаров');
            }else {
              if(resp.code === 0) {
                if(resp.price_list === undefined || resp.price_list.length === 0){
                  // this.toastyService.warning('У Вас нет товаров');
                  return;
                }
                this.products = resp.price_list;
                if(this.limit < resp.price_list.length)
                  this.timestamp = resp.price_list[this.limit-1].timestamp;
                else
                  this.timestamp = resp.price_list[resp.price_list.length-1].timestamp;
                this.products.map(p => {
                  p.checked = false;
                  if(p.id_1c == null)
                    p.id_1c = '';
                  return p;
                });
              }
            }
          },
          error =>  {
            this.loading = false;
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
          }
        );
  }
  getCategoryProductsMore() {
    let data = {
      category_id: (this.selectedCategory !== null) ? this.selectedCategory.category.id : '',
      limit: this.limit,
      search_word: this.searchQuery,
      timestamp: this.timestamp
    };
    this.productService.getCategoryProducts(data)
        .subscribe(
          resp => {
            if(resp.code === 0) {
              if(resp.price_list === undefined || resp.price_list.length === 0)
                return;
              for(var pl of resp.price_list){
                let exist:boolean = false;
                for(let i = 0; i < this.products.length; i++){
                  if(this.products[i].id === pl.id)
                    exist = true;
                }
                if(!exist)
                  this.products.push(pl);
                this.timestamp = pl.timestamp;
              }
              this.products.map(p => {
                p.checked = false;
                if(p.id_1c == null)
                  p.id_1c = '';
                return p;
              });
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
          }
        );
  }
  onSelectProduct(product: any) {
    let ind = this.selectedProducts.map(function(e) {return e.id;}).indexOf(product.id);
    if(ind > -1) {
      this.selectedProducts.splice(ind, 1);
    }else {
      this.selectedProducts.push(product);
    }
  }
  getSelectedProducts() {
    this.selectedProducts = [];
    this.products.map(p => {
      if(p.checked) {
        this.selectedProducts.push(p);
      }
    });
  }
  changeProductSale(prod: any) {
    let data = {
      item_id: prod.id,
      in_sale: !!prod.in_sale
    };
    this.productService.changeProductSale(data)
        .subscribe(
          res => {
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
          }
        );
  }
  //Edit product:
  onClickProduct(product: any) {
    if(product !== null ) {
      this.productModal.handleOpen('edit', product);
    }else {
      this.toastyService.warning('Товар не существует!');
    }
  }
  //Add product:
  handleProductModal(state, product){
    this.productModal.handleOpen(state, product);
  }
  //upload price list:
  onSelectFile(event: any) {
    this.selectedFile = event.target.files;
    this.fileSelected = true;
  }
  uploadPriceList() {
    if(this.checkUploadForm()) {
      this.loading = true;
      this.modalImportPrice.hide();
      let data = {
        files: this.selectedFile,
        category_id: this.uploadCategory
      };
      this.uploadService.importProductFile(data)
          .subscribe(
            res => {
              if(res) {
                this.toastyService.success('Прайс-лист успешно загружен');
                this.getCategoryProducts();
              }else{
                this.toastyService.warning('Прайс-лист не загружен');
              }
              this.loading = false;
            },
            error =>  {
              this.toastyService.warning(this.errorService.getCodeMessage(error.code));
              this.loading = false;
            }            
          );
    }
  }
  onOpenImportModal() {
    this.fileChooserInit = true;
    this.modalImportPrice.show();
  }
  onCloseImportModal() {
    this.uploadCategory = '';
    this.fileChooserInit = false;
    this.selectedFile = null;
    this.fileSelected = false;
    this.modalImportPrice.hide();
  }
  checkUploadForm() {
    if(this.selectedFile === undefined || this.selectedFile === null) {
      this.toastyService.warning('Вы не выбрали файл');
      return false;
    }
    if(this.uploadCategory === undefined || this.uploadCategory === '') {
      this.toastyService.warning('Выберите категорию товара');
      return false;
    }
    return true;
  }
  //delete products:
  clickDeleteBtn() {
    this.getSelectedProducts();
    if(this.selectedProducts !== undefined && this.selectedProducts.length > 0) {
      this.modalDeleteProduct.show();
    }else {
      this.toastyService.warning('Вы не выбрали товар');
    }
  }
  removeProducts() {
    let productsToRemove = this.getProductIds();
    this.productService.removeProducts(productsToRemove)
        .subscribe(
          res => {
            if(res) {
              this.toastyService.info('Товары удалены');
              this.getCategoryProducts();
              this.modalDeleteProduct.hide();
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
          }
        );
  }
  getProductIds() {
    let newProducts: any[] = [];
    this.products.map(p => {
      if (p.checked) {
        newProducts.push(p.id);
      }
    });
    // this.selectedProducts = newProducts;
    return newProducts;
  }
  selectAllProducts() {
    this.products.forEach(i => i.checked = this.allSelected);
  }
  exportExcell(){
    let cat = this.selectedCategory === null?"":this.selectedCategory.category.id;
    let name = this.selectedCategory === null?"Все продукты":this.selectedCategory.category.name;
    let data = { category_id: cat };
    this.productService.exportPricelist(data, name)
        .subscribe(
          resp => {
            if(resp) {
              this.toastyService.success('Успешно экспортирован');
            }else {
              // this.toastyService.warning(this.errorService.getCodeMessage(resp));
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
          }
        );
  }
  //print:
  printProducts() {
    let printContents: any, popupWin: any;
    printContents = document.getElementById('productsPrintContent').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Price-list</title>
          <style>
            body {
              font-size: 16px;
              font-family: 'Open Sans', sans-serif;
              font-weight: normal;
              font-style: normal;
              font-stretch: normal;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .no-print{display:none}
            .show-print{display:block}
            table{
              border: 1px solid #111;
              border-collapse: collapse;
            }
            table th, table td {padding: 4px 10px;border: 1px solid black;}
          </style>
        </head>
        <body onload='window.print();window.close()'>${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
