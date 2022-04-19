/**
 * @author: Ankit.
 * @Name: authenticationRoute.url.service.
 * @description: Provide the url for api and routing navigation for authentication.
 * @dated: 20 Aug, 2018.
 * @modified: 29 Aug, 2018
**/
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationUrlService {
  // Login Component API Routing.
  public loginAPIRoute: any = {
    'loginPostApiRoute': '/api/authentication/login',
    'logindetailsApiRoute': '/api/authentication/logindetails'
  };

  // logout API Routing.
  public LogoutAPIRoute: any = {
    'logoutPostApiRoute': '/api/authentication/logout'
  };

  // Forgot Component API Routing.
  public ForgotPasswordAPIRoute: any = {
    'ForgotPasswordPostAPIRoute': '/api/authentication/forgot',
    'GetSecurityQuestion': '/api/authentication/getSecurityQuestion',
    'RegisterEmailId': '/api/authentication/RegisterEmailId'
  };
  public ResetPasswordAPIRoute: any = {
    'ResetPasswordPostAPIRoute': '/api/authentication/reset',
    'CheckUpdatePasswordExpireTime': '/api/authentication/CheckUpdatePasswordExpireTime'
  }
  public ForgotUsernameAPIRoute: any = {
    'ForgotUsernameAPIRoute': '/api/authentication/ForgotUsername',
  }
  public PageRoute: any = {
    'navigateToDashboardRoute': '/dashboard',
    'loginPageRoute': '/login',
    'resetPageRoute': '/reset',
    'extraServicePageRoute': '/extra-service',
    'forgotPasswordRoute': '/forgot',
    'forgotUsername': '/forgot-username',
    'resetUserName': '/reset-uername',
    'deu' : '/data-entry-unit',
    'root': '/',
  }
  public ResetUsernameAPIRoute: any = {
    'ResetUsernameAPIRoute': '/api/authentication/Resetusername',
  }
  public Modules: any = [
    { Id: 1, value: 'people' },
    { Id: 2, value: 'client' },
    { Id: 3, value: 'settings' },
    { Id: 6, value: 'comp-manager' },
    { Id: 7, value: 'report-manager' },
    { Id:13, value: 'dashboard' },
  
  ]
  constructor() { }
}

