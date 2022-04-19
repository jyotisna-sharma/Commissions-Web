import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
@Component({
  selector: 'app-setting-left-navigation',
  templateUrl: './setting-left-navigation.component.html',
  styleUrls: ['./setting-left-navigation.component.scss']
})
export class SettingLeftNavigationComponent implements OnInit {

  constructor(
    public route: Router,
    public activateRoute: ActivatedRoute,
    public getRouterparamter: GetRouteParamtersService,
  ) { }

  ngOnInit() {
    
    this.getRouterparamter.getparameterslist(this.activateRoute);
  }

}
