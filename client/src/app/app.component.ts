import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AuthenticationUrlService } from './authentication/authentication-url.service';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { DashboarDataService } from './dashboard/dashboard-data.service'
import { ResponseCode } from './response.code';
import { IdleTimeoutService } from './_services/idle-timeout.service'
import { AppLevelDataService } from './_services/app-level-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  // initialization
  getResult: any;
  count: any = 1;
  constructor(
    private router: Router,
    private titleService: Title,
    private currentRoute: ActivatedRoute,
    private accountUlr: AuthenticationUrlService,
    public cookieService: CookieService,
    public dashboarddataservice: DashboarDataService,
    public idleTimeoutSvc: IdleTimeoutService,
    public applevelDataService: AppLevelDataService

  ) {

  }
  ngOnInit(): void {

    this.applevelDataService.isUserLoggedOut = false;
    this.applevelDataService.isRefresh = true;
    this.setTitle('Commission Dept');
    // this.getLoggedIn();
    this.getLoggedIn(); // check user is already logged in order to stop back navigation.
  }

  @HostListener('document:click', ['$event'])
  @HostListener('mousedown', ['$event'])
  @HostListener('mousemove', ['$event'])
  @HostListener('mouseup', ['$event'])
  @HostListener('document:keypress', ['$event'])
  @HostListener('document:keyup', ['$event'])
  @HostListener('document:keydown', ['$event'])
  @HostListener('document:remote-event', ['$event'])
  // onDocumentRemoteEvent(ev: any) {
  //   if (!localStorage.getItem('loggedUser') && this.count===1) {
  //     location.reload(true);
  //     this.count++;
  //   }
  // }
  onDocumentClick(event: MouseEvent) {
    if (localStorage.getItem('loggedUser')) {
      this.idleTimeoutSvc.setNewTimeInterval();
    }
  }
  public getLoggedIn() {
    //  /*  check if user logged in move to dashboard. */
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        const condFirst = (event.url === this.accountUlr.PageRoute.loginPageRoute); // match with login route
        const condSecond = (event.url === this.accountUlr.PageRoute.root);
        this.getResult = JSON.parse(localStorage.getItem('loggedUser'));
        if ((condFirst || condSecond)
          && localStorage.getItem('loggedUser') && (this.getResult.IsUserActiveOnweb)) { // check this is login route or root route.
          const permissions = [];
          let redirectToModule = '';
          (this.getResult || []).Permissions.filter(item => {
            if (item && item.Permission === 2 || item.Permission === 1) {
              for (const moduleNames of this.accountUlr.Modules) {
                if (moduleNames.Id === item.Module) {
                  permissions.push(moduleNames);
                }
              }
            }
          });
          permissions.filter(moduledetails => {
            if (moduledetails.value === 'client' && moduledetails.Id === 2) {
              redirectToModule = 'client';
            } else if (moduledetails.value === 'dashboard') {
              redirectToModule = 'dashboard';
            }
          });
          if (!redirectToModule && permissions[0]) {
            redirectToModule = permissions[0].value;
            if (!redirectToModule) {
              redirectToModule = '/login'
            }
          }
          this.router.navigate([redirectToModule]);
        } else if ((condFirst || condSecond) && localStorage.getItem('loggedUser')) {
          this.router.navigate([this.accountUlr.PageRoute.resetUserName])
        }
      }
    });
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
