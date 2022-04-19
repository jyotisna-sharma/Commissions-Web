import { stringify } from '@angular/compiler/src/util';
/**
 * @author: Ankit.
 * @name: reset-username.component.
 * @description: This faciliates the reset Password functionality.
 * @method count: 2.
 * @methods:
 * EnableEmailField() .
 * ResetPassword().
 */

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthenticationService } from '../authentication.service';
import { AuthenticationUrlService } from '../authentication-url.service';
import { AuthenticationValidationMessageService } from '../authentication-validation-message.service'
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseCode } from '../../response.code';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { DashboarDataService } from '../../dashboard/dashboard-data.service';
@Component({
  selector: 'app-reset-username',
  templateUrl: './reset-username.component.html',
  styleUrls: ['./reset-username.component.scss']
})
export class ResetUsernameComponent implements OnInit, AfterViewInit {
  //  Initalization
  versionNo = CONSTANTS.VerionNumber;
  today = new Date();
  Key: string;
  showLoader: any = false;
  ResetSecurityQuestion: string;
  Isquestionvalid = false;
  ShowEmaildiv = false;
  getData: any;
  getResult: any;
  showEmailField = false;
  emailFormControl = new FormControl({ value: '', disabled: true });
  hide = true;
  emailDisable: boolean;
  password = new FormControl('')
  Password = this.password.value;
  ResetEmail = this.emailFormControl.value
  getemail: string;
  dataTopost: any;
  isEmailFielddisabled = false;
  IsEmailExist = false;
  ispasswordChangetext: string;
  istextforUpdatedetails: boolean;
  PasswordRegex: any; // validate a Password regex
  PasswordLabelsValidator: any; // for enable / disbaled a password  label field
  checkcases = new FormControl();
  constructor(
    public http: AuthenticationService,
    public route: ActivatedRoute,
    public router: Router,
    public messageObj: AuthenticationValidationMessageService,
    public authenUrl: AuthenticationUrlService,
    public AppLevelData: AppLevelDataService,
    public dashboarddataservice: DashboarDataService
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
  ngOnInit(): void {

    //   this.dashboarddataservice.DisplayDashboardData().subscribe(response => {

    // });
    this.emailDisable = true;
    this.EnableEmailField()
    this.password.valueChanges.subscribe(() => {
      this.IsEmailExist = false;
    });
    window.onpopstate = function () {
      history.go(1);
    };
  }
  ngAfterViewInit(): void {
    this.password.valueChanges.subscribe(x => {
      Object.keys(this.PasswordRegex).forEach((y) => {
        this.PasswordLabelsValidator[y] = this.PasswordRegex[y].test(x);
      })
      this.emailFormControl.valueChanges.subscribe(email => {
        this.IsEmailExist = false;
      })
    });
  }
  /**
         * @author: Ankit.
         * @description: Reset a password when user successfully login with  .
         * @dated: 30 Oct, 2018.
         * @parameters: none.
         * @return: observable<any>.
 **/
  ResetPassword() {
    this.getemail = this.getData.Email ? this.getData.Email : this.emailFormControl.value
    this.emailFormControl.setValidators([Validators.required,
    Validators.pattern(CONSTANTS.emailPattern)
    ]);
    this.emailFormControl.updateValueAndValidity();
    this.password.setValidators([Validators.required,
    Validators.pattern(CONSTANTS.passwordPattern)]);
    this.password.updateValueAndValidity();
    if (!this.password.valid) {
      this.password.markAsDirty({ onlySelf: true });
      return;
    }
    if (!this.getData.Email) {
      if (!this.emailFormControl.valid) {
        this.emailFormControl.markAsDirty({ onlySelf: true });
        return;
      }
    }
    this.showLoader = true;
    this.dataTopost = { 'userId': this.getData.UserCredentialID, 'password': this.password.value, 'email': this.getemail }
    this.http.resetUsername(this.dataTopost).subscribe((data) => {
      if (data['ResponseCode'] === ResponseCode.SUCCESS) {
        const permissions = [];
        let redirectToModule = '';
        this.getResult = JSON.parse(localStorage.getItem('loggedUser'));
        this.getResult.IsUserActiveOnweb = true;
        localStorage.setItem('loggedUser', JSON.stringify(this.getResult));

        this.getResult.Permissions.filter(item => {
          if (item && item.Permission === 2 || item.Permission === 1) {
            for (const moduleNames of this.authenUrl.Modules) {
              if (moduleNames.Id === item.Module) {
                permissions.push(moduleNames);
              }
            }
          }
        });
        permissions.filter(moduledetails => {
          if (moduledetails.value === 'client' && moduledetails.Id === 2) {
            redirectToModule = 'client';
          } else if (moduledetails.value === 'dashboard') {
            redirectToModule = 'dashboard';
          }
        });
        if (!redirectToModule && permissions[0]) {
          redirectToModule = permissions[0].value;
          if (!redirectToModule) {
            redirectToModule = '/login'
          }
        }
        this.router.navigate([redirectToModule]);

        this.showLoader = false;
      } else {
        return;
      }
    },
      (error) => console.log(error)
    )
  }
  /**
       * @author: Ankit.
       * @description: check for Email field is enable or disabled based on Email field  .
       * @dated: 20 Nov, 2018.
       * @parameters: none.
       * @return: none.
**/
  EnableEmailField() {
    this.getData = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.getData.Email) {
      this.showEmailField = true;
      this.isEmailFielddisabled = true;
      this.emailFormControl.setValue(this.getData.Email);
      this.ispasswordChangetext = 'Change Password';
      this.istextforUpdatedetails = false;
    } else {
      this.showEmailField = false;
      this.emailDisable = false;
      this.emailFormControl.setValue('');
      this.emailFormControl.markAsDirty();
      this.emailFormControl.enable();
      this.ispasswordChangetext = 'Update your details'
      this.istextforUpdatedetails = true;
    }
    this.emailFormControl.updateValueAndValidity();
  }
}
