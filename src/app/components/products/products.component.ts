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
// import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
// import { serverURL } from '../../shared/config/server';

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

  @ViewChild('modalAddProduct')
  modalAddProduct: ModalDirective;

  @ViewChild('modalProductAdded')
  modalProductAdded: ModalDirective;

  @ViewChild('modalEditProduct')
  modalEditProduct: ModalDirective;

  @ViewChild('modalDeleteProduct')
  modalDeleteProduct: ModalDirective;

  @ViewChild('modalImportPrice')
  modalImportPrice: ModalDirective;

  @ViewChild('modalAddProductDesc')
  modalAddProductDesc: ModalDirective;

  // @ViewChild('cropper', undefined)
  // cropper:ImageCropperComponent;
  //
  // @ViewChild('cropper2', undefined)
  // cropper2:ImageCropperComponent;

  public searchQuery: string = '';
  public sortBy = 'article';
  public sortOrder = 'asc';
  private limit: number = 10;
  private timestamp: any = '';

  private errorMessage: string;
  private categories = new Array();
  private companyCategories = new Array();
  private products = new Array();
  private selectedCategory: any = null;
  private selectedProducts: any[] = [];
  private selectedImage: any = null;
  private processMode: string = '';
  private fileSelected: boolean = false;
  private allSelected: boolean = false;
  private productImageText: string = 'Выберите файл';
  private selectedFile: any = null;
  private fileChooserInit: boolean = false;
  private loading: boolean = false;
  private loadingOnSave: boolean = false;
  private addLoading: boolean = false;
  private uploadCategory = '';

  private sProductImage: any;
  private nProductImage: any;
  // private cropperSettings: CropperSettings;
  private imageSelected: boolean = false;
  private croppedWidth:number;
  private croppedHeight:number;
  private croppedLeft:number;
  private croppedTop:number;

  private sortField:string = "";

  currentImage: any = {
    height: 0,
    width: 0
  };
  loadingImage: boolean = false;
  private newProduct = {
    id: '',
    category_id: 0,
    name: '',
    article: '',
    nomenclature: '',
    made_in: '',
    price: 0,
    description: '',
    active: true,
    image: '',
    resize: 'false',
    top: 0,
    left: 0,
    width: 0,
    height: 0
  };
  private selectedProduct = {
    id: '',
    category_id: 0,
    name: '',
    article: '',
    nomenclature: '',
    made_in: '',
    price: 0,
    description: '',
    active: true,
    image: '',
    resize: 'false',
    top: 0,
    left: 0,
    width: 0,
    height: 0
  };

  constructor (
    private categoryService: CategoryService,
    private companyService: CompanyProfileService,
    private productService: ProductService,
    private uploadService: UploadService,
    private auth: AuthService,
    private router: Router,
    private toastyService: ToastyService,
    private errorService: ErrorService,
  ) {}

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(null, null);
    this.getCategories();
    this.getCategoryProducts();
    this.getCompanyCategories();
    //for cropper
    // this.cropperSettings = new CropperSettings();
    // this.cropperSettings.noFileInput = true;
    // this.cropperSettings.croppedWidth = 100;
    // this.cropperSettings.croppedHeight = 100;
    // this.cropperSettings.canvasWidth = 400;
    // this.cropperSettings.canvasHeight = 300;
    // this.cropperSettings.minWidth = 200;
    // this.cropperSettings.minHeight = 200;
    // this.cropperSettings.keepAspect = true;
    // this.cropperSettings.minWithRelativeToResolution = false;
    this.sProductImage = {};
    this.nProductImage = {};
  }
  //for cropper:
  // cropped(bounds:Bounds) {
  //   this.croppedHeight = bounds.height;
  //   this.croppedWidth = bounds.width;
  //   this.croppedLeft = bounds.left;
  //   this.croppedTop = bounds.top;
  //   // console.log(bounds);
  // }

  onSelectImage(event:any) {
    this.loadingImage = true;
    this.productImageText = 'Файл выбран. Перевыбрать?';
    this.imageSelected = true;
    var image:any = new Image();
    var file:File = event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    if(this.processMode === 'add') {
      myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        // that.cropper.setImage(image);
        that.loadingImage = false;
      };
      this.newProduct.image = event.srcElement.files;
    }else if(this.processMode === 'edit') {
      myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        // that.cropper2.setImage(image);
      };
      this.selectedProduct.image = event.srcElement.files;
      image.addEventListener('load',function(){
        // console.log(image.height);
        that.currentImage.height = image.height;
        that.currentImage.width = image.width;
        that.loadingImage = false;
      });
    }
    myReader.readAsDataURL(file);
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
            this.companyCategories = data;
            // data.map((x:any) => this.selectedCategories.push(x.category.id));
          },
          error =>  this.errorMessage = <any>error
        );
  }
  onScroll (e: any) {
    if(e.target.scrollHeight <= e.target.scrollTop + e.srcElement.clientHeight){
      this.getCategoryProductsMore();
    }
  }
  onSelectCategory(newCategory: any) {
    // console.log(newCategory);
    this.selectedCategory = newCategory;
    this.getCategoryProducts();
  }

  onSelectFileCategory(newCategory: any) {
    this.uploadCategory = newCategory;
    // this.getCategoryProducts();
  }

  onSearchProduct() {
    this.getCategoryProducts();
  }

  getCategoryProducts() {
    this.limit = 10;
    this.loading = true;
    let data = {
      category_id: (this.selectedCategory !== null) ? this.selectedCategory.category.id : '',
      limit: this.limit,
      search_word: this.searchQuery,
    };
    this.productService.getCategoryProducts(data)
        .subscribe(
          resp => {
            // console.log(resp);
            this.loading = false;
            if(resp === null) {
              this.toastyService.warning('У Вас нет товаров');
            }else {
              if(resp.code === 0) {
                this.products = resp.price_list;
                this.timestamp = resp.price_list[this.limit-1].timestamp;
                this.products.map(p => {
                  p.checked = false;
                  return p;
                });
                // console.log(this.products);
              }
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }
  getCategoryProductsMore() {
    if(this.limit === 0)
      return;
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
              if(resp.price_list.length < this.limit){
                this.limit = 0;
              }
              for(var pl of resp.price_list){
                this.products.push(pl);
                this.timestamp = pl.timestamp;
              }
              this.products.map(p => {
                p.checked = false;
                return p;
              });
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onSelectProduct(product: any) {
    // console.log(product);
    let ind = this.selectedProducts.map(function(e) {return e.id;}).indexOf(product.id);
    if(ind > -1) {
      this.selectedProducts.splice(ind, 1);
    }else {
      this.selectedProducts.push(product);
    }
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

  changeProductSale(prod: any) {
    // console.log(prod);
    let data = {
      item_id: prod.id,
      in_sale: !!prod.in_sale
    };
    this.productService.changeProductSale(data)
        .subscribe(
          res => {
            // console.log(res);
          },
          error =>  this.errorMessage = <any>error
        );
  }

  checkAddProductForm() {
    if(this.newProduct.name === '') {
      this.toastyService.warning('Вы не заполнили название продукта');
      return false;
    } else if(this.newProduct.category_id === 0) {
      this.toastyService.warning('Укажите категорию товара');
      return false;
    } else if(this.newProduct.nomenclature === '') {
      this.toastyService.warning('Вы не заполнили ед. измерения');
      return false;
    } else if(this.newProduct.price === 0) {
      this.toastyService.warning('Цена товара указана как ноль тенге');
      return false;
    }
    return true;
  }

  onAddProduct() {
    if(this.checkAddProductForm()) {
      if(this.newProduct.image !== null) this.newProduct.resize = 'true';
      this.newProduct.top = (this.croppedTop !== undefined)?this.croppedTop:0;
      this.newProduct.left = (this.croppedLeft !== undefined)?this.croppedLeft:0;
      this.newProduct.width = (this.croppedWidth !== undefined)?this.croppedWidth:0;
      this.newProduct.height = (this.croppedHeight !== undefined)?this.croppedHeight:0;
      this.addLoading = true;
      this.productService.updateProduct(this.newProduct)
          .subscribe(
            res => {
              if(res !== undefined && res !== null) {
                if (res.code === 0) {
                  this.clearAddModal();
                  this.getCategoryProducts();
                  this.modalAddProduct.hide();
                  this.modalProductAdded.show();
                }else {
                  if(res.message !== undefined && res.message !== null) {
                    if(typeof res.message === 'string') {
                      this.toastyService.warning(res.message);
                    }else {
                      this.toastyService.warning("Не все поля заполнены");
                    }
                  }else {
                    this.toastyService.warning("Ошибка при сохранении");
                  }
                }
              }
              this.addLoading = false;
            },
            error =>  this.errorMessage = <any>error
          );
    }
  }

  clearAddModal() {
    this.newProduct = {
      id: '',
      category_id: 0,
      name: '',
      article: '',
      nomenclature: '',
      made_in: '',
      price: 0,
      description: '',
      active: true,
      image: '',
      resize: 'false',
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.selectedImage = null;
    this.productImageText = 'Выберите файл';
  }

  onClickProduct(product: any) {
    if(product !== null ) {
      this.selectedProduct = product;
      if(product.image !== null) {
        // this.selectedImage = serverURL + product.image;
      }
      this.processMode = 'edit';
      this.modalEditProduct.show();
    }else {
      console.log('product not selected');
    }
  }

  onCloseAddProduct() {
    this.modalAddProduct.hide();
    this.imageSelected = false;
    this.productImageText = 'Выберите файл';
  }
  onCloseEditProduct() {
    this.modalEditProduct.hide();
    this.selectedProduct = {
      id: '',
      category_id: 0,
      name: '',
      article: '',
      nomenclature: '',
      made_in: '',
      price: 0,
      description: '',
      active: true,
      image: '',
      resize: 'false',
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.selectedImage = null;
    this.imageSelected = false;
    this.productImageText = 'Выберите файл';
  }

  showProductImage(product: any) {
    // console.log(product);
  }

  onEditProduct() {
    this.productService.updateProduct(this.selectedProduct)
        .subscribe(
          resp => {
            if(resp === null) {
              this.toastyService.warning('Вы не правильно заполнили');
            }else {
              this.processMode = '';
              this.getCategoryProducts();
              this.modalEditProduct.hide();
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  // onSelectImage(event: any) {
  //   if(this.processMode === 'edit') {
  //     this.selectedProduct.image = event.srcElement.files;

  //   }else if (this.processMode = 'add') {
  //     this.newProduct.image = event.srcElement.files;
  //   }

  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();
  //     reader.onload = (event: any) => {
  //       this.selectedImage = event.target.result;
  //     }
  //     reader.readAsDataURL(event.target.files[0]);
  //   }

  //   this.productImageText = 'Файл выбран. Перевыбрать?';
  // }

  deleteProductImage() {
    this.selectedImage = '';
    this.productImageText = 'Выберите файл';
    this.selectedProduct.image = null;
    this.newProduct.image = null;
    this.imageSelected = false;
  }

  onUpdateProduct() {
    this.addLoading = true;
    if(this.currentImage.height/this.currentImage.width < 0.75){
      this.selectedProduct.top = this.croppedTop - (this.currentImage.width*0.75 - this.currentImage.height);
    }
    this.selectedProduct.left = this.croppedLeft;
    this.selectedProduct.width = this.croppedWidth;
    this.selectedProduct.height = this.croppedHeight;
    this.selectedProduct.resize = 'true';
    // console.log(this.selectedProduct);
    this.productService.updateProduct(this.selectedProduct)
        .subscribe(
          res => {
            if(res) {
              this.toastyService.success('Товар обновлен');
              this.getCategoryProducts();
              this.onCloseEditProduct();
            }
            this.addLoading = false;
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onSelectFile(event: any) {
    this.selectedFile = event.target.files;
    this.fileSelected = true;
  }

  uploadPriceList() {
    if(this.checkUploadForm()) {
      let data = {
        files: this.selectedFile,
        category_id: this.uploadCategory
      };
      this.uploadService.importProductFile(data)
          .subscribe(
            res => {
              // console.log(res);
              if(res) {
                this.toastyService.success('Прайс-лист успешно загружен');
                this.getCategoryProducts();
                this.onCloseImportModal();
              }
            },
            error =>  {
              this.toastyService.warning(error.message);
              this.errorMessage = <any>error;
            }
          );
    }
  }

  onOpenImportModal() {
    this.fileChooserInit = true;
    this.modalImportPrice.show();
  }

  onCloseImportModal() {
    console.log('on close import');
    this.uploadCategory = '';
    this.fileChooserInit = false;
    this.selectedFile = null;
    this.fileSelected = false;
    this.modalImportPrice.hide();
  }

  checkUploadForm() {
    console.log(this.selectedFile);
    // console.log(this.uploadCategory);
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
    // console.log(productsToRemove);
    this.productService.removeProducts(productsToRemove)
        .subscribe(
          res => {
            if(res) {
              this.toastyService.info('Товары удалены');
              this.getCategoryProducts();
              this.modalDeleteProduct.hide();
            }
          },
          error =>  this.errorMessage = <any>error
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
    this.allSelected = true;
    this.products.forEach(i => i.checked = true);
  }

  unSelectAllProducts() {
    this.allSelected = false;
    this.products.forEach(i => i.checked = false);
  }

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
