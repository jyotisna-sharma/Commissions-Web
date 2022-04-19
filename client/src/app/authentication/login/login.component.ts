
/**
 * @author: Ankit .
 * @Name: login.component.
 * @description: faciliate to login into Commission Dept.
 * @dated: 22 Nov, 2018.
 * @methodcount:3
 * @methodName:
 * submitLogin()
 * validateAllFormFields(formGroup: FormGroup)
 * hideInvalilEmailMessage()
**/
/* Imports*/
import { AppLevelDataService } from './../../_services/app-level-data.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ResponseCode } from '../../response.code';
import { AuthenticationUrlService } from '../authentication-url.service';
import { AuthenticationValidationMessageService } from '../authentication-validation-message.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { CommonDataService } from '../../_services/common-data.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    // Initialization
    versionNo = CONSTANTS.VerionNumber;
    today = new Date();
    formData: string[];
    showLoader: any = false;
    showInvalidLoginMsg: Boolean = false;
    showErrorMessage: any = '';
    getResult: any
    deviceInfo = null;
    datatopost: any;
    ipAddress: any;
    returnUrl: any;
    rememberMeFlag: Boolean;
    public Appversion: string = environment.appVersion;
    @ViewChild('userName', { static: true }) private elementRef: ElementRef; // set child

    // Form group and Form Control
    loginForm = new FormGroup({
        userName: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        rememberMe: new FormControl('')
    });
    constructor(
        private route: ActivatedRoute,
        private authenticateService: AuthenticationService,
        private router: Router,
        public authenUrl: AuthenticationUrlService,
        public authenValMess: AuthenticationValidationMessageService,
        private deviceService: DeviceDetectorService,
        private http: HttpClient,
        public cookies: CookieService,
        public commonService: CommonDataService,
        public appdata: AppLevelDataService
    ) {
    }
    ngOnInit() {
        this.appdata.isUserLoggedOut = false;
        this.elementRef.nativeElement.focus(); // set focus to element
        this.loginForm.valueChanges.subscribe(() => { this.hideInvalidLoginMessage(); });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    /**
     * @author: Ankit.
     * @description: hide invalid login message.
     * @dated: 30 Oct, 2018.
     * @parameters: none.
     * @return: observable<any>.
    **/
    public hideInvalidLoginMessage() {
        this.showInvalidLoginMsg = false;
    }
    /**
     * @author: Ankit.
     * @description: submit login form and call api for authentication of user.
     * @dated: 30 Oct, 2018.
     * @parameters: none.
     * @return: observable<any>.
    **/
    public submitLogin() {
        if (!this.loginForm.valid) {
            this.validateAllFormFields(this.loginForm);
            return;
        }
        this.showLoader = this.authenticateService.login(this.loginForm.getRawValue()).subscribe((responseData) => {
            if (responseData && responseData['ResponseCode'] === ResponseCode.SUCCESS) {
                this.appdata.licenseeList = '';
                if (responseData['UserDetails']) {
                    localStorage.clear();
                    localStorage.setItem('loggedUser', JSON.stringify((responseData['UserDetails'])));
                    this.getResult = JSON.parse(localStorage.getItem('loggedUser'));
                    this.getResult['RememberMe'] = this.loginForm.controls.rememberMe.value;
                    localStorage.setItem('loggedUser', JSON.stringify((this.getResult)));
                    // For storing browser details and device details
                    this.deviceInfo = this.deviceService.getDeviceInfo();
                    const isMobile1 = this.deviceService.isMobile();
                    const isTablet = this.deviceService.isTablet();
                    const isDesktopDevice = this.deviceService.isDesktop();
                    const Version = this.deviceInfo.ClientOSVersion;
                    this.datatopost = {
                        'loginParams': {
                            'UserID': this.getResult.UserCredentialID,
                            'ClientBrowser': this.deviceService.browser,
                            'ClientBrowserVersion': this.deviceService.browser_version,
                            'ClientOS': this.deviceService.os,
                            'ClientOSVersion': this.deviceService.os_version,
                            'Activity': 'login',
                            'ClientIP': '',
                            'AppVersion': this.Appversion,
                            'ClientDeviceDetail': JSON.stringify(this.deviceService.device),
                            'UserAgentInfo': JSON.stringify(this.deviceService.userAgent)
                        }
                    }
                    this.authenticateService.logindetails(this.datatopost).subscribe((getresponseData) => {
                        // 
                        if (getresponseData['ResponseCode'] === ResponseCode.SUCCESS) {
                            // IF DEU user, go directly there and skip all
                            // if(this.getResult.Role === 4){
                            //     this.router.navigate([this.authenUrl.PageRoute.deu]);
                            // }
                            // // Check isuser firsttime loggedin on web
                            // else
                            if (this.getResult.Role !== 4 && this.getResult.IsUserActiveOnweb == null) {
                                this.router.navigate([this.authenUrl.PageRoute.resetUserName]);
                            }
                            else if (this.getResult.Role !== 4 && this.returnUrl) {
                                this.router.navigate([this.returnUrl]);
                            }
                            else {
                                const permissions = [];
                                let redirectToModule = '';
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
                                    }
                                });
                                if (!redirectToModule) {
                                    redirectToModule = permissions[0].value;
                                    if (!redirectToModule) {
                                        redirectToModule = 'login'
                                    }
                                }
                                if (this.getResult.Role == 4) {
                                    this.router.navigate([this.authenUrl.PageRoute.deu]);
                                }
                                else {
                                    this.router.navigate([redirectToModule]);
                                }
                            }
                        } else {
                            return;
                        }
                    });
                    this.commonService.getPayorsList({ 'LicenseeID': this.getResult['LicenseeId'] })
                }
                this.showErrorMessage = '';
            } else if (responseData && responseData['ResponseCode'] === ResponseCode.UserNotExist) {
                this.showInvalidLoginMsg = true;
                this.showLoader = false;
                this.showErrorMessage = '';
            } else {
                debugger;
                this.showLoader = false;
                this.showErrorMessage = responseData['ExceptionMessage'];
            }
        });
    }
    /**
     * @author: Ankit.
     * @description: Validate login form fields.
     * @dated: 30 Oct, 2018.
     * @parameters: none.
     * @return: observable<any>.
    **/
    public validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach((field) => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsDirty({ onlySelf: true });
            }
        }
        );
    }
}
