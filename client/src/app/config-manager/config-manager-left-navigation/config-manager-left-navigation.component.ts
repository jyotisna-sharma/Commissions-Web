import { Component, OnInit } from '@angular/core';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service'
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-config-manager-left-navigation',
  templateUrl: './config-manager-left-navigation.component.html',
  styleUrls: ['./config-manager-left-navigation.component.scss']
})
export class ConfigManagerLeftNavigationComponent implements OnInit {
  isclassActive: Boolean = false;
  constructor(

    public getRouterParamater: GetRouteParamtersService,
    public activatedRoute: ActivatedRoute,
    public route: Router
  ) { }

  ngOnInit() {
    this.getRouterParamater.getparameterslist(this.activatedRoute);
    if (this.getRouterParamater.payorId) {
      this.isclassActive = true;
    }
  }

}
