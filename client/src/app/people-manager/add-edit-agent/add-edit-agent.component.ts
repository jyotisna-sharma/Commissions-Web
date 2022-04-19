import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, HostListener } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder, FormArray, } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ResponseCode } from '../../response.code';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleManagerValidationMessageService } from '../people-manager-validation-message.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { PeoplemanagerService } from '../peoplemanager.service';
import { PeopleManagerAPIUrlService } from '../people-manager-url.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { ResponseErrorService } from '../../_services/response-error.service';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { PhoneInputComponent } from '../../shared/phone-input/phone-input.component';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-add-edit-agent',
  templateUrl: './add-edit-agent.component.html',
  styleUrls: ['./add-edit-agent.component.scss']
})
export class AddEditAgentComponent implements OnInit {
  // ---------------------------------------------------variable Initalization--------------------------------------------------------------
  hides = true;
  buttonText: any = 'Create';
  moduleName = 'People Manager';
  textShown: string;
  userNameAlreadyExist = false;
  isEmailAlreadyExist = false;
  setRoleId: Number;
  timer: any;
  url: any;
  isAddressFound: Boolean = false;
  postdata: any;
  getLoggedInUserDetails: any;
  buttonClicked: boolean;
  showLoading = false;
  showNickName: string;
  addressValue: string;
  Searchforstring = { SearchString: '' };
  PasswordRegex: any; // validate a Password regex
  PasswordLabelsValidator: any; // for enable / disbaled a password  label field
  @ViewChild('firstnameref', { static: true }) firstnameRef: ElementRef;
  userform = new FormGroup(
    {
      FirstName: new FormControl('', [Validators.minLength(3), Validators.maxLength(50)]),
      LastName: new FormControl('', [Validators.minLength(3), Validators.maxLength(50)]),
      NickName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      FormattedAddress: new FormControl('', {}),
      UserName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      Email: new FormControl('', [Validators.required, Validators.pattern(CONSTANTS.emailPattern)]),
      Password: new FormControl('', [Validators.required, Validators.pattern(CONSTANTS.passwordPattern)]),
      BGUserId: new FormControl('', []),
      UserCredentialID: new FormControl('', []),
      PasswordHintQ: new FormControl('First school', [Validators.required]),
      PasswordHintA: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      OfficePhoneNumber: this.CreateContactFormGroup(),
      MobileNumber: this.CreateContactFormGroup(),
      FaxNumber: this.CreateContactFormGroup()
    });

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  constructor (
    public peoplemanagerservice: PeoplemanagerService,
    public route: ActivatedRoute,
    public router: Router,
    public peoplemanagervalidation: PeopleManagerValidationMessageService,
    public peopleManagerApiURLs: PeopleManagerAPIUrlService,
    public dialog: MatDialog,
    public responseError: ResponseErrorService,
    public getrouteParamters: GetRouteParamtersService,
    public activateroute: ActivatedRoute,
  ) {
    this.PasswordRegex = {
      lowerCase: /(?=.*[a-z])/,
      upperCase: /(?=.*[A-Z])/,
      special: /(?=.*?[#?!@$%^&*-])/,
      minEight: /(?=.{8,})/,
      oneNumber: /(?=.*[0-9])/,
    };
    this.PasswordLabelsValidator = {};
  }

  ngOnInit () {
    this.getLoggedInUserDetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.getrouteParamters.getparameterslist(this.activateroute);
    this.textShown = this.getrouteParamters.parentTab == 1 ? 'Create New Agent' : 'Create New User';
    this.setRoleId = this.getrouteParamters.parentTab == 1 ? 3 : 2;
    this.buttonClicked = false;
    this.url = this.peopleManagerApiURLs.PeoplemanagerAPIRoute.GetGoogleLocationsAPIroute;
    this.FormDisabled();
    if (this.getrouteParamters.userCredentialId) {
      this.GetUserDetails();
    } else {
      this.isAddressFound = true;
      this.userform.controls.UserCredentialID.setValue(Guid.createEmpty().toJSON().value);
      this.userform.controls['OfficePhoneNumber']['controls'].IsFirstTimeLoad.setValue(true);
      this.userform.controls['MobileNumber']['controls'].IsFirstTimeLoad.setValue(true);
      this.userform.controls['FaxNumber']['controls'].IsFirstTimeLoad.setValue(true);
      this.timer = setInterval(() => {
        this.checkInitialVal(this.firstnameRef);
      }, 100);
    }
  }

  // save address
  getValue(addressV : string) {
    this.addressValue = addressV;
  }
  // save address

  CreateContactFormGroup () {
    const ContactDetailFormGroup: FormGroup = new FormGroup({
      PhoneNumber: new FormControl(''),
      DialCode: new FormControl(''),
      CountryCode: new FormControl(''),
      IsFormValid: new FormControl(false),
      IsFirstTimeLoad: new FormControl(false)
    });
    return ContactDetailFormGroup;
  }
  /*
    Modified By:Ankit Khandelwal
   Modified On:March 03,2020
   purpose:To disabled a user form
   */
  FormDisabled () {
    if (this.getLoggedInUserDetails && this.getLoggedInUserDetails.Permissions[0].Permission === 1) {
      this.userform.disable();

    }
    if (this.getLoggedInUserDetails.Role !== 1) {
      this.userform.controls.BGUserId.disable();

    }
  }
  /*
   Modified By:Ankit Khandelwal
  Modified On:March 03,2020
  purpose:Get User details based on UsercredntialId
  */
  GetUserDetails () {
    this.showLoading = true;
    this.textShown = 'Edit profile';
    this.buttonText = 'Update';
    this.postdata = {
      'userCredentialId': this.getrouteParamters.userCredentialId
    };
    this.peoplemanagerservice.getagentdetails(this.postdata).subscribe(response => {
      if (response['ResponseCode'] === ResponseCode.SUCCESS) {
        this.showNickName = '-' + ' ' + response['UserObject'].NickName;
        this.setRoleId = response['UserObject'].Role;
        this.userform.controls.FirstName.setValue(response['UserObject'].FirstName);
        this.userform.controls.LastName.setValue(response['UserObject'].LastName);
        this.userform.controls.NickName.setValue(response['UserObject'].NickName);
        this.userform.controls.FormattedAddress.setValue(response['UserObject'].FormattedAddress);
        this.userform.controls.UserName.setValue(response['UserObject'].UserName);
        this.userform.controls.Email.setValue(response['UserObject'].Email);
        this.userform.controls.Password.setValue(response['UserObject'].Password);
        this.userform.controls.PasswordHintA.setValue(response['UserObject'].PasswordHintA);
        this.userform.controls.PasswordHintQ.setValue(response['UserObject'].PasswordHintQ);
        this.userform.controls.BGUserId.setValue(response['UserObject'].BGUserId);
        this.userform.controls.UserCredentialID.setValue(this.getrouteParamters.userCredentialId);
        this.SetContactDetails(response['UserObject'].OfficePhoneNumber, 'OfficePhoneNumber');
        this.SetContactDetails(response['UserObject'].MobileNumber, 'MobileNumber');
        this.SetContactDetails(response['UserObject'].FaxNumber, 'FaxNumber');
        this.showLoading = false;
        this.isAddressFound = true;
        this.timer = setInterval(() => {
          this.checkInitialVal(this.firstnameRef);
        }, 100);
      }
    });
  }
  ngAfterViewInit (): void {
    this.userform.controls.Password.valueChanges.subscribe(x => {
      Object.keys(this.PasswordRegex).forEach(y => {
        this.PasswordLabelsValidator[y] = this.PasswordRegex[y].test(x);
      });
    });
  }
  SetContactDetails (details, controlName) {
    this.userform.controls[controlName]['controls'].PhoneNumber.setValue(details.PhoneNumber);
    this.userform.controls[controlName]['controls'].CountryCode.setValue(details.CountryCode);
    this.userform.controls[controlName]['controls'].DialCode.setValue(details.DialCode);
    this.userform.controls[controlName]['controls'].IsFormValid.setValue(false);
    this.userform.controls[controlName]['controls'].IsFirstTimeLoad.setValue(true);
  }
  checkInitialVal (elementfirstname: any) {
    if (elementfirstname) {
      setTimeout(() => {
        this.firstnameRef.nativeElement.focus();
      });
      clearInterval(this.timer);
    }
  }


  // ---------------------------------------------------------this method is used for autocomplete  ----------------------------------
  GetSelectedAccount (selectedData) {
    this.userform.controls.FormattedAddress.setValue(selectedData);
  }
  // ##################################################################################################################################
  // ---------------------------------------------------------Show Create agent popup ----------------------------------
  OpenAgentCreationdilog (userName: string, licenseeId: string, setRoleId: any) {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        userName: userName,
        licenseeId: licenseeId,
        Title: setRoleId === 2 ? 'User Successfully Created' : 'Agent Successfully Created',
        subTitle: setRoleId === 2 ? 'This user is now active. To edit permissions or map users, go to user account details.' :
          'This agent is now active. To edit permissions or map users, go to agent account details.',
        roleId: setRoleId,
        isCommanFunction: false,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userform.reset();
        this.userNameAlreadyExist = false;
        this.isEmailAlreadyExist = false;
      }

    });
  }
  // ###############################################################################################################################
  //  ---------------------------------------------------------Update  agent successfully pop up-------------------------------------
  OpenUpdateAgentdilog (Message: string) {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: this.setRoleId === 2 ? 'User Updated Successfully' : 'Agent Updated Successfully',
        subTitle: Message,
        buttonName: 'ok',
        isCommanFunction: false
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {


    });
  }
  // #####################################################################################################################################
  // -----------------------------------------------------------Validate form field and Mark as dirty----------------------------
  public validateAllFormFields (formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
      }
    });
  }
  // ########################################################################################################################
  // --------------------------------------------------------- Add/update AgentDetails--------------------------------------
  public OnSaveUserDetails () {
    if (!this.userform.valid) {
      this.validateAllFormFields(this.userform);
      return;
    } else if ((this.userform.controls.OfficePhoneNumber.value['PhoneNumber'] && this.userform.controls.OfficePhoneNumber.value.IsFormValid === true) ||
      this.userform.controls.FaxNumber.value['PhoneNumber'] &&  this.userform.controls.FaxNumber.value.IsFormValid === true ||
      this.userform.controls.MobileNumber.value['PhoneNumber'] && this.userform.controls.MobileNumber.value.IsFormValid === true) {
      return;
    } else {
      this.buttonClicked = true;
      this.showLoading = true;
      this.postdata = {};
      this.postdata = this.userform.getRawValue();
      this.postdata.LicenseeId = this.getLoggedInUserDetails.LicenseeId;
      this.postdata.CreatedBy = this.getLoggedInUserDetails['UserCredentialID'];
      this.postdata.ModifiedBy = this.getLoggedInUserDetails['UserCredentialID'];
      this.postdata.Role = this.setRoleId;
      this.postdata.FormattedAddress = this.addressValue;
      this.postdata = {
        'userDetails': this.postdata,
      };
      this.peoplemanagerservice.addUpdateAgentdetails(this.postdata).subscribe(response => {
        if (response['ResponseCode'] === ResponseCode.SUCCESS) {
          this.OnPageRedirection('', '');
          if (this.getrouteParamters.userCredentialId) {
            this.OpenUpdateAgentdilog(response.Message);
          } else {
            this.OpenAgentCreationdilog(this.userform.controls.UserName.value, this.getLoggedInUserDetails.LicenseeId, this.setRoleId);
          }
        } else if (response['ResponseCode'] === ResponseCode.User_Already_Exist) {
          this.userform.controls.FormattedAddress.setValue(this.addressValue);
          this.userNameAlreadyExist = true;
        } else {
          this.responseError.OpenResponseErrorDilog(response.Message);
          return;
        }
        this.showLoading = false;
      });
    }

  }
  // #######################################################################################################################################
  // -------------------------------------------------------Action Perform on click Cancel button  -------------------------------

  OnPageRedirection (value, lableName) {
    if (lableName == '') {
      this.buttonClicked = true;
    } else {
      this.buttonClicked = false;
    }
    const selectedTabvalue = this.getrouteParamters.parentTab === '1' ? 'Agentlisting' : 'Userlisting';
    const selectedPageIndex = this.getrouteParamters.pageIndex ? this.getrouteParamters.pageIndex : '0';
    const selectedPageSize = this.getrouteParamters.pageSize ? this.getrouteParamters.pageSize : '10';
    this.router.navigate(['people/' + selectedTabvalue, this.getrouteParamters.parentTab, selectedPageSize, selectedPageIndex]);
  }

}


