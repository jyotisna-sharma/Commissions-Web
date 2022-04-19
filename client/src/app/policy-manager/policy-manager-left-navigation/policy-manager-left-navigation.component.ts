import { Component, OnInit, Input, EventEmitter, Output, OnChanges, } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { SyncAsync } from '@angular/compiler/src/util';

@Component({
  selector: 'app-policy-manager-left-navigation',
  templateUrl: './policy-manager-left-navigation.component.html',
  styleUrls: ['./policy-manager-left-navigation.component.scss']
})
export class PolicyManagerLeftNavigationComponent implements OnInit, OnChanges {

  @Input() activeCount: string;
  @Input() pendingCount: string;
  @Input() inactiveCount: string;
  @Input() totalCount: string;
  @Input() isParentHeader: string;
  @Input() isTabDisabled: Boolean;
  @Input() isClientChanged: Boolean;
  isPaymentTab: Boolean = true;
  @Output() isNavigationChanged= new  EventEmitter<any>();
  routes: any;
  showloading: boolean;
  DefaultMenuShown: boolean;
  SelectedClientMenuShown: boolean;
  policyNumber: any;
  showLoader: boolean;
  isNavigationMenuShown: Boolean = true;
  NavigationURL = {
    'TotalPolicies': '/policy/policyListing/3/10/0',
    'ActivePolicies': '/policy/policyListing/0/10/0',
    'PendingPolicies': '/policy/policyListing/2/10/0',
    'TerminatedPolicies': '/policy/policyListing/1/10/0',
  }
  constructor(
    public activateRoute: ActivatedRoute,
    public getrouteParamters: GetRouteParamtersService,
    public router: Router
  ) { this.routes = router }

  ngOnInit() {
    this.showloading = true;
    this.getrouteParamters.getparameterslist(this.activateRoute);
    // this.routes.events.subscribe((event: Event) => {
    //   this.NavigateToUrl(event)
    //   this.showloading = true;
    // });
  }
  ngOnChanges() {
    if (this.isClientChanged) {
      this.getrouteParamters.parentTab = '3';
    }
  }
  NavigateToUrl() {
    // this.showLoader = true;
    // if (getParams instanceof NavigationStart) {
    //   // 
    //   if (this.NavigationURL.TotalPolicies === getParams.url) {
    //     this.getrouteParamters.parentTab = '3';
    //   } else if (this.NavigationURL.ActivePolicies === getParams.url) {
    //     this.getrouteParamters.parentTab = '0'
    //   } else if (this.NavigationURL.PendingPolicies === getParams.url) {
    //     this.getrouteParamters.parentTab = '2'
    //     // tslint:disable-next-line:max-line-length
    //   } else if (this.NavigationURL.TerminatedPolicies === getParams.url) {
    //     this.getrouteParamters.parentTab = '1'
    //   }
    //   // this.showLoader = false;
      this.isNavigationChanged.emit({ data: this.getrouteParamters.parentTab });
   // }
  }
  OnNotesRouting() {

    if (this.isTabDisabled === false) {
      this.policyNumber = localStorage.getItem('PolicyNumber')
      if (this.router.url.indexOf('advance-Search') > -1) {
        this.router.navigate(['/policy/advance-Search/PolicyNotes', this.getrouteParamters.ClientId,
          this.getrouteParamters.PolicyId, this.getrouteParamters.parentTab, 4,
          this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex])
      }
      else {
        this.router.navigate(['/policy/PolicyNotes', this.getrouteParamters.ClientId,
          this.getrouteParamters.PolicyId, this.getrouteParamters.parentTab, 4,
          this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex])
      }
    }
  }

  OnPolicyIssueClicked() {
    this.isPaymentTab = false;
  }
  OnSmartFieldCliecked() {
    if (this.isTabDisabled === false) {
      this.policyNumber = localStorage.getItem('PolicyNumber')
      if (this.router.url.indexOf('advance-Search') > -1) {
        this.router.navigate(['/policy/advance-Search/smartFields', this.getrouteParamters.ClientId,
          this.getrouteParamters.PolicyId, this.getrouteParamters.parentTab, 3,
          this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex])
      }
      else {
        this.router.navigate(['/policy/smartFields', this.getrouteParamters.ClientId,
          this.getrouteParamters.PolicyId, this.getrouteParamters.parentTab, 3,
          this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex])
      }
    }
  }

  OnDetailsRouting() {

    if (this.getrouteParamters.childTab) {
      const routeToNavigate = this.router.url.indexOf('advance-Search') > -1 ? 'policy/advance-Search/editPolicy' : '/policy/editPolicy';
      {
        this.router.navigate([routeToNavigate, this.getrouteParamters.parentTab,
          this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex,
          this.getrouteParamters.PolicyId, this.getrouteParamters.ClientId])
      }
    }
  }
  OnPaymentClicked() {
    if (this.isTabDisabled === false) {
      this.policyNumber = localStorage.getItem('PolicyNumber')

      if (this.router.url.indexOf('advance-Search') > -1) {
        this.router.navigate(['/policy/advance-Search/comm-dashboard', this.getrouteParamters.ClientId,
          this.getrouteParamters.PolicyId, this.getrouteParamters.parentTab, 2,
          this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex, 1])
      }
      else {
        this.router.navigate(['/policy/comm-dashboard', this.getrouteParamters.ClientId,
          this.getrouteParamters.PolicyId, this.getrouteParamters.parentTab, 2,
          this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex, 1])
      }
    }
  }
  onIssueClicked() {
    if (this.isTabDisabled === false) {
      this.policyNumber = localStorage.getItem('PolicyNumber')
      if (this.router.url.indexOf('advance-Search') > -1) {
        this.router.navigate(['/policy/advance-Search/policy-issues', this.getrouteParamters.ClientId,
          this.getrouteParamters.PolicyId, this.getrouteParamters.parentTab, 2,
          this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex, 2])
      }
      else {
        this.router.navigate(['/policy/policy-issues', this.getrouteParamters.ClientId,
          this.getrouteParamters.PolicyId, this.getrouteParamters.parentTab, 2,
          this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex, 2])
      }
    }
  }
}
