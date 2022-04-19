
/* Imports*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { LoginModel } from './login/login.model';
import { ResetPasswordModel } from './reset-password/reset-password.model';
import { ForgotUsernameModel } from './forgot-username/forgot-username.model';
import { ResetUsernameModel } from './reset-username/reset-username.model';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { AuthenticationUrlService } from './authentication-url.service';
import { ForgotPasswordModel } from './forgot-password/forgot-password.model';



// set headers of request.
// const  = { headers: new HttpHeaders({ 'Content-type': 'application/json','AuthToken':localStorage.getItem('AuthToken') }) };

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(
        private http: HttpClient,
        private erroHttp: ErrorHandlerService,
        private authenUrl: AuthenticationUrlService
    ) { }
    /**
         * @author: Ankit.
         * @description: when user logeed in with username and password.
         * @dated: 21 Nov, 2018.
         * @parameters:postData
      **/
    public login(postData: any): Observable<LoginModel[]> {
        const url = this.authenUrl.loginAPIRoute.loginPostApiRoute;
        return (this.http.post<LoginModel[]>(url, postData).pipe(catchError(this.erroHttp.handleError)));
    }
    /**
          * @author: Ankit.
          * @description: purpose for  user logged out .
          * @dated: 21 Nov, 2018.
         * @parameters:postData
       **/
    public logoutApiService(postData: any): Observable<any> {
        // remove user from local storage to log user out
        return this.http.post<any>(this.authenUrl.LogoutAPIRoute.logoutPostApiRoute, postData,
            ).pipe(catchError(this.erroHttp.handleError));
    }
    /**
       * @author: Ankit.
       * @description: purpose for  getting user browser and device details.
       * @dated: 21 Nov, 2018.
      * @parameters:postData
    **/
    public logindetails(postData: any): Observable<LoginModel[]> {
        const url = this.authenUrl.loginAPIRoute.logindetailsApiRoute;
        return (this.http.post<LoginModel[]>(url, postData, ).pipe(catchError(this.erroHttp.handleError)));
    }
    /**
        * @author: Ankit.
        * @description: purpose for  Forgot password api call.
        * @dated: 21 Nov, 2018.
       * @parameters:email
     **/
    public forgotPassword(userName: any): Observable<ForgotPasswordModel[]> {
        const url = this.authenUrl.ForgotPasswordAPIRoute.ForgotPasswordPostAPIRoute;
        return this.http.post<ForgotPasswordModel[]>(url, userName, ).pipe(catchError(this.erroHttp.handleError));
    }
    /**
         * @author: Ankit.
         * @description: purpose when user doesn't have register email id with username on Forgot Password.
         * @dated: 21 Nov, 2018.
        * @parameters:postData
      **/
    public EmailRegisterwithUsername(postData): Observable<ForgotPasswordModel[]> {
        const url = this.authenUrl.ForgotPasswordAPIRoute.RegisterEmailId;
        return this.http.post<ForgotPasswordModel[]>(url, postData, ).pipe(catchError(this.erroHttp.handleError));
    }
    /**
       * @author: Ankit.
       * @description: purpose for  getting Security question based on email.
       * @dated: 21 Nov, 2018.
      * @parameters:email
    **/
    public getSecurityQuestion(email: any): Observable<ForgotPasswordModel[]> {
        const url = this.authenUrl.ForgotPasswordAPIRoute.GetSecurityQuestion;
        return this.http.post<ForgotPasswordModel[]>(url, email, ).pipe(catchError(this.erroHttp.handleError));
    }
    /**
              * @author: Ankit.
              * @description: purpose for reset a password based on key and password
              * @dated: 21 Nov, 2018.
             * @parameters:key,password
             **/
    public resetPassword(key: string, password: string): Observable<ResetPasswordModel[]> {
        const url = this.authenUrl.ResetPasswordAPIRoute.ResetPasswordPostAPIRoute;
        return this.http.post<ResetPasswordModel[]>(url, { 'passwordKey': key, 'password': password },
            ).pipe(catchError(this.erroHttp.handleError));
    }
    /**
            * @author: Ankit.
            * @description: purpose for check the user is come first time on web  or not after login for reset password and Email.
            * @dated: 21 Nov, 2018.
           * @parameters:postData
           **/
    public resetUsername(postData): Observable<ResetPasswordModel[]> {
        const url = this.authenUrl.ResetUsernameAPIRoute.ResetUsernameAPIRoute;
        return this.http.post<ResetPasswordModel[]>(url, postData,
            ).pipe(catchError(this.erroHttp.handleError));
    }
    /**
         * @author: Ankit.
         * @description: purpose for  checking is  key expired?.
         * @dated: 21 Nov, 2018.
        * @parameters:key
      **/
    public validateExpire(key: string): Observable<ResetPasswordModel[]> {
        const url = this.authenUrl.ResetPasswordAPIRoute.CheckUpdatePasswordExpireTime;
        return this.http.post<ResetPasswordModel[]>(url, { 'key': key },
            ).pipe(catchError(this.erroHttp.handleError));
    }
    /**
        * @author: Ankit.
        * @description: purpose for  getting username of user.
        * @dated: 21 Nov, 2018.
       * @parameters:postData
     **/
    public getUsername(postData: any): Observable<ForgotUsernameModel[]> {
        const url = this.authenUrl.ForgotUsernameAPIRoute.ForgotUsernameAPIRoute;
        return this.http.post<ForgotUsernameModel[]>(url, postData, ).pipe(catchError(this.erroHttp.handleError));
    }
}
