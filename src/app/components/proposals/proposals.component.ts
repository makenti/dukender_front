import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastyService } from 'ng2-toasty';
import {
			AuthService,
		  ProposalService,
      CompanyProfileService } from '../../services/index';

import * as globalVars from '../../common/config/globalVars';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
  providers: [ AuthService, ProposalService, CompanyProfileService]
})
export class ProposalsComponent implements OnInit {

  @ViewChild('modalCheckDistricts')
  modalCheckDistricts: ModalDirective;

	private proposals: any[] = [];
	private errorMessage: any[] = [];
	private selectedFilter = '';
  private selectedDistricts: any[] = [];
  private currUser: any;
  private companyRegions: any[] = [];
  private loading: boolean = false;
  private proposalStats: any[] = [];

  constructor(
    private auth: AuthService,
  	private router: Router,
  	private proposalService: ProposalService,
    private companyService: CompanyProfileService,
    private toastyService: ToastyService
  ) { }

  ngOnInit() {
    this.auth.updateUserInfo().subscribe(
      resp => {
        if(resp) {
          this.currUser = this.auth.getUser();
          this.getProposals(globalVars.selected_proposal);
          this.getCompanyRegions();
        }
      }, null);
  }

  getProposals(filter: any) {
  	this.selectedFilter = filter;
    this.proposals = [];
    this.loading = true;
  	let data = {
  		status: filter,
			timestamp: '',
			customer_id: '',
      district_ids: this.selectedDistricts
  	};
  	this.proposalService.getProposals(data)
        .subscribe(
          resp => {
            this.modalCheckDistricts.hide();
            if(resp === null) {
              this.toastyService.info('У Вас еще нет заявок');
            }else {
            	if(resp.code === 0) {
            		this.proposals = resp.requests;
                if(resp.request_stats !== undefined)
                  this.proposalStats = resp.request_stats;
            	}
            }
            this.loading = false;
          },
          error =>  this.errorMessage = <any>error
        );
    // globalVars.selected_proposal = filter; //
  }

  getCompanyRegions() {
    this.companyService.getCompanyRegions()
        .subscribe(
          data => {
            this.convertFromServer(data);
          },
          error =>  this.errorMessage = <any>error
        );
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

  onSelectDistrict(district: any) {
    // console.log(this.selectedDistricts);
    if(district === '') {
      this.selectedDistricts = [];
    }else {
      let ind = this.selectedDistricts.map((id) => { return id; }).indexOf(district.id);
      if(ind > -1) {
        this.selectedDistricts.splice(ind, 1);
      }else {
        this.selectedDistricts.push(district.id);
      }
    }
  }

  updateProposals() {
    this.getProposals(this.selectedFilter);
  }

  selectCheckedDistricts() {
    // console.log(this.selectedDistricts);
    this.getProposals('');
    // window.localStorage.setItem('user_districts', this.selectedDistricts);
  }

  showProposal(item: any) {
    console.log(this.currUser);
    let curUserEntry = (this.currUser.entry !== undefined && this.currUser.entry !== null)?this.currUser.entry: null;
    if((curUserEntry !== null && curUserEntry.profile_type === 1) ||
        item.editor === this.currUser.username && item.status !== 0 ||
        item.status === 0) {
      this.router.navigate(['/proposal', item.request_id]);
    }else {
      this.toastyService.warning('Вы не можете обработать эту заявку');
    }
    // this.router.navigate(['/proposal', item.request_id]);
  }

}
