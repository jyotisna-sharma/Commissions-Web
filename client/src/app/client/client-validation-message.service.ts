import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientValidationMessageService {
  CreateNewClientErrors: any =
    {
      'EmailValidate':
      {
        'pattern': 'Please enter valid email address.'
      },
      'Name': {
        'required': 'Please enter name.'
      },
      'Minlength': {
        'name': ' Name must be between 3 to 100 characters long.'
      }

    }
  constructor() {

  }
}
