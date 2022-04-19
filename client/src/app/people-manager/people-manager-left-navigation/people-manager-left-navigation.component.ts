import { Component, OnInit, HostListener, OnChanges, Input } from '@angular/core';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service'
@Component({
  selector: 'app-people-manager-left-navigation',
  templateUrl: './people-manager-left-navigation.component.html',
  styleUrls: ['./people-manager-left-navigation.component.scss']
})
export class PeopleManagerLeftNavigationComponent implements OnInit, OnChanges {
  @Input() agentCount: string;
  @Input() userCount: string;
  @Input () dataEntryUserCount:string;
  childTab: any
  parentTab: any;
  parentdiv: boolean;
  childdiv: boolean;
  getUserPermissions: any;
  getUserDetails: any;
  isUserTabEnabled: Boolean = false;
  constructor(public activateroute: ActivatedRoute,
    public router: Router,
    public getrouteParamters: GetRouteParamtersService) { }

  ngOnInit() {
    
    this.getUserDetails = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.getUserDetails.UserCredentialID === this.getUserDetails.HouseAccountDetails['UserCredentialId']) {
      this.isUserTabEnabled = true;
    }
    this.getUserPermissions = this.getUserDetails.Permissions;
    this.parentdiv = true;
    this.childdiv = false;
    this.getrouteParamters.getparameterslist(this.activateroute);
    if (this.getrouteParamters.childTab) {
      this.parentdiv = false;
      this.childdiv = true;
    }
  }
  ngOnChanges() {
    this.getrouteParamters.getparameterslist(this.activateroute);
  }
}
