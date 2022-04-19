import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PeoplemanagerService } from '../../../people-manager/peoplemanager.service';
import { PeopleManagerAPIUrlService } from '../../../people-manager/people-manager-url.service';
import { ResponseCode } from '../../../response.code';
import { HouseAccountData } from './houseAccount.model'
@Component({
  selector: 'app-show-confirmation',
  templateUrl: './show-confirmation.component.html',
  styleUrls: ['./show-confirmation.component.scss']
})

export class ShowConfirmationComponent implements OnInit {
  postdata: any;
  usercredentialId: any;
  licenseeId: any;
  close: boolean;
  getResult: any;
  getHouseAccountName: string;
  functionName: string;
  constructor(private router: Router,
    public peoplemanagerService: PeoplemanagerService,
    public peopleManagerAPIUrlService: PeopleManagerAPIUrlService,
    public dialogRef: MatDialogRef<ShowConfirmationComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: HouseAccountData,
  ) { }

  ngOnInit() {
    this.close = false;
    this.getResult = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.data.functionName === 'updateHouseAccount') {
      this.getHouseAccountName = this.getResult.HouseAccountDetails.NickName
    } else {
      this.getHouseAccountName = '';
    }
  }

  updateHouseAccount() {
  }
  //  -------------------------------------------------------- Change the status of Admin on user mapping page----------------
  ChangeAdminStatus() {
    this.postdata = {
      'userCredentialId': this.data.usercredentialId,
      'adminStatus': this.data.AdminStatus === true ? false : true,
    }
    this.peoplemanagerService.ChangeAdminStatus(this.postdata).subscribe(response => {
    })
  }
  // #########################################################################################################################
  GetFunctionName() {
    if (this.data.functionName === 'updateHouseAccount') {
      this.updateHouseAccount();
    } else if (this.data.functionName === 'ChangeAdminStatus') {
      this.ChangeAdminStatus();
    }
  }
}
