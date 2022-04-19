/**
 * @author: Ankit .
 * @Name: forgot-username.component.
 * @description: faciliate to forgot-username into Commission Dept.
 * @dated: 20 Nov, 2018.
 * @methodcount:3
 * @methodName:
 * forgotUsername()
 * getUsername()
 * hideInvalilEmailMessage()

**/
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { AuthenticationValidationMessageService } from '../authentication-validation-message.service';
import { AuthenticationUrlService } from '../authentication-url.service';
import { ResponseCode } from '../../response.code';
import { AppLevelDataService } from '../../_services/app-level-data.service';

@Component({
    selector: 'app-forgot-username',
    templateUrl: './forgot-username.component.html',
    styleUrls: ['./forgot-username.component.scss']
})
export class ForgotUsernameComponent implements OnInit, AfterViewInit {
    versionNo = CONSTANTS.VerionNumber;
    issecurityquestion = false;           // this will shows security question page to user
    today = new Date();
    showLoader: any = false;
    showInvalidEmailMsg = false;         // this will shows that Email address does not exist in our records
    isforgotUsername = true;            // this will shows a forgot username popup
    getsecurityquestion: string        // this will shows a security question to user.
    datatopost: any;
    isForgotPasswordPage = false;
    timer: any;    // this will shows that email sent successfully
    isSecurityAnswerCorrect = false; // check is securityanswer entered by user is correct or not.
    @ViewChild('forgotInput',{ static: true }) private refToForgot: ElementRef;
    @ViewChild('answer', { static: true }) public refToAnswer: ElementRef;
    emailFormControl = new FormControl('');
    AnswerFormControl = new FormControl('', [
        Validators.required,
    ]);
    constructor(
        public http: AuthenticationService,
        public router: Router,
        public messageObj: AuthenticationValidationMessageService,
        public authenUrl: AuthenticationUrlService,
        public renderer: Renderer2,
        public AppLevelData: AppLevelDataService
    ) { }
    ngOnInit() {

        this.emailFormControl.valueChanges.subscribe(() => {
            this.hideInvalilEmailMessage();
        });
        this.AnswerFormControl.valueChanges.subscribe(() => {
            this.isSecurityAnswerCorrect = false;
        });
        setTimeout(() => this.refToForgot.nativeElement.focus());
        if (!this.emailFormControl.valid) {
            this.emailFormControl.markAsTouched({ onlySelf: true });
            return;
        }
    }
    ngAfterViewInit(): void {

        this.timer = setInterval(() => {
            if (this.refToAnswer) {
                this.refToAnswer.nativeElement.focus();
                clearInterval(this.timer);
            }
        }, 10);
    }
    /**
    * @author: Ankit.
    * @Name: forgotusername()
    * @description: calls forgotusername Service and displays successMessage upon finding success ResponseCode otherwise displays msg.
    * @param: none.
    * @dated: 20 nov, 2018.
    * @return: observable<any>.
    **/

    forgotUsername() {
        this.emailFormControl.setValidators([
            Validators.required,
            Validators.pattern(CONSTANTS.emailPattern)
        ]);
        this.emailFormControl.updateValueAndValidity();
        // if form is not valid show form validation.
        if (!this.emailFormControl.valid) {
            this.emailFormControl.markAsDirty({ onlySelf: true });
            return;
        }
        const userEmail = this.emailFormControl.value;
        const emailJson = { 'email': userEmail };
        this.showLoader = this.http.getSecurityQuestion(emailJson).subscribe((data) => {
            if (data['ResponseCode'] === ResponseCode.SUCCESS) {
                this.showLoader = false;
                this.issecurityquestion = true;
                this.isforgotUsername = false;
                this.getsecurityquestion = data['SecurityQues'];
            } else {
                this.showInvalidEmailMsg = true;
                this.showLoader = false;
            }
        }
        );
    }
    /**
   * @author: Ankit.
   * @Name: getUsername()
   * @description: purpose to get the username and send a email after getting username .
   * @param: none.
   * @dated: 20 nov, 2018.
   * @return: observable<any>.
   **/
    getUsername() {
        if (!this.AnswerFormControl.valid) {
            this.AnswerFormControl.markAsDirty({ onlySelf: true });
            return;
        }
        this.datatopost = {
            'securityQuestion': this.getsecurityquestion,
            'securityAnswer': this.AnswerFormControl.value,
            'email': this.emailFormControl.value
        }
        this.showLoader = this.http.getUsername(this.datatopost).subscribe((data) => {
            if (data['ResponseCode'] === ResponseCode.SUCCESS) {
                this.isForgotPasswordPage = true;
                this.issecurityquestion = false;
                this.isforgotUsername = false;
            } else {
                this.showLoader = false;
                this.issecurityquestion = true;
                this.isSecurityAnswerCorrect = true;
                return;
            }
        }
        )
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
