
/**
 * @author: Ankit.
 * @Name: app.module.
 * @description: facilite to routing to modules.
 * @dated: 20 Aug, 2018.
 * @modified: 29 Aug, 2018
**/

import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppLevelDataService } from './../_services/app-level-data.service';
import {
  Event as RouterEvent,
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router, ActivatedRoute
} from '@angular/router'


@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.css'],
})
export class SecureComponent implements OnInit {
  busy: Subscription;
  headerCompanySelected: string;
  loading: boolean;
  constructor(
    private router: Router,
    public appdata: AppLevelDataService
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    });
  }
  ngOnInit() {
   
  }


  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart || event instanceof GuardsCheckEnd) {
      this.loading = true;
      // // 
      // if (event.url.indexOf('policy') < -1) {
      //   this.appdata.policyAdvanceSearchResult = '';
      // }
    }
    if (event instanceof NavigationEnd ||
      event instanceof GuardsCheckStart ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError) {
      this.loading = false;
    }
  }
}
