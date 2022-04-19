import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service'
@Component({
  selector: 'app-payor-tool-left-navigation',
  templateUrl: './payor-tool-left-navigation.component.html',
  styleUrls: ['./payor-tool-left-navigation.component.scss']
})
export class PayorToolLeftNavigationComponent implements OnInit {

  payorId: any;
  constructor( public activatedRoute: ActivatedRoute,
    public getRouterParamater: GetRouteParamtersService,
    public route: Router) { }

  ngOnInit() {
    this.getRouterParamater.getparameterslist(this.activatedRoute);
   
 

}

}





