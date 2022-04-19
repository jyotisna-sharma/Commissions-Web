import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GetRouteParamtersService {
  userCredentialId: any;
  childTab: any;
  pageIndex: any;
  pageSize: any;
  parentTab: any;
  constructor(private route: Router,
    public activateroute: ActivatedRoute) {

  }
  public getparameterslist(routeParameters: any) {
      this.childTab = routeParameters.params.value.childTab;
      this.userCredentialId = routeParameters.params.value.usercredentialId;
      this.pageIndex = routeParameters.params.value.pageIndex;
      this.pageSize = routeParameters.params.value.pageSize;
      this.parentTab = routeParameters.params.value.ParentTab;
  }
}


