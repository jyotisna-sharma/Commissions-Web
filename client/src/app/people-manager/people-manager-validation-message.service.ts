import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PeopleManagerValidationMessageService {
  CreateNewAgentErrors: any =
    {
      'UserName': {
        'required': 'Please enter username.'
      },
      'Password': {
        'required': 'Please enter password.',
        'pattern': 'Please enter valid password.'
      },
      'NickName': {
        'required': 'Please enter nickname.'
      },
      'Answer':
      {
        'required': 'Please enter answer.'
      },
      'EmailValidate': {
        'required': 'Please enter email address.',
        'pattern': 'Please enter valid email address.',
        'emailIdAlreadyExist': 'Entered email address already exists. Please try with different email address.'
      },
      'questionValid': {
        'required': ' Please select question.'
      },
      'PhonenumberValid': {
        'officephonevaildate': ' Please enter valid office phone number.',
        'mobilephonevaildate': ' Please enter valid mobile number.',
        'faxphonevaildate': ' Please enter valid fax number.'
      },
      'UserAlreadyExist': { 'UserNameExist': 'Entered username already exists. Please try with different username.' },
      'Minlength': {
        'nickName': 'Nickname name must be between 3 to 50 characters long.',
        'userName': 'Username name must be between 3 to 50 characters long.',
        'password': 'Password must be between 3 to 50 characters long.',
        'answer':   'Answer must be between 3 to 50 characters long.',
        'firstName': 'First name must be between 3 to 50 characters long.',
        'lastName': 'Last name must be between 3 to 50 characters long.',
        'deUserName': 'Username name must be between 6 to 50 characters long.',
      }
    }
  constructor() { }
}
