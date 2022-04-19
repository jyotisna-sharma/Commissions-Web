import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataEntryUnitService {
  isErrorListDEUEntry: Boolean = false;
  paymentPageDetails: any;
  isFirstPaymentListFetch: Boolean = true;
  postedEntryObject: any;
  buttonText: String = 'Start Edit';
  isPaymentListRefresh: Boolean = false;
  // islistFirstTimeLoad: Boolean = true;
  constructor() { }
}
