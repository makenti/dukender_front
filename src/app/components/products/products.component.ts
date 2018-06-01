import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { serverURL } from '../../common/config/server';

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


  @ViewChild('modalAddToCategory')
  modalAddToCategory: ModalDirective;

  @ViewChild('modalImportPrice')
  modalImportPrice: ModalDirective;

  @ViewChild('modalAddProductDesc')
  modalAddProductDesc: ModalDirective;

  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;
  
  @ViewChild('cropper2', undefined)
  cropper2:ImageCropperComponent;

  @ViewChild('modalCheckImage')
  modalCheckImage: ModalDirective;


  public searchQuery: string = '';
  public sortField:string = "";
  public sortOrder:string = "asc";
  public limit: number = priceLimit;
  public timestamp: any = '';

  public errorMessage: string;
  public categories = new Array();
  public companyCategories = new Array();
  public products = new Array();
  public selectedCategory: any = null;
  public selectedSubCat: any = null;
  public selectedProducts: any[] = [];
  public selectedImage: any = null;
  public processMode: string = '';
  public fileSelected: boolean = false;
  public allSelected: boolean = false;
  public productImageText: string = 'Выберите файл';
  public selectedFile: any = null;
  public fileChooserInit: boolean = false;
  public loading: boolean = false;
  public loadingOnSave: boolean = false;
  public addLoading: boolean = false;
  public uploadCategory = '';

  public sProductImage: any;
  public nProductImage: any;
  public cropperSettings: CropperSettings;
  public imageSelected: boolean = false;
  public croppedWidth:number;
  public croppedHeight:number;
  public croppedLeft:number;
  public croppedTop:number;
  public isCrop:boolean = false;
  public loadingImage: boolean = false;
  public chosenImage:any = {
    full: '',
    cropped: '',
    width: 0,
    height: 0,
    validationClass: 'greenText'
  };

  public newProduct = {
    id: '',
    category_id: 0,
    name: '',
    article: '',
    nomenclature: '',
    made_in: '',
    price: 0,
    description: '',
    id_1c: '',
    part_1c: 0,
    active: true,
    image: '',
    resize: 'false',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    barcode: '',
    min_left: 0,
  };
  public selectedProduct = {
    id: '',
    category_id: 0,
    name: '',
    article: '',
    nomenclature: '',
    made_in: '',
    price: 0,
    description: '',
    id_1c: '',
    part_1c: 0,
    active: true,
    image: '',
    resize: 'false',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    barcode: '',
    min_left: 0,
  };
  public cropPosition = {
    x: 0,
    y: 0,
    w: 200,
    h: 200
  };
  public newCat = {
    group: null,
    cat: null,
    createNew: false
  }

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
    // this.getCategories();
    this.getCategoryProducts();
    this.getCompanyCategories();
    //for cropper
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.allowedFilesRegex =  /.(jpe?g|png)$/i;
    this.cropperSettings.croppedWidth = 600;
    this.cropperSettings.croppedHeight = 600;
    this.cropperSettings.canvasWidth = 600;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.minWidth = 200;
    this.cropperSettings.minHeight = 200;
    this.cropperSettings.keepAspect = true;
    this.cropperSettings.minWithRelativeToResolution = false;
    this.sProductImage = {};
    this.nProductImage = {};
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
            this.newCat = {
              group: null,
              cat: null,
              createNew: false
            }
            // data.map((x:any) => this.selectedCategories.push(x.category.id));
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
  onSelectCategory(newCategory: any) {
    console.log(newCategory)
    this.selectedSubCat = null;    
    this.selectedCategory = newCategory;
    this.limit = priceLimit;
    this.getCategoryProducts();
  }
  onSelectSubCategory(sub: any){
    console.log(sub)
    this.selectedSubCat = sub;
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
  handleCreateCatModal(update){
    this.newCat.createNew = !this.newCat.createNew;
    if(update)
      this.getCompanyCategories();
  }
  getCategoryProducts() {
    this.products = [];
    this.loading = true;
    let subcats = [];
    if(this.selectedSubCat !== null)
      subcats = [this.selectedSubCat.id];
    let data = {
      category_id: (this.selectedCategory !== null) ? this.selectedCategory.category.id : '',
      subcategory_ids: subcats,
      limit: this.limit,
      search_word: this.searchQuery,
    };

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
                  return p;
                });
              }
            }
          },
          error =>  {
            this.loading = false;
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
  onScroll (e: any) {
    if(e.target.scrollHeight <= e.target.scrollTop + e.srcElement.clientHeight){
      this.getCategoryProductsMore();
    }
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
              if(resp.price_list === undefined || resp.price_list.length === 0)
                return;
              if(resp.price_list.length < this.limit){
                this.limit = 0;
              }
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
                return p;
              });
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
  onAddNewProduct(){
    this.processMode = 'add';
    this.productImageText = 'Выберите файл';
    this.imageSelected = false;
    this.selectedImage = null;
    this.modalAddProduct.show();
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
            this.errorMessage = <any>error
          }
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
  //Edit/Add products:
  onClickProduct(product: any) {
    if(product !== null ) {
      this.selectedProduct = product;

      this.imageSelected = false;
      this.isCrop = false;      
      if(product.image_url !== null) {
        this.selectedImage = product.image_url;
      }else{
        this.selectedImage = null;
      }
      this.productImageText = 'Выберите файл';
      this.processMode = 'edit';
      this.modalEditProduct.show();
    }else {
      this.toastyService.warning('Товар не существует!');
    }
  }
  cropped(bounds:Bounds) {
    this.croppedHeight =bounds.bottom-bounds.top;
    this.croppedWidth = bounds.right-bounds.left;
    if(this.isCrop){
      if(this.croppedHeight >= 600 && this.croppedWidth >= 600)
        this.chosenImage.validationClass = "greenText";
      else
        this.chosenImage.validationClass = "redText";
    }
  }
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
        that.chosenImage.full = loadEvent.target.result;
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);
      };
      image.addEventListener('load',function(){
        that.chosenImage.width = image.width;
        that.chosenImage.height = image.height;
        if(image.width >= 600 && image.height >= 600)
          that.chosenImage.validationClass = "greenText";
        else
          that.chosenImage.validationClass = "redText";
        that.loadingImage = false;
      });
    }else if(this.processMode === 'edit') {
      myReader.onloadend = function (loadEvent:any) {
        that.chosenImage.full = loadEvent.target.result;
        image.src = loadEvent.target.result;
        that.cropper2.setImage(image);
      };
      image.addEventListener('load',function(){
        that.chosenImage.width = image.width;
        that.chosenImage.height = image.height;
        if(image.width >= 600 && image.height >= 600)
          that.chosenImage.validationClass = "greenText";
        else
          that.chosenImage.validationClass = "redText";
        that.loadingImage = false;
      });
    }
    myReader.readAsDataURL(file);
  }
  checkImage(){
    if(this.imageSelected && this.croppedHeight < 600 && this.croppedWidth < 600){
      this.modalAddProduct.hide();
      this.modalEditProduct.hide();
      this.modalCheckImage.show();
    }else
      if(this.processMode === 'add')
        this.onAddProduct();
      else
        this.onUpdateProduct();
  }
  hideCheckImage(){
    this.modalCheckImage.hide();
    if(this.processMode === 'add')
      this.modalAddProduct.show();
    else
      this.modalEditProduct.show();
  }
  continueAddUpdate(){
    this.modalCheckImage.hide();
    if(this.processMode === 'add')
      this.onAddProduct();
    else
      this.onUpdateProduct();
  }
  onCloseAddProduct() {
    this.modalAddProduct.hide();
    this.imageSelected = false;
    this.selectedImage = null;
    this.productImageText = 'Выберите файл';
  }
  onAddProduct() {
    if(this.checkAddProductForm()) {
      this.addLoading = true;
      if(this.imageSelected){
        if(this.isCrop)
          this.newProduct.image = this.dataURLtoFile(this.nProductImage.image, 'image.png');
        else
          this.newProduct.image = this.dataURLtoFile(this.chosenImage.full, 'image.png');
      }
      this.productService.updateProduct(this.newProduct, this.imageSelected)
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
            error =>  {
              this.toastyService.warning(this.errorService.getCodeMessage(error.code));
              this.errorMessage = <any>error
              this.addLoading = false;
            }
          );
    }
  }
  onUpdateProduct() {
    this.addLoading = true;
    if(this.imageSelected){
      if(this.isCrop)
        this.selectedProduct.image = this.dataURLtoFile(this.sProductImage.image, 'image.png');
      else
        this.selectedProduct.image = this.dataURLtoFile(this.chosenImage.full, 'image.png');
    }
    this.productService.updateProduct(this.selectedProduct, this.imageSelected)
        .subscribe(
          res => {
            if(res.code === 0) {
              this.toastyService.success('Товар обновлен');
              this.getCategoryProducts();
              this.onCloseEditProduct();
            }else{
              this.toastyService.warning(String(res.code) + String(res.message));
            }
            this.addLoading = false;
          },
          error =>  {
            this.addLoading = false;
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
  // onEditProduct() {
  //   this.productService.updateProduct(this.selectedProduct, this.imageSelected)
  //       .subscribe(
  //         resp => {
  //           if(resp === null) {
  //             this.toastyService.warning('Вы не правильно заполнили');
  //           }else {
  //             this.processMode = '';
  //             this.getCategoryProducts();
  //             this.modalEditProduct.hide();
  //           }
  //         },
  //         error =>  this.errorMessage = <any>error
  //       );
  // }
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
      id_1c: '',
      part_1c: 0,
      active: true,
      image: '',
      resize: 'false',
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      barcode: '',
      min_left: 0,
    };
    this.selectedImage = null;
    this.imageSelected = false;
    this.productImageText = 'Выберите файл';
  }
  @HostListener('window:keyup', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    let x = event.keyCode;
    if (x === 27) {
      this.onCloseEditProduct();
    }
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
      id_1c: '',
      part_1c: 0,
      active: true,
      image: '',
      resize: 'false',
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      barcode: '',
      min_left: 0,
    };
    this.selectedImage = null;
    this.imageSelected = false;
    this.productImageText = 'Выберите файл';
  }
  deleteProductImage() {
    this.selectedImage = '';
    this.productImageText = 'Выберите файл';
    this.selectedProduct.image = null;
    this.newProduct.image = null;
    this.imageSelected = false;
  }
  deleteSelectedImage(){
    this.productImageText = 'Выберите файл';
    this.imageSelected = false;
    if(this.selectedProduct.image !== null) {
      this.selectedImage = serverURL + this.selectedProduct.image;
    }else{
      this.selectedImage = null;
    }
  }
  dataURLtoFile(dataurl, filename):any {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
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
              this.errorMessage = <any>error;
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
  //add to category
  handleAddToCategory() {
    this.getSelectedProducts();
    if(this.selectedProducts !== undefined && this.selectedProducts.length > 0) {
      this.modalAddToCategory.show();
      this.newCat.group = this.companyCategories[0].category;
    }else {
      this.toastyService.warning('Вы не выбрали товар');
    }
  }
  selectGroup(group){
    this.newCat.group = group;
    this.newCat.cat = null;
    console.log(group)
  }
  selectCat(category){
    this.newCat.cat = category;
  }
  addToCategory(){
    if(!this.newCat.cat){
      this.toastyService.warning("Выберите категорию");
      return;
    }
    let sp = [...this.selectedProducts.map(p=>{return p.id})];
    let data = {
      category_id: this.newCat.group.id,
      subcategory_id: this.newCat.cat.id,
      item_ids: sp
    };
    console.log(data);
    this.productService.addToCategory(data)
        .subscribe(
          res => {
            if(res) {
              this.toastyService.info('Товары добавлены в категорию');
              this.getCategoryProducts();
              this.modalAddToCategory.hide();
              this.newCat = {
                group: null,
                cat: null,
                createNew: false
              }
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
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
            this.errorMessage = <any>error
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
    // console.log(this.selectedCategory)
    let cat = this.selectedCategory === null?"":this.selectedCategory.category.id;
    let name = this.selectedCategory === null?"Все продукты":this.selectedCategory.category.name;
    let data = {
      category_id: cat
    };
    this.productService.exportPricelist(data, name)
        .subscribe(
          resp => {
            // console.log(resp);
            if(resp) {
              this.toastyService.success('Успешно экспортирован');
            }else {
              // this.toastyService.warning(this.errorService.getCodeMessage(resp));
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
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
