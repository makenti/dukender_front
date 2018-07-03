import { Component, OnInit, ViewChild, HostListener, Input, Output } from '@angular/core';
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

@Component({
    selector: 'product-modal',
    templateUrl: './product-modal.component.html',
    styles: [`
    /* input file */
    .btn-file {
        position: relative;
        overflow: hidden;
        margin: 0 20px;
    }
    .btn-file input[type=file] {
        position: absolute;
        top: 0;
        right: 0;
        min-width: 100%;
        min-height: 100%;
        font-size: 100px;
        text-align: right;
        filter: alpha(opacity=0);
        opacity: 0;
        outline: none;
        background: white;
        cursor: inherit;
        display: block;
    }
    /*form*/    
      .add-product-form {
        margin: 0;
        width: 100%;
        display: flex;
        direction: row
      }
      .add-product-form .side{
        flex: 1;
        padding: 10px;
        direction: column;
      }
      .form-field {
        display: flex;
        direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .form-field label{
        margin: 0;
      }
    `]
})
export class ProductModal implements OnInit {
    @ViewChild('modalAddProduct')
    modalAddProduct: ModalDirective;
    @ViewChild('modalProductAdded')
    modalProductAdded: ModalDirective;
    @ViewChild('cropper', undefined)
    cropper:ImageCropperComponent;
    @ViewChild('cropper2', undefined)
    cropper2:ImageCropperComponent;
    processMode: string = '';
    addLoading: boolean = false;
    newProduct = {
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
    selectedImage = null;
    nProductImage;
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
        this.cropperSettings.croppedWidth = 600;
        this.cropperSettings.croppedHeight = 600;
        this.cropperSettings.canvasWidth = 600;
        this.cropperSettings.canvasHeight = 300;
        this.cropperSettings.minWidth = 200;
        this.cropperSettings.minHeight = 200;
        this.cropperSettings.keepAspect = true;
        this.cropperSettings.minWithRelativeToResolution = false;
        this.nProductImage = {};
    }
    handleOpenClose(state){
        if(state)
            this.modalAddProduct.show();
        else 
            this.modalAddProduct.hide();
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
    
    dataURLtoFile(dataurl, filename):any {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
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
                    //   this.getCategoryProducts();
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
                  this.addLoading = false;
                }
              );
        }
      }
}