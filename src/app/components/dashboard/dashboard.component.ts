import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { AuthService, ProposalService } from '../../services/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ AuthService, ProposalService ]
})
export class DashboardComponent implements OnInit {

  public filterQuery: string = '';
  public rowsOnPage = 10;
  public sortBy = 'email';
  public sortOrder = 'asc';

	private proposals: any[] = [];
  private loading: boolean = false;
  private errorMessage: any[] = [];

  private currUser: any;
  
  constructor(
    private auth: AuthService,
  	private router: Router,
    private toastyService: ToastyService,
  	private proposalService: ProposalService
  ) { }

  ngOnInit() {
    var metaTag = document.getElementById('viewport');
    metaTag.parentNode.removeChild(metaTag);

    var meta = document.createElement('meta');
    meta.id = "viewport";
    meta.name = "viewport";
    meta.content = "width=1024";
    document.getElementsByTagName('head')[0].appendChild(meta);
    
    this.auth.updateUserInfo().subscribe(null, null);
  	this.getProposals();
  }

  getProposals() {
    this.loading = true;
  	let data = {
  		status: '',
			timestamp: '',
			customer_id: ''
  	};
  	this.proposalService.getProposals(data)
        .subscribe(
          resp => {
          	this.loading = false;
            if(resp === null) {
              this.toastyService.warning('У Вас нет заявок');
            }else {
            	if(resp.code === 0) {
            		this.proposals = resp.requests;
            	}
            }
          },
          error =>  this.errorMessage = <any>error
        );
  }

  showProposal(item: any) {
    this.currUser = this.auth.getUser();
    let curUserEntry = (this.currUser.entry !== undefined && this.currUser.entry !== null)?this.currUser.entry: null;
    let operatorPermission = false; 
    for(var i=0; i < this.currUser.permissions.length; i++){
      if(this.currUser.permissions[i].permission_type === 0)
        operatorPermission = true; //TODO: eshe nuzhno uchest' kompaniu i sotrudnika?
    }
    if((curUserEntry !== null && (curUserEntry.profile_type === 1 || curUserEntry.profile_type === 3 || operatorPermission)) || 
        item.editor === this.currUser.username && item.status !== 0 || 
        item.status === 0) {
      this.router.navigate(['/proposal', item.request_id]);
    }else {
      this.toastyService.warning('Вы не можете обработать эту заявку');
    }
    // this.router.navigate(['/proposal', item.request_id]);
  }

}
