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
export class AdminHeaderNavigationUrlService {
  // Routes For API.
  public moduleLinks: any = {
    'dashboard': '/dashboard',
    'Settings': '/settings',
    'FollowUp': '/FollowUp',
    'Report': '/report-manager',
    'Compensation': '/comp-manager',
    'Configuration': '/config-manager',
    'PayorTool': '/payor-tool',
    'DataEntryUnit': '/data-entry-unit'

  };
  constructor() { }
}
