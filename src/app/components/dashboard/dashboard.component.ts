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

  constructor(
    private auth: AuthService,
  	private router: Router,
    private toastyService: ToastyService,
  	private proposalService: ProposalService
  ) { }

  ngOnInit() {
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

  showProposal() {
  	this.router.navigate(['/proposal']);
  }

}
