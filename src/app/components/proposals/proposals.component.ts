import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastyService } from 'ng2-toasty';
import {
			AuthService,
		  ProposalService,
      ErrorService,
      CompanyProfileService } from '../../services/index';

import { proposalLimit } from '../../common/config/limits';
// import { SortPipe} from '../../pipes/sort.pipe';
// import { ReadPipe} from '../../pipes/read.pipe';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
})
export class ProposalsComponent implements OnInit, AfterViewChecked {

  @ViewChild('modalCheckDistricts')
  modalCheckDistricts: ModalDirective;

  @ViewChild('proposalListBody')
  myScrollContainer: ElementRef;
  Math: any;

	public proposals: any;
	public errorMessage: any;
	public selectedFilter = '';
  public selectedDistricts: any;
  public currUser: any;
  public companyRegions: any[] = [];
  public loading: boolean = false;
  public proposalStats: any;
  public searchQuery: string = '';
  public sortField:string = "";
  public sortOrder:string = "asc";
  
  public filter: any;
  public last_timestamp: string = "";
  statuses = [
    {id: 0, status: "Входящие"},
    {id: 1, status: "В работе"},
    {id: 2, status: "В доставке"},
    {id: 3, status: "Исполненные"},
    {id: 4, status: "Согласование с магазином"},
    {id: 5, status: "Согласование с поставщиком"},
    {id: 6, status: "Отмененные"},
    {id: "", status: "Все"},
  ];
  public scrolled: boolean = true;
  private interval:number; 
  public openedProposals:number = 2;

