/**
 * @author: Ankit.
 * @name: reset-password.component.
 * @description: This faciliates the reset Password functionality.
 * @method count: 1.
 * @methods:
 * ResetPassword().
 */

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthenticationService } from '../authentication.service';
import { AuthenticationUrlService } from '../authentication-url.service';
import { AuthenticationValidationMessageService } from '../authentication-validation-message.service'
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseCode } from '../../response.code';
import { AdminHeaderComponent } from '../../layouts/admin-header/admin-header.component'
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit, AfterViewInit {
  //  Initalization
  versionNo = CONSTANTS.VerionNumber;
  today = new Date();
  Key: string;
  showLoader: any = false;
  isValidLink = false;    // Reset password link is not expired and Reset link is valid
  isValidLinkAPI = false; // Reset password link is Expired
  islevelshow = false;
  Datatopost: any;
  timer: any;
  // Form Control
  emailFormControl = new FormControl({ value: '', disabled: true });
  hide = true;
  password = new FormControl('', [Validators.required,
  Validators.pattern(CONSTANTS.passwordPattern)]
  )
  Password = this.password.value;
  ResetEmail = this.emailFormControl.value
  PasswordLabelsValidator: any;
  passwordRegex: any;
  userDetails: any;
  @ViewChild('resetPassword', { static: true }) public resetPsswordRef: ElementRef;
  constructor(
    public http: AuthenticationService,
    public route: ActivatedRoute,
    public router: Router,
    public messageObj: AuthenticationValidationMessageService,
    public authenUrl: AuthenticationUrlService
  ) {
    // this will validated a password with all five cases
    this.passwordRegex = {
      lowerCase: /(?=.*[a-z])/,
      upperCase: /(?=.*[A-Z])/,
      special: /(?=.*?[#?!@$%^&*-])/,
      minEight: /(?=.{8,})/,
      oneNumber: /(?=.*[0-9])/
    }
    this.PasswordLabelsValidator = {};
  }
  ngOnInit(): void {
    this.emailFormControl.setValue(' ');
    this.password.setValue('');
    // This call checks whether the key is invalid or expired, displays message if key is invalid/expired.
    this.route.queryParams.subscribe((param) => {
      this.Key = param.resetKey;
      this.http.validateExpire(param.resetKey).subscribe((data) => {
        if (data['ResponseCode'] === ResponseCode.SUCCESS) {
          this.isValidLink = true;
          this.islevelshow = true
          const EmailId = data['Email'];
          this.emailFormControl.setValue(EmailId);
        } else {
          this.isValidLinkAPI = true;
          this.islevelshow = true
        }
      }
      );
    })
  }
  ngAfterViewInit(): void {
    this.timer = setInterval(() => {
      if (this.resetPsswordRef) {
        this.resetPsswordRef.nativeElement.focus();
        clearInterval(this.timer);
      }
    }, 10);
    this.password.valueChanges.subscribe(x => {
      Object.keys(this.passwordRegex).forEach((y) => {
        this.PasswordLabelsValidator[y] = this.passwordRegex[y].test(x);
      })
    })
  }
  /**
          * @author: Ankit.
          * @description: Reset a password when Reset password link valid .
          * @dated: 30 Oct, 2018.
          * @parameters: none.
          * @return: observable<any>.
  **/
  ResetPassword() {
    if (!this.password.valid) {
      this.password.markAsDirty({ onlySelf: true });
      return;
    }
    this.showLoader = true;
    const permissions = [];
        let redirectToModule = '';
    this.http.resetPassword(this.Key, this.password.value).subscribe((data) => {
      if (data['ResponseCode'] === ResponseCode.SUCCESS) {
        this.Datatopost = { 'userName': data['UsersName'], 'password': this.password.value }
        this.http.login(this.Datatopost).subscribe((responseData) => {
          if (responseData['ResponseCode'] === 200) {
            localStorage.setItem('loggedUser', JSON.stringify((responseData['UserDetails'])));
            this.userDetails = JSON.parse(localStorage.getItem('loggedUser'));
            this.userDetails.Permissions.filter(item => {
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

          }
        });
        this.showLoader = false;
      } else {
        this.showLoader = true;
      }
    },
      (error) => console.log(error)
    )
  }
}
