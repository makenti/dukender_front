import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services';

@Component({
  selector: 'app-entries-dropdown',
  templateUrl: './entries-dropdown.component.html',
  styleUrls: ['./entries-dropdown.component.css']
})
export class EntriesDropdownComponent implements OnInit {
  
  public entries:any[] = [];

  constructor(
    public auth: AuthService
  ) { 
    this.entries = this.auth.getUser().entries;
  }

  ngOnInit() {}
  changeEntry(e){
    console.log(e)
    this.auth.currentEntry = e;
    window.location.reload();
  }
}
