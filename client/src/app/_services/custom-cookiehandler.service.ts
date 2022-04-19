import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationUrlService } from '../authentication/authentication-url.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class CustomCookiehandlerService {

  constructor(
    private router: Router,
    private authenUrl: AuthenticationUrlService,
    private cookie: CookieService
  ) { }

  /**
  * @author: Ankit.
  * @description: set cookie manually.
  * @dated: 21 Aug, 2018.
  * @parameters: none.
  * @modified: 30 Aug, 2018.
  * @return: void
 **/
  // For future persepective.
 /*  setCookie(cname, cvalue, exdays): void {
    const date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';';
  } */

  /**
   * @author: Ankit.
   * @description: clean cookie storage.
   * @dated: 21 Aug, 2018.
   * @parameters: none.
   * @modified: 30 Aug, 2018.
   * @return: void
  **/
  clearCookiesLocalStrorage(): void {
    this.cookie.deleteAll();
    localStorage.clear();
    sessionStorage.clear();
    /* double check to delete cookies*/
    if (document.cookie) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; ++i) {
        const myCookie = cookies[i];
        if (myCookie) {
          const pos = myCookie.indexOf('=');
          const name = pos > -1 ? myCookie.substr(0, pos) : myCookie;
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
        }
      }
    }
  }

  /**
   * @author: Ankit.
   * @description: set cookies on Login success.
   * @dated: 21 Aug, 2018.
   * @parameters: userObject,userObject
   * @modified: 30 Aug, 2018.
   * @return: void
  **/
  successLoginCookieLocalStorageChnages( userObject, RememberMe, returnUrl): void {
      if (RememberMe) { // if set remember me. then check token
        const cookieExists: boolean = this.cookie.check('IsLogin'); // get cookie.
        if (cookieExists) {this.cookie.delete('IsLogin'); } // delete already existed cookie.
        document.cookie = 'IsLogin' + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
        document.cookie = 'IsLogin=true; path=/';
      } else {
        this.cookie.delete('IsLogin');
        
      }
      // set item to local storage.
      localStorage.setItem('loggedUser', JSON.stringify(userObject));
      this.router.navigate([returnUrl]);
    }
}
