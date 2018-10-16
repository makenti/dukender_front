import { Component, OnInit, ViewChild, HostListener, Input, Output, OnChanges, SimpleChanges, SimpleChange, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import {
  AuthService,
  CategoryService,
  CompanyProfileService,
  ProductService,
  UploadService,
  PromotionService,
  ErrorService } from '../../services/index';
import { ToastyService } from 'ng2-toasty';
import { serverURL } from '../../common/config/server';
import { EMPTY_PRODUCT, dataURLtoFile } from '../../common/constants/products';
@Component({
  selector: 'product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModal implements OnInit, OnChanges {
    @ViewChild('modalAddProduct')
    modalAddProduct: ModalDirective;
    @ViewChild('modalProductAdded')
    modalProductAdded: ModalDirective;
    @ViewChild('modalAddProductDesc')
    modalAddProductDesc: ModalDirective;  
    @ViewChild('cropper', undefined)
    cropper:ImageCropperComponent;
    @ViewChild('modalCheckImage')
    modalCheckImage: ModalDirective;
    @Input() companyCategories:any[] = [];
	  @Output() getProducts = new EventEmitter<any[]>();
    processMode: string = '';
    addLoading: boolean = false;
    selectedImage = null;
    nProductImage;
    newProduct = EMPTY_PRODUCT;
    imageSelected: boolean = false;
    isCrop:boolean = false;
    loadingImage: boolean = false;
    chosenImage = {
        full: '',
        cropped: '',
        width: 0,
        height: 0,
        validationClass: 'greenText'
    };
    productImageText: string = 'Выберите файл';
    cropperSettings: CropperSettings;
    croppedWidth:number;
    croppedHeight:number;
    text = {
      title: 'Добавление товара',
    }
    subcategories:any[] = [];
    public croppedLeft:number;
    public croppedTop:number;
    public cropPosition = {
      x: 0,
      y: 0,
      w: 200,
      h: 200
    };
    constructor(
        public categoryService: CategoryService,
        public companyService: CompanyProfileService,
        public productService: ProductService,
        public uploadService: UploadService,
        public auth: AuthService,
        public router: Router,
        public toastyService: ToastyService,
        public errorService: ErrorService,
    ){}
    ngOnInit(){
        //for cropper
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.allowedFilesRegex =  /.(jpe?g|png)$/i;
        this.cropperSettings.croppedWidth = 458;
        this.cropperSettings.croppedHeight = 458;
        this.cropperSettings.canvasWidth = 458;
        this.cropperSettings.canvasHeight = 270;
        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;
        this.cropperSettings.keepAspect = true;
        this.cropperSettings.minWithRelativeToResolution = false;
        this.nProductImage = {};
    }
    ngOnChanges(changes: SimpleChanges) {
      const companyCategories: SimpleChange = changes.companyCategories;
      this.companyCategories = companyCategories.currentValue;
    }
    handleOpen(mode, product){
      this.processMode = mode;
      this.productImageText = 'Выберите файл';
      this.imageSelected = false;
      if(mode == 'edit'){
        this.newProduct = product;
        if(this.newProduct.subcategory_id == null)
          this.newProduct.subcategory_id = '';
        this.isCrop = false;      
        if(product.image_url !== null && product.image_url != "") {
          this.selectedImage = product.image_url;
        }else{
          this.selectedImage = null;
        }
        this.text.title = 'Изменение товара';
      }else{
        this.text.title = 'Добавление товара';
        this.newProduct = Object.assign({}, EMPTY_PRODUCT);
        this.selectedImage = null;
      }
      let cat;
      if(this.companyCategories != undefined)
        cat = this.companyCategories.find(cc=>cc.category.id === this.newProduct.category_id);
      this.subcategories = cat?cat.category.childs:[];
      this.modalAddProduct.show();
    }
    handleClose(){
      this.modalAddProduct.hide();
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
      }
      myReader.readAsDataURL(file);
    }
    checkAddProductForm() {
      if(this.newProduct.name === '') {
        this.toastyService.warning('Вы не заполнили название продукта');
        return false;
      } else if(this.newProduct.category_id === 0) {
        this.toastyService.warning('Укажите товарную группу');
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
    clearAddModal() {
      this.newProduct = EMPTY_PRODUCT;
      this.selectedImage = null;
      this.imageSelected = false;
      this.productImageText = 'Выберите файл';
    }
    @HostListener('window:keyup', ['$event'])
    keyboardInput(event: KeyboardEvent) {
      let x = event.keyCode;
      if (x === 27) {
        this.onCloseAddProduct();
      }
    }
    onCloseAddProduct() {
        this.modalAddProduct.hide();
        this.imageSelected = false;
        this.selectedImage = null;
        this.productImageText = 'Выберите файл';
    }
    closeModalProductDesc(){
      this.newProduct.description = "";
      this.modalAddProductDesc.hide();
    }
    deleteProductImage() {
      this.selectedImage = '';
      this.productImageText = 'Выберите файл';
      this.newProduct.image = null;
      this.imageSelected = false;
    }
    deleteSelectedImage(){
      this.productImageText = 'Выберите файл';
      this.imageSelected = false;
      if(this.newProduct.image !== null) {
        this.selectedImage = serverURL + this.newProduct.image;
      }else{
        this.selectedImage = null;
      }
    }
    checkImage(){
      if(this.imageSelected && this.croppedHeight < 600 && this.croppedWidth < 600){
        this.modalAddProduct.hide();
        this.modalCheckImage.show();
      }else{
        this.onAddProduct();
      }
    }
    hideCheckImage(){
      this.modalCheckImage.hide();
      this.modalAddProduct.show();
    }
    continueAddUpdate(){
      this.modalCheckImage.hide();
      this.onAddProduct();
    }
    onAddProduct() {
      if(this.processMode == 'add')
        if(!this.checkAddProductForm())
          return;
      if(this.imageSelected){
        if(this.isCrop)
          this.newProduct.image = dataURLtoFile(this.nProductImage.image, 'image.png');
        else
          this.newProduct.image = dataURLtoFile(this.chosenImage.full, 'image.png');
      }
      this.addLoading = true;
      this.productService.updateProduct(this.newProduct, this.imageSelected)
          .subscribe(
            res => {
              if(res !== undefined && res !== null) {
                if (res.code === 0) {
                  this.clearAddModal();
                  if(this.processMode === 'add'){
                    this.modalProductAdded.show();
                  }else{
                    this.toastyService.success('Товар обновлен');
                  }
                  this.getProducts.emit();
                  this.modalAddProduct.hide();
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
              this.addLoading = false;
            }
          );
      }
      onChangeGroup(){
        this.subcategories = this.companyCategories.find(cc=>cc.category.id === this.newProduct.category_id).category.childs;
        this.newProduct.subcategory_id = '';
      }
}