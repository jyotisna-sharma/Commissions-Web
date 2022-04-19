
import { AppLevelDataService } from './../_services/app-level-data.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthenticationUrlService } from '../authentication/authentication-url.service';
import { LeavePageComponent } from '../_services/dialogboxes/leave-page/leave-page.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { DashboarDataService } from '../dashboard/dashboard-data.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    // Initialization
    returntype: boolean;
    getreturntype: boolean;
    message: string;
    getResult: any;

    // Url object
    urlObject = {
        'userMapping': '/people/UserMapping',
        'AddEditAgent': '/api'
    }
    constructor(
        private router: Router,
        public accountUlr: AuthenticationUrlService,
        public dialog: MatDialog,
        public route: ActivatedRoute,
        public apdatasvc: AppLevelDataService,
        public dashboarddataservice: DashboarDataService,
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      
        this.getResult = JSON.parse(localStorage.getItem('loggedUser'));
        if (this.getResult && this.getResult.Role !== 1) {
            const permissions = [];
            let redirectToModule = '';
            this.getResult.Permissions.filter(item => {
                if (item && item.Permission === 2 || item.Permission === 1) {
                    for (const moduleNames of this.accountUlr.Modules) {
                        if (moduleNames.Id === item.Module) {
                            permissions.push(moduleNames);
                        }
                    }
                }
            });
            let isvalidURL = false;
            permissions.filter(moduledetails => {
                if (moduledetails.value === route.url[0].path || route.url[0].path === 'policy') {
                    isvalidURL = true;
                }
            });

            if (isvalidURL || route.url[0].path === 'reset-uername') { 
                if (this.apdatasvc.isRefresh) {
                    this.apdatasvc.isRefresh = false;
                    this.dashboarddataservice.DisplayDashboardData().subscribe(response => {
                        if (this.getResult.Role != 4 && !this.getResult.IsUserActiveOnweb) {
                            this.router.navigate(['/reset-uername']);
                        } else {
                            this.router.navigate([state.url]);
                        }
                        return true;
                    });
                    //   this.router.navigate([this.accountUlr.PageRoute.loginPageRoute], { queryParams: { returnUrl: state.url } });
                    // return false;
                } else {
                    return true;
                }

            } else {
                if(this.getResult.Role != 4){
                    if (!this.getResult.IsUserActiveOnweb) { // 
                        this.router.navigate(['/reset-uername']);
                    } else {
                        this.router.navigate(['/login']);
                        localStorage.removeItem('loggedUser');
                    }
                }
                else {
                    return true;
                }
            }
        } else {
            if (this.getResult) {
                if (this.apdatasvc.isRefresh) {
                    this.apdatasvc.isRefresh = false;
                    this.dashboarddataservice.DisplayDashboardData().subscribe(response => {
                        this.router.navigate([state.url]);
                        return true;
                    });
                } else {
                    return true;
                }
            }
        }
        if (this.getResult == null) {
            this.apdatasvc.isRefresh = false;
            this.router.navigate([this.accountUlr.PageRoute.loginPageRoute], { queryParams: { returnUrl: state.url } });
            return false;
        }
        // else{
        //     this.router.navigate([this.accountUlr.PageRoute.loginPageRoute], { queryParams: { returnUrl: state.url } });
        //     return false;
        // }

    }
    canDeactivate(component: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot, nextState?: RouterStateSnapshot) {

        this.getResult = JSON.parse(localStorage.getItem('loggedUser'));
        this.message = 'You have unsaved changes that will be lost if you decide to continue. ';
        ;
        if (component.buttonClicked === true ||
            (component.isleavePopupshown === true) ||
            component.isChangesInListing === false ||
            this.apdatasvc.isLeaveOrStayShown === false) {
            {
                this.apdatasvc.isLeaveOrStayShown = true;
                return true;
            }
        } else if (component.isChangesInListing === true) {
            //     this.message = 'You may loss unsaved changes on the page. Are you sure you want to leave this page? ';
            const dialogRef = this.dialog.open(LeavePageComponent, {
                width: '450px',
                data: {
                    headingTitle: 'Confirmation',
                    subTitle: this.message,
                    PrimaryButton: 'Leave this Page',
                    SecondryButton: 'Stay on this Page',
                }
            });
            return dialogRef.afterClosed();
        } else {
            const keyList = Object.getOwnPropertyNames(component);
            for (let i = 0; i < keyList.length; i++) {
                const key = keyList[i];
                if (component[key] instanceof FormGroup) {
                    // tslint:disable-next-line:max-line-length
                    if (component[key] && component[key].dirty) {
                        const dialogRef = this.dialog.open(LeavePageComponent, {
                            width: '450px',
                            data: {
                                headingTitle: 'Confirmation',
                                subTitle: this.message,
                                PrimaryButton: 'Leave this Page',
                                SecondryButton: 'Stay on this Page'
                            }
                        });
                        return dialogRef.afterClosed();
                    } else {
                        return true;
                    }
                }
            }
        }


    }
}
