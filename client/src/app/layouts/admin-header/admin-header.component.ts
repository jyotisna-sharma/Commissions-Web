/**
 * @author: Ankit.
 * @Name: admin-header.component.ts
 * @description: Show the menu header bar.
 * @Method count: 4.
 * @Methods:
 *  toggleVisibilityOfLeftNav()
 *  setTitle()
 *  setBackButtonTitle()
 *  showBackButton()
 * @dated: 20 Aug, 2018.
**/
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { AdminHeaderNavigationUrlService } from './admin-header-navigation-url.service';

import { CommonDataService } from '../../_services/common-data.service';
import { Guid } from 'guid-typescript';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  leftBarHidden = false;
  settingsBarHidden = true;
  companyName: string;
  LoginName: string;
  getRole: string;
  RoleName: string;
  lastLicenseeId: any;
  getData: any;
  userPermissions: any;
  selectedLicenseeDetails: any;
  getAllLicensee: any;
  private toggle: Boolean = false;
  isDashBoardShown: Boolean = false;
  isDEUSelected: Boolean = false;
  constructor(
    private router: Router,
    public appData: AppLevelDataService,
    public moduleNavObj: AdminHeaderNavigationUrlService,
    public cmnservice: CommonDataService,
    public activateRoute: ActivatedRoute,
    public dialog: MatDialog,

  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }
  ngOnInit() { // 
    this.getData = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.getData) {
      this.companyName = this.getData && this.getData['LicenseeName'];
      this.LoginName = this.getData && this.getData['UserName'];
      this.userPermissions = this.getData['Permissions'];
      this.getRole = this.GetroleName(this.getData['Role'], this.getData.IsAdmin, this.getData.IsHouseAccount);
      if (this.userPermissions[7] && (this.userPermissions[7].Permission === 2 || this.userPermissions[7].Permission === 1)) {
        this.isDashBoardShown = true;
      }
      if (this.getRole === 'Super Admin' || this.getRole === 'DEP') {
        if (!this.appData.licenseeList) {
          this.cmnservice.getLicenseeList().subscribe(response => {
            this.appData.licenseeList = response.licenseeList;
            this.getAllLicensee = response.licenseeList;
            if (this.getData.LicenseeId === Guid.createEmpty().toJSON().value) {
              this.getData.LicenseeId = this.getAllLicensee[0].LicenseeId;
              this.getData.HouseAccountDetails = this.getAllLicensee[0].HouseAccountDetails;
              this.getData.LicenseeName = this.getAllLicensee[0].LicenseeName;
              localStorage.setItem('loggedUser', JSON.stringify(this.getData));
            }
            this.companyName = this.getData.LicenseeId;
            if (this.router.url !== '/data-entry-unit') {
              this.redirectTo(this.router.url);
            }
          });
        } else {
          this.getAllLicensee = this.appData.licenseeList;
          this.companyName = this.getData.LicenseeId;
        }
          this.isDEUSelected = (this.router.url === '/data-entry-unit') ? true : false;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
  // #####################################################################################################################
  redirectTo(uri) {
    // const defaltOnSameUrlNavigation = this.router.onSameUrlNavigation;
    // this.router.onSameUrlNavigation =  this.router.onSameUrlNavigation;
    this.router.navigateByUrl(this.router.url, {
      replaceUrl: true
    });
    this.router.onSameUrlNavigation = this.router.onSameUrlNavigation;
  }
  // ######################################################################################################################
  getSelectedValue(selectedValue: string) {

    //  this.companyName = this.getData.LicenseeId;
    this.appData.isLeaveOrStayShown = false;
    this.lastLicenseeId = this.getData.LicenseeId;
    const dialogRef = this.dialog.open(ShowConfirmationComponent, {
      width: '450px',
      data: {
        headingTitle: 'Confirmation',
        // tslint:disable-next-line:max-line-length
        subTitle: 'The data will be refresh as per the selected agency. Are you sure you want to change the agency?',
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appData.policyAdvanceSearchResult = '';
        this.appData.isCompanyChanged = true;
        const redirectToRoute = this.activateRoute.url['value'][0].path;
        this.getData.LicenseeId = selectedValue;

        this.appData.licenseeList.filter(item => {
          if (item.LicenseeId === selectedValue) {
            this.getData.HouseAccountDetails = item.HouseAccountDetails;
            this.getData.LicenseeName = item.LicenseeName
          }
        });
        localStorage.setItem('loggedUser', JSON.stringify(this.getData));
        this.router.navigate([redirectToRoute]);
      }
      else {
        this.companyName = this.lastLicenseeId;
        this.appData.isLeaveOrStayShown = true;
        this.appData.licenseeList.filter(item => {
          if (item.LicenseeId === this.lastLicenseeId) {
            this.getData.LicenseeId = this.lastLicenseeId;
            this.getData.LicenseeName = item.LicenseeName
            this.getData.HouseAccountDetails = item.HouseAccountDetails;
            localStorage.setItem('loggedUser', JSON.stringify(this.getData));
          }
        });
      }
    });
  }
  // ##################################################################################################
  OnMyAccountRedirection() {
    this.router.navigate(['people/AddEditAgent', '1', '1', this.getData.UserCredentialID, '10', '0'])
  }
  // ##################################################################################################
  GetroleName(RoleId: number, IsAdmin, IsHouse) {
    switch (RoleId) {
      case 1:
        this.RoleName = 'Super Admin'
        break;
      case 2:
        if (IsAdmin) {
          this.RoleName = 'Administrator'
        } else {
          this.RoleName = 'User'
        }
        break;
      case 3:
        this.RoleName = (IsHouse) ? 'House Account' : 'Agent';
        break;
      case 4:
        this.RoleName = 'DEP'
        break;
      default:
        this.RoleName = 'test'

    }
    return this.RoleName
  }
  // ##################################################################################################
  toggleVisibilityOfLeftNav() {
    this.leftBarHidden = !this.leftBarHidden;
    if (this.leftBarHidden) {
      document.getElementsByTagName('body')[0].classList.add('hideNavBar');
      this.appData.showToolTipNav = false;
    } else {
      document.getElementsByTagName('body')[0].classList.remove('hideNavBar');
      this.appData.showToolTipNav = true;
    }
  }
  // ##################################################################################################
  setTitle(): string {
    return this.appData.titleOnHeader || 'Dashboard';
  }
  // ##################################################################################################
  setBackButtonTitle(): string {
    return this.appData.dashItemButtonTitle || 'Back to dashboard';
  }
  // ##################################################################################################
  showBackButton(): boolean {
    return (this.appData.showBackButton === 1) ? true : false; // 1 means show back button
  }
  // ##################################################################################################
  addClassOnbuttonDiv(): string {
    return (this.appData.showBackButton === 0) ? 'no-backbtn' : ''; // 1 means show back button
  }
  // ##################################################################################################
  public logout() {
    this.appData.logout();
  }
  // ##################################################################################################
}
