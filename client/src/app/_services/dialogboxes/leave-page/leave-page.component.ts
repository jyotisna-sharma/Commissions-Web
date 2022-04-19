import { AppLevelDataService } from './../../app-level-data.service';
import { Component, OnInit, Inject } from '@angular/core';
import { LeavePageData } from '../leave-page/leave-page-data.model'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-leave-page',
  templateUrl: './leave-page.component.html',
  styleUrls: ['./leave-page.component.scss']
})
export class LeavePageComponent implements OnInit {

  userDetails: any;
  constructor(
    public dialogRef: MatDialogRef<LeavePageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeavePageData,
    public appdata: AppLevelDataService
  ) { }
  ngOnInit() {
  }
  onclearlocalstorage() {
    localStorage.removeItem('linkedUsers');
  }
  OnButtonClick() {
    if (this.data.PrimaryButton = 'Leave this Page') {
      this.onclearlocalstorage();
    }
  }
  OncloseDilogBox(value) {
  //   this.userDetails = JSON.parse(localStorage.getItem('loggedUser'));
  //   if (this.userDetails.Role === 1 && value === false) {
      //this.appdata.lastSelectedLicensee = this.userDetails.LicenseeId;
  //     this.appdata.superAdminleaveStay.next(false);
  //   } else if (this.userDetails.Role === 1 && value === true) {
  //     this.appdata.superAdminleaveStay.next(true);
  //   }
  }
}
