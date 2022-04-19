import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingValidationMessageService {
  SettingValidations = {
    'Payors': 'Please select payor.',
    'Carrier': 'Please select carrier.',
    'Product': 'Please select product.',
    'ProductType': 'Please select product type.',
    'FieldsNotBlank': 'First year and renewal cannot be blank at the same time in payor schedule.',
    'RecordExist': '"Incoming Schedule" configuration already exists for the selected payor.',
    'SplitPercent': 'Split percentage cannot have 0 or blank.',
    'IncomingPaymentFieldsNotBlank': 'Please select all required fields.',
    'NamedScheduleExist':'Title already exist with same name.',
    'Title':'Please enter title.',
    'NamedScheduleFieldsNotBlank':'First year and renewal cannot be blank at the same time in named schedule.'
  }
  constructor() { }
}
