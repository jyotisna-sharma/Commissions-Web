import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
@Component({
  selector: 'app-report-manager-left-navigation',
  templateUrl: './report-manager-left-navigation.component.html',
  styleUrls: ['./report-manager-left-navigation.component.scss']
})
export class ReportManagerLeftNavigationComponent implements OnInit {

  constructor(
    public routes: Router,
    public activatedRoute: ActivatedRoute,
    public getRouterParameter: GetRouteParamtersService

  ) { }

  ngOnInit() {
    this.getRouterParameter.getparameterslist(this.activatedRoute)
  }

}
