import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';

@Component({
  selector: 'app-client-left-navigation',
  templateUrl: './client-left-navigation.component.html',
  styleUrls: ['./client-left-navigation.component.scss']
})
export class ClientLeftNavigationComponent implements OnInit {
  routes: any;
  showloading: boolean;
  @Input() activeCount: string;
  @Input() pendingCount: string;
  @Input() inactiveCount: string;
  @Input() totalCount: string;
  @Input() zeroCount: string;
  @Output() isNavigationChanged = new EventEmitter<any>();
  userDetail: any;
  isWithOutTabShown: Boolean = false;
  // NavigationURL = {
  //   'TotalClients': '/client/clientListing/3/10/0',
  //   'ActiveClients': '/client/clientListing/0/10/0',
  //   'PendingClients': '/client/clientListing/2/10/0',
  //   'TerminatedClients': '/client/clientListing/1/10/0',
  //   'WithoutClients': '/client/clientListing/4/10/0',
  // }
  constructor(
    public activateRoute: ActivatedRoute,
    public getrouteParamters: GetRouteParamtersService,
    private router: Router
  ) {
    this.routes = router;
  }

  ngOnInit() {
    this.userDetail = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.userDetail.Role === 1 || (this.userDetail.Role === 2 && this.userDetail.IsAdmin) || this.userDetail.IsHouseAccount) {
      this.isWithOutTabShown = true;
    }
    this.showloading = true;
    this.getrouteParamters.getparameterslist(this.activateRoute);
    // this.routes.events.subscribe((event: Event) => {
    //   this.NavigateToUrl(event)
    //   this.showloading = true;
    // });
  }
  NavigateToUrl(getParams) {
    //   if (getParams instanceof NavigationStart) {
    //     if (this.NavigationURL.TotalClients === getParams.url) {
    //       this.getrouteParamters.parentTab = '3'
    //     } else if (this.NavigationURL.ActiveClients === getParams.url) {
    //       this.getrouteParamters.parentTab = '0'
    //     } else if (this.NavigationURL.PendingClients === getParams.url) {
    //       this.getrouteParamters.parentTab = '2'
    //     } else if (this.NavigationURL.TerminatedClients === getParams.url) {
    //       this.getrouteParamters.parentTab = '1'
    //     } else if (this.NavigationURL.WithoutClients === getParams.url) {
    //       this.getrouteParamters.parentTab = '4'
    //     }
    //     {
    this.isNavigationChanged.emit({ data: getParams });
    //     }

    //   }
    // }
  }
}
