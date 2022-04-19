import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PolicyManagerValidationMessageService {
  PolicyManagerValidation: any = {
    'originalEffectiveDate': 'Please enter original effective date.',
    'trackDateNotGreaterDate': 'Track from date cannot be prior to original effective date.',
    'policyTermNotGreaterDate': 'Policy term date cannot be prior to original effective date.',
    'PolicyTermDate': 'Please enter policy term date.',
    'PolicyTermReasonId': 'Please enter policy term reason.',
    'autoTermNotGreaterDate': 'Auto term date cannot be prior to original effective date.',
    'client': 'Please enter client.',
  }
  constructor() { }
}
