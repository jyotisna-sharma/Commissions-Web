import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PeoplemanagerService } from '../peoplemanager.service';
import { PeopleManagerAPIUrlService } from '../people-manager-url.service';
import { PeopleManagerValidationMessageService } from '../people-manager-validation-message.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseCode } from '../../response.code';
import { ResponseErrorService } from '../../_services/response-error.service';
import { Guid } from 'guid-typescript';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-add-edit-data-entry-users',
  templateUrl: './add-edit-data-entry-users.component.html',
  styleUrls: ['./add-edit-data-entry-users.component.scss']
})
export class AddEditDataEntryUsersComponent implements OnInit, AfterViewInit {
  //--------------------------------------Variable intalization----------------------------------------------------------
  moduleName: any = 'People Manager';
  pagename: any = 'Create DEU User';
  ButtonName: any = 'Create';
  PasswordRegex: any;
  postData: any;
  hides: boolean;
  showNickName: any;
  showloading: Boolean = false;
  PasswordLabelsValidator: any;
  UserDetails: any;
  buttonClicked: boolean = false;
  userNameAlreadyExist: boolean = false;
  DEUserDetails = new FormGroup({
    FirstName: new FormControl('', {}),
    LastName: new FormControl('', {}),
    UserName: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
    Password: new FormControl('', [Validators.required, Validators.pattern(CONSTANTS.passwordPattern)]),
    UserCredentialID: new FormControl('', {})
  });
  // #########################################################################################################################
  constructor(
    public peoplemanagervalidation: PeopleManagerValidationMessageService,
    public peopleManagerApiURLs: PeopleManagerAPIUrlService,
    public getRouterParameter: GetRouteParamtersService,
    public activatedRoute: ActivatedRoute,
    public route: Router,
    public peopleManagerService: PeoplemanagerService,
    public error: ResponseErrorService,
    public dialog: MatDialog
  ) {
    this.PasswordRegex = {
      lowerCase: /(?=.*[a-z])/,
      upperCase: /(?=.*[A-Z])/,
      special: /(?=.*?[#?!@$%^&*-])/,
      minEight: /(?=.{8,})/,
      oneNumber: /(?=.*[0-9])/
    };
    this.PasswordLabelsValidator = {};
  }

  ngOnInit() {
    this.hides = true;
    this.UserDetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.getRouterParameter.getparameterslist(this.activatedRoute);
    if (this.getRouterParameter.userCredentialId) {
      this.showloading = true;
      this.pagename = 'Edit Profile -';
      this.ButtonName = 'Update';
      this.GetUserdetails();
    }
    else {
      this.DEUserDetails.controls.UserCredentialID.setValue(Guid.createEmpty().toJSON().value);
    }
  }
  ngAfterViewInit() {
    this.DEUserDetails.controls.Password.valueChanges.subscribe(x => {
      Object.keys(this.PasswordRegex).forEach((y) => {
        // 
        this.PasswordLabelsValidator[y] = this.PasswordRegex[y].test(x);
      })
    });
    this.DEUserDetails.controls.UserName.valueChanges.subscribe(result => {
      this.userNameAlreadyExist = false;
    });
  }
  // ----------------------------Method used for Addupdate the details of New DEU user----------------------------------------
  AddUpdatedetails() {
    // 

    this.OnValidateFormFields(this.DEUserDetails);
    if (!this.DEUserDetails.valid) {
      return;
    }
    else {
      this.showloading = true;
      this.postData = {
        'userDetails': this.DEUserDetails.getRawValue()
      }
      this.postData.userDetails.Role = 4;
      this.postData.userDetails.CreatedBy = this.UserDetails['UserCredentialID'];
      this.postData.userDetails.ModifiedBy = this.UserDetails['UserCredentialID'];
      // 
      this.peopleManagerService.addUpdateAgentdetails(this.postData).subscribe(response => {
        this.showloading = false;
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.buttonClicked = true;
          this.route.navigate(['/people/DataEntryUserList', this.getRouterParameter.parentTab, this.getRouterParameter.pageSize, this.getRouterParameter.pageIndex]);
          this.OnUserCreateUpdatedialog();
        }
        else if (response.ResponseCode === ResponseCode.User_Already_Exist) {
          this.userNameAlreadyExist = true;
        }
      });
    }
  }
  // #########################################################################################################################
  // ----------------------------Method used for get the details of DEU user----------------------------------------
  GetUserdetails() {
    this.postData = {
      'userCredentialId': this.getRouterParameter.userCredentialId
    }
    this.peopleManagerService.getagentdetails(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        if (response.UserObject) {
          this.showloading = false;
          this.showNickName = response.UserObject.UserName;
          this.DEUserDetails.controls.FirstName.setValue(response.UserObject.FirstName);
          this.DEUserDetails.controls.LastName.setValue(response.UserObject.LastName);
          this.DEUserDetails.controls.UserName.setValue(response.UserObject.UserName);
          this.DEUserDetails.controls.Password.setValue(response.UserObject.Password);
          this.DEUserDetails.controls.UserCredentialID.setValue(this.getRouterParameter.userCredentialId);
        }
      }
    });
  }
  // #########################################################################################################################
  // ----------------------------Method used for validateform fields for DEU user----------------------------------------------
  OnValidateFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsTouched({ onlySelf: true });
        fieldName.markAsDirty({ onlySelf: true });
      }
    });
  }
  // #########################################################################################################################
  // ----------------------------Method used for validateform fields for DEU user---------------------------------------------
  OnPageRedirection(value) {
    if (value && value === 'cancel') {
      this.buttonClicked = true;
    }
    this.route.navigate(['people/DataEntryUserList', this.getRouterParameter.parentTab, this.getRouterParameter.pageSize, this.getRouterParameter.pageIndex]);
  }
  // ##########################################################################################################################
  // ---------------------------------------------------------Show Create agent popup ----------------------------------
  OnUserCreateUpdatedialog() {
    this.showloading = true;
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: this.getRouterParameter.userCredentialId ? ' DEU User Successfully Updated' : 'DEU User Created Successfully ',
        subTitle: this.getRouterParameter.userCredentialId ? 'DEU user has been successfully updated in the system.' :
          'DEU user has been successfully added in the system.',
        primarybuttonName: 'Create Another DEU User',
        secondryButtonName: 'Go to DEU User Listing', // 'Go to Smart Fields/Notes',
        isCommanFunction: true,
        numberofButtons: this.getRouterParameter.userCredentialId ? '1' : '2'
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.route.navigate(['/people/AddDataEntryUser', this.getRouterParameter.parentTab, this.getRouterParameter.pageSize, this.getRouterParameter.pageIndex]);
      }
    });
  }
  // ###############################################################################################################################

}
