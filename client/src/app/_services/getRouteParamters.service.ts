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
  ClientId: any;
  PolicyId: any;
  IsDuplicate: any;
  subChildTab: any;
  IncomingScheduleId: any;
  payorId: any;
  payorContactId: any;
  carrierId: any;
  payorName: any;
  templateId: any;
  constructor(private route: Router,
    public activateroute: ActivatedRoute) {

  }
  public getparameterslist(routeParameters: any) {
    this.childTab = routeParameters.params.value.childTab;
    this.userCredentialId = routeParameters.params.value.usercredentialId;
    this.pageIndex = routeParameters.params.value.pageIndex;
    this.pageSize = routeParameters.params.value.pageSize;
    this.parentTab = routeParameters.params.value.ParentTab;
    this.ClientId = routeParameters.params.value.ClientId;
    this.PolicyId = routeParameters.params.value.PolicyId;
    this.IsDuplicate = routeParameters.params.value.IsDuplicate;
    this.subChildTab = routeParameters.params.value.subChildTab;
    this.payorId = routeParameters.params.value.payorId;
    this.payorContactId = routeParameters.params.value.payorContactId;
    this.carrierId = routeParameters.params.value.carrierId;
    this.IncomingScheduleId = routeParameters.params.value.IncomingScheduleId;
    this.templateId = routeParameters.params.value.TemplateId;
    this.payorName = routeParameters.params.value.PayorName;
  }
}