  constructor(
    public auth: AuthService,
  	public router: Router,
  	public proposalService: ProposalService,
    public errorService: ErrorService,
    public companyService: CompanyProfileService,
    public toastyService: ToastyService
  ) { }
  ngOnInit() {
    this.Math = Math;
    if(this.proposalService.getFilter()){
      let id = this.proposalService.getFilter().selected;
      if(id!==null){
        this.getProposals(id);
      }
      this.getLocalFilter();
    }else{
      this.getProposals('');
    }
    this.auth.updateUserInfo().subscribe(
      resp => {
        if(resp) {
          this.currUser = this.auth.getUser();
          this.getCompanyRegions();
        }
      }, null);
  }
  ngAfterViewChecked(){
    // console.log("ngAfterViewChecked")
    if(this.proposalService.getFilter()){
      this.scrollTo();
    }
  }
  scrollTo(){
    let columnId = this.selectedFilter === ''? 7 : this.selectedFilter;
    let column = this.proposalService.getFilter().fields[columnId];
    // console.log(column);
    let scroll = column.scroll;
      // console.log("scroll");
    if(scroll > 0 &&
      !this.scrolled ){
      // console.log("scrollingto", scroll);
      // document.getElementById('proposalTable').scrollTop = scroll;
      try {
        // console.log(this.myScrollContainer.nativeElement.scrollTop, "===", column.scroll)
        if(this.myScrollContainer.nativeElement.scrollTop !== column.scroll){
          // console.log("scrolling");
          this.myScrollContainer.nativeElement.scrollTop = column.scroll;
        }else{
          this.scrolled = true;
          // console.log("scrolled");
        }
      } catch(err) { }
    }
  }
  getLocalFilter(){
    let id = this.selectedFilter === ''? 7 : this.selectedFilter;
    if(this.proposalService.getFilter()){
      let column = this.proposalService.getFilter().fields[id];
      this.sortField = column.field;
      this.sortOrder = column.order;
    }
  }
  downloadExcel(){
    let id = this.selectedFilter ==="" ? 7 : this.selectedFilter;
    let data = {
      status: this.selectedFilter,
      status_name: this.statuses[id].status
    };
    this.proposalService.downloadExcel(data)
        .subscribe(
          resp => {
            if(resp) {
              this.toastyService.success('Успешно экспортирован');
            }else {
              this.toastyService.error('Ошибка на сервере');
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
  downloadExcelItem(){
    let id = this.selectedFilter ==="" ? 7 : this.selectedFilter;
    let data = {
      status: this.selectedFilter,
      status_name: this.statuses[id].status
    };
    this.proposalService.downloadExcelItem(data)
        .subscribe(
          resp => {
            if(resp) {
              this.toastyService.success('Успешно экспортирован');
            }else {
              this.toastyService.error('Ошибка на сервере');
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
  clearSessionData(){
    sessionStorage.removeItem("proposals");
    sessionStorage.removeItem("proposalStats");
    sessionStorage.removeItem("last_timestamp");
  }
  onClickProposalTypes(id: any){
    this.clearSessionData();
    this.getProposals(id);
  }
  getProposals(id: any) {
    this.selectedFilter = id;
    this.scrolled = false;
    if(sessionStorage.getItem("proposals")){
      this.proposals = JSON.parse(sessionStorage.getItem("proposals"));
      this.proposalStats = JSON.parse(sessionStorage.getItem("proposalStats"));
      this.last_timestamp = JSON.parse(sessionStorage.getItem("last_timestamp"));
      this.getLocalFilter();
      return;
    } 
    this.proposals = [];
    this.loading = true;
    //scroll:
    let limit = proposalLimit;
    if(this.proposalService.getFilter()){
      let columnId = this.selectedFilter === ''? 7 : this.selectedFilter;
      let column = this.proposalService.getFilter().fields[columnId];
      if(column.scroll > 0 && column.limit > proposalLimit){
        limit = column.limit;
      }
    } 
  	let data = {
  		status: id,
			timestamp: '',
			customer_id: '',
			limit: limit,
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
                  this.proposals[i].searchField = this.proposals[i].request_id + this.proposals[i].customer.name;
                  this.proposals[i].customer_name = this.proposals[i].customer.name;
                  this.proposals[i].customer_district = this.proposals[i].customer.district.name;
                  this.proposals[i].tooltip = "...";
                  if(this.proposals[i].items !== null && 
                    this.proposals[i].items !== undefined){
                    for(let j = 0; j < this.proposals[i].items.length; j++){
                      if(j == 0){
                        this.proposals[i].tooltip = "";
                      }
                      if(j == 3){
                        this.proposals[i].tooltip += "...";
                        break;
                      }
                      let k = j + 1;
                      this.proposals[i].tooltip += k + ". " + this.proposals[i].items[j]+" \r\n";
                    }
                  }
                }
                if(resp.requests !== undefined && 
                  resp.requests !== null && 
                  resp.requests.length !==0)
                  this.last_timestamp = resp.requests[resp.requests.length - 1].timestamp;
                if(resp.request_stats !== undefined)
                  this.proposalStats = resp.request_stats;
                sessionStorage.setItem("proposals", JSON.stringify(this.proposals));
                sessionStorage.setItem("proposalStats", JSON.stringify(this.proposalStats));
                sessionStorage.setItem("last_timestamp", JSON.stringify(this.last_timestamp));

            	}
            }
            this.loading = false;
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
    this.proposalService.setSelectedFilter(id);
    this.getLocalFilter();
  }
  getProposalsMore() {
    let data = {
      status: this.selectedFilter,
      timestamp: this.last_timestamp,
      customer_id: '',
      limit: proposalLimit,
      district_ids: this.selectedDistricts
    };
    this.proposalService.getProposals(data)
        .subscribe(
          resp => {
            this.modalCheckDistricts.hide();
            if(resp !== null) {
              if(resp.code === 0) {
                if(resp.requests.length === 0|| 
                  resp.requests === null ||
                  resp.requests === undefined)
                  return;
                for(let i = 0; i < resp.requests.length; i++){
                  let exist:boolean = false
                  for(let j = 0; j < this.proposals.length; j++){
                    if(resp.requests[i].timestamp === this.proposals[j].timestamp)
                      exist = true;
                  }  
                  if(!exist)
                    this.proposals.push(resp.requests[i]);                    
                }
                // this.proposals = new SortPipe().transform(this.proposals, this.sortField, this.sortOrder); //this is for sort dynamically

                for(let i = 0; i < this.proposals.length; i++){
                  this.proposals[i].customer_name = this.proposals[i].customer.name;
                  this.proposals[i].customer_district = this.proposals[i].customer.district.name;
                  this.proposals[i].tooltip = "";
                  if(this.proposals[i].items !== null && 
                    this.proposals[i].items !== undefined){
                    for(let j = 0; j < this.proposals[i].items.length; j++){
                      if(j == 3){
                        this.proposals[i].tooltip += "...";
                        break;
                      }
                      let k = j + 1;
                      this.proposals[i].tooltip += k + ". " + this.proposals[i].items[j]+" \r\n";
                    }
                  }
                }
                if(resp.requests !== undefined && 
                  resp.requests !== null && 
                  resp.requests.length !==0)
                  this.last_timestamp = resp.requests[resp.requests.length - 1].timestamp;

                if(resp.request_stats !== undefined)
                  this.proposalStats = resp.request_stats;
                sessionStorage.setItem("proposals", JSON.stringify(this.proposals));
                sessionStorage.setItem("proposalStats", JSON.stringify(this.proposalStats));
                sessionStorage.setItem("last_timestamp", JSON.stringify(this.last_timestamp));
              }
            }
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
        );
  }
  getCompanyRegions() {
    this.companyService.getCompanyRegions()
        .subscribe(
          data => {
            this.convertFromServer(data);
          },
          error =>  {
            this.toastyService.warning(this.errorService.getCodeMessage(error.code));
            this.errorMessage = <any>error
          }
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
          if(region.districts)
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
  onSelectPropReadType(type_id){
    if(type_id == 2){

    }
  }

  updateProposals() {
    this.clearSessionData();
    this.getProposals(this.selectedFilter);
  }

  selectCheckedDistricts() {
    this.getProposals('');
    // window.localStorage.setItem('user_districts', this.selectedDistricts);
  }
  mouseDown(event){
    this.interval = (new Date()).getTime();
  }
  mouseUp(event, item){
    if((new Date()).getTime() - this.interval < 400){
      this.showProposal(item);
    }
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

  onScroll (e: any) {
    if(e.target.scrollHeight <= e.target.scrollTop + e.target.clientHeight){
      this.getProposalsMore();
    }
    //count minimum limit and scroll position:
    let scrollPos = e.target.scrollTop;
    let scrollLimit = this.Math.round(scrollPos/32.64 + 10);
    // console.log(scrollPos, e.srcElement.scrollHeight, scrollLimit);
    if(scrollLimit < proposalLimit){
      scrollLimit = proposalLimit;
    }
    this.proposalService.setScrollPositionAndLimit(this.selectedFilter, scrollPos, scrollLimit);
    // console.log(scrollPos);
  }

}
