import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, Router } from '@angular/router';
import { ShowConfirmationComponent } from './show-confirmation/show-confirmation.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TableDataSource } from '../table.datasource';

@Injectable({
  providedIn: 'root'
})
export class CanRedirectFromForm implements CanDeactivate<any> {

  constructor(public dialog: MatDialog, public router: Router) {
  }

  /**
   * @author: Ankit.
   * @description: This method stops from routing to next url when changes of form are unsaved.
   * @dated: 6 sept 2018.
   * @modified: 6 sept 2018.
   */
  canDeactivate(component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // if (component && component.submitted) {
    //   return true;
    // }
    // if (currentState !== nextState) {
    //   const cancleDialogRef = this.dialog.open(ShowConfirmationComponent);
    //   return  false;
    // }
    const keyList = Object.getOwnPropertyNames(component);
    for (let i = 0; i < keyList.length; i++) {
      const key = keyList[i];
      if (component[key] instanceof FormGroup) {
        if (component[key] && component[key].touched && component[key].dirty) {
          const cancleDialogRef = this.dialog.open(ShowConfirmationComponent);
          return cancleDialogRef.afterClosed();
        }
      }
    }
    return true
  }
}
