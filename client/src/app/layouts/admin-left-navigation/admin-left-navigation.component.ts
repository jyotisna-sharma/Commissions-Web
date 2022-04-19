/**
 * @author: Ankit.
 * @Name: admin-left-navigation-url.service.ts
 * @description: set the router link on admin left navigation.
 * @dated: 20 Aug, 2018.
 * @modified: 4 Sep, 2018
**/

// Imports
import { Component, OnInit } from '@angular/core';
import { AdminLeftNavigationUrlService } from './admin-left-navigation-url.service';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import {ToggleClassDirective} from './toggle-class.directive';

@Component({
  selector: 'app-admin-left-navigation',
  templateUrl: './admin-left-navigation.component.html',
  styleUrls: ['./admin-left-navigation.component.scss']
})
export class AdminLeftNavigationComponent  {
  // // Initialization
  // versionNo = CONSTANTS.VerionNumber; // set version number.
  // showFiller = false;
  // shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  // leftBarHidden = false;
  // settingsBarHidden = true;
  // positionOptions: TooltipPosition[] = ['right'];
  // position = new FormControl(this.positionOptions[0]);


  // constructor(
  //   private currentRoute: ActivatedRoute,
  //   public moduleNavObj: AdminLeftNavigationUrlService,
  //   public applicationlevelservices: AppLevelDataService
  // ) {
  //  }

  // ngOnInit() {
  //   // set left navigation dashbarod hidden value.
  //   this.currentRoute.data.subscribe(value => {
  //     if (value) {
  //       this.settingsBarHidden = value.settingsBarHidden;
  //     }
  //   });
  // }
  // toggleVisibilityOfSettings() {
  //   this.settingsBarHidden = !this.settingsBarHidden;
  // }

  // toggleVisibilityOfOverlay() {
  //     document.getElementsByTagName('body')[0].classList.remove('hideNavBar');
  //     this.applicationlevelservices.showToolTipNav = true;
  //   }

  // getClassForSettingsMenu() {
  //   if (this.settingsBarHidden) {
  //     return 'hideSettingsBar';
  //   } else {
  //     return 'showSettingsBar';
  //   }
  // }
  // getClassForMainMenu() {
  //   if (!this.settingsBarHidden) {
  //     return 'hideSettingsBar';
  //   } else {
  //     return 'showSettingsBar';
  //   }
  // }
}
