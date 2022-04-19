/**
 * @author: Ankit.
 * @Name: admin-left-navigation-url.service.ts
 * @description: set the router link on admin left navigation.
 * @dated: 20 Aug, 2018.
 * @modified: 30 Aug, 2018
**/

import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AdminLeftNavigationUrlService {
  // Routes For API.
  public moduleLinks: any = {
    'dashboard': '/dashboard',
    'extraServiceList': '/extraService',
    'chauffeurList': '/chauffeur-unavailability',
    'accounts': '/accounts',
    'delegates': '/delegates',
    'vehicles': '/vehicles',
    'miRideProfilesList': '/profiles',
    'reports': '/reports',
    'event': '/event',
     'chauffeurs': '/chauffeurs',
    'admin': '/admin',
    'referral': '/referral',
    'promo': '/promocodes',
  };
  constructor() { }
}
