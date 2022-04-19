import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ShowSessionPopupComponent } from '../_services/dialogboxes/show-session-popup/show-session-popup.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { GlobalConst } from '../../assets/config/CONSTANTS';
import { Router } from '@angular/router';
import { AuthenticationUrlService } from '../authentication/authentication-url.service';
@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  sessionTimeOut: number;
  showTimeOutDialogbox: number;
  timerRunning: Subscription;
  dialogRef: any;
  currentTime: any;
  getResult: any // for getting Localstorage value
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authenticateURL: AuthenticationUrlService,
  ) {
    this.sessionTimeOut = GlobalConst.sessionTimeOutTime;
    this.showTimeOutDialogbox = GlobalConst.showTimeOutDialogbox;
  }
  public setNewTimeInterval = (): void => {

    if (this.timerRunning) {
      this.timerRunning.unsubscribe();
    }
    this.timerRunning = interval(1000).subscribe(x => {
      this.getResult = JSON.parse(localStorage.getItem('loggedUser'));
      if (this.getResult) {
        if (this.getResult.RememberMe !== true) {
          if (x === this.sessionTimeOut) {
            this.sessionTimedOut(true);
          } else if (x === this.showTimeOutDialogbox) {
            setTimeout(() => {
              this.dialogRef = this.dialog.open(ShowSessionPopupComponent, {
                width: '300px',
                data: { minutes: ((this.sessionTimeOut - this.showTimeOutDialogbox) / 60) }
              });
              this.dialogRef.afterClosed().subscribe((result) => {
                if (result === false) {
                  this.timerRunning.unsubscribe();
                  this.router.navigate([this.authenticateURL.PageRoute.loginPageRoute]);
                  localStorage.clear();
                } else {
                }
              })
            }, 200);
          }
        } else {
          this.setNewTimeInterval();
        }
      }
    });
  }
  sessionTimedOut = (broadcast?): void => {
    localStorage.removeItem('loggedUser');
  }
  stopTimer() {
    this.timerRunning.unsubscribe();
  }
}
