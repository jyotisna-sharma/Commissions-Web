import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationValidationMessageService {
  /* For Login component */
  LoginErrors: any = {
    'userName': '',
    'password': '',
    'account': ''
  };

  LoginValidationMessages: any = {
    'userName': {
      'required': 'Please enter your username.'
    },
    'password': {
      'required': 'Please enter your password.',
    },
    'account': {
      'notValid': 'The username or password you entered did not match our records. Please try again.',
    }
  };

  ResetValidationMessage: any = {
    'IsEmailExist': {
      'errMessage': 'email already exist'
    }
  }
  ForgotResetErrors: any = {
    'emailFormControl': ''
  };
  ForogotResetValidationMessages: any = {
    'forgotemail': {
      'required': 'Please enter your username.',
    },
    'forgotPassword': {
      'UserNamenotfoundMessage':
        'Entered username does not exist. Please ensure you have entered valid username or contact administrator.',
      'errMessage': 'Please enter Username.',
      'EmailIdAlreadyExist': 'Entered email address already exists. Please try with different email address.'
    }
  };

  ResetPasswordErrors: any = {
    'password': ''
  };
  ResetPassswordValidationMessages: any = {
    'ResetPasswrd': {
      'required': 'Please enter new password.',
      'pattern': 'Please enter valid password.'
    }
  };
  EmailValidationMessages: any = {
    'EmailValidate': {
      'required': 'Please enter your email address.',
      'pattern': 'Please enter valid email address.',
      'patterns':
        'Entered email address does not exist in our records. Please ensure you have entered valid email address or contact administrator.'
    }
  };
  ForgotUserName: any = {
    'AnswerValidate': {
      'required': 'Please enter your security answer.'
    }
  };
  constructor() { }
}
