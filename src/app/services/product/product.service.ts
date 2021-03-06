import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { serverURL } from '../../common/config/server';
import { transformRequest } from '../../common/config/transformRequest';
import { handleError } from '../../common/config/errorHandler';
import * as FileSaver from 'file-saver';

import { AuthService } from '../auth/index';
import { PromotionService } from '../promotion/promotion.service';

@Injectable()
export class ProductService {

  constructor(
    public http: Http,
    public auth: AuthService,
    public promService: PromotionService
  ) { }

  addProduct(product: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(product);
    return this.http.post(serverURL + '/products/create_edit_item_v2/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      return resp;
                    })
                    .catch(handleError);
  }

  updateProduct(product: any, imageSelected: boolean): Observable<any> {
    if(product.id_1c == null)
      product.id_1c = '';
    return Observable.create((observer: any) => {

      let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.open('POST', serverURL + '/products/create_edit_item_v2/', true);
      xhr.setRequestHeader('Auth-Token', this.auth.getToken());
      xhr.setRequestHeader('Entry-ID', this.auth.currentEntry.id);
      

      formData.append('id', product.id);
      formData.append('category_id', product.category_id);
      formData.append('subcategory_id', product.subcategory_id);
      formData.append('name', product.name);
      formData.append('nomenclature', product.nomenclature);
      formData.append('price', product.price);
      formData.append('active', product.active);
      formData.append('article', product.article);
      formData.append('made_in', product.made_in);
      formData.append('description', product.description);
      formData.append('id_1c', product.id_1c);
      formData.append('part_1c', product.part_1c);
      formData.append('barcode', product.barcode);
      formData.append('min_left', product.min_left);
      if(imageSelected){
        formData.append('image', product.image);
      }else if(product.image === null){
        formData.append('image', null);
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let resp = JSON.parse(xhr.response);
            if(resp.code === 0) {
              observer.next(resp);
              observer.complete();
            }else {
              observer.next(resp);
              observer.complete();
            }
            // observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };

      xhr.onload = () => {
        console.log('uploaded');
        return true;
      };

      xhr.upload.onprogress = (event) => {
        // this.progress = Math.round(event.loaded / event.total * 100);
        // this.progressObserver.next(this.progress);
      };

      xhr.send(formData);

    });
  }

  removeProducts(products: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = 'item_ids=' + JSON.stringify(products);
    return this.http.post(serverURL + '/products/delete_items/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return true;
                      }else {
                        return false;
                      }
                    })
                    .catch(handleError);
  }

  getCategoryProducts(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);
    return this.http.post(serverURL + '/products/current_price_v2/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        if(resp.pasettings !== undefined && resp.pasettings !== null) {
                          this.promService.setPromotionPercents(resp.pasettings);
                        }
                        return resp;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  changeProductSale(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);
    return this.http.post(serverURL + '/products/change_in_sale/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      if (resp.code === 0) {
                        return resp;
                      }else {
                        return null;
                      }
                    })
                    .catch(handleError);
  }

  exportPricelist(data: any, name: string) {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/vnd.ms-excel',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    let bodyString = "category_id="+data.category_id;

    return this.http.post(serverURL + '/products/price/export_to_excel/', bodyString,{
        headers: headers,
        responseType: ResponseContentType.Blob
    }).map((res: any) => {
      let blob = new Blob([res._body], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
          });
      FileSaver.saveAs(blob, "Прайс_лист_"+name+".xls");
      return true;
    });
  }

  addToCategory(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });

    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);
    return this.http.post(serverURL + '/products/set_categories/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      return resp;
                    })
                    .catch(handleError);
  }
  // then removethis:
  createCategory(data: any): Observable<any> {
    let headers = new Headers({
      'Auth-Token': this.auth.getToken(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Entry-ID': this.auth.currentEntry.id
    });
    let options = new RequestOptions({ headers: headers });
    let bodyString = transformRequest(data);
    return this.http.post(serverURL + '/products/subcategory/create/', bodyString, options)
                    .map((res: Response) => {
                      let resp = res.json();
                      return resp;
                    })
                    .catch(handleError);
  }
}
