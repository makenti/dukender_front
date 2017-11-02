import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastyService } from 'ng2-toasty';
import {
			AuthService,
		  ProposalService,
      CompanyProfileService } from '../../services/index';

import { proposalLimit } from '../../common/config/limits';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
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
  private searchQuery: string = '';
  private sortField:string = "";
  private sortOrder:string = "asc";
  
  private filter: any;

  constructor(
    private auth: AuthService,
  	private router: Router,
  	private proposalService: ProposalService,
    private companyService: CompanyProfileService,
    private toastyService: ToastyService
  ) { }

  ngOnInit() {
    let id = this.proposalService.getFilter().selected;
    if(id!==null){
      this.getProposals(id);
    }
    this.getLocalFilter();
    this.auth.updateUserInfo().subscribe(
      resp => {
        if(resp) {
          this.currUser = this.auth.getUser();
          this.getCompanyRegions();
        }
      }, null);
  }
  getLocalFilter(){
    let id = this.selectedFilter === ''? 7 : this.selectedFilter;
    this.sortField = this.proposalService.getFilter().fields[id].field;
    this.sortOrder = this.proposalService.getFilter().fields[id].order;
    console.log(this.sortField, this.sortOrder);
  }
  getProposals(id: any) {
  	this.selectedFilter = id;
    this.proposals = [];
    this.loading = true;
  	let data = {
  		status: id,
			timestamp: '',
			customer_id: '',
			limit: proposalLimit,
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
                for(let i = 0; i < this.proposals.length; i++){
                  this.proposals[i].customer_name = this.proposals[i].customer.name;
                  this.proposals[i].customer_district = this.proposals[i].customer.district.name;
                    console.log(this.proposals[i].items);
                  this.proposals[i].tooltip = "";
                  for(let j = 0; j < this.proposals[i].items.length; j++){
                    if(j == 3){
                      this.proposals[i].tooltip += "...";
                      break;
                    }
                    let k = j + 1;
                    this.proposals[i].tooltip += k + ". " + this.proposals[i].items[j]+" \r\n";
                  }
                }

                if(resp.request_stats !== undefined)
                  this.proposalStats = resp.request_stats;
            	}
            }
            this.loading = false;
          },
          error =>  this.errorMessage = <any>error
        );
    this.proposalService.setSelectedFilter(id);
    this.getLocalFilter();
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
    this.getProposals('');
    // window.localStorage.setItem('user_districts', this.selectedDistricts);
  }

  showProposal(item: any) {
    let curUserEntry = (this.currUser.entry !== undefined && this.currUser.entry !== null)?this.currUser.entry: null;
    if(curUserEntry !== null ||
        item.editor === this.currUser.username && item.status !== 0 ||
        item.status === 0) {
      this.router.navigate(['/proposal', item.request_id]);
    }else {
      this.toastyService.warning('Вы не можете обработать эту заявку');
    }
  }
  handleSortField(field: string){
    if(field === this.sortField){
      this.sortOrder = this.sortOrder === "asc"?"desc":"asc";
    }
    else{
      this.sortField = field;
      this.sortOrder = "asc";
    }
    this.proposalService.setSortFilter(this.selectedFilter, field, this.sortOrder);
  }
}
