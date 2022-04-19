
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { ResponseCode } from '../response.code';
import { Router } from '@angular/router';
import { AuthenticationUrlService } from '../authentication/authentication-url.service';
import { CookieService } from 'ngx-cookie-service';
import { CustomCookiehandlerService } from './custom-cookiehandler.service';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ErrorHandlerService } from './error-handler.service';
import { FormControl } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from '../../environments/environment';
import { IdleTimeoutService } from '../_services/idle-timeout.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// set headers of request.
const headersOption = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class AppLevelDataService {
  isHeaderShown: Boolean = true;
  disabledInupt = new Subject<boolean>(); // for disable the auto complete input.
  headerSelCompany: string; // for header selected company.
  titleOnHeader: string; // for header title name.
  dashItemButtonTitle: string; // for button title on header.
  showBackButton: number; // 1 for show 0 for hide.
  onChangeheaderSelCompany = new Subject<string>();
  superAdminleaveStay = new BehaviorSubject<any>('');
  showToolTipNav = true;
  deviceInfo = null;
  getResetSecurityQuestion: string;
  getResult: any;
  policyAdvanceSearchResult: any;
  ipAddress: any;
  licenseeList: any;
  isRefresh: Boolean = false;
  isLeaveOrStayShown: Boolean = true;
  isCompanyChanged: Boolean = false;
  isUserLoggedOut: Boolean = false; // check is user loggedout or not Used in Policy advance search
  disabledmatInupt: any;
  disableByNumberSub = new Subject<Boolean>(); // return true if any number is invalid.
  public Appversion: string = environment.appVersion;
  private policyData = new BehaviorSubject<any>(1);
  policyPaymentEntries = this.policyData.asObservable();
  constructor(
    private authenticateService: AuthenticationService,
    private router: Router,
    private authenUrl: AuthenticationUrlService,
    private cookie: CookieService,
    private customCookie: CustomCookiehandlerService,
    private http: HttpClient,
    private erroHttp: ErrorHandlerService,
    private deviceService: DeviceDetectorService,
    public idleTimeoutSvc: IdleTimeoutService
  ) { }
  /**
   * @author: Ankit.
   * @description: set content of dash for extra services.
   * @dated: 16 Aug, 2018.
   * @parameters: none.
   * @modified: 30 Aug, 2018.
   * @return: void.
  **/
  setDashboarContent(buttonName: string, showButton: number) {
    this.dashItemButtonTitle = buttonName; // set dashboard back button title.
  }

  /**
     * @author: Ankit.
     * @description: perform logout operation.
     * @dated: 21 Aug, 2018.
     * @parameters: none.
     * @modified: 30 Aug, 2018.
     * @return: void
  **/
  logout() {
    this.getResult = JSON.parse(localStorage.getItem('loggedUser'));

    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile1 = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    const Version = this.deviceInfo.ClientOSVersion;
    const postData = {
      'loginParams': {
        'UserID': this.getResult.UserCredentialID,
        'ClientBrowser': this.deviceService.browser,
        'ClientBrowserVersion': this.deviceService.browser_version,
        'ClientOS': this.deviceService.os,
        'ClientOSVersion': this.deviceService.os_version,
        'Activity': 'logout',
        'ClientIP': '',
        'AppVersion': this.Appversion,
        'ClientDeviceDetail': JSON.stringify(this.deviceService.device),
        'UserAgentInfo': JSON.stringify(this.deviceService.userAgent)
      }
    };
    this.authenticateService.logoutApiService(postData).subscribe((data) => {
      if (data === ResponseCode.SUCCESS) {
        localStorage.removeItem('loggedUser');
        this.policyAdvanceSearchResult = null;
        this.isUserLoggedOut = true;
        this.idleTimeoutSvc.stopTimer();
        localStorage.clear(); // set dashboard title.
        this.router.navigate([this.authenUrl.PageRoute.loginPageRoute]);

      } else { }
    });
  }

  getParameterByName(name, url): string {
    (!url) ? url = window.location.href : url = url;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
    if (!results) {
      return null
    }
    if (!results[2]) {
      return ''
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  /**
     * @author: Ankit.
     * @description: show all validation erros.
     * @dated: 22 Jun, 2018.
     * @parameters: (formGroup,validationError,validationMessageAry)(Type: FormGroup,any,any).
     * @modified: 22 Aug, 2018.
     * @return: none.
    **/
  onValueChanged(formGroup: FormGroup, validationError: any, validationMessageAry: any) {
    // sometimes this event is triggered on load so checking if the form is there, return if not.
    if (!formGroup) {
      return;
    }
    // looping through the  formErrors and validationMessages to set the current validation error.
    for (const field in validationError) {
      if (validationError.hasOwnProperty(field)) {
        // clear previous error message (if any)
        validationError[field] = '';
        const control = formGroup.get(field);
        if (control && control.dirty) {
          const messages = validationMessageAry[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              validationError[field] = messages[key];
              break;
            }
          }
        }
      }
    }
  }

  /**
    * @author: Ankit.
    * @description: Validate all fields of add/edit extra service form.
    * @dated: 16 Aug, 2018.
    * @parameters: none.
    * @modified: 29 Aug, 2018.
    * @return: observable<any>.
   **/
  public validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      }
    });
  }

  /**
      * @author: Ankit.
      * @description: Revalidate the form in order check all validation.
      * @dated: 22 Aug, 2018.
      * @parameters: none.
      * @modified: 5 Sep, 2018.
      * @return: none.
     **/
  revalidateForm(formgroup: FormGroup) {
    Object.keys(formgroup.controls).forEach((field) => {
      const control = formgroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
        control.markAsTouched({ onlySelf: true });
        control.updateValueAndValidity();
      }
    });
  }
  public policyPaymentEntryData(postData: any) {
    this.policyData.next(postData);
  }
}
