import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { PeoplemanagerService } from '../../../people-manager/peoplemanager.service';
import { PeopleManagerAPIUrlService } from '../../../people-manager/people-manager-url.service';
import { ResponseCode } from '../../../response.code'
import { GetRouteParamtersService } from '../../getRouteParamters.service'
import { DialogData } from '../success-message/successDataDilog.model'

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss']
})
export class SuccessMessageComponent implements OnInit {
  createagent: any;
  userName: any;
  dataToPost: any;
  checkButtonname: any;
  primarybuttonName: any;
  secondryButtonName: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<SuccessMessageComponent>,
    public router: Router,
    public peoplemanagerService: PeoplemanagerService,
    public peopleManagerAPIUrlService: PeopleManagerAPIUrlService,
    public getrouteParamters: GetRouteParamtersService,
    public activateroute: ActivatedRoute) { }

  ngOnInit() {
    if (this.data.isCommanFunction === false) {
      this.checkButtonname = this.data.buttonName;
      this.createagent = 'createagent'
      this.primarybuttonName = this.data.roleId === 2 ? 'Create another user' : 'Create Another Agent';
      this.secondryButtonName = this.data.roleId === 2 ? 'Go to user account' : 'Go to Agent Account';
    } else {
      this.checkButtonname = this.data.buttonName
    }

  }
  OncreateAnotherAgent() {
    this.dialogRef.close(true);
    if (this.data.roleId === 3) {
      this.router.navigate(['/people/CreateNewAgent']);
    } else {
      this.router.navigate(['/people/CreateNewUser']);
    }
  }
  OnGoToAgentAccount() {
    this.dataToPost = { 'userName': this.data.userName, 'licenseeId': this.data.licenseeId }
    this.peoplemanagerService.getUsercredentialIdOfUser(this.dataToPost).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        if (this.data.roleId === 2) {
          this.router.navigate(['people/EditSettings', '2', '2', response.usercredentialId, '10', '0']);
        } else {
          this.router.navigate(['people/EditSettings', '1', '2', response.usercredentialId, '10', '0']);
        }
        this.dialogRef.close(false);
      }
    })
  }
  OnclickPrimaryButton() { };
  OnclickSecondryButton() { };
}
