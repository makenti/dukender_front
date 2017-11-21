import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  CompanyRegionsService,
  CompanyProfileService } from '../../services/index';

import { ToastyService } from 'ng2-toasty';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'app-comregion',
  templateUrl: 'company.regions.html',
  styleUrls: ['company.info.css']
})
export class CompanyRegionsComponent implements OnInit {

	public errorMessage: string;
  public regions: string[];
  public districts: any[];
  public selectedRegion: any;
  public selectedRegionID: any;
  public companyRegions: any[] = [];
  public districtsData: any[] = [];
  public currentCompany: any;
  public loading: boolean = false;
  public register: boolean = true;
  // public checked
  public amount: any = null;

  constructor (
    public regionService: CompanyRegionsService,
    public companyService: CompanyProfileService,
    public auth: AuthService,
    public router: Router,
    public toastyService: ToastyService
   ) {
  }

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(null, null);
    this.getCompanyRegions();
    this.getRegions();
    this.loading = true;
    if(window.location.pathname === "/company_region"){
      this.register = false;
    }
  }

  getUserCompanyRegion() {
    this.currentCompany = this.auth.getUserCompany();
    // console.log(this.currentCompany);
    if(this.currentCompany !== null) {
      this.selectedRegion = this.currentCompany.district.region;
      this.selectedRegionID = this.currentCompany.district.region.id;
      this.getDistricts();
    }
  }

  getRegions() {
    this.regionService.getRegions()
        .subscribe(
          regions => {
            this.regions = regions;
            this.loading = false;
          },
          error =>  this.errorMessage = <any>error
        );
  }

  onSelectRegion(newRegion: any) {
    this.selectedRegion = newRegion;
    // console.log(newRegion);
    if(this.selectedRegion !== undefined && this.selectedRegion !== '') {
      this.getDistricts();
    }
  }

  getDistricts() {
    let data = {
      region_id: this.selectedRegion.id
    };
    this.regionService.getRegionDistricts(data)
        .subscribe(
          districts => {
            this.districts = districts;

            // convert to companyRegions
            let region = {
              id: this.selectedRegion.id,
              name: this.selectedRegion.name,
              districts: new Array()
            };
            // region.districts = districts;

            districts.map((item) => {
              let district = {
                district: item,
                category_A: false,
                category_B: false,
                category_C: false,
                category_W: false,
                category_H: false,
                category_P: false,
                a_amount: 0,
                b_amount: 0,
                c_amount: 0,
                w_amount: 0,
                h_amount: 0,
                p_amount: 0
              };
              region.districts.push(district);
            });
            this.companyRegions.push(region);
          },
          error =>  this.errorMessage = <any>error
        );
  }

  getCompanyRegions() {
    this.companyService.getCompanyRegions()
        .subscribe(
          data => {
            if(Object.keys(data).length === 0 && data.constructor === Object) {
              this.getUserCompanyRegion();
            }else {
              this.convertFromServer(data);
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  checkShopCategory(event: any, region: any) {
    console.log(event.target.value, region);
    // region.districts.map(d => {
    //   d.category_A = true;
    // });
  }

  convertFromServer(regions: any) {

    for (let key in regions) {
      let value = regions[key];
      let region = {
        id: key,
        name: regions[key].region_name,
        districts: new Array()
      };
      for (let key in value) {
        if(key !== 'region_name') {
          region.districts.push(value[key]);
        }
      }
      this.companyRegions.push(region);
    }
  }

  onRemoveRegion(region: any) {
    let ind = this.companyRegions.map((e: any) => { return e.id; }).indexOf(region.id);
    if(ind > -1) {
      this.companyRegions.splice(ind, 1);
    }
  }

  updateCompanyRegions() {
    let regions = this.companyRegions;
    for (let key in regions) {
      let data = regions[key];
      // console.log(data.districts);
      for (let item of data.districts) {
      //   console.log(key);
        this.districtsData.push(item);
      }
    }
    // console.log(this.districtsData);
  	let data = {
  		districts: this.districtsData
  	};

    this.companyService.updateCompanyRegions(data)
        .subscribe(
          resp => {
            if(resp) {
              this.toastyService.success('Вы успешно обновили данные');
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }
  selectAll(region, e){
    console.log(region.districts, e.target.checked);
    for(let i = 0; i < region.districts.length; i++){
      region.districts[i].category_A = e.target.checked;
      region.districts[i].category_B = e.target.checked;
      region.districts[i].category_C = e.target.checked;
      region.districts[i].category_H = e.target.checked;
      region.districts[i].category_P = e.target.checked;
      region.districts[i].category_W = e.target.checked;
    }
  }
  selectAllDistrict(region, district, e){
    district.category_A = e.target.checked;
    district.category_B = e.target.checked;
    district.category_C = e.target.checked;
    district.category_H = e.target.checked;
    district.category_P = e.target.checked;
    district.category_W = e.target.checked;
  }
  setForAll(region){
    console.log("f");
    for(let i = 0; i < region.districts.length; i++){
      region.districts[i].a_amount = this.amount;
      region.districts[i].b_amount = this.amount;
      region.districts[i].c_amount = this.amount;
      region.districts[i].h_amount = this.amount;
      region.districts[i].p_amount = this.amount;
      region.districts[i].w_amount = this.amount;
    }
  }
}
