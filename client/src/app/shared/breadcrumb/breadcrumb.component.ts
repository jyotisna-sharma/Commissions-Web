import { Component, OnInit, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnChanges {
  @Input() showNickName: string;
  @Input() parentTab: string;
  @Input() pageName: number;
  @Input() moduleName: string;
  @Output() onPageRedirectionClick = new EventEmitter();
  parentName: string;
  dataToSend: any;
  constructor(
    public getrouteParamters: GetRouteParamtersService,
    public activateroute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnChanges() {
    this.getrouteParamters.getparameterslist(this.activateroute);
  }
  RedirectionTopage() {
    this.dataToSend = {
      'url': this.router.url,
      'parentTab': this.getrouteParamters.parentTab,
      'pageSize': this.getrouteParamters.pageSize,
      'pageIndex': this.getrouteParamters.pageIndex,
    }
    this.onPageRedirectionClick.emit({ data: this.dataToSend });
  }
}
