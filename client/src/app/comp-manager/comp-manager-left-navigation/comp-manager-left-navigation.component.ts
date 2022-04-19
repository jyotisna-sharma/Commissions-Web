import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service'
@Component({
  selector: 'app-comp-manager-left-navigation',
  templateUrl: './comp-manager-left-navigation.component.html',
  styleUrls: ['./comp-manager-left-navigation.component.scss']
})
export class CompManagerLeftNavigationComponent implements OnInit {
  getData: any;
  constructor(
    public activateroute: ActivatedRoute,
    public router: Router,
    public getrouteParamters: GetRouteParamtersService
  ) { }
  ngOnInit() {
    this.getrouteParamters.getparameterslist(this.activateroute);
    this.getData = JSON.parse(localStorage.getItem('loggedUser'));
  }

}
