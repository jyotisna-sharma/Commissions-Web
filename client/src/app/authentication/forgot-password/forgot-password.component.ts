/**
 * @author: Ankit .
 * @Name: forgot-password.component.
 * @description: faciliate to forgot-password into Commission Dept.
 * @dated: 20 Nov, 2018.
 * @methodcount:4
 * @methodName:
 * @forgotPasword()
 * @onKey(event: KeyboardEvent)
 * @Getformfieldvalid()
 * @hideInvalilEmailMessage()

**/
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { AuthenticationValidationMessageService } from '../authentication-validation-message.service';
import { AuthenticationUrlService } from '../authentication-url.service';
import { ResponseCode } from '../../response.code';
import { ForgotPasswordModel } from './forgot-password.model';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {

    versionNo = CONSTANTS.VerionNumber;
    isEmailSend = false; // this variable enables a forot password div
    isEmailSendsuccess = false; // this variable enable a password sent successfully div
    today = new Date();
    showLoader: any = false;
    showInvalidEmailMsg = false; // Entered email address does not exist in our records
    showEmailAddressMsg: boolean; // it will shows Username does not exist in our records
    resSTR: any;
    resJSON: any;
    UserObject: any;
    isEmailexist = false; // it will shows a registered email address or not
    values = '';
    datatopost: any;
    timer: any;
    username: string;
    @ViewChild('forgotInput', { static: true }) private refToForgot: ElementRef;
    @ViewChild('emailRef', { static: true }) private refToEmail: ElementRef;

    emailFormControl = new FormControl('', [
        Validators.required,
    ]);
    getemailFormControl = new FormControl('', []
    );
    userFormControls = new FormControl({ value: '', disabled: true });
    hide: true;
    constructor(
        public http: AuthenticationService,
        public router: Router,
        public messageObj: AuthenticationValidationMessageService,
        public authenUrl: AuthenticationUrlService,
        public renderer: Renderer2
    ) { }
    ngOnInit() {
        // setInterval(() => {
        //     this.timer =   this.checkInitialVal(this.refToForgot);
        // }, 1);
        this.showEmailAddressMsg = false;
        this.getemailFormControl.valueChanges.subscribe(() => {
            this.showEmailAddressMsg = false;
        });
        if (!this.emailFormControl.valid) {
            this.emailFormControl.markAsTouched({ onlySelf: true });
            return;
        }
    }
    ngAfterViewInit(): void {
        this.refToForgot.nativeElement.focus();
        this.timer = setInterval(() => {
            if (this.refToEmail) {
                this.refToEmail.nativeElement.focus();
                clearInterval(this.timer);
            }
        }, 10);

    }
    /**
  * @author: Ankit.
  * @Name: forgotPasword()
  * @description: call this method when user click on forgot password button on ForgotPasswordPage .
  * @param: none.
  * @dated: 20 nov, 2018.
  * @return: observable<any>.
  **/
    forgotPasword() {
        if (!this.emailFormControl.valid) {
            this.emailFormControl.markAsDirty({ onlySelf: true });
            return;
        }
        this.username = this.emailFormControl.value;
        const getusername = { 'userName': this.username };
        this.showLoader = this.http.forgotPassword(getusername).subscribe((data) => {
            if (data['ResponseCode'] === (ResponseCode.SUCCESS)) {
                this.showLoader = false;
                this.isEmailSend = true;
                this.isEmailSendsuccess = true;
                this.resSTR = data['UserObject']['Email'];
            } else if (data['ResponseCode'] === ResponseCode.UserNotExist) {
                this.showEmailAddressMsg = true;
                this.showLoader = false;
            } else if (data['ResponseCode'] === ResponseCode.NOTFOUND) {
                this.isEmailexist = true;
                this.isEmailSend = true;
                this.showLoader = false;
                this.userFormControls.setValue(this.username)
            } else {
                this.showInvalidEmailMsg = true;
                this.showLoader = false;
            }
        }
        );
    }
    /**
  * @author: Ankit.
  * @Name:  onKey(event: KeyboardEvent)
  * @description: call this method onkey press event this will hide the api Email message .
  * @param: none.
  * @dated: 20 nov, 2018.
  * @return: none.
  **/
    onKey(event: KeyboardEvent) {
        this.showEmailAddressMsg = false;
        this.showInvalidEmailMsg = false;
    }
    /**
  * @author: Ankit.
  * @Name: Getformfieldvalid()
  * @description: call this method when user doesn't have register email address  .
  * @param: none.
  * @dated: 20 nov, 2018.
  * @return: none.
  **/
    public Getformfieldvalid() {
        this.getemailFormControl.setValidators([
            Validators.required,
            Validators.pattern(CONSTANTS.emailPattern)
        ]);
        this.getemailFormControl.updateValueAndValidity();
        if (!this.getemailFormControl.valid) {
            this.getemailFormControl.markAsDirty({ onlySelf: true });
            return;
        }
        this.datatopost = {
            'userName': this.username,
            'emailId': this.getemailFormControl.value
        }
        this.showLoader = this.http.EmailRegisterwithUsername(this.datatopost).subscribe((getresponse) => {
            if (getresponse['ResponseCode'] === ResponseCode.SUCCESS) {
                const username = { 'userName': this.username }
                this.showLoader = this.http.forgotPassword(username).subscribe((data) => {
                    if (data['ResponseCode'] === (ResponseCode.SUCCESS)) {
                        this.showLoader = false;
                        this.isEmailSend = true;
                        this.isEmailSendsuccess = true;
                        this.resSTR = data['UserObject']['Email'];
                        this.isEmailexist = false;
                    } else {
                        return;
                    }
                });
            } else if (getresponse['ResponseCode'] === ResponseCode.EMAIL_ALREADY_EXISTS) {
                this.showEmailAddressMsg = true;
                this.showLoader = false;
                this.showInvalidEmailMsg = false;
            }
        });
    }
    /**
        * @author: Ankit.
        * @description: hide invalid login message.
        * @dated: 30 Oct, 2018.
        * @parameters: none.
        * @return: observable<any>.
       **/
    hideInvalilEmailMessage() {
        this.showInvalidEmailMsg = false;
    }
}
